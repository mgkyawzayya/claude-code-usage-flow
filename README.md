# Claude Code Project Setup

A comprehensive `.claude/` configuration for AI-assisted development with Claude Code, optimized for Laravel 12 + React 19 + Inertia.js projects.

## Quick Setup

Copy the `.claude/` folder to your project:

```bash
cp -r .claude /path/to/your-project/
```

## Folder Structure

```
.claude/
├── commands/         # Slash commands (/plan, /docs, /test, etc.)
├── agents/           # Specialized AI agents (12 agents)
├── skills/           # Reusable skill definitions (13 skills)
└── workflows/        # Development workflows and protocols
```

---

## Available Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/plan <feature>` | Create structured implementation plan with phases | `/plan user-authentication` |
| `/code <plan-folder>` | Implement code from a generated plan | `/code plan/user-auth-20241214 --phase 1` |
| `/docs <action>` | Generate/update project documentation | `/docs init`, `/docs update` |
| `/test [target]` | Run, write, and fix tests (TDD approach) | `/test`, `/test PostTest` |
| `/review [focus]` | Code review for quality and security | `/review`, `/review "auth changes"` |
| `/fix <error>` | Debug and fix bugs with minimal changes | `/fix "500 error on login"` |
| `/security [area]` | Security audit (OWASP Top 10) | `/security`, `/security "auth flow"` |
| `/deploy <task>` | DevOps, Docker, CI/CD, infrastructure | `/deploy "docker setup"` |
| `/research <topic>` | Research using Gemini CLI | `/research "Laravel Sanctum"` |
| `/brainstorm <topic>` | Ideation and technical advice (no implementation) | `/brainstorm "dashboard features"` |

---

## Command Details

### `/plan <feature-name>`

Creates a comprehensive implementation plan with research and phases.

```bash
/plan user-authentication
/plan "add comments feature"
/plan dashboard-redesign
```

**Creates:**
```
plan/
└── user-authentication-YYYYMMDD-HHMMSS/
    ├── README.md           # Plan overview
    ├── plan.md             # Consolidated plan (all phases)
    ├── research/           # Requirements, existing code analysis
    └── phases/             # Phase-by-phase implementation
```

### `/code <plan-folder> [--phase N]`

Implements code from a previously generated plan.

```bash
/code plan/user-auth-20241214-153042           # All phases
/code plan/user-auth-20241214-153042 --phase 1 # Specific phase
/code plan/user-auth-20241214-153042 --from 2  # From phase 2 onwards
```

### `/docs <init|update|summarize>`

Manages project documentation.

```bash
/docs init              # Create initial documentation
/docs update            # Update all docs
/docs update codebase   # Update specific doc
/docs summarize         # Generate README summary
```

**Creates in `docs/`:**
- `project-overview-pdr.md` — Project overview and PDR
- `codebase-summary.md` — File structure and key files
- `code-standards.md` — Conventions and patterns
- `system-architecture.md` — System design

### `/test [target]`

Runs and writes tests using TDD approach.

```bash
/test                    # Run all tests
/test PostTest           # Run specific test
/test "coverage"         # Run with coverage
```

**Supports:**
- Laravel/Pest: `composer test`
- React/Vitest: `npm run test`
- E2E/Playwright: `npx playwright test`

### `/review [focus]`

Code review before commits or merges.

```bash
/review                  # Review all changes
/review "auth changes"   # Focus on auth
/review "performance"    # Performance focus
```

**Checks:** Correctness, Security, Performance, Maintainability, Accessibility

### `/fix <error>`

Debug and fix bugs with minimal, targeted changes.

```bash
/fix "500 error on login"
/fix PostTest
/fix "TypeError in dashboard"
```

**Process:** Reproduce → Investigate → Hypothesize → Fix → Add regression test

### `/security [area]`

Security audit using OWASP Top 10 guidelines.

```bash
/security                          # Full audit
/security "auth flow"              # Focus on auth
/security app/Http/Controllers     # Specific folder
```

**Runs:** `composer audit`, `npm audit`, and manual code review

### `/deploy <task>`

DevOps, Docker, and infrastructure tasks.

```bash
/deploy "docker setup"
/deploy "github actions"
/deploy "harden server"
```

### `/research <topic>`

Research topics using Gemini CLI.

```bash
/research "user authentication best practices"
/research "Laravel Sanctum" --plan plan/auth-20241214
```

