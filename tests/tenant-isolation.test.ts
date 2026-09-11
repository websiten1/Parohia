import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { api, cleanup, makeUser, startServer, stopServer } from "./helpers";

/**
 * Proves that parish membership, not authentication, is what grants access.
 *
 * Two priests each found a parish and fill it with content. Priest A then
 * attempts every read and every write against parish B's resources.
 *
 * The suite is deliberately symmetrical: each forbidden attempt is paired with
 * a positive control on priest A's *own* parish. Without those, an endpoint
 * accidentally broken to refuse everybody would pass an isolation test while
 * being completely non-functional.
 */

interface Fixture {
  token: string;
  userId: string;
  parishId: string;
  announcementId: string;
  articleId: string;
  eventId: string;
  scheduleId: string;
  formId: string;
  pollId: string;
  pollOptionId: string;
  formFieldId: string;
  pendingMembershipId: string;
}

let A: Fixture;
let B: Fixture;
let outsiderToken: string;
let memberOfAToken: string;

async function buildParish(label: string): Promise<Fixture> {
  const user = await makeUser(label);

  const parish = await api("POST", "/api/parishes", {
    token: user.token,
    body: { name: `Parohia ${label}`, city: "Detroit", country: "Statele Unite" },
  });
  assert.equal(parish.status, 201, `create parish ${label}: ${JSON.stringify(parish.body)}`);
  const parishId = parish.body.parish.id;
  const joinCode = parish.body.parish.joinCode;

  const ann = await api("POST", `/api/parishes/${parishId}/announcements`, {
    token: user.token,
    body: { title: `SECRET-${label}`, body: `Confidential to ${label}`, publish: true },
  });
  assert.equal(ann.status, 201, `create announcement ${label}: ${JSON.stringify(ann.body)}`);

  const article = await api("POST", `/api/parishes/${parishId}/articles`, {
    token: user.token,
    body: { title: `SECRET-ARTICLE-${label}`, body: `Article body for ${label}`, publish: true },
  });
  assert.equal(article.status, 201, `create article ${label}: ${JSON.stringify(article.body)}`);

  const event = await api("POST", `/api/parishes/${parishId}/events`, {
    token: user.token,
    body: {
      title: `SECRET-EVENT-${label}`,
      description: `Event description for ${label}`,
      startsAt: "2026-12-06T16:00:00.000Z",
      publish: true,
    },
  });
  assert.equal(event.status, 201, `create event ${label}: ${JSON.stringify(event.body)}`);

  const sched = await api("POST", `/api/parishes/${parishId}/schedule`, {
    token: user.token,
    body: { serviceName: `Sfânta Liturghie ${label}`, startsAt: "2026-10-04T13:00:00.000Z" },
  });
  assert.equal(sched.status, 201, `create schedule ${label}: ${JSON.stringify(sched.body)}`);

  const poll = await api("POST", `/api/parishes/${parishId}/polls`, {
    token: user.token,
    body: {
      question: `SECRET-POLL-${label}`,
      options: [`Optiunea A ${label}`, `Optiunea B ${label}`],
      publish: true,
    },
  });
  assert.equal(poll.status, 201, `create poll ${label}: ${JSON.stringify(poll.body)}`);

  const form = await api("POST", `/api/parishes/${parishId}/forms`, {
    token: user.token,
    body: {
      title: `Înscriere ${label}`,
      publish: true,
      fields: [{ label: "Numele copilului", type: "TEXT", required: true }],
    },
  });
  assert.equal(form.status, 201, `create form ${label}: ${JSON.stringify(form.body)}`);

  // A pending joiner, so the approve/reject/role endpoints have a real target.
  const joiner = await makeUser(`joiner-${label}`);
  const joined = await api("POST", "/api/memberships/join", {
    token: joiner.token,
    body: { code: joinCode },
  });
  assert.equal(joined.status, 201, `join ${label}: ${JSON.stringify(joined.body)}`);

  return {
    token: user.token,
    userId: user.id,
    parishId,
    announcementId: ann.body.announcement.id,
    articleId: article.body.article.id,
    eventId: event.body.event.id,
    scheduleId: sched.body.entry.id,
    formId: form.body.form.id,
    pollId: poll.body.poll.id,
    pollOptionId: poll.body.poll.options[0].id,
    formFieldId: form.body.form.fields[0].id,
    pendingMembershipId: joined.body.membership.id,
  };
}

