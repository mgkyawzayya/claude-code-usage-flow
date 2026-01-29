<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class PurchaseOrder extends Model
{
    use HasFactory, SoftDeletes;

    public const STATUS_DRAFT = 'draft';
    public const STATUS_SENT = 'sent';
    public const STATUS_RECEIVED = 'received';
    public const STATUS_CANCELLED = 'cancelled';

    public const STATUSES = [
        self::STATUS_DRAFT => 'Draft',
        self::STATUS_SENT => 'Sent',
        self::STATUS_RECEIVED => 'Received',
        self::STATUS_CANCELLED => 'Cancelled',
    ];

    protected $fillable = [
        'user_id',
        'supplier_id',
        'po_number',
        'status',
        'total',
        'order_date',
        'expected_date',
        'received_date',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'total' => 'decimal:2',
            'order_date' => 'date',
            'expected_date' => 'date',
            'received_date' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(PurchaseOrderItem::class);
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Generate a unique PO number using database-level locking to prevent race conditions.
     */
    public static function generatePoNumber(int $userId): string
    {
        return DB::transaction(function () use ($userId) {
            $prefix = 'PO';
            $date = now()->format('Ymd');

            $lastPo = static::where('user_id', $userId)
                ->whereDate('created_at', today())
                ->lockForUpdate()
                ->latest('id')
                ->first();

            $sequence = 1;
            if ($lastPo && preg_match('/-(\d{4})$/', $lastPo->po_number, $matches)) {
                $sequence = ((int) $matches[1]) + 1;
            }

            return sprintf('%s-%s-%04d', $prefix, $date, $sequence);
        });
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($purchaseOrder) {
            if (empty($purchaseOrder->po_number) && $purchaseOrder->user_id) {
                $purchaseOrder->po_number = static::generatePoNumber($purchaseOrder->user_id);
            }
        });
    }

    /**
     * Retrieve the model for a bound value (scoped to authenticated user).
     */
    public function resolveRouteBinding($value, $field = null): ?self
    {
        return $this->where($field ?? $this->getRouteKeyName(), $value)
            ->where('user_id', auth()->id())
            ->firstOrFail();
    }
}
