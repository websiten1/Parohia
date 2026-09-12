import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { api, cleanup, makeUser, startServer, stopServer, waitForCode } from "./helpers";

/**
 * Resetting a password, including the two consequences agreed in the design:
 * every other session dies, and the address ends up verified.
 */

const PASSWORD = "correct-horse-battery";
const NEXT_PASSWORD = "a-different-long-password";

before(async () => { await startServer(); });
after(async () => { await cleanup(); await stopServer(); });

describe("requesting a reset", () => {
  it("answers identically for a real and an unknown address", async () => {
    const user = await makeUser("resetreal");

    const known = await api("POST", "/api/auth/password/reset/request", {
      body: { email: user.email },
    });
    const unknown = await api("POST", "/api/auth/password/reset/request", {
      body: { email: `nobody-${Date.now()}@test.invalid` },
    });

    assert.equal(known.status, unknown.status, "status revealed whether the address exists");
    assert.deepEqual(known.body, unknown.body, "body revealed whether the address exists");
  });
});

describe("completing a reset", () => {
  it("changes the password, signs the user in, and kills the old session", async () => {
    const user = await makeUser("resetflow");

    // A second device, which must be signed out by the reset.
    const other = await api("POST", "/api/auth/login", {
      body: { email: user.email, password: PASSWORD },
    });
    assert.equal(other.status, 200);
    const otherToken = other.body.token;

    await api("POST", "/api/auth/password/reset/request", { body: { email: user.email } });
    const code = await waitForCode(user.email, "password reset");

    const confirmed = await api("POST", "/api/auth/password/reset/confirm", {
      body: { email: user.email, code, newPassword: NEXT_PASSWORD },
    });
    assert.equal(confirmed.status, 200, JSON.stringify(confirmed.body));
    assert.equal(confirmed.body.revokedOtherSessions, true);

    // The returned session works.
    const me = await api("GET", "/api/auth/me", { token: confirmed.body.token });
    assert.equal(me.status, 200);

    // The other device does not.
    const stale = await api("GET", "/api/auth/me", { token: otherToken });
    assert.equal(stale.status, 401, "a session survived the password reset");

    // The old password is gone, the new one works.
    const oldPw = await api("POST", "/api/auth/login", {
      body: { email: user.email, password: PASSWORD },
    });
    assert.equal(oldPw.status, 401, "the old password still worked");

    const newPw = await api("POST", "/api/auth/login", {
      body: { email: user.email, password: NEXT_PASSWORD },
    });
    assert.equal(newPw.status, 200, JSON.stringify(newPw.body));
  });

  it("refuses a wrong code, and the code is single-use", async () => {
    const user = await makeUser("resetonce");
    await api("POST", "/api/auth/password/reset/request", { body: { email: user.email } });
    const code = await waitForCode(user.email, "password reset");

    const wrong = await api("POST", "/api/auth/password/reset/confirm", {
      body: { email: user.email, code: code === "000000" ? "111111" : "000000", newPassword: NEXT_PASSWORD },
    });
    assert.equal(wrong.status, 400);

    const first = await api("POST", "/api/auth/password/reset/confirm", {
      body: { email: user.email, code, newPassword: NEXT_PASSWORD },
    });
    assert.equal(first.status, 200, JSON.stringify(first.body));

    const replay = await api("POST", "/api/auth/password/reset/confirm", {
      body: { email: user.email, code, newPassword: "yet-another-password" },
    });
    assert.equal(replay.status, 400, "a reset code was accepted twice");
  });

  it("rescues an account that never verified, which the hard gate would otherwise strand", async () => {
    // Registered but deliberately never verified, so there is no session and
    // login is refused with 403.
    const email = `unverified-${Date.now()}@test.invalid`;
    const registered = await api("POST", "/api/auth/register", {
      body: { email, password: PASSWORD, firstName: "Ne", lastName: "Verificat", dateOfBirth: "1990-01-01" },
    });
    assert.equal(registered.status, 201);

    const gated = await api("POST", "/api/auth/login", { body: { email, password: PASSWORD } });
    assert.equal(gated.status, 403);
    assert.equal(gated.body.error.code, "email_not_verified");

    await api("POST", "/api/auth/password/reset/request", { body: { email } });
    const code = await waitForCode(email, "password reset");

    const confirmed = await api("POST", "/api/auth/password/reset/confirm", {
      body: { email, code, newPassword: NEXT_PASSWORD },
    });
    assert.equal(confirmed.status, 200, JSON.stringify(confirmed.body));

    // Receiving the code proved control of the inbox, so the gate is satisfied.
    const after = await api("POST", "/api/auth/login", { body: { email, password: NEXT_PASSWORD } });
    assert.equal(after.status, 200, "the account is still stranded behind the email gate");

    const { prisma } = await import("../src/lib/db");
    await prisma.user.deleteMany({ where: { email } });
  });
});