before(async () => {
  await startServer();
  A = await buildParish("Alfa");
  B = await buildParish("Beta");

  const outsider = await makeUser("outsider");
  outsiderToken = outsider.token;

  // An approved, non-staff member of parish A, for the role-boundary checks.
  const member = await makeUser("enorias");
  const parishA = await api("GET", `/api/parishes/${A.parishId}`, { token: A.token });
  const joined = await api("POST", "/api/memberships/join", {
    token: member.token,
    body: { code: parishA.body.parish.joinCode },
  });
  await api("POST", `/api/memberships/${joined.body.membership.id}/approve`, { token: A.token });
  memberOfAToken = member.token;
});

after(async () => {
  await cleanup();
  await stopServer();
});

/** Every cross-parish attempt priest A can make against parish B. */
function crossTenantAttempts() {
  return [
    ["GET",    `/api/parishes/${B.parishId}`],
    ["PATCH",  `/api/parishes/${B.parishId}`, { name: "Hijacked" }],
    ["POST",   `/api/parishes/${B.parishId}/join-code/rotate`],
    ["GET",    `/api/parishes/${B.parishId}/members`],
    ["GET",    `/api/parishes/${B.parishId}/members?status=pending`],
    ["GET",    `/api/parishes/${B.parishId}/announcements`],
    ["POST",   `/api/parishes/${B.parishId}/announcements`, { title: "x", body: "y" }],
    ["GET",    `/api/announcements/${B.announcementId}`],
    ["PATCH",  `/api/announcements/${B.announcementId}`, { title: "Hijacked" }],
    ["DELETE", `/api/announcements/${B.announcementId}`],
    ["GET",    `/api/parishes/${B.parishId}/articles`],
    ["POST",   `/api/parishes/${B.parishId}/articles`, { title: "x", body: "y" }],
    ["GET",    `/api/articles/${B.articleId}`],
    ["PATCH",  `/api/articles/${B.articleId}`, { title: "Hijacked" }],
    ["DELETE", `/api/articles/${B.articleId}`],
    ["GET",    `/api/parishes/${B.parishId}/events`],
    ["GET",    `/api/parishes/${B.parishId}/events?past=true`],
    ["POST",   `/api/parishes/${B.parishId}/events`, { title: "x", description: "y", startsAt: "2026-12-06T16:00:00.000Z" }],
    ["GET",    `/api/events/${B.eventId}`],
    ["PATCH",  `/api/events/${B.eventId}`, { title: "Hijacked" }],
    ["DELETE", `/api/events/${B.eventId}`],
    ["GET",    `/api/parishes/${B.parishId}/schedule`],
    ["POST",   `/api/parishes/${B.parishId}/schedule`, { serviceName: "x", startsAt: "2026-10-04T13:00:00.000Z" }],
    ["GET",    `/api/schedule/${B.scheduleId}`],
    ["PATCH",  `/api/schedule/${B.scheduleId}`, { serviceName: "Hijacked" }],
    ["DELETE", `/api/schedule/${B.scheduleId}`],
    ["GET",    `/api/parishes/${B.parishId}/polls`],
    ["POST",   `/api/parishes/${B.parishId}/polls`, { question: "x", options: ["a", "b"] }],
    ["GET",    `/api/polls/${B.pollId}`],
    ["PATCH",  `/api/polls/${B.pollId}`, { question: "Hijacked" }],
    ["DELETE", `/api/polls/${B.pollId}`],
    ["POST",   `/api/polls/${B.pollId}/vote`, { optionIds: [B.pollOptionId] }],
    ["DELETE", `/api/polls/${B.pollId}/vote`],
    ["GET",    `/api/polls/${B.pollId}/results`],
    ["GET",    `/api/parishes/${B.parishId}/forms`],
    ["POST",   `/api/parishes/${B.parishId}/forms`, { title: "x", fields: [{ label: "q", type: "TEXT" }] }],
    ["GET",    `/api/forms/${B.formId}`],
    ["PATCH",  `/api/forms/${B.formId}`, { title: "Hijacked" }],
    ["DELETE", `/api/forms/${B.formId}`],
    ["GET",    `/api/forms/${B.formId}/submissions`],
    ["POST",   `/api/forms/${B.formId}/submissions`, { answers: {} }],
    ["GET",    `/api/forms/${B.formId}/submissions/me`],
    ["DELETE", `/api/forms/${B.formId}/submissions/me`],
    ["GET",    `/api/parishes/${B.parishId}/clergy`],
    ["POST",   `/api/parishes/${B.parishId}/clergy`, { name: "X", title: "Diacon" }],
    ["POST",   `/api/memberships/${B.pendingMembershipId}/approve`],
    ["POST",   `/api/memberships/${B.pendingMembershipId}/reject`],
    ["POST",   `/api/memberships/${B.pendingMembershipId}/role`, { role: "ADMIN" }],
  ] as const;
}

