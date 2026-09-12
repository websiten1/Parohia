import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { route } from "@/lib/api/errors";
import { audienceWhere, parishScope } from "@/lib/content";

type Ctx = { params: Promise<{ id: string }> };

type FeedKind = "announcement" | "article" | "event" | "poll";

interface FeedItem {
  kind: FeedKind;
  id: string;
  title: string;
  summary: string | null;
  at: Date;
  /** Only events carry a future date distinct from their publication. */
  startsAt?: Date | null;
  coverImageUrl?: string | null;
}

/**
 * Everything a parishioner should see from their parish, interleaved by date.
 *
 * One endpoint rather than four, because the home screen wants them mixed and
 * doing that client-side means three extra round trips and four separate
 * chances to apply the audience filter inconsistently. The filter is built
 * once here and ANDed into every query, so no item can reach a reader who
 * would not have seen it in its own list.
 */
export const GET = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  const scope = await parishScope(req, id);
  const audience = audienceWhere(scope);

  const url = new URL(req.url);
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 30) || 30, 100);

  // Each query is capped at `limit` on its own, so the merge below always has
  // enough to fill a page without loading a parish's whole history.
  const [announcements, articles, events, polls] = await Promise.all([
    prisma.announcement.findMany({
      where: { parishId: id, ...audience },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: limit,
      select: { id: true, title: true, body: true, publishedAt: true, createdAt: true },
    }),
    prisma.article.findMany({
      where: { parishId: id, ...audience },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: limit,
      select: { id: true, title: true, excerpt: true, coverImageUrl: true, publishedAt: true, createdAt: true },
    }),
    prisma.event.findMany({
      where: { parishId: id, ...audience },
      orderBy: [{ startsAt: "asc" }],
      take: limit,
      select: { id: true, title: true, description: true, startsAt: true, endsAt: true, coverImageUrl: true, publishedAt: true, createdAt: true },
    }),
    prisma.poll.findMany({
      where: { parishId: id, ...audience },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: limit,
      select: { id: true, question: true, closesAt: true, publishedAt: true, createdAt: true },
    }),
  ]);

  const truncate = (text: string, max = 280) =>
    text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;

  const items: FeedItem[] = [
    ...announcements.map((a) => ({
      kind: "announcement" as const,
      id: a.id,
      title: a.title,
      summary: truncate(a.body),
      at: a.publishedAt ?? a.createdAt,
    })),
    ...articles.map((a) => ({
      kind: "article" as const,
      id: a.id,
      title: a.title,
      summary: a.excerpt,
      at: a.publishedAt ?? a.createdAt,
      coverImageUrl: a.coverImageUrl,
    })),
    ...events.map((e) => ({
      kind: "event" as const,
      id: e.id,
      title: e.title,
      summary: truncate(e.description),
      // Events sort by when they happen, not when they were posted: an event
      // announced weeks ago but happening tomorrow belongs at the top.
      at: e.startsAt,
      startsAt: e.startsAt,
      coverImageUrl: e.coverImageUrl,
    })),
    ...polls.map((p) => ({
      kind: "poll" as const,
      id: p.id,
      title: p.question,
      summary: null,
      at: p.publishedAt ?? p.createdAt,
    })),
  ];

  items.sort((a, b) => b.at.getTime() - a.at.getTime());

  return NextResponse.json({ items: items.slice(0, limit), count: items.length });
});
