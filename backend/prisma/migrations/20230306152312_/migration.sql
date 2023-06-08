/*
  Warnings:

  - You are about to alter the column `name` on the `Pair` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `name` on the `Participant` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `enrollmentStatus` on the `Participant` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `name` on the `Team` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "Pair" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "Participant" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "enrollmentStatus" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "Team" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255);

-- CreateTable
CREATE TABLE "Challenge" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParticipantChallenge" (
    "participantId" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "progress" VARCHAR(255) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ParticipantChallenge_participantId_key" ON "ParticipantChallenge"("participantId");

-- CreateIndex
CREATE UNIQUE INDEX "ParticipantChallenge_challengeId_key" ON "ParticipantChallenge"("challengeId");

-- AddForeignKey
ALTER TABLE "ParticipantChallenge" ADD CONSTRAINT "ParticipantChallenge_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantChallenge" ADD CONSTRAINT "ParticipantChallenge_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
