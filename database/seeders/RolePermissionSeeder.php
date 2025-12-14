<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Define permission resources and their CRUD operations
        $resources = [
            'users',
            'admins',
            'roles',
            'permissions',
            'contacts',
            'companies',
            'deals',
            'activities',
        ];

        $operations = ['create', 'read', 'update', 'delete'];

        // Create permissions for each resource
        $permissions = [];
        foreach ($resources as $resource) {
            foreach ($operations as $operation) {
                $permissionName = "{$resource}.{$operation}";
                $permissions[] = Permission::create([
                    'name' => $permissionName,
                    'guard_name' => 'admin',
                ]);
            }
        }

        // Create roles
        $superAdmin = Role::create([
            'name' => 'Super Admin',
            'guard_name' => 'admin',
        ]);

        $admin = Role::create([
            'name' => 'Admin',
            'guard_name' => 'admin',
        ]);

        $manager = Role::create([
            'name' => 'Manager',
            'guard_name' => 'admin',
        ]);

        // Assign all permissions to Super Admin
        $superAdmin->givePermissionTo(Permission::all());

        // Assign most permissions to Admin (except roles and permissions management)
        $adminPermissions = Permission::where('name', 'not like', 'roles.%')
            ->where('name', 'not like', 'permissions.%')
            ->get();
        $admin->givePermissionTo($adminPermissions);

        // Assign limited permissions to Manager (read-only for most, CRUD for CRM)
        $managerPermissions = Permission::whereIn('name', [
            'users.read',
            'admins.read',
            'contacts.create',
            'contacts.read',
            'contacts.update',
            'contacts.delete',
            'companies.create',
            'companies.read',
            'companies.update',
            'companies.delete',
            'deals.create',
            'deals.read',
            'deals.update',
            'deals.delete',
            'activities.create',
            'activities.read',
            'activities.update',
            'activities.delete',
        ])->get();
        $manager->givePermissionTo($managerPermissions);
    }
}
