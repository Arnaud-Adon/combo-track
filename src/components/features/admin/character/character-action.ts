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
import {
  createCharacterSchema,
  updateCharacterSchema,
} from "./character-schema";
import z from "zod";

export const createCharacterAction = adminActionClient
  .inputSchema(createCharacterSchema)
  .action(async ({ parsedInput }) => {
    const t = await getTranslations("admin");
    const { gameId, name, slug, iconUrl } = parsedInput;

    const game = await prisma.game.findUnique({ where: { id: gameId } });
    if (!game) {
      throw new Error(t("character.errors.gameNotFound"));
    }

    await assertSlugAvailable(
      () => prisma.character.findFirst({ where: { gameId, slug } }),
      t("character.errors.slugExists"),
    );

    const character = await prisma.character.create({
      data: {
        gameId,
        name,
        slug,
        iconUrl: normalizeOptionalUrl(iconUrl),
      },
    });

    revalidatePath("/admin/characters");
    revalidatePath("/admin/games");

    return character;
  });

export const updateCharacterAction = adminActionClient
  .inputSchema(updateCharacterSchema)
  .action(async ({ parsedInput }) => {
    const t = await getTranslations("admin");
    const { id, gameId, name, slug, iconUrl } = parsedInput;

    const game = await prisma.game.findUnique({ where: { id: gameId } });
    if (!game) {
      throw new Error(t("character.errors.gameNotFound"));
    }

    await assertSlugAvailable(
      () => prisma.character.findFirst({ where: { gameId, slug, NOT: { id } } }),
      t("character.errors.slugExists"),
    );

    const character = await prisma.character.update({
      where: { id },
      data: {
        gameId,
        name,
        slug,
        iconUrl: normalizeOptionalUrl(iconUrl),
      },
    });

    revalidatePath("/admin/characters");
    revalidatePath("/admin/games");

    return character;
  });

export const deleteCharacterAction = adminActionClient
  .inputSchema(
    z.object({ id: z.string().min(1, "admin.validation.character.idRequired") }),
  )
  .action(async ({ parsedInput }) =>
    runDelete(
      (id) => prisma.character.delete({ where: { id } }),
      parsedInput.id,
      ["/admin/characters", "/admin/games"],
    ),
  );
