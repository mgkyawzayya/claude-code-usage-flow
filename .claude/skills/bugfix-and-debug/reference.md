# Bugfix and Debug Reference

## Laravel Error Patterns

| Error | Cause | Solution |
|-------|-------|----------|
| `ModelNotFoundException` | Record not found | Check ID, use `findOrFail` |
| `ValidationException` | Invalid input | Check FormRequest rules |
| `AuthorizationException` | Policy denied | Check policy method |
| `QueryException` | SQL error | Check migration/schema |
| `TokenMismatchException` | CSRF failed | Add `@csrf` to form |
| `BindingResolutionException` | DI failed | Check service provider |

## React/TypeScript Error Patterns

| Error | Cause | Solution |
|-------|-------|----------|
| `Cannot read property of undefined` | Null access | Add `?.` optional chaining |
| `Type 'X' is not assignable` | Type mismatch | Fix types/interface |
| `Hooks can only be called...` | Hook outside component | Move hook to component top |
| `Hydration failed` | SSR/client mismatch | Use `useEffect` for client-only |

## Debugging Commands

### Laravel
```bash
# Interactive debugging
php artisan tinker

# Watch logs
tail -f storage/logs/laravel.log

# Check routes
php artisan route:list --compact

# Check migrations
php artisan migrate:status

# Clear all caches
php artisan optimize:clear
```

### Frontend
```bash
# TypeScript errors
npm run types

# Lint check
npm run lint

# Build for errors
npm run build
```

### Git
```bash
# Recent changes
git log --oneline -10

# Diff from last 3 commits
git diff HEAD~3

# Find when line changed
git blame path/to/file.php
```

## Debugging Strategy

1. **Reproduce** — Get exact error and steps
2. **Isolate** — Find the smallest reproduction
3. **Hypothesize** — List possible causes
4. **Test** — Verify each hypothesis
5. **Fix** — Apply minimal fix
6. **Verify** — Test fix works
7. **Prevent** — Add test for regression

## Common Fixes

### N+1 Query
```php
// ❌ Problem
foreach (Post::all() as $post) {
    echo $post->user->name;
}

// ✅ Fix
foreach (Post::with('user')->get() as $post) {
    echo $post->user->name;
}
```

### Null Reference
```tsx
// ❌ Problem
const name = user.profile.name;

// ✅ Fix
const name = user?.profile?.name ?? 'Unknown';
```

### Missing Migration
```bash
# Check status
php artisan migrate:status

# Run pending
php artisan migrate

# Rollback and retry
php artisan migrate:rollback
php artisan migrate
```
