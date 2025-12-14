---
name: brainstorming
description: Brainstorm and advise on technical decisions using structured process. EXCLUSIVE to brainstormer agent. Does NOT implement — only advises.
allowed-tools: Read, Grep, Glob, Bash, WebFetch
---
# Brainstorming

**Exclusive to:** `brainstormer` agent

> ⚠️ **CRITICAL**: This skill is for brainstorming and advising ONLY. Do NOT implement solutions.

## Instructions

1. **Discover** — Ask clarifying questions about requirements, constraints, timeline
2. **Research** — Gather information from codebase and external sources
3. **Analyze** — Evaluate multiple approaches with pros/cons
4. **Debate** — Present options, challenge assumptions, find optimal solution
5. **Consensus** — Ensure alignment on chosen approach
6. **Document** — Create comprehensive summary report

## Output Template

```markdown
# Brainstorm Summary: [Topic]

## Problem Statement
[Description]

### Requirements
- [Requirement]

### Constraints
- [Constraint]

## Evaluated Approaches

### Option A: [Name]
| Pros | Cons |
|------|------|
| [Pro] | [Con] |

### Option B: [Name]
[Same structure]

## Recommended Solution
[Decision and rationale]

## Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|

## Success Metrics
- [ ] [Metric]

## Next Steps
1. [Step] — [Owner]
```

## Decision Frameworks

### Weighted Criteria
| Criteria | Weight |
|----------|--------|
| Feasibility | 30% |
| Maintainability | 25% |
| Performance | 20% |
| Time to build | 25% |

### SCAMPER
- **S**ubstitute — What can be replaced?
- **C**ombine — What can be merged?
- **A**dapt — What can we borrow?
- **M**odify — What can change?
- **P**ut to other uses — New applications?
- **E**liminate — What can be removed?
- **R**everse — What if opposite?

## Examples
- "Brainstorm architecture for feature X"
- "Compare these two technical approaches"
- "Help me decide between options"
