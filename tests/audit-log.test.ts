import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { api, cleanup, makeParish, makeUser, startServer, stopServer } from "./helpers";

/**
 * The audit log records who changed a membership, when, and to what.
 *
 * M3 puts parish ownership transfer on top of this, which is the case that
 * makes it matter: moving a parish with no record of who did it is the kind of
 * gap that only surfaces the day there is a dispute. These cases establish
 * that the record is written in the same transaction as the change, is scoped
 * to one parish like everything else, and is not writable over HTTP.
 */

let priest: { token: string; id: string };
let member: { token: string; id: string };
let parishId: string;
let membershipId: string;

before(async () => {
  await startServer();

  priest = await makeUser("auditpriest");
  const parish = await makeParish({ ownerId: priest.id, name: "Parohia Registru" });
  parishId = parish.id;

  member = await makeUser("auditmember");
  const joined = await api("POST", "/api/memberships/join", {
    token: member.token,
    body: { code: parish.joinCode },
  });
  assert.equal(joined.status, 201, JSON.stringify(joined.body));
  membershipId = joined.body.membership.id;
});

after(async () => {
  await cleanup();
  await stopServer();
});

describe("membership changes leave a record", () => {
  it("records the request, the approval and the role change, with actor and subject", async () => {
    await api("POST", `/api/memberships/${membershipId}/approve`, { token: priest.token });
    await api("POST", `/api/memberships/${membershipId}/role`, {
      token: priest.token,
      body: { role: "ADMIN" },
    });

    const res = await api("GET", `/api/parishes/${parishId}/audit`, { token: priest.token });
    assert.equal(res.status, 200, JSON.stringify(res.body));

    const actions = res.body.events.map((e: { action: string }) => e.action);
    for (const expected of ["membership.requested", "membership.approved", "membership.role_changed"]) {
      assert.ok(actions.includes(expected), `missing ${expected}; saw ${actions.join(", ")}`);
    }

    // Newest first, so the most recent change is the one a reader sees.
    assert.equal(actions[0], "membership.role_changed");

    const roleChange = res.body.events[0];
    assert.equal(roleChange.actor.id, priest.id, "the actor was not recorded");
    assert.equal(roleChange.metadata.subjectUserId, member.id, "the subject was not recorded");
    assert.equal(roleChange.metadata.from, "MEMBER");
    assert.equal(roleChange.metadata.to, "ADMIN");
  });

  it("does not record the new join code when one is rotated", async () => {
    const rotated = await api("POST", `/api/parishes/${parishId}/join-code/rotate`, {
      token: priest.token,
    });
    assert.equal(rotated.status, 200);
    const fresh = rotated.body.parish.joinCode;

    const res = await api("GET", `/api/parishes/${parishId}/audit`, { token: priest.token });
    const serialized = JSON.stringify(res.body);
    assert.ok(serialized.includes("parish.join_code_rotated"), "the rotation was not recorded");
    assert.ok(!serialized.includes(fresh), "the audit log leaked the new join code");
  });
});

describe("the log is scoped and read-only", () => {
  it("keeps one parish's history out of another's", async () => {
    const otherPriest = await makeUser("auditother");
    const other = await makeParish({ ownerId: otherPriest.id, name: "Parohia Vecina" });

    const crossRead = await api("GET", `/api/parishes/${parishId}/audit`, { token: otherPriest.token });
    assert.equal(crossRead.status, 403, "a priest read another parish's history");

    const own = await api("GET", `/api/parishes/${other.id}/audit`, { token: otherPriest.token });
    assert.equal(own.status, 200);
    assert.equal(own.body.events.length, 0, "another parish's events appeared in this one's log");
  });

  it("keeps the history away from ordinary members", async () => {
    const plain = await makeUser("auditplain");
    const parish = await makeParish({ ownerId: priest.id, name: "Parohia Membri" });
    const joined = await api("POST", "/api/memberships/join", {
      token: plain.token,
      body: { code: parish.joinCode },
    });
    await api("POST", `/api/memberships/${joined.body.membership.id}/approve`, { token: priest.token });

    const res = await api("GET", `/api/parishes/${parish.id}/audit`, { token: plain.token });
    assert.equal(res.status, 403, "a member read the parish history");
  });

  it("offers no way to write or delete a record over HTTP", async () => {
    for (const method of ["POST", "PATCH", "DELETE", "PUT"]) {
      const res = await api(method, `/api/parishes/${parishId}/audit`, {
        token: priest.token,
        body: { action: "parish.transferred" },
      });
      assert.equal(res.status, 405, `${method} on the audit log was not refused`);
    }
  });
});
