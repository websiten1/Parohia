import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { readJson, route } from "@/lib/api/errors";
import { STAFF } from "@/lib/auth/guards";
import { audienceFields, audienceWhere, parishScope, publishFields } from "@/lib/content";
import { createPollSchema } from "@/lib/validation/schemas";

type Ctx = { params: Promise<{ id: string }> };

export const GET = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  const scope = await parishScope(req, id);

  const polls = await prisma.poll.findMany({
    where: { parishId: id, ...audienceWhere(scope) },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    select: {
      id: true, question: true, allowMultiple: true, resultsVisibility: true,
      closesAt: true, publishedAt: true, visibility: true, minAge: true, maxAge: true,
      // A vote hangs off the option, not the poll, so the reader's own choices
      // are reached through options. Deliberately no totals here: whether this
      // reader may see them depends on resultsVisibility, which the results
      // endpoint decides.
      options: {
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          label: true,
          sortOrder: true,
          votes: { where: { userId: scope.user.id }, select: { id: true } },
        },
      },
    },
  });

  return NextResponse.json({
    polls: polls.map((poll) => {
      const myVotes = poll.options.filter((o) => o.votes.length > 0).map((o) => o.id);
      return {
        ...poll,
        options: poll.options.map((o) => ({ id: o.id, label: o.label, sortOrder: o.sortOrder })),
        myVotes,
        hasVoted: myVotes.length > 0,
      };
    }),
  });
});

export const POST = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  const scope = await parishScope(req, id, STAFF);
  const parsed = createPollSchema.parse(await readJson(req));
  const { publish, question, options, allowMultiple, resultsVisibility, closesAt, ...audience } = parsed;

  const poll = await prisma.poll.create({
    data: {
      question,
      allowMultiple,
      resultsVisibility,
      closesAt: closesAt ?? null,
      ...audienceFields(audience),
      ...publishFields(publish),
      parishId: id,
      authorId: scope.user.id,
      options: { create: options.map((label, sortOrder) => ({ label, sortOrder })) },
    },
    include: { options: { orderBy: { sortOrder: "asc" } } },
  });

  return NextResponse.json({ poll }, { status: 201 });
});
