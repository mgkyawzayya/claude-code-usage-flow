<?php

use App\Models\Company;
use App\Models\Contact;
use App\Models\User;

test('companies can have contacts through pivot table', function () {
    $user = User::factory()->create();
    $company = Company::factory()->create(['user_id' => $user->id]);
    $contact = Contact::factory()->create(['user_id' => $user->id]);

    // Attach contact to company
    $company->contacts()->attach($contact->id, ['is_primary' => true]);

    // Verify the relationship works
    expect($company->contacts)->toHaveCount(1);
    expect($company->contacts->first()->id)->toBe($contact->id);
    expect($company->contacts->first()->pivot->is_primary)->toBe(1);
});

test('contacts can have companies through pivot table', function () {
    $user = User::factory()->create();
    $company = Company::factory()->create(['user_id' => $user->id]);
    $contact = Contact::factory()->create(['user_id' => $user->id]);

    // Attach company to contact
    $contact->companies()->attach($company->id, ['is_primary' => false]);

    // Verify the relationship works
    expect($contact->companies)->toHaveCount(1);
    expect($contact->companies->first()->id)->toBe($company->id);
    expect($contact->companies->first()->pivot->is_primary)->toBe(0);
});

test('company index page loads contacts count correctly', function () {
    $user = User::factory()->create();
    $company = Company::factory()->create(['user_id' => $user->id]);
    $contact1 = Contact::factory()->create(['user_id' => $user->id]);
    $contact2 = Contact::factory()->create(['user_id' => $user->id]);

    $company->contacts()->attach([$contact1->id, $contact2->id]);

    // This query is similar to what the controller uses - it should not fail
    $companies = Company::query()
        ->forUser($user->id)
        ->withCount('contacts')
        ->orderBy('created_at', 'desc')
        ->get();

    expect($companies->first()->contacts_count)->toBe(2);
});
