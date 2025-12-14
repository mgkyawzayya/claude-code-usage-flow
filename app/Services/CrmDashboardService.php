<?php

namespace App\Services;

use App\Contracts\Services\ActivityServiceInterface;
use App\Contracts\Services\ContactServiceInterface;
use App\Contracts\Services\DealServiceInterface;

class CrmDashboardService
{
    public function __construct(
        protected ContactServiceInterface $contactService,
        protected DealServiceInterface $dealService,
        protected ActivityServiceInterface $activityService
    ) {}

    public function getDashboardData(int $userId): array
    {
        return [
            'statistics' => $this->getStatistics($userId),
            'pipeline' => $this->dealService->getPipeline($userId),
            'upcoming_activities' => $this->activityService->getUpcomingActivities($userId, 5),
            'overdue_activities' => $this->activityService->getOverdueActivities($userId),
            'recent_activities' => $this->activityService->getRecentActivities($userId, 10),
        ];
    }

    protected function getStatistics(int $userId): array
    {
        $dealStats = $this->dealService->getDealStatistics($userId);
        $leads = $this->contactService->getLeads($userId);

        return [
            'total_leads' => $leads->count(),
            'open_deals' => $dealStats['total_open_deals'],
            'pipeline_value' => $dealStats['total_open_value'],
            'weighted_value' => $dealStats['weighted_value'],
            'won_this_month' => $dealStats['won_this_month'],
        ];
    }
}
