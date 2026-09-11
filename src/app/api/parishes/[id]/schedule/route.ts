import { NextResponse } from "next/server";
import { ScheduleSource } from "@prisma/client";
import { prisma } from "@/lib/db";
import { readJson, route } from "@/lib/api/errors";
import { requireAuth } from "@/lib/auth/session";
import { requireParishRole, STAFF } from "@/lib/auth/guards";
import { createScheduleEntrySchema } from "@/lib/validation/schemas";

type Ctx = { params: Promise<{ id: string }> };

/** The parish's services. Visible to every verified member; written by staff. */
export const GET = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  const { user } = await requireAuth(req);
  await requireParishRole(user.id, id);

  const from = new URL(req.url).searchParams.get("from");
  const entries = await prisma.liturgicalScheduleEntry.findMany({
    where: { parishId: id, ...(from && { startsAt: { gte: new Date(from) } }) },
    orderBy: { startsAt: "asc" },
    select: { id: true, serviceName: true, startsAt: true, note: true, source: true },
  });

  return NextResponse.json({ entries });
});

export const POST = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  const { user } = await requireAuth(req);
  await requireParishRole(user.id, id, STAFF);

  const input = createScheduleEntrySchema.parse(await readJson(req));
  const entry = await prisma.liturgicalScheduleEntry.create({
    data: { ...input, parishId: id, createdById: user.id, source: ScheduleSource.MANUAL },
  });

  return NextResponse.json({ entry }, { status: 201 });
});
