<?php

namespace App\Http\Controllers\CRM;

use App\Contracts\Services\CompanyServiceInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\CRM\StoreCompanyRequest;
use App\Http\Requests\CRM\UpdateCompanyRequest;
use App\Http\Resources\CompanyResource;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CompanyController extends Controller
{
    public function __construct(
        private CompanyServiceInterface $companyService
    ) {}

    public function index(Request $request): Response
    {
        $companies = $this->companyService->getCompaniesForUser(
            $request->user()->id,
            $request->input('per_page', 15)
        );

        return Inertia::render('crm/companies/index', [
            'companies' => CompanyResource::collection($companies),
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('crm/companies/create');
    }

    public function store(StoreCompanyRequest $request): RedirectResponse
    {
        $company = $this->companyService->createCompany(
            $request->user()->id,
            $request->validated()
        );

        return to_route('crm.companies.show', $company)
            ->with('success', 'Company created successfully.');
    }

    public function show(Request $request, string $id): Response
    {
        $company = $this->companyService->getCompanyForUser($request->user()->id, (int) $id);

        if (! $company) {
            abort(404);
        }

        return Inertia::render('crm/companies/show', [
            'company' => new CompanyResource($company->load(['contacts', 'deals', 'activities'])),
        ]);
    }

    public function edit(Request $request, string $id): Response
    {
        $company = $this->companyService->getCompanyForUser($request->user()->id, (int) $id);

        if (! $company) {
            abort(404);
        }

        return Inertia::render('crm/companies/edit', [
            'company' => new CompanyResource($company),
        ]);
    }

    public function update(UpdateCompanyRequest $request, string $id): RedirectResponse
    {
        $this->companyService->updateCompany(
            $request->user()->id,
            (int) $id,
            $request->validated()
        );

        return to_route('crm.companies.show', $id)
            ->with('success', 'Company updated successfully.');
    }

    public function destroy(Request $request, string $id): RedirectResponse
    {
        $this->companyService->deleteCompany($request->user()->id, (int) $id);

        return to_route('crm.companies.index')
            ->with('success', 'Company deleted successfully.');
    }
}
