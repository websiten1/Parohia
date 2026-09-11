import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { route } from "@/lib/api/errors";
import { requireAuth } from "@/lib/auth/session";
import { PRIEST_ONLY, requireParishRole } from "@/lib/auth/guards";
import { generateJoinCode } from "@/lib/parish";

/** Priest only. The remedy when a code leaks; pending requests are unaffected. */
export const POST = route(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const { user } = await requireAuth(req);
  await requireParishRole(user.id, id, PRIEST_ONLY);

  const parish = await prisma.parish.update({
    where: { id },
    data: { joinCode: await generateJoinCode(), joinCodeRotatedAt: new Date() },
    select: { id: true, joinCode: true, joinCodeRotatedAt: true },
  });

  return NextResponse.json({ parish });
});
