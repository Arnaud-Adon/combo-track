import { prisma } from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";
import z from "zod";

export const createNoteAction = actionClient
  .inputSchema(
    z.object({
      content: z
        .string()
        .min(2, { error: "Note must be at least 2 characters" }),
      timestamp: z.number().min(0, { error: "Timestamp must be positive" }),
      matchId: z.string().min(1, { error: "Match ID is required" }),
    }),
  )
  .action(async ({ parsedInput }) => {
    const { content, timestamp, matchId } = parsedInput;

    await prisma.note.create({
      data: {
        content,
        timestamp,
        matchId,
      },
    });

    return {
      success: true,
      message: "Note created successfully",
    };
  });
