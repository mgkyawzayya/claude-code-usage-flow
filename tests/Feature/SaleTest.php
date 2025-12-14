<?php

use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\StockMovement;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->user = User::factory()->create();
});

test('user can list their sales', function () {
    Sale::factory()->count(5)->create(['user_id' => $this->user->id]);
    Sale::factory()->count(3)->create(); // Other user's sales

    $response = $this->actingAs($this->user)->get(route('pos.sales.index'));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('pos/sales/index')
            ->has('sales.data', 5)
        );
});

test('user can create a sale and reduce stock', function () {
    $product = Product::factory()->create([
        'user_id' => $this->user->id,
        'stock_quantity' => 100,
        'regular_price' => 50,
        'track_inventory' => true,
    ]);

    $response = $this->actingAs($this->user)->post(route('pos.sales.store'), [
        'items' => [
            [
                'product_id' => $product->id,
                'quantity' => 5,
                'unit_price' => 50,
                'discount' => 0,
            ],
        ],
        'payment_method' => 'cash',
        'amount_paid' => 250,
    ]);

    $response->assertRedirect();

    // Check sale created
    $sale = Sale::latest()->first();
    expect($sale)->not->toBeNull();
    expect($sale->subtotal)->toBe('250.00');
    expect($sale->total)->toBe('250.00');
    expect($sale->user_id)->toBe($this->user->id);

    // Check stock reduced
    expect($product->fresh()->stock_quantity)->toBe(95);

    // Check sale item created
    $this->assertDatabaseHas('sale_items', [
        'sale_id' => $sale->id,
        'product_id' => $product->id,
        'quantity' => 5,
    ]);

    // Check stock movement created
    $this->assertDatabaseHas('stock_movements', [
        'product_id' => $product->id,
        'type' => 'sale',
        'quantity' => -5,
        'reference_type' => Sale::class,
        'reference_id' => $sale->id,
    ]);
});

test('prevents overselling when stock is insufficient', function () {
    $product = Product::factory()->create([
        'stock_quantity' => 5,
        'user_id' => $this->user->id,
        'regular_price' => 100,
        'track_inventory' => true,
    ]);

    $response = $this->actingAs($this->user)->post(route('pos.sales.store'), [
        'items' => [
            [
                'product_id' => $product->id,
                'quantity' => 10,
                'unit_price' => 100,
            ],
        ],
        'payment_method' => 'cash',
        'amount_paid' => 1000,
    ]);

    $response->assertSessionHas('error');

    // Stock should remain unchanged
    expect($product->fresh()->stock_quantity)->toBe(5);

    // No sale should be created
    expect(Sale::count())->toBe(0);
});

test('calculates sale totals correctly', function () {
    $product = Product::factory()->create([
        'regular_price' => 100,
        'user_id' => $this->user->id,
        'stock_quantity' => 50,
    ]);

    $response = $this->actingAs($this->user)->post(route('pos.sales.store'), [
        'items' => [
            [
                'product_id' => $product->id,
                'quantity' => 3,
                'unit_price' => 100,
                'discount' => 0,
            ],
        ],
        'tax' => 30,
        'discount' => 0,
        'payment_method' => 'cash',
        'amount_paid' => 330,
    ]);

    $response->assertRedirect();

    $sale = Sale::latest()->first();
    expect($sale->subtotal)->toBe('300.00');
    expect($sale->tax)->toBe('30.00');
    expect($sale->total)->toBe('330.00');
});

test('calculates change correctly when overpaid', function () {
    $product = Product::factory()->create([
        'user_id' => $this->user->id,
        'regular_price' => 50,
        'stock_quantity' => 100,
    ]);

    $response = $this->actingAs($this->user)->post(route('pos.sales.store'), [
        'items' => [
            [
                'product_id' => $product->id,
                'quantity' => 2,
                'unit_price' => 50,
            ],
        ],
        'payment_method' => 'cash',
        'amount_paid' => 150,
    ]);

    $response->assertRedirect();

    $sale = Sale::latest()->first();
    expect($sale->total)->toBe('100.00');
    expect($sale->amount_paid)->toBe('150.00');
    expect($sale->change)->toBe('50.00');
});

test('handles multiple items in a single sale', function () {
    $product1 = Product::factory()->create([
        'user_id' => $this->user->id,
        'regular_price' => 50,
        'stock_quantity' => 100,
    ]);

    $product2 = Product::factory()->create([
        'user_id' => $this->user->id,
        'regular_price' => 30,
        'stock_quantity' => 50,
    ]);

    $response = $this->actingAs($this->user)->post(route('pos.sales.store'), [
        'items' => [
            [
                'product_id' => $product1->id,
                'quantity' => 2,
                'unit_price' => 50,
            ],
            [
                'product_id' => $product2->id,
                'quantity' => 3,
                'unit_price' => 30,
            ],
        ],
        'payment_method' => 'cash',
        'amount_paid' => 190,
    ]);

    $response->assertRedirect();

    $sale = Sale::latest()->first();
    expect($sale->subtotal)->toBe('190.00');

    // Check both products stock reduced
    expect($product1->fresh()->stock_quantity)->toBe(98);
    expect($product2->fresh()->stock_quantity)->toBe(47);

    // Check sale items count
    expect($sale->saleItems()->count())->toBe(2);
});

