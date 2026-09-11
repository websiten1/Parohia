import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { readJson, route } from "@/lib/api/errors";
import { requireAuth } from "@/lib/auth/session";
import { requireParishRole, STAFF } from "@/lib/auth/guards";
import { audienceFilter } from "@/lib/visibility";
import { createAnnouncementSchema } from "@/lib/validation/schemas";

type Ctx = { params: Promise<{ id: string }> };

export const GET = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  const { user } = await requireAuth(req);
  const membership = await requireParishRole(user.id, id);

  const announcements = await prisma.announcement.findMany({
    // The parish filter and the audience filter are ANDed, so no audience rule
    // can ever widen the query beyond this one parish.
    where: { parishId: id, ...audienceFilter(membership.role, user.dateOfBirth) },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    select: {
      id: true, title: true, body: true, visibility: true, minAge: true, maxAge: true,
      publishedAt: true, createdAt: true,
      author: { select: { id: true, firstName: true, lastName: true } },
    },
  });

  return NextResponse.json({ announcements });
});

export const POST = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  const { user } = await requireAuth(req);
  await requireParishRole(user.id, id, STAFF);

  const { publish, ...input } = createAnnouncementSchema.parse(await readJson(req));

  const announcement = await prisma.announcement.create({
    data: {
      ...input,
      parishId: id,
      authorId: user.id,
      publishedAt: publish ? new Date() : null,
    },
  });

  return NextResponse.json({ announcement }, { status: 201 });
});
