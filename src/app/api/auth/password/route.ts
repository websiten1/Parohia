import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { badRequest, readJson, route } from "@/lib/api/errors";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { requireAuth, revokeAllSessions, createSession, setSessionCookie } from "@/lib/auth/session";
import { changePasswordSchema } from "@/lib/validation/schemas";

/**
 * Changing a password revokes every existing session, which is the point: if
 * the change was prompted by a suspected compromise, the intruder's session has
 * to die. The caller is then issued a fresh one so they are not signed out of
 * the device they just used.
 */
export const POST = route(async (req: Request) => {
  const { user } = await requireAuth(req);
  const { currentPassword, newPassword } = changePasswordSchema.parse(await readJson(req));

  if (!(await verifyPassword(user.passwordHash, currentPassword))) {
    throw badRequest("wrong_password", "Your current password is not right.", {
      currentPassword: ["Your current password is not right."],
    });
  }
  if (await verifyPassword(user.passwordHash, newPassword)) {
    throw badRequest("password_unchanged", "Choose a password you have not used here before.", {
      newPassword: ["Choose a different password."],
    });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(newPassword) },
  });

  await revokeAllSessions(user.id);
  const token = await createSession(user.id, { userAgent: req.headers.get("user-agent") });
  await setSessionCookie(token);

  return NextResponse.json({ ok: true, token, revokedOtherSessions: true });
});
