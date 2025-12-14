<?php

namespace App\Contracts\Services;

use App\Models\Company;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface CompanyServiceInterface extends ServiceInterface
{
    public function getCompaniesForUser(int $userId, int $perPage = 15): LengthAwarePaginator;

    public function getCompanyForUser(int $userId, int $companyId): ?Company;

    public function searchCompanies(int $userId, string $query): Collection;

    public function createCompany(int $userId, array $data): Company;

    public function updateCompany(int $userId, int $companyId, array $data): Company;

    public function deleteCompany(int $userId, int $companyId): bool;

    public function getCompaniesWithStats(int $userId): Collection;
}
