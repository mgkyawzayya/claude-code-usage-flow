<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function sales(Request $request): Response
    {
        $dateFrom = $request->get('date_from', now()->startOfMonth()->toDateString());
        $dateTo = $request->get('date_to', now()->toDateString());
        $groupBy = $request->get('group_by', 'day');

        // Include the full end date by appending end of day time
        $dateToEnd = $dateTo.' 23:59:59';

        // Sales summary
        $salesSummary = Sale::where('user_id', auth()->id())
            ->where('status', 'completed')
            ->whereBetween('created_at', [$dateFrom, $dateToEnd])
            ->selectRaw('
                COUNT(*) as total_sales,
                COALESCE(SUM(subtotal), 0) as total_subtotal,
                COALESCE(SUM(tax), 0) as total_tax,
                COALESCE(SUM(discount), 0) as total_discount,
                COALESCE(SUM(total), 0) as total_revenue
            ')
            ->first();

        // Sales by period (grouped by day, week, or month)
        $salesByPeriod = Sale::where('user_id', auth()->id())
            ->where('status', 'completed')
            ->whereBetween('created_at', [$dateFrom, $dateToEnd])
            ->selectRaw($this->getGroupBySelect($groupBy).', COUNT(*) as count, SUM(total) as revenue')
            ->groupBy('period')
            ->orderBy('period')
            ->get();

        // Sales by payment method
        $salesByPaymentMethod = Sale::where('user_id', auth()->id())
            ->where('status', 'completed')
            ->whereBetween('created_at', [$dateFrom, $dateToEnd])
            ->selectRaw('payment_method, COUNT(*) as count, SUM(total) as revenue')
            ->groupBy('payment_method')
            ->get();

        // Top selling products
        $topProducts = SaleItem::whereHas('sale', function ($query) use ($dateFrom, $dateToEnd) {
            $query->where('user_id', auth()->id())
                ->where('status', 'completed')
                ->whereBetween('created_at', [$dateFrom, $dateToEnd]);
        })
            ->with('product')
            ->selectRaw('product_id, SUM(quantity) as total_quantity, SUM(total) as total_revenue')
            ->groupBy('product_id')
            ->orderByDesc('total_quantity')
            ->limit(10)
            ->get();

        return Inertia::render('pos/reports/sales', [
            'salesSummary' => $salesSummary,
            'salesByPeriod' => $salesByPeriod,
            'salesByPaymentMethod' => $salesByPaymentMethod,
            'topProducts' => $topProducts,
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
                'group_by' => $groupBy,
            ],
        ]);
    }

    public function inventory(): Response
    {
        // Current inventory status
        $inventoryStats = Product::where('user_id', auth()->id())
            ->selectRaw('
                COUNT(*) as total_products,
                SUM(stock_quantity) as total_units,
                SUM(stock_quantity * cost_price) as total_cost_value,
                SUM(stock_quantity * regular_price) as total_retail_value
            ')
            ->first();

        // Low stock products
        $lowStockProducts = Product::where('user_id', auth()->id())
            ->with('category')
            ->lowStock()
            ->orderBy('stock_quantity')
            ->limit(20)
            ->get();

        // Out of stock products
        $outOfStockProducts = Product::where('user_id', auth()->id())
            ->with('category')
            ->where('stock_quantity', 0)
            ->orderBy('name')
            ->limit(20)
            ->get();

        // Inventory by category
        $inventoryByCategory = Product::where('user_id', auth()->id())
            ->with('category')
            ->selectRaw('category_id, COUNT(*) as product_count, SUM(stock_quantity) as total_quantity, SUM(stock_quantity * cost_price) as total_value')
            ->groupBy('category_id')
            ->get();

        return Inertia::render('pos/reports/inventory', [
            'inventoryStats' => $inventoryStats,
            'lowStockProducts' => $lowStockProducts,
            'outOfStockProducts' => $outOfStockProducts,
            'inventoryByCategory' => $inventoryByCategory,
        ]);
    }

    public function products(Request $request): Response
    {
        $dateFrom = $request->get('date_from', now()->startOfMonth()->toDateString());
        $dateTo = $request->get('date_to', now()->toDateString());

        // Include the full end date by appending end of day time
        $dateToEnd = $dateTo.' 23:59:59';

        // Product performance
        $productPerformance = SaleItem::whereHas('sale', function ($query) use ($dateFrom, $dateToEnd) {
            $query->where('user_id', auth()->id())
                ->where('status', 'completed')
                ->whereBetween('created_at', [$dateFrom, $dateToEnd]);
        })
            ->with('product.category')
            ->selectRaw('
                product_id,
                SUM(quantity) as total_quantity,
                SUM(total) as total_revenue,
                COUNT(DISTINCT sale_id) as times_sold,
                AVG(unit_price) as avg_price
            ')
            ->groupBy('product_id')
            ->orderByDesc('total_revenue')
            ->paginate(20);

        // Best sellers (by quantity)
        $bestSellers = SaleItem::whereHas('sale', function ($query) use ($dateFrom, $dateToEnd) {
            $query->where('user_id', auth()->id())
                ->where('status', 'completed')
                ->whereBetween('created_at', [$dateFrom, $dateToEnd]);
        })
            ->with('product')
            ->selectRaw('product_id, SUM(quantity) as total_quantity')
            ->groupBy('product_id')
            ->orderByDesc('total_quantity')
            ->limit(10)
            ->get();

        // Products with no sales
        $noSalesProducts = Product::where('user_id', auth()->id())
            ->with('category')
            ->whereDoesntHave('saleItems', function ($query) use ($dateFrom, $dateToEnd) {
                $query->whereHas('sale', function ($q) use ($dateFrom, $dateToEnd) {
                    $q->where('status', 'completed')
                        ->whereBetween('created_at', [$dateFrom, $dateToEnd]);
                });
            })
            ->limit(20)
            ->get();

        return Inertia::render('pos/reports/products', [
            'productPerformance' => $productPerformance,
            'bestSellers' => $bestSellers,
            'noSalesProducts' => $noSalesProducts,
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
        ]);
    }

    private function getGroupBySelect(string $groupBy): string
    {
        // Use SQLite-compatible strftime function
        return match ($groupBy) {
            'week' => "strftime('%Y-%W', created_at) as period",
            'month' => "strftime('%Y-%m', created_at) as period",
            default => "strftime('%Y-%m-%d', created_at) as period",
        };
    }
}
