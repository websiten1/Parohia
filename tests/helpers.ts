import { spawn, type ChildProcess } from "node:child_process";
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
export async function startServer(): Promise<void> {
  writeFileSync(outbox, "");
  const child = spawn("npx", ["next", "start", "--port", "3111", "--hostname", "127.0.0.1"], {
    env: { ...process.env, MAIL_OUTBOX: outbox },
    stdio: ["ignore", "pipe", "pipe"],
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
  server?.kill("SIGTERM");
  server = null;
}

/** Reads the newest code for an address out of the dev mailer's outbox. */
export async function waitForCode(email: string): Promise<string> {
  const pattern = new RegExp(`verification code for ${email.replace(/[.+]/g, "\\$&")}: (\\d{6})`, "gi");
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
