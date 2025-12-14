<?php

namespace App\Contracts\Services;

use App\Models\Deal;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface DealServiceInterface extends ServiceInterface
{
    public function getDealsForUser(int $userId, int $perPage = 15): LengthAwarePaginator;

    public function getDealForUser(int $userId, int $dealId): ?Deal;

    public function createDeal(int $userId, array $data): Deal;

    public function updateDeal(int $userId, int $dealId, array $data): Deal;

    public function deleteDeal(int $userId, int $dealId): bool;

    public function moveDealToStage(int $userId, int $dealId, string $stage): Deal;

    public function getPipeline(int $userId): array;

    public function getOpenDeals(int $userId): Collection;

    public function closeDealAsWon(int $userId, int $dealId): Deal;

    public function closeDealAsLost(int $userId, int $dealId, ?string $reason = null): Deal;

    public function getDealStatistics(int $userId): array;
}
