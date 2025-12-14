# Codebase Summary

## Directory Structure

```
app/
├── Http/Controllers/         # 4 controllers
│   ├── Controller.php        # Base controller
│   └── Settings/             # Settings controllers
│       ├── PasswordController.php
│       ├── ProfileController.php
│       └── TwoFactorAuthenticationController.php
├── Models/                   # 1 model
│   └── User.php
├── Actions/Fortify/          # 3 action classes
│   ├── CreateNewUser.php
│   ├── PasswordValidationRules.php
│   └── ResetUserPassword.php
└── Providers/                # Service providers

resources/js/
├── pages/                    # 13 Inertia pages
│   ├── welcome.tsx
│   ├── dashboard.tsx
│   ├── auth/                 # Authentication pages
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   ├── forgot-password.tsx
│   │   ├── reset-password.tsx
│   │   ├── verify-email.tsx
│   │   ├── confirm-password.tsx
│   │   └── two-factor-challenge.tsx
│   └── settings/             # Settings pages
│       ├── profile.tsx
│       ├── password.tsx
│       ├── appearance.tsx
│       └── two-factor.tsx
├── components/               # 49 React components
│   ├── ui/                   # 30 shadcn/ui components
│   └── ...                   # 19 custom components
├── hooks/                    # 3 custom hooks
│   ├── use-clipboard.ts
│   ├── use-mobile-navigation.ts
│   └── use-two-factor-auth.ts
├── layouts/                  # Layout components
├── types/                    # TypeScript definitions
│   └── index.d.ts
├── lib/                      # Utilities
│   └── utils.ts
└── actions/                  # Wayfinder generated (auto)

database/migrations/          # 4 migrations
tests/                        # 15 test files
├── Feature/                  # Feature tests
│   ├── Auth/                 # 7 auth tests
│   ├── Settings/             # 3 settings tests
│   ├── DashboardTest.php
│   └── ExampleTest.php
└── Unit/                     # Unit tests
    └── ExampleTest.php
```

## Key Files

| File | Purpose |
|------|---------|
| `routes/web.php` | Main web routes (home, dashboard) |
| `routes/settings.php` | User settings routes (profile, password, appearance, 2FA) |
| `app/Models/User.php` | User model with 2FA support |
| `resources/js/app.tsx` | Inertia app entry point |
| `resources/js/types/index.d.ts` | Shared TypeScript interfaces |
| `resources/js/lib/utils.ts` | Helper utilities (cn function) |
| `config/fortify.php` | Laravel Fortify configuration |
| `vite.config.ts` | Vite build configuration |

## Models & Relationships

### User Model

**Location:** `app/Models/User.php`

**Traits:**
- `HasFactory` - Model factory support
- `Notifiable` - Notification support
- `TwoFactorAuthenticatable` - Laravel Fortify 2FA

**Attributes:**
- `id`, `name`, `email`, `password`
- `email_verified_at` - Email verification timestamp
- `two_factor_secret` - 2FA secret (hidden)
- `two_factor_recovery_codes` - Recovery codes (hidden)
- `two_factor_confirmed_at` - 2FA confirmation timestamp

## Routes Overview

### Public Routes

| Method | URI | Name | Controller/Action |
|--------|-----|------|-------------------|
| GET | `/` | home | Closure (welcome page) |
| GET | `/login` | login | Fortify |
| POST | `/login` | login.store | Fortify |
| GET | `/register` | register | Fortify |
| POST | `/register` | register.store | Fortify |
| GET | `/forgot-password` | password.request | Fortify |
| POST | `/forgot-password` | password.email | Fortify |
| GET | `/reset-password/{token}` | password.reset | Fortify |
| POST | `/reset-password` | password.update | Fortify |
| GET | `/two-factor-challenge` | two-factor.login | Fortify |

### Authenticated Routes

