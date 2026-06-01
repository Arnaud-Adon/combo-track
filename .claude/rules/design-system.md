---
paths:
  - "app/**/*.{ts,tsx}"
  - "src/components/**/*.{ts,tsx}"
---

# Design System — Frame-Perfect FGC

This is the visual contract for ComboTrack. Apply it to every new component and every page edit, on the marketing surface and the app surface alike.

## Source of truth

The brand palette lives as CSS variables in `app/globals.css`:

```
--fgc-bg            oklch(0.12 0 0)        Dark fond, training-room
--fgc-surface       oklch(0.17 0 0)        Surface elevated
--fgc-border        oklch(0.28 0 0)        Borders, hairlines
--fgc-muted         oklch(0.62 0 0)        Muted text
--fgc-text          oklch(0.98 0 0)        High-contrast text
--fgc-accent        oklch(0.66 0.22 25)    Rouge punish, brand
--fgc-accent-strong oklch(0.72 0.24 25)    Hover state
--fgc-accent-soft   oklch(0.66 0.22 25/.12) Translucent for backgrounds
```

These are exposed to Tailwind as native utilities via `@theme inline`:
`bg-fgc-bg`, `text-fgc-text`, `border-fgc-border`, `bg-fgc-accent`, `bg-fgc-accent-soft`, `text-fgc-muted`, etc.

## Token hierarchy (3 layers)

1. **Brand layer** — `--fgc-*` (immutable, the truth)
2. **Shadcn semantic layer** — `--background`, `--primary`, `--card`, `--border`, `--ring`, etc. In `.dark`, these point to `--fgc-*`. In `:root` (light fallback), they keep the shadcn grayscale palette.
3. **Component utilities** — `bg-background`, `text-primary`, `bg-card`, `border-border` (Tailwind-generated from the semantic layer)

**Rule** : new components in `src/components/features/**` (hors landing) and `app/**` pages **MUST** use the semantic shadcn utilities (`bg-card`, `text-foreground`, `text-primary`, etc.). They will automatically render FGC palette in dark mode and degrade gracefully to shadcn light in light mode.

Landing components in `src/components/features/landing/**` may continue to use brand-layer utilities directly (`bg-fgc-bg`, `text-fgc-accent`, `font-display`) because they are dark-only by design.

## Theme policy

- **Default** : dark mode (`defaultTheme="dark"` in `theme-provider.tsx`).
- **Dark mode** = FGC palette everywhere via shadcn token remap.
- **Light mode** = legacy shadcn grayscale. **Known limitation** : landing components are dark-only and will show a slight visual mismatch on shadcn primitives (Button, Tooltip) when the user toggles to light. A true FGC light variant is a future PR (see `analyze.md` §15).
- Never use `dark:` modifier on color classes inside features. Tokens already resolve to the correct palette.

## Fonts

| Variable | Family | When to use |
|---|---|---|
| `--font-sans` | Geist | Default body, forms, descriptions, table cells |
| `--font-mono` | JetBrains Mono | Combo notations, frame data, kbd, code blocks |
| `--font-display` | Departure Mono | `<h1>`, `<h2>`, eyebrow labels, empty-state hero, marketing copy |

Utilities :
- `font-display` (Departure Mono, uppercase tracking)
- `font-mono` (JetBrains Mono)
- `font-mono-fgc` (alias for landing components, same as `font-mono`)
- `marketing-h1` (display font preset for marketing hero headlines : line-height 0.95, letter-spacing -0.01em, uppercase)

## Special-purpose utilities (landing)

These live in `@layer utilities` in `globals.css` and are used to recreate the training-room aesthetic. They are not color tokens.

- `bg-grain` — SVG noise overlay (apply on a wrapper with `mix-blend-overlay opacity-[0.05]`)
- `bg-scanlines` — subtle CRT scanlines (apply on selected blocks only, not global)
- `fgc-rise` — staggered reveal animation (set `animation-delay` inline for combo-input-log effect)
- `fgc-cursor` — blinking block cursor pseudo-element (`▍`)

