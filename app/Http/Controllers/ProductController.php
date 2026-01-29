<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Product::with('category')
            ->forUser(auth()->id());

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhere('barcode', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }

        if ($request->filled('stock_status')) {
            match ($request->stock_status) {
                'low' => $query->lowStock(),
                'out' => $query->where('stock_quantity', 0),
                'in-stock' => $query->where('stock_quantity', '>', 0),
                default => null,
            };
        }

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

    public function store(StoreProductRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['user_id'] = auth()->id();

        Product::create($validated);

        return redirect()->route('pos.products.index')
            ->with('success', 'Product created successfully.');
    }

    public function show(Product $product): Response
    {
        // Authorization handled by resolveRouteBinding in Product model
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
        $categories = Category::where('user_id', auth()->id())
            ->active()
            ->orderBy('name')
            ->get();

        return Inertia::render('pos/products/edit', [
            'product' => $product,
            'categories' => $categories,
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $product->update($request->validated());

        return redirect()->route('pos.products.index')
            ->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();

        return redirect()->route('pos.products.index')
            ->with('success', 'Product deleted successfully.');
    }
}
