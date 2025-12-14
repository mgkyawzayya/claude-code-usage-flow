<?php

namespace Database\Factories;

use App\Models\Supplier;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PurchaseOrder>
 */
class PurchaseOrderFactory extends Factory
{
    public function definition(): array
    {
        $orderDate = fake()->dateTimeBetween('-1 month', 'now');

        return [
            'user_id' => User::factory(),
            'supplier_id' => Supplier::factory(),
            'status' => 'draft',
            'total' => fake()->randomFloat(2, 500, 5000),
            'order_date' => $orderDate,
            'expected_date' => fake()->dateTimeBetween($orderDate, '+1 month'),
            'received_date' => null,
            'notes' => fake()->optional()->sentence(),
        ];
    }

    public function sent(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'sent',
        ]);
    }

    public function received(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'received',
            'received_date' => now(),
        ]);
    }
}
