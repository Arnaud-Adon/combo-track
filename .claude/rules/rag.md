# RAG / Semantic Search

Semantic search infrastructure for `Note` and `GlossaryArticle`.

## Stack

- **pgvector** extension on Neon Postgres (declared via `Unsupported("vector(1536)")` in `prisma/schema.prisma`)
- **OpenAI `text-embedding-3-small`** (1536 dims) — wrapper in `src/lib/ai/openai.ts`
- **HNSW** index with `vector_cosine_ops` (`m = 16`, `ef_construction = 64`)
- **Indexation** : background via `after()` from `next/server` inside server actions (no queue)

## Layout

- `src/lib/ai/openai.ts` — `generateEmbedding`, `generateEmbeddingsBatch` (null-safe like Groq client)
- `src/lib/rag/content-hash.ts` — sha256 hash for change detection
- `src/lib/rag/embed-content.ts` — `embedNoteIfNeeded`, `embedGlossaryArticleIfNeeded` (skip when hash + model unchanged)
- `src/lib/rag/search-notes.ts` — cosine search scoped by `Match.userId`
- `src/lib/rag/search-glossary.ts` — cosine search on `published = true` articles
- `src/components/features/search/` — `semanticSearchAction` (authActionClient) + UI
- `app/(dashboard)/search/page.tsx` — entry page
- `scripts/backfill-embeddings.ts` — one-shot via `pnpm backfill:embeddings`

## Conventions

- Always embed via the `embed-content.ts` helpers — they check `contentHash` to avoid duplicate API calls
- Search queries that scope by user MUST join `Match` for notes (Note has no direct userId)
- pgvector has no native pre-filter — server-side over-fetch + WHERE clause is fine for <10k rows per user
- New tables that need RAG : add `embedding Unsupported("vector(1536)")?` + `contentHash String?` + `embeddingModel String?` + manual HNSW migration
- Cast vectors with `Prisma.raw(\`'\${literal}'::vector\`)`in`$queryRaw` / `$executeRaw`
