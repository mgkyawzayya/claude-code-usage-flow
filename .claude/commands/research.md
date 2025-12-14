---
description: Research a topic using Gemini CLI and save to plan's research folder
argument-hint: <topic> [--plan <plan-folder>]
allowed-tools: Read, Bash, WebFetch
---
# Research Command

Research the following topic: **$ARGUMENTS**

## Purpose

Use Gemini CLI to gather information about the requested topic and save findings to the appropriate research folder.

## Usage Patterns

```bash
# Research for a new plan (creates temp research)
/research user authentication best practices

# Research for existing plan
/research user authentication --plan plan/user-auth-20241214-153042

# Research specific technology
/research "Laravel Sanctum API tokens"

# Research security concerns
/research "OWASP authentication guidelines"
```

## Step 1: Determine Research Location

If `--plan` flag provided:
- Save to `[plan-folder]/research/`

If no plan specified:
- Save to `plan/research-[topic]-[timestamp]/`

## Step 2: Use Gemini CLI for Research

```bash
# Research using Gemini CLI
gemini -p "Research the following topic for a Laravel 12 + React 19 + Inertia.js project:

Topic: $ARGUMENTS

Provide:
1. Overview and key concepts
2. Best practices and patterns
3. Security considerations
4. Implementation approaches
5. Code examples (Laravel/React where applicable)
6. Common pitfalls to avoid
7. Recommended packages/libraries
8. Official documentation links

Format as structured markdown."
```

## Step 3: Save Research Output

Create research file with timestamp:

```markdown
# Research: [Topic]

**Date:** [YYYY-MM-DD HH:MM]
**Query:** [Original query]

## Summary
[Key findings in 2-3 sentences]

## Key Concepts
- Concept 1: explanation
- Concept 2: explanation

## Best Practices
1. Practice 1
2. Practice 2

## Security Considerations
- ⚠️ Security point 1
- ⚠️ Security point 2

## Implementation Approaches

### Approach 1: [Name]
**Pros:** ...
**Cons:** ...
```php
// Example code
```

### Approach 2: [Name]
**Pros:** ...
**Cons:** ...
```tsx
// Example code
```

## Recommended Stack
| Purpose | Package | Why |
|---------|---------|-----|
| ... | ... | ... |

## Common Pitfalls
1. ❌ Pitfall 1 — How to avoid
2. ❌ Pitfall 2 — How to avoid

## References
- [Official Docs](url)
- [Tutorial](url)
- [Best Practices Guide](url)

## Raw Gemini Response
<details>
<summary>Full response</summary>

[Full Gemini CLI output]

</details>
```

## Step 4: Additional Research Sources

After Gemini research, supplement with:

1. **Codebase Analysis**
   ```bash
   # Find similar implementations
   grep -r "related_pattern" --include="*.php" app/
   grep -r "related_pattern" --include="*.tsx" resources/js/
   ```

2. **Package Documentation**
   - Check `composer.json` for installed packages
   - Review package docs on Packagist/GitHub

3. **Laravel/React Official Docs**
   - Laravel: https://laravel.com/docs
   - React: https://react.dev
   - Inertia: https://inertiajs.com

## Step 5: Output Summary

```markdown
## ✅ Research Complete

**Topic:** [Topic]
**Saved to:** `[research-folder]/[filename].md`

### Key Findings
1. [Finding 1]
2. [Finding 2]
3. [Finding 3]

### Recommended Approach
[Brief recommendation based on research]

### Next Steps
- Review full research at `[path]`
- Create plan with `/plan [feature]`
- Or add to existing plan research folder
```

## Research Templates

### Feature Research
```bash
gemini -p "How to implement [feature] in Laravel 12 with React frontend using Inertia.js? Include security considerations and testing approach."
```

### Package Evaluation
```bash
gemini -p "Compare [package1] vs [package2] for [use-case] in Laravel. Include pros, cons, and recommendation."
```

### Security Research
```bash
gemini -p "Security best practices for [feature] in web applications. Focus on Laravel/PHP backend and React frontend."
```

### Performance Research
```bash
gemini -p "Performance optimization for [feature] in Laravel with React/Inertia. Include caching strategies and database optimization."
```
