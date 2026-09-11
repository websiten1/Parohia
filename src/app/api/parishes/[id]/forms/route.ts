import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { readJson, route } from "@/lib/api/errors";
import { STAFF } from "@/lib/auth/guards";
import { audienceFields, audienceWhere, parishScope, publishFields } from "@/lib/content";
import { createFormSchema } from "@/lib/validation/schemas";

type Ctx = { params: Promise<{ id: string }> };

export const GET = route(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  const scope = await parishScope(req, id);

  const forms = await prisma.form.findMany({
    where: { parishId: id, ...audienceWhere(scope) },
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
  const scope = await parishScope(req, id, STAFF);

  const parsed = createFormSchema.parse(await readJson(req));
  const { publish, fields, title, description, opensAt, closesAt, ...audience } = parsed;

  const form = await prisma.form.create({
    data: {
      title,
      description: description ?? null,
      opensAt: opensAt ?? null,
      closesAt: closesAt ?? null,
      ...audienceFields(audience),
      ...publishFields(publish),
      parishId: id,
      authorId: scope.user.id,
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
