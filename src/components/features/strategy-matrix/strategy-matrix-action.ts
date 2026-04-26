"use server";

import { authActionClient } from "@/lib/auth-action";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "../../../../generated/prisma";
import {
  strategyMatrixCreateSchema,
  strategyMatrixDeleteSchema,
  strategyMatrixUpdateSchema,
} from "./strategy-matrix-schema";

export const createStrategyMatrixAction = authActionClient
  .inputSchema(strategyMatrixCreateSchema)
  .action(async ({ parsedInput, ctx }) => {
    const matrix = await prisma.strategyMatrix.create({
      data: {
        userId: ctx.user.id,
        title: parsedInput.title,
        description: parsedInput.description,
        myAxis: parsedInput.myAxis as unknown as Prisma.InputJsonValue,
        opponentAxis:
          parsedInput.opponentAxis as unknown as Prisma.InputJsonValue,
        cells: parsedInput.cells as unknown as Prisma.InputJsonValue,
      },
    });

    revalidatePath("/notes/strategy");
    return { id: matrix.id };
  });

export const updateStrategyMatrixAction = authActionClient
  .inputSchema(strategyMatrixUpdateSchema)
  .action(async ({ parsedInput, ctx }) => {
    const existing = await prisma.strategyMatrix.findFirst({
      where: { id: parsedInput.id, userId: ctx.user.id },
      select: { id: true },
    });

    if (!existing) {
      throw new Error("Matrice introuvable");
    }

    const matrix = await prisma.strategyMatrix.update({
      where: { id: parsedInput.id },
      data: {
        title: parsedInput.title,
        description: parsedInput.description,
        myAxis: parsedInput.myAxis as unknown as Prisma.InputJsonValue,
        opponentAxis:
          parsedInput.opponentAxis as unknown as Prisma.InputJsonValue,
        cells: parsedInput.cells as unknown as Prisma.InputJsonValue,
      },
    });

    revalidatePath("/notes/strategy");
    revalidatePath(`/notes/strategy/${matrix.id}`);
    return { id: matrix.id };
  });

export const deleteStrategyMatrixAction = authActionClient
  .inputSchema(strategyMatrixDeleteSchema)
  .action(async ({ parsedInput, ctx }) => {
    const existing = await prisma.strategyMatrix.findFirst({
      where: { id: parsedInput.id, userId: ctx.user.id },
      select: { id: true },
    });

    if (!existing) {
      throw new Error("Matrice introuvable");
    }

    await prisma.strategyMatrix.delete({
      where: { id: parsedInput.id },
    });

    revalidatePath("/notes/strategy");
    return { success: true };
  });
