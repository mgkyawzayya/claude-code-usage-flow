<?php

namespace App\Contracts\Services;

use App\Models\Contact;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface ContactServiceInterface extends ServiceInterface
{
    public function getContactsForUser(int $userId, int $perPage = 15): LengthAwarePaginator;

    public function getContactForUser(int $userId, int $contactId): ?Contact;

    public function searchContacts(int $userId, string $query): Collection;

    public function createContact(int $userId, array $data): Contact;

    public function updateContact(int $userId, int $contactId, array $data): Contact;

    public function deleteContact(int $userId, int $contactId): bool;

    public function attachCompanyToContact(int $userId, int $contactId, int $companyId, bool $isPrimary = false): void;

    public function detachCompanyFromContact(int $userId, int $contactId, int $companyId): void;

    public function getLeads(int $userId): Collection;

    public function convertLeadToContact(int $userId, int $contactId): Contact;
}
