import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { badRequest, conflict, readJson, route } from "@/lib/api/errors";
import { STAFF } from "@/lib/auth/guards";
import { assertInAudience, resourceScope } from "@/lib/content";
import { validateAnswers } from "@/lib/forms";
import { submitFormSchema } from "@/lib/validation/schemas";

type Ctx = { params: Promise<{ id: string }> };
const load = (id: string) => () => prisma.form.findUnique({ where: { id } });

/** The responses. Staff only: these carry members' personal details. */
export const GET = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  await resourceScope(req, load(id), STAFF);

  const submissions = await prisma.formSubmission.findMany({
    where: { formId: id },
    orderBy: { submittedAt: "asc" },
    select: {
      id: true, answers: true, submittedAt: true, updatedAt: true,
      user: { select: { id: true, firstName: true, lastName: true, email: true } },
    },
  });

  return NextResponse.json({ submissions, count: submissions.length });
});

/**
 * Submit, or correct an earlier answer. One submission per member per form, as
 * agreed: an upsert rather than a create, so a double-tapped button updates
 * rather than failing, and the unique constraint backs it at the database.
 */
export const POST = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  const scope = await resourceScope(req, load(id));
  const form = scope.resource;
  const { answers } = submitFormSchema.parse(await readJson(req));

  await assertInAudience(
    scope,
    (where) => prisma.form.findFirst({ where, select: { id: true } }),
    id,
    form.parishId,
    "form",
  );

  if (!form.publishedAt) throw badRequest("form_draft", "That form is not open yet.");
  const now = new Date();
  if (form.opensAt && form.opensAt > now) {
    throw conflict("form_not_open", "That form is not open yet.");
  }
  if (form.closesAt && form.closesAt <= now) {
    throw conflict("form_closed", "That form has closed.");
  }

  const fields = await prisma.formField.findMany({
    where: { formId: id },
    orderBy: { sortOrder: "asc" },
  });
  const clean = validateAnswers(fields, answers);

  const submission = await prisma.formSubmission.upsert({
    where: { formId_userId: { formId: id, userId: scope.user.id } },
    create: { formId: id, userId: scope.user.id, answers: clean as Prisma.InputJsonValue },
    update: { answers: clean as Prisma.InputJsonValue },
    select: { id: true, answers: true, submittedAt: true, updatedAt: true },
  });

  return NextResponse.json({ submission }, { status: 201 });
});
