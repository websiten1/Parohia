import { NextResponse } from "next/server";
import { TokenPurpose } from "@prisma/client";
import { prisma } from "@/lib/db";
import { badRequest, readJson, route, tooManyRequests } from "@/lib/api/errors";
import { createSession, setSessionCookie } from "@/lib/auth/session";
import { hashToken, safeEqualHex, VERIFICATION_MAX_ATTEMPTS } from "@/lib/auth/tokens";
import { verifyEmailSchema } from "@/lib/validation/schemas";

/** Confirms the code and signs the person in, so there is no second step. */
export const POST = route(async (req: Request) => {
  const { email, code } = verifyEmailSchema.parse(await readJson(req));
  const invalid = badRequest("invalid_code", "That code is not valid or has expired.");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.deletedAt) throw invalid;

  if (user.emailVerifiedAt) {
    return NextResponse.json({ ok: true, alreadyVerified: true });
  }

  const token = await prisma.verificationToken.findFirst({
    where: { userId: user.id, purpose: TokenPurpose.EMAIL_VERIFICATION, consumedAt: null },
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
  await prisma.$transaction([
    prisma.verificationToken.update({ where: { id: token.id }, data: { consumedAt: now } }),
    prisma.user.update({ where: { id: user.id }, data: { emailVerifiedAt: now } }),
  ]);

  const sessionToken = await createSession(user.id, {
    userAgent: req.headers.get("user-agent"),
    ip: req.headers.get("x-forwarded-for"),
  });
  await setSessionCookie(sessionToken);

  return NextResponse.json({ ok: true, token: sessionToken });
});
