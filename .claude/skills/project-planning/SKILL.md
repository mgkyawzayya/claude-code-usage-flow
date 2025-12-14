---
name: project-planning
description: Create clear, step-by-step implementation plans with acceptance criteria. EXCLUSIVE to planner agent.
allowed-tools: Read, Grep, Glob, Bash
---
# Project Planning

**Exclusive to:** `planner` agent

## Instructions

### 1. Restate Goal
One sentence summary of what we're building.

### 2. Research
- Search codebase for similar patterns
- Identify affected files
- Note dependencies

### 3. Break Down
Create 3-5 phases, each independently testable.

## Estimation Techniques

### T-Shirt Sizing
| Size | Hours | Complexity |
|------|-------|------------|
| XS | 1-2 | Single file |
| S | 2-4 | Few files |
| M | 4-8 | Multiple files |
| L | 1-2 days | Multiple components |
| XL | 3-5 days | Full feature |

### Risk Multipliers
- Database migration: 1.5x
- Auth/security: 1.5x
- Third-party: 2x

## Risk Matrix

| Level | Criteria | Mitigation |
|-------|----------|------------|
| 🔴 High | Data loss, security, breaking | Rollback plan, staging |
| 🟡 Medium | Performance, UX regression | Feature flag |
| 🟢 Low | Cosmetic, refactor | Standard testing |

## Phase Template

```markdown
# Phase N: [Name]

## Objective
[What this accomplishes]

## Tasks
- [ ] Task with file path

## Files
| File | Action |
|------|--------|
| `path/file` | Create/Modify |

## Verification
```bash
[commands]
```

## Estimate
[X hours]
```

## plan.md Output (REQUIRED)

Always create a consolidated `plan.md` file that contains ALL phases and context:

```markdown
# Plan: [Feature Name]

## Context
[What we're building and why]

## Code Patterns to Follow
[Key patterns from codebase research]

## Phases
| # | Name | Objective | Est. |
|---|------|-----------|------|

---

## Phase 1: [Name]
### Objective
[Goal]

### Tasks
- [ ] Task with `path/to/file`

### Files
| File | Action |
|------|--------|

---

[... repeat for each phase ...]

---

## Summary
- **Total Phases**: N
- **Estimated Effort**: X hours
- **Key Risks**: [list]
```

## Examples
- "Plan a new settings page"
- "Create a migration plan for adding a column safely"
