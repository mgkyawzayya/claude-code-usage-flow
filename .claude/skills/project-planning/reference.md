# Project Planning Reference

## Estimation Techniques

### T-Shirt Sizing
| Size | Hours | Complexity |
|------|-------|------------|
| XS | 1-2 | Single file change |
| S | 2-4 | Few files |
| M | 4-8 | Multiple files |
| L | 1-2 days | Multiple components |
| XL | 3-5 days | Full feature |

### Risk Multipliers
| Factor | Multiplier |
|--------|------------|
| Database migration | 1.5x |
| Auth/security | 1.5x |
| Third-party API | 2x |
| New technology | 2x |

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

## plan.md — Consolidated Output (ALWAYS CREATE)

This file is the single source of truth for other agents:

```markdown
# Plan: [Feature Name]

## Context
[What we're building and why]

## Code Patterns
[Key patterns from codebase to follow]

## Phases
| # | Name | Objective | Est. |
|---|------|-----------|------|
| 1 | ... | ... | Xh |

---

## Phase 1: [Name]
### Objective
[Goal]

### Tasks
- [ ] Task with `path/to/file`

### Files
| File | Action |
|------|--------|

### Verification
```bash
[commands]
```

---

## Summary
- **Total Phases**: N
- **Estimated Effort**: X hours
- **Key Risks**: [list]
- **Dependencies**: [list]
```

## Dependency Analysis

```
Feature A
├── API endpoint (backend)
│   ├── Migration
│   ├── Model
│   └── Controller
└── UI (frontend)
    ├── Types
    ├── Page
    └── Components
```

Build order: Migration → Model → Controller → Types → Components → Page
