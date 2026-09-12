import { NextResponse } from "next/server";
import { MembershipRole, MembershipStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { conflict, route } from "@/lib/api/errors";
import { requireAuth } from "@/lib/auth/session";
import { requireOwnedResource, STAFF } from "@/lib/auth/guards";
import { recordAudit } from "@/lib/audit";

export const POST = route(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const { user } = await requireAuth(req);

  const { resource } = await requireOwnedResource(
    user.id,
    () => prisma.membership.findUnique({ where: { id } }),
    STAFF,
  );

  // A parish must not be left without a priest, and an admin must not be able
  // to depose the priest who appointed them.
  if (resource.role === MembershipRole.PRIEST) {
    throw conflict("cannot_reject_priest", "A priest's own membership cannot be rejected here.");
  }

  const membership = await prisma.$transaction(async (tx) => {
    const updated = await tx.membership.update({
      where: { id },
      data: { status: MembershipStatus.REJECTED, rejectedAt: new Date(), approvedAt: null },
      select: { id: true, status: true, rejectedAt: true },
    });
    await recordAudit(
      {
        action: "membership.rejected",
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
