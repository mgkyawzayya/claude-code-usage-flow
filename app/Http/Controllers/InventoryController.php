<?php

namespace App\Http\Controllers;

use App\Http\Requests\StockAdjustmentRequest;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class InventoryController extends Controller
{
    public function index(Request $request): Response
    {
        // Inventory dashboard with key metrics
        $totalProducts = Product::where('user_id', auth()->id())->count();

        $lowStockCount = Product::where('user_id', auth()->id())
            ->lowStock()
            ->count();

        $outOfStockCount = Product::where('user_id', auth()->id())
            ->where('stock_quantity', 0)
            ->count();

        $totalValue = Product::where('user_id', auth()->id())
            ->selectRaw('SUM(stock_quantity * cost_price) as total_value')
            ->value('total_value') ?? 0;

        // Low stock products
        $lowStockProducts = Product::where('user_id', auth()->id())
            ->with('category')
            ->lowStock()
            ->orderBy('stock_quantity')
            ->limit(10)
            ->get();

        // Out of stock products
        $outOfStockProducts = Product::where('user_id', auth()->id())
            ->with('category')
            ->where('stock_quantity', 0)
            ->orderBy('name')
            ->limit(10)
            ->get();

        return Inertia::render('pos/inventory/index', [
            'statistics' => [
                'total_products' => $totalProducts,
                'low_stock_count' => $lowStockCount,
                'out_of_stock_count' => $outOfStockCount,
                'total_stock_value' => (float) $totalValue,
            ],
            'lowStockProducts' => $lowStockProducts,
            'outOfStockProducts' => $outOfStockProducts,
        ]);
    }

    public function movements(Request $request): Response
    {
        $query = StockMovement::where('user_id', auth()->id())
            ->with(['product', 'user', 'reference']);

        // Filter by product
        if ($request->filled('product_id')) {
            $query->where('product_id', $request->product_id);
        }

        // Filter by type
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $movements = $query->latest()->paginate(20)->withQueryString();

        $products = Product::where('user_id', auth()->id())
            ->orderBy('name')
            ->get(['id', 'name', 'sku']);

        return Inertia::render('pos/inventory/movements', [
            'movements' => $movements,
            'products' => $products,
            'filters' => $request->only(['product_id', 'type', 'date_from', 'date_to']),
        ]);
    }

    public function lowStock(): Response
    {
        $products = Product::where('user_id', auth()->id())
            ->with('category')
            ->lowStock()
            ->orderBy('stock_quantity')
            ->paginate(20);

        return Inertia::render('pos/inventory/low-stock', [
            'products' => $products,
        ]);
    }

    public function adjust(): Response
    {
        $products = Product::where('user_id', auth()->id())
            ->active()
            ->with('category')
            ->orderBy('name')
            ->get();

        return Inertia::render('pos/inventory/adjust', [
            'products' => $products,
        ]);
    }

    public function storeAdjustment(StockAdjustmentRequest $request)
    {
        $validated = $request->validated();

        try {
            DB::transaction(function () use ($validated) {
                foreach ($validated['adjustments'] as $adjustment) {
                    $product = Product::lockForUpdate()->findOrFail($adjustment['product_id']);

                    $quantityBefore = $product->stock_quantity;
                    $newQuantity = $adjustment['new_quantity'];
                    $difference = $newQuantity - $quantityBefore;

                    // Update product stock
                    $product->update(['stock_quantity' => $newQuantity]);

                    // Create stock movement
                    StockMovement::create([
                        'user_id' => auth()->id(),
                        'product_id' => $product->id,
                        'type' => 'adjustment',
                        'quantity' => $difference,
                        'quantity_before' => $quantityBefore,
                        'quantity_after' => $newQuantity,
                        'reference_type' => null,
                        'reference_id' => null,
                        'reason' => $adjustment['reason'],
                    ]);
                }
            });

            return redirect()->route('pos.inventory.index')
                ->with('success', 'Stock adjustments applied successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to adjust stock: '.$e->getMessage());
        }
    }
}
