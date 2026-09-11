import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { forbidden, readJson, route } from "@/lib/api/errors";
import { requireAuth } from "@/lib/auth/session";
import { requireOwnedResource, STAFF } from "@/lib/auth/guards";
import { audienceFilter } from "@/lib/visibility";
import { updateAnnouncementSchema } from "@/lib/validation/schemas";
import { Visibility } from "@prisma/client";

type Ctx = { params: Promise<{ id: string }> };
const load = (id: string) => () => prisma.announcement.findUnique({ where: { id } });

export const GET = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  const { user } = await requireAuth(req);
  const { resource, membership } = await requireOwnedResource(user.id, load(id));

  // Membership alone is not enough: a member must also fall inside the item's
  // audience, or a direct fetch by id would bypass the list filter.
  if (!STAFF.includes(membership.role)) {
    const visible = await prisma.announcement.findFirst({
      where: { id, parishId: resource.parishId, ...audienceFilter(membership.role, user.dateOfBirth) },
      select: { id: true },
    });
    if (!visible) throw forbidden("That announcement is not available to you.");
  }

  return NextResponse.json({ announcement: resource });
});

export const PATCH = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  const { user } = await requireAuth(req);
  await requireOwnedResource(user.id, load(id), STAFF);

  const parsed = updateAnnouncementSchema.parse(await readJson(req)) as Record<string, unknown>;
  const { publish, ...rest } = parsed as { publish?: boolean } & Record<string, unknown>;

  const announcement = await prisma.announcement.update({
    where: { id },
    data: {
      ...rest,
      ...(publish !== undefined && { publishedAt: publish ? new Date() : null }),
      ...(rest.visibility !== undefined && rest.visibility !== Visibility.BY_AGE && {
        minAge: null,
        maxAge: null,
      }),
    },
  });

  return NextResponse.json({ announcement });
});

export const DELETE = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  const { user } = await requireAuth(req);
  await requireOwnedResource(user.id, load(id), STAFF);

  await prisma.announcement.delete({ where: { id } });
  return NextResponse.json({ ok: true });
});
