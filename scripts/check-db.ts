import { prisma } from "../src/lib/db";

/** Confirms the database is reachable and reports whether migrations have run. */
async function main() {
  const [{ version }] = await prisma.$queryRaw<{ version: string }[]>`SELECT version()`;
  console.log("connected:", version.split(",")[0]);

  const tables = await prisma.$queryRaw<{ count: bigint }[]>`
    SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public'`;
  console.log("public tables:", Number(tables[0].count));
}

main()
  .catch((err) => {
    console.error("NOT connected:", err instanceof Error ? err.message : err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
