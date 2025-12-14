---
name: ui-ux-design
description: Design and implement UI/UX changes using existing components and Tailwind tokens; ensure accessibility. EXCLUSIVE to ui-ux-designer agent.
allowed-tools: Read, Edit, Grep, Glob, Write
---
# UI/UX Design

**Exclusive to:** `ui-ux-designer` agent

## Instructions

1. Audit existing UI for patterns to follow
2. Use existing shadcn/ui components (see component map below)
3. Follow Tailwind design tokens, avoid custom CSS
4. Ensure accessibility (keyboard, labels, contrast)
5. Test responsive behavior (mobile + desktop)

## shadcn/ui Component Map

| Need | Component |
|------|-----------|
| Button | `<Button>` |
| Input | `<Input>` |
| Select | `<Select>` |
| Modal | `<Dialog>` |
| Dropdown | `<DropdownMenu>` |
| Toast | `<Toast>` |
| Card | `<Card>` |
| Alert | `<Alert>` |

## Design Tokens

### Colors
```tsx
text-foreground           // Primary text
text-muted-foreground     // Secondary text
bg-background             // Page background
bg-muted                  // Subtle background
border-border             // Default borders
```

### Spacing
```tsx
p-1 (4px)  p-2 (8px)  p-4 (16px)  p-6 (24px)  p-8 (32px)
```

## Responsive Breakpoints
| Prefix | Width | Device |
|--------|-------|--------|
| `sm:` | 640px | Phone |
| `md:` | 768px | Tablet |
| `lg:` | 1024px | Laptop |
| `xl:` | 1280px | Desktop |

## Accessibility Checklist (WCAG 2.1)

### Forms
- [ ] Inputs have `<Label>` with `htmlFor`
- [ ] Errors linked with `aria-describedby`
- [ ] Invalid state with `aria-invalid`

### Interactive
- [ ] Keyboard accessible
- [ ] Focus states visible
- [ ] Logical focus order

### Content
- [ ] Images have `alt` text
- [ ] 4.5:1 color contrast

## Form Pattern
```tsx
<Label htmlFor="name">Name</Label>
<Input
    id="name"
    aria-invalid={!!errors.name}
    aria-describedby={errors.name ? 'name-error' : undefined}
/>
{errors.name && (
    <p id="name-error" className="text-sm text-destructive">
        {errors.name}
    </p>
)}
```

## Rules
- ✅ Use existing components and tokens
- ✅ Follow `docs/code-standards.md`
- ✅ Implement loading/error states
- ❌ Don't create new colors/fonts
- ❌ Don't use inline styles
- ❌ Don't skip mobile responsiveness

## Examples
- "Improve a form's validation UX"
- "Adjust layout for readability"
