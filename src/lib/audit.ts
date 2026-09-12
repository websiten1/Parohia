import type { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/db";

/**
 * Every action worth being able to answer "who did that, and when" about.
 *
 * A union rather than a database enum: adding an action needs no migration,
 * and a typo still fails to compile, which is the property that actually
 * matters. Names are `subject.verb` in the past tense, so the log reads as a
 * history rather than a list of intentions.
 */
export type AuditAction =
  | "membership.requested"
  | "membership.approved"
  | "membership.rejected"
  | "membership.role_changed"
  | "parish.created"
  | "parish.updated"
  | "parish.join_code_rotated"
  // Reserved for M3. Listed here so the claim work cannot invent a name that
  // silently differs from the one the reader of this file expects.
  | "parish.imported"
  | "parish.claimed"
  | "parish.claim_code_rotated"
  | "parish.claim_email_changed"
  | "parish.transferred";

export interface AuditInput {
  action: AuditAction;
  /** Null for platform-level actions belonging to no single parish. */
  parishId?: string | null;
  /** Null for system actions with no human behind them. */
  actorId?: string | null;
  targetType: string;
  targetId?: string | null;
  metadata?: Prisma.InputJsonValue;
  req?: Request;
}

/** Best-effort client address, for a record of where an action came from. */
function callerIp(req?: Request): string | null {
  if (!req) return null;
  const forwarded = req.headers.get("x-forwarded-for");
  // The left-most entry is the original client; the rest are proxies.
  return forwarded?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || null;
}

/**
 * Writes one audit record.
 *
 * Accepts a transaction client so an action and its record commit together:
 * an approval that succeeded but went unrecorded is exactly the gap the log
 * exists to close.
 */
export async function recordAudit(
  input: AuditInput,
  tx: Prisma.TransactionClient | PrismaClient = prisma,
): Promise<void> {
  await tx.auditEvent.create({
    data: {
      action: input.action,
      parishId: input.parishId ?? null,
      actorId: input.actorId ?? null,
      targetType: input.targetType,
      targetId: input.targetId ?? null,
      metadata: input.metadata,
      ip: callerIp(input.req),
    },
  });
}
