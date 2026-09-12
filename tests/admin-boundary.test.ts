import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { api, cleanup, grantSuperadmin, makeParish, makeUser, startServer, stopServer } from "./helpers";

/**
 * Platform authority is a different axis from parish authority.
 *
 * A priest has total control of one parish and none of the platform. These
 * cases exist because that distinction is easy to erode by accident: the day
 * some endpoint treats "is a priest somewhere" as "is trusted", a parish
 * priest can create or reach parishes that are not theirs.
 */

let priest: { token: string; id: string; email: string };
let admin: { token: string; id: string; email: string };
let parishId: string;

before(async () => {
  await startServer();

  priest = await makeUser("boundarypriest");
  const parish = await makeParish({ ownerId: priest.id, name: "Parohia Limite" });
  parishId = parish.id;

  admin = await makeUser("boundaryadmin");
  await grantSuperadmin(admin.email);
});

after(async () => {
  await cleanup();
  await stopServer();
});

describe("creating a parish is a platform operation", () => {
  it("refuses an ordinary member", async () => {
    const outsider = await makeUser("boundaryoutsider");
    const res = await api("POST", "/api/parishes", {
      token: outsider.token,
      body: { name: "Parohia Neautorizată", city: "Detroit", country: "Statele Unite" },
    });
    assert.equal(res.status, 403, "an ordinary account created a parish");
  });

  it("refuses a priest, who is not a platform administrator", async () => {
    const res = await api("POST", "/api/parishes", {
      token: priest.token,
      body: { name: "Parohia Preotului", city: "Detroit", country: "Statele Unite" },
    });
    assert.equal(res.status, 403, "being a priest was treated as platform authority");
  });

  it("refuses an unauthenticated caller with 401", async () => {
    const res = await api("POST", "/api/parishes", {
      body: { name: "Parohia Anonimă", city: "Detroit", country: "Statele Unite" },
    });
    assert.equal(res.status, 401);
  });

  it("permits a platform administrator, and the parish is owned from the start", async () => {
    const res = await api("POST", "/api/parishes", {
      token: admin.token,
      body: { name: "Parohia Administratorului", city: "Detroit", country: "Statele Unite" },
    });
    assert.equal(res.status, 201, JSON.stringify(res.body));

    // Owned immediately, which is what the join flow requires.
    const joined = await api("POST", "/api/memberships/join", {
      token: priest.token,
      body: { code: res.body.parish.joinCode },
    });
    assert.equal(joined.status, 201, "a parish created by an admin was not joinable");
  });
});

describe("an unclaimed parish is not joinable", () => {
  it("refuses a join code belonging to a parish with no priest", async () => {
    const { prisma } = await import("../src/lib/db");
    const orphan = await prisma.parish.create({
      data: {
        name: "Parohia Nerevendicată",
        slug: `nerevendicata-${Date.now()}`,
        city: "Detroit",
        country: "Statele Unite",
        joinCode: `U${Math.random().toString(36).slice(2, 9).toUpperCase()}`,
        // Deliberately unclaimed: pre-created, awaiting its priest.
      },
      select: { id: true, joinCode: true },
    });

    const joiner = await makeUser("wouldjoin");
    const res = await api("POST", "/api/memberships/join", {
      token: joiner.token,
      body: { code: orphan.joinCode },
    });

    // The same refusal as an unknown code, so trying join codes cannot reveal
    // which parishes are pre-created and still waiting to be claimed.
    assert.equal(res.status, 400, "a parishioner joined an ownerless parish");
    assert.equal(res.body.error.code, "invalid_code");

    const pending = await prisma.membership.count({ where: { parishId: orphan.id } });
    assert.equal(pending, 0, "a membership was created against an ownerless parish");

    await prisma.parish.delete({ where: { id: orphan.id } });
  });
});

describe("platform role does not grant parish access", () => {
  it("keeps a platform administrator out of a parish they are not a member of", async () => {
    const res = await api("GET", `/api/parishes/${parishId}`, { token: admin.token });
    assert.equal(res.status, 403, "SUPERADMIN read a parish through the member API");

    const announcements = await api("GET", `/api/parishes/${parishId}/announcements`, { token: admin.token });
    assert.equal(announcements.status, 403);
  });
});
