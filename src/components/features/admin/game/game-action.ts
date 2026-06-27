"use server";

import { prisma } from "@/lib/prisma";
import { adminActionClient } from "@/lib/admin-action";
import {
  assertSlugAvailable,
  normalizeOptionalUrl,
  runDelete,
} from "@/lib/admin/entity-actions";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { createGameSchema, updateGameSchema } from "./game-schema";
import z from "zod";

export const createGameAction = adminActionClient
  .inputSchema(createGameSchema)
  .action(async ({ parsedInput }) => {
    const t = await getTranslations("admin");
    const { name, slug, iconUrl } = parsedInput;

    await assertSlugAvailable(
      () => prisma.game.findUnique({ where: { slug } }),
      t("game.errors.slugExists"),
    );

    const game = await prisma.game.create({
      data: {
        name,
        slug,
        iconUrl: normalizeOptionalUrl(iconUrl),
      },
    });

    revalidatePath("/admin/games");
    revalidatePath("/characters");

    return game;
  });

export const updateGameAction = adminActionClient
  .inputSchema(updateGameSchema)
  .action(async ({ parsedInput }) => {
    const t = await getTranslations("admin");
    const { id, name, slug, iconUrl } = parsedInput;

    await assertSlugAvailable(
      () => prisma.game.findFirst({ where: { slug, NOT: { id } } }),
      t("game.errors.slugExists"),
    );

    const game = await prisma.game.update({
      where: { id },
      data: {
        name,
        slug,
        iconUrl: normalizeOptionalUrl(iconUrl),
      },
    });

    revalidatePath("/admin/games");
    revalidatePath("/characters");

    return game;
  });

export const deleteGameAction = adminActionClient
  .inputSchema(
    z.object({ id: z.string().min(1, "admin.validation.game.idRequired") }),
  )
  .action(async ({ parsedInput }) =>
    runDelete((id) => prisma.game.delete({ where: { id } }), parsedInput.id, [
      "/admin/games",
      "/characters",
    ]),
  );
