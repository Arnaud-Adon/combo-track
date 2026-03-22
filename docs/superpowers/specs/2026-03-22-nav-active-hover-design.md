# Nav Active Hover Effect — Design Spec

## Summary

Add a visual indicator on navigation buttons to show which page the user is currently on, with a distinct hover effect for the active button.

## Approach

Create a dedicated `NavLink` component that encapsulates the active route detection and styling logic.

## Component: `NavLink`

**File:** `src/components/features/landing/nav-link.tsx`

**Props:**

| Prop       | Type              | Description            |
|------------|-------------------|------------------------|
| `href`     | `string`          | Target route           |
| `children` | `React.ReactNode` | Button label content   |

**Behavior:**

- Uses `usePathname()` from `next/navigation` to detect the current route
- Compares `href` with the current pathname using `startsWith` to support sub-routes (e.g., `/admin/glossary` matches `/admin`)
- Renders a `Link` wrapping a `Button`

**Styling:**

| State            | Classes                                                    |
|------------------|------------------------------------------------------------|
| Active (default) | `bg-accent text-accent-foreground`                         |
| Active (hover)   | `hover:bg-accent/80`                                      |
| Inactive         | Standard `ghost` variant (`hover:bg-accent hover:text-accent-foreground`) |

## Integration

**File:** `src/components/features/landing/authenticated-nav.tsx`

Replace:

```tsx
<Link href="/dashboard">
  <Button variant="ghost">Dashboard</Button>
</Link>
```

With:

```tsx
<NavLink href="/dashboard">Dashboard</NavLink>
```

Apply the same replacement for all nav buttons (`Dashboard`, `Glossaire`, `Admin`).

## Files Changed

| File | Change |
|------|--------|
| `src/components/features/landing/nav-link.tsx` | New component |
| `src/components/features/landing/authenticated-nav.tsx` | Replace `Link + Button` with `NavLink` |

## Out of Scope

- `unauthenticated-nav.tsx` — Sign In / Sign Up buttons are not navigation sections
- Mobile responsive menu — not yet implemented
- No changes to the shared `Button` component
