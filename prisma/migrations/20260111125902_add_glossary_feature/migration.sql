-- CreateTable
CREATE TABLE "glossary_article" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "category" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "glossary_article_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "glossary_article_slug_key" ON "glossary_article"("slug");

-- CreateIndex
CREATE INDEX "glossary_article_slug_idx" ON "glossary_article"("slug");

-- CreateIndex
CREATE INDEX "glossary_article_category_idx" ON "glossary_article"("category");

-- CreateIndex
CREATE INDEX "glossary_article_createdBy_idx" ON "glossary_article"("createdBy");

-- AddForeignKey
ALTER TABLE "glossary_article" ADD CONSTRAINT "glossary_article_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
