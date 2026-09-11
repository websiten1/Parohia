import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { api, cleanup, makeUser, startServer, stopServer } from "./helpers";

/**
 * One submission per member, editable until the form closes, validated against
 * the form's own field definitions.
 *
 * The field rules live in the database rather than in a static schema, so this
 * is the only place they are exercised.
 */

let priestToken: string;
let memberToken: string;
let parishId: string;

interface Built { id: string; fields: Record<string, string> }

async function makeForm(body: Record<string, unknown> = {}): Promise<Built> {
  const res = await api("POST", `/api/parishes/${parishId}/forms`, {
    token: priestToken,
    body: {
      title: "Înscriere la botez",
      publish: true,
      fields: [
        { label: "Numele copilului", type: "TEXT", required: true },
        { label: "Data nașterii", type: "DATE", required: false },
        { label: "Naș sau nașă", type: "RADIO", required: false, options: ["Naș", "Nașă"] },
      ],
      ...body,
    },
  });
  assert.equal(res.status, 201, `create form: ${JSON.stringify(res.body)}`);
  const fields: Record<string, string> = {};
  for (const f of res.body.form.fields) fields[f.label] = f.id;
  return { id: res.body.form.id, fields };
}

before(async () => {
  await startServer();
  const priest = await makeUser("formpriest");
  priestToken = priest.token;

  const parish = await api("POST", "/api/parishes", {
    token: priestToken,
    body: { name: "Parohia Formulare", city: "Chicago", country: "Statele Unite" },
  });
  parishId = parish.body.parish.id;

  const member = await makeUser("formmember");
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

describe("submitting", () => {
  it("accepts a valid submission and stores only the known fields", async () => {
    const form = await makeForm();
    const res = await api("POST", `/api/forms/${form.id}/submissions`, {
      token: memberToken,
      body: {
        answers: {
          [form.fields["Numele copilului"]]: "Andrei",
          [form.fields["Data nașterii"]]: "2026-03-02",
          [form.fields["Naș sau nașă"]]: "Naș",
        },
      },
    });
    assert.equal(res.status, 201, JSON.stringify(res.body));
    assert.equal(res.body.submission.answers[form.fields["Numele copilului"]], "Andrei");
  });

  it("refuses a missing required answer", async () => {
    const form = await makeForm();
    const res = await api("POST", `/api/forms/${form.id}/submissions`, {
      token: memberToken,
      body: { answers: { [form.fields["Data nașterii"]]: "2026-03-02" } },
    });
    assert.equal(res.status, 400);
    assert.ok(res.body.error.fields[form.fields["Numele copilului"]], "the required field was not named");
  });

  it("refuses a choice that is not on offer, and a question the form does not ask", async () => {
    const form = await makeForm();

    const badChoice = await api("POST", `/api/forms/${form.id}/submissions`, {
      token: memberToken,
      body: {
        answers: {
          [form.fields["Numele copilului"]]: "Maria",
          [form.fields["Naș sau nașă"]]: "Altcineva",
        },
      },
    });
    assert.equal(badChoice.status, 400, "an invented choice was accepted");

    const unknownField = await api("POST", `/api/forms/${form.id}/submissions`, {
      token: memberToken,
      body: {
        answers: { [form.fields["Numele copilului"]]: "Maria", "not-a-field-id": "x" },
      },
    });
    assert.equal(unknownField.status, 400, "an unknown question was accepted");
  });

  it("refuses a malformed date", async () => {
    const form = await makeForm();
    const res = await api("POST", `/api/forms/${form.id}/submissions`, {
      token: memberToken,
      body: {
        answers: {
          [form.fields["Numele copilului"]]: "Ion",
          [form.fields["Data nașterii"]]: "2 martie",
        },
      },
    });
    assert.equal(res.status, 400);
  });
});

describe("one submission per member, editable", () => {
  it("replaces rather than duplicates when submitted twice", async () => {
    const form = await makeForm();
    const key = form.fields["Numele copilului"];

    await api("POST", `/api/forms/${form.id}/submissions`, {
      token: memberToken, body: { answers: { [key]: "Prima" } },
    });
    await api("POST", `/api/forms/${form.id}/submissions`, {
      token: memberToken, body: { answers: { [key]: "Corectat" } },
    });

    const all = await api("GET", `/api/forms/${form.id}/submissions`, { token: priestToken });
    assert.equal(all.body.count, 1, "a second submission row was created");
    assert.equal(all.body.submissions[0].answers[key], "Corectat", "the correction was not saved");
  });

  it("lets a member read and withdraw their own response", async () => {
    const form = await makeForm();
    const key = form.fields["Numele copilului"];
    await api("POST", `/api/forms/${form.id}/submissions`, {
      token: memberToken, body: { answers: { [key]: "Ana" } },
    });

    const mine = await api("GET", `/api/forms/${form.id}/submissions/me`, { token: memberToken });
    assert.equal(mine.status, 200);
    assert.equal(mine.body.submission.answers[key], "Ana");

    const gone = await api("DELETE", `/api/forms/${form.id}/submissions/me`, { token: memberToken });
    assert.equal(gone.status, 200);

    const after = await api("GET", `/api/forms/${form.id}/submissions/me`, { token: memberToken });
    assert.equal(after.status, 404);
  });

  it("keeps the responses away from ordinary members", async () => {
    const form = await makeForm();
    const res = await api("GET", `/api/forms/${form.id}/submissions`, { token: memberToken });
    assert.equal(res.status, 403, "a member read everyone's answers");
  });
});

describe("open and closed", () => {
  it("refuses a submission to a closed form", async () => {
    const form = await makeForm({ closesAt: "2020-01-01T00:00:00.000Z" });
    const res = await api("POST", `/api/forms/${form.id}/submissions`, {
      token: memberToken,
      body: { answers: { [form.fields["Numele copilului"]]: "Târziu" } },
    });
    assert.equal(res.status, 409);
  });

  it("refuses a submission to a draft", async () => {
    const form = await makeForm({ publish: false });
    const res = await api("POST", `/api/forms/${form.id}/submissions`, {
      token: memberToken,
      body: { answers: { [form.fields["Numele copilului"]]: "Devreme" } },
    });
    assert.ok(res.status === 400 || res.status === 403, `expected refusal, got ${res.status}`);
  });
});
