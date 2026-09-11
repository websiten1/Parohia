import { MembershipRole, Prisma, Visibility } from "@prisma/client";
import { ageOn } from "@/lib/validation/schemas";
import { STAFF } from "@/lib/auth/guards";

/**
 * Announcement, Article, Event, Poll and Form all carry the same audience
 * columns, so the filter is described structurally rather than being tied to
 * one model's generated WhereInput. The assertions below are what keep that
 * honest: adding a model to this list fails the build if its shape drifts.
 */
export type AudienceClause = {
  publishedAt?: { not: null; lte: Date };
  OR?: Array<{
    visibility: Visibility;
    AND?: Array<{ OR: Array<{ minAge?: number | { lte: number } | null; maxAge?: number | { gte: number } | null }> }>;
  }>;
};

/* eslint-disable @typescript-eslint/no-unused-vars */
const _fitsAnnouncement: Prisma.AnnouncementWhereInput = {} as AudienceClause;
const _fitsForm: Prisma.FormWhereInput = {} as AudienceClause;
const _fitsArticle: Prisma.ArticleWhereInput = {} as AudienceClause;
const _fitsEvent: Prisma.EventWhereInput = {} as AudienceClause;
const _fitsPoll: Prisma.PollWhereInput = {} as AudienceClause;
/* eslint-enable @typescript-eslint/no-unused-vars */

/**
 * Turns a reader into the set of audience conditions they satisfy.
 *
 * Staff see everything in their parish, including drafts. Everyone else sees
 * published items that are either for ALL, or BY_AGE with their age inside the
 * range. Because dateOfBirth is required, the age branch resolves for every
 * member rather than silently hiding posts from people who skipped the field.
 *
 * PRIVATE is absent from the OR by design: it is the staff-only case, and the
 * only way to match it is to have returned early above.
 */
export function audienceFilter(role: MembershipRole, dateOfBirth: Date): AudienceClause {
  if (STAFF.includes(role)) return {};

  const age = ageOn(dateOfBirth);
  return {
    publishedAt: { not: null, lte: new Date() },
    OR: [
      { visibility: Visibility.ALL },
      {
        visibility: Visibility.BY_AGE,
        AND: [
          { OR: [{ minAge: null }, { minAge: { lte: age } }] },
          { OR: [{ maxAge: null }, { maxAge: { gte: age } }] },
        ],
      },
    ],
  };
}
