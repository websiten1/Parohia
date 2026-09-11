import { createHash, randomBytes, randomInt, timingSafeEqual } from "node:crypto";

/**
 * Session tokens are 32 random bytes, which is far beyond what a password
 * needs, so they are stored as a plain SHA-256 digest rather than run through
 * a slow KDF. There is nothing to brute force.
 */
export function generateSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Six digits, uniformly distributed. randomInt avoids the modulo bias of %. */
export function generateVerificationCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

/** Compares two hex digests without leaking their difference through timing. */
export function safeEqualHex(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "hex");
  const bufB = Buffer.from(b, "hex");
  if (bufA.length !== bufB.length || bufA.length === 0) return false;
  return timingSafeEqual(bufA, bufB);
}

export const SESSION_TTL_DAYS = 30;
export const VERIFICATION_TTL_MINUTES = 15;
/** Codes are short, so the number of guesses has to be short too. */
export const VERIFICATION_MAX_ATTEMPTS = 5;
