import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { api, cleanup, makeUser, startServer, stopServer } from "./helpers";

/**
 * The three results-visibility branches and the single-choice rule.
 *
 * Isolation is covered elsewhere; this is about whether the poll behaves
 * correctly for people who are entitled to use it. The branches decide what a
 * parishioner is allowed to know, so a mistake here leaks the outcome of a
 * parish council vote rather than merely erroring.
 */

let priestToken: string;
let memberToken: string;
let parishId: string;

async function makePoll(body: Record<string, unknown>) {
  const res = await api("POST", `/api/parishes/${parishId}/polls`, {
    token: priestToken,
    body: { options: ["Da", "Nu"], publish: true, ...body },
  });
  assert.equal(res.status, 201, `create poll: ${JSON.stringify(res.body)}`);
  return { id: res.body.poll.id, optionIds: res.body.poll.options.map((o: { id: string }) => o.id) };
}

before(async () => {
  await startServer();
  const priest = await makeUser("pollpriest");
  priestToken = priest.token;

  const parish = await api("POST", "/api/parishes", {
    token: priestToken,
    body: { name: "Parohia Sondaj", city: "Cleveland", country: "Statele Unite" },
  });
  assert.equal(parish.status, 201);
  parishId = parish.body.parish.id;

  const member = await makeUser("pollmember");
  memberToken = member.token;
  const joined = await api("POST", "/api/memberships/join", {
    token: memberToken,
    body: { code: parish.body.parish.joinCode },
  });
  await api("POST", `/api/memberships/${joined.body.membership.id}/approve`, { token: priestToken });
});

after(async () => {
  await cleanup();
  await stopServer();
});

describe("results visibility is decided per poll", () => {
  it("AFTER_VOTE withholds results until the member has voted", async () => {
    const poll = await makePoll({ question: "Ce sâmbătă?", resultsVisibility: "AFTER_VOTE" });

    const before = await api("GET", `/api/polls/${poll.id}/results`, { token: memberToken });
    assert.equal(before.status, 403, "results leaked before voting");

    const voted = await api("POST", `/api/polls/${poll.id}/vote`, {
      token: memberToken,
      body: { optionIds: [poll.optionIds[0]] },
    });
    assert.equal(voted.status, 200, JSON.stringify(voted.body));

    const after = await api("GET", `/api/polls/${poll.id}/results`, { token: memberToken });
    assert.equal(after.status, 200, "results still withheld after voting");
    assert.equal(after.body.totalVotes, 1);
    assert.equal(after.body.results[0].votes, 1);
    assert.equal(after.body.results[0].share, 100);
  });

  it("AFTER_CLOSE withholds results from members while the poll is open, but never from staff", async () => {
    const poll = await makePoll({
      question: "Consiliul parohial",
      resultsVisibility: "AFTER_CLOSE",
      closesAt: "2027-01-01T00:00:00.000Z",
    });

    await api("POST", `/api/polls/${poll.id}/vote`, {
      token: memberToken,
      body: { optionIds: [poll.optionIds[0]] },
    });

    const asMember = await api("GET", `/api/polls/${poll.id}/results`, { token: memberToken });
    assert.equal(asMember.status, 403, "a sensitive poll leaked its running total");

    const asPriest = await api("GET", `/api/polls/${poll.id}/results`, { token: priestToken });
    assert.equal(asPriest.status, 200, "staff must always be able to see totals");
    assert.equal(asPriest.body.totalVotes, 1);
  });

  it("ALWAYS shows results without voting", async () => {
    const poll = await makePoll({ question: "Culoarea?", resultsVisibility: "ALWAYS" });
    const res = await api("GET", `/api/polls/${poll.id}/results`, { token: memberToken });
    assert.equal(res.status, 200);
    assert.equal(res.body.totalVotes, 0);
    assert.equal(res.body.hasVoted, false);
  });

  it("refuses AFTER_CLOSE with no closing time, which would hide results forever", async () => {
    const res = await api("POST", `/api/parishes/${parishId}/polls`, {
      token: priestToken,
      body: { question: "Fără termen", options: ["a", "b"], resultsVisibility: "AFTER_CLOSE" },
    });
    assert.equal(res.status, 400);
  });
});

describe("vote rules", () => {
  it("rejects two choices on a single-choice poll and replaces rather than duplicates", async () => {
    const poll = await makePoll({ question: "Una singură", allowMultiple: false });

    const both = await api("POST", `/api/polls/${poll.id}/vote`, {
      token: memberToken,
      body: { optionIds: poll.optionIds },
    });
    assert.equal(both.status, 400, "a single-choice poll accepted two options");

    await api("POST", `/api/polls/${poll.id}/vote`, {
      token: memberToken,
      body: { optionIds: [poll.optionIds[0]] },
    });
    await api("POST", `/api/polls/${poll.id}/vote`, {
      token: memberToken,
      body: { optionIds: [poll.optionIds[1]] },
    });

    const res = await api("GET", `/api/polls/${poll.id}/results`, { token: priestToken });
    assert.equal(res.body.totalVotes, 1, "changing a vote created a second one");
    assert.equal(res.body.voterCount, 1);
    assert.equal(res.body.results[1].votes, 1, "the vote did not move to the new option");
  });

  it("accepts several choices when the poll allows it", async () => {
    const poll = await makePoll({ question: "Mai multe", allowMultiple: true });
    const res = await api("POST", `/api/polls/${poll.id}/vote`, {
      token: memberToken,
      body: { optionIds: poll.optionIds },
    });
    assert.equal(res.status, 200, JSON.stringify(res.body));

    const results = await api("GET", `/api/polls/${poll.id}/results`, { token: priestToken });
    assert.equal(results.body.totalVotes, 2);
    assert.equal(results.body.voterCount, 1, "one person must count as one voter");
  });

  it("refuses an option belonging to a different poll", async () => {
    const a = await makePoll({ question: "Sondaj A" });
    const b = await makePoll({ question: "Sondaj B" });

    const res = await api("POST", `/api/polls/${a.id}/vote`, {
      token: memberToken,
      body: { optionIds: [b.optionIds[0]] },
    });
    assert.equal(res.status, 400, "a vote landed in another poll's tally");
  });

  it("refuses a vote once the poll has closed", async () => {
    const poll = await makePoll({
      question: "Închis",
      resultsVisibility: "ALWAYS",
      closesAt: "2020-01-01T00:00:00.000Z",
    });
    const res = await api("POST", `/api/polls/${poll.id}/vote`, {
      token: memberToken,
      body: { optionIds: [poll.optionIds[0]] },
    });
    assert.equal(res.status, 409, "a closed poll accepted a vote");
  });

  it("lets a member retract their vote", async () => {
    const poll = await makePoll({ question: "Retragere", resultsVisibility: "ALWAYS" });
    await api("POST", `/api/polls/${poll.id}/vote`, {
      token: memberToken,
      body: { optionIds: [poll.optionIds[0]] },
    });

    const removed = await api("DELETE", `/api/polls/${poll.id}/vote`, { token: memberToken });
    assert.equal(removed.status, 200);
    assert.equal(removed.body.removed, 1);

    const res = await api("GET", `/api/polls/${poll.id}/results`, { token: memberToken });
    assert.equal(res.body.totalVotes, 0);
  });
});
