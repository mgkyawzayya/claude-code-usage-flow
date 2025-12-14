<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Product::with('category')
            ->where('user_id', auth()->id());

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhere('barcode', 'like', "%{$search}%");
            });
        }

        // Filter by category
        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }

        // Filter by stock status
        if ($request->filled('stock_status')) {
            switch ($request->stock_status) {
                case 'low':
                    $query->lowStock();
                    break;
                case 'out':
                    $query->where('stock_quantity', 0);
                    break;
                case 'in-stock':
                    $query->where('stock_quantity', '>', 0);
                    break;
            }
        }

        // Sort
        $sortField = $request->get('sort', 'name');
        $sortDirection = $request->get('direction', 'asc');
        $query->orderBy($sortField, $sortDirection);

        $products = $query->paginate(15)->withQueryString();

        $categories = Category::where('user_id', auth()->id())
            ->active()
            ->orderBy('name')
            ->get();

        return Inertia::render('pos/products/index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category', 'stock_status', 'sort', 'direction']),
        ]);
    }

    public function create(): Response
    {
        $categories = Category::where('user_id', auth()->id())
            ->active()
            ->orderBy('name')
            ->get();

        return Inertia::render('pos/products/create', [
            'categories' => $categories,
        ]);
    }

    public function store(StoreProductRequest $request)
    {
        $validated = $request->validated();
        $validated['user_id'] = auth()->id();

        Product::create($validated);

        return redirect()->route('pos.products.index')
            ->with('success', 'Product created successfully.');
    }

    public function show(Product $product): Response
    {
        if ($product->user_id !== auth()->id()) {
            abort(403);
        }

        $product->load('category');

        $stockMovements = $product->stockMovements()
            ->with(['user', 'reference'])
            ->latest()
            ->limit(50)
            ->get();

        return Inertia::render('pos/products/show', [
            'product' => $product,
            'stockMovements' => $stockMovements,
        ]);
    }

    public function edit(Product $product): Response
    {
        if ($product->user_id !== auth()->id()) {
            abort(403);
        }

        $categories = Category::where('user_id', auth()->id())
            ->active()
            ->orderBy('name')
            ->get();

        return Inertia::render('pos/products/edit', [
            'product' => $product,
            'categories' => $categories,
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        if ($product->user_id !== auth()->id()) {
            abort(403);
        }

        $product->update($request->validated());

        return redirect()->route('pos.products.index')
            ->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        if ($product->user_id !== auth()->id()) {
            abort(403);
        }

        $product->delete();

        return redirect()->route('pos.products.index')
            ->with('success', 'Product deleted successfully.');
    }
}
