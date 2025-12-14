<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Sale>
 */
class SaleFactory extends Factory
{
    public function definition(): array
    {
        $subtotal = fake()->randomFloat(2, 50, 1000);
        $tax = $subtotal * 0.1;
        $discount = fake()->boolean(30) ? fake()->randomFloat(2, 0, 50) : 0;
        $total = $subtotal + $tax - $discount;

        return [
            'user_id' => User::factory(),
            'status' => 'completed',
            'subtotal' => $subtotal,
            'tax' => $tax,
            'discount' => $discount,
            'total' => $total,
            'payment_method' => fake()->randomElement(['cash', 'card', 'bank_transfer']),
            'amount_paid' => $total,
            'change' => 0,
            'notes' => fake()->optional()->sentence(),
            'customer_name' => fake()->optional()->name(),
            'customer_email' => fake()->optional()->safeEmail(),
            'customer_phone' => fake()->optional()->phoneNumber(),
            'completed_at' => now(),
        ];
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'completed_at' => null,
        ]);
    }

    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'cancelled',
        ]);
    }
}
