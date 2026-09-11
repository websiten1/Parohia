import type { Membership, User } from "@prisma/client";
import { MembershipRole, Visibility } from "@prisma/client";
import { requireAuth } from "@/lib/auth/session";
import { requireParishRole, requireOwnedResource, ANY_MEMBER, STAFF } from "@/lib/auth/guards";
import { audienceFilter, type AudienceClause } from "@/lib/visibility";
import { forbidden } from "@/lib/api/errors";

/**
 * Shared plumbing for the parish-owned content types: Announcement, Article,
 * Event, Poll and Form. They differ in their fields and almost nothing else,
 * so the repeated part is the authorisation and audience logic.
 *
 * Deliberately NOT a generic repository over Prisma delegates. Wrapping
 * findMany/create would force `any` through every call and throw away the
 * per-model select shapes and payload types that make the route handlers
 * safe. Each route keeps its own fully typed Prisma call; only the parts that
 * are genuinely identical live here.
 */

export interface ContentScope {
  user: User;
  membership: Membership;
  /** True for PRIEST and ADMIN, who see drafts and every audience. */
  isStaff: boolean;
}

/** Resolves the caller and their standing at this parish in one step. */
export async function parishScope(
  req: Request,
  parishId: string,
  allowed: MembershipRole[] = ANY_MEMBER,
): Promise<ContentScope> {
  const { user } = await requireAuth(req);
  const membership = await requireParishRole(user.id, parishId, allowed);
  return { user, membership, isStaff: STAFF.includes(membership.role) };
}

/** The same, for a record addressed by its own id rather than a parish id. */
export async function resourceScope<T extends { parishId: string }>(
  req: Request,
  load: () => Promise<T | null>,
  allowed: MembershipRole[] = ANY_MEMBER,
): Promise<ContentScope & { resource: T }> {
  const { user } = await requireAuth(req);
  const { resource, membership } = await requireOwnedResource(user.id, load, allowed);
  return { user, membership, isStaff: STAFF.includes(membership.role), resource };
}

/**
 * The audience conditions to AND into a list query. Empty for staff, who see
 * drafts and every audience.
 */
export function audienceWhere(scope: ContentScope): AudienceClause {
  return audienceFilter(scope.membership.role, scope.user.dateOfBirth);
}

/**
 * Membership alone is not enough to read one item by id: a member must also
 * fall inside that item's audience, or a direct fetch would bypass the filter
 * applied to the list. Staff skip the check.
 *
 * The caller supplies the lookup so the query stays typed against its own
 * model. It must apply every clause it is given, unchanged.
 */
export async function assertInAudience(
  scope: ContentScope,
  findFirst: (where: AudienceClause & { id: string; parishId: string }) => Promise<unknown | null>,
  id: string,
  parishId: string,
  label: string,
): Promise<void> {
  if (scope.isStaff) return;
  const visible = await findFirst({ id, parishId, ...audienceWhere(scope) });
  if (!visible) throw forbidden(`That ${label} is not available to you.`);
}

export interface AudienceInput {
  visibility?: Visibility;
  minAge?: number;
  maxAge?: number;
}

/**
 * Normalises the audience fields for a write.
 *
 * An age range only means anything under BY_AGE, so switching away from it
 * clears the bounds rather than leaving them to be silently reapplied if
 * someone switches back later. Zod already rejects a range sent alongside the
 * wrong visibility; this handles the switch itself.
 */
export function audienceFields(input: AudienceInput): {
  visibility?: Visibility;
  minAge?: number | null;
  maxAge?: number | null;
} {
  if (input.visibility === undefined) return {};
  if (input.visibility !== Visibility.BY_AGE) {
    return { visibility: input.visibility, minAge: null, maxAge: null };
  }
  return {
    visibility: Visibility.BY_AGE,
    minAge: input.minAge ?? null,
    maxAge: input.maxAge ?? null,
  };
}

/**
 * Maps the API's `publish` boolean onto `publishedAt`. Absent means "leave as
 * it is", which is what lets a PATCH edit a draft without publishing it.
 */
export function publishFields(publish: boolean | undefined): { publishedAt?: Date | null } {
  if (publish === undefined) return {};
  return { publishedAt: publish ? new Date() : null };
}
