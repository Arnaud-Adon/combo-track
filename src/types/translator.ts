/**
 * Translator function type for i18n scopes.
 *
 * A scoped translator mapping i18n keys to localized strings, as returned by
 * `useTranslations(namespace)` / `getTranslations(namespace)`. Use it instead of
 * re-declaring `(key: string) => string` per feature.
 */
export type Translator = (key: string) => string;
