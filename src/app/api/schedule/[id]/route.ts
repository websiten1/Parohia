import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { readJson, route } from "@/lib/api/errors";
import { requireAuth } from "@/lib/auth/session";
import { requireOwnedResource, STAFF } from "@/lib/auth/guards";
import { createScheduleEntrySchema } from "@/lib/validation/schemas";

type Ctx = { params: Promise<{ id: string }> };
const load = (id: string) => () => prisma.liturgicalScheduleEntry.findUnique({ where: { id } });

export const GET = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  const { user } = await requireAuth(req);
  const { resource } = await requireOwnedResource(user.id, load(id));
  return NextResponse.json({ entry: resource });
});

export const PATCH = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  const { user } = await requireAuth(req);
  await requireOwnedResource(user.id, load(id), STAFF);

  const input = createScheduleEntrySchema.partial().parse(await readJson(req));
  const entry = await prisma.liturgicalScheduleEntry.update({ where: { id }, data: input });
  return NextResponse.json({ entry });
});

export const DELETE = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  const { user } = await requireAuth(req);
  await requireOwnedResource(user.id, load(id), STAFF);

  await prisma.liturgicalScheduleEntry.delete({ where: { id } });
  return NextResponse.json({ ok: true });
});
