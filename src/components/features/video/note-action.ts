"use server";
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
      tagIds: z
        .array(z.string())
        .min(1, { error: "At least one tag required" })
        .max(10, { error: "Maximum 10 tags allowed" }),
    })
  )
  .action(async ({ parsedInput }) => {
    const { content, timestamp, matchId, tagIds } = parsedInput;

    return await prisma.note.create({
      data: {
        content,
        timestamp,
        matchId,
        tags: {
          connect: tagIds.map((id) => ({ id })),
        },
      },
      include: {
        tags: true,
      },
    });
  });
