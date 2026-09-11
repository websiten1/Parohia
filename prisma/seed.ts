import { JoinMethod, MembershipRole, MembershipStatus, PrismaClient, Visibility } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "@node-rs/argon2";

for (const f of [".env.development.local", ".env.local", ".env"]) {
  try { process.loadEnvFile(f); } catch { /* optional */ }
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }, { schema: "parohia" }),
});

const PASSWORD = "parohia-dev-2026";
const hashPassword = (p: string) => hash(p, { memoryCost: 19456, timeCost: 2, parallelism: 1 });

async function main() {
  const passwordHash = await hashPassword(PASSWORD);
  const verifiedAt = new Date();

  const parish = await prisma.parish.upsert({
    where: { slug: "sfantul-gheorghe-southfield" },
    update: {},
    create: {
      name: "Parohia Sfântul Gheorghe",
      slug: "sfantul-gheorghe-southfield",
      patronSaint: "Sfântul Mare Mucenic Gheorghe",
      jurisdiction: "ROEA",
      city: "Southfield",
      state: "Michigan",
      country: "Statele Unite",
      addressLine1: "18405 W Nine Mile Rd",
      postalCode: "48075",
      contactEmail: "contact@sfantulgheorghe.example",
      phone: "+1 248 555 0142",
      themePrimary: "#AB1F21",
      joinCode: "GHEORGHE",
    },
  });

  // The priest. Founder of the parish, so joinedVia is FOUNDER and there was
  // nobody above him to approve the membership.
  const priest = await prisma.user.upsert({
    where: { email: "parintele@sfantulgheorghe.example" },
    update: {},
    create: {
      email: "parintele@sfantulgheorghe.example",
      passwordHash,
      firstName: "Andrei",
      lastName: "Popescu",
      dateOfBirth: new Date("1979-04-23T00:00:00.000Z"),
      phone: "+1 248 555 0143",
      emailVerifiedAt: verifiedAt,
      memberships: {
        create: {
          parishId: parish.id,
          role: MembershipRole.PRIEST,
          status: MembershipStatus.VERIFIED,
          joinedVia: JoinMethod.FOUNDER,
          approvedAt: verifiedAt,
        },
      },
    },
  });

  // A parishioner the priest has already approved.
  await prisma.user.upsert({
    where: { email: "maria@example.com" },
    update: {},
    create: {
      email: "maria@example.com",
      passwordHash,
      firstName: "Maria",
      lastName: "Ionescu",
      dateOfBirth: new Date("1992-11-08T00:00:00.000Z"),
      emailVerifiedAt: verifiedAt,
      memberships: {
        create: {
          parishId: parish.id,
          role: MembershipRole.MEMBER,
          status: MembershipStatus.VERIFIED,
          joinedVia: JoinMethod.CODE,
          approvedById: priest.id,
          approvedAt: verifiedAt,
        },
      },
    },
  });

  // Typed the code and is waiting. Deliberately left PENDING so the approval
  // queue is not empty on first run.
  await prisma.user.upsert({
    where: { email: "vasile@example.com" },
    update: {},
    create: {
      email: "vasile@example.com",
      passwordHash,
      firstName: "Vasile",
      lastName: "Dumitrescu",
      dateOfBirth: new Date("2001-06-15T00:00:00.000Z"),
      emailVerifiedAt: verifiedAt,
      memberships: {
        create: {
          parishId: parish.id,
          role: MembershipRole.MEMBER,
          status: MembershipStatus.PENDING,
          joinedVia: JoinMethod.CODE,
        },
      },
    },
  });

  await prisma.announcement.create({
    data: {
      parishId: parish.id,
      authorId: priest.id,
      title: "Programul Săptămânii Luminate",
      body: "Sfânta Liturghie se va săvârşi în fiecare zi la ora 9:00, iar Vecernia la 18:00.",
      visibility: Visibility.ALL,
      publishedAt: new Date(),
    },
  });

  await prisma.liturgicalScheduleEntry.create({
    data: {
      parishId: parish.id,
      createdById: priest.id,
      serviceName: "Sfânta Liturghie",
      startsAt: new Date("2026-09-13T13:00:00.000Z"),
      note: "Duminica după Înălţarea Sfintei Cruci",
    },
  });

  const members = await prisma.membership.findMany({
    where: { parishId: parish.id },
    include: { user: { select: { email: true } } },
    orderBy: { createdAt: "asc" },
  });

  console.log(`parish   : ${parish.name} (join code ${parish.joinCode})`);
  for (const m of members) console.log(`  ${m.role.padEnd(7)} ${m.status.padEnd(9)} ${m.user.email}`);
  console.log(`\nevery seeded account uses the password: ${PASSWORD}`);
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
