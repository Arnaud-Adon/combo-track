# Accessibility (a11y)

Every component and page must be usable with a keyboard and a screen reader. These rules are non-negotiable for new or edited UI.

## Icon-only controls

- Any control whose visible content is **only an icon** (buttons, links, toggles) MUST expose an accessible name via `aria-label` (or visually-hidden text). A tooltip is **supplementary**, never the only label.
- Decorative icons MUST be `aria-hidden` (e.g. `<Icon aria-hidden />`) so the accessible name comes from the `aria-label`, not the SVG.

## Landmarks & current state

- Group navigation in a `<nav>` with a descriptive `aria-label` (e.g. `aria-label="Accès rapide au labo"`).
- Mark the active destination with `aria-current="page"` so it is announced, not only colored.
- Never rely on color alone to convey state — pair it with a shape, icon, text, or `aria-current`.

## Focus

- Keep a visible focus indicator. Use `focus-visible:ring-2 focus-visible:ring-ring` (semantic tokens) — never `outline-none` without a visible replacement.
- Do not remove focus styles to "clean up" a design.

## Target size

- Interactive targets should be **at least 44×44px** (WCAG 2.5.5). Prefer `size-11` for icon buttons; pad smaller hit areas.

## Motion

- Respect `prefers-reduced-motion`. Avoid entrance/transform animations on persistent chrome (rails, sidebars, sticky bars). Keep transitions to color/opacity when motion is reduced.

## Tokens

- Accessible color contrast comes from the FGC semantic tokens (`text-foreground`, `text-muted-foreground`, `text-primary`, `bg-accent`). Do not hand-pick raw colors that break contrast — see `design-system.md`.
