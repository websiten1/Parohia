import { NextResponse } from "next/server";
import { TokenPurpose } from "@prisma/client";
import { prisma } from "@/lib/db";
import { badRequest, readJson, route, tooManyRequests } from "@/lib/api/errors";
import { hashPassword } from "@/lib/auth/password";
import { createSession, revokeAllSessions, setSessionCookie } from "@/lib/auth/session";
import { hashToken, safeEqualHex, VERIFICATION_MAX_ATTEMPTS } from "@/lib/auth/tokens";
import { callerKey, consume, RULES } from "@/lib/rate-limit";
import { resetConfirmSchema } from "@/lib/validation/schemas";

/**
 * Completes a reset, then signs the person in.
 *
 * Two deliberate consequences, both agreed in the design:
 *
 *  - Every existing session is revoked. If the reset was prompted by a
 *    suspected compromise, the intruder's session has to die with it.
 *  - The address is marked verified. Receiving the code proves control of the
 *    inbox exactly as registration verification does, so a user who never
 *    verified is no longer stranded behind the hard email gate.
 */
export const POST = route(async (req: Request) => {
  const { email, code, newPassword } = resetConfirmSchema.parse(await readJson(req));

  await consume(RULES.passwordReset, `confirm:${email}`);
  await consume(RULES.passwordResetIp, `confirm:${callerKey(req)}`);

  const invalid = badRequest("invalid_code", "That code is not valid or has expired.");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.deletedAt) throw invalid;

  const token = await prisma.verificationToken.findFirst({
    where: { userId: user.id, purpose: TokenPurpose.PASSWORD_RESET, consumedAt: null },
    orderBy: { createdAt: "desc" },
  });
  if (!token || token.expiresAt <= new Date()) throw invalid;
  if (token.attempts >= VERIFICATION_MAX_ATTEMPTS) {
    throw tooManyRequests("Too many incorrect codes. Request a new one.");
  }

  if (!safeEqualHex(token.codeHash, hashToken(code))) {
    await prisma.verificationToken.update({
      where: { id: token.id },
      data: { attempts: { increment: 1 } },
    });
    throw invalid;
  }

  const now = new Date();
  const passwordHash = await hashPassword(newPassword);

  await prisma.$transaction([
    prisma.verificationToken.update({ where: { id: token.id }, data: { consumedAt: now } }),
    prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, emailVerifiedAt: user.emailVerifiedAt ?? now },
    }),
  ]);

  // After the change, so a session created here is not revoked by it.
  await revokeAllSessions(user.id);
  const sessionToken = await createSession(user.id, { userAgent: req.headers.get("user-agent") });
  await setSessionCookie(sessionToken);

  return NextResponse.json({ ok: true, token: sessionToken, revokedOtherSessions: true });
});
