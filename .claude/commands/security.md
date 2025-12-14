---
description: |
  Security audit using OWASP Top 10 guidelines for Laravel + React applications.
  Examples: /security, /security "auth flow", /security app/Http/Controllers
argument-hint: [optional: specific area or file to review]
allowed-tools: Read, Grep, Glob, Bash
---
# Security Review

**Routes to:** `security-expert` agent
**Skill:** `security-review`

> Run `composer audit` and `npm audit` first. Report findings by severity (Critical > High > Medium).

## Focus Area
$ARGUMENTS

## OWASP Top 10 Audit

### Automated Checks
```bash
# Check for known vulnerabilities
composer audit
npm audit

# List routes and their middleware
php artisan route:list --compact
```

### A01: Broken Access Control
- [ ] All routes have proper authorization
- [ ] Policies/Gates used for model access
- [ ] No direct object references without checks

### A02: Cryptographic Failures
- [ ] Passwords use `Hash::make()`
- [ ] Sensitive data encrypted
- [ ] No secrets in code/logs

### A03: Injection
- [ ] No raw SQL with user input
- [ ] XSS prevention in place
- [ ] Command injection checks

### A04: Insecure Design
- [ ] Business logic reviewed
- [ ] Rate limiting on sensitive endpoints

### A05: Security Misconfiguration
- [ ] `APP_DEBUG=false` in production
- [ ] Proper CORS settings
- [ ] Security headers configured

### A06: Vulnerable Components
- [ ] Dependencies up to date
- [ ] No known vulnerabilities

### A07: Authentication Failures
- [ ] Rate limiting on login
- [ ] Session management secure
- [ ] Password policies enforced

### A08: Data Integrity Failures
- [ ] CSRF tokens on all forms
- [ ] Mass assignment protection

### A09: Logging Failures
- [ ] Security events logged
- [ ] Sensitive data not in logs

### A10: SSRF
- [ ] External URLs validated
- [ ] Allowlists for services

## Output Format

```markdown
## 🔒 Security Review

### 🚨 Critical
1. [Issue]: [File:Line] — [Fix]

### ⚠️ High Risk
1. [Issue]: [File:Line] — [Recommendation]

### ✅ Secure
- [Positive finding]
```
