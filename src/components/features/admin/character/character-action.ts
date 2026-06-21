"use server";

import { prisma } from "@/lib/prisma";
import { adminActionClient } from "@/lib/admin-action";
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

    const existing = await prisma.character.findFirst({
      where: { gameId, slug },
    });

    if (existing) {
      throw new Error(t("character.errors.slugExists"));
    }

    const character = await prisma.character.create({
      data: {
        gameId,
        name,
        slug,
        iconUrl: iconUrl && iconUrl.length > 0 ? iconUrl : null,
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

    const existing = await prisma.character.findFirst({
      where: {
        gameId,
        slug,
        NOT: { id },
      },
    });

    if (existing) {
      throw new Error(t("character.errors.slugExists"));
    }

    const character = await prisma.character.update({
      where: { id },
      data: {
        gameId,
        name,
        slug,
        iconUrl: iconUrl && iconUrl.length > 0 ? iconUrl : null,
      },
    });

    revalidatePath("/admin/characters");
    revalidatePath("/admin/games");

    return character;
  });

export const deleteCharacterAction = adminActionClient
  .inputSchema(
    z.object({
      id: z.string().min(1, "admin.validation.character.idRequired"),
    }),
  )
  .action(async ({ parsedInput }) => {
    await prisma.character.delete({
      where: { id: parsedInput.id },
    });

    revalidatePath("/admin/characters");
    revalidatePath("/admin/games");

    return { success: true };
  });
