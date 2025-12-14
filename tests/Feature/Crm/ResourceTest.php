<?php

use App\Http\Resources\CompanyResource;
use App\Http\Resources\ContactResource;
use App\Http\Resources\DealResource;
use App\Models\Company;
use App\Models\Contact;
use App\Models\Deal;
use App\Models\User;

test('contact resource includes id field', function () {
    $user = User::factory()->create();
    $contact = Contact::factory()->create(['user_id' => $user->id]);

    $resource = new ContactResource($contact);
    $data = $resource->toArray(request());

    expect($data)->toHaveKey('id');
    expect($data['id'])->toBe($contact->id);
});

test('contact resource includes nested company ids when loaded', function () {
    $user = User::factory()->create();
    $contact = Contact::factory()->create(['user_id' => $user->id]);
    $company = Company::factory()->create(['user_id' => $user->id]);

    $contact->companies()->attach($company->id);
    $contact->load('companies');

    $resource = new ContactResource($contact);
    $data = $resource->toArray(request());

    expect($data)->toHaveKey('companies');
    // The collection is wrapped in a ResourceCollection, resolve it to array
    $companies = $data['companies']->resolve();
    expect($companies)->toBeArray();
    expect($companies)->toHaveCount(1);
    expect($companies[0])->toHaveKey('id');
    expect($companies[0]['id'])->toBe($company->id);
});

test('company resource includes nested contact ids when loaded', function () {
    $user = User::factory()->create();
    $company = Company::factory()->create(['user_id' => $user->id]);
    $contact = Contact::factory()->create(['user_id' => $user->id]);

    $company->contacts()->attach($contact->id);
    $company->load('contacts');

    $resource = new CompanyResource($company);
    $data = $resource->toArray(request());

    expect($data)->toHaveKey('contacts');
    // The collection is wrapped in a ResourceCollection, resolve it to array
    $contacts = $data['contacts']->resolve();
    expect($contacts)->toBeArray();
    expect($contacts)->toHaveCount(1);
    expect($contacts[0])->toHaveKey('id');
    expect($contacts[0]['id'])->toBe($contact->id);
});

test('deal resource includes nested contact and company ids when loaded', function () {
    $user = User::factory()->create();
    $contact = Contact::factory()->create(['user_id' => $user->id]);
    $company = Company::factory()->create(['user_id' => $user->id]);
    $deal = Deal::factory()->create([
        'user_id' => $user->id,
        'contact_id' => $contact->id,
        'company_id' => $company->id,
    ]);

    $deal->load(['contact', 'company']);

    $resource = new DealResource($deal);
    $data = $resource->toArray(request());

    expect($data)->toHaveKey('contact');
    // Single resources need to be resolved too
    $contactData = is_object($data['contact']) ? $data['contact']->resolve() : $data['contact'];
    expect($contactData)->toHaveKey('id');
    expect($contactData['id'])->toBe($contact->id);

    expect($data)->toHaveKey('company');
    $companyData = is_object($data['company']) ? $data['company']->resolve() : $data['company'];
    expect($companyData)->toHaveKey('id');
    expect($companyData['id'])->toBe($company->id);
});

test('contact resource collection preserves ids', function () {
    $user = User::factory()->create();
    $contacts = Contact::factory()->count(3)->create(['user_id' => $user->id]);

    $collection = ContactResource::collection($contacts);
    $data = $collection->toArray(request());

    expect($data)->toHaveCount(3);
    
    foreach ($data as $index => $contactData) {
        expect($contactData)->toHaveKey('id');
        expect($contactData['id'])->toBe($contacts[$index]->id);
    }
});
