<?php

namespace App\Repositories;

use App\Contracts\Repositories\DealRepositoryInterface;
use App\Models\Deal;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class DealRepository extends BaseRepository implements DealRepositoryInterface
{
    public function __construct(Deal $model)
    {
        parent::__construct($model);
    }

    public function findForUser(int $userId, int $dealId): ?Deal
    {
        return $this->query()
            ->forUser($userId)
            ->with(['contact', 'company', 'activities'])
            ->find($dealId);
    }

    public function getAllForUser(int $userId): Collection
    {
        return $this->query()
            ->forUser($userId)
            ->with(['contact', 'company'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function paginateForUser(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->query()
            ->forUser($userId)
            ->with(['contact', 'company'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function getByStageForUser(int $userId, string $stage): Collection
    {
        return $this->query()
            ->forUser($userId)
            ->byStage($stage)
            ->with(['contact', 'company'])
            ->orderBy('expected_close_date')
            ->get();
    }

    public function getOpenDealsForUser(int $userId): Collection
    {
        return $this->query()
            ->forUser($userId)
            ->open()
            ->with(['contact', 'company'])
            ->orderBy('expected_close_date')
            ->get();
    }

    public function getPipelineForUser(int $userId): array
    {
        $deals = $this->query()
            ->forUser($userId)
            ->open()
            ->with(['contact', 'company'])
            ->get();

        $pipeline = [];
        foreach (Deal::STAGES as $stageKey => $stageLabel) {
            if (in_array($stageKey, ['closed_won', 'closed_lost'])) {
                continue;
            }
            $stageDeals = $deals->where('stage', $stageKey)->values();
            $pipeline[$stageKey] = [
                'label' => $stageLabel,
                'deals' => $stageDeals->map(function (Deal $deal) {
                    return [
                        'id' => $deal->id,
                        'title' => $deal->title,
                        'description' => $deal->description,
                        'value' => $deal->value,
                        'value_formatted' => $deal->value ? '$' . number_format($deal->value, 2) : null,
                        'stage' => $deal->stage,
                        'stage_label' => Deal::STAGES[$deal->stage] ?? $deal->stage,
                        'probability' => $deal->probability,
                        'weighted_value' => $deal->weighted_value,
                        'expected_close_date' => $deal->expected_close_date?->toDateString(),
                        'actual_close_date' => $deal->actual_close_date?->toDateString(),
                        'notes' => $deal->notes,
                        'is_open' => $deal->isOpen(),
                        'is_closed' => $deal->isClosed(),
                        'contact' => $deal->contact ? [
                            'id' => $deal->contact->id,
                            'full_name' => $deal->contact->full_name,
                        ] : null,
                        'company' => $deal->company ? [
                            'id' => $deal->company->id,
                            'name' => $deal->company->name,
                        ] : null,
                    ];
                })->toArray(),
                'total_value' => $stageDeals->sum('value'),
            ];
        }

        return $pipeline;
    }

    public function getTotalValueByStageForUser(int $userId): array
    {
        return $this->query()
            ->forUser($userId)
            ->select('stage', DB::raw('SUM(value) as total_value'), DB::raw('COUNT(*) as count'))
            ->groupBy('stage')
            ->get()
            ->keyBy('stage')
            ->toArray();
    }

    public function getWonValueForMonthForUser(int $userId, int $month, int $year): float
    {
        return (float) $this->query()
            ->forUser($userId)
            ->won()
            ->whereMonth('actual_close_date', $month)
            ->whereYear('actual_close_date', $year)
            ->sum('value');
    }
}