test('generates unique invoice number automatically', function () {
    $product = Product::factory()->create([
        'user_id' => $this->user->id,
        'regular_price' => 50,
        'stock_quantity' => 100,
    ]);

    $response = $this->actingAs($this->user)->post(route('pos.sales.store'), [
        'items' => [
            [
                'product_id' => $product->id,
                'quantity' => 1,
                'unit_price' => 50,
            ],
        ],
        'payment_method' => 'cash',
        'amount_paid' => 50,
    ]);

    $sale = Sale::latest()->first();
    expect($sale->invoice_number)->toMatch('/^INV-\d{8}-\d{4}$/');
});

test('user can view their own sale', function () {
    $sale = Sale::factory()->create(['user_id' => $this->user->id]);

    $response = $this->actingAs($this->user)->get(route('pos.sales.show', $sale));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('pos/sales/show')
            ->where('sale.id', $sale->id)
        );
});

test('user cannot view another users sale', function () {
    $otherUser = User::factory()->create();
    $sale = Sale::factory()->create(['user_id' => $otherUser->id]);

    $response = $this->actingAs($this->user)->get(route('pos.sales.show', $sale));

    $response->assertForbidden();
});

test('can filter sales by status', function () {
    Sale::factory()->count(3)->create([
        'user_id' => $this->user->id,
        'status' => 'completed',
    ]);

    Sale::factory()->count(2)->pending()->create([
        'user_id' => $this->user->id,
    ]);

    $response = $this->actingAs($this->user)->get(route('pos.sales.index', ['status' => 'completed']));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('sales.data', 3)
        );
});

test('can search sales by invoice number', function () {
    $sale = Sale::factory()->create([
        'user_id' => $this->user->id,
        'invoice_number' => 'INV-TEST-001',
    ]);

    Sale::factory()->count(5)->create(['user_id' => $this->user->id]);

    $response = $this->actingAs($this->user)->get(route('pos.sales.index', ['search' => 'TEST']));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('sales.data', 1)
            ->where('sales.data.0.invoice_number', 'INV-TEST-001')
        );
});

test('voiding sale restores stock', function () {
    $product = Product::factory()->create([
        'user_id' => $this->user->id,
        'stock_quantity' => 100,
        'regular_price' => 50,
        'track_inventory' => true,
    ]);

    // Create a sale
    $sale = Sale::factory()->create([
        'user_id' => $this->user->id,
    ]);

    SaleItem::factory()->create([
        'sale_id' => $sale->id,
        'product_id' => $product->id,
        'quantity' => 10,
    ]);

    // Manually reduce stock
    $product->update(['stock_quantity' => 90]);

    // Void the sale
    $response = $this->actingAs($this->user)->delete(route('pos.sales.destroy', $sale));

    $response->assertRedirect(route('pos.sales.index'));

    // Check stock restored
    expect($product->fresh()->stock_quantity)->toBe(100);

    // Check sale soft deleted
    $this->assertSoftDeleted('sales', ['id' => $sale->id]);
});

test('does not reduce stock for products with inventory tracking disabled', function () {
    $product = Product::factory()->create([
        'user_id' => $this->user->id,
        'stock_quantity' => 100,
        'regular_price' => 50,
        'track_inventory' => false,
    ]);

    $response = $this->actingAs($this->user)->post(route('pos.sales.store'), [
        'items' => [
            [
                'product_id' => $product->id,
                'quantity' => 5,
                'unit_price' => 50,
            ],
        ],
        'payment_method' => 'cash',
        'amount_paid' => 250,
    ]);

    $response->assertRedirect();

    // Stock should remain unchanged
    expect($product->fresh()->stock_quantity)->toBe(100);

    // No stock movement should be created
    expect(StockMovement::where('product_id', $product->id)->count())->toBe(0);
});

test('validates required sale data', function () {
    $response = $this->actingAs($this->user)->post(route('pos.sales.store'), []);

    $response->assertSessionHasErrors(['items', 'payment_method', 'amount_paid']);
});

test('validates minimum one item required', function () {
    $response = $this->actingAs($this->user)->post(route('pos.sales.store'), [
        'items' => [],
        'payment_method' => 'cash',
        'amount_paid' => 100,
    ]);

    $response->assertSessionHasErrors('items');
});

test('stores customer information when provided', function () {
    $product = Product::factory()->create([
        'user_id' => $this->user->id,
        'regular_price' => 50,
        'stock_quantity' => 100,
    ]);

    $response = $this->actingAs($this->user)->post(route('pos.sales.store'), [
        'items' => [
            [
                'product_id' => $product->id,
                'quantity' => 1,
                'unit_price' => 50,
            ],
        ],
        'payment_method' => 'cash',
        'amount_paid' => 50,
        'customer_name' => 'John Doe',
        'customer_email' => 'john@example.com',
        'customer_phone' => '1234567890',
    ]);

    $response->assertRedirect();

    $sale = Sale::latest()->first();
    expect($sale->customer_name)->toBe('John Doe');
    expect($sale->customer_email)->toBe('john@example.com');
    expect($sale->customer_phone)->toBe('1234567890');
});
