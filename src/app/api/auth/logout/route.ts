import { NextResponse } from "next/server";
import { route } from "@/lib/api/errors";
import { clearSessionCookie, getAuth, revokeSession } from "@/lib/auth/session";

/**
 * Idempotent: logging out without a session still succeeds, so a client that
 * lost track of its state can always reach a signed-out condition.
 */
export const POST = route(async (req: Request) => {
  const auth = await getAuth(req);
  if (auth) await revokeSession(auth.sessionId);
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
});
