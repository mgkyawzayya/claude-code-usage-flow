# UI/UX Design Reference

## shadcn/ui Components

### Button Variants
```tsx
<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button disabled>Disabled</Button>
```

### Form Components
```tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
```

### Dialog (Modal)
```tsx
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

<Dialog>
    <DialogTrigger asChild>
        <Button>Open</Button>
    </DialogTrigger>
    <DialogContent>
        <DialogHeader>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Description</DialogDescription>
        </DialogHeader>
        {/* Content */}
        <DialogFooter>
            <Button>Save</Button>
        </DialogFooter>
    </DialogContent>
</Dialog>
```

## Tailwind Design Tokens

### Colors
```css
/* Semantic colors */
bg-background     /* Page background */
bg-foreground     /* Primary text */
bg-muted          /* Subtle background */
bg-muted-foreground /* Secondary text */
bg-primary        /* Brand color */
bg-secondary      /* Secondary brand */
bg-destructive    /* Error/danger */
bg-accent         /* Accent highlights */
```

### Spacing Scale
```
p-1  = 4px
p-2  = 8px
p-3  = 12px
p-4  = 16px
p-5  = 20px
p-6  = 24px
p-8  = 32px
p-10 = 40px
p-12 = 48px
```

### Typography
```css
text-xs   /* 12px */
text-sm   /* 14px */
text-base /* 16px */
text-lg   /* 18px */
text-xl   /* 20px */
text-2xl  /* 24px */
text-3xl  /* 30px */

font-normal   /* 400 */
font-medium   /* 500 */
font-semibold /* 600 */
font-bold     /* 700 */
```

## Responsive Breakpoints

| Prefix | Min Width | Device |
|--------|-----------|--------|
| (none) | 0px | Mobile (default) |
| `sm:` | 640px | Large phone |
| `md:` | 768px | Tablet |
| `lg:` | 1024px | Laptop |
| `xl:` | 1280px | Desktop |
| `2xl:` | 1536px | Large desktop |

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

## Accessibility Checklist

### Forms
- [ ] Inputs have associated `<Label>` with `htmlFor`
- [ ] Errors use `aria-describedby`
- [ ] Invalid state uses `aria-invalid`
- [ ] Required fields marked with `aria-required`

### Interactive
- [ ] Focus visible (`:focus-visible` ring)
- [ ] Keyboard navigable (Tab, Enter, Escape)
- [ ] Touch targets ≥44px

### Content
- [ ] Images have `alt` text
- [ ] Color contrast ≥4.5:1
- [ ] Page has `<h1>` heading
