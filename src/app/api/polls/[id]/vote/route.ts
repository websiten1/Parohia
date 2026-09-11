import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { badRequest, conflict, readJson, route } from "@/lib/api/errors";
import { assertInAudience, resourceScope } from "@/lib/content";
import { voteSchema } from "@/lib/validation/schemas";

type Ctx = { params: Promise<{ id: string }> };
const load = (id: string) => () => prisma.poll.findUnique({ where: { id } });

export const POST = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  const scope = await resourceScope(req, load(id));
  const { optionIds } = voteSchema.parse(await readJson(req));
  const poll = scope.resource;

  // Voting is a read of the poll plus a write, so it needs the same audience
  // check as reading: a member outside the audience must not be able to vote
  // in a poll they are not entitled to see.
  await assertInAudience(
    scope,
    (where) => prisma.poll.findFirst({ where, select: { id: true } }),
    id,
    poll.parishId,
    "poll",
  );

  if (!poll.publishedAt) throw badRequest("poll_draft", "That poll is not open yet.");
  if (poll.closesAt && poll.closesAt <= new Date()) {
    throw conflict("poll_closed", "That poll has closed.");
  }
  if (!poll.allowMultiple && optionIds.length > 1) {
    throw badRequest("single_choice", "This poll allows only one choice.");
  }

  // Every option must belong to THIS poll. Without this an id from another
  // parish's poll would be accepted, and the vote would land in their tally.
  const options = await prisma.pollOption.findMany({
    where: { id: { in: optionIds }, pollId: id },
    select: { id: true },
  });
  if (options.length !== optionIds.length) {
    throw badRequest("unknown_option", "One of those options does not belong to this poll.");
  }

  /**
   * The whole vote is one transaction. Clearing then re-inserting makes the
   * call idempotent, so a retried request replaces a vote rather than being
   * rejected or duplicated, and a single-choice poll cannot end up holding two
   * rows for one person if two requests race.
   */
  await prisma.$transaction(async (tx) => {
    await tx.pollVote.deleteMany({ where: { pollId: id, userId: scope.user.id } });
    await tx.pollVote.createMany({
      data: optionIds.map((pollOptionId) => ({
        pollId: id,
        pollOptionId,
        userId: scope.user.id,
      })),
    });
  });

  return NextResponse.json({ ok: true, myVotes: optionIds });
});

/** Retracts the caller's vote while the poll is still open. */
export const DELETE = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  const scope = await resourceScope(req, load(id));
  const poll = scope.resource;

  if (poll.closesAt && poll.closesAt <= new Date()) {
    throw conflict("poll_closed", "That poll has closed.");
  }

  const { count } = await prisma.pollVote.deleteMany({
    where: { pollId: id, userId: scope.user.id },
  });

  return NextResponse.json({ ok: true, removed: count });
});
