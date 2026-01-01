-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('DRAFT', 'COMPLETED', 'ANALYZED', 'IN_PROGRESS');

-- CreateEnum
CREATE TYPE "MatchType" AS ENUM ('RANKED', 'TOURNAMENT', 'TRAINING');

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "matchType" "MatchType" NOT NULL DEFAULT 'RANKED',
ADD COLUMN     "status" "MatchStatus" NOT NULL DEFAULT 'IN_PROGRESS';
