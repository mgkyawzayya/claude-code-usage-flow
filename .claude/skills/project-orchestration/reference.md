# Project Orchestration Reference

## Agent Routing Decision Tree

```
Request
├── Bug/Error? → debugger
├── Review? → reviewer
├── Security? → security-expert
├── Test? → testing-expert
├── UI/UX? → ui-ux-designer
├── Database? → database-admin
├── Deploy? → devops-engineer
├── Research? → researcher
├── Plan? → planner
├── Brainstorm? → brainstormer
├── Implement? → fullstack-developer
└── Multi-domain? → project-manager
```

## Agent Roster

| Agent | Domain | Triggers |
|-------|--------|----------|
| `fullstack-developer` | Implementation | "implement", "build", "create" |
| `database-admin` | Data layer | "migration", "schema", "index" |
| `ui-ux-designer` | Interface | "UI", "component", "accessibility" |
| `planner` | Architecture | "plan", "design", "architect" |
| `researcher` | Research | "research", "compare" |
| `debugger` | Troubleshooting | "bug", "error", "fix" |
| `reviewer` | Quality | "review", "PR", "check" |
| `security-expert` | Security | "security", "vulnerability" |
| `testing-expert` | Testing | "test", "TDD", "coverage" |
| `brainstormer` | Ideation | "brainstorm", "idea" |
| `devops-engineer` | DevOps | "deploy", "Docker", "CI/CD" |

## Handoff Protocol

```markdown
## Handoff: [From Agent] → [To Agent]

### Completed
- [What was done]

### Deliverables
- [Files created/modified]

### Next Steps
- [What the next agent should do]

### Context
- [Important information to pass along]
```

## Task Breakdown Template

| # | Task | Agent | Dependencies |
|---|------|-------|--------------|
| 1 | Design | planner | none |
| 2 | Migration | database-admin | #1 |
| 3 | Backend | fullstack-developer | #2 |
| 4 | Frontend | fullstack-developer | #3 |
| 5 | Review | reviewer | #4 |
| 6 | Deploy | devops-engineer | #5 |
