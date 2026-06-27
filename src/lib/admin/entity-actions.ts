import { revalidatePath } from "next/cache";

/**
 * Shared building blocks for the admin CRUD actions (game / character /
 * article). Closure-based on purpose: the typed prisma call stays at the call
 * site, so these helpers stay generic without leaking `any` or coupling to a
 * specific Prisma delegate. See `.claude/rules/dry.md` for why a single
 * `makeEntityActions` factory was declined.
 */

/** `"" | undefined` → `null`, otherwise the trimmed-in URL string. */
export function normalizeOptionalUrl(
  value: string | null | undefined,
): string | null {
  return value && value.length > 0 ? value : null;
}

/**
 * Throw `errorMessage` when `lookup` finds an existing row. Each entity passes
 * its own scoped query (global, `gameId`-scoped, or `NOT: { id }`).
 */
export async function assertSlugAvailable(
  lookup: () => Promise<unknown | null>,
  errorMessage: string,
): Promise<void> {
  const existing = await lookup();
  if (existing) {
    throw new Error(errorMessage);
  }
}

/**
 * Shared body for the `delete` admin actions — the three were ~99% identical.
 * Kept as a plain async helper (not a factory) because a Next.js `"use server"`
 * file must export literal async functions, so the action itself stays inline in
 * each action file; only this body is shared. `deleteById` keeps the typed
 * prisma delegate at the call site.
 */
export async function runDelete(
  deleteById: (id: string) => Promise<unknown>,
  id: string,
  revalidatePaths: string[],
): Promise<{ success: true }> {
  await deleteById(id);
  for (const path of revalidatePaths) {
    revalidatePath(path);
  }
  return { success: true };
}
