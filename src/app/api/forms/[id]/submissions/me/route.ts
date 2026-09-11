import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { conflict, notFound, route } from "@/lib/api/errors";
import { resourceScope } from "@/lib/content";

type Ctx = { params: Promise<{ id: string }> };
const load = (id: string) => () => prisma.form.findUnique({ where: { id } });

/** The caller's own response, so a client can render an edit rather than a blank. */
export const GET = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  const scope = await resourceScope(req, load(id));

  const submission = await prisma.formSubmission.findUnique({
    where: { formId_userId: { formId: id, userId: scope.user.id } },
    select: { id: true, answers: true, submittedAt: true, updatedAt: true },
  });
  if (!submission) throw notFound("You have not answered this form.");

  return NextResponse.json({ submission });
});

/** Withdraws the caller's own response while the form is still open. */
export const DELETE = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  const scope = await resourceScope(req, load(id));

  if (scope.resource.closesAt && scope.resource.closesAt <= new Date()) {
    throw conflict("form_closed", "That form has closed.");
  }

  const { count } = await prisma.formSubmission.deleteMany({
    where: { formId: id, userId: scope.user.id },
  });
  if (count === 0) throw notFound("You have not answered this form.");

  return NextResponse.json({ ok: true });
});
