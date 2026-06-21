# DRY — Don't Repeat Yourself

Before duplicating logic, markup or config, reuse the shared building blocks below. Extract a shared helper/component the **third** time a pattern appears (rule of three) — earlier if the duplication is error-prone.

## Reuse these (don't re-inline)

- **Dates**: `formatDate` (short), `formatDateLong` (long month), `formatDateFull` (weekday) and `formatTime` from `@/utils` — do not re-inline `toLocaleDateString("fr-FR", …)`.
- **Action feedback**: `useActionToast` from `@/hooks/use-action-toast` — wraps `useAction` with the `toast.success` / `toast.error(error.serverError ?? …)` boilerplate. Pass already-translated `successMessage` / `errorMessage`; keep side effects in `onSuccess` / `onError`.
- **Delete confirmation**: `ConfirmDeleteDialog` from `@/components/shared/confirm-delete-dialog` (+ `useDeleteDialog` from `@/hooks/use-delete-dialog`) — never inline an `AlertDialog` delete flow per list.
- **Dashboard sections**: `RecentSection` from `@/components/features/dashboard/recent-section` — generic header + empty state + animated grid/list.
- **Admin form footer**: `EntityFormButtons` from `@/components/features/admin/shared/entity-form-buttons` — shared cancel/submit block.
- **Admin Zod fragments**: `slugSchema` / `nameSchema` / `urlFieldSchema` / `withIdExtension` / `SLUG_REGEX` from `@/lib/validations/admin-schemas`.
- **Translator type**: `Translator` from `@/types/translator` — never re-declare `(key: string) => string`.
- **i18n test render**: `renderWithIntl` from `@/test/render-with-intl` — never redeclare the `NextIntlClientProvider` wrapper in a test file.
- **Translations**: `getTranslations` / `useTranslations` + the `fr` catalogs (see `i18n.md`). Generic labels live in the `common` namespace — reuse, don't duplicate.
- **Form validation display**: the shadcn `FormMessage` already translates Zod message keys — don't build per-form error rendering.

## Extract when you see it 3×

- A confirmation dialog → reuse `ConfirmDeleteDialog`, not an inline `AlertDialog` per list.
- A near-identical section/card → one config-driven component (see `RecentSection`).
- A repeated Zod fragment (e.g. the slug rule) → a shared schema piece in `admin-schemas.ts`.

## Known consolidation backlog

Resolved (2026-06-21): inline delete dialog (`ConfirmDeleteDialog` + `useDeleteDialog`), dashboard `recent-*` (`RecentSection`), toast boilerplate (`useActionToast`, 16 sites), `Translator` type, `formatDate` underuse, shared admin Zod fragments + `EntityFormButtons`.

Resolved (2026-06-22): admin CRUD actions — extracted closure-based helpers in `@/lib/admin/entity-actions` (`runDelete`, `assertSlugAvailable`, `normalizeOptionalUrl`). A single generic `makeEntityActions` factory was **declined on purpose**: the create/update divergences (character `gameNotFound` pre-check, article `createdBy` + RAG `after()` hook + `image ?? null`, per-entity slug scoping) live in the semantically important parts, and a Prisma-model-generic param has no clean shared delegate type → it would force `any` (the codebase has none). The closure helpers remove the real duplication while keeping each action explicit and typed. Note: a Next.js `"use server"` file must export literal async functions, so the delete action stays inline and only its body (`runDelete`) is shared — a `makeDeleteAction` that *returns* the action fails the build.

Remaining (optional):

1. Two delete dialogs still use the per-card `AlertDialogTrigger` idiom (`strategy-matrix-list`, `memo-list`); migrate to `ConfirmDeleteDialog` only if a controlled-state refactor of those loops is worthwhile.
