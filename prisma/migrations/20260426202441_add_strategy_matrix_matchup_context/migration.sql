-- AlterTable
ALTER TABLE "StrategyMatrix" ADD COLUMN     "gameId" TEXT,
ADD COLUMN     "myCharacterId" TEXT,
ADD COLUMN     "opponentCharacterId" TEXT;

-- CreateIndex
CREATE INDEX "StrategyMatrix_userId_gameId_idx" ON "StrategyMatrix"("userId", "gameId");

-- CreateIndex
CREATE INDEX "StrategyMatrix_userId_myCharacterId_opponentCharacterId_idx" ON "StrategyMatrix"("userId", "myCharacterId", "opponentCharacterId");

-- AddForeignKey
ALTER TABLE "StrategyMatrix" ADD CONSTRAINT "StrategyMatrix_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StrategyMatrix" ADD CONSTRAINT "StrategyMatrix_myCharacterId_fkey" FOREIGN KEY ("myCharacterId") REFERENCES "Character"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StrategyMatrix" ADD CONSTRAINT "StrategyMatrix_opponentCharacterId_fkey" FOREIGN KEY ("opponentCharacterId") REFERENCES "Character"("id") ON DELETE SET NULL ON UPDATE CASCADE;
