<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSupplierRequest;
use App\Http\Requests\UpdateSupplierRequest;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SupplierController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Supplier::where('user_id', auth()->id());

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('contact_person', 'like', "%{$search}%");
            });
        }

        $suppliers = $query->orderBy('name')->paginate(15)->withQueryString();

        return Inertia::render('pos/suppliers/index', [
            'suppliers' => $suppliers,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('pos/suppliers/create');
    }

    public function store(StoreSupplierRequest $request)
    {
        $validated = $request->validated();
        $validated['user_id'] = auth()->id();

        Supplier::create($validated);

        return redirect()->route('pos.suppliers.index')
            ->with('success', 'Supplier created successfully.');
    }

    public function show(Supplier $supplier): Response
    {
        if ($supplier->user_id !== auth()->id()) {
            abort(403);
        }

        $supplier->load([
            'products' => function ($query) {
                $query->with('category')
                    ->orderBy('name')
                    ->limit(50);
            },
            'purchaseOrders' => function ($query) {
                $query->latest()
                    ->limit(20);
            },
        ]);

        return Inertia::render('pos/suppliers/show', [
            'supplier' => $supplier,
            'products' => $supplier->products,
            'purchaseOrders' => $supplier->purchaseOrders,
        ]);
    }

    public function edit(Supplier $supplier): Response
    {
        if ($supplier->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('pos/suppliers/edit', [
            'supplier' => $supplier,
        ]);
    }

    public function update(UpdateSupplierRequest $request, Supplier $supplier)
    {
        if ($supplier->user_id !== auth()->id()) {
            abort(403);
        }

        $supplier->update($request->validated());

        return redirect()->route('pos.suppliers.index')
            ->with('success', 'Supplier updated successfully.');
    }

    public function destroy(Supplier $supplier)
    {
        if ($supplier->user_id !== auth()->id()) {
            abort(403);
        }

        $supplier->delete();

        return redirect()->route('pos.suppliers.index')
            ->with('success', 'Supplier deleted successfully.');
    }
}
