import { EMBEDDING_MODEL, generateEmbeddingsBatch } from "../src/lib/ai/openai";
import { Prisma, prisma } from "../src/lib/prisma";
import { hashContent } from "../src/lib/rag/content-hash";

const BATCH_SIZE = 50;
const SLEEP_BETWEEN_BATCHES_MS = 500;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toVectorLiteral(embedding: number[]): string {
  return `[${embedding.join(",")}]`;
}

async function backfillNotes(): Promise<void> {
  const notes = await prisma.note.findMany({
    where: { contentHash: null },
    select: { id: true, content: true },
  });

  console.log(`[backfill] notes to process: ${notes.length}`);

  for (let start = 0; start < notes.length; start += BATCH_SIZE) {
    const chunk = notes.slice(start, start + BATCH_SIZE);
    const embeddings = await generateEmbeddingsBatch(
      chunk.map((n) => n.content),
    );

    for (let i = 0; i < chunk.length; i += 1) {
      const note = chunk[i];
      const embedding = embeddings[i];
      if (!embedding) {
        continue;
      }
      const vectorLiteral = toVectorLiteral(embedding);
      await prisma.$executeRaw`
        UPDATE "Note"
        SET "embedding" = ${Prisma.raw(`'${vectorLiteral}'::vector`)},
            "contentHash" = ${hashContent(note.content)},
            "embeddingModel" = ${EMBEDDING_MODEL}
        WHERE "id" = ${note.id}
      `;
    }

    console.log(
      `[backfill] notes batch ${start + chunk.length}/${notes.length}`,
    );
    await sleep(SLEEP_BETWEEN_BATCHES_MS);
  }
}

async function backfillGlossary(): Promise<void> {
  const articles = await prisma.glossaryArticle.findMany({
    where: { contentHash: null, published: true },
    select: { id: true, title: true, content: true },
  });

  console.log(`[backfill] glossary articles to process: ${articles.length}`);

  for (let start = 0; start < articles.length; start += BATCH_SIZE) {
    const chunk = articles.slice(start, start + BATCH_SIZE);
    const composed = chunk.map((a) => `${a.title}\n\n${a.content}`);
    const embeddings = await generateEmbeddingsBatch(composed);

    for (let i = 0; i < chunk.length; i += 1) {
      const article = chunk[i];
      const embedding = embeddings[i];
      if (!embedding) {
        continue;
      }
      const vectorLiteral = toVectorLiteral(embedding);
      await prisma.$executeRaw`
        UPDATE "glossary_article"
        SET "embedding" = ${Prisma.raw(`'${vectorLiteral}'::vector`)},
            "contentHash" = ${hashContent(composed[i])},
            "embeddingModel" = ${EMBEDDING_MODEL}
        WHERE "id" = ${article.id}
      `;
    }

    console.log(
      `[backfill] glossary batch ${start + chunk.length}/${articles.length}`,
    );
    await sleep(SLEEP_BETWEEN_BATCHES_MS);
  }
}

async function backfillMemos(): Promise<void> {
  const memos = await prisma.memo.findMany({
    where: { contentHash: null },
    select: { id: true, title: true, content: true },
  });

  console.log(`[backfill] memos to process: ${memos.length}`);

  for (let start = 0; start < memos.length; start += BATCH_SIZE) {
    const chunk = memos.slice(start, start + BATCH_SIZE);
    const composed = chunk.map((m) => `${m.title}\n\n${m.content}`);
    const embeddings = await generateEmbeddingsBatch(composed);

    for (let i = 0; i < chunk.length; i += 1) {
      const memo = chunk[i];
      const embedding = embeddings[i];
      if (!embedding) {
        continue;
      }
      const vectorLiteral = toVectorLiteral(embedding);
      await prisma.$executeRaw`
        UPDATE "Memo"
        SET "embedding" = ${Prisma.raw(`'${vectorLiteral}'::vector`)},
            "contentHash" = ${hashContent(composed[i])},
            "embeddingModel" = ${EMBEDDING_MODEL}
        WHERE "id" = ${memo.id}
      `;
    }

    console.log(
      `[backfill] memos batch ${start + chunk.length}/${memos.length}`,
    );
    await sleep(SLEEP_BETWEEN_BATCHES_MS);
  }
}

async function main(): Promise<void> {
  console.log(`[backfill] starting with model ${EMBEDDING_MODEL}`);
  await backfillNotes();
  await backfillGlossary();
  await backfillMemos();
  console.log("[backfill] done");
}

main()
  .catch((error) => {
    console.error("[backfill] failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
