import { NextResponse } from "next/server";
import { PollResultsVisibility } from "@prisma/client";
import { prisma } from "@/lib/db";
import { badRequest, readJson, route } from "@/lib/api/errors";
import { STAFF } from "@/lib/auth/guards";
import { assertInAudience, audienceFields, publishFields, resourceScope } from "@/lib/content";
import { updatePollSchema } from "@/lib/validation/schemas";

type Ctx = { params: Promise<{ id: string }> };
const load = (id: string) => () => prisma.poll.findUnique({ where: { id } });

export const GET = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  const scope = await resourceScope(req, load(id));

  await assertInAudience(
    scope,
    (where) => prisma.poll.findFirst({ where, select: { id: true } }),
    id,
    scope.resource.parishId,
    "poll",
  );

  const poll = await prisma.poll.findUnique({
    where: { id },
    include: {
      options: {
        orderBy: { sortOrder: "asc" },
        select: {
          id: true, label: true, sortOrder: true,
          votes: { where: { userId: scope.user.id }, select: { id: true } },
        },
      },
    },
  });
  if (!poll) return NextResponse.json({ poll: null }, { status: 404 });

  const myVotes = poll.options.filter((o) => o.votes.length > 0).map((o) => o.id);
  return NextResponse.json({
    poll: {
      ...poll,
      options: poll.options.map((o) => ({ id: o.id, label: o.label, sortOrder: o.sortOrder })),
      myVotes,
      hasVoted: myVotes.length > 0,
    },
  });
});

/**
 * Options are deliberately not editable. Changing the wording of an option
 * after people have voted would silently rewrite what they agreed to, and
 * deleting one would discard their votes. A poll that is wrong gets replaced.
 */
export const PATCH = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  const scope = await resourceScope(req, load(id), STAFF);
  const parsed = updatePollSchema.parse(await readJson(req));
  const { publish, question, resultsVisibility, closesAt, ...audience } = parsed as {
    publish?: boolean; question?: string;
    resultsVisibility?: PollResultsVisibility; closesAt?: Date | null;
  } & Parameters<typeof audienceFields>[0];

  const nextVisibility = resultsVisibility ?? scope.resource.resultsVisibility;
  const nextClosesAt = closesAt === undefined ? scope.resource.closesAt : closesAt;
  if (nextVisibility === PollResultsVisibility.AFTER_CLOSE && !nextClosesAt) {
    throw badRequest("results_never_visible", "Set a closing time, or results would never become visible.", {
      closesAt: ["Set a closing time, or results would never become visible."],
    });
  }

  const poll = await prisma.poll.update({
    where: { id },
    data: {
      ...(question !== undefined && { question }),
      ...(resultsVisibility !== undefined && { resultsVisibility }),
      ...(closesAt !== undefined && { closesAt }),
      ...audienceFields(audience),
      ...publishFields(publish),
    },
  });

  return NextResponse.json({ poll });
});

export const DELETE = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  await resourceScope(req, load(id), STAFF);
  await prisma.poll.delete({ where: { id } });
  return NextResponse.json({ ok: true });
});
