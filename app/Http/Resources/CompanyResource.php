<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompanyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'website' => $this->website,
            'industry' => $this->industry,
            'address' => $this->address,
            'notes' => $this->notes,
            'contacts' => $this->when($this->relationLoaded('contacts'), fn() => ContactResource::collection($this->contacts)),
            'deals' => $this->when($this->relationLoaded('deals'), fn() => DealResource::collection($this->deals)),
            'activities' => $this->when($this->relationLoaded('activities'), fn() => ActivityResource::collection($this->activities)),
            'contacts_count' => $this->when(isset($this->contacts_count), $this->contacts_count),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
