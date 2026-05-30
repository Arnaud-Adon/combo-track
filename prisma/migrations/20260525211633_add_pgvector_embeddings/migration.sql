-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- AlterTable: Note
ALTER TABLE "Note" ADD COLUMN "embedding" vector(1536);
ALTER TABLE "Note" ADD COLUMN "contentHash" TEXT;
ALTER TABLE "Note" ADD COLUMN "embeddingModel" TEXT;

-- AlterTable: GlossaryArticle (mapped to glossary_article)
ALTER TABLE "glossary_article" ADD COLUMN "embedding" vector(1536);
ALTER TABLE "glossary_article" ADD COLUMN "contentHash" TEXT;
ALTER TABLE "glossary_article" ADD COLUMN "embeddingModel" TEXT;

-- HNSW indexes for cosine similarity search
CREATE INDEX "Note_embedding_hnsw_idx" ON "Note" USING hnsw ("embedding" vector_cosine_ops) WITH (m = 16, ef_construction = 64);
CREATE INDEX "glossary_article_embedding_hnsw_idx" ON "glossary_article" USING hnsw ("embedding" vector_cosine_ops) WITH (m = 16, ef_construction = 64);
