# Brainstorming Reference

## 6-Phase Process

```
Discovery → Research → Analysis → Debate → Consensus → Documentation
```

### Phase 1: Discovery Questions
- What problem are we solving?
- Who are the stakeholders?
- What are the constraints (time, budget, skills)?
- What does success look like?
- What has been tried before?

### Phase 2: Research Checklist
- [ ] Search codebase for similar patterns
- [ ] Review `docs/` for architecture context
- [ ] Check external best practices if needed
- [ ] Identify dependencies and risks

### Phase 3: Analysis Framework

| Criteria | Weight | Description |
|----------|--------|-------------|
| Feasibility | 30% | Can we build it with current skills/time? |
| Maintainability | 25% | Will it be easy to change later? |
| Performance | 20% | Will it scale and perform well? |
| Time to build | 25% | How long to implement? |

### Phase 4: Debate Prompts
- "Have we considered...?"
- "What if we need to change this later?"
- "What's the worst case scenario?"
- "Is this the simplest solution?"

### Phase 5: Consensus Checklist
- [ ] All stakeholders agree on approach
- [ ] Key decisions documented
- [ ] Risks acknowledged and mitigated
- [ ] Success criteria defined

### Phase 6: Documentation Template
See output template in SKILL.md

## SCAMPER Technique

| Letter | Question | Example |
|--------|----------|---------|
| **S**ubstitute | What can be replaced? | Replace email auth with OAuth |
| **C**ombine | What can be merged? | Merge dashboard + analytics |
| **A**dapt | What can we borrow? | Adapt Notion's block editor |
| **M**odify | What can change? | Make mobile-first |
| **P**ut to other uses | New use cases? | Use for internal tools |
| **E**liminate | What can be removed? | Remove user registration |
| **R**everse | Do the opposite? | User generates content for AI |

## Idea Evaluation Matrix

| Criteria | Score 1-5 | Notes |
|----------|-----------|-------|
| Feasibility | | Can we build it? |
| Desirability | | Do users want it? |
| Viability | | Is it sustainable? |
| Novelty | | Is it differentiated? |
| Risk | | What could go wrong? |

## Red Flags to Challenge

| Flag | Challenge |
|------|-----------|
| Premature optimization | "Do we have evidence this is a bottleneck?" |
| Overengineering | "What's the simplest thing that could work?" |
| Following trends | "Why is this better than the boring solution?" |
| Ignoring debt | "How will this affect future development?" |
| Underestimating | "What's the hidden complexity here?" |

## Output Report Structure

```markdown
# Brainstorm Summary: [Topic]

## Problem Statement
[Clear description]

### Requirements
- [Requirement 1]

### Constraints
- [Constraint 1]

## Evaluated Approaches

### Option A: [Name]
**Description**: [What it is]

| Pros | Cons |
|------|------|
| [Pro 1] | [Con 1] |

**Effort**: Low/Medium/High
**Risk**: Low/Medium/High

### Option B: [Name]
[Same structure]

## Recommended Solution

### Decision
[Which approach]

### Rationale
1. [Reason 1]
2. [Reason 2]

## Implementation Considerations

### Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| [Risk] | [Impact] | [How to address] |

### Dependencies
- [Dependency 1]

## Success Metrics
- [ ] [Metric 1]
- [ ] [Metric 2]

## Next Steps
1. [Step 1] — [Owner/Agent]
2. [Step 2] — [Owner/Agent]
```
