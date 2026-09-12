import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ApiError, readJson, route, unauthorized } from "@/lib/api/errors";
import { verifyPassword, hashPassword } from "@/lib/auth/password";
import { createSession, setSessionCookie } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validation/schemas";
import { callerKey, consume, RULES } from "@/lib/rate-limit";

/**
 * A hash of a throwaway value, computed once, so that a login for an unknown
 * address still spends the same argon2 work as a real one. Without it, response
 * timing would reveal which addresses have accounts.
 */
const decoyHash = hashPassword("no-such-account-timing-decoy");

export const POST = route(async (req: Request) => {
  const { email, password } = loginSchema.parse(await readJson(req));

  // Both axes, because either alone is evadable: one address from many
  // addresses, or many addresses from one host.
  await consume(RULES.login, email);
  await consume(RULES.loginIp, callerKey(req));

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.deletedAt) {
    await verifyPassword(await decoyHash, password);
    throw unauthorized("That email or password is not right.");
  }

  if (!(await verifyPassword(user.passwordHash, password))) {
    throw unauthorized("That email or password is not right.");
  }

  // The hard gate. Checked only after the password is confirmed, so this never
  // tells an attacker which addresses are registered but unverified.
  if (!user.emailVerifiedAt) {
    throw new ApiError(
      403,
      "email_not_verified",
      "Confirm your email address to finish signing in.",
    );
  }

  const token = await createSession(user.id, {
    userAgent: req.headers.get("user-agent"),
    ip: req.headers.get("x-forwarded-for"),
  });
  await setSessionCookie(token);

  return NextResponse.json({
    ok: true,
    token,
    user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName },
  });
});
