---
description: ⚡⚡⚡⚡ Analyze the codebase and create/update documentation
argument-hint: <init|update|summarize> [target]
allowed-tools: Read, Edit, Bash
---
# Documentation Command

Action: **$ARGUMENTS**

## Subcommands

| Command | Description |
|---------|-------------|
| `/docs init` | Analyze codebase and create initial documentation |
| `/docs update [target]` | Update specific or all documentation |
| `/docs summarize` | Generate project summary for README |

---

## `/docs init` — Initialize Documentation

Analyze the codebase and create initial documentation structure.

```bash
mkdir -p docs
```

### Files to Create

```
docs/
├── project-overview-pdr.md   # Project overview and Product Development Requirements
├── codebase-summary.md       # Codebase summary and file structure
├── code-standards.md         # Code standards and conventions
└── system-architecture.md    # System architecture and design patterns
```

Also update: `README.md` (root) — Keep under 300 lines

### Template: docs/project-overview-pdr.md
```markdown
# Project Overview & PDR

## Project Summary
[One paragraph describing the project purpose and goals]

## Product Development Requirements (PDR)

### Business Goals
- [ ] Goal 1
- [ ] Goal 2

### User Stories
| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-001 | User | ... | ... |

### Features
| Feature | Status | Priority |
|---------|--------|----------|
| Feature 1 | Planned/In Progress/Done | High/Med/Low |

### Success Metrics
- Metric 1: [target]
- Metric 2: [target]

## Tech Stack
- **Backend:** Laravel 12, PHP 8.3+
- **Frontend:** React 19, TypeScript, Inertia.js
- **Styling:** Tailwind CSS 4, shadcn/ui
- **Database:** SQLite/MySQL/PostgreSQL
- **Testing:** Pest/PHPUnit

## Getting Started
[Quick setup instructions - link to detailed docs if needed]
```

### Template: docs/codebase-summary.md
```markdown
# Codebase Summary

## Directory Structure
```
app/
├── Http/Controllers/    # [count] controllers
├── Models/              # [count] models
├── Actions/             # Single-action classes
└── Providers/           # Service providers

resources/js/
├── pages/               # [count] Inertia pages
├── components/          # [count] React components
├── types/               # TypeScript definitions
└── layouts/             # Layout components

database/migrations/     # [count] migrations
tests/                   # [count] test files
```

## Key Files
| File | Purpose |
|------|---------|
| `routes/web.php` | Web routes |
| `app/Models/User.php` | User model |
| ... | ... |

## Models & Relationships
[Auto-generated from app/Models/]

## Routes Overview
[Auto-generated from php artisan route:list]

## Frontend Pages
[Auto-generated from resources/js/pages/]
```

### Template: docs/code-standards.md
```markdown
# Code Standards

## General Principles
1. Follow existing patterns in the codebase
2. Keep functions/methods focused and small
3. Write self-documenting code with clear naming
4. Add comments only when intent isn't obvious

## Backend (Laravel/PHP)

### Naming Conventions
| Type | Convention | Example |
|------|------------|---------|
| Controllers | PascalCase + Controller | `UserController` |
| Models | PascalCase singular | `User` |
| Migrations | snake_case with timestamp | `create_users_table` |
| Methods | camelCase | `getUserById` |

### File Organization
- Controllers: `app/Http/Controllers/`
- Form Requests: `app/Http/Requests/`
- Models: `app/Models/`
- Single Actions: `app/Actions/`

### Testing
- Feature tests: `tests/Feature/`
- Unit tests: `tests/Unit/`
- Use Pest syntax

## Frontend (React/TypeScript)

### Naming Conventions
| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `UserProfile.tsx` |
| Hooks | camelCase with use prefix | `useAuth.ts` |
| Types | PascalCase | `User`, `PageProps` |
| Utilities | camelCase | `formatDate.ts` |

### Component Structure
- Pages: `resources/js/pages/`
- Shared components: `resources/js/components/`
- Use shadcn/ui components
- Use Tailwind for styling

## Commands
| Command | Purpose |
|---------|---------|
| `composer test` | Run PHP tests |
| `npm run types` | TypeScript check |
| `npm run lint` | ESLint check |
| `./vendor/bin/pint` | PHP formatting |
```

### Template: docs/system-architecture.md
```markdown
# System Architecture

## Overview
[High-level architecture diagram or description]

## Request Flow
```
Browser → Inertia → Laravel Router → Controller → Model → Database
                                         ↓
                                    Response
                                         ↓
                              React Component (SSR/CSR)
