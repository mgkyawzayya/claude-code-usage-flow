---
name: primary-workflow
description: The default workflow for all development tasks. Follow this unless a specific workflow is requested.
---
# Primary Development Workflow

This is the standard process for any development task in this repository.

## Mandatory Verification

Every task MUST pass these checks before completion:
```bash
composer test           # All PHP tests pass
npm run types          # No TypeScript errors
npm run lint           # No linting errors
./vendor/bin/pint --test   # PHP style OK
```

**Never report completion until all checks pass.**

## Phase 1: Understand 🎯
**Goal:** Ensure you know exactly what to build

1. Read the request carefully
2. Check `CLAUDE.md` for project context
3. Ask max 2 clarifying questions if genuinely ambiguous
4. Restate the goal in one sentence

**Output:** Clear goal statement

## Phase 2: Investigate 🔍
**Goal:** Understand current state before changing anything

1. Find similar existing code (patterns to follow)
2. Identify all files that need to change
3. Check for existing tests to understand expected behavior
4. Note any constraints (auth, permissions, existing API contracts)

**Commands:**
```bash
# Find similar patterns
grep -r "pattern" --include="*.php" app/
grep -r "pattern" --include="*.tsx" resources/js/

# Check existing tests
grep -r "test description" tests/
```

**Output:** List of files to modify and patterns to follow

## Phase 3: Plan 📋
**Goal:** Design the minimal change set

1. List specific changes per file
2. Order changes by dependencies
3. Identify risks (DB changes, auth, breaking changes)
4. Define acceptance criteria

**For complex work:** Use `/plan` command or delegate to `planner` agent

**Output:** Implementation checklist

## Phase 4: Implement ⚡
**Goal:** Write the code

**Order of operations:**
1. Backend: Route → Controller → Request → Model → Migration
2. Frontend: Types → Components → Page
3. Tests: Write test → Verify it fails → Implement → Verify it passes

**Rules:**
- One concern per commit
- Follow existing patterns exactly
- Keep diffs minimal
- No unrelated changes

## Phase 5: Verify ✅
**Goal:** Ensure everything works

```bash
# Required checks
composer test                    # All tests pass
npm run types                    # No TypeScript errors
npm run lint                     # No ESLint errors
./vendor/bin/pint --test         # PHP style OK

# If database changed
php artisan migrate:fresh --seed  # Clean migration works
```

**All checks must pass before considering done.**

## Phase 6: Document 📝
**Goal:** Keep docs in sync with code

**Update docs if:**
- [ ] New feature added → Update relevant docs
- [ ] API changed → Update `docs/api.md`
- [ ] Config/env changed → Update `docs/deployment.md`
- [ ] Database changed → Update `docs/database.md`

## Phase 7: Report 📊
**Goal:** Summarize what was done

```markdown
## Done
[One sentence summary]

## Changes
| File | Change |
|------|--------|
| ... | ... |

## Verification
✅ Tests pass
✅ Types pass  
✅ Lint passes

## Follow-ups
- [ ] [Any remaining work]
```

---

## Quick Reference

| Step | Question to Answer |
|------|-------------------|
| Understand | What exactly am I building? |
| Investigate | What exists now? What patterns to follow? |
| Plan | What's the minimal change set? |
| Implement | Is this following existing patterns? |
| Verify | Do all checks pass? |
| Document | Are docs still accurate? |
| Report | What changed and how to verify? |
