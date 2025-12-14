<?php

namespace App\Http\Controllers\CRM;

use App\Contracts\Services\CompanyServiceInterface;
use App\Contracts\Services\ContactServiceInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\CRM\StoreContactRequest;
use App\Http\Requests\CRM\UpdateContactRequest;
use App\Http\Resources\CompanyResource;
use App\Http\Resources\ContactResource;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function __construct(
        private ContactServiceInterface $contactService,
        private CompanyServiceInterface $companyService
    ) {}

    public function index(Request $request): Response
    {
        $contacts = $this->contactService->getContactsForUser(
            $request->user()->id,
            $request->input('per_page', 15)
        );

        return Inertia::render('crm/contacts/index', [
            'contacts' => ContactResource::collection($contacts),
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create(Request $request): Response
    {
        $companies = $this->companyService->getCompaniesForUser($request->user()->id);

        return Inertia::render('crm/contacts/create', [
            'companies' => CompanyResource::collection($companies),
        ]);
    }

    public function store(StoreContactRequest $request): RedirectResponse
    {
        $contact = $this->contactService->createContact(
            $request->user()->id,
            $request->validated()
        );

        return to_route('crm.contacts.show', $contact)
            ->with('success', 'Contact created successfully.');
    }

    public function show(Request $request, string $id): Response
    {
        $contact = $this->contactService->getContactForUser($request->user()->id, (int) $id);

        if (! $contact) {
            abort(404);
        }

        return Inertia::render('crm/contacts/show', [
            'contact' => new ContactResource($contact->load(['companies', 'deals', 'activities'])),
        ]);
    }

    public function edit(Request $request, string $id): Response
    {
        $contact = $this->contactService->getContactForUser($request->user()->id, (int) $id);

        if (! $contact) {
            abort(404);
        }

        $companies = $this->companyService->getCompaniesForUser($request->user()->id);

        return Inertia::render('crm/contacts/edit', [
            'contact' => new ContactResource($contact->load('companies')),
            'companies' => CompanyResource::collection($companies),
        ]);
    }

    public function update(UpdateContactRequest $request, string $id): RedirectResponse
    {
        $this->contactService->updateContact(
            $request->user()->id,
            (int) $id,
            $request->validated()
        );

        return to_route('crm.contacts.show', $id)
            ->with('success', 'Contact updated successfully.');
    }

    public function destroy(Request $request, string $id): RedirectResponse
    {
        $this->contactService->deleteContact($request->user()->id, (int) $id);

        return to_route('crm.contacts.index')
            ->with('success', 'Contact deleted successfully.');
    }
}
