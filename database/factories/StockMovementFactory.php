<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StockMovement>
 */
class StockMovementFactory extends Factory
{
    public function definition(): array
    {
        $quantity = fake()->numberBetween(-50, 50);
        $quantityBefore = fake()->numberBetween(0, 200);
        $quantityAfter = $quantityBefore + $quantity;

        return [
            'user_id' => User::factory(),
            'product_id' => Product::factory(),
            'type' => fake()->randomElement(['sale', 'purchase', 'adjustment', 'return']),
            'quantity' => $quantity,
            'quantity_before' => $quantityBefore,
            'quantity_after' => $quantityAfter,
            'reference_type' => null,
            'reference_id' => null,
            'reason' => fake()->sentence(),
        ];
    }
}
