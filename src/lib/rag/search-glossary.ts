import { generateEmbedding } from "@/lib/ai/openai";
import { Prisma, prisma } from "@/lib/prisma";

export type GlossarySearchResult = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  similarity: number;
};

type GlossarySearchRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  distance: number;
};

export async function searchGlossarySemantic(
  query: string,
  limit = 10,
): Promise<GlossarySearchResult[]> {
  const embedding = await generateEmbedding(query);
  if (!embedding) {
    return [];
  }

  const vectorLiteral = `[${embedding.join(",")}]`;
  const vectorCast = Prisma.raw(`'${vectorLiteral}'::vector`);

  const rows = await prisma.$queryRaw<GlossarySearchRow[]>`
    SELECT
      "id",
      "slug",
      "title",
      "excerpt",
      "category",
      "embedding" <=> ${vectorCast} AS "distance"
    FROM "glossary_article"
    WHERE "published" = true
      AND "embedding" IS NOT NULL
    ORDER BY "embedding" <=> ${vectorCast}
    LIMIT ${limit}
  `;

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    similarity: 1 - row.distance,
  }));
}
