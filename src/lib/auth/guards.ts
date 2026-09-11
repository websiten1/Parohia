import { MembershipRole, MembershipStatus, type Membership } from "@prisma/client";
import { prisma } from "@/lib/db";
import { forbidden, notFound } from "@/lib/api/errors";

export const STAFF: MembershipRole[] = [MembershipRole.PRIEST, MembershipRole.ADMIN];
export const PRIEST_ONLY: MembershipRole[] = [MembershipRole.PRIEST];
export const ANY_MEMBER: MembershipRole[] = [
  MembershipRole.PRIEST,
  MembershipRole.ADMIN,
  MembershipRole.MEMBER,
];

/**
 * The single choke point for tenant isolation.
 *
 * Authority is never inferred from the caller's other memberships: this asks
 * only whether *this* user has a VERIFIED membership at *this* parish with an
 * allowed role. A priest of parish A therefore fails here for parish B exactly
 * as an outsider would.
 *
 * It deliberately throws 403 rather than 404 for a parish that exists but is
 * not the caller's, because the request reached a real resource and pretending
 * otherwise would complicate every caller for no security gain: parish ids are
 * not secrets, membership is what matters.
 */
export async function requireParishRole(
  userId: string,
  parishId: string,
  allowed: MembershipRole[] = ANY_MEMBER,
): Promise<Membership> {
  const membership = await prisma.membership.findUnique({
    where: { userId_parishId: { userId, parishId } },
  });

  if (!membership || membership.status !== MembershipStatus.VERIFIED) {
    throw forbidden("You are not a verified member of this parish.");
  }
  if (!allowed.includes(membership.role)) {
    throw forbidden("Your role at this parish does not allow that.");
  }
  return membership;
}

/**
 * Loads a parish-owned record and authorises against the parish that record
 * actually belongs to, rather than a parish id supplied by the caller. Passing
 * someone else's resource id lands on their parish, fails the membership check
 * and returns 403 without revealing the contents.
 */
export async function requireOwnedResource<T extends { parishId: string }>(
  userId: string,
  load: () => Promise<T | null>,
  allowed: MembershipRole[] = ANY_MEMBER,
): Promise<{ resource: T; membership: Membership }> {
  const resource = await load();
  if (!resource) throw notFound();
  const membership = await requireParishRole(userId, resource.parishId, allowed);
  return { resource, membership };
}
