---
name: documentation-management
description: Standards for creating and maintaining project documentation in docs/ folder.
---
# Documentation Management

The `docs/` folder is the **source of truth** for all project documentation.

## Documentation Structure

```
docs/
├── project-overview-pdr.md   # Project overview and Product Development Requirements
├── codebase-summary.md       # Codebase structure and key files
├── code-standards.md         # Code conventions and patterns
└── system-architecture.md    # System design and architecture
```

Also maintain: `README.md` (root) — Keep under 300 lines

## File Purposes

| File | Contains |
|------|----------|
| `project-overview-pdr.md` | Goals, user stories, features, success metrics, tech stack |
| `codebase-summary.md` | Directory structure, key files, models, routes, components |
| `code-standards.md` | Naming conventions, file organization, testing patterns |
| `system-architecture.md` | Request flow, design patterns, auth, database design |
| `README.md` | Quick start, doc links, commands (under 300 lines) |

## When to Update Docs

| Change Type | Update Required |
|-------------|-----------------|
| New feature | `project-overview-pdr.md`, `codebase-summary.md` |
| New model/controller | `codebase-summary.md` |
| New component/page | `codebase-summary.md` |
| Pattern change | `code-standards.md` |
| Architecture change | `system-architecture.md` |
| Any significant change | `README.md` (if affects quick start) |

## Documentation Standards

### Writing Style
- **Concise** — Say it in fewer words
- **Actionable** — Include exact commands
- **Current** — Remove outdated info, don't just add
- **Linked** — Reference other docs, don't duplicate

### project-overview-pdr.md Format
```markdown
# Project Overview & PDR

## Project Summary
[One paragraph]

## Product Development Requirements (PDR)

### Business Goals
- [ ] Goal 1

### User Stories
| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|

### Features
| Feature | Status | Priority |
|---------|--------|----------|

### Success Metrics
- Metric: [target]

## Tech Stack
[List technologies]

## Getting Started
[Quick setup or link]
```

### codebase-summary.md Format
```markdown
# Codebase Summary

## Directory Structure
```
app/
├── Http/Controllers/    # [X] controllers
├── Models/              # [X] models
...
```

## Key Files
| File | Purpose |
|------|---------|

## Models & Relationships
[From app/Models/]

## Routes Overview
[From route:list]

## Frontend Pages
[From resources/js/pages/]
```

### code-standards.md Format
```markdown
# Code Standards

## Naming Conventions
| Type | Convention | Example |
|------|------------|---------|

## File Organization
[Where things go]

## Testing
[Test patterns and commands]
```

### system-architecture.md Format
```markdown
# System Architecture

## Overview
[High-level description]

## Request Flow
[Diagram or description]

## Key Patterns
[Backend and frontend patterns]

## Authentication
[Auth system description]

## Database Design
[Key tables and relationships]
```

## README.md Guidelines

Keep README.md under **300 lines** with:

```markdown
# [Project Name]

[One paragraph description]

## Quick Start
[5-6 essential commands to get running]

## Documentation
| Doc | Description |
|-----|-------------|
| [Project Overview](docs/project-overview-pdr.md) | Goals and PDR |
| [Codebase Summary](docs/codebase-summary.md) | Structure |
| [Code Standards](docs/code-standards.md) | Conventions |
| [System Architecture](docs/system-architecture.md) | Design |

## Tech Stack
[Brief list]

## Commands
[Essential dev commands table]

## License
[License]
```

## Commands

### Initialize Documentation
```bash
/docs init
```
Creates `docs/` folder and all files, auto-populated from codebase analysis.

### Update Documentation
```bash
/docs update              # Update all docs
/docs update pdr          # Update project-overview-pdr.md
/docs update codebase     # Update codebase-summary.md
/docs update standards    # Update code-standards.md
/docs update architecture # Update system-architecture.md
```

### Generate Summary
```bash
/docs summarize
```
Updates README.md with current project state.

## Quality Checklist

Before committing doc changes:

- [ ] Information is accurate and current
- [ ] Commands are copy-paste ready
- [ ] No placeholder text (`[TODO]`, `...`)
- [ ] README.md is under 300 lines
- [ ] Links between docs are valid

## Source of Truth

The `docs/` folder is the canonical source for:
- Project goals and requirements
- Code structure and organization
- Development standards
- System design

All agents and workflows should reference `docs/` for project context.
