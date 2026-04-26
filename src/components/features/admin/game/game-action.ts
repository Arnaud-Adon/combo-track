"use server";

import { prisma } from "@/lib/prisma";
import { adminActionClient } from "@/lib/admin-action";
import { revalidatePath } from "next/cache";
import { createGameSchema, updateGameSchema } from "./game-schema";
import z from "zod";

export const createGameAction = adminActionClient
  .inputSchema(createGameSchema)
  .action(async ({ parsedInput }) => {
    const { name, slug, iconUrl } = parsedInput;

    const existing = await prisma.game.findUnique({
      where: { slug },
    });

    if (existing) {
      throw new Error("Un jeu avec ce slug existe déjà");
    }

    const game = await prisma.game.create({
      data: {
        name,
        slug,
        iconUrl: iconUrl && iconUrl.length > 0 ? iconUrl : null,
      },
    });

    revalidatePath("/admin/games");
    revalidatePath("/characters");

    return game;
  });

export const updateGameAction = adminActionClient
  .inputSchema(updateGameSchema)
  .action(async ({ parsedInput }) => {
    const { id, name, slug, iconUrl } = parsedInput;

    const existing = await prisma.game.findFirst({
      where: {
        slug,
        NOT: { id },
      },
    });

    if (existing) {
      throw new Error("Un jeu avec ce slug existe déjà");
    }

    const game = await prisma.game.update({
      where: { id },
      data: {
        name,
        slug,
        iconUrl: iconUrl && iconUrl.length > 0 ? iconUrl : null,
      },
    });

    revalidatePath("/admin/games");
    revalidatePath("/characters");

    return game;
  });

export const deleteGameAction = adminActionClient
  .inputSchema(
    z.object({
      id: z.string().min(1, "L'ID du jeu est requis"),
    }),
  )
  .action(async ({ parsedInput }) => {
    await prisma.game.delete({
      where: { id: parsedInput.id },
    });

    revalidatePath("/admin/games");
    revalidatePath("/characters");

    return { success: true };
  });
