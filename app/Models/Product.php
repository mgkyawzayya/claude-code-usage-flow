<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $appends = ['current_price'];

    protected $fillable = [
        'user_id',
        'category_id',
        'sku',
        'name',
        'description',
        'barcode',
        'cost_price',
        'regular_price',
        'sale_price',
        'stock_quantity',
        'reorder_point',
        'reorder_quantity',
        'unit',
        'image_url',
        'is_active',
        'track_inventory',
    ];

    protected function casts(): array
    {
        return [
            'cost_price' => 'decimal:2',
            'regular_price' => 'decimal:2',
            'sale_price' => 'decimal:2',
            'is_active' => 'boolean',
            'track_inventory' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function stockMovements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }

    public function saleItems(): HasMany
    {
        return $this->hasMany(SaleItem::class);
    }

    public function suppliers(): BelongsToMany
    {
        return $this->belongsToMany(Supplier::class, 'product_supplier')
            ->withPivot('supplier_price', 'lead_time_days', 'is_preferred')
            ->withTimestamps();
    }

    protected function currentPrice(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->sale_price ?? $this->regular_price,
        );
    }

    protected function profitMargin(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->current_price > 0
                ? (($this->current_price - $this->cost_price) / $this->current_price) * 100
                : 0,
        );
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeLowStock($query)
    {
        return $query->where('track_inventory', true)
            ->whereColumn('stock_quantity', '<=', 'reorder_point');
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
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
