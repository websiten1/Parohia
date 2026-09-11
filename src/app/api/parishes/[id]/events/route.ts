import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { readJson, route } from "@/lib/api/errors";
import { STAFF } from "@/lib/auth/guards";
import { audienceFields, audienceWhere, parishScope, publishFields } from "@/lib/content";
import { createEventSchema } from "@/lib/validation/schemas";

type Ctx = { params: Promise<{ id: string }> };

/**
 * Defaults to what is still to come, since "upcoming parish events" is what
 * the screen promises. `?past=true` returns the archive instead.
 */
export const GET = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  const scope = await parishScope(req, id);
  const past = new URL(req.url).searchParams.get("past") === "true";
  const now = new Date();

  const events = await prisma.event.findMany({
    where: {
      parishId: id,
      ...audienceWhere(scope),
      // An event that has started but not finished still counts as upcoming.
      ...(past ? { startsAt: { lt: now } } : { OR: [{ endsAt: { gte: now } }, { startsAt: { gte: now } }] }),
    },
    orderBy: { startsAt: past ? "desc" : "asc" },
    select: {
      id: true, title: true, description: true, startsAt: true, endsAt: true,
      location: true, coverImageUrl: true, registrationUrl: true,
      visibility: true, minAge: true, maxAge: true, publishedAt: true,
      author: { select: { id: true, firstName: true, lastName: true } },
    },
  });

  return NextResponse.json({ events });
});

export const POST = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  const scope = await parishScope(req, id, STAFF);
  const parsed = createEventSchema.parse(await readJson(req));
  const { publish, title, description, startsAt, endsAt, location, coverImageUrl, registrationUrl, ...audience } = parsed;

  const event = await prisma.event.create({
    data: {
      title,
      description,
      startsAt,
      endsAt: endsAt ?? null,
      location: location ?? null,
      coverImageUrl: coverImageUrl ?? null,
      registrationUrl: registrationUrl ?? null,
      ...audienceFields(audience),
      ...publishFields(publish),
      parishId: id,
      authorId: scope.user.id,
    },
  });

  return NextResponse.json({ event }, { status: 201 });
});
