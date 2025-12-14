<?php

namespace App\Services;

use App\Contracts\Repositories\ActivityRepositoryInterface;
use App\Contracts\Services\ActivityServiceInterface;
use App\Models\Activity;
use App\Models\Company;
use App\Models\Contact;
use App\Models\Deal;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Pagination\LengthAwarePaginator;

class ActivityService extends BaseService implements ActivityServiceInterface
{
    public function __construct(
        protected ActivityRepositoryInterface $activityRepository
    ) {
        parent::__construct($activityRepository);
    }

    public function getActivitiesForUser(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->activityRepository->paginateForUser($userId, $perPage);
    }

    public function getActivityForUser(int $userId, int $activityId): ?Activity
    {
        return $this->activityRepository->findForUser($userId, $activityId);
    }

    public function createActivity(int $userId, array $data): Activity
    {
        return $this->activityRepository->create([
            'user_id' => $userId,
            ...$data,
        ]);
    }

    public function updateActivity(int $userId, int $activityId, array $data): Activity
    {
        $activity = $this->activityRepository->findForUser($userId, $activityId);

        if (! $activity) {
            throw new ModelNotFoundException('Activity not found');
        }

        return $this->activityRepository->update($activity, $data);
    }

    public function deleteActivity(int $userId, int $activityId): bool
    {
        $activity = $this->activityRepository->findForUser($userId, $activityId);

        if (! $activity) {
            throw new ModelNotFoundException('Activity not found');
        }

        return $this->activityRepository->delete($activity);
    }

    public function logActivityForContact(int $userId, int $contactId, array $data): Activity
    {
        return $this->activityRepository->create([
            'user_id' => $userId,
            'activityable_type' => Contact::class,
            'activityable_id' => $contactId,
            ...$data,
        ]);
    }

    public function logActivityForCompany(int $userId, int $companyId, array $data): Activity
    {
        return $this->activityRepository->create([
            'user_id' => $userId,
            'activityable_type' => Company::class,
            'activityable_id' => $companyId,
            ...$data,
        ]);
    }

    public function logActivityForDeal(int $userId, int $dealId, array $data): Activity
    {
        return $this->activityRepository->create([
            'user_id' => $userId,
            'activityable_type' => Deal::class,
            'activityable_id' => $dealId,
            ...$data,
        ]);
    }

    public function markActivityCompleted(int $userId, int $activityId): Activity
    {
        $activity = $this->activityRepository->findForUser($userId, $activityId);

        if (! $activity) {
            throw new ModelNotFoundException('Activity not found');
        }

        $activity->markCompleted();

        return $activity->fresh();
    }

    public function markActivityCancelled(int $userId, int $activityId): Activity
    {
        $activity = $this->activityRepository->findForUser($userId, $activityId);

        if (! $activity) {
            throw new ModelNotFoundException('Activity not found');
        }

        $activity->markCancelled();

        return $activity->fresh();
    }

    public function getUpcomingActivities(int $userId, int $limit = 10): Collection
    {
        return $this->activityRepository->getUpcomingForUser($userId, $limit);
    }

    public function getOverdueActivities(int $userId): Collection
    {
        return $this->activityRepository->getOverdueForUser($userId);
    }

    public function getRecentActivities(int $userId, int $limit = 10): Collection
    {
        return $this->activityRepository->getRecentForUser($userId, $limit);
    }
}
