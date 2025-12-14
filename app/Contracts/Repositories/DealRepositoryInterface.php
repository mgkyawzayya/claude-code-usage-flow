<?php

namespace App\Contracts\Repositories;

use App\Models\Deal;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface DealRepositoryInterface extends RepositoryInterface
{
    public function findForUser(int $userId, int $dealId): ?Deal;

    public function getAllForUser(int $userId): Collection;

    public function paginateForUser(int $userId, int $perPage = 15): LengthAwarePaginator;

    public function getByStageForUser(int $userId, string $stage): Collection;

    public function getOpenDealsForUser(int $userId): Collection;

    public function getPipelineForUser(int $userId): array;

    public function getTotalValueByStageForUser(int $userId): array;

    public function getWonValueForMonthForUser(int $userId, int $month, int $year): float;
}
