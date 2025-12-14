# Security Review Reference

## OWASP Top 10 (2021)

### A01: Broken Access Control
```php
// ❌ Bad: Direct object reference
Route::get('/posts/{id}', function ($id) {
    return Post::findOrFail($id); // No auth check!
});

// ✅ Good: Use policies
Route::get('/posts/{post}', function (Post $post) {
    $this->authorize('view', $post);
    return $post;
});
```

### A03: Injection
```php
// ❌ Bad: SQL Injection
DB::select("SELECT * FROM users WHERE email = '$email'");

// ✅ Good: Parameterized query
DB::select('SELECT * FROM users WHERE email = ?', [$email]);
User::where('email', $email)->first();
```

### A07: XSS Prevention
```tsx
// ❌ Bad: XSS vulnerability
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ Good: Auto-escaped
<div>{userInput}</div>

// ✅ Good: Sanitized if HTML needed
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
```

## Laravel Security Patterns

### CSRF Protection
```blade
<form method="POST" action="/posts">
    @csrf
    <!-- form fields -->
</form>
```

### Mass Assignment Protection
```php
// ✅ Whitelist fillable
protected $fillable = ['title', 'content'];

// ✅ Or blacklist guarded
protected $guarded = ['id', 'is_admin'];
```

### Authorization
```php
// Policy
class PostPolicy
{
    public function update(User $user, Post $post): bool
    {
        return $user->id === $post->user_id;
    }
}

// Controller
$this->authorize('update', $post);
```

### Validation
```php
class StorePostRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users'],
            'url' => ['required', 'url', 'active_url'],
        ];
    }
}
```

## Security Audit Commands

```bash
# Check PHP dependencies
composer audit

# Check JS dependencies
npm audit

# Find hardcoded secrets
grep -r "password\|secret\|api_key" --include="*.php" --include="*.env*" .

# List routes and middleware
php artisan route:list --compact
```

## Security Headers

```php
// In middleware or config
return $next($request)
    ->header('X-Frame-Options', 'DENY')
    ->header('X-Content-Type-Options', 'nosniff')
    ->header('X-XSS-Protection', '1; mode=block')
    ->header('Strict-Transport-Security', 'max-age=31536000');
```