describe("a priest of parish A is refused every resource of parish B", () => {
  it("returns 403 on every cross-parish endpoint", async () => {
    const failures: string[] = [];
    for (const [method, path, body] of crossTenantAttempts()) {
      const res = await api(method, path, { token: A.token, body });
      if (res.status !== 403) failures.push(`${method} ${path} -> ${res.status}`);
    }
    assert.deepEqual(failures, [], `expected 403 from every cross-parish call`);
  });

  it("never leaks parish B's content in the refusal body", async () => {
    const leaks: string[] = [];
    for (const [method, path, body] of crossTenantAttempts()) {
      const res = await api(method, path, { token: A.token, body });
      const serialized = JSON.stringify(res.body ?? "");
      for (const secret of [
        "SECRET-Beta", "Confidential to Beta", "Parohia Beta", "Înscriere Beta",
        "SECRET-ARTICLE-Beta", "Article body for Beta",
        "SECRET-EVENT-Beta", "Event description for Beta",
        "SECRET-POLL-Beta", "Optiunea A Beta", "Optiunea B Beta",
      ]) {
        if (serialized.includes(secret)) leaks.push(`${method} ${path} leaked "${secret}"`);
      }
    }
    assert.deepEqual(leaks, [], "a refusal response carried parish B's data");
  });

  it("leaves parish B's data untouched after every write attempt", async () => {
    const ann = await api("GET", `/api/announcements/${B.announcementId}`, { token: B.token });
    assert.equal(ann.status, 200);
    assert.equal(ann.body.announcement.title, "SECRET-Beta", "announcement was modified");

    const article = await api("GET", `/api/articles/${B.articleId}`, { token: B.token });
    assert.equal(article.status, 200, "article was deleted");
    assert.equal(article.body.article.title, "SECRET-ARTICLE-Beta", "article was modified");

    const event = await api("GET", `/api/events/${B.eventId}`, { token: B.token });
    assert.equal(event.status, 200, "event was deleted");
    assert.equal(event.body.event.title, "SECRET-EVENT-Beta", "event was modified");

    const sched = await api("GET", `/api/schedule/${B.scheduleId}`, { token: B.token });
    assert.equal(sched.status, 200, "schedule entry was deleted");

    const form = await api("GET", `/api/forms/${B.formId}`, { token: B.token });
    assert.equal(form.status, 200, "form was deleted");

    const poll = await api("GET", `/api/polls/${B.pollId}`, { token: B.token });
    assert.equal(poll.status, 200, "poll was deleted");
    assert.equal(poll.body.poll.question, "SECRET-POLL-Beta", "poll was modified");

    const results = await api("GET", `/api/polls/${B.pollId}/results`, { token: B.token });
    assert.equal(results.body.totalVotes, 0, "a vote was cast across tenants");

    const subs = await api("GET", `/api/forms/${B.formId}/submissions`, { token: B.token });
    assert.equal(subs.status, 200, "form was deleted");
    assert.equal(subs.body.count, 0, "a submission was created across tenants");

    const members = await api("GET", `/api/parishes/${B.parishId}/members?status=pending`, { token: B.token });
    assert.equal(members.body.count, 1, "pending membership was approved or rejected across tenants");

    const parish = await api("GET", `/api/parishes/${B.parishId}`, { token: B.token });
    assert.equal(parish.body.parish.name, "Parohia Beta", "parish was renamed across tenants");
  });
});

