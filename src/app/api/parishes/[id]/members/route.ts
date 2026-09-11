import { NextResponse } from "next/server";
import { MembershipStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { route } from "@/lib/api/errors";
import { requireAuth } from "@/lib/auth/session";
import { requireParishRole, STAFF } from "@/lib/auth/guards";

/**
 * The roster, and the approval queue when filtered to pending. Staff only:
 * ordinary members have no business reading everyone's contact details.
 */
export const GET = route(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const { user } = await requireAuth(req);
  await requireParishRole(user.id, id, STAFF);

  const statusParam = new URL(req.url).searchParams.get("status")?.toUpperCase();
  const status =
    statusParam && statusParam in MembershipStatus
      ? (statusParam as MembershipStatus)
      : undefined;

  const members = await prisma.membership.findMany({
    where: { parishId: id, ...(status && { status }) },
    select: {
      id: true,
      role: true,
      status: true,
      joinedVia: true,
      createdAt: true,
      approvedAt: true,
      user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
    },
    orderBy: [{ status: "asc" }, { createdAt: "asc" }],
  });

  return NextResponse.json({ members, count: members.length });
});
