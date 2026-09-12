import { spawn, type ChildProcess } from "node:child_process";
import { createConnection } from "node:net";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// `next start` only reads .env.local and .env.production.local, so the Neon
// variables Vercel wrote into .env.development.local are loaded here and passed
// through to the child explicitly.
for (const f of [".env.development.local", ".env.local", ".env"]) {
  try { process.loadEnvFile(f); } catch { /* optional */ }
}

export const BASE = "http://127.0.0.1:3111";

let server: ChildProcess | null = null;
let log = "";

/** The dev mailer appends here synchronously, so codes are readable at once. */
const outbox = join(mkdtempSync(join(tmpdir(), "parohia-mail-")), "outbox.log");

/**
 * Boots a real server and drives it over HTTP. Calling the route handlers
 * directly would skip routing, header parsing and the error wrapper, which is
 * exactly where an isolation bug could hide.
 *
 * `next start` rather than `next dev` for two reasons: this exercises the
 * production build that will actually run on Vercel, and Next 16 refuses to
 * run a second dev server for the same directory, so a developer with one
 * already open could not run the suite.
 */
/** Resolves true when something is already listening on the test port. */
function portInUse(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = createConnection({ port, host: "127.0.0.1" })
      .on("connect", () => { socket.destroy(); resolve(true); })
      .on("error", () => resolve(false));
  });
}

