<?php

namespace App\Http\Controllers\CRM;

use App\Http\Controllers\Controller;
use App\Http\Resources\ActivityResource;
use App\Services\CrmDashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private CrmDashboardService $dashboardService
    ) {}

    public function __invoke(Request $request): Response
    {
        $data = $this->dashboardService->getDashboardData($request->user()->id);

        return Inertia::render('crm/dashboard', [
            'statistics' => $data['statistics'],
            'pipeline' => $data['pipeline'],
            'upcomingActivities' => ActivityResource::collection($data['upcoming_activities']),
            'overdueActivities' => ActivityResource::collection($data['overdue_activities']),
            'recentActivities' => ActivityResource::collection($data['recent_activities']),
        ]);
    }
}
