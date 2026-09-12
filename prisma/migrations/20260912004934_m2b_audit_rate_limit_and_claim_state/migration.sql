-- AlterEnum
ALTER TYPE "JoinMethod" ADD VALUE 'CLAIM';

-- AlterTable
ALTER TABLE "Parish" ADD COLUMN     "claimCodeHash" TEXT,
ADD COLUMN     "claimCodeIssuedAt" TIMESTAMP(3),
ADD COLUMN     "claimEmail" TEXT,
ADD COLUMN     "claimedAt" TIMESTAMP(3),
ADD COLUMN     "claimedById" TEXT,
ADD COLUMN     "detailsReviewedAt" TIMESTAMP(3),
ADD COLUMN     "directoryRef" TEXT;

-- AlterTable
ALTER TABLE "ParishPhoto" ADD COLUMN     "blobPathname" TEXT;

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" TEXT NOT NULL,
    "parishId" TEXT,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT,
    "metadata" JSONB,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateLimit" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "windowStart" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "RateLimit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AuditEvent_parishId_createdAt_idx" ON "AuditEvent"("parishId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditEvent_actorId_createdAt_idx" ON "AuditEvent"("actorId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditEvent_action_createdAt_idx" ON "AuditEvent"("action", "createdAt");

-- CreateIndex
CREATE INDEX "RateLimit_windowStart_idx" ON "RateLimit"("windowStart");

-- CreateIndex
CREATE UNIQUE INDEX "RateLimit_key_windowStart_key" ON "RateLimit"("key", "windowStart");

-- CreateIndex
CREATE UNIQUE INDEX "Parish_directoryRef_key" ON "Parish"("directoryRef");

-- CreateIndex
CREATE UNIQUE INDEX "Parish_claimCodeHash_key" ON "Parish"("claimCodeHash");

-- CreateIndex
CREATE INDEX "Parish_claimedAt_idx" ON "Parish"("claimedAt");

-- AddForeignKey
ALTER TABLE "Parish" ADD CONSTRAINT "Parish_claimedById_fkey" FOREIGN KEY ("claimedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_parishId_fkey" FOREIGN KEY ("parishId") REFERENCES "Parish"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;


-- Backfill --------------------------------------------------------------
--
-- Every parish that exists today was self-created through the founder flow,
-- so it is already owned. Joining now requires a claimed parish, to stop
-- parishioners piling up as PENDING against one with no priest to approve
-- them. Without this backfill that rule would strand the existing parishes
-- and their members could no longer join.
--
-- DISTINCT ON picks the earliest priest per parish, so the result does not
-- depend on row order.
UPDATE "Parish" p
SET "claimedAt"   = COALESCE(sub."approvedAt", sub."createdAt", p."createdAt"),
    "claimedById" = sub."userId"
FROM (
  SELECT DISTINCT ON ("parishId")
         "parishId", "userId", "approvedAt", "createdAt"
  FROM "Membership"
  WHERE "role" = 'PRIEST'
  ORDER BY "parishId", "createdAt" ASC
) sub
WHERE sub."parishId" = p."id"
  AND p."claimedAt" IS NULL;
