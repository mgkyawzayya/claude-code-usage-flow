<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAdminRequest;
use App\Http\Requests\Admin\UpdateAdminRequest;
use App\Models\Admin;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class AdminController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Admin::with('roles');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $admins = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('admin/admins/index', [
            'admins' => $admins,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        $roles = Role::where('guard_name', 'admin')->get();

        return Inertia::render('admin/admins/create', [
            'roles' => $roles,
        ]);
    }

    public function store(StoreAdminRequest $request): RedirectResponse
    {
        $admin = Admin::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'password' => bcrypt($request->input('password')),
        ]);

        if ($request->filled('roles')) {
            $admin->syncRoles($request->input('roles'));
        }

        return to_route('admin.admins.index')
            ->with('success', 'Admin created successfully.');
    }

    public function edit(Admin $admin): Response
    {
        $roles = Role::where('guard_name', 'admin')->get();

        return Inertia::render('admin/admins/edit', [
            'admin' => $admin->load('roles'),
            'roles' => $roles,
        ]);
    }

    public function update(UpdateAdminRequest $request, Admin $admin): RedirectResponse
    {
        $admin->update([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
        ]);

        if ($request->filled('password')) {
            $admin->update([
                'password' => bcrypt($request->input('password')),
            ]);
        }

        if ($request->filled('roles')) {
            $admin->syncRoles($request->input('roles'));
        }

        return to_route('admin.admins.index')
            ->with('success', 'Admin updated successfully.');
    }

    public function destroy(Admin $admin): RedirectResponse
    {
        // Prevent self-deletion
        if ($admin->id === auth('admin')->id()) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        $admin->delete();

        return to_route('admin.admins.index')
            ->with('success', 'Admin deleted successfully.');
    }
}
