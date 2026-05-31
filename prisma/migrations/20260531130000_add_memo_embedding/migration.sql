-- AlterTable: Memo
ALTER TABLE "Memo" ADD COLUMN "embedding" vector(1536);
ALTER TABLE "Memo" ADD COLUMN "contentHash" TEXT;
ALTER TABLE "Memo" ADD COLUMN "embeddingModel" TEXT;

-- HNSW index for cosine similarity search
CREATE INDEX "Memo_embedding_hnsw_idx" ON "Memo" USING hnsw ("embedding" vector_cosine_ops) WITH (m = 16, ef_construction = 64);
