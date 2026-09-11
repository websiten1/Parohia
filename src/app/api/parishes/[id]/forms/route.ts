import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { readJson, route } from "@/lib/api/errors";
import { requireAuth } from "@/lib/auth/session";
import { requireParishRole, STAFF } from "@/lib/auth/guards";
import { audienceFilter } from "@/lib/visibility";
import { createFormSchema } from "@/lib/validation/schemas";

type Ctx = { params: Promise<{ id: string }> };

export const GET = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  const { user } = await requireAuth(req);
  const membership = await requireParishRole(user.id, id);

  const forms = await prisma.form.findMany({
    where: { parishId: id, ...audienceFilter(membership.role, user.dateOfBirth) },
    orderBy: { createdAt: "desc" },
    select: {
      id: true, title: true, description: true, visibility: true,
      publishedAt: true, opensAt: true, closesAt: true,
      fields: { orderBy: { sortOrder: "asc" } },
      _count: { select: { submissions: true } },
    },
  });

  return NextResponse.json({ forms });
});

/** Baptism registrations, parish trips, and anything else the priest needs. */
export const POST = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  const { user } = await requireAuth(req);
  await requireParishRole(user.id, id, STAFF);

  const { publish, fields, ...input } = createFormSchema.parse(await readJson(req));

  const form = await prisma.form.create({
    data: {
      ...input,
      parishId: id,
      authorId: user.id,
      publishedAt: publish ? new Date() : null,
      fields: {
        create: fields.map((f, index) => ({
          label: f.label,
          type: f.type,
          required: f.required,
          options: f.options,
          sortOrder: index,
        })),
      },
    },
    include: { fields: { orderBy: { sortOrder: "asc" } } },
  });

  return NextResponse.json({ form }, { status: 201 });
});
