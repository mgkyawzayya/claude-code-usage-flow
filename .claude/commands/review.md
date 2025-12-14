---
description: |
  Review code for quality, security, and correctness. Use before commits or merges.
  Examples: /review, /review "auth changes", /review "performance"
argument-hint: [optional: specific focus area]
allowed-tools: Bash(git:*), Read, Grep, Glob
---
# Code Review Mode

**Routes to:** `reviewer` agent
**Skill:** `code-review-checklist`

> All critical findings MUST be resolved before merge. Run verification commands at the end.

## Context (auto-gathered)
- **Branch:** !`git branch --show-current`
- **Status:** !`git status --short`
- **Recent commits:** !`git log --oneline -5`

## Changes to Review
!`git diff HEAD --stat`

---

## Review Focus
$ARGUMENTS

## Review Checklist

### ✅ Correctness
- [ ] Logic is correct and handles edge cases
- [ ] Error handling is appropriate
- [ ] Types are correct (no `any` unless justified)
- [ ] Tests cover the new/changed behavior

### 🔒 Security
- [ ] No secrets or credentials in code
- [ ] User input is validated/sanitized
- [ ] Authorization checks are in place
- [ ] No SQL injection risks (use Eloquent/query builder)
- [ ] No XSS risks (proper escaping)

### ⚡ Performance
- [ ] No N+1 queries (use eager loading)
- [ ] No unnecessary database calls
- [ ] Large datasets are paginated
- [ ] Indexes exist for filtered/joined columns

### 🧹 Maintainability
- [ ] Code follows existing patterns
- [ ] Names are clear and consistent
- [ ] No unnecessary complexity
- [ ] DRY — no copy-paste duplication

### 🎨 Frontend (if applicable)
- [ ] Components use existing UI primitives
- [ ] Loading and error states handled
- [ ] Accessible (keyboard nav, labels, contrast)
- [ ] Responsive (mobile + desktop)

### 📝 Documentation
- [ ] Code comments for non-obvious logic
- [ ] Docs updated if behavior changed
- [ ] Types are documented

---

## Output Format

```markdown
## 🔍 Review Summary
[One paragraph overview]

## 🚨 Critical (must fix before merge)
1. [Issue]: [File:Line] — [Why it's critical]

## ⚠️ Warnings (should fix)
1. [Issue]: [File:Line] — [Recommendation]

## 💡 Suggestions (nice to have)
1. [Suggestion]: [File:Line] — [Why it would improve code]

## ✅ What's Good
- [Positive observation]

## 📋 Pre-merge Checklist
- [ ] All critical issues resolved
- [ ] Tests pass: `composer test`
- [ ] Types pass: `npm run types`
- [ ] Lint passes: `npm run lint`
```

## Commands to Verify
```bash
composer test            # Tests pass
npm run types            # Type check
npm run lint             # Lint check
./vendor/bin/pint --test # PHP style
```
