---
name: orchestration-protocol
description: How to coordinate between specialized agents for multi-domain work.
---
# Orchestration Protocol

Use this when work spans multiple specialties (frontend + backend + database, etc.).

## Agent Roster (Complete)

| Agent | Specialty | Triggers | Model |
|-------|-----------|----------|-------|
| `planner` | Architecture & Planning | "plan", "design", "architect" | Opus |
| `project-manager` | Coordination & Docs | "coordinate", "scope", "update docs" | Sonnet |
| `fullstack-developer` | Implementation | "implement", "build", "create" | Sonnet |
| `database-admin` | Data Layer | "migration", "schema", "index" | Sonnet |
| `ui-ux-designer` | Interface | "UI", "component", "accessibility" | Sonnet |
| `researcher` | External Knowledge | "research", "compare", "best practice" | Opus |
| `debugger` | Bug Fixing | "bug", "error", "fix", "debug" | Sonnet |
| `reviewer` | Code Review | "review", "PR", "check code" | Sonnet |
| `testing-expert` | Testing & TDD | "test", "TDD", "coverage" | Sonnet |
| `security-expert` | Security Audits | "security", "vulnerability", "OWASP" | Sonnet |
| `devops-engineer` | Infrastructure | "deploy", "docker", "CI/CD" | Sonnet |
| `brainstormer` | Technical Advising | "brainstorm", "options", "pros/cons" | Sonnet |

## Delegation Decision Tree

```
Is scope clear?
├── No → planner (create plan first)
└── Yes → Does it involve DB schema?
    ├── Yes → database-admin (design migration)
    │   └── Then → fullstack-developer (implement)
    └── No → Is it primarily UI?
        ├── Yes → ui-ux-designer (design components)
        │   └── Then → fullstack-developer (implement)
        └── No → fullstack-developer (implement)
```

## Handoff Format

When delegating to an agent, provide:

```markdown
## Task for [agent-name]

### Goal
[One sentence]

### Context
- Related files: [list]
- Existing patterns: [reference]
- Constraints: [any limitations]

### Acceptance Criteria
- [ ] [Specific, testable criteria]

### Output Expected
[What should the agent return]
```

## Coordination Patterns

### Pattern 1: Feature Development
```
1. planner → Create implementation plan
2. database-admin → Design/create migrations (if needed)
3. fullstack-developer → Implement backend
4. fullstack-developer → Implement frontend
5. fullstack-developer → Write tests
6. project-manager → Update documentation
```

### Pattern 2: Bug Fix
```
1. fullstack-developer → Investigate and fix
2. database-admin → (if DB-related)
3. fullstack-developer → Add regression test
```

### Pattern 3: UI Enhancement
```
1. ui-ux-designer → Design component/flow
2. fullstack-developer → Implement
3. ui-ux-designer → Accessibility review
```

### Pattern 4: Research-First Task
```
1. researcher → Gather best practices
2. planner → Create plan using research
3. fullstack-developer → Implement
```

### Pattern 5: Security-Sensitive Feature
```
1. planner → Create plan with security requirements
2. security-expert → Review plan for vulnerabilities
3. fullstack-developer → Implement with security guidance
4. security-expert → Final security audit
5. reviewer → Code review
```

### Pattern 6: Pre-Deployment
```
1. reviewer → Code review changes
2. testing-expert → Ensure test coverage
3. security-expert → Security audit
4. devops-engineer → Deploy
```

## Conflict Resolution

If agents suggest conflicting approaches:

1. **Prefer existing patterns** — What does the codebase already do?
2. **Prefer simpler** — Choose the approach with fewer moving parts
3. **Prefer reversible** — Choose the approach that's easier to undo
4. **Document the decision** — Note why this approach was chosen

## Communication Rules

- Keep handoffs concise
- Include specific file paths when relevant
- State assumptions explicitly
- Ask for clarification if blocked (don't guess)

## Progress Reporting

For multi-step work, report progress:

```markdown
## Progress Update

### Completed
- [x] Step 1: [description]
- [x] Step 2: [description]

### In Progress
- [ ] Step 3: [description] — [current status]

### Blocked (if any)
- [ ] Step 4: [what's blocking]

### Next
[What happens next]
```
