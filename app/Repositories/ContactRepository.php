<?php

namespace App\Repositories;

use App\Contracts\Repositories\ContactRepositoryInterface;
use App\Models\Contact;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class ContactRepository extends BaseRepository implements ContactRepositoryInterface
{
    public function __construct(Contact $model)
    {
        parent::__construct($model);
    }

    public function findForUser(int $userId, int $contactId): ?Contact
    {
        return $this->query()
            ->forUser($userId)
            ->with(['companies', 'deals'])
            ->find($contactId);
    }

    public function getAllForUser(int $userId): Collection
    {
        return $this->query()
            ->forUser($userId)
            ->with('companies')
            ->orderBy('first_name')
            ->get();
    }

    public function paginateForUser(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->query()
            ->forUser($userId)
            ->with('companies')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function searchForUser(int $userId, string $query): Collection
    {
        return $this->query()
            ->forUser($userId)
            ->where(function ($q) use ($query) {
                $q->where('first_name', 'like', "%{$query}%")
                    ->orWhere('last_name', 'like', "%{$query}%")
                    ->orWhere('email', 'like', "%{$query}%");
            })
            ->with('companies')
            ->limit(20)
            ->get();
    }

    public function getLeadsForUser(int $userId): Collection
    {
        return $this->query()
            ->forUser($userId)
            ->leads()
            ->with('companies')
            ->get();
    }

    public function attachCompany(Contact $contact, int $companyId, bool $isPrimary = false): void
    {
        $contact->companies()->attach($companyId, ['is_primary' => $isPrimary]);
    }

    public function detachCompany(Contact $contact, int $companyId): void
    {
        $contact->companies()->detach($companyId);
    }
}
