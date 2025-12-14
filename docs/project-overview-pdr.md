# Project Overview & PDR

## Project Summary

This is a Laravel 12 + React 19 + Inertia.js blog application built on the Laravel React Starter Kit. It provides a modern full-stack foundation with complete authentication including two-factor authentication (2FA), user settings management, and a responsive UI powered by Tailwind CSS 4 and shadcn/ui components.

## Product Development Requirements (PDR)

### Business Goals

- [ ] Provide a secure, modern blog platform
- [ ] Deliver excellent user experience with SPA-like navigation
- [ ] Support secure user authentication with 2FA
- [ ] Enable user self-service for profile and security settings

### User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-001 | Visitor | Register for an account | I can access the dashboard |
| US-002 | User | Log in securely | I can access my content |
| US-003 | User | Enable two-factor authentication | My account is more secure |
| US-004 | User | Update my profile information | My details are current |
| US-005 | User | Change my password | I can maintain account security |
| US-006 | User | Customize appearance settings | The app matches my preferences |
| US-007 | User | Reset my password via email | I can recover access if forgotten |
| US-008 | User | Verify my email address | I can confirm my identity |

### Features

| Feature | Status | Priority |
|---------|--------|----------|
| User Registration | Done | High |
| User Authentication | Done | High |
| Two-Factor Authentication | Done | High |
| Email Verification | Done | Medium |
| Password Reset | Done | Medium |
| Profile Management | Done | Medium |
| Password Update | Done | Medium |
| Appearance Settings | Done | Low |
| Dashboard | Done | Medium |
| Account Deletion | Done | Low |

### Success Metrics

- User registration completion rate
- 2FA adoption rate
- Password reset success rate
- User session duration

## Tech Stack

- **Backend:** Laravel 12, PHP 8.2+
- **Frontend:** React 19, TypeScript, Inertia.js
- **Styling:** Tailwind CSS 4, shadcn/ui (new-york style)
- **Authentication:** Laravel Fortify with 2FA support
- **Database:** SQLite (default) / MySQL / PostgreSQL
- **Testing:** Pest (PHP), ESLint/TypeScript (JS)
- **Build:** Vite 7
- **Type-safe Routing:** Laravel Wayfinder

## Getting Started

```bash
# Clone and install dependencies
git clone <repository-url>
cd blog
composer install && npm install

# Environment setup
cp .env.example .env
php artisan key:generate

# Database setup
php artisan migrate --seed

# Run development server
composer dev
```

See [README.md](../README.md) for detailed setup instructions.
