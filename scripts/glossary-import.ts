/**
 * Import structured glossary entries into the database.
 *
 * Usage:
 *   pnpm glossary:import <entries.json> [--dry-run] [--update] [--publish]
 *
 * Modes:
 *   --dry-run   Report semantic duplicates and planned actions. No writes.
 *   --update    Update an existing article when the slug already exists.
 *               Without it, existing slugs are skipped.
 *   --publish   Create/update with published = true. Default is draft (false),
 *               so you review in /admin/glossary before publishing.
 *
 * Entries file shape: an array of:
 *   { title, slug?, category, content, excerpt?, sourceUrl? }
 *
 * Mirrors createArticleAction (slug uniqueness, createdBy, embedding) but runs
 * outside the Better-Auth session, so it embeds inline like backfill-embeddings.
 */
import { readFileSync } from "node:fs";
import { EMBEDDING_MODEL, generateEmbedding } from "../src/lib/ai/openai";
import { Prisma, prisma } from "../src/lib/prisma";
import { hashContent } from "../src/lib/rag/content-hash";

type GlossaryEntry = {
  title: string;
  slug?: string;
  category: string;
  content: string;
  excerpt?: string;
  sourceUrl?: string;
};

type DuplicateMatch = {
  slug: string;
  title: string;
  similarity: number;
};

const DUPLICATE_THRESHOLD = 0.85;

function parseArgs(): {
  file: string;
  dryRun: boolean;
  update: boolean;
  publish: boolean;
} {
  const argv = process.argv.slice(2);
  const file = argv.find((arg) => !arg.startsWith("--"));

  if (!file) {
    console.error(
      "Usage: pnpm glossary:import <entries.json> [--dry-run] [--update] [--publish]",
    );
    process.exit(1);
  }

  return {
    file,
    dryRun: argv.includes("--dry-run"),
    update: argv.includes("--update"),
    publish: argv.includes("--publish"),
  };
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200);
}

function composeContent(entry: GlossaryEntry): string {
  if (!entry.sourceUrl) {
    return entry.content;
  }
  return `${entry.content}\n\n> Source : ${entry.sourceUrl}`;
}

function toVectorLiteral(embedding: number[]): string {
  return `[${embedding.join(",")}]`;
}

async function findSemanticDuplicates(
  composed: string,
): Promise<DuplicateMatch[]> {
  const embedding = await generateEmbedding(composed);
  if (!embedding) {
    return [];
  }

  const vectorCast = Prisma.raw(`'${toVectorLiteral(embedding)}'::vector`);

  const rows = await prisma.$queryRaw<
    Array<{ slug: string; title: string; distance: number }>
  >`
    SELECT "slug", "title", "embedding" <=> ${vectorCast} AS "distance"
    FROM "glossary_article"
    WHERE "embedding" IS NOT NULL
    ORDER BY "embedding" <=> ${vectorCast}
    LIMIT 3
  `;

  return rows
    .map((row) => ({
      slug: row.slug,
      title: row.title,
      similarity: 1 - row.distance,
    }))
    .filter((row) => row.similarity >= DUPLICATE_THRESHOLD);
}

async function embedArticle(
  id: string,
  title: string,
  content: string,
): Promise<void> {
  const composed = `${title}\n\n${content}`;
  const embedding = await generateEmbedding(composed);
  if (!embedding) {
    console.warn(`  ⚠ embedding skipped (no OpenAI key) for ${id}`);
    return;
  }

  await prisma.$executeRaw`
    UPDATE "glossary_article"
    SET "embedding" = ${Prisma.raw(`'${toVectorLiteral(embedding)}'::vector`)},
        "contentHash" = ${hashContent(composed)},
        "embeddingModel" = ${EMBEDDING_MODEL}
    WHERE "id" = ${id}
  `;
}

async function main(): Promise<void> {
  const { file, dryRun, update, publish } = parseArgs();
  const entries = JSON.parse(readFileSync(file, "utf8")) as GlossaryEntry[];

  console.log(
    `[glossary] ${entries.length} entries — ${dryRun ? "DRY RUN" : "WRITE"}, ` +
      `${publish ? "published" : "draft"}, update=${update}`,
  );

  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });

  if (!admin) {
    throw new Error("Aucun utilisateur ADMIN trouvé pour createdBy.");
  }

  for (const entry of entries) {
    const slug = entry.slug ? slugify(entry.slug) : slugify(entry.title);
    const content = composeContent(entry);

    const existing = await prisma.glossaryArticle.findUnique({
      where: { slug },
      select: { id: true },
    });

    const duplicates = await findSemanticDuplicates(
      `${entry.title}\n\n${content}`,
    );
    const nearDupes = duplicates.filter((d) => d.slug !== slug);

    console.log(`\n• ${entry.title} (${slug})`);
    if (nearDupes.length > 0) {
      for (const dupe of nearDupes) {
        console.log(
          `  ~ proche de "${dupe.title}" (${dupe.slug}) — ${(dupe.similarity * 100).toFixed(0)}%`,
        );
      }
    }

    if (dryRun) {
      console.log(
        `  → ${existing ? (update ? "would UPDATE" : "would SKIP (slug exists)") : "would CREATE"}`,
      );
      continue;
    }

    if (existing && !update) {
      console.log("  → SKIP (slug exists, pass --update to overwrite)");
      continue;
    }

    const article = existing
      ? await prisma.glossaryArticle.update({
          where: { id: existing.id },
          data: {
            title: entry.title,
            content,
            excerpt: entry.excerpt ?? null,
            category: entry.category,
            published: publish,
          },
        })
      : await prisma.glossaryArticle.create({
          data: {
            title: entry.title,
            slug,
            content,
            excerpt: entry.excerpt ?? null,
            category: entry.category,
            published: publish,
            createdBy: admin.id,
          },
        });

    await embedArticle(article.id, article.title, content);
    console.log(`  → ${existing ? "UPDATED" : "CREATED"}`);
  }

  console.log("\n[glossary] done.");
}

main()
  .catch((error) => {
    console.error("[glossary] failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
