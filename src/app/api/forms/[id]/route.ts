import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { forbidden, route } from "@/lib/api/errors";
import { requireAuth } from "@/lib/auth/session";
import { requireOwnedResource, STAFF } from "@/lib/auth/guards";
import { audienceFilter } from "@/lib/visibility";

type Ctx = { params: Promise<{ id: string }> };
const load = (id: string) => () => prisma.form.findUnique({ where: { id } });

export const GET = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  const { user } = await requireAuth(req);
  const { resource, membership } = await requireOwnedResource(user.id, load(id));

  if (!STAFF.includes(membership.role)) {
    const visible = await prisma.form.findFirst({
      where: { id, parishId: resource.parishId, ...audienceFilter(membership.role, user.dateOfBirth) },
      select: { id: true },
    });
    if (!visible) throw forbidden("That form is not available to you.");
  }

  const form = await prisma.form.findUnique({
    where: { id },
    include: { fields: { orderBy: { sortOrder: "asc" } } },
  });

  return NextResponse.json({ form });
});

export const DELETE = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  const { user } = await requireAuth(req);
  await requireOwnedResource(user.id, load(id), STAFF);

  await prisma.form.delete({ where: { id } });
  return NextResponse.json({ ok: true });
});