### `/brainstorm <topic>`

Brainstorm ideas and solutions (advises only, no implementation).

```bash
/brainstorm "new dashboard features"
/brainstorm "auth architecture"
/brainstorm "SaaS pricing models"
```

---

## Specialized Agents

| Agent | Purpose | Triggered By |
|-------|---------|--------------|
| `planner` | Technical planning and architecture design | `/plan` |
| `fullstack-developer` | Code implementation (Laravel + React) | `/code`, "implement", "build" |
| `testing-expert` | Writing and managing tests (TDD) | `/test`, "test", "coverage" |
| `reviewer` | Code review and quality checks | `/review`, "review", "PR" |
| `debugger` | Bug investigation and fixes | `/fix`, "bug", "error", "fix" |
| `security-expert` | Security audits (OWASP compliance) | `/security`, "vulnerability" |
| `database-admin` | Schema, migrations, query optimization | "migration", "schema", "index" |
| `ui-ux-designer` | UI/UX implementation, accessibility | "UI", "component", "layout" |
| `devops-engineer` | Deployment, Docker, CI/CD, server hardening | `/deploy`, "docker", "CI/CD" |
| `researcher` | External research and best practices | `/research`, "research", "compare" |
| `brainstormer` | Ideation and technical advice | `/brainstorm`, "brainstorm", "idea" |
| `project-manager` | Task coordination across agents | "organize", "coordinate", "scope" |

---

## Available Skills

Skills are specialized capabilities used by agents.

| Skill | Description | Used By |
|-------|-------------|---------|
| `project-planning` | Create step-by-step implementation plans | planner |
| `fullstack-implementation` | Implement features in Laravel + React | fullstack-developer |
| `testing` | Write tests using TDD with Pest/Vitest | testing-expert |
| `code-review-checklist` | Review for correctness, security, performance | reviewer |
| `bugfix-and-debug` | Diagnose and fix bugs with minimal changes | debugger |
| `security-review` | OWASP-based security audits | security-expert |
| `database-change-management` | Safe schema changes and migrations | database-admin |
| `ui-ux-design` | Design UI using existing components | ui-ux-designer |
| `devops-infrastructure` | Manage deployment and infrastructure | devops-engineer |
| `research-and-synthesis` | Fetch and summarize external sources | researcher |
| `brainstorming` | Structured ideation process | brainstormer |
| `project-orchestration` | Coordinate multiple agents | project-manager |
| `documentation-management` | Keep docs accurate when behavior changes | project-manager |

---

## Development Workflow

### Typical Feature Development

```bash
# 1. Plan the feature
/plan add-comments-feature

# 2. Research if needed
/research "best practices for nested comments"

# 3. Implement from plan
/code plan/add-comments-feature-XXXXXX

# 4. Test
/test

# 5. Review before commit
/review

# 6. Update documentation
/docs update
```

### Bug Fix Workflow

```bash
# 1. Debug and fix
/fix "TypeError: Cannot read properties of undefined"

# 2. Verify fix
/test

# 3. Review the fix
/review
```

### Security Audit Workflow

```bash
# 1. Run security audit
/security

# 2. Fix critical issues
/fix "SQL injection in search"

# 3. Re-audit
/security "auth flow"
```

---

## Customization

### Add Custom Commands

Create `.claude/commands/your-command.md`:

```markdown
---
description: Description shown in /help
argument-hint: <required> [optional]
allowed-tools: Read, Edit, Bash
---

# Your Command

Instructions for the command...
```

### Modify Agents

Edit `.claude/agents/*.md` for project-specific instructions.

### Update Skills

Adjust `.claude/skills/*/SKILL.md` for your workflow.

---

## Tech Stack (This Project)

- **Backend:** Laravel 12, PHP 8.3+
- **Frontend:** React 19, TypeScript, Inertia.js
- **Styling:** Tailwind CSS 4, shadcn/ui
- **Database:** SQLite (dev), MySQL/PostgreSQL (prod)
- **Testing:** Pest (PHP), Vitest (JS)

## Common Commands

| Command | Purpose |
|---------|---------|
| `composer dev` | Start development server |
| `composer test` | Run PHP tests |
| `npm run dev` | Vite dev server |
| `npm run types` | TypeScript check |
| `npm run lint` | ESLint check |
| `./vendor/bin/pint` | PHP code formatting |

---

## License

MIT
