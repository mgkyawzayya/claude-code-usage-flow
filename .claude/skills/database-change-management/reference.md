# Database Change Management Reference

## Migration Patterns

### Create Table
```php
Schema::create('posts', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->string('title');
    $table->text('content');
    $table->timestamp('published_at')->nullable();
    $table->timestamps();
    
    // Indexes
    $table->index('published_at');
    $table->index(['user_id', 'created_at']);
});
```

### Add Column (Safe)
```php
// ✅ Safe: nullable or with default
Schema::table('posts', function (Blueprint $table) {
    $table->string('slug')->nullable()->after('title');
});

// Then backfill
Post::whereNull('slug')->chunkById(1000, function ($posts) {
    foreach ($posts as $post) {
        $post->update(['slug' => Str::slug($post->title)]);
    }
});

// Then make required (separate migration)
Schema::table('posts', function (Blueprint $table) {
    $table->string('slug')->nullable(false)->change();
    $table->unique('slug');
});
```

### Drop Column (Safe)
```php
// Step 1: Stop using column in code
// Step 2: Deploy code change
// Step 3: Create migration to drop column
Schema::table('posts', function (Blueprint $table) {
    $table->dropColumn('deprecated_field');
});
```

## Eloquent Relationships

### One-to-Many
```php
// User model
public function posts(): HasMany
{
    return $this->hasMany(Post::class);
}

// Post model
public function user(): BelongsTo
{
    return $this->belongsTo(User::class);
}
```

### Many-to-Many
```php
// Post model
public function tags(): BelongsToMany
{
    return $this->belongsToMany(Tag::class)
        ->withTimestamps()
        ->withPivot('order');
}
```

### Polymorphic
```php
// Comment model (commentable)
public function commentable(): MorphTo
{
    return $this->morphTo();
}

// Post model
public function comments(): MorphMany
{
    return $this->morphMany(Comment::class, 'commentable');
}
```

## Query Optimization

### Eager Loading
```php
// ❌ N+1 Problem
$posts = Post::all();
foreach ($posts as $post) {
    echo $post->user->name; // Query per post!
}

// ✅ Eager Load
$posts = Post::with(['user', 'tags'])->get();
```

### Query Scopes
```php
// Model
public function scopePublished(Builder $query): Builder
{
    return $query->whereNotNull('published_at')
        ->where('published_at', '<=', now());
}

// Usage
Post::published()->get();
```

### Index Strategy
| Query Pattern | Index |
|---------------|-------|
| `WHERE user_id = ?` | `index('user_id')` |
| `WHERE status = ? ORDER BY created_at` | `index(['status', 'created_at'])` |
| `WHERE slug = ?` | `unique('slug')` |

## Common Pitfalls

| ❌ Don't | ✅ Do |
|----------|------|
| Add NOT NULL column to existing table | Add nullable, backfill, then alter |
| Drop column without checking usage | Search codebase first |
| Create migration without `down()` | Always define rollback |
| Use raw SQL with user input | Use query builder or Eloquent |
