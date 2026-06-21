import z from "zod";

/**
 * Shared Zod building blocks for the admin CRUD entities (game / character /
 * article). They keep each entity's exact min/max bounds and stable i18n error
 * keys (translated at render by the shadcn `FormMessage`) while removing the
 * duplicated slug / name / url / id fragments.
 */

/** A URL-safe slug: lowercase letters, digits and hyphens only. */
export const SLUG_REGEX = /^[a-z0-9-]+$/;

type SlugOptions = {
  base: string;
  min: number;
  max: number;
  /** Error key suffix for the `.min` rule (defaults to `slugMin`). */
  minKey?: string;
};

/** `<min>..<max>` slug constrained by {@link SLUG_REGEX}. */
export function slugSchema({ base, min, max, minKey = "slugMin" }: SlugOptions) {
  return z
    .string()
    .min(min, `${base}.${minKey}`)
    .max(max, `${base}.slugMax`)
    .regex(SLUG_REGEX, `${base}.slugFormat`);
}

type NameOptions = {
  base: string;
  min: number;
  max: number;
  /** Field prefix for the error keys (`name` by default, `title` for articles). */
  field?: string;
};

/** Bounded display name / title with `<field>Min` / `<field>Max` error keys. */
export function nameSchema({ base, min, max, field = "name" }: NameOptions) {
  return z
    .string()
    .min(min, `${base}.${field}Min`)
    .max(max, `${base}.${field}Max`);
}

/** Optional URL that also accepts the empty string (cleared input). */
export function urlFieldSchema(invalidKey: string) {
  return z.string().url(invalidKey).optional().or(z.literal(""));
}

/** Extend a form schema with the required `id` used by update actions. */
export function withIdExtension<T extends z.ZodRawShape>(schema: z.ZodObject<T>) {
  return schema.extend({ id: z.string().min(1) });
}
