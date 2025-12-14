<?php

namespace App\Services;

use App\Contracts\Repositories\CompanyRepositoryInterface;
use App\Contracts\Services\CompanyServiceInterface;
use App\Models\Company;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Pagination\LengthAwarePaginator;

class CompanyService extends BaseService implements CompanyServiceInterface
{
    public function __construct(
        protected CompanyRepositoryInterface $companyRepository
    ) {
        parent::__construct($companyRepository);
    }

    public function getCompaniesForUser(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->companyRepository->paginateForUser($userId, $perPage);
    }

    public function getCompanyForUser(int $userId, int $companyId): ?Company
    {
        return $this->companyRepository->findForUser($userId, $companyId);
    }

    public function searchCompanies(int $userId, string $query): Collection
    {
        return $this->companyRepository->searchForUser($userId, $query);
    }

    public function createCompany(int $userId, array $data): Company
    {
        return $this->companyRepository->create([
            'user_id' => $userId,
            ...$data,
        ]);
    }

    public function updateCompany(int $userId, int $companyId, array $data): Company
    {
        $company = $this->companyRepository->findForUser($userId, $companyId);

        if (! $company) {
            throw new ModelNotFoundException('Company not found');
        }

        return $this->companyRepository->update($company, $data);
    }

    public function deleteCompany(int $userId, int $companyId): bool
    {
        $company = $this->companyRepository->findForUser($userId, $companyId);

        if (! $company) {
            throw new ModelNotFoundException('Company not found');
        }

        return $this->companyRepository->delete($company);
    }

    public function getCompaniesWithStats(int $userId): Collection
    {
        return $this->companyRepository->getWithContactsCount($userId);
    }
}
