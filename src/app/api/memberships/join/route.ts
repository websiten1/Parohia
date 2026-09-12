import { NextResponse } from "next/server";
import { JoinMethod, MembershipStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { badRequest, conflict, readJson, route } from "@/lib/api/errors";
import { requireAuth } from "@/lib/auth/session";
import { joinSchema } from "@/lib/validation/schemas";
import { recordAudit } from "@/lib/audit";

/**
 * Join by code. The result is always PENDING: the code gets someone into the
 * queue, never into the parish. Only a priest or delegate admin can approve.
 */
export const POST = route(async (req: Request) => {
  const { user } = await requireAuth(req);
  const { code } = joinSchema.parse(await readJson(req));

  const parish = await prisma.parish.findFirst({
    // An unclaimed parish has no priest, so a request to join it could never
    // be approved and would simply rot in the queue. It is excluded here
    // rather than rejected separately, so an unclaimed parish is also not
    // discoverable by trying its join code.
    where: { joinCode: code, deletedAt: null, claimedAt: { not: null } },
    select: { id: true, name: true },
  });
  // Deliberately vague: a valid-looking response for a wrong code would turn
  // this into an oracle for guessing other parishes' codes.
  if (!parish) throw badRequest("invalid_code", "That parish code is not recognised.");

  const existing = await prisma.membership.findUnique({
    where: { userId_parishId: { userId: user.id, parishId: parish.id } },
    select: { status: true },
  });

  if (existing) {
    const message = {
      [MembershipStatus.PENDING]: "You have already asked to join this parish.",
      [MembershipStatus.VERIFIED]: "You are already a member of this parish.",
      [MembershipStatus.REJECTED]: "A priest has declined your request to join this parish.",
    }[existing.status];
    throw conflict(`already_${existing.status.toLowerCase()}`, message);
  }

  const membership = await prisma.$transaction(async (tx) => {
    const created = await tx.membership.create({
      data: { userId: user.id, parishId: parish.id, joinedVia: JoinMethod.CODE },
      select: { id: true, status: true, role: true },
    });
    await recordAudit(
      {
        action: "membership.requested",
        parishId: parish.id,
        actorId: user.id,
        targetType: "Membership",
        targetId: created.id,
        req,
      },
      tx,
    );
    return created;
  });

  return NextResponse.json(
    { membership, parish: { id: parish.id, name: parish.name } },
    { status: 201 },
  );
});
