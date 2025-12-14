<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class POSSeeder extends Seeder
{
    public function run(): void
    {
        $user = \App\Models\User::first() ?? \App\Models\User::factory()->create([
            'name' => 'POS Admin',
            'email' => 'admin@pos.test',
        ]);

        $categories = \App\Models\Category::factory()->count(10)->create([
            'user_id' => $user->id,
        ]);

        $mainCategories = $categories->take(5);
        $categories->skip(5)->each(function ($category) use ($mainCategories) {
            $category->update([
                'parent_id' => $mainCategories->random()->id,
            ]);
        });

        $suppliers = \App\Models\Supplier::factory()->count(5)->create([
            'user_id' => $user->id,
        ]);

        $products = \App\Models\Product::factory()->count(50)->create([
            'user_id' => $user->id,
            'category_id' => $categories->random()->id,
        ]);

        \App\Models\Product::factory()->count(5)->lowStock()->create([
            'user_id' => $user->id,
            'category_id' => $categories->random()->id,
        ]);

        $products->take(30)->each(function ($product) use ($suppliers) {
            $product->suppliers()->attach($suppliers->random()->id, [
                'supplier_price' => $product->cost_price * 0.9,
                'lead_time_days' => fake()->numberBetween(3, 14),
                'is_preferred' => fake()->boolean(20),
            ]);
        });

        $this->command->info('POS sample data created successfully!');
        $this->command->info("User: {$user->email} (password: password)");
        $this->command->info('Categories: 10 | Products: 55 | Suppliers: 5');
    }
}
