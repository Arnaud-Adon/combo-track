"use server";

import { prisma } from "@/lib/prisma";
import { authActionClient } from "@/lib/auth-action";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { createComboSchema, updateComboSchema } from "./combo-schema";
import z from "zod";

export const createComboAction = authActionClient
  .inputSchema(createComboSchema)
  .action(async ({ parsedInput, ctx }) => {
    const t = await getTranslations("combo");
    const {
      characterId,
      title,
      notation,
      damage,
      meterUsed,
      difficulty,
      notes,
      tagIds,
      sourceNoteId,
    } = parsedInput;

    const character = await prisma.character.findUnique({
      where: { id: characterId },
      select: { id: true, gameId: true },
    });

    if (!character) {
      throw new Error(t("errors.characterNotFound"));
    }

    if (sourceNoteId) {
      const sourceNote = await prisma.note.findUnique({
        where: { id: sourceNoteId },
        select: { match: { select: { userId: true } } },
      });
      if (!sourceNote || sourceNote.match.userId !== ctx.user.id) {
        throw new Error(t("errors.sourceNoteUnauthorized"));
      }
    }

    const combo = await prisma.combo.create({
      data: {
        userId: ctx.user.id,
        gameId: character.gameId,
        characterId,
        title,
        notation,
        damage,
        meterUsed,
        difficulty,
        notes: notes && notes.length > 0 ? notes : null,
        sourceNoteId: sourceNoteId ?? null,
        tags: { connect: tagIds.map((id) => ({ id })) },
      },
    });

    revalidatePath("/combos");
    revalidatePath("/dashboard");

    return combo;
  });

export const updateComboAction = authActionClient
  .inputSchema(updateComboSchema)
  .action(async ({ parsedInput, ctx }) => {
    const t = await getTranslations("combo");
    const {
      id,
      characterId,
      title,
      notation,
      damage,
      meterUsed,
      difficulty,
      notes,
      tagIds,
      sourceNoteId,
    } = parsedInput;

    const existing = await prisma.combo.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing) {
      throw new Error(t("errors.comboNotFound"));
    }
    if (existing.userId !== ctx.user.id) {
      throw new Error(t("errors.unauthorized"));
    }

    const character = await prisma.character.findUnique({
      where: { id: characterId },
      select: { id: true, gameId: true },
    });

    if (!character) {
      throw new Error(t("errors.characterNotFound"));
    }

    const combo = await prisma.combo.update({
      where: { id },
      data: {
        gameId: character.gameId,
        characterId,
        title,
        notation,
        damage,
        meterUsed,
        difficulty,
        notes: notes && notes.length > 0 ? notes : null,
        sourceNoteId: sourceNoteId ?? null,
        tags: { set: tagIds.map((tagId) => ({ id: tagId })) },
      },
    });

    revalidatePath("/combos");
    revalidatePath(`/combos/${id}`);
    revalidatePath("/dashboard");

    return combo;
  });

export const deleteComboAction = authActionClient
  .inputSchema(
    z.object({
      id: z.string().min(1, "combo.validation.idRequired"),
    }),
  )
  .action(async ({ parsedInput, ctx }) => {
    const t = await getTranslations("combo");
    const existing = await prisma.combo.findUnique({
      where: { id: parsedInput.id },
      select: { userId: true },
    });

    if (!existing) {
      throw new Error(t("errors.comboNotFound"));
    }
    if (existing.userId !== ctx.user.id) {
      throw new Error(t("errors.unauthorized"));
    }

    await prisma.combo.delete({
      where: { id: parsedInput.id },
    });

    revalidatePath("/combos");
    revalidatePath("/dashboard");

    return { success: true };
  });