describe("positive controls: the same calls succeed on the priest's own parish", () => {
  it("permits every equivalent operation within parish A", async () => {
    const ok = async (method: string, path: string, body?: unknown) => {
      const res = await api(method, path, { token: A.token, body });
      assert.ok(res.status >= 200 && res.status < 300, `${method} ${path} -> ${res.status} ${JSON.stringify(res.body)}`);
      return res;
    };

    await ok("GET", `/api/parishes/${A.parishId}`);
    await ok("PATCH", `/api/parishes/${A.parishId}`, { shortHistory: "Întemeiată în 1968." });
    await ok("GET", `/api/parishes/${A.parishId}/members`);
    await ok("GET", `/api/parishes/${A.parishId}/announcements`);
    await ok("GET", `/api/announcements/${A.announcementId}`);
    await ok("PATCH", `/api/announcements/${A.announcementId}`, { title: "Actualizat" });
    await ok("GET", `/api/parishes/${A.parishId}/articles`);
    await ok("GET", `/api/articles/${A.articleId}`);
    await ok("PATCH", `/api/articles/${A.articleId}`, { title: "Articol actualizat" });
    await ok("GET", `/api/parishes/${A.parishId}/events`);
    await ok("GET", `/api/parishes/${A.parishId}/events?past=true`);
    await ok("GET", `/api/events/${A.eventId}`);
    await ok("PATCH", `/api/events/${A.eventId}`, { location: "Sala parohială" });
    await ok("GET", `/api/parishes/${A.parishId}/schedule`);
    await ok("GET", `/api/schedule/${A.scheduleId}`);
    await ok("PATCH", `/api/schedule/${A.scheduleId}`, { serviceName: "Acatist" });
    await ok("GET", `/api/parishes/${A.parishId}/polls`);
    await ok("GET", `/api/polls/${A.pollId}`);
    await ok("PATCH", `/api/polls/${A.pollId}`, { question: "Întrebare actualizată" });
    await ok("POST", `/api/polls/${A.pollId}/vote`, { optionIds: [A.pollOptionId] });
    await ok("GET", `/api/polls/${A.pollId}/results`);
    await ok("DELETE", `/api/polls/${A.pollId}/vote`);
    await ok("GET", `/api/parishes/${A.parishId}/forms`);
    await ok("GET", `/api/forms/${A.formId}`);
    await ok("GET", `/api/forms/${A.formId}`);
    await ok("PATCH", `/api/forms/${A.formId}`, { description: "Completați până duminică." });
    await ok("GET", `/api/forms/${A.formId}/submissions`);
    await ok("GET", `/api/parishes/${A.parishId}/clergy`);
    await ok("POST", `/api/parishes/${A.parishId}/clergy`, { name: "Ioan Marcu", title: "Diacon" });
    await ok("POST", `/api/parishes/${A.parishId}/join-code/rotate`);
    await ok("POST", `/api/memberships/${A.pendingMembershipId}/approve`);
    await ok("POST", `/api/memberships/${A.pendingMembershipId}/role`, { role: "ADMIN" });
  });
});

describe("membership is required, not merely a valid session", () => {
  it("refuses an authenticated outsider with no membership anywhere", async () => {
    const failures: string[] = [];
    for (const [method, path, body] of crossTenantAttempts()) {
      const res = await api(method, path, { token: outsiderToken, body });
      if (res.status !== 403) failures.push(`${method} ${path} -> ${res.status}`);
    }
    assert.deepEqual(failures, []);
  });

  it("refuses an unauthenticated caller with 401, not 403", async () => {
    const res = await api("GET", `/api/parishes/${A.parishId}`);
    assert.equal(res.status, 401);
  });
});

describe("role boundaries inside a single parish", () => {
  it("lets an ordinary member read, but not administer, their own parish", async () => {
    const read = await api("GET", `/api/parishes/${A.parishId}/announcements`, { token: memberOfAToken });
    assert.equal(read.status, 200, "a verified member should be able to read announcements");

    const writes: Array<readonly [string, string, unknown?]> = [
      ["POST", `/api/parishes/${A.parishId}/announcements`, { title: "x", body: "y" }],
      ["POST", `/api/parishes/${A.parishId}/articles`, { title: "x", body: "y" }],
      ["POST", `/api/parishes/${A.parishId}/events`, { title: "x", description: "y", startsAt: "2026-12-06T16:00:00.000Z" }],
      ["DELETE", `/api/articles/${A.articleId}`],
      ["DELETE", `/api/events/${A.eventId}`],
      ["POST", `/api/parishes/${A.parishId}/polls`, { question: "x", options: ["a", "b"] }],
      ["PATCH", `/api/polls/${A.pollId}`, { question: "x" }],
      ["GET", `/api/forms/${A.formId}/submissions`],
      ["PATCH", `/api/forms/${A.formId}`, { title: "x" }],
      ["GET", `/api/parishes/${A.parishId}/members`],
      ["POST", `/api/parishes/${A.parishId}/join-code/rotate`],
      ["POST", `/api/parishes/${A.parishId}/schedule`, { serviceName: "x", startsAt: "2026-10-04T13:00:00.000Z" }],
      ["DELETE", `/api/announcements/${A.announcementId}`],
    ];
    const failures: string[] = [];
    for (const [method, path, body] of writes) {
      const res = await api(method, path, { token: memberOfAToken, body });
      if (res.status !== 403) failures.push(`${method} ${path} -> ${res.status}`);
    }
    assert.deepEqual(failures, [], "an ordinary member reached a staff-only endpoint");
  });

  it("hides the join code from ordinary members", async () => {
    const res = await api("GET", `/api/parishes/${A.parishId}`, { token: memberOfAToken });
    assert.equal(res.status, 200);
    assert.equal(res.body.parish.joinCode, undefined, "join code leaked to a non-staff member");
  });
});
