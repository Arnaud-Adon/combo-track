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
- Active detection: `pathname === href` OR (`pathname.startsWith(href)` AND `pathname[href.length] === '/'`). This prevents false positives (e.g., `/admin/glossary` only matches `/admin`, not `/dashboard`)
- All buttons show inactive when on routes outside the nav structure (e.g., `/`, `/videos/[id]`)
- Renders a `Link` wrapping a `Button`
- Applies `aria-current="page"` when active for accessibility

**Styling:**

| State            | Button variant | Classes                                                    |
|------------------|----------------|------------------------------------------------------------|
| Active (default) | `ghost`        | `bg-accent text-accent-foreground` applied via className    |
| Active (hover)   | `ghost`        | `hover:bg-accent/80` applied via className                  |
| Inactive         | `ghost`        | Standard ghost behavior (`hover:bg-accent hover:text-accent-foreground`) |

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
