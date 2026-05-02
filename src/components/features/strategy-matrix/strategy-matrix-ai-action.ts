"use server";

import { generateStrategyMatrixCells } from "@/lib/ai/groq";
import { authActionClient } from "@/lib/auth-action";
import { prisma } from "@/lib/prisma";
import z from "zod";
import { axisSchema } from "./strategy-matrix-schema";

export const fillStrategyMatrixWithAiAction = authActionClient
  .inputSchema(
    z.object({
      title: z.string().min(1).max(120),
      description: z.string().max(500).optional(),
      gameId: z.string().min(1).optional(),
      myCharacterId: z.string().min(1).optional(),
      opponentCharacterId: z.string().min(1).optional(),
      myAxis: axisSchema,
      opponentAxis: axisSchema,
    }),
  )
  .action(async ({ parsedInput }) => {
    const [game, myChar, oppChar] = await Promise.all([
      parsedInput.gameId
        ? prisma.game.findUnique({
            where: { id: parsedInput.gameId },
            select: { name: true },
          })
        : null,
      parsedInput.myCharacterId
        ? prisma.character.findUnique({
            where: { id: parsedInput.myCharacterId },
            select: { name: true },
          })
        : null,
      parsedInput.opponentCharacterId
        ? prisma.character.findUnique({
            where: { id: parsedInput.opponentCharacterId },
            select: { name: true },
          })
        : null,
    ]);

    const cells = await generateStrategyMatrixCells({
      title: parsedInput.title,
      description: parsedInput.description,
      gameName: game?.name,
      myCharacterName: myChar?.name,
      opponentCharacterName: oppChar?.name,
      myAxis: parsedInput.myAxis,
      opponentAxis: parsedInput.opponentAxis,
    });

    if (!cells) {
      throw new Error(
        "Erreur lors de la génération IA. Vérifiez la clé API Groq.",
      );
    }

    return { cells };
  });
