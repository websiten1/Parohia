import { NextResponse } from "next/server";
import { MembershipRole, MembershipStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { badRequest, conflict, readJson, route } from "@/lib/api/errors";
import { requireAuth } from "@/lib/auth/session";
import { PRIEST_ONLY, requireOwnedResource } from "@/lib/auth/guards";
import { recordAudit } from "@/lib/audit";
import { setRoleSchema } from "@/lib/validation/schemas";

/**
 * Appoints or stands down a delegate admin. Priest only: a delegate must not be
 * able to appoint further delegates, or the priest loses control of who holds
 * authority in the parish.
 */
export const POST = route(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const { user } = await requireAuth(req);
  const { role } = setRoleSchema.parse(await readJson(req));

  const { resource } = await requireOwnedResource(
    user.id,
    () => prisma.membership.findUnique({ where: { id } }),
    PRIEST_ONLY,
  );

  if (resource.userId === user.id) {
    throw badRequest("cannot_change_own_role", "You cannot change your own role.");
  }
  if (resource.role === MembershipRole.PRIEST) {
    throw conflict("cannot_demote_priest", "Another priest's role cannot be changed here.");
  }
  if (resource.status !== MembershipStatus.VERIFIED) {
    throw conflict("not_verified", "Approve this person before giving them a role.");
  }

  const membership = await prisma.$transaction(async (tx) => {
    const updated = await tx.membership.update({
      where: { id },
      data: { role, joinedVia: resource.joinedVia },
      select: { id: true, role: true, status: true },
    });
    await recordAudit(
      {
        action: "membership.role_changed",
        parishId: resource.parishId,
        actorId: user.id,
        targetType: "Membership",
        targetId: id,
        metadata: { subjectUserId: resource.userId, from: resource.role, to: role },
        req,
      },
      tx,
    );
    return updated;
  });

  return NextResponse.json({ membership });
});
