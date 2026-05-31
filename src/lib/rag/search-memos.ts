import { generateEmbedding } from "@/lib/ai/openai";
import { Prisma, prisma } from "@/lib/prisma";

export type MemoSearchResult = {
  id: string;
  title: string;
  content: string;
  updatedAt: Date;
  similarity: number;
};

type MemoSearchRow = {
  id: string;
  title: string;
  content: string;
  updatedAt: Date;
  distance: number;
};

export async function searchMemosSemantic(
  userId: string,
  query: string,
  limit = 10,
): Promise<MemoSearchResult[]> {
  const embedding = await generateEmbedding(query);
  if (!embedding) {
    return [];
  }

  const vectorLiteral = `[${embedding.join(",")}]`;
  const vectorCast = Prisma.raw(`'${vectorLiteral}'::vector`);

  const rows = await prisma.$queryRaw<MemoSearchRow[]>`
    SELECT
      "id",
      "title",
      "content",
      "updatedAt",
      "embedding" <=> ${vectorCast} AS "distance"
    FROM "Memo"
    WHERE "userId" = ${userId}
      AND "embedding" IS NOT NULL
    ORDER BY "embedding" <=> ${vectorCast}
    LIMIT ${limit}
  `;

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    content: row.content,
    updatedAt: row.updatedAt,
    similarity: 1 - row.distance,
  }));
}
