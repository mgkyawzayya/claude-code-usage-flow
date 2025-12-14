<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\PurchaseOrder;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PurchaseOrderItem>
 */
class PurchaseOrderItemFactory extends Factory
{
    public function definition(): array
    {
        $quantityOrdered = fake()->numberBetween(10, 100);
        $unitCost = fake()->randomFloat(2, 5, 100);
        $total = $quantityOrdered * $unitCost;

        return [
            'purchase_order_id' => PurchaseOrder::factory(),
            'product_id' => Product::factory(),
            'quantity_ordered' => $quantityOrdered,
            'quantity_received' => 0,
            'unit_cost' => $unitCost,
            'total' => $total,
        ];
    }
}
