<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\PosDashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PurchaseOrderController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\SupplierController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->prefix('pos')->name('pos.')->group(function () {

    // Dashboard
    Route::get('/', [PosDashboardController::class, 'index'])->name('dashboard');

    // Products
    Route::resource('products', ProductController::class);

    // Categories
    Route::resource('categories', CategoryController::class);

    // Suppliers
    Route::resource('suppliers', SupplierController::class);

    // Sales
    Route::get('sales/pos', [SaleController::class, 'createPos'])->name('sales.pos');
    Route::resource('sales', SaleController::class)->except(['edit', 'update']);

    // Purchase Orders
    Route::resource('purchase-orders', PurchaseOrderController::class);
    Route::post('purchase-orders/{purchaseOrder}/receive', [PurchaseOrderController::class, 'receive'])->name('purchase-orders.receive');
    Route::post('purchase-orders/{purchaseOrder}/send', [PurchaseOrderController::class, 'send'])->name('purchase-orders.send');

    // Inventory
    Route::prefix('inventory')->name('inventory.')->group(function () {
        Route::get('/', [InventoryController::class, 'index'])->name('index');
        Route::get('movements', [InventoryController::class, 'movements'])->name('movements');
        Route::get('low-stock', [InventoryController::class, 'lowStock'])->name('low-stock');
        Route::get('adjust', [InventoryController::class, 'adjust'])->name('adjust');
        Route::post('adjust', [InventoryController::class, 'storeAdjustment'])->name('adjust.store');
    });

    // Reports
    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('sales', [ReportController::class, 'sales'])->name('sales');
        Route::get('inventory', [ReportController::class, 'inventory'])->name('inventory');
        Route::get('products', [ReportController::class, 'products'])->name('products');
    });
});