export async function startServer(): Promise<void> {
  writeFileSync(outbox, "");

  // A previous run's server can outlive its test process for a moment. Binding
  // while it lingers fails with EADDRINUSE and every test is cancelled with a
  // misleading error, so wait for the port rather than racing it.
  const free = Date.now() + 20_000;
  while (await portInUse(3111)) {
    if (Date.now() > free) {
      throw new Error("port 3111 is still in use; another test server is running");
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  const child = spawn("npx", ["next", "start", "--port", "3111", "--hostname", "127.0.0.1"], {
    env: { ...process.env, MAIL_OUTBOX: outbox },
    stdio: ["ignore", "pipe", "pipe"],
    // Its own process group, so stopServer can signal the whole tree. Killing
    // the npx wrapper alone leaves the real next-server holding the port.
    detached: true,
  });
  server = child;
  child.stdout?.on("data", (d) => { log += String(d); });
  child.stderr?.on("data", (d) => { log += String(d); });

  const deadline = Date.now() + 120_000;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${BASE}/api/auth/me`);
      if (res.status === 401) return; // routed, and correctly refusing
    } catch { /* not listening yet */ }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`dev server did not start in time:\n${log.slice(-2000)}`);
}

export async function stopServer(): Promise<void> {
  const child = server;
  server = null;
  if (!child?.pid) return;

  // Negative pid signals the whole group, reaching the next-server grandchild.
  try { process.kill(-child.pid, "SIGTERM"); } catch { /* already gone */ }

  const deadline = Date.now() + 10_000;
  while (await portInUse(3111)) {
    if (Date.now() > deadline) {
      try { process.kill(-child.pid, "SIGKILL"); } catch { /* already gone */ }
      break;
    }
    await new Promise((r) => setTimeout(r, 250));
  }
}

/** Reads the newest code of a given kind out of the dev mailer's outbox. */
export async function waitForCode(
  email: string,
  kind: "verification" | "password reset" = "verification",
): Promise<string> {
  const pattern = new RegExp(`${kind} code for ${email.replace(/[.+]/g, "\\$&")}: (\\d{6})`, "gi");
  const deadline = Date.now() + 20_000;
  while (Date.now() < deadline) {
    const matches = [...readFileSync(outbox, "utf8").matchAll(pattern)];
    if (matches.length) return matches[matches.length - 1][1];
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error(`no verification code appeared for ${email}. server log:\n${log.slice(-1500)}`);
}

/** Every account this run created, so the suite can remove them afterwards. */
const createdEmails: string[] = [];

/** Deletes this run's fixtures. Parishes cascade from their founding priest. */
export async function cleanup(): Promise<void> {
  if (!createdEmails.length) return;
  const { prisma } = await import("../src/lib/db");
  const parishIds = (
    await prisma.membership.findMany({
      where: { user: { email: { in: createdEmails } } },
      select: { parishId: true },
    })
  ).map((m) => m.parishId);

  await prisma.parish.deleteMany({ where: { id: { in: parishIds } } });
  await prisma.user.deleteMany({ where: { email: { in: createdEmails } } });
  await prisma.$disconnect();
}

/**
 * Responses are inspected loosely on purpose: the suite asserts on status codes
 * and on the absence of leaked strings, so modelling every body shape would add
 * maintenance cost without catching anything the assertions do not already.
 */
export interface Res<T = unknown> { status: number; body: T; }

export async function api<T = any>( // eslint-disable-line @typescript-eslint/no-explicit-any
  method: string,
  path: string,
  opts: { token?: string; body?: unknown } = {},
): Promise<Res<T>> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "content-type": "application/json",
      ...(opts.token ? { authorization: `Bearer ${opts.token}` } : {}),
    },
    ...(opts.body !== undefined ? { body: JSON.stringify(opts.body) } : {}),
  });
  const text = await res.text();
  let body: unknown = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  return { status: res.status, body: body as T };
}

/**
 * Promotes an account to platform administrator, the same way the console
 * script does. There is deliberately no endpoint for this, so a test that
 * needs one reaches the database directly.
 */
export async function grantSuperadmin(email: string): Promise<void> {
  const { prisma } = await import("../src/lib/db");
  await prisma.user.update({ where: { email }, data: { platformRole: "SUPERADMIN" } });
}

/**
 * Creates a parish owned by the given user, as a fixture rather than through
 * the API.
 *
 * Parish creation is a platform-admin operation now, and under diocese
 * distribution a real priest never creates one: they claim a pre-created
 * parish. Making every test priest a SUPERADMIN to satisfy the endpoint would
 * give them powers no real priest has, which would quietly weaken every
 * isolation assertion built on them. The endpoint's own authorisation is
 * covered separately in admin-boundary.test.ts.
 */
export async function makeParish(opts: {
  ownerId: string;
  name: string;
  city?: string;
  country?: string;
}): Promise<{ id: string; joinCode: string }> {
  const { prisma } = await import("../src/lib/db");
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  const joinCode = `T${suffix}${Math.random().toString(36).slice(2, 3).toUpperCase()}`;

  const parish = await prisma.parish.create({
    data: {
      name: opts.name,
      slug: `${opts.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${suffix.toLowerCase()}`,
      city: opts.city ?? "Detroit",
      country: opts.country ?? "Statele Unite",
      joinCode,
      // Owned from the first moment, which is what the join flow requires.
      claimedAt: new Date(),
      claimedById: opts.ownerId,
      memberships: {
        create: {
          userId: opts.ownerId,
          role: "PRIEST",
          status: "VERIFIED",
          joinedVia: "FOUNDER",
          approvedAt: new Date(),
        },
      },
    },
    select: { id: true, joinCode: true },
  });
  return parish;
}

/** Registers, verifies and returns a usable bearer token. */
export async function makeUser(label: string): Promise<{ email: string; token: string; id: string }> {
  // Lowercased to match what the register schema stores, so cleanup and the
  // outbox lookup both find it.
  const email = `${label}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@test.invalid`.toLowerCase();
  createdEmails.push(email);
  const password = "correct-horse-battery";

  const reg = await api("POST", "/api/auth/register", {
    body: { email, password, firstName: label, lastName: "Test", dateOfBirth: "1985-03-14" },
  });
  if (reg.status !== 201) throw new Error(`register failed: ${JSON.stringify(reg.body)}`);

  const code = await waitForCode(email);
  const verified = await api("POST", "/api/auth/verify-email", { body: { email, code } });
  if (verified.status !== 200) throw new Error(`verify failed: ${JSON.stringify(verified.body)}`);

  const me = await api("GET", "/api/auth/me", { token: verified.body.token });
  return { email, token: verified.body.token, id: me.body.user.id };
}
