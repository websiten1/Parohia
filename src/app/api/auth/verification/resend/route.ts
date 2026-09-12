import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { readJson, route } from "@/lib/api/errors";
import { issueEmailVerification } from "@/lib/auth/verification";
import { resendSchema } from "@/lib/validation/schemas";
import { callerKey, consumeQuietly, RULES } from "@/lib/rate-limit";

/**
 * Unauthenticated by necessity: the hard gate means someone who loses their
 * code has no session to authenticate with. The response is always 200 with an
 * identical body, so this cannot be used to discover which addresses exist.
 *
 * Rate limited on both the address and the caller, and quietly: a 429 here
 * would itself reveal that an address exists, so an over-limit request is
 * answered exactly like every other one and simply does no work.
 */
export const POST = route(async (req: Request) => {
  const { email } = resendSchema.parse(await readJson(req));
  const ok = NextResponse.json({ ok: true });

  const withinLimits =
    (await consumeQuietly(RULES.resend, email)) &&
    (await consumeQuietly(RULES.resendIp, callerKey(req)));
  if (!withinLimits) return ok;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, emailVerifiedAt: true, deletedAt: true },
  });

  if (!user || user.deletedAt || user.emailVerifiedAt) return ok;

  // One code per minute per account, so this endpoint cannot be turned into a
  // free mail cannon aimed at somebody else's inbox.
  const recent = await prisma.verificationToken.findFirst({
    where: { userId: user.id, createdAt: { gt: new Date(Date.now() - 60_000) } },
    select: { id: true },
  });
  if (recent) return ok;

  await issueEmailVerification(user.id, user.email);
  return ok;
});
