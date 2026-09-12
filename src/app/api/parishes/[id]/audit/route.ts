import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { route } from "@/lib/api/errors";
import { STAFF } from "@/lib/auth/guards";
import { parishScope } from "@/lib/content";

type Ctx = { params: Promise<{ id: string }> };

/**
 * The parish's own history. Staff only, and scoped to this parish exactly like
 * every other parish-owned record, so it cannot become a way to read another
 * parish's activity.
 *
 * Read-only by design: there is no endpoint that edits or deletes an audit
 * record, because a history a participant can rewrite is not a history.
 */
export const GET = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  await parishScope(req, id, STAFF);

  const url = new URL(req.url);
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 50) || 50, 200);
  const before = url.searchParams.get("before");

  const events = await prisma.auditEvent.findMany({
    where: {
      parishId: id,
      ...(before && !Number.isNaN(Date.parse(before)) && { createdAt: { lt: new Date(before) } }),
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true, action: true, targetType: true, targetId: true,
      metadata: true, createdAt: true,
      actor: { select: { id: true, firstName: true, lastName: true } },
    },
  });

  return NextResponse.json({
    events,
    // Cursor for the next page, absent when this page is the last.
    nextBefore: events.length === limit ? events[events.length - 1].createdAt : null,
  });
});
