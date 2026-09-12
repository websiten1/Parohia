import { NextResponse } from "next/server";
import { JoinMethod, MembershipRole, MembershipStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { readJson, route } from "@/lib/api/errors";
import { requireAuth } from "@/lib/auth/session";
import { requirePlatformRole } from "@/lib/auth/guards";
import { generateJoinCode, generateParishSlug } from "@/lib/parish";
import { createParishSchema } from "@/lib/validation/schemas";

/**
 * Creates a parish and makes the caller its priest, in one transaction, so a
 * failure can never leave a parish nobody can administer.
 *
 * Restricted to platform administrators. Under diocese distribution every
 * parish is pre-created from the official directory and then claimed, so a
 * priest self-creating one would be a second, unvetted way to become a
 * priest-owner. The door stays shut until there is a reason to open it for
 * jurisdictions that are not distributed this way.
 *
 * The parish is marked claimed on creation: it has an owner from the first
 * moment, which is what the join flow requires.
 */
export const POST = route(async (req: Request) => {
  const { user } = await requireAuth(req);
  requirePlatformRole(user);
  const input = createParishSchema.parse(await readJson(req));

  const [slug, joinCode] = await Promise.all([generateParishSlug(input.name), generateJoinCode()]);

  const parish = await prisma.$transaction(async (tx) => {
    const created = await tx.parish.create({
      data: { ...input, slug, joinCode, claimedAt: new Date(), claimedById: user.id },
    });
    await tx.membership.create({
      data: {
        userId: user.id,
        parishId: created.id,
        role: MembershipRole.PRIEST,
        status: MembershipStatus.VERIFIED,
        joinedVia: JoinMethod.FOUNDER,
        approvedAt: new Date(),
      },
    });
    return created;
  });

  return NextResponse.json({ parish }, { status: 201 });
});
