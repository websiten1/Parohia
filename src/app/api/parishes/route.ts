import { NextResponse } from "next/server";
import { JoinMethod, MembershipRole, MembershipStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { readJson, route } from "@/lib/api/errors";
import { requireAuth } from "@/lib/auth/session";
import { generateJoinCode, generateParishSlug } from "@/lib/parish";
import { createParishSchema } from "@/lib/validation/schemas";

/**
 * The "create an account for your parish" flow. Parish and founding priest
 * membership are written in one transaction, so a failure can never leave a
 * parish nobody can administer.
 *
 * A user may found more than one parish: in the diaspora a priest often serves
 * a parish and a mission.
 */
export const POST = route(async (req: Request) => {
  const { user } = await requireAuth(req);
  const input = createParishSchema.parse(await readJson(req));

  const [slug, joinCode] = await Promise.all([generateParishSlug(input.name), generateJoinCode()]);

  const parish = await prisma.$transaction(async (tx) => {
    const created = await tx.parish.create({ data: { ...input, slug, joinCode } });
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
