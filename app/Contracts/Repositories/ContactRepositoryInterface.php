<?php

namespace App\Contracts\Repositories;

use App\Models\Contact;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface ContactRepositoryInterface extends RepositoryInterface
{
    public function findForUser(int $userId, int $contactId): ?Contact;

    public function getAllForUser(int $userId): Collection;

    public function paginateForUser(int $userId, int $perPage = 15): LengthAwarePaginator;

    public function searchForUser(int $userId, string $query): Collection;

    public function getLeadsForUser(int $userId): Collection;

    public function attachCompany(Contact $contact, int $companyId, bool $isPrimary = false): void;

    public function detachCompany(Contact $contact, int $companyId): void;
}
