# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Laravel 12 + React 19 + Inertia.js application using the Laravel React Starter Kit. It includes authentication (Laravel Fortify with 2FA support), Tailwind CSS 4, and shadcn/ui components.

## Common Commands

### Development
```bash
composer dev          # Runs Laravel server, queue worker, Pail logs, and Vite concurrently
npm run dev           # Vite dev server only
```

### Testing
```bash
composer test         # Clears config cache, then runs Pest tests
php artisan test      # Run Pest tests directly
php artisan test --filter=TestName  # Run specific test
```

### Code Quality
```bash
npm run lint          # ESLint with auto-fix
npm run format        # Prettier format resources/
npm run format:check  # Check formatting
npm run types         # TypeScript type checking (no emit)
./vendor/bin/pint     # Laravel Pint (PHP code style)
```

### Build
```bash
npm run build         # Production build
npm run build:ssr     # Build with SSR support
```

## Architecture

### Backend (Laravel)
- **Routes**: `routes/web.php` (main), `routes/settings.php` (user settings)
- **Controllers**: `app/Http/Controllers/` - Settings controllers handle profile/password/etc.
- **Actions**: `app/Actions/` - Single-action classes (e.g., Fortify actions)
- **Authentication**: Laravel Fortify with two-factor authentication support

### Frontend (React + Inertia)
- **Entry**: `resources/js/app.tsx` - Inertia app setup with theme initialization
- **Pages**: `resources/js/pages/` - Inertia page components (auth/, settings/, dashboard.tsx)
- **Layouts**: `resources/js/layouts/` - App and auth layout wrappers
- **Components**: `resources/js/components/` - Reusable components, `ui/` contains shadcn/ui
- **Hooks**: `resources/js/hooks/` - Custom React hooks (appearance, clipboard, 2FA, etc.)
- **Types**: `resources/js/types/index.d.ts` - Shared TypeScript interfaces (User, Auth, NavItem, etc.)
- **Utils**: `resources/js/lib/utils.ts` - Helper functions including `cn()` for class merging

### Wayfinder
Laravel Wayfinder generates type-safe route helpers. Generated files are in `resources/js/actions/` and `resources/js/wayfinder/`. These are auto-generated; do not edit directly.

### Styling
- Tailwind CSS 4 with Vite plugin (`@tailwindcss/vite`)
- shadcn/ui components (new-york style) - add via `npx shadcn@latest add [component]`
- CSS variables for theming in `resources/css/app.css`
- `cn()` utility for conditional class merging with clsx + tailwind-merge

### Path Aliases
TypeScript path alias `@/*` maps to `resources/js/*` (configured in tsconfig.json).