```

## Key Patterns

### Backend
- **MVC**: Models, Views (Inertia), Controllers
- **Form Requests**: Validation in dedicated classes
- **Actions**: Single-purpose action classes
- **Policies**: Authorization logic

### Frontend
- **Inertia.js**: SPA-like experience with server routing
- **TypeScript**: Type safety throughout
- **shadcn/ui**: Pre-built accessible components
- **Tailwind CSS**: Utility-first styling

## Authentication
[Describe auth system - Fortify, Sanctum, etc.]

## Database Design
[Key tables and relationships]

## External Services
| Service | Purpose |
|---------|---------|
| ... | ... |
```

### Auto-populate Process

When running `/docs init`:

1. **Analyze Routes**
   ```bash
   php artisan route:list --json
   ```

2. **Analyze Models**
   ```bash
   ls app/Models/
   # Read each model for relationships
   ```

3. **Analyze Controllers**
   ```bash
   ls app/Http/Controllers/
   ```

4. **Analyze Frontend**
   ```bash
   ls resources/js/pages/
   ls resources/js/components/
   ```

5. **Analyze Migrations**
   ```bash
   ls database/migrations/
   ```

6. **Update README.md** (keep under 300 lines)
   - Project title and description
   - Quick start guide
   - Links to docs/ files
   - Basic commands reference

---

## `/docs update [target]` — Update Documentation

### Update All
```bash
/docs update
```

Scans for changes and updates all docs.

### Update Specific
```bash
/docs update pdr          # Update project-overview-pdr.md
/docs update codebase     # Update codebase-summary.md
/docs update standards    # Update code-standards.md
/docs update architecture # Update system-architecture.md
/docs update readme       # Update README.md
```

### Update Process

1. **Detect Changes**
   - Compare current code to documented state
   - Identify new routes, models, components
   - Check for structural changes

2. **Generate Updates**
   - Add new items to relevant docs
   - Update counts and file lists
   - Refresh auto-generated sections

3. **Verify Accuracy**
   - Ensure code examples still work
   - Update any outdated references

---

## `/docs summarize` — Generate Summary

Create a concise project summary for README.md (keep under 300 lines).

### README.md Structure
```markdown
# [Project Name]

[One paragraph description]

## Quick Start

```bash
# Clone and install
git clone [repo]
cd [project]
composer install && npm install

# Setup
cp .env.example .env
php artisan key:generate
php artisan migrate --seed

# Run
npm run dev
php artisan serve
```

## Documentation

| Doc | Description |
|-----|-------------|
| [Project Overview](docs/project-overview-pdr.md) | Goals, features, and PDR |
| [Codebase Summary](docs/codebase-summary.md) | File structure and key files |
| [Code Standards](docs/code-standards.md) | Conventions and patterns |
| [System Architecture](docs/system-architecture.md) | Design and data flow |

## Tech Stack

- **Backend:** Laravel 12, PHP 8.3+
- **Frontend:** React 19, TypeScript, Inertia.js
- **Styling:** Tailwind CSS 4, shadcn/ui
- **Testing:** Pest/PHPUnit

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server |
| `composer test` | Run tests |
| `npm run types` | Type check |
| `./vendor/bin/pint` | Format PHP |

## License

[License type]
```

---

## Output Format

### After `/docs init`
```markdown
## ✅ Documentation Initialized

**Location:** `docs/`

### Created Files
- 📄 project-overview-pdr.md — Project overview and PDR
- 📄 codebase-summary.md — Codebase structure ([X] models, [X] controllers)
- 📄 code-standards.md — Code conventions and patterns
- 📄 system-architecture.md — System design

### Updated
- 📄 README.md — Project readme (under 300 lines)

### Next Steps
1. Review generated docs for accuracy
2. Add business-specific details to PDR
3. Run `/docs update` after code changes
```

### After `/docs update`
```markdown
## ✅ Documentation Updated

### Changes
| File | Updates |
|------|---------|
| codebase-summary.md | Added new models |
| system-architecture.md | Updated routes |

### Review Required
- [ ] Verify accuracy
- [ ] Add descriptions for new items
```

### After `/docs summarize`
```markdown
## ✅ README.md Updated

**Lines:** [X] / 300

### Sections
- Quick Start
- Documentation links
- Tech Stack
- Commands
```

---

## Source of Truth

The `docs/` folder is the **source of truth** for all project documentation.

- All agents and workflows should reference `docs/` for project context
- Keep documentation in sync with code changes
- Use `/docs update` after significant changes
