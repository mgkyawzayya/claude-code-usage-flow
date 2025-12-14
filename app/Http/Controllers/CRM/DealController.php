<?php

namespace App\Http\Controllers\CRM;

use App\Contracts\Services\CompanyServiceInterface;
use App\Contracts\Services\ContactServiceInterface;
use App\Contracts\Services\DealServiceInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\CRM\StoreDealRequest;
use App\Http\Requests\CRM\UpdateDealRequest;
use App\Http\Resources\CompanyResource;
use App\Http\Resources\ContactResource;
use App\Http\Resources\DealResource;
use App\Models\Deal;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DealController extends Controller
{
    public function __construct(
        private DealServiceInterface $dealService,
        private ContactServiceInterface $contactService,
        private CompanyServiceInterface $companyService
    ) {}

    public function index(Request $request): Response
    {
        $deals = $this->dealService->getDealsForUser(
            $request->user()->id,
            $request->input('per_page', 15)
        );

        return Inertia::render('crm/deals/index', [
            'deals' => DealResource::collection($deals),
            'stages' => Deal::STAGES,
            'filters' => $request->only(['search', 'stage']),
        ]);
    }

    public function pipeline(Request $request): Response
    {
        $pipeline = $this->dealService->getPipeline($request->user()->id);

        return Inertia::render('crm/deals/pipeline', [
            'pipeline' => $pipeline,
            'stages' => Deal::STAGES,
        ]);
    }

    public function create(Request $request): Response
    {
        $contacts = $this->contactService->getContactsForUser($request->user()->id);
        $companies = $this->companyService->getCompaniesForUser($request->user()->id);

        return Inertia::render('crm/deals/create', [
            'contacts' => ContactResource::collection($contacts),
            'companies' => CompanyResource::collection($companies),
            'stages' => Deal::STAGES,
        ]);
    }

    public function store(StoreDealRequest $request): RedirectResponse
    {
        $deal = $this->dealService->createDeal(
            $request->user()->id,
            $request->validated()
        );

        return to_route('crm.deals.show', $deal)
            ->with('success', 'Deal created successfully.');
    }

    public function show(Request $request, Deal $deal): Response
    {
        return Inertia::render('crm/deals/show', [
            'deal' => new DealResource($deal->load(['contact', 'company', 'activities'])),
            'stages' => Deal::STAGES,
        ]);
    }

    public function edit(Request $request, Deal $deal): Response
    {
        $contacts = $this->contactService->getContactsForUser($request->user()->id);
        $companies = $this->companyService->getCompaniesForUser($request->user()->id);

        return Inertia::render('crm/deals/edit', [
            'deal' => new DealResource($deal),
            'contacts' => ContactResource::collection($contacts),
            'companies' => CompanyResource::collection($companies),
            'stages' => Deal::STAGES,
        ]);
    }

    public function update(UpdateDealRequest $request, Deal $deal): RedirectResponse
    {
        $this->dealService->updateDeal(
            $request->user()->id,
            $deal->id,
            $request->validated()
        );

        return to_route('crm.deals.show', $deal)
            ->with('success', 'Deal updated successfully.');
    }

    public function destroy(Request $request, Deal $deal): RedirectResponse
    {
        $this->dealService->deleteDeal($request->user()->id, $deal->id);

        return to_route('crm.deals.index')
            ->with('success', 'Deal deleted successfully.');
    }

    public function moveStage(Request $request, Deal $deal): RedirectResponse
    {
        $request->validate(['stage' => 'required|in:'.implode(',', array_keys(Deal::STAGES))]);

        $this->dealService->moveDealToStage(
            $request->user()->id,
            $deal->id,
            $request->input('stage')
        );

        return back()->with('success', 'Deal stage updated.');
    }

    public function closeWon(Request $request, Deal $deal): RedirectResponse
    {
        $this->dealService->closeDealAsWon($request->user()->id, $deal->id);

        return to_route('crm.deals.show', $deal)
            ->with('success', 'Deal closed as won.');
    }

    public function closeLost(Request $request, Deal $deal): RedirectResponse
    {
        $request->validate(['reason' => 'nullable|string|max:1000']);

        $this->dealService->closeDealAsLost(
            $request->user()->id,
            $deal->id,
            $request->input('reason')
        );

        return to_route('crm.deals.show', $deal)
            ->with('success', 'Deal closed as lost.');
    }
}
