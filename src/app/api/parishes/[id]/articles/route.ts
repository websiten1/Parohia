import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { readJson, route } from "@/lib/api/errors";
import { STAFF } from "@/lib/auth/guards";
import { audienceFields, audienceWhere, parishScope, publishFields } from "@/lib/content";
import { generateArticleSlug } from "@/lib/parish";
import { createArticleSchema } from "@/lib/validation/schemas";

type Ctx = { params: Promise<{ id: string }> };

export const GET = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  const scope = await parishScope(req, id);

  const articles = await prisma.article.findMany({
    where: { parishId: id, ...audienceWhere(scope) },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    // The body is deliberately omitted from the list: articles run long, and a
    // parish feed should not ship every word of every one of them.
    select: {
      id: true, title: true, slug: true, excerpt: true, coverImageUrl: true,
      visibility: true, minAge: true, maxAge: true, publishedAt: true, createdAt: true,
      author: { select: { id: true, firstName: true, lastName: true } },
    },
  });

  return NextResponse.json({ articles });
});

export const POST = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  const scope = await parishScope(req, id, STAFF);
  const { publish, slug, title, ...rest } = createArticleSchema.parse(await readJson(req));
  const { excerpt, body, coverImageUrl, ...audience } = rest;

  const article = await prisma.article.create({
    data: {
      title,
      slug: await generateArticleSlug(id, slug ?? title),
      excerpt: excerpt ?? null,
      body,
      coverImageUrl: coverImageUrl ?? null,
      ...audienceFields(audience),
      ...publishFields(publish),
      parishId: id,
      authorId: scope.user.id,
    },
  });

  return NextResponse.json({ article }, { status: 201 });
});
