<?php

namespace App\Services;

use App\Contracts\Repositories\CompanyRepositoryInterface;
use App\Contracts\Repositories\ContactRepositoryInterface;
use App\Contracts\Services\ContactServiceInterface;
use App\Models\Contact;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class ContactService extends BaseService implements ContactServiceInterface
{
    public function __construct(
        protected ContactRepositoryInterface $contactRepository,
        protected CompanyRepositoryInterface $companyRepository
    ) {
        parent::__construct($contactRepository);
    }

    public function getContactsForUser(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->contactRepository->paginateForUser($userId, $perPage);
    }

    public function getContactForUser(int $userId, int $contactId): ?Contact
    {
        return $this->contactRepository->findForUser($userId, $contactId);
    }

    public function searchContacts(int $userId, string $query): Collection
    {
        return $this->contactRepository->searchForUser($userId, $query);
    }

    public function createContact(int $userId, array $data): Contact
    {
        return DB::transaction(function () use ($userId, $data) {
            $contact = $this->contactRepository->create([
                'user_id' => $userId,
                ...$data,
            ]);

            if (isset($data['company_id'])) {
                $this->contactRepository->attachCompany(
                    $contact,
                    $data['company_id'],
                    true
                );
            }

            return $contact->load('companies');
        });
    }

    public function updateContact(int $userId, int $contactId, array $data): Contact
    {
        $contact = $this->contactRepository->findForUser($userId, $contactId);

        if (! $contact) {
            throw new ModelNotFoundException('Contact not found');
        }

        return $this->contactRepository->update($contact, $data);
    }

    public function deleteContact(int $userId, int $contactId): bool
    {
        $contact = $this->contactRepository->findForUser($userId, $contactId);

        if (! $contact) {
            throw new ModelNotFoundException('Contact not found');
        }

        return $this->contactRepository->delete($contact);
    }

    public function attachCompanyToContact(int $userId, int $contactId, int $companyId, bool $isPrimary = false): void
    {
        $contact = $this->contactRepository->findForUser($userId, $contactId);
        $company = $this->companyRepository->findForUser($userId, $companyId);

        if (! $contact || ! $company) {
            throw new ModelNotFoundException('Contact or Company not found');
        }

        $this->contactRepository->attachCompany($contact, $companyId, $isPrimary);
    }

    public function detachCompanyFromContact(int $userId, int $contactId, int $companyId): void
    {
        $contact = $this->contactRepository->findForUser($userId, $contactId);

        if (! $contact) {
            throw new ModelNotFoundException('Contact not found');
        }

        $this->contactRepository->detachCompany($contact, $companyId);
    }

    public function getLeads(int $userId): Collection
    {
        return $this->contactRepository->getLeadsForUser($userId);
    }

    public function convertLeadToContact(int $userId, int $contactId): Contact
    {
        $contact = $this->contactRepository->findForUser($userId, $contactId);

        if (! $contact) {
            throw new ModelNotFoundException('Contact not found');
        }

        return $this->contactRepository->update($contact, ['status' => 'active']);
    }
}
