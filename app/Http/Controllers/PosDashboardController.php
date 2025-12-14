<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Sale;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PosDashboardController extends Controller
{
    public function index(): Response
    {
        $userId = auth()->id();

        // Today's sales statistics
        $todaySales = Sale::where('user_id', $userId)
            ->whereDate('created_at', today())
            ->count();

        $todayRevenue = Sale::where('user_id', $userId)
            ->whereDate('created_at', today())
            ->sum('total') ?? 0;

        // Total products
        $totalProducts = Product::where('user_id', $userId)->count();

        // Total stock value
        $totalStockValue = Product::where('user_id', $userId)
            ->selectRaw('SUM(stock_quantity * cost_price) as total_value')
            ->value('total_value') ?? 0;

        // Low stock count
        $lowStockCount = Product::where('user_id', $userId)
            ->lowStock()
            ->count();

        // Out of stock count
        $outOfStockCount = Product::where('user_id', $userId)
            ->where('stock_quantity', 0)
            ->count();

        // Total sales and revenue
        $totalSales = Sale::where('user_id', $userId)->count();
        $totalRevenue = Sale::where('user_id', $userId)->sum('total') ?? 0;

        // Low stock products
        $lowStockProducts = Product::where('user_id', $userId)
            ->lowStock()
            ->orderBy('stock_quantity')
            ->limit(5)
            ->get();

        // Recent sales
        $recentSales = Sale::where('user_id', $userId)
            ->with('items')
            ->latest()
            ->limit(5)
            ->get();

        return Inertia::render('pos/dashboard', [
            'statistics' => [
                'today_sales' => $todaySales,
                'today_revenue' => (float) $todayRevenue,
                'total_products' => $totalProducts,
                'total_stock_value' => (float) $totalStockValue,
                'low_stock_count' => $lowStockCount,
                'out_of_stock_count' => $outOfStockCount,
                'total_sales' => $totalSales,
                'total_revenue' => (float) $totalRevenue,
            ],
            'lowStockProducts' => $lowStockProducts,
            'recentSales' => $recentSales,
        ]);
    }
}
