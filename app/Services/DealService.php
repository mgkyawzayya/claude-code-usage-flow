<?php

namespace App\Services;

use App\Contracts\Repositories\ActivityRepositoryInterface;
use App\Contracts\Repositories\DealRepositoryInterface;
use App\Contracts\Services\DealServiceInterface;
use App\Models\Deal;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class DealService extends BaseService implements DealServiceInterface
{
    public function __construct(
        protected DealRepositoryInterface $dealRepository,
        protected ActivityRepositoryInterface $activityRepository
    ) {
        parent::__construct($dealRepository);
    }

    public function getDealsForUser(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->dealRepository->paginateForUser($userId, $perPage);
    }

    public function getDealForUser(int $userId, int $dealId): ?Deal
    {
        return $this->dealRepository->findForUser($userId, $dealId);
    }

    public function createDeal(int $userId, array $data): Deal
    {
        $data['user_id'] = $userId;

        // Set default probability based on stage if not provided
        if (! isset($data['probability']) && isset($data['stage'])) {
            $data['probability'] = Deal::STAGE_PROBABILITIES[$data['stage']] ?? 0;
        }

        return $this->dealRepository->create($data);
    }

    public function updateDeal(int $userId, int $dealId, array $data): Deal
    {
        $deal = $this->dealRepository->findForUser($userId, $dealId);

        if (! $deal) {
            throw new ModelNotFoundException('Deal not found');
        }

        return $this->dealRepository->update($deal, $data);
    }

    public function deleteDeal(int $userId, int $dealId): bool
    {
        $deal = $this->dealRepository->findForUser($userId, $dealId);

        if (! $deal) {
            throw new ModelNotFoundException('Deal not found');
        }

        return $this->dealRepository->delete($deal);
    }

    public function moveDealToStage(int $userId, int $dealId, string $stage): Deal
    {
        $deal = $this->dealRepository->findForUser($userId, $dealId);

        if (! $deal) {
            throw new ModelNotFoundException('Deal not found');
        }

        if (! array_key_exists($stage, Deal::STAGES)) {
            throw new InvalidArgumentException("Invalid stage: {$stage}");
        }

        return DB::transaction(function () use ($deal, $stage, $userId) {
            $oldStage = $deal->stage;

            $deal = $this->dealRepository->update($deal, [
                'stage' => $stage,
                'probability' => Deal::STAGE_PROBABILITIES[$stage],
            ]);

            // Log activity for stage change
            $this->activityRepository->create([
                'user_id' => $userId,
                'activityable_type' => Deal::class,
                'activityable_id' => $deal->id,
                'type' => 'note',
                'subject' => 'Stage changed',
                'description' => 'Deal moved from '.Deal::STAGES[$oldStage].' to '.Deal::STAGES[$stage],
                'status' => 'completed',
                'completed_at' => now(),
            ]);

            return $deal;
        });
    }

    public function getPipeline(int $userId): array
    {
        return $this->dealRepository->getPipelineForUser($userId);
    }

    public function getOpenDeals(int $userId): Collection
    {
        return $this->dealRepository->getOpenDealsForUser($userId);
    }

    public function closeDealAsWon(int $userId, int $dealId): Deal
    {
        $deal = $this->dealRepository->findForUser($userId, $dealId);

        if (! $deal) {
            throw new ModelNotFoundException('Deal not found');
        }

        return DB::transaction(function () use ($deal, $userId) {
            $deal = $this->dealRepository->update($deal, [
                'stage' => 'closed_won',
                'probability' => 100,
                'actual_close_date' => now(),
            ]);

            $this->activityRepository->create([
                'user_id' => $userId,
                'activityable_type' => Deal::class,
                'activityable_id' => $deal->id,
                'type' => 'note',
                'subject' => 'Deal Won',
                'description' => 'Deal closed successfully with value: $'.number_format($deal->value, 2),
                'status' => 'completed',
                'completed_at' => now(),
            ]);

            return $deal;
        });
    }

    public function closeDealAsLost(int $userId, int $dealId, ?string $reason = null): Deal
    {
        $deal = $this->dealRepository->findForUser($userId, $dealId);

        if (! $deal) {
            throw new ModelNotFoundException('Deal not found');
        }

        return DB::transaction(function () use ($deal, $userId, $reason) {
            $deal = $this->dealRepository->update($deal, [
                'stage' => 'closed_lost',
                'probability' => 0,
                'actual_close_date' => now(),
            ]);

            $this->activityRepository->create([
                'user_id' => $userId,
                'activityable_type' => Deal::class,
                'activityable_id' => $deal->id,
                'type' => 'note',
                'subject' => 'Deal Lost',
                'description' => $reason ?? 'Deal closed as lost',
                'status' => 'completed',
                'completed_at' => now(),
            ]);

            return $deal;
        });
    }

    public function getDealStatistics(int $userId): array
    {
        $stageStats = $this->dealRepository->getTotalValueByStageForUser($userId);
        $openDeals = $this->dealRepository->getOpenDealsForUser($userId);

        return [
            'total_open_deals' => $openDeals->count(),
            'total_open_value' => $openDeals->sum('value'),
            'weighted_value' => $openDeals->sum(fn ($deal) => $deal->weighted_value),
            'by_stage' => $stageStats,
            'won_this_month' => $this->dealRepository->getWonValueForMonthForUser(
                $userId,
                now()->month,
                now()->year
            ),
        ];
    }
}
