<?php

namespace App\Http\Resources;

use App\Models\Deal;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DealResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'value' => $this->value,
            'value_formatted' => $this->value ? '$'.number_format($this->value, 2) : null,
            'stage' => $this->stage,
            'stage_label' => Deal::STAGES[$this->stage] ?? $this->stage,
            'probability' => $this->probability,
            'weighted_value' => $this->weighted_value,
            'expected_close_date' => $this->expected_close_date?->toDateString(),
            'actual_close_date' => $this->actual_close_date?->toDateString(),
            'notes' => $this->notes,
            'is_open' => $this->isOpen(),
            'is_closed' => $this->isClosed(),
            'contact' => $this->when($this->relationLoaded('contact'), fn() => new ContactResource($this->contact)),
            'company' => $this->when($this->relationLoaded('company'), fn() => new CompanyResource($this->company)),
            'activities' => $this->when($this->relationLoaded('activities'), fn() => ActivityResource::collection($this->activities)),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
