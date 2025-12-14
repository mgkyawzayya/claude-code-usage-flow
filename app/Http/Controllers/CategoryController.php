<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Category::where('user_id', auth()->id())
            ->with(['parent', 'children'])
            ->withCount('products');

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $categories = $query->orderBy('name')->paginate(20)->withQueryString();

        return Inertia::render('pos/categories/index', [
            'categories' => $categories,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        $parentCategories = Category::where('user_id', auth()->id())
            ->whereNull('parent_id')
            ->active()
            ->orderBy('name')
            ->get();

        return Inertia::render('pos/categories/create', [
            'parentCategories' => $parentCategories,
        ]);
    }

    public function store(StoreCategoryRequest $request)
    {
        $validated = $request->validated();
        $validated['user_id'] = auth()->id();

        Category::create($validated);

        return redirect()->route('pos.categories.index')
            ->with('success', 'Category created successfully.');
    }

    public function show(Category $category): Response
    {
        if ($category->user_id !== auth()->id()) {
            abort(403);
        }

        $category->load([
            'parent',
            'children',
            'products' => function ($query) {
                $query->with('category')
                    ->orderBy('name')
                    ->paginate(20);
            },
        ]);

        return Inertia::render('pos/categories/show', [
            'category' => $category,
        ]);
    }

    public function edit(Category $category): Response
    {
        if ($category->user_id !== auth()->id()) {
            abort(403);
        }

        $parentCategories = Category::where('user_id', auth()->id())
            ->whereNull('parent_id')
            ->where('id', '!=', $category->id)
            ->active()
            ->orderBy('name')
            ->get();

        return Inertia::render('pos/categories/edit', [
            'category' => $category,
            'parentCategories' => $parentCategories,
        ]);
    }

    public function update(UpdateCategoryRequest $request, Category $category)
    {
        if ($category->user_id !== auth()->id()) {
            abort(403);
        }

        $category->update($request->validated());

        return redirect()->route('pos.categories.index')
            ->with('success', 'Category updated successfully.');
    }

    public function destroy(Category $category)
    {
        if ($category->user_id !== auth()->id()) {
            abort(403);
        }

        // Check if category has products
        if ($category->products()->count() > 0) {
            return redirect()->route('pos.categories.index')
                ->with('error', 'Cannot delete category with products. Please reassign or delete products first.');
        }

        // Check if category has children
        if ($category->children()->count() > 0) {
            return redirect()->route('pos.categories.index')
                ->with('error', 'Cannot delete category with subcategories. Please delete subcategories first.');
        }

        $category->delete();

        return redirect()->route('pos.categories.index')
            ->with('success', 'Category deleted successfully.');
    }
}
