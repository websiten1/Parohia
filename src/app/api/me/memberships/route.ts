import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { route } from "@/lib/api/errors";
import { requireAuth } from "@/lib/auth/session";

export const GET = route(async (req: Request) => {
  const { user } = await requireAuth(req);

  const memberships = await prisma.membership.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      role: true,
      status: true,
      createdAt: true,
      parish: { select: { id: true, name: true, slug: true, city: true, country: true, logoUrl: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ memberships });
});
