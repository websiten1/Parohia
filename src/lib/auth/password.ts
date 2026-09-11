import { hash, verify } from "@node-rs/argon2";

/**
 * OWASP's argon2id baseline: 19 MiB of memory, two passes, one lane. Memory
 * cost is what makes GPU cracking expensive, so it matters more than time cost.
 */
const PARAMS = { memoryCost: 19456, timeCost: 2, parallelism: 1 } as const;

export function hashPassword(plain: string): Promise<string> {
  return hash(plain, PARAMS);
}

export async function verifyPassword(digest: string, plain: string): Promise<boolean> {
  try {
    return await verify(digest, plain);
  } catch {
    // A malformed or truncated digest must read as "wrong password", never as
    // a crash that a caller might mistake for success.
    return false;
  }
}