Don't use these in app components. They belong to the marketing surface.

## Tone & vocabulary

The product talks to fighting game players. Use FGC-native vocabulary in copy across the whole app, not only in marketing :

- `lab` / `labbing` — to study/train
- `oki`, `okizeme` — pressure on wakeup
- `neutral` — spacing/footsies phase
- `punish` — punishing an unsafe move
- `BnB` — bread-and-butter combo
- `matchup` — character vs character knowledge
- `download` — to study an opponent
- `grind` — sustained effort
- `frame trap`, `whiff punish`, `mixup`, `drive rush`, `meter`

For inline tooltips of FGC terms in marketing copy, use the `<FgcTerm term="oki">` component (`src/components/features/landing/fgc-term.tsx`). If used in app surface, ensure the same glossary stays in sync.

Avoid corporate-flavoured wording : no « solution complète », « plateforme innovante », « booster votre productivité », « utilisateurs ». Prefer « joueurs », « notes », « combos », « matchups », « progresser ».

## Anti-patterns

- ❌ `className="bg-[#ff3344]"` — never inline-hex
- ❌ `className="bg-red-500/10 text-red-400"` — never raw Tailwind colors. Add a dedicated token to `globals.css` instead and consume the utility.
- ❌ `className="dark:text-red-400"` — modifier `dark:` on color classes inside features. Use shadcn token utilities (`text-primary`, `text-destructive`) so it adapts automatically.
- ❌ `className="from-orange-400 via-red-500 to-pink-500"` — gradients with raw colors. Remap to `from-fgc-accent` etc.
- ❌ `<h1 className="text-3xl font-bold">` for a marketing hero. Use `marketing-h1` or `font-display`.
- ❌ Creating a `variant="fgc"` on `Button` / `Card` "just in case". Don't add a variant unless the component shape is reused 3+ times with a radically different look. Tokens are the first lever.

## Recharts

Always reference chart tokens via CSS variables :

```tsx
<Line stroke="var(--chart-1)" />
<Bar fill="var(--chart-2)" />
```

The chart palette is FGC-aligned in dark mode (`--chart-1` = brand red, others = analytical hues).

## When you need a new colored thing

1. Define the brand value as `--<name>` in `:root` and `.dark` in `app/globals.css` (with the appropriate OKLCH for both modes if applicable).
2. Expose it to Tailwind by adding `--color-<name>: var(--<name>)` in the `@theme inline` block.
3. Consume it as `bg-<name>`, `text-<name>`, etc.

Never short-circuit this loop with an inline color or a raw Tailwind class.

## Future tokens (introduced when consumed)

The following token families are reserved for upcoming refactors. Do not introduce them speculatively. Add them only when a hotspot is being refactored to consume them (see `.claude/tasks/17-design-system-migration-fgc/analyze.md` §3 for the hotspot list) :

- `--frame-startup`, `--frame-active`, `--frame-recovery`, `--frame-positive`, `--frame-negative` — for `strategy-matrix/frame-data-renderer.tsx`
- `--status-draft`, `--status-in-progress`, `--status-completed`, `--status-analyzed` — for `dashboard/replay-card.tsx`
- `--tag-offense`, `--tag-defense`, `--tag-neutral`, `--tag-mental`, `--tag-execution`, `--tag-okizeme` — for `video/note-template-selector.tsx`

## File map (quick reference)

| File | Role |
|---|---|
| `app/globals.css` | Brand palette + shadcn remap + `@theme inline` + special utilities |
| `app/layout.tsx` | Fonts setup (`Geist`, `JetBrains_Mono`, local `Departure Mono`) |
| `src/components/theme-provider.tsx` | next-themes wrapper, `attribute="class"`, `defaultTheme="dark"` |
| `src/components/ui/*.tsx` | Shadcn primitives — consume semantic tokens, do not edit lightly |
| `src/components/features/landing/**` | Marketing surface — dark-only, brand-layer utilities allowed |
| `src/components/features/landing/fgc-term.tsx` | Inline glossary tooltip — extend for new FGC terms |
