import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { notFound, readJson, route } from "@/lib/api/errors";
import { requireAuth } from "@/lib/auth/session";
import { requireParishRole, STAFF } from "@/lib/auth/guards";
import { updateParishSchema } from "@/lib/validation/schemas";

type Ctx = { params: Promise<{ id: string }> };

/**
 * Readable only by a verified member. The join code is withheld from ordinary
 * members: handing it to everyone would defeat priest-controlled access.
 */
export const GET = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  const { user } = await requireAuth(req);
  const membership = await requireParishRole(user.id, id);

  const parish = await prisma.parish.findFirst({
    where: { id, deletedAt: null },
    include: {
      clergy: { orderBy: { sortOrder: "asc" } },
      photos: { orderBy: { sortOrder: "asc" } },
    },
  });
  if (!parish) throw notFound("That parish does not exist.");

  const isStaff = STAFF.includes(membership.role);
  const { joinCode, ...rest } = parish;

  return NextResponse.json({
    parish: isStaff ? { ...rest, joinCode } : rest,
    membership: { role: membership.role, status: membership.status },
  });
});

export const PATCH = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  const { user } = await requireAuth(req);
  await requireParishRole(user.id, id, STAFF);

  const input = updateParishSchema.parse(await readJson(req));
  const parish = await prisma.parish.update({ where: { id }, data: input });

  return NextResponse.json({ parish });
});
