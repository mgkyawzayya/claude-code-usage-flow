<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSaleRequest;
use App\Models\Category;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class SaleController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Sale::with('saleItems')
            ->where('user_id', auth()->id());

        // Filter by date
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by payment method
        if ($request->filled('payment_method')) {
            $query->where('payment_method', $request->payment_method);
        }

        // Search by invoice number or customer name
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('invoice_number', 'like', "%{$search}%")
                    ->orWhere('customer_name', 'like', "%{$search}%")
                    ->orWhere('customer_email', 'like', "%{$search}%");
            });
        }

        $sales = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('pos/sales/index', [
            'sales' => $sales,
            'filters' => $request->only(['date_from', 'date_to', 'status', 'payment_method', 'search']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('pos/sales/create');
    }

    public function createPos(): Response
    {
        // Load active products for POS interface
        $products = Product::where('user_id', auth()->id())
            ->active()
            ->with('category')
            ->orderBy('name')
            ->get();

        // Load categories for filtering
        $categories = Category::where('user_id', auth()->id())
            ->active()
            ->orderBy('name')
            ->get();

        return Inertia::render('pos/sales/pos', [
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    public function store(StoreSaleRequest $request)
    {
        $validated = $request->validated();

        try {
            $sale = DB::transaction(function () use ($validated) {
                // Calculate totals
                $subtotal = 0;
                foreach ($validated['items'] as $item) {
                    $subtotal += ($item['unit_price'] * $item['quantity']) - ($item['discount'] ?? 0);
                }

                $tax = $validated['tax'] ?? 0;
                $discount = $validated['discount'] ?? 0;
                $total = $subtotal + $tax - $discount;

                // Create sale
                $sale = Sale::create([
                    'user_id' => auth()->id(),
                    'invoice_number' => $validated['invoice_number'] ?? Sale::generateInvoiceNumber(),
                    'status' => $validated['status'] ?? 'completed',
                    'subtotal' => $subtotal,
                    'tax' => $tax,
                    'discount' => $discount,
                    'total' => $total,
                    'payment_method' => $validated['payment_method'],
                    'amount_paid' => $validated['amount_paid'],
                    'change' => $validated['amount_paid'] - $total,
                    'notes' => $validated['notes'] ?? null,
                    'customer_name' => $validated['customer_name'] ?? null,
                    'customer_email' => $validated['customer_email'] ?? null,
                    'customer_phone' => $validated['customer_phone'] ?? null,
                    'completed_at' => now(),
                ]);

                // Process each item
                foreach ($validated['items'] as $item) {
                    // Lock product for update to prevent race conditions
                    $product = Product::lockForUpdate()->findOrFail($item['product_id']);

                    // Validate stock if tracking inventory
                    if ($product->track_inventory && $product->stock_quantity < $item['quantity']) {
                        throw new \Exception("Insufficient stock for {$product->name}. Available: {$product->stock_quantity}, Requested: {$item['quantity']}");
                    }

                    // Calculate item totals
                    $itemSubtotal = $item['unit_price'] * $item['quantity'];
                    $itemDiscount = $item['discount'] ?? 0;
                    $itemTotal = $itemSubtotal - $itemDiscount;

                    // Create sale item
                    SaleItem::create([
                        'sale_id' => $sale->id,
                        'product_id' => $product->id,
                        'product_name' => $product->name,
                        'product_sku' => $product->sku,
                        'quantity' => $item['quantity'],
                        'unit_price' => $item['unit_price'],
                        'subtotal' => $itemSubtotal,
                        'discount' => $itemDiscount,
                        'total' => $itemTotal,
                    ]);

                    // Update stock and create movement if tracking inventory
                    if ($product->track_inventory) {
                        $quantityBefore = $product->stock_quantity;
                        $product->decrement('stock_quantity', $item['quantity']);
                        $quantityAfter = $quantityBefore - $item['quantity'];

                        StockMovement::create([
                            'user_id' => auth()->id(),
                            'product_id' => $product->id,
                            'type' => 'sale',
                            'quantity' => -$item['quantity'],
                            'quantity_before' => $quantityBefore,
                            'quantity_after' => $quantityAfter,
                            'reference_type' => Sale::class,
                            'reference_id' => $sale->id,
                            'reason' => "Sale #{$sale->invoice_number}",
                        ]);
                    }
                }

                return $sale;
            });

            return redirect()->route('pos.sales.show', $sale)
                ->with('success', "Sale #{$sale->invoice_number} created successfully.");
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', $e->getMessage());
        }
    }

    public function show(Sale $sale): Response
    {
        if ($sale->user_id !== auth()->id()) {
            abort(403);
        }

        $sale->load(['items.product.category']);

        return Inertia::render('pos/sales/show', [
            'sale' => $sale,
        ]);
    }

    public function destroy(Sale $sale)
    {
        if ($sale->user_id !== auth()->id()) {
            abort(403);
        }

        try {
            DB::transaction(function () use ($sale) {
                // Restore stock for each item
                foreach ($sale->saleItems as $item) {
                    $product = Product::lockForUpdate()->find($item->product_id);

                    if ($product && $product->track_inventory) {
                        $quantityBefore = $product->stock_quantity;
                        $product->increment('stock_quantity', $item->quantity);
                        $quantityAfter = $quantityBefore + $item->quantity;

                        // Create adjustment stock movement
                        StockMovement::create([
                            'user_id' => auth()->id(),
                            'product_id' => $product->id,
                            'type' => 'adjustment',
                            'quantity' => $item->quantity,
                            'quantity_before' => $quantityBefore,
                            'quantity_after' => $quantityAfter,
                            'reference_type' => Sale::class,
                            'reference_id' => $sale->id,
                            'reason' => "Sale #{$sale->invoice_number} voided",
                        ]);
                    }
                }

                // Soft delete the sale
                $sale->delete();
            });

            return redirect()->route('pos.sales.index')
                ->with('success', 'Sale voided successfully and stock restored.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to void sale: '.$e->getMessage());
        }
    }
}
