<?php

namespace App\Contracts\Repositories;

use App\Models\Activity;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface ActivityRepositoryInterface extends RepositoryInterface
{
    public function findForUser(int $userId, int $activityId): ?Activity;

    public function getAllForUser(int $userId): Collection;

    public function paginateForUser(int $userId, int $perPage = 15): LengthAwarePaginator;

    public function getUpcomingForUser(int $userId, int $limit = 10): Collection;

    public function getOverdueForUser(int $userId): Collection;

    public function getRecentForUser(int $userId, int $limit = 10): Collection;

    public function getForEntity(string $entityType, int $entityId): Collection;
}
