<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    public function definition(): array
    {
        $costPrice = fake()->randomFloat(2, 10, 100);
        $regularPrice = $costPrice * fake()->randomFloat(2, 1.3, 2.5);
        $hasSalePrice = fake()->boolean(30);

        return [
            'user_id' => \App\Models\User::factory(),
            'category_id' => \App\Models\Category::factory(),
            'sku' => strtoupper(fake()->unique()->bothify('SKU-###-???')),
            'name' => fake()->words(3, true),
            'description' => fake()->sentence(),
            'barcode' => fake()->optional()->ean13(),
            'cost_price' => $costPrice,
            'regular_price' => $regularPrice,
            'sale_price' => $hasSalePrice ? $regularPrice * 0.85 : null,
            'stock_quantity' => fake()->numberBetween(0, 500),
            'reorder_point' => 10,
            'reorder_quantity' => 20,
            'unit' => fake()->randomElement(['piece', 'kg', 'liter', 'box']),
            'image_url' => null,
            'is_active' => true,
            'track_inventory' => true,
        ];
    }

    public function lowStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock_quantity' => fake()->numberBetween(0, 8),
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
