---
description: |
  Implement code based on a generated plan. Execute phases in order with verification.
  Examples: /code plan/user-auth-20241214, /code plan/comments --phase 1
argument-hint: <plan-folder-path> [--phase <N>]
allowed-tools: Read, Edit, Bash, WebFetch, Write, Grep, Glob
---
# Code Command

**Routes to:** `fullstack-developer` agent
**Skill:** `fullstack-implementation`

> Read plan.md first, then execute each phase with verification. Update phase status after completion.

Implement plan: **$ARGUMENTS**

## Purpose

Execute implementation based on a previously generated plan in the `plan/` folder.

## Usage

```bash
# Implement entire plan (all phases)
/code plan/user-auth-20241214-153042

# Implement specific phase only
/code plan/user-auth-20241214-153042 --phase 1

# Implement from current phase onwards
/code plan/user-auth-20241214-153042 --from 2
```

## Step 1: Load Context

First, read project documentation for context:

```bash
# Project docs (source of truth)
cat docs/code-standards.md      # Coding conventions to follow
cat docs/codebase-summary.md    # Current structure and patterns
cat docs/system-architecture.md # Design patterns to maintain
```

Then read the plan structure:

```bash
# Plan contents
ls -la $1/
ls -la $1/research/
ls -la $1/phases/
```

Load and understand:
1. `README.md` — Overall goals and scope
2. `research/*.md` — Background context and patterns
3. `phases/phase-*.md` — Implementation details

## Step 2: Review Research

Before coding, review the research folder:

- `research/requirements.md` — What are we building?
- `research/existing-code.md` — What patterns to follow?
- `research/references.md` — Best practices to apply

## Step 3: Execute Phases

### Phase Execution Order

```
For each phase in phases/:
  1. Read phase file
  2. Check prerequisites
  3. Implement tasks in order
  4. Run verification commands
  5. Mark phase complete
  6. Update plan status
```

### Implementation Order (Per Phase)

Follow this order within each phase:

#### Backend First
1. **Migrations** — Database schema changes
   ```bash
   php artisan make:migration create_[table]_table
   ```

2. **Models** — Eloquent models with relationships
   ```bash
   php artisan make:model [Name]
   ```

3. **Form Requests** — Validation rules
   ```bash
   php artisan make:request [Name]Request
   ```

4. **Controllers** — Business logic
   ```bash
   php artisan make:controller [Name]Controller
   ```

5. **Routes** — API/web routes
   - Add to `routes/web.php` or `routes/api.php`

#### Frontend Second
6. **Types** — TypeScript interfaces
   - Add to `resources/js/types/`

7. **Components** — Reusable UI components
   - Add to `resources/js/components/`

8. **Pages** — Inertia page components
   - Add to `resources/js/pages/`

#### Tests Last
9. **Feature Tests** — Integration tests
   ```bash
   php artisan make:test [Name]Test
   ```

10. **Type Check** — Ensure TypeScript passes
    ```bash
    npm run types
    ```

## Step 4: Verification After Each Phase

Run these checks after completing each phase:

```bash
# Required verifications
php artisan migrate          # Migrations work
composer test                # All tests pass
npm run types                # TypeScript OK
npm run lint                 # ESLint OK
./vendor/bin/pint --test     # PHP style OK
```

## Step 5: Update Plan Status

After completing each phase, update the plan:

### Update README.md
```markdown
**Status:** In Progress → Phase 2 of 4

## Progress
- [x] Phase 1: Database Setup ✅
- [ ] Phase 2: Backend API (in progress)
- [ ] Phase 3: Frontend Components
- [ ] Phase 4: Tests & Polish
```

### Update Phase File
```markdown
# Phase 1: Database Setup

**Status:** ✅ Completed
**Completed:** 2024-12-14 15:45

## Tasks
- [x] Create users migration
- [x] Create posts migration
- [x] Add relationships to models
```

## Step 6: Handle Blockers

If implementation encounters issues:

1. **Research Needed**
   ```bash
   /research [blocking topic] --plan [plan-folder]
   ```

2. **Plan Revision Needed**
   - Update phase file with new approach
   - Add notes about why change was needed

3. **Skip and Continue**
   - Mark task as blocked with reason
   - Continue with non-dependent tasks

## Step 7: Completion Report

After all phases complete:

```markdown
## ✅ Implementation Complete

**Plan:** `[plan-folder]`
**Phases Completed:** [N] of [N]

### Summary
[Brief description of what was built]

### Files Created/Modified
| File | Action | Description |
|------|--------|-------------|
| `app/Models/Post.php` | Created | Post model with relationships |
| `database/migrations/...` | Created | Posts table schema |
| `resources/js/pages/Posts/Index.tsx` | Created | Posts listing page |

### Verification Results
```bash
✅ php artisan migrate — Success
✅ composer test — 42 tests, 0 failures
✅ npm run types — No errors
✅ npm run lint — No warnings
✅ ./vendor/bin/pint --test — OK
```

### How to Test
1. [Manual test step 1]
2. [Manual test step 2]

### Documentation Updates Needed
- [ ] Update `docs/codebase-summary.md` with new files/models
- [ ] Update `docs/system-architecture.md` if patterns changed
- [ ] Update `docs/code-standards.md` if new conventions introduced

### Follow-up Tasks
- [ ] [Any remaining work]
- [ ] [Future enhancements noted during implementation]
```

## Quick Reference

| Flag | Description |
|------|-------------|
| `--phase N` | Execute only phase N |
| `--from N` | Execute from phase N onwards |
| `--dry-run` | Show what would be done without doing it |
| `--skip-tests` | Skip test verification (not recommended) |
