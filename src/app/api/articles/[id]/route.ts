import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { readJson, route } from "@/lib/api/errors";
import { STAFF } from "@/lib/auth/guards";
import { assertInAudience, audienceFields, publishFields, resourceScope } from "@/lib/content";
import { generateArticleSlug } from "@/lib/parish";
import { updateArticleSchema } from "@/lib/validation/schemas";

type Ctx = { params: Promise<{ id: string }> };
const load = (id: string) => () => prisma.article.findUnique({ where: { id } });

export const GET = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  const scope = await resourceScope(req, load(id));

  await assertInAudience(
    scope,
    (where) => prisma.article.findFirst({ where, select: { id: true } }),
    id,
    scope.resource.parishId,
    "article",
  );

  return NextResponse.json({ article: scope.resource });
});

export const PATCH = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  const scope = await resourceScope(req, load(id), STAFF);
  const parsed = updateArticleSchema.parse(await readJson(req));
  const { publish, slug, title, excerpt, body, coverImageUrl, ...audience } = parsed as {
    publish?: boolean; slug?: string; title?: string; excerpt?: string;
    body?: string; coverImageUrl?: string;
  } & Parameters<typeof audienceFields>[0];

  const article = await prisma.article.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      // Renaming the article does not silently move its URL; the slug only
      // changes when it is sent explicitly.
      ...(slug !== undefined && {
        slug: await generateArticleSlug(scope.resource.parishId, slug, id),
      }),
      ...(excerpt !== undefined && { excerpt }),
      ...(body !== undefined && { body }),
      ...(coverImageUrl !== undefined && { coverImageUrl }),
      ...audienceFields(audience),
      ...publishFields(publish),
    },
  });

  return NextResponse.json({ article });
});

export const DELETE = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  await resourceScope(req, load(id), STAFF);
  await prisma.article.delete({ where: { id } });
  return NextResponse.json({ ok: true });
});
