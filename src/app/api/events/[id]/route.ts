import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { badRequest, readJson, route } from "@/lib/api/errors";
import { STAFF } from "@/lib/auth/guards";
import { assertInAudience, audienceFields, publishFields, resourceScope } from "@/lib/content";
import { updateEventSchema } from "@/lib/validation/schemas";

type Ctx = { params: Promise<{ id: string }> };
const load = (id: string) => () => prisma.event.findUnique({ where: { id } });

export const GET = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  const scope = await resourceScope(req, load(id));

  await assertInAudience(
    scope,
    (where) => prisma.event.findFirst({ where, select: { id: true } }),
    id,
    scope.resource.parishId,
    "event",
  );

  return NextResponse.json({ event: scope.resource });
});

export const PATCH = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  const scope = await resourceScope(req, load(id), STAFF);
  const parsed = updateEventSchema.parse(await readJson(req));
  const { publish, title, description, startsAt, endsAt, location, coverImageUrl, registrationUrl, ...audience } =
    parsed as {
      publish?: boolean; title?: string; description?: string; startsAt?: Date;
      endsAt?: Date | null; location?: string; coverImageUrl?: string; registrationUrl?: string;
    } & Parameters<typeof audienceFields>[0];

  // The create schema checks this across both fields at once. On a PATCH either
  // may be absent, so the missing side is taken from the stored record.
  const nextStart = startsAt ?? scope.resource.startsAt;
  const nextEnd = endsAt === undefined ? scope.resource.endsAt : endsAt;
  if (nextEnd && nextEnd < nextStart) {
    throw badRequest("invalid_range", "The end time must not be before the start time.", {
      endsAt: ["The end time must not be before the start time."],
    });
  }

  const event = await prisma.event.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(startsAt !== undefined && { startsAt }),
      ...(endsAt !== undefined && { endsAt }),
      ...(location !== undefined && { location }),
      ...(coverImageUrl !== undefined && { coverImageUrl }),
      ...(registrationUrl !== undefined && { registrationUrl }),
      ...audienceFields(audience),
      ...publishFields(publish),
    },
  });

  return NextResponse.json({ event });
});

export const DELETE = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  await resourceScope(req, load(id), STAFF);
  await prisma.event.delete({ where: { id } });
  return NextResponse.json({ ok: true });
});
