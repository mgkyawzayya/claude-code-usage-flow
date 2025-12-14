<?php

namespace App\Http\Controllers\CRM;

use App\Contracts\Services\ActivityServiceInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\CRM\StoreActivityRequest;
use App\Http\Requests\CRM\UpdateActivityRequest;
use App\Http\Resources\ActivityResource;
use App\Models\Activity;
use App\Models\Company;
use App\Models\Contact;
use App\Models\Deal;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActivityController extends Controller
{
    public function __construct(
        private ActivityServiceInterface $activityService
    ) {}

    public function index(Request $request): Response
    {
        $activities = $this->activityService->getActivitiesForUser(
            $request->user()->id,
            $request->input('per_page', 15)
        );

        return Inertia::render('crm/activities/index', [
            'activities' => ActivityResource::collection($activities),
            'types' => Activity::TYPES,
            'filters' => $request->only(['search', 'type', 'status']),
        ]);
    }

    public function store(StoreActivityRequest $request): RedirectResponse
    {
        $data = $request->validated();

        // Map activityable_type to model class
        $typeMap = [
            'contact' => Contact::class,
            'company' => Company::class,
            'deal' => Deal::class,
        ];

        $data['activityable_type'] = $typeMap[$data['activityable_type']];

        $this->activityService->createActivity($request->user()->id, $data);

        return back()->with('success', 'Activity logged successfully.');
    }

    public function update(UpdateActivityRequest $request, int $id): RedirectResponse
    {
        $this->activityService->updateActivity(
            $request->user()->id,
            $id,
            $request->validated()
        );

        return back()->with('success', 'Activity updated successfully.');
    }

    public function destroy(Request $request, int $id): RedirectResponse
    {
        $this->activityService->deleteActivity($request->user()->id, $id);

        return back()->with('success', 'Activity deleted successfully.');
    }

    public function complete(Request $request, int $id): RedirectResponse
    {
        $this->activityService->markActivityCompleted($request->user()->id, $id);

        return back()->with('success', 'Activity marked as completed.');
    }

    public function cancel(Request $request, int $id): RedirectResponse
    {
        $this->activityService->markActivityCancelled($request->user()->id, $id);

        return back()->with('success', 'Activity cancelled.');
    }
}
