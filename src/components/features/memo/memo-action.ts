"use server";

import { authActionClient } from "@/lib/auth-action";
import { prisma } from "@/lib/prisma";
import { embedMemoIfNeeded } from "@/lib/rag/embed-content";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import {
  createMemoSchema,
  deleteMemoSchema,
  updateMemoSchema,
} from "./memo-schema";

export const createMemoAction = authActionClient
  .inputSchema(createMemoSchema)
  .action(async ({ parsedInput, ctx }) => {
    const memo = await prisma.memo.create({
      data: {
        userId: ctx.user.id,
        title: parsedInput.title,
        content: parsedInput.content,
      },
    });

    after(async () => {
      await embedMemoIfNeeded(memo.id, memo.title, memo.content);
    });

    revalidatePath("/notes/memo");

    return memo;
  });

export const updateMemoAction = authActionClient
  .inputSchema(updateMemoSchema)
  .action(async ({ parsedInput, ctx }) => {
    const existing = await prisma.memo.findUnique({
      where: { id: parsedInput.id },
      select: { userId: true },
    });

    if (!existing) {
      throw new Error("Mémo introuvable");
    }
    if (existing.userId !== ctx.user.id) {
      throw new Error("Non autorisé");
    }

    const memo = await prisma.memo.update({
      where: { id: parsedInput.id },
      data: {
        title: parsedInput.title,
        content: parsedInput.content,
      },
    });

    after(async () => {
      await embedMemoIfNeeded(memo.id, memo.title, memo.content);
    });

    revalidatePath("/notes/memo");
    revalidatePath(`/notes/memo/${parsedInput.id}`);

    return memo;
  });

export const deleteMemoAction = authActionClient
  .inputSchema(deleteMemoSchema)
  .action(async ({ parsedInput, ctx }) => {
    const existing = await prisma.memo.findUnique({
      where: { id: parsedInput.id },
      select: { userId: true },
    });

    if (!existing) {
      throw new Error("Mémo introuvable");
    }
    if (existing.userId !== ctx.user.id) {
      throw new Error("Non autorisé");
    }

    await prisma.memo.delete({ where: { id: parsedInput.id } });

    revalidatePath("/notes/memo");

    return { success: true };
  });
