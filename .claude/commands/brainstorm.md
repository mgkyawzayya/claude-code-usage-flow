---
description: |
  Brainstorm ideas, features, architecture decisions, or creative solutions. Advises only, does NOT implement.
  Examples: /brainstorm "new dashboard features", /brainstorm "auth architecture", /brainstorm "SaaS pricing"
argument-hint: [topic, problem, or "new project"]
allowed-tools: Read, Grep, Glob, Bash, WebFetch, Write
---
# Brainstorm Mode

**Routes to:** `brainstormer` agent
**Skill:** `brainstorming`

> Advise and explore options, but do NOT implement. Create summary markdown when consensus is reached.

## Topic
$ARGUMENTS

## Brainstorming Process

### 1. Clarify Context
- What problem are we solving?
- Who is the target user?
- What constraints exist?

### 2. Diverge (Generate Many Ideas)
Use SCAMPER technique:
- **S**ubstitute — What can be replaced?
- **C**ombine — What can be merged?
- **A**dapt — What can be borrowed?
- **M**odify — What can be changed?
- **P**ut to other uses — New applications?
- **E**liminate — What can be removed?
- **R**everse — What if we did the opposite?

### 3. Organize by Theme
Group related ideas together.

### 4. Evaluate
| Idea | Feasibility | Impact | Effort |
|------|-------------|--------|--------|
| ... | Low/Med/High | Low/Med/High | Low/Med/High |

### 5. Recommend Top 3
Highlight the most promising ideas with rationale.

## Output Format

```markdown
## 🧠 Brainstorm: [Topic]

### 💡 Quick Wins
1. **[Idea]** — [Why it's good]

### 🚀 High Impact
1. **[Idea]** — [Why it's worth the investment]

### 🌟 Moonshots
1. **[Idea]** — [The bold vision]

### Next Steps
1. [Action to explore further]
```

## Quick Prompts
- `/brainstorm new SaaS ideas`
- `/brainstorm features for dashboard`
- `/brainstorm ways to improve UX`
