import { defineConfig } from "prisma/config";

/**
 * Prisma 7 no longer accepts connection URLs inside schema.prisma, and no
 * longer auto-loads .env. Both jobs happen here.
 *
 * Vercel writes the Neon variables into .env.development.local, so that file
 * is preferred; .env.local and .env are fallbacks for a hand-pasted string.
 * Anything already in the real environment wins over all of them, which is
 * what makes this work unchanged in CI and on Vercel.
 */
for (const file of [".env.development.local", ".env.local", ".env"]) {
  try {
    process.loadEnvFile(file);
  } catch {
    // Missing file is the normal case for most of these; nothing to do.
  }
}

/**
 * Migrations cannot run through pgbouncer: it multiplexes connections, so the
 * advisory lock Prisma takes out would be handed to an arbitrary backend.
 * DATABASE_URL points at Neon's `-pooler` host, so the direct one is required
 * here and only falls back when no pooler is in play.
 */
const baseUrl =
  process.env.DATABASE_URL_UNPOOLED ??
  process.env.POSTGRES_URL_NON_POOLING ??
  process.env.DATABASE_POSTGRES_URL_NON_POOLING ??
  process.env.DATABASE_URL;

if (!baseUrl) {
  throw new Error(
    "No database URL found. Run `npx vercel env pull .env.development.local`, " +
      "or set DATABASE_URL_UNPOOLED by hand.",
  );
}

/**
 * This Neon database is shared: `public` already holds an unrelated
 * application, including its own `User` table. Everything here lives in its
 * own `parohia` schema instead, so a migration can never rewrite those tables.
 *
 * The connection string is the source of truth. When the environment already
 * pins `?schema=`, that value is used as-is; this only fills it in when the
 * variable has not been pinned yet, so local and deployed setups agree and
 * appending is idempotent.
 */
export const DB_SCHEMA = "parohia";

function pinSchema(rawUrl: string): string {
  const url = new URL(rawUrl);
  const existing = url.searchParams.get("schema");
  if (existing && existing !== DB_SCHEMA) {
    throw new Error(
      `DATABASE_URL pins schema "${existing}", but this project migrates "${DB_SCHEMA}". ` +
        `Refusing to migrate into another application's schema.`,
    );
  }
  url.searchParams.set("schema", DB_SCHEMA);
  return url.toString();
}

const migrationUrl = pinSchema(baseUrl);

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: { url: migrationUrl },
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
});
