-- CreateTable
CREATE TABLE "StrategyMatrix" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "myAxis" JSONB NOT NULL,
    "opponentAxis" JSONB NOT NULL,
    "cells" JSONB NOT NULL,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StrategyMatrix_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StrategyMatrix_userId_idx" ON "StrategyMatrix"("userId");

-- AddForeignKey
ALTER TABLE "StrategyMatrix" ADD CONSTRAINT "StrategyMatrix_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
