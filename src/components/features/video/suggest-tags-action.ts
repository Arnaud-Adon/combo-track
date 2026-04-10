"use server";

import { suggestTagsFromNote } from "@/lib/ai/groq";
import { actionClient } from "@/lib/safe-action";
import z from "zod";

export const suggestTagsAction = actionClient
  .inputSchema(
    z.object({
      noteText: z.string().min(10, {
        error: "La note doit contenir au moins 10 caractères",
      }),
      availableTagNames: z
        .array(z.string())
        .min(1, { error: "Au moins un tag disponible requis" }),
    }),
  )
  .action(async ({ parsedInput }) => {
    const { noteText, availableTagNames } = parsedInput;

    const suggestedTags = await suggestTagsFromNote(
      noteText,
      availableTagNames,
    );

    return { suggestedTags };
  });
