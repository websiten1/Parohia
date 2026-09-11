import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { readJson, route } from "@/lib/api/errors";
import { STAFF } from "@/lib/auth/guards";
import { assertInAudience, audienceFields, publishFields, resourceScope } from "@/lib/content";
import { updateFormSchema } from "@/lib/validation/schemas";

type Ctx = { params: Promise<{ id: string }> };
const load = (id: string) => () => prisma.form.findUnique({ where: { id } });

export const GET = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  const scope = await resourceScope(req, load(id));

  await assertInAudience(
    scope,
    (where) => prisma.form.findFirst({ where, select: { id: true } }),
    id,
    scope.resource.parishId,
    "form",
  );

  const form = await prisma.form.findUnique({
    where: { id },
    include: {
      fields: { orderBy: { sortOrder: "asc" } },
      ...(scope.isStaff && { _count: { select: { submissions: true } } }),
    },
  });

  // Members see their own answers alongside the form, so a client can render
  // an edit rather than a blank form for someone who already replied.
  const mine = scope.isStaff
    ? null
    : await prisma.formSubmission.findUnique({
        where: { formId_userId: { formId: id, userId: scope.user.id } },
        select: { id: true, answers: true, submittedAt: true, updatedAt: true },
      });

  return NextResponse.json({ form, mySubmission: mine });
});

/**
 * Fields are deliberately not editable here. Renaming or removing a question
 * after people have answered would orphan or silently redefine their stored
 * answers, which are keyed by field id.
 */
export const PATCH = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  await resourceScope(req, load(id), STAFF);
  const parsed = updateFormSchema.parse(await readJson(req));
  const { publish, title, description, opensAt, closesAt, ...audience } = parsed as {
    publish?: boolean; title?: string; description?: string;
    opensAt?: Date | null; closesAt?: Date | null;
  } & Parameters<typeof audienceFields>[0];

  const form = await prisma.form.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(opensAt !== undefined && { opensAt }),
      ...(closesAt !== undefined && { closesAt }),
      ...audienceFields(audience),
      ...publishFields(publish),
    },
  });

  return NextResponse.json({ form });
});

export const DELETE = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  await resourceScope(req, load(id), STAFF);
  await prisma.form.delete({ where: { id } });
  return NextResponse.json({ ok: true });
});
