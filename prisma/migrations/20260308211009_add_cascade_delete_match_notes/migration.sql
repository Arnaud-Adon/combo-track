-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_matchId_fkey";

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;
