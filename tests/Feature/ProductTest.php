<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->user = User::factory()->create();
});

test('user can list their products', function () {
    Product::factory()->count(10)->create(['user_id' => $this->user->id]);
    Product::factory()->count(5)->create(); // Other user's products

    $response = $this->actingAs($this->user)->get(route('pos.products.index'));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('pos/products/index')
            ->has('products.data', 10)
        );
});

test('user can create a product', function () {
    $category = Category::factory()->create(['user_id' => $this->user->id]);

    $data = [
        'sku' => 'TEST-001',
        'name' => 'Test Product',
        'category_id' => $category->id,
        'regular_price' => 99.99,
        'cost_price' => 50.00,
        'stock_quantity' => 100,
        'reorder_point' => 10,
        'unit' => 'piece',
        'is_active' => true,
        'track_inventory' => true,
    ];

    $response = $this->actingAs($this->user)->post(route('pos.products.store'), $data);

    $response->assertRedirect();

    $this->assertDatabaseHas('products', [
        'sku' => 'TEST-001',
        'name' => 'Test Product',
        'user_id' => $this->user->id,
    ]);
});

test('validates unique SKU per user', function () {
    Product::factory()->create([
        'sku' => 'DUP-001',
        'user_id' => $this->user->id,
    ]);

    $response = $this->actingAs($this->user)->post(route('pos.products.store'), [
        'sku' => 'DUP-001',
        'name' => 'Test Product',
        'regular_price' => 10,
    ]);

    $response->assertSessionHasErrors('sku');
});

test('SKU must be globally unique', function () {
    $otherUser = User::factory()->create();

    Product::factory()->create([
        'sku' => 'SAME-SKU',
        'user_id' => $otherUser->id,
    ]);

    $category = Category::factory()->create(['user_id' => $this->user->id]);

    $response = $this->actingAs($this->user)->post(route('pos.products.store'), [
        'sku' => 'SAME-SKU',
        'name' => 'My Product',
        'category_id' => $category->id,
        'regular_price' => 50,
        'cost_price' => 30,
        'stock_quantity' => 100,
    ]);

    $response->assertSessionHasErrors('sku');
});

test('user can update a product', function () {
    $product = Product::factory()->create([
        'user_id' => $this->user->id,
        'name' => 'Original Name',
    ]);

    $response = $this->actingAs($this->user)->put(route('pos.products.update', $product), [
        'sku' => $product->sku,
        'name' => 'Updated Name',
        'regular_price' => 150.00,
        'cost_price' => 80.00,
        'stock_quantity' => $product->stock_quantity,
    ]);

    $response->assertRedirect();

    expect($product->fresh()->name)->toBe('Updated Name');
});

test('user can delete a product', function () {
    $product = Product::factory()->create(['user_id' => $this->user->id]);

    $response = $this->actingAs($this->user)->delete(route('pos.products.destroy', $product));

    $response->assertRedirect();

    $this->assertSoftDeleted('products', ['id' => $product->id]);
});

test('can filter products by low stock', function () {
    Product::factory()->create([
        'user_id' => $this->user->id,
        'stock_quantity' => 5,
        'reorder_point' => 10,
    ]);

    Product::factory()->create([
        'user_id' => $this->user->id,
        'stock_quantity' => 50,
        'reorder_point' => 10,
    ]);

    $response = $this->actingAs($this->user)->get(route('pos.products.index', ['stock_status' => 'low']));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('products.data', 1)
        );
});

test('can filter products by category', function () {
    $category = Category::factory()->create(['user_id' => $this->user->id]);

    Product::factory()->count(3)->create([
        'user_id' => $this->user->id,
        'category_id' => $category->id,
    ]);

    Product::factory()->count(2)->create(['user_id' => $this->user->id]);

    $response = $this->actingAs($this->user)->get(route('pos.products.index', ['category' => $category->id]));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('products.data', 3)
        );
});

