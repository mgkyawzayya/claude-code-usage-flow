# Documentation Management Reference

## Documentation Structure

```
docs/
├── project-overview-pdr.md   # Goals, features, requirements
├── codebase-summary.md       # Structure, models, routes, components
├── code-standards.md         # Conventions and patterns
└── system-architecture.md    # Design and data flow
```

## Update Triggers

| Change Type | Files to Update |
|-------------|-----------------|
| New feature | `project-overview-pdr.md`, `codebase-summary.md` |
| New model/controller | `codebase-summary.md` |
| Pattern change | `code-standards.md` |
| Architecture change | `system-architecture.md` |
| Setup change | `README.md` |

## README Constraints

| Section | Max Lines |
|---------|-----------|
| Quick Start | 30 |
| Documentation links | 20 |
| Tech Stack | 15 |
| Commands | 20 |
| **Total** | < 300 |

## Documentation Templates

### Model Documentation
```markdown
### Post
- **Table**: `posts`
- **Relationships**: User (belongsTo), Comments (hasMany)
- **Key Fields**: title, content, published_at
```

### Route Documentation
```markdown
### Posts
| Method | URI | Controller | Description |
|--------|-----|------------|-------------|
| GET | /posts | PostController@index | List posts |
| POST | /posts | PostController@store | Create post |
```

### Component Documentation
```markdown
### PostForm
- **Path**: `resources/js/components/posts/PostForm.tsx`
- **Props**: `post?: Post`, `onSubmit: (data) => void`
- **Usage**: Create/edit post form
```

## Validation Checklist

After updating docs:
- [ ] Links still work
- [ ] File paths are accurate
- [ ] Code examples are current
- [ ] No contradictions between docs
- [ ] README under 300 lines
