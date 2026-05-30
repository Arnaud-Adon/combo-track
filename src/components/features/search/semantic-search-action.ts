"use server";

import { authActionClient } from "@/lib/auth-action";
import { searchGlossarySemantic } from "@/lib/rag/search-glossary";
import { searchNotesSemantic } from "@/lib/rag/search-notes";
import { z } from "zod";

export const semanticSearchAction = authActionClient
  .inputSchema(
    z.object({
      query: z.string().min(2).max(200),
      scope: z.enum(["notes", "glossary", "both"]).default("both"),
      limit: z.number().int().min(1).max(50).default(10),
    }),
  )
  .action(async ({ parsedInput, ctx }) => {
    const { query, scope, limit } = parsedInput;

    const notes =
      scope === "notes" || scope === "both"
        ? await searchNotesSemantic(ctx.user.id, query, limit)
        : [];

    const glossary =
      scope === "glossary" || scope === "both"
        ? await searchGlossarySemantic(query, limit)
        : [];

    return { notes, glossary };
  });
