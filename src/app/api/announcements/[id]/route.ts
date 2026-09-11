import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { readJson, route } from "@/lib/api/errors";
import { STAFF } from "@/lib/auth/guards";
import { assertInAudience, audienceFields, publishFields, resourceScope } from "@/lib/content";
import { updateAnnouncementSchema } from "@/lib/validation/schemas";

type Ctx = { params: Promise<{ id: string }> };
const load = (id: string) => () => prisma.announcement.findUnique({ where: { id } });

export const GET = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  const scope = await resourceScope(req, load(id));

  await assertInAudience(
    scope,
    (where) => prisma.announcement.findFirst({ where, select: { id: true } }),
    id,
    scope.resource.parishId,
    "announcement",
  );

  return NextResponse.json({ announcement: scope.resource });
});

export const PATCH = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  await resourceScope(req, load(id), STAFF);

  const parsed = updateAnnouncementSchema.parse(await readJson(req));
  const { publish, title, body, ...audience } = parsed as {
    publish?: boolean; title?: string; body?: string;
  } & Parameters<typeof audienceFields>[0];

  const announcement = await prisma.announcement.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(body !== undefined && { body }),
      ...audienceFields(audience),
      ...publishFields(publish),
    },
  });

  return NextResponse.json({ announcement });
});

export const DELETE = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  await resourceScope(req, load(id), STAFF);

  await prisma.announcement.delete({ where: { id } });
  return NextResponse.json({ ok: true });
});
