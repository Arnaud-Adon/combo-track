import { generateEmbedding } from "@/lib/ai/openai";
import { Prisma, prisma } from "@/lib/prisma";

export type NoteSearchResult = {
  id: string;
  matchId: string;
  matchTitle: string;
  timestamp: number;
  content: string;
  similarity: number;
};

type NoteSearchRow = {
  id: string;
  matchId: string;
  matchTitle: string;
  timestamp: number;
  content: string;
  distance: number;
};

export async function searchNotesSemantic(
  userId: string,
  query: string,
  limit = 10,
): Promise<NoteSearchResult[]> {
  const embedding = await generateEmbedding(query);
  if (!embedding) {
    return [];
  }

  const vectorLiteral = `[${embedding.join(",")}]`;
  const vectorCast = Prisma.raw(`'${vectorLiteral}'::vector`);

  const rows = await prisma.$queryRaw<NoteSearchRow[]>`
    SELECT
      n."id" AS "id",
      n."matchId" AS "matchId",
      m."title" AS "matchTitle",
      n."timestamp" AS "timestamp",
      n."content" AS "content",
      n."embedding" <=> ${vectorCast} AS "distance"
    FROM "Note" n
    INNER JOIN "Match" m ON m."id" = n."matchId"
    WHERE m."userId" = ${userId}
      AND n."embedding" IS NOT NULL
    ORDER BY n."embedding" <=> ${vectorCast}
    LIMIT ${limit}
  `;

  return rows.map((row) => ({
    id: row.id,
    matchId: row.matchId,
    matchTitle: row.matchTitle,
    timestamp: row.timestamp,
    content: row.content,
    similarity: 1 - row.distance,
  }));
}
