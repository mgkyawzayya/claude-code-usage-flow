<?php

namespace App\Repositories;

use App\Contracts\Repositories\ActivityRepositoryInterface;
use App\Models\Activity;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class ActivityRepository extends BaseRepository implements ActivityRepositoryInterface
{
    public function __construct(Activity $model)
    {
        parent::__construct($model);
    }

    public function findForUser(int $userId, int $activityId): ?Activity
    {
        return $this->query()
            ->forUser($userId)
            ->with('activityable')
            ->find($activityId);
    }

    public function getAllForUser(int $userId): Collection
    {
        return $this->query()
            ->forUser($userId)
            ->with('activityable')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function paginateForUser(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->query()
            ->forUser($userId)
            ->with('activityable')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function getUpcomingForUser(int $userId, int $limit = 10): Collection
    {
        return $this->query()
            ->forUser($userId)
            ->upcoming()
            ->with('activityable')
            ->limit($limit)
            ->get();
    }

    public function getOverdueForUser(int $userId): Collection
    {
        return $this->query()
            ->forUser($userId)
            ->overdue()
            ->with('activityable')
            ->orderBy('scheduled_at')
            ->get();
    }

    public function getRecentForUser(int $userId, int $limit = 10): Collection
    {
        return $this->query()
            ->forUser($userId)
            ->with('activityable')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    public function getForEntity(string $entityType, int $entityId): Collection
    {
        return $this->query()
            ->where('activityable_type', $entityType)
            ->where('activityable_id', $entityId)
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
