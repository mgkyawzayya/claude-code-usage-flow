<?php

namespace App\Repositories;

use App\Contracts\Repositories\CompanyRepositoryInterface;
use App\Models\Company;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class CompanyRepository extends BaseRepository implements CompanyRepositoryInterface
{
    public function __construct(Company $model)
    {
        parent::__construct($model);
    }

    public function findForUser(int $userId, int $companyId): ?Company
    {
        return $this->query()
            ->forUser($userId)
            ->with(['contacts', 'deals'])
            ->find($companyId);
    }

    public function getAllForUser(int $userId): Collection
    {
        return $this->query()
            ->forUser($userId)
            ->orderBy('name')
            ->get();
    }

    public function paginateForUser(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->query()
            ->forUser($userId)
            ->withCount('contacts')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function searchForUser(int $userId, string $query): Collection
    {
        return $this->query()
            ->forUser($userId)
            ->where('name', 'like', "%{$query}%")
            ->limit(20)
            ->get();
    }

    public function getWithContactsCount(int $userId): Collection
    {
        return $this->query()
            ->forUser($userId)
            ->withCount('contacts')
            ->orderBy('name')
            ->get();
    }
}
