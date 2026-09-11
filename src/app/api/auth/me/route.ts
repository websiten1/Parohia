import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { route } from "@/lib/api/errors";
import { requireAuth } from "@/lib/auth/session";
import { ageOn } from "@/lib/validation/schemas";

export const GET = route(async (req: Request) => {
  const { user } = await requireAuth(req);

  const memberships = await prisma.membership.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      role: true,
      status: true,
      parish: { select: { id: true, name: true, slug: true, city: true, country: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      dateOfBirth: user.dateOfBirth.toISOString().slice(0, 10),
      age: ageOn(user.dateOfBirth),
      phone: user.phone,
      preferredLanguage: user.preferredLanguage,
      platformRole: user.platformRole,
    },
    memberships,
  });
});
