import { PlatformRole } from "@prisma/client";
import { prisma } from "@/lib/db";

for (const f of [".env.development.local", ".env.local", ".env"]) {
  try { process.loadEnvFile(f); } catch { /* optional */ }
}

/**
 * Grants or revokes platform administrator rights.
 *
 * Deliberately a console script and not an endpoint. Platform admin is the
 * only role that can pre-create parishes and transfer ownership, so there must
 * be no HTTP surface that grants it: the first one has to be made by someone
 * with database access, and every later one by someone who already has that.
 *
 *   npx tsx scripts/grant-superadmin.ts someone@example.com
 *   npx tsx scripts/grant-superadmin.ts someone@example.com --revoke
 */
async function main() {
  const [rawEmail, ...flags] = process.argv.slice(2);
  const revoke = flags.includes("--revoke");

  if (!rawEmail) {
    console.error("usage: npx tsx scripts/grant-superadmin.ts <email> [--revoke]");
    process.exitCode = 1;
    return;
  }

  const email = rawEmail.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, firstName: true, lastName: true, platformRole: true, emailVerifiedAt: true },
  });

  if (!user) {
    console.error(`No account for ${email}. They must register first.`);
    process.exitCode = 1;
    return;
  }

  // An unverified account has never proved control of its address, and this
  // role is far too powerful to hand to an unproven one.
  if (!revoke && !user.emailVerifiedAt) {
    console.error(`${email} has not verified their email address yet. Refusing.`);
    process.exitCode = 1;
    return;
  }

  const next = revoke ? PlatformRole.USER : PlatformRole.SUPERADMIN;
  if (user.platformRole === next) {
    console.log(`${email} is already ${next}. Nothing to do.`);
    return;
  }

  await prisma.user.update({ where: { id: user.id }, data: { platformRole: next } });
  console.log(`${user.firstName} ${user.lastName} <${email}>: ${user.platformRole} -> ${next}`);

  const admins = await prisma.user.count({ where: { platformRole: PlatformRole.SUPERADMIN } });
  console.log(`platform administrators now: ${admins}`);
  if (admins === 0) console.warn("WARNING: there are now no platform administrators.");
}

main()
  .catch((e) => { console.error(e instanceof Error ? e.message : e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
