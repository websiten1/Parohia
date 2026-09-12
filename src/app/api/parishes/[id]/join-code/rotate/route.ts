import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { route } from "@/lib/api/errors";
import { requireAuth } from "@/lib/auth/session";
import { PRIEST_ONLY, requireParishRole } from "@/lib/auth/guards";
import { generateJoinCode } from "@/lib/parish";
import { recordAudit } from "@/lib/audit";

/** Priest only. The remedy when a code leaks; pending requests are unaffected. */
export const POST = route(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const { user } = await requireAuth(req);
  await requireParishRole(user.id, id, PRIEST_ONLY);

  const next = await generateJoinCode();
  const parish = await prisma.$transaction(async (tx) => {
    const updated = await tx.parish.update({
      where: { id },
      data: { joinCode: next, joinCodeRotatedAt: new Date() },
      select: { id: true, joinCode: true, joinCodeRotatedAt: true },
    });
    // The new code is deliberately not recorded: an audit log is read by more
    // people than the parish staff who are allowed to know it.
    await recordAudit(
      {
        action: "parish.join_code_rotated",
        parishId: id,
        actorId: user.id,
        targetType: "Parish",
        targetId: id,
        req,
      },
      tx,
    );
    return updated;
  });

  return NextResponse.json({ parish });
});
