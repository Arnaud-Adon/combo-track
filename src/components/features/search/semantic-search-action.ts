"use server";

import { authActionClient } from "@/lib/auth-action";
import { searchGlossarySemantic } from "@/lib/rag/search-glossary";
import { searchMemosSemantic } from "@/lib/rag/search-memos";
import { searchNotesSemantic } from "@/lib/rag/search-notes";
import { z } from "zod";

const SEARCH_SCOPES = ["notes", "glossary", "memos", "all"] as const;

export const semanticSearchAction = authActionClient
  .inputSchema(
    z.object({
      query: z.string().min(2).max(200),
      scope: z.enum(SEARCH_SCOPES).default("all"),
      limit: z.number().int().min(1).max(50).default(10),
    }),
  )
  .action(async ({ parsedInput, ctx }) => {
    const { query, scope, limit } = parsedInput;

    const notes =
      scope === "notes" || scope === "all"
        ? await searchNotesSemantic(ctx.user.id, query, limit)
        : [];

    const glossary =
      scope === "glossary" || scope === "all"
        ? await searchGlossarySemantic(query, limit)
        : [];

    const memos =
      scope === "memos" || scope === "all"
        ? await searchMemosSemantic(ctx.user.id, query, limit)
        : [];

    return { notes, glossary, memos };
  });
