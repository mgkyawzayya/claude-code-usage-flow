<?php

namespace App\Contracts\Services;

use App\Models\Activity;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface ActivityServiceInterface extends ServiceInterface
{
    public function getActivitiesForUser(int $userId, int $perPage = 15): LengthAwarePaginator;

    public function getActivityForUser(int $userId, int $activityId): ?Activity;

    public function createActivity(int $userId, array $data): Activity;

    public function updateActivity(int $userId, int $activityId, array $data): Activity;

    public function deleteActivity(int $userId, int $activityId): bool;

    public function logActivityForContact(int $userId, int $contactId, array $data): Activity;

    public function logActivityForCompany(int $userId, int $companyId, array $data): Activity;

    public function logActivityForDeal(int $userId, int $dealId, array $data): Activity;

    public function markActivityCompleted(int $userId, int $activityId): Activity;

    public function markActivityCancelled(int $userId, int $activityId): Activity;

    public function getUpcomingActivities(int $userId, int $limit = 10): Collection;

    public function getOverdueActivities(int $userId): Collection;

    public function getRecentActivities(int $userId, int $limit = 10): Collection;
}
