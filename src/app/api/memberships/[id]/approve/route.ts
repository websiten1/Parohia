import { NextResponse } from "next/server";
import { MembershipStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { conflict, route } from "@/lib/api/errors";
import { requireAuth } from "@/lib/auth/session";
import { requireOwnedResource, STAFF } from "@/lib/auth/guards";
import { recordAudit } from "@/lib/audit";

export const POST = route(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const { user } = await requireAuth(req);

  // Authorisation follows the record's own parishId, never a caller-supplied
  // one, so a priest of another parish cannot approve into this roster.
  const { resource } = await requireOwnedResource(
    user.id,
    () => prisma.membership.findUnique({ where: { id } }),
    STAFF,
  );

  if (resource.status === MembershipStatus.VERIFIED) {
    throw conflict("already_verified", "That person is already a member.");
  }

  // The change and its record commit together, so an approval can never
  // succeed unrecorded.
  const membership = await prisma.$transaction(async (tx) => {
    const updated = await tx.membership.update({
      where: { id },
      data: {
        status: MembershipStatus.VERIFIED,
        approvedById: user.id,
        approvedAt: new Date(),
        rejectedAt: null,
      },
      select: { id: true, status: true, role: true, approvedAt: true },
    });
    await recordAudit(
      {
        action: "membership.approved",
        parishId: resource.parishId,
        actorId: user.id,
        targetType: "Membership",
        targetId: id,
        metadata: { subjectUserId: resource.userId, previousStatus: resource.status },
        req,
      },
      tx,
    );
    return updated;
  });

  return NextResponse.json({ membership });
});
