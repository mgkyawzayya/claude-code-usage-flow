---
name: project-development-rules
description: Non-negotiable rules for all code changes. Read this before any implementation.
---
# Project Development Rules

These rules apply to ALL code changes in this repository.

## 🎯 Core Principles

### 1. Minimal Changes
- Change only what's necessary
- One concern per PR/commit
- No "while I'm here" changes

### 2. Follow Existing Patterns
- Find similar code first, copy the pattern
- Don't invent new abstractions
- Match existing style exactly

### 3. Fix Root Causes
- Don't fix symptoms
- Understand WHY something is broken
- Prevent recurrence with tests

---

## 🔒 Security Rules (Non-Negotiable)

### Secrets
- ❌ NEVER commit secrets, API keys, or credentials
- ❌ NEVER log sensitive data
- ✅ Use `.env` for all secrets
- ✅ Reference `config()` for configuration

### Authentication & Authorization
- ✅ Always check user permissions before actions
- ✅ Use Laravel policies for authorization
- ✅ Validate all user input with Form Requests
- ❌ NEVER trust client-side data

### Data Safety
- ✅ Use Eloquent/Query Builder (prevents SQL injection)
- ✅ Escape output in views (Blade does this automatically)
- ✅ Validate file uploads (type, size)
- ❌ NEVER use raw SQL with user input

---

## 🗄️ Database Rules

### Migrations
```php
// ✅ SAFE: Nullable or with default
$table->string('field')->nullable();
$table->boolean('active')->default(false);

// ❌ UNSAFE: NOT NULL without default on existing table
$table->string('field');  // Will fail if table has rows
```

### Always Include
- `down()` method for reversibility (when possible)
- Index on foreign keys
- Index on frequently filtered columns

### Red Flags
- ⚠️ `dropColumn()` — Requires data backup plan
- ⚠️ `renameColumn()` — Requires doctrine/dbal
- ⚠️ Changing column type — May lose data

---

## ⚛️ Frontend Rules

### React/TypeScript
```tsx
// ✅ DO: Type everything explicitly
interface Props {
  user: User;
  onSave: (data: FormData) => void;
}

// ❌ DON'T: Use 'any'
const data: any = response;  // Never do this
```

### Components
- ✅ Use existing shadcn/ui components
- ✅ Use Tailwind utility classes
- ❌ Don't create new color/spacing tokens
- ❌ Don't use inline styles

### State Management
- ✅ Use Inertia's shared data for global state
- ✅ Use React Query for async state (if installed)
- ✅ Use useState for local component state

---

## 🧪 Testing Rules

### When to Write Tests
- ✅ New feature → Feature test required
- ✅ Bug fix → Test that reproduces the bug
- ✅ Complex logic → Unit test

### Test Structure
```php
// tests/Feature/FeatureNameTest.php
it('does something specific', function () {
    // Arrange
    $user = User::factory()->create();
    
    // Act
    $response = $this->actingAs($user)
        ->post('/route', ['data' => 'value']);
    
    // Assert
    $response->assertStatus(200);
    $this->assertDatabaseHas('table', ['column' => 'value']);
});
```

### Running Tests
```bash
composer test                        # All tests
php artisan test --filter=TestName   # Specific test
php artisan test --parallel          # Parallel execution
```

---

## ✅ Pre-Commit Checklist

Before considering any work done:

```bash
# All must pass
composer test            # ✅ Tests
npm run types            # ✅ TypeScript
npm run lint             # ✅ ESLint
./vendor/bin/pint --test # ✅ PHP style
```

---

## 📁 File Organization

### Where Things Go

| Type | Location |
|------|----------|
| Routes | `routes/web.php`, `routes/settings.php` |
| Controllers | `app/Http/Controllers/` |
| Form Validation | `app/Http/Requests/` |
| Models | `app/Models/` |
| Single Actions | `app/Actions/` |
| Migrations | `database/migrations/` |
| React Pages | `resources/js/pages/` |
| React Components | `resources/js/components/` |
| TypeScript Types | `resources/js/types/` |
| Feature Tests | `tests/Feature/` |
| Unit Tests | `tests/Unit/` |

---

## 🚫 Never Do

1. ❌ Commit without running tests
2. ❌ Add TODO comments without creating a follow-up task
3. ❌ Disable TypeScript/ESLint rules without justification
4. ❌ Copy-paste code (extract to shared function instead)
5. ❌ Change unrelated files in same commit
6. ❌ Leave console.log or dd() in code
7. ❌ Skip error handling
8. ❌ Ignore failing tests
