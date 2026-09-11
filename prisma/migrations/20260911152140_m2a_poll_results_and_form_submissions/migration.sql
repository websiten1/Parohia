-- CreateEnum
CREATE TYPE "PollResultsVisibility" AS ENUM ('AFTER_VOTE', 'AFTER_CLOSE', 'ALWAYS');

-- AlterTable
ALTER TABLE "FormSubmission" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Poll" ADD COLUMN     "resultsVisibility" "PollResultsVisibility" NOT NULL DEFAULT 'AFTER_VOTE';

-- CreateIndex
CREATE UNIQUE INDEX "FormSubmission_formId_userId_key" ON "FormSubmission"("formId", "userId");