test('can search products by name', function () {
    Product::factory()->create([
        'user_id' => $this->user->id,
        'name' => 'Unique Widget',
    ]);

    Product::factory()->count(5)->create(['user_id' => $this->user->id]);

    $response = $this->actingAs($this->user)->get(route('pos.products.index', ['search' => 'Unique']));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('products.data', 1)
        );
});

test('can search products by SKU', function () {
    Product::factory()->create([
        'user_id' => $this->user->id,
        'sku' => 'SPECIAL-123',
    ]);

    Product::factory()->count(5)->create(['user_id' => $this->user->id]);

    $response = $this->actingAs($this->user)->get(route('pos.products.index', ['search' => 'SPECIAL']));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('products.data', 1)
        );
});

test('user cannot view another users product', function () {
    $otherUser = User::factory()->create();
    $product = Product::factory()->create(['user_id' => $otherUser->id]);

    $response = $this->actingAs($this->user)->get(route('pos.products.show', $product));

    $response->assertForbidden();
});

test('user cannot update another users product', function () {
    $otherUser = User::factory()->create();
    $product = Product::factory()->create(['user_id' => $otherUser->id]);

    $response = $this->actingAs($this->user)->put(route('pos.products.update', $product), [
        'sku' => $product->sku,
        'name' => 'Hacked Name',
        'regular_price' => 1,
        'stock_quantity' => 100,
    ]);

    $response->assertForbidden();
});

test('user cannot delete another users product', function () {
    $otherUser = User::factory()->create();
    $product = Product::factory()->create(['user_id' => $otherUser->id]);

    $response = $this->actingAs($this->user)->delete(route('pos.products.destroy', $product));

    $response->assertForbidden();
});

test('validates required product fields', function () {
    $response = $this->actingAs($this->user)->post(route('pos.products.store'), []);

    $response->assertSessionHasErrors(['sku', 'name', 'regular_price']);
});

test('validates numeric price fields', function () {
    $response = $this->actingAs($this->user)->post(route('pos.products.store'), [
        'sku' => 'TEST-001',
        'name' => 'Test Product',
        'regular_price' => 'invalid',
    ]);

    $response->assertSessionHasErrors('regular_price');
});

test('validates price is positive', function () {
    $response = $this->actingAs($this->user)->post(route('pos.products.store'), [
        'sku' => 'TEST-001',
        'name' => 'Test Product',
        'regular_price' => -10,
    ]);

    $response->assertSessionHasErrors('regular_price');
});

test('current price returns sale price when available', function () {
    $product = Product::factory()->make([
        'regular_price' => 100,
        'sale_price' => 80,
    ]);

    expect((float) $product->current_price)->toBe(80.0);
});

test('current price returns regular price when no sale price', function () {
    $product = Product::factory()->make([
        'regular_price' => 100,
        'sale_price' => null,
    ]);

    expect((float) $product->current_price)->toBe(100.0);
});

test('low stock scope filters correctly', function () {
    Product::factory()->create([
        'user_id' => $this->user->id,
        'stock_quantity' => 5,
        'reorder_point' => 10,
        'track_inventory' => true,
    ]);

    Product::factory()->create([
        'user_id' => $this->user->id,
        'stock_quantity' => 50,
        'reorder_point' => 10,
        'track_inventory' => true,
    ]);

    Product::factory()->create([
        'user_id' => $this->user->id,
        'stock_quantity' => 5,
        'reorder_point' => 10,
        'track_inventory' => false, // Should not be included
    ]);

    $lowStockProducts = Product::where('user_id', $this->user->id)->lowStock()->get();

    expect($lowStockProducts)->toHaveCount(1);
});

test('active scope filters correctly', function () {
    Product::factory()->count(3)->create([
        'user_id' => $this->user->id,
        'is_active' => true,
    ]);

    Product::factory()->count(2)->inactive()->create([
        'user_id' => $this->user->id,
    ]);

    $activeProducts = Product::where('user_id', $this->user->id)->active()->get();

    expect($activeProducts)->toHaveCount(3);
});
