<?php

namespace Database\Factories;

use App\Models\Deal;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Deal>
 */
class DealFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'contact_id' => null,
            'company_id' => null,
            'title' => fake()->catchPhrase(),
            'description' => fake()->optional()->sentence(),
            'value' => fake()->randomFloat(2, 1000, 100000),
            'stage' => fake()->randomElement(array_keys(Deal::STAGES)),
            'probability' => fake()->numberBetween(0, 100),
            'expected_close_date' => fake()->optional()->dateTimeBetween('now', '+6 months'),
            'notes' => fake()->optional()->paragraph(),
        ];
    }
}
