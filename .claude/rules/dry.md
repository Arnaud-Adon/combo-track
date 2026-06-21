# DRY — Don't Repeat Yourself

Before duplicating logic, markup or config, reuse the shared building blocks below. Extract a shared helper/component the **third** time a pattern appears (rule of three) — earlier if the duplication is error-prone.

## Reuse these (don't re-inline)

- **Dates**: `formatDate` / `formatTime` from `@/utils` — do not re-inline `toLocaleDateString("fr-FR", …)`.
- **i18n test render**: `renderWithIntl` from `@/test/render-with-intl` — never redeclare the `NextIntlClientProvider` wrapper in a test file.
- **Translations**: `getTranslations` / `useTranslations` + the `fr` catalogs (see `i18n.md`). Generic labels live in the `common` namespace — reuse, don't duplicate.
- **Form validation display**: the shadcn `FormMessage` already translates Zod message keys — don't build per-form error rendering.
- **Action feedback**: keep the next-safe-action `error.serverError ?? t(...)` toast pattern consistent.

## Extract when you see it 3×

- A confirmation dialog → a single `ConfirmDeleteDialog`, not an inline `AlertDialog` per list.
- A near-identical section/card → one config-driven component.
- A repeated Zod fragment (e.g. the slug rule) → a shared schema piece.

## Known consolidation backlog (dedicated session)

1. Admin CRUD triplication (game / character / article: form + list + action + schema, ~64% identical) → generic CRUD scaffold + shared `slugSchema` + a `makeEntityActions` factory.
2. Inline delete `AlertDialog` repeated in ~7 lists → reuse a `ConfirmDeleteDialog`.
3. Dashboard `recent-*-section.tsx` (×3, near-identical) → one `RecentSection`.
4. next-safe-action toast boilerplate in ~16 files → a `useActionToast` hook.
5. `(key: string) => string` translator type duplicated 3× (`MatchTranslator`, `TemplateTranslator`, `replay-card`) → one shared `Translator`.
6. `formatDate` underused — ~7 inline `toLocaleDateString` call sites (mind the long `fr-FR` vs short format).
