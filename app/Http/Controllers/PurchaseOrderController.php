<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePurchaseOrderRequest;
use App\Http\Requests\UpdatePurchaseOrderRequest;
use App\Models\Product;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\StockMovement;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PurchaseOrderController extends Controller
{
    public function index(Request $request): Response
    {
        $query = PurchaseOrder::with(['supplier', 'items'])
            ->where('user_id', auth()->id());

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by supplier
        if ($request->filled('supplier_id')) {
            $query->where('supplier_id', $request->supplier_id);
        }

        // Filter by date
        if ($request->filled('date_from')) {
            $query->whereDate('order_date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('order_date', '<=', $request->date_to);
        }

        $purchaseOrders = $query->latest('order_date')->paginate(15)->withQueryString();

        $suppliers = Supplier::where('user_id', auth()->id())
            ->active()
            ->orderBy('name')
            ->get();

        return Inertia::render('pos/purchase-orders/index', [
            'purchaseOrders' => $purchaseOrders,
            'suppliers' => $suppliers,
            'filters' => $request->only(['status', 'supplier_id', 'date_from', 'date_to']),
        ]);
    }

    public function create(): Response
    {
        $suppliers = Supplier::where('user_id', auth()->id())
            ->active()
            ->orderBy('name')
            ->get();

        $products = Product::where('user_id', auth()->id())
            ->active()
            ->with('category')
            ->orderBy('name')
            ->get();

        return Inertia::render('pos/purchase-orders/create', [
            'suppliers' => $suppliers,
            'products' => $products,
        ]);
    }

    public function store(StorePurchaseOrderRequest $request)
    {
        $validated = $request->validated();

        try {
            $purchaseOrder = DB::transaction(function () use ($validated) {
                // Calculate total
                $total = 0;
                foreach ($validated['items'] as $item) {
                    $total += $item['unit_cost'] * $item['quantity_ordered'];
                }

                // Create purchase order
                $purchaseOrder = PurchaseOrder::create([
                    'user_id' => auth()->id(),
                    'supplier_id' => $validated['supplier_id'],
                    'po_number' => $validated['po_number'] ?? PurchaseOrder::generatePoNumber(),
                    'status' => 'draft',
                    'total' => $total,
                    'order_date' => $validated['order_date'],
                    'expected_date' => $validated['expected_date'] ?? null,
                    'notes' => $validated['notes'] ?? null,
                ]);

                // Create items
                foreach ($validated['items'] as $item) {
                    PurchaseOrderItem::create([
                        'purchase_order_id' => $purchaseOrder->id,
                        'product_id' => $item['product_id'],
                        'quantity_ordered' => $item['quantity_ordered'],
                        'quantity_received' => 0,
                        'unit_cost' => $item['unit_cost'],
                        'total' => $item['unit_cost'] * $item['quantity_ordered'],
                    ]);
                }

                return $purchaseOrder;
            });

            return redirect()->route('pos.purchase-orders.show', $purchaseOrder)
                ->with('success', "Purchase order #{$purchaseOrder->po_number} created successfully.");
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to create purchase order: '.$e->getMessage());
        }
    }

    public function show(PurchaseOrder $purchaseOrder): Response
    {
        if ($purchaseOrder->user_id !== auth()->id()) {
            abort(403);
        }

        $purchaseOrder->load(['supplier', 'items.product.category']);

        return Inertia::render('pos/purchase-orders/show', [
            'purchaseOrder' => $purchaseOrder,
        ]);
    }

    public function edit(PurchaseOrder $purchaseOrder): Response
    {
        if ($purchaseOrder->user_id !== auth()->id()) {
            abort(403);
        }

        // Only allow editing draft POs
        if ($purchaseOrder->status !== 'draft') {
            return redirect()->route('pos.purchase-orders.show', $purchaseOrder)
                ->with('error', 'Only draft purchase orders can be edited.');
        }

        $suppliers = Supplier::where('user_id', auth()->id())
            ->active()
            ->orderBy('name')
            ->get();

        $products = Product::where('user_id', auth()->id())
            ->active()
            ->with('category')
            ->orderBy('name')
            ->get();

        $purchaseOrder->load('items.product');

        return Inertia::render('pos/purchase-orders/edit', [
            'purchaseOrder' => $purchaseOrder,
            'suppliers' => $suppliers,
            'products' => $products,
        ]);
    }

    public function update(UpdatePurchaseOrderRequest $request, PurchaseOrder $purchaseOrder)
    {
        if ($purchaseOrder->user_id !== auth()->id()) {
            abort(403);
        }

        // Only allow updating draft POs
        if ($purchaseOrder->status !== 'draft') {
            return redirect()->route('pos.purchase-orders.show', $purchaseOrder)
                ->with('error', 'Only draft purchase orders can be updated.');
        }

        $validated = $request->validated();

        try {
            DB::transaction(function () use ($purchaseOrder, $validated) {
                // Calculate total
                $total = 0;
                foreach ($validated['items'] as $item) {
                    $total += $item['unit_cost'] * $item['quantity_ordered'];
                }

                // Update purchase order
                $purchaseOrder->update([
                    'supplier_id' => $validated['supplier_id'],
                    'total' => $total,
                    'order_date' => $validated['order_date'],
                    'expected_date' => $validated['expected_date'] ?? null,
                    'notes' => $validated['notes'] ?? null,
                ]);

                // Delete existing items and create new ones
                $purchaseOrder->items()->delete();

                foreach ($validated['items'] as $item) {
                    PurchaseOrderItem::create([
                        'purchase_order_id' => $purchaseOrder->id,
                        'product_id' => $item['product_id'],
                        'quantity_ordered' => $item['quantity_ordered'],
                        'quantity_received' => 0,
                        'unit_cost' => $item['unit_cost'],
                        'total' => $item['unit_cost'] * $item['quantity_ordered'],
                    ]);
                }
            });

            return redirect()->route('pos.purchase-orders.show', $purchaseOrder)
                ->with('success', 'Purchase order updated successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to update purchase order: '.$e->getMessage());
        }
    }

    public function destroy(PurchaseOrder $purchaseOrder)
    {
        if ($purchaseOrder->user_id !== auth()->id()) {
            abort(403);
        }

        // Only allow deleting draft POs
        if ($purchaseOrder->status !== 'draft') {
            return redirect()->route('pos.purchase-orders.index')
                ->with('error', 'Only draft purchase orders can be deleted.');
        }

        $purchaseOrder->delete();

        return redirect()->route('pos.purchase-orders.index')
            ->with('success', 'Purchase order deleted successfully.');
    }

    public function send(PurchaseOrder $purchaseOrder)
    {
        if ($purchaseOrder->user_id !== auth()->id()) {
            abort(403);
        }

        if ($purchaseOrder->status !== 'draft') {
            return redirect()->back()
                ->with('error', 'Only draft purchase orders can be sent.');
        }

        $purchaseOrder->update(['status' => 'sent']);

        return redirect()->route('pos.purchase-orders.show', $purchaseOrder)
            ->with('success', 'Purchase order sent successfully.');
    }

    public function receive(PurchaseOrder $purchaseOrder)
    {
        if ($purchaseOrder->user_id !== auth()->id()) {
            abort(403);
        }

        if ($purchaseOrder->status === 'received') {
            return redirect()->back()
                ->with('error', 'This purchase order has already been received.');
        }

        try {
            DB::transaction(function () use ($purchaseOrder) {
                // Update each item and increase stock
                foreach ($purchaseOrder->items as $item) {
                    $product = Product::lockForUpdate()->findOrFail($item->product_id);

                    $quantityToReceive = $item->quantity_ordered - $item->quantity_received;

                    if ($quantityToReceive > 0) {
                        // Update item
                        $item->update(['quantity_received' => $item->quantity_ordered]);

                        // Update product stock
                        if ($product->track_inventory) {
                            $quantityBefore = $product->stock_quantity;
                            $product->increment('stock_quantity', $quantityToReceive);
                            $quantityAfter = $quantityBefore + $quantityToReceive;

                            // Create stock movement
                            StockMovement::create([
                                'user_id' => auth()->id(),
                                'product_id' => $product->id,
                                'type' => 'purchase',
                                'quantity' => $quantityToReceive,
                                'quantity_before' => $quantityBefore,
                                'quantity_after' => $quantityAfter,
                                'reference_type' => PurchaseOrder::class,
                                'reference_id' => $purchaseOrder->id,
                                'reason' => "Purchase order #{$purchaseOrder->po_number} received",
                            ]);
                        }
                    }
                }

                // Update purchase order status
                $purchaseOrder->update([
                    'status' => 'received',
                    'received_date' => now(),
                ]);
            });

            return redirect()->route('pos.purchase-orders.show', $purchaseOrder)
                ->with('success', 'Purchase order received successfully and stock updated.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to receive purchase order: '.$e->getMessage());
        }
    }
}
