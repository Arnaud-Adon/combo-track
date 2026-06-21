"use server";
import { prisma } from "@/lib/prisma";
import { embedNoteIfNeeded } from "@/lib/rag/embed-content";
import { actionClient } from "@/lib/safe-action";
import { after } from "next/server";
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
    }),
  )
  .action(async ({ parsedInput }) => {
    const { content, timestamp, matchId, tagIds } = parsedInput;

    const note = await prisma.note.create({
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

    after(async () => {
      await embedNoteIfNeeded(note.id, note.content);
    });

    return note;
  });

export const updateNoteAction = actionClient
  .inputSchema(
    z.object({
      noteId: z.string().min(1, { error: "video.validation.noteIdRequired" }),
      content: z
        .string()
        .min(2, { error: "Note must be at least 2 characters" }),
    }),
  )
  .action(async ({ parsedInput }) => {
    const { noteId, content } = parsedInput;

    const note = await prisma.note.update({
      where: { id: noteId },
      data: { content },
    });

    after(async () => {
      await embedNoteIfNeeded(note.id, note.content);
    });

    return note;
  });

export const deleteNoteAction = actionClient
  .inputSchema(
    z.object({
      noteId: z.string().min(1, { error: "video.validation.noteIdRequired" }),
    }),
  )
  .action(async ({ parsedInput }) => {
    const { noteId } = parsedInput;

    await prisma.note.delete({
      where: { id: noteId },
    });

    return { success: true };
  });
