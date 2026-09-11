import { cookies } from "next/headers";
import type { User } from "@prisma/client";
import { prisma } from "@/lib/db";
import { generateSessionToken, hashToken, SESSION_TTL_DAYS } from "./tokens";
import { unauthorized } from "@/lib/api/errors";

export const SESSION_COOKIE = "parohia_session";

const ttl = () => new Date(Date.now() + SESSION_TTL_DAYS * 86_400_000);

export async function createSession(
  userId: string,
  meta: { userAgent?: string | null; ip?: string | null } = {},
): Promise<string> {
  const token = generateSessionToken();
  await prisma.session.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      expiresAt: ttl(),
      userAgent: meta.userAgent?.slice(0, 500) ?? null,
      ip: meta.ip ?? null,
    },
  });
  return token;
}

/**
 * Web clients send the token as an httpOnly cookie; native clients send the
 * same token as a bearer header. Both land here, so there is exactly one place
 * where a session is turned into a user.
 */
async function readToken(req: Request): Promise<string | null> {
  const header = req.headers.get("authorization");
  if (header?.startsWith("Bearer ")) return header.slice(7).trim() || null;
  const jar = await cookies();
  return jar.get(SESSION_COOKIE)?.value ?? null;
}

export interface AuthContext {
  user: User;
  sessionId: string;
}

/** Resolves the caller, or null when there is no valid session. */
export async function getAuth(req: Request): Promise<AuthContext | null> {
  const token = await readToken(req);
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });

  if (!session || session.revokedAt || session.expiresAt <= new Date()) return null;
  if (session.user.deletedAt) return null;

  // Rolling expiry. Only written when it has meaningfully moved, so a burst of
  // requests does not turn into a write per request.
  const sinceTouch = Date.now() - session.lastUsedAt.getTime();
  if (sinceTouch > 60 * 60 * 1000) {
    await prisma.session.update({
      where: { id: session.id },
      data: { lastUsedAt: new Date(), expiresAt: ttl() },
    });
  }

  return { user: session.user, sessionId: session.id };
}

/**
 * The gate every authenticated route goes through. Unverified accounts never
 * receive a session in the first place, but this re-checks rather than trusting
 * that, so a session minted before the rule existed cannot slip past.
 */
export async function requireAuth(req: Request): Promise<AuthContext> {
  const auth = await getAuth(req);
  if (!auth) throw unauthorized();
  if (!auth.user.emailVerifiedAt) {
    throw unauthorized("Confirm your email address before continuing.");
  }
  return auth;
}

export async function revokeSession(sessionId: string): Promise<void> {
  await prisma.session.update({ where: { id: sessionId }, data: { revokedAt: new Date() } });
}

export async function revokeAllSessions(userId: string): Promise<void> {
  await prisma.session.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export async function setSessionCookie(token: string): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_DAYS * 86_400,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}
