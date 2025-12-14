# Code Standards

## General Principles

1. Follow existing patterns in the codebase
2. Keep functions/methods focused and small
3. Write self-documenting code with clear naming
4. Add comments only when intent isn't obvious
5. Avoid over-engineering; keep solutions simple

## Backend (Laravel/PHP)

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Controllers | PascalCase + Controller | `ProfileController` |
| Models | PascalCase singular | `User` |
| Migrations | snake_case with timestamp | `create_users_table` |
| Methods | camelCase | `getUserById` |
| Variables | camelCase | `$userName` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_ATTEMPTS` |
| Route names | kebab-case with dots | `profile.edit` |

### File Organization

```
app/
├── Http/Controllers/      # Request handlers
│   └── Settings/          # Group by domain
├── Http/Requests/         # Form request validation
├── Models/                # Eloquent models
├── Actions/               # Single-purpose actions
│   └── Fortify/           # Fortify-specific actions
└── Providers/             # Service providers
```

### Controller Guidelines

- Keep controllers thin; delegate to actions/services
- Use resource controllers where appropriate
- Group related controllers in subdirectories (e.g., `Settings/`)
- One public method per controller for single-action controllers

### Model Guidelines

- Define `$fillable` or `$guarded` explicitly
- Use `$hidden` for sensitive attributes
- Define `$casts` for type casting
- Use traits for shared functionality

### Testing

- Feature tests: `tests/Feature/` - Test HTTP endpoints
- Unit tests: `tests/Unit/` - Test isolated units
- Use Pest syntax for all tests
- Name tests descriptively: `it('can update user profile')`

### Code Style

```bash
# Format PHP code
./vendor/bin/pint

# Run tests
composer test
```

## Frontend (React/TypeScript)

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `UserProfile.tsx` |
| Pages | kebab-case | `two-factor.tsx` |
| Hooks | camelCase with `use` prefix | `useClipboard.ts` |
| Types/Interfaces | PascalCase | `User`, `PageProps` |
| Utilities | camelCase | `formatDate.ts` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_FILE_SIZE` |

### File Organization

```
resources/js/
├── pages/                 # Inertia page components
│   ├── auth/              # Auth-related pages
│   └── settings/          # Settings pages
├── components/            # Reusable components
│   └── ui/                # shadcn/ui components
├── hooks/                 # Custom React hooks
├── layouts/               # Page layouts
├── types/                 # TypeScript definitions
└── lib/                   # Utilities
```

### Component Structure

```tsx
// 1. Imports
import { useState } from 'react';
import { Button } from '@/components/ui/button';

// 2. Types (if local)
interface Props {
    title: string;
}

// 3. Component
export function MyComponent({ title }: Props) {
    // Hooks first
    const [state, setState] = useState(false);

    // Handlers
    const handleClick = () => setState(true);

    // Render
    return (
        <div>
            <h1>{title}</h1>
            <Button onClick={handleClick}>Click</Button>
        </div>
    );
}
```

### TypeScript Guidelines

- Use explicit types for props and state
- Prefer interfaces over type aliases for objects
- Use `@/` path alias for imports from `resources/js/`
- Define shared types in `resources/js/types/index.d.ts`

### Styling Guidelines

- Use Tailwind CSS utility classes
- Use `cn()` utility for conditional classes
- Follow shadcn/ui component patterns
- Prefer CSS variables for theming (defined in `app.css`)

```tsx
import { cn } from '@/lib/utils';

<div className={cn(
    'base-classes',
    condition && 'conditional-classes'
)} />
```

### React Best Practices

- Use functional components with hooks
- Keep components focused and composable
- Extract reusable logic into custom hooks
- Use Inertia's `useForm` for forms
- Prefer controlled components

### Code Style

```bash
# Type check
npm run types

# Lint with auto-fix
npm run lint

# Format code
npm run format

# Check formatting
npm run format:check
```

## Path Aliases

TypeScript `@/*` maps to `resources/js/*`:

```tsx
// Good
import { Button } from '@/components/ui/button';

// Avoid
import { Button } from '../../../components/ui/button';
```

## Commands Reference

| Command | Purpose |
|---------|---------|
| `composer dev` | Start all dev servers |
| `npm run dev` | Vite dev server |
| `composer test` | Run PHP tests |
| `npm run types` | TypeScript type check |
| `npm run lint` | ESLint with auto-fix |
| `npm run format` | Prettier format |
| `./vendor/bin/pint` | PHP code formatting |

## Git Workflow

1. Create feature branches from `main`
2. Keep commits focused and atomic
3. Write clear commit messages
4. Run tests before pushing
5. Use pull requests for code review

## Adding New Features

### New Page

1. Create page component in `resources/js/pages/`
2. Add route in `routes/web.php` or domain-specific file
3. Create controller if needed
4. Add tests in `tests/Feature/`

### New Component

1. Check if shadcn/ui has the component: `npx shadcn@latest add [component]`
2. If custom, create in `resources/js/components/`
3. Keep it focused and reusable
4. Use TypeScript props interface

### New API Endpoint

1. Create controller method or single-action controller
2. Add route with appropriate middleware
3. Use Form Request for validation
4. Add feature tests
