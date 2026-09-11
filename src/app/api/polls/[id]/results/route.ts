import { NextResponse } from "next/server";
import { PollResultsVisibility, type Poll } from "@prisma/client";
import { prisma } from "@/lib/db";
import { forbidden, route } from "@/lib/api/errors";
import { assertInAudience, resourceScope, type ContentScope } from "@/lib/content";

type Ctx = { params: Promise<{ id: string }> };
const load = (id: string) => () => prisma.poll.findUnique({ where: { id } });

/**
 * Decides whether this reader may see totals.
 *
 * Staff always may, whatever the setting says, because they need to act on the
 * outcome. For everyone else the poll's own resultsVisibility decides, which
 * is why this is a per-poll choice rather than one rule for the whole app: a
 * casual "which Saturday suits you" and a parish council vote want opposite
 * behaviour.
 */
function resultsReason(poll: Poll, scope: ContentScope, hasVoted: boolean): string | null {
  if (scope.isStaff) return null;

  switch (poll.resultsVisibility) {
    case PollResultsVisibility.ALWAYS:
      return null;
    case PollResultsVisibility.AFTER_VOTE:
      return hasVoted ? null : "Results become visible once you have voted.";
    case PollResultsVisibility.AFTER_CLOSE:
      return poll.closesAt && poll.closesAt <= new Date()
        ? null
        : "Results become visible once this poll closes.";
  }
}

export const GET = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  const scope = await resourceScope(req, load(id));
  const poll = scope.resource;

  await assertInAudience(
    scope,
    (where) => prisma.poll.findFirst({ where, select: { id: true } }),
    id,
    poll.parishId,
    "poll",
  );

  const hasVoted =
    (await prisma.pollVote.count({ where: { pollId: id, userId: scope.user.id } })) > 0;

  const withheld = resultsReason(poll, scope, hasVoted);
  if (withheld) throw forbidden(withheld);

  const options = await prisma.pollOption.findMany({
    where: { pollId: id },
    orderBy: { sortOrder: "asc" },
    select: { id: true, label: true, sortOrder: true, _count: { select: { votes: true } } },
  });

  // Distinct voters, not total votes: a multiple-choice poll would otherwise
  // report a turnout larger than the parish.
  const voters = await prisma.pollVote.findMany({
    where: { pollId: id },
    distinct: ["userId"],
    select: { userId: true },
  });

  const totalVotes = options.reduce((sum, o) => sum + o._count.votes, 0);

  return NextResponse.json({
    poll: {
      id: poll.id,
      question: poll.question,
      allowMultiple: poll.allowMultiple,
      resultsVisibility: poll.resultsVisibility,
      closesAt: poll.closesAt,
      closed: Boolean(poll.closesAt && poll.closesAt <= new Date()),
    },
    results: options.map((o) => ({
      id: o.id,
      label: o.label,
      sortOrder: o.sortOrder,
      votes: o._count.votes,
      // Share of votes cast, not of voters, so multi-choice shares still sum
      // to 100 across the options.
      share: totalVotes === 0 ? 0 : Math.round((o._count.votes / totalVotes) * 1000) / 10,
    })),
    totalVotes,
    voterCount: voters.length,
    hasVoted,
  });
});