| Method | URI | Name | Controller/Action |
|--------|-----|------|-------------------|
| GET | `/dashboard` | dashboard | Closure |
| POST | `/logout` | logout | Fortify |
| GET | `/email/verify` | verification.notice | Fortify |
| GET | `/email/verify/{id}/{hash}` | verification.verify | Fortify |
| POST | `/email/verification-notification` | verification.send | Fortify |

### Settings Routes

| Method | URI | Name | Controller |
|--------|-----|------|------------|
| GET | `/settings/profile` | profile.edit | ProfileController |
| PATCH | `/settings/profile` | profile.update | ProfileController |
| DELETE | `/settings/profile` | profile.destroy | ProfileController |
| GET | `/settings/password` | user-password.edit | PasswordController |
| PUT | `/settings/password` | user-password.update | PasswordController |
| GET | `/settings/appearance` | appearance.edit | Closure |
| GET | `/settings/two-factor` | two-factor.show | TwoFactorAuthenticationController |

### 2FA Routes (Fortify)

| Method | URI | Name | Description |
|--------|-----|------|-------------|
| POST | `/user/two-factor-authentication` | two-factor.enable | Enable 2FA |
| DELETE | `/user/two-factor-authentication` | two-factor.disable | Disable 2FA |
| POST | `/user/confirmed-two-factor-authentication` | two-factor.confirm | Confirm 2FA |
| GET | `/user/two-factor-qr-code` | two-factor.qr-code | Get QR code |
| GET | `/user/two-factor-secret-key` | two-factor.secret-key | Get secret key |
| GET | `/user/two-factor-recovery-codes` | two-factor.recovery-codes | Get recovery codes |
| POST | `/user/two-factor-recovery-codes` | two-factor.regenerate-recovery-codes | Regenerate codes |

## Frontend Pages

### Auth Pages (`resources/js/pages/auth/`)

| Page | Purpose |
|------|---------|
| `login.tsx` | User login form |
| `register.tsx` | User registration form |
| `forgot-password.tsx` | Password reset request |
| `reset-password.tsx` | Password reset form |
| `verify-email.tsx` | Email verification notice |
| `confirm-password.tsx` | Password confirmation |
| `two-factor-challenge.tsx` | 2FA code entry |

### Settings Pages (`resources/js/pages/settings/`)

| Page | Purpose |
|------|---------|
| `profile.tsx` | Edit profile information |
| `password.tsx` | Change password |
| `appearance.tsx` | Theme/appearance settings |
| `two-factor.tsx` | 2FA setup and management |

### Other Pages

| Page | Purpose |
|------|---------|
| `welcome.tsx` | Landing/home page |
| `dashboard.tsx` | Authenticated user dashboard |

## Component Categories

### UI Components (shadcn/ui)

Alert, Avatar, Badge, Breadcrumb, Button, Card, Checkbox, Collapsible, Dialog, Dropdown Menu, Icon, Input, Input OTP, Label, Navigation Menu, Placeholder Pattern, Select, Separator, Sheet, Sidebar, Skeleton, Spinner, Toggle, Toggle Group, Tooltip

### Custom Components

- `app-content.tsx` - Main content wrapper
- `app-header.tsx` - Application header
- `app-logo.tsx`, `app-logo-icon.tsx` - Logo components
- `app-shell.tsx` - Application shell layout
- `app-sidebar.tsx`, `app-sidebar-header.tsx` - Sidebar components
- `alert-error.tsx` - Error alert display
- `appearance-dropdown.tsx`, `appearance-tabs.tsx` - Theme switchers
- `breadcrumbs.tsx` - Page breadcrumbs
- `delete-user.tsx` - Account deletion component
- `heading.tsx`, `heading-small.tsx` - Typography components
- `icon.tsx` - Icon wrapper
- `input-error.tsx` - Form input error display
- `nav-footer.tsx`, `nav-main.tsx`, `nav-user.tsx` - Navigation components
- `text-link.tsx` - Styled link component
- `two-factor-recovery-codes.tsx` - 2FA recovery codes display
- `two-factor-setup-modal.tsx` - 2FA setup wizard
- `user-info.tsx` - User information display
- `user-menu-content.tsx` - User dropdown menu
