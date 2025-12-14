<?php

namespace App\Contracts\Repositories;

use App\Models\Company;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface CompanyRepositoryInterface extends RepositoryInterface
{
    public function findForUser(int $userId, int $companyId): ?Company;

    public function getAllForUser(int $userId): Collection;

    public function paginateForUser(int $userId, int $perPage = 15): LengthAwarePaginator;

    public function searchForUser(int $userId, string $query): Collection;

    public function getWithContactsCount(int $userId): Collection;
}
