/*
  Warnings:

  - You are about to drop the column `teamId` on the `Pair` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Pair" DROP CONSTRAINT "Pair_teamId_fkey";

-- DropIndex
DROP INDEX "ParticipantChallenge_challengeId_key";

-- DropIndex
DROP INDEX "ParticipantChallenge_participantId_key";

-- AlterTable
ALTER TABLE "Pair" DROP COLUMN "teamId";

-- CreateTable
CREATE TABLE "TeamPair" (
    "teamId" TEXT NOT NULL,
    "pairId" TEXT NOT NULL,

    CONSTRAINT "TeamPair_pkey" PRIMARY KEY ("teamId","pairId")
);

-- AddForeignKey
ALTER TABLE "TeamPair" ADD CONSTRAINT "TeamPair_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamPair" ADD CONSTRAINT "TeamPair_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "Pair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
