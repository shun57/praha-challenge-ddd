/*
  Warnings:

  - You are about to drop the `Membership` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `teamId` to the `Pair` table without a default value. This is not possible if the table is not empty.
  - Added the required column `enrollmentStatus` to the `Participant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_pairId_fkey";

-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_participantId_fkey";

-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_teamId_fkey";

-- AlterTable
ALTER TABLE "Pair" ADD COLUMN     "teamId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "enrollmentStatus" VARCHAR(255) NOT NULL;

-- DropTable
DROP TABLE "Membership";

-- CreateTable
CREATE TABLE "PairMember" (
    "id" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "pairId" TEXT NOT NULL,

    CONSTRAINT "PairMember_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PairMember" ADD CONSTRAINT "PairMember_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PairMember" ADD CONSTRAINT "PairMember_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "Pair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pair" ADD CONSTRAINT "Pair_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
