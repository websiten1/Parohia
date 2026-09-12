import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { readJson, route } from "@/lib/api/errors";
import { issuePasswordReset } from "@/lib/auth/verification";
import { callerKey, consumeQuietly, RULES } from "@/lib/rate-limit";
import { resetRequestSchema } from "@/lib/validation/schemas";

/**
 * Starts a password reset.
 *
 * Unauthenticated by necessity, and answers identically in every case: the
 * same body, the same status, whether or not the address exists. A 429 would
 * itself be a signal, so the rate limit is applied quietly and an over-limit
 * request simply does no work.
 */
export const POST = route(async (req: Request) => {
  const { email } = resetRequestSchema.parse(await readJson(req));
  const ok = NextResponse.json({ ok: true });

  const withinLimits =
    (await consumeQuietly(RULES.passwordReset, email)) &&
    (await consumeQuietly(RULES.passwordResetIp, callerKey(req)));
  if (!withinLimits) return ok;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, deletedAt: true },
  });
  if (!user || user.deletedAt) return ok;

  // Deliberately offered to unverified accounts too. Completing a reset proves
  // control of the address just as registration verification does, so this is
  // also the way out for someone who registered and lost their first code.
  await issuePasswordReset(user.id, user.email);
  return ok;
});
