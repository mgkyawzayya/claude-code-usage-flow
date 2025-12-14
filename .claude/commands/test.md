---
description: |
  Run, write, and fix tests using TDD approach with Pest/Vitest/Playwright.
  Examples: /test, /test PostTest, /test "all", /test "coverage"
argument-hint: [test file, pattern, or "all"]
allowed-tools: Read, Edit, Bash, Grep, Glob
---
# Test Mode

**Routes to:** `testing-expert` agent
**Skill:** `testing`

> Follow TDD: Write test first, verify failure, implement, verify pass, refactor.

## Target
$ARGUMENTS

## TDD Workflow

1. **Write Test First**
   - Define expected behavior
   - Create failing test

2. **Verify Failure**
   ```bash
   php artisan test --filter=TestName
   ```

3. **Implement**
   - Write minimal code to pass

4. **Verify Pass**
   ```bash
   composer test
   ```

5. **Refactor**
   - Clean up while tests stay green

## Test Commands

### Laravel (Pest)
```bash
composer test                        # All tests
php artisan test --filter=PostTest   # Specific test
php artisan test --coverage          # Coverage report
php artisan test --parallel          # Parallel execution
```

### React (Vitest)
```bash
npm run test                         # All tests
npm run test:watch                   # Watch mode
npm run test:coverage                # Coverage report
npm run test -- PostForm             # Specific test
```

### E2E (Playwright)
```bash
npx playwright test                  # All E2E tests
npx playwright test --ui             # Interactive mode
npx playwright test login.spec.ts    # Specific test
```

## Output Format

```markdown
## 🧪 Test Results

### Summary
✅ X tests passed
❌ Y tests failed

### Failed Tests
1. `TestName` — [Error message]

### Coverage
- Lines: X%
- Functions: Y%

### Recommendations
- [ ] Add test for edge case
```

## Quick Actions

| Action | Command |
|--------|---------|
| Run all | `composer test && npm run test` |
| Watch | `npm run test:watch` |
| Coverage | `php artisan test --coverage` |
