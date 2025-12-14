<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContactResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->full_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'job_title' => $this->job_title,
            'notes' => $this->notes,
            'status' => $this->status,
            'companies' => $this->when($this->relationLoaded('companies'), fn() => CompanyResource::collection($this->companies)),
            'deals' => $this->when($this->relationLoaded('deals'), fn() => DealResource::collection($this->deals)),
            'activities' => $this->when($this->relationLoaded('activities'), fn() => ActivityResource::collection($this->activities)),
            'deals_count' => $this->when(isset($this->deals_count), $this->deals_count),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
