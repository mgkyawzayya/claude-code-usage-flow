<?php

use App\Models\Deal;
use App\Models\User;

test('deal edit page can be accessed with route model binding', function () {
    $user = User::factory()->create();
    $deal = Deal::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->get(route('crm.deals.edit', $deal));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('crm/deals/edit'));
});

test('deal show page can be accessed with route model binding', function () {
    $user = User::factory()->create();
    $deal = Deal::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->get(route('crm.deals.show', $deal));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('crm/deals/show'));
});

test('deal update works with route model binding', function () {
    $user = User::factory()->create();
    $deal = Deal::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->put(route('crm.deals.update', $deal), [
        'title' => 'Updated Deal Title',
        'value' => 5000,
        'stage' => 'qualified',
    ]);

    $response->assertRedirect(route('crm.deals.show', $deal));
    expect($deal->fresh()->title)->toBe('Updated Deal Title');
});

test('deal delete works with route model binding', function () {
    $user = User::factory()->create();
    $deal = Deal::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->delete(route('crm.deals.destroy', $deal));

    $response->assertRedirect(route('crm.deals.index'));
    expect(Deal::find($deal->id))->toBeNull();
});

test('users cannot access other users deals', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $deal = Deal::factory()->create(['user_id' => $user1->id]);

    // Try to edit another user's deal
    $response = $this->actingAs($user2)->get(route('crm.deals.edit', $deal));
    $response->assertNotFound();

    // Try to view another user's deal
    $response = $this->actingAs($user2)->get(route('crm.deals.show', $deal));
    $response->assertNotFound();
});
