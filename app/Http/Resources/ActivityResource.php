<?php

namespace App\Http\Resources;

use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ActivityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'type_label' => Activity::TYPES[$this->type] ?? $this->type,
            'subject' => $this->subject,
            'description' => $this->description,
            'scheduled_at' => $this->scheduled_at?->toISOString(),
            'completed_at' => $this->completed_at?->toISOString(),
            'status' => $this->status,
            'is_overdue' => $this->status === 'pending' && $this->scheduled_at && $this->scheduled_at->isPast(),
            'activityable_type' => class_basename($this->activityable_type),
            'activityable_id' => $this->activityable_id,
            'activityable' => $this->whenLoaded('activityable', function () {
                return match ($this->activityable_type) {
                    'App\\Models\\Contact' => new ContactResource($this->activityable),
                    'App\\Models\\Company' => new CompanyResource($this->activityable),
                    'App\\Models\\Deal' => new DealResource($this->activityable),
                    default => null,
                };
            }),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
