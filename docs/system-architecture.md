# System Architecture

## Overview

This application follows a modern full-stack architecture combining Laravel's backend capabilities with React's frontend interactivity through Inertia.js. The architecture provides SPA-like user experience while maintaining traditional server-side routing and SEO benefits.

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Browser                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                React 19 + TypeScript                     │   │
│  │  ┌──────────┐ ┌──────────┐ ┌────────────────────────┐   │   │
│  │  │ Pages    │ │Components│ │ shadcn/ui + Tailwind   │   │   │
│  │  └──────────┘ └──────────┘ └────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                    Inertia.js Adapter                          │
└──────────────────────────────┼──────────────────────────────────┘
                               │ XHR/Fetch
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Laravel 12 Backend                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    HTTP Layer                            │   │
│  │  ┌─────────┐ ┌────────────┐ ┌────────────────────────┐  │   │
│  │  │ Routes  │→│ Middleware │→│ Controllers            │  │   │
│  │  └─────────┘ └────────────┘ └────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  Business Logic                          │   │
│  │  ┌─────────┐ ┌────────────┐ ┌────────────────────────┐  │   │
│  │  │ Actions │ │ Fortify    │ │ Models                 │  │   │
│  │  └─────────┘ └────────────┘ └────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                    Eloquent ORM                                │
└──────────────────────────────┼──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SQLite / MySQL / PostgreSQL                  │
└─────────────────────────────────────────────────────────────────┘
```

## Request Flow

### Standard Page Request

```
1. Browser Request
   │
   ▼
2. Laravel Router (routes/web.php)
   │
   ▼
3. Middleware Stack
   ├── web (session, CSRF, cookies)
   ├── auth (authentication check)
   └── verified (email verification)
   │
   ▼
4. Controller
   ├── Validate request
   ├── Execute business logic
   └── Return Inertia::render()
   │
   ▼
5. Inertia Response
   ├── First visit: Full HTML with React app
   └── Subsequent: JSON with page component + props
   │
   ▼
6. React Component
   ├── Receives props from server
   ├── Renders UI
   └── Handles client-side interactions
```

### Form Submission

```
1. User submits form (Inertia useForm)
   │
   ▼
2. XHR POST to Laravel
   │
   ▼
3. Controller validates & processes
   │
   ▼
4. Redirect with session flash
   │
   ▼
5. Inertia follows redirect
   │
   ▼
6. New page component renders with updated data
```

## Key Patterns

### Backend

#### MVC Architecture

- **Models:** Eloquent models in `app/Models/`
- **Views:** Inertia pages in `resources/js/pages/`
- **Controllers:** Request handlers in `app/Http/Controllers/`

#### Actions Pattern

Single-purpose action classes for complex operations:

```php
// app/Actions/Fortify/CreateNewUser.php
class CreateNewUser implements CreatesNewUsers
{
    public function create(array $input): User
    {
        // Validation and user creation
    }
}
```

#### Service Providers

- `AppServiceProvider` - Application bindings
- `FortifyServiceProvider` - Auth customization

### Frontend

#### Inertia.js Pages

Pages receive props directly from Laravel controllers:

```tsx
// resources/js/pages/dashboard.tsx
export default function Dashboard() {
    return <AppLayout>...</AppLayout>;
}
```

#### Component Composition

```
AppLayout
└── AppShell
    ├── AppSidebar
    │   ├── AppSidebarHeader
    │   ├── NavMain
    │   └── NavFooter
    └── AppContent
        ├── AppHeader
        │   ├── Breadcrumbs
        │   └── NavUser
        └── {children}
```

#### State Management

- Server state via Inertia props (single source of truth)
- Client state via React hooks (`useState`, `useForm`)
- Custom hooks for reusable logic

## Authentication System

### Laravel Fortify

The authentication is handled by Laravel Fortify, providing:

- User registration
- Login/logout
- Password reset
- Email verification
- Two-factor authentication (TOTP)
- Password confirmation

### Authentication Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Login     │────▶│  Fortify    │────▶│  Session    │
│   Form      │     │  Auth       │     │  Created    │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                    ┌──────┴──────┐
                    ▼             ▼
             ┌───────────┐ ┌─────────────┐
             │ Dashboard │ │ 2FA Check   │
             └───────────┘ └─────────────┘
                                  │
                           ┌──────┴──────┐
                           ▼             ▼
                    ┌───────────┐ ┌─────────────┐
                    │ 2FA Code  │ │ Recovery    │
                    │ Entry     │ │ Code Entry  │
                    └───────────┘ └─────────────┘
```

### Two-Factor Authentication

1. User enables 2FA in settings
2. QR code displayed for authenticator app
3. User confirms with code from app
4. On login, 2FA challenge required
5. Recovery codes available as backup

## Database Design

### Users Table

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| name | string | User's name |
| email | string | Unique email |
| email_verified_at | timestamp | Verification time |
| password | string | Hashed password |
| two_factor_secret | text | 2FA secret (encrypted) |
| two_factor_recovery_codes | text | Recovery codes (encrypted) |
| two_factor_confirmed_at | timestamp | 2FA confirmation time |
| remember_token | string | Session token |
| created_at | timestamp | Creation time |
| updated_at | timestamp | Last update |

### Additional Tables

- **cache** - Application cache storage
- **jobs** - Queue job storage
- **sessions** - User sessions (if database driver)

## Security Considerations

### CSRF Protection

All forms include CSRF tokens via Inertia.

### Password Security

- Passwords hashed using bcrypt
- Password confirmation for sensitive actions
- Throttling on login/password reset

### Two-Factor Authentication

- TOTP-based (Google Authenticator compatible)
- Recovery codes for account recovery
- Password confirmation required to enable/disable

### Session Security

- HTTP-only cookies
- Secure flag in production
- Session regeneration on login

## External Services

| Service | Purpose | Configuration |
|---------|---------|---------------|
| Mail | Email verification, password reset | `config/mail.php` |
| Queue | Background job processing | `config/queue.php` |
| Cache | Application caching | `config/cache.php` |

## Build & Deployment

### Development

```bash
composer dev  # Starts all services concurrently
```

Services started:
- Laravel server (`php artisan serve`)
- Queue worker (`php artisan queue:listen`)
- Log viewer (`php artisan pail`)
- Vite dev server (`npm run dev`)

### Production Build

```bash
npm run build      # Standard build
npm run build:ssr  # With SSR support
```

### Environment Configuration

Key `.env` variables:
- `APP_ENV` - Environment (local/production)
- `APP_KEY` - Application encryption key
- `DB_CONNECTION` - Database driver
- `MAIL_MAILER` - Mail driver for notifications

## Wayfinder Integration

Laravel Wayfinder generates type-safe route helpers:

```tsx
// Auto-generated in resources/js/actions/
import { profile } from '@/actions/Settings/ProfileController';

// Use in components
<Link href={profile.edit()}>Edit Profile</Link>
```

Files in `resources/js/actions/` and `resources/js/wayfinder/` are auto-generated; do not edit directly.
