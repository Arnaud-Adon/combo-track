import { EMBEDDING_MODEL, generateEmbedding } from "@/lib/ai/openai";
import { Prisma, prisma } from "@/lib/prisma";
import { hashContent } from "@/lib/rag/content-hash";

function toVectorLiteral(embedding: number[]): string {
  return `[${embedding.join(",")}]`;
}

export async function embedNoteIfNeeded(
  noteId: string,
  content: string,
): Promise<void> {
  try {
    const hash = hashContent(content);

    const existing = await prisma.note.findUnique({
      where: { id: noteId },
      select: { contentHash: true, embeddingModel: true },
    });

    if (
      existing?.contentHash === hash &&
      existing.embeddingModel === EMBEDDING_MODEL
    ) {
      return;
    }

    const embedding = await generateEmbedding(content);
    if (!embedding) {
      return;
    }

    const vectorLiteral = toVectorLiteral(embedding);

    await prisma.$executeRaw`
      UPDATE "Note"
      SET "embedding" = ${Prisma.raw(`'${vectorLiteral}'::vector`)},
          "contentHash" = ${hash},
          "embeddingModel" = ${EMBEDDING_MODEL}
      WHERE "id" = ${noteId}
    `;
  } catch (error) {
    console.error("[rag] embedNoteIfNeeded failed", { noteId, error });
  }
}

export async function embedMemoIfNeeded(
  memoId: string,
  title: string,
  content: string,
): Promise<void> {
  try {
    const composed = `${title}\n\n${content}`;
    const hash = hashContent(composed);

    const existing = await prisma.memo.findUnique({
      where: { id: memoId },
      select: { contentHash: true, embeddingModel: true },
    });

    if (
      existing?.contentHash === hash &&
      existing.embeddingModel === EMBEDDING_MODEL
    ) {
      return;
    }

    const embedding = await generateEmbedding(composed);
    if (!embedding) {
      return;
    }

    const vectorLiteral = toVectorLiteral(embedding);

    await prisma.$executeRaw`
      UPDATE "Memo"
      SET "embedding" = ${Prisma.raw(`'${vectorLiteral}'::vector`)},
          "contentHash" = ${hash},
          "embeddingModel" = ${EMBEDDING_MODEL}
      WHERE "id" = ${memoId}
    `;
  } catch (error) {
    console.error("[rag] embedMemoIfNeeded failed", { memoId, error });
  }
}

export async function embedGlossaryArticleIfNeeded(
  articleId: string,
  title: string,
  content: string,
): Promise<void> {
  try {
    const composed = `${title}\n\n${content}`;
    const hash = hashContent(composed);

    const existing = await prisma.glossaryArticle.findUnique({
      where: { id: articleId },
      select: { contentHash: true, embeddingModel: true },
    });

    if (
      existing?.contentHash === hash &&
      existing.embeddingModel === EMBEDDING_MODEL
    ) {
      return;
    }

    const embedding = await generateEmbedding(composed);
    if (!embedding) {
      return;
    }

    const vectorLiteral = toVectorLiteral(embedding);

    await prisma.$executeRaw`
      UPDATE "glossary_article"
      SET "embedding" = ${Prisma.raw(`'${vectorLiteral}'::vector`)},
          "contentHash" = ${hash},
          "embeddingModel" = ${EMBEDDING_MODEL}
      WHERE "id" = ${articleId}
    `;
  } catch (error) {
    console.error("[rag] embedGlossaryArticleIfNeeded failed", {
      articleId,
      error,
    });
  }
}
