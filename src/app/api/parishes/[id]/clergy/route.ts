import { NextResponse } from "next/server";
import { MembershipRole, MembershipStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { readJson, route } from "@/lib/api/errors";
import { requireAuth } from "@/lib/auth/session";
import { requireParishRole, STAFF } from "@/lib/auth/guards";
import { createClergySchema } from "@/lib/validation/schemas";

type Ctx = { params: Promise<{ id: string }> };

/**
 * Two sources, as agreed. Clergy who hold accounts are derived from PRIEST and
 * ADMIN memberships; a deacon or cantor without an account is listed from the
 * display-only ClergyMember table, which no permission check ever consults.
 */
export const GET = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  const { user } = await requireAuth(req);
  await requireParishRole(user.id, id);

  const [withAccounts, displayOnly] = await Promise.all([
    prisma.membership.findMany({
      where: {
        parishId: id,
        status: MembershipStatus.VERIFIED,
        role: { in: [MembershipRole.PRIEST, MembershipRole.ADMIN] },
      },
      select: { role: true, user: { select: { id: true, firstName: true, lastName: true } } },
      orderBy: { role: "asc" },
    }),
    prisma.clergyMember.findMany({ where: { parishId: id }, orderBy: { sortOrder: "asc" } }),
  ]);

  return NextResponse.json({
    derived: withAccounts.map((m) => ({
      userId: m.user.id,
      name: `${m.user.firstName} ${m.user.lastName}`,
      role: m.role,
    })),
    displayOnly,
  });
});

export const POST = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  const { user } = await requireAuth(req);
  await requireParishRole(user.id, id, STAFF);

  const input = createClergySchema.parse(await readJson(req));
  const member = await prisma.clergyMember.create({ data: { ...input, parishId: id } });

  return NextResponse.json({ member }, { status: 201 });
});
