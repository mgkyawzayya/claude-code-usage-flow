# Responsive Design Guidelines

## Breakpoints

| Breakpoint | Width | Tailwind Prefix |
|------------|-------|-----------------|
| Mobile | < 640px | (default) |
| Tablet | ≥ 640px | `sm:` |
| Small Laptop | ≥ 768px | `md:` |
| Desktop | ≥ 1024px | `lg:` |
| Large Desktop | ≥ 1280px | `xl:` |

## Standard Components

### PageContainer
Wrapper with consistent responsive padding.
```tsx
import { PageContainer } from '@/components/page-container';

<PageContainer maxWidth="2xl">
  {/* Page content */}
</PageContainer>
```

### PageHeader
Title + actions that stack on mobile.
```tsx
import { PageHeader } from '@/components/page-header';

<PageHeader 
  title="Page Title"
  description="Optional description"
  actions={<Button>Action</Button>}
/>
```

### FilterBar
Search + filters that stack vertically on mobile.
```tsx
import { FilterBar } from '@/components/filter-bar';

<FilterBar
  searchValue={search}
  onSearchChange={handleSearch}
  searchPlaceholder="Search..."
>
  <Select>...</Select>
</FilterBar>
```

### ResponsiveGrid
Configurable grid columns per breakpoint.
```tsx
import { ResponsiveGrid } from '@/components/responsive-grid';

<ResponsiveGrid columns={{ default: 1, md: 2, lg: 3 }}>
  {items.map(item => <Card key={item.id} />)}
</ResponsiveGrid>
```

### Pagination
Mobile-friendly with icon-only on small screens.
```tsx
import { Pagination } from '@/components/pagination';

<Pagination meta={data.meta} links={data.links} />
```

### FormActions
Buttons reverse order on mobile for thumb accessibility.
```tsx
import { FormActions } from '@/components/form-actions';

<FormActions>
  <Button variant="outline">Cancel</Button>
  <Button type="submit">Save</Button>
</FormActions>
```

### EmptyState
Centered empty state with icon and action.
```tsx
import { EmptyState } from '@/components/empty-state';
import { Users } from 'lucide-react';

<EmptyState
  icon={Users}
  title="No items found"
  description="Get started by creating your first item."
  action={{ label: "Create item", href: "/items/create" }}
/>
```

## Layout Patterns

### List Pages
```tsx
<PageContainer>
  <PageHeader title="Items" actions={<Button>Add</Button>} />
  <FilterBar searchValue={...} onSearchChange={...} />
  <ResponsiveGrid columns={{ default: 1, md: 2, lg: 3 }}>
    {items.map(item => <Card />)}
  </ResponsiveGrid>
  <Pagination meta={...} links={...} />
</PageContainer>
```

### Form Pages
```tsx
<PageContainer maxWidth="2xl">
  <PageHeader title="Create Item" />
  <Card>
    <form>
      {/* Form fields */}
      <FormActions>
        <Button variant="outline">Cancel</Button>
        <Button type="submit">Save</Button>
      </FormActions>
    </form>
  </Card>
</PageContainer>
```

### Horizontal Scrolling (Kanban/Pipeline)
```tsx
<div className="-mx-4 overflow-x-auto px-4 pb-4 md:mx-0 md:px-0">
  <div className="inline-flex gap-4 min-w-max">
    {columns.map(col => <Column />)}
  </div>
</div>
```

## Responsive Patterns

| Pattern | Mobile | Desktop |
|---------|--------|---------|
| Page header + actions | Stack vertically | Side-by-side |
| Filter bar | Stack vertically | Horizontal row |
| Card grids | Single column | 2-4 columns |
| Form actions | Stacked (reversed) | Side-by-side |
| Pagination labels | Icons only | Icons + text |
| Settings sidebar | Stacked with separator | Side-by-side |
