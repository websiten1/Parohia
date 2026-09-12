import { prisma } from "@/lib/db";
import { tooManyRequests } from "@/lib/api/errors";

/**
 * Fixed-window rate limiting, counted in Postgres.
 *
 * A fixed window can admit up to twice the limit across a boundary, which a
 * sliding window would not. That is an acceptable trade here: these limits
 * exist to blunt enumeration and credential stuffing, not to meter a paid API,
 * and the alternative costs another vendor and another failure mode.
 */
export interface RateLimitRule {
  /** What is being limited, e.g. "login". Forms the first half of the key. */
  scope: string;
  /** Attempts permitted per window. */
  limit: number;
  windowMs: number;
}

/**
 * Per-account limits are tight, per-address limits are deliberately loose.
 *
 * An address is a poor identifier for a person. A parish hall behind one
 * router, a mobile carrier's NAT, or a family sharing a connection all look
 * like one address, so tight per-address limits lock out real parishioners
 * while barely inconveniencing an attacker who can rotate hosts. The precise
 * control is the per-account limit; the per-address one is a coarse backstop
 * against a single host hammering many accounts at once.
 */
export const RULES = {
  /** Password guessing against one address. */
  login: { scope: "login", limit: 10, windowMs: 15 * 60_000 },
  loginIp: { scope: "login-ip", limit: 300, windowMs: 15 * 60_000 },

  /** Stops the resend endpoint being used as a mail cannon at one inbox. */
  resend: { scope: "resend", limit: 5, windowMs: 60 * 60_000 },
  resendIp: { scope: "resend-ip", limit: 200, windowMs: 60 * 60_000 },

  passwordReset: { scope: "pwreset", limit: 5, windowMs: 60 * 60_000 },
  passwordResetIp: { scope: "pwreset-ip", limit: 200, windowMs: 60 * 60_000 },

  /** Verification code guessing is also bounded per token by `attempts`. */
  verify: { scope: "verify", limit: 20, windowMs: 60 * 60_000 },
  verifyIp: { scope: "verify-ip", limit: 500, windowMs: 60 * 60_000 },

  /**
   * Reserved for M3. A claim code is 78 bits, so this is not about brute
   * force: it is to stop someone probing which parishes exist by watching how
   * the endpoint behaves.
   */
  claim: { scope: "claim", limit: 10, windowMs: 60 * 60_000 },
  claimIp: { scope: "claim-ip", limit: 50, windowMs: 60 * 60_000 },
} as const satisfies Record<string, RateLimitRule>;

/** Best-effort client address; falls back to a constant so the limit still binds. */
export function callerKey(req: Request, subject?: string | null): string {
  if (subject) return subject.toLowerCase();
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

function windowStart(windowMs: number): Date {
  return new Date(Math.floor(Date.now() / windowMs) * windowMs);
}

/**
 * Counts one attempt and throws once the limit is passed.
 *
 * The upsert is atomic, so concurrent requests cannot both read a stale count
 * and each decide they are under the limit.
 */
export async function consume(rule: RateLimitRule, subject: string): Promise<void> {
  const key = `${rule.scope}:${subject}`;
  const start = windowStart(rule.windowMs);

  const row = await prisma.rateLimit.upsert({
    where: { key_windowStart: { key, windowStart: start } },
    create: { key, windowStart: start, count: 1 },
    update: { count: { increment: 1 } },
    select: { count: true },
  });

  if (row.count > rule.limit) {
    throw tooManyRequests("Too many attempts. Please try again later.");
  }
}

/**
 * Counts an attempt but never throws.
 *
 * For endpoints that must answer identically whatever happens, such as the
 * resend and password-reset requests: a 429 there would reveal that an address
 * exists. The caller checks the returned flag and silently does no work.
 */
export async function consumeQuietly(rule: RateLimitRule, subject: string): Promise<boolean> {
  try {
    await consume(rule, subject);
    return true;
  } catch {
    return false;
  }
}

/** Removes windows that can no longer be current. Called opportunistically. */
export async function pruneRateLimits(olderThanMs = 24 * 60 * 60_000): Promise<number> {
  const { count } = await prisma.rateLimit.deleteMany({
    where: { windowStart: { lt: new Date(Date.now() - olderThanMs) } },
  });
  return count;
}
