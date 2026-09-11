import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * The schema Parohia owns. This Neon database is shared with an unrelated
 * application that occupies `public`, including its own `User` table, so
 * nothing here may ever resolve to `public`.
 */
export const DEFAULT_DB_SCHEMA = "parohia";

/**
 * Reads `?schema=` out of the connection string.
 *
 * The driver adapter does NOT do this itself: it takes the schema only from
 * its constructor options and ignores the query parameter entirely. Parsing it
 * here is what makes the connection string authoritative at runtime as well as
 * for migrations, so the deployed environment variable is the single place the
 * schema is decided.
 */
export function schemaFromUrl(connectionString: string): string | undefined {
  try {
    return new URL(connectionString).searchParams.get("schema") ?? undefined;
  } catch {
    return undefined;
  }
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Run `npx vercel env pull .env.development.local`.");
  }

  const schema = schemaFromUrl(connectionString) ?? DEFAULT_DB_SCHEMA;

  // A URL that names a different schema is almost certainly a misconfigured
  // environment pointing at another tenant's data. Fail loudly rather than
  // quietly reading or writing the wrong tables.
  if (schema !== DEFAULT_DB_SCHEMA) {
    throw new Error(
      `DATABASE_URL names schema "${schema}", but this application owns "${DEFAULT_DB_SCHEMA}". ` +
        `Refusing to connect: \`public\` on this database belongs to a different application.`,
    );
  }

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString }, { schema }),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

function getClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    const client = createClient();
    // One client is reused across hot reloads in dev. Next re-evaluates modules
    // on every change, and a fresh client per reload exhausts the pool fast.
    if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
    else return (globalForPrisma.prisma = client);
  }
  return globalForPrisma.prisma;
}

/**
 * Resolved on first property access rather than at import time.
 *
 * `next build` imports every route module to collect its config. Constructing
 * the client eagerly made that a build-time database requirement, so a build
 * without DATABASE_URL failed before serving a single request.
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property) {
    const client = getClient();
    const value = Reflect.get(client, property, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
