# Parohia Mea

A two-sided platform for Romanian Orthodox parishes in the diaspora. Priests
administer a parish; parishioners belong to one or more.

The app itself is Next.js 16 with React 19 and Tailwind v4. This README covers
the backend added in Milestone 1: the data model, authentication, and the API
that the web app and later the native apps both consume.

## Running it locally

You need Node 24 and access to the Vercel project.

```bash
npm install
npx vercel link                              # already linked if .vercel exists
npx vercel env pull .env.development.local   # writes the Neon connection vars
npx prisma migrate dev                       # creates the parohia schema
npx prisma db seed                           # one parish, one priest, two members
npm run dev
```

If `vercel env pull` is unavailable, put these two in `.env.development.local`
by hand. See `.env.example`.

| Variable                | Used by     | Notes                                                |
| ----------------------- | ----------- | ---------------------------------------------------- |
| `DATABASE_URL`          | the app     | pooled (`-pooler`) endpoint; must end `&schema=parohia` |
| `DATABASE_URL_UNPOOLED` | migrations  | direct endpoint; pgbouncer cannot migrate            |

### This database is shared

The Neon database also holds an unrelated application in `public`, including its
own `User` table. Everything here therefore lives in a dedicated **`parohia`**
schema.

**The connection string is the source of truth.** Both URLs carry
`schema=parohia`, in every environment including Vercel Preview and Production:

```
postgresql://USER:PASSWORD@ep-….neon.tech/neondb?sslmode=require&schema=parohia
```

Use `&` rather than `?` when appending, because the Neon URLs already carry
`sslmode` and, on the pooled one, `channel_binding`.

Two things read that value, and `prisma.config.ts` is the backup rather than the
authority:

- `src/lib/db.ts` parses `?schema=` and passes it to the driver adapter. **This
  parsing is load-bearing.** The adapter takes the schema only from its
  constructor options and ignores the query parameter, so without this step a
  pinned URL would have no runtime effect at all. Verified by connecting with
  the parameter but no option, which reads `public`.
- `prisma.config.ts` pins the same value for migrations, and only fills it in
  when the environment has not already done so.

Both refuse to run if the URL names a schema other than `parohia`, rather than
silently reading another application's tables.

Nothing in this project reads or writes `public`.

### Seeded accounts

Every seeded account uses the password `parohia-dev-2026`.

| Email                               | Role   | Status   |
| ----------------------------------- | ------ | -------- |
| `parintele@sfantulgheorghe.example` | PRIEST | VERIFIED |
| `maria@example.com`                 | MEMBER | VERIFIED |
| `vasile@example.com`                | MEMBER | PENDING  |

The parish join code is `GHEORGHE`.

## Authentication

**Opaque session tokens held in Postgres, not JWTs.** Three reasons specific to
this domain:

1. **Revocation has to be instant.** A priest rejects a membership or stands
   down a delegate admin. A JWT carrying roles keeps that authority alive until
   it expires. Reading permissions per request means a demoted admin loses
   access on their very next call.
2. **Authority is parish-scoped and plural.** One person can be priest at one
   parish, member at another, and pending at a third. That does not fit a token
   claim, and it goes stale the moment a membership changes.
3. **A JWT blocklist is a session table with extra steps.** Postgres is already
   in the stack.

The token is 32 random bytes, base64url. Only its SHA-256 digest is stored, so a
database leak yields no usable sessions. Expiry is 30 days idle, refreshed on
use but written at most hourly so a burst of requests is not a write per
request. Passwords use argon2id at OWASP's baseline cost.

One token, two envelopes, resolved by a single code path in
`src/lib/auth/session.ts`:

| Client         | Transport                                  |
| -------------- | ------------------------------------------ |
| Web            | `httpOnly; Secure; SameSite=Lax` cookie    |
| iOS / Android  | `Authorization: Bearer <token>`            |

### The hard email gate

No session is issued until the emailed code is confirmed. Login returns
`403 email_not_verified` rather than a token, and only after the password has
been checked, so it never reveals which addresses are registered.

Confirming the code signs the person in, so there is no second step. Because a
gated account has no session, `POST /api/auth/verification/resend` is
necessarily unauthenticated. It always returns `200` with an identical body and
throttles to one code per minute per account, so it cannot be used to discover
which addresses exist or to aim mail at someone else's inbox.

Verification codes are not emailed yet. `src/lib/mail/mailer.ts` logs them to
the server console, behind a `Mailer` interface so M2 can swap in a provider
without touching a call site.

## API

All routes are Next.js route handlers under `src/app/api`. Every failure returns
the same shape:

```json
{ "error": { "code": "forbidden", "message": "...", "fields": { "email": ["..."] } } }
```

```
POST   /api/auth/register              201, emails a code; no session
POST   /api/auth/verify-email          confirms and signs in
POST   /api/auth/verification/resend   unauthenticated, throttled, always 200
POST   /api/auth/login                 403 email_not_verified when ungated
POST   /api/auth/logout                idempotent
GET    /api/auth/me                    caller plus their memberships
POST   /api/auth/password              change; revokes all other sessions

POST   /api/parishes                   creates parish + founding priest, atomically
GET    /api/parishes/:id               members read; join code is staff-only
PATCH  /api/parishes/:id               staff
POST   /api/parishes/:id/join-code/rotate      priest only
GET    /api/parishes/:id/members?status=       staff; the approval queue
GET    /api/parishes/:id/clergy                derived + display-only
POST   /api/parishes/:id/clergy                staff

POST   /api/memberships/join           { code } -> PENDING, never VERIFIED
POST   /api/memberships/:id/approve    staff
POST   /api/memberships/:id/reject     staff
POST   /api/memberships/:id/role       priest only; appoints a delegate admin
GET    /api/me/memberships

GET/POST      /api/parishes/:id/announcements
GET/PATCH/DELETE /api/announcements/:id
GET/POST      /api/parishes/:id/schedule
GET/PATCH/DELETE /api/schedule/:id
GET/POST      /api/parishes/:id/forms
GET/DELETE    /api/forms/:id
```

### How authorisation works

Two helpers in `src/lib/auth/guards.ts` carry the whole model.

`requireParishRole(userId, parishId, allowed)` asks only whether *this* user has
a VERIFIED membership at *this* parish with an allowed role. Authority is never
inferred from the caller's other memberships, so a priest of parish A fails for
parish B exactly as an outsider would.

`requireOwnedResource(userId, load, allowed)` is the important one for nested
routes. It loads the record first and then authorises against the parish that
record actually belongs to, rather than a parish id supplied by the caller.
Passing someone else's announcement id lands on their parish, fails the
membership check, and returns 403 without revealing the contents.

### Visibility

`ALL` is every verified member. `BY_AGE` is members whose age falls inside
`[minAge, maxAge]`. `PRIVATE` is parish staff only. Because `dateOfBirth` is
required at registration, every member resolves against an age range cleanly
rather than being silently excluded.

Staff see drafts; nobody else does. A direct fetch by id re-checks the audience,
so it cannot be used to bypass the list filter.

## Tests

```bash
npm test
```

This builds the app and runs `tests/tenant-isolation.test.ts` against a real
`next start` server over HTTP, rather than calling handlers directly, so routing
and the error wrapper are exercised too. It uses `next start` rather than
`next dev` because Next 16 refuses to run a second dev server for the same
directory, which would block anyone with one already open.

The suite builds two parishes with two priests and then has priest A attempt
every read and every write against parish B, across announcements, members,
forms, schedule, clergy, the parish record, the join code, and the membership
approval endpoints. It asserts three separate things:

- every cross-parish call returns 403,
- no refusal body contains any of parish B's content, and
- parish B's data is byte-for-byte unchanged after all the write attempts.

**Each forbidden attempt is paired with a positive control on priest A's own
parish.** Without those, an endpoint accidentally broken to refuse everybody
would pass an isolation test while being completely non-functional.

It also covers the role boundary inside a single parish: an ordinary member can
read announcements but cannot reach any staff endpoint, and never sees the join
code.

## Roadmap

**M1, done.** Schema and first migration. Auth end to end with the hard email
gate. Parish creation, join by code, approve and reject, delegate admin.
Announcements, schedule and forms. Seed data. Tenant isolation test.

**M2.** Articles, events and polls. Form submissions. Password reset. A real
mailer. Photo upload. Rate limiting and an audit log for membership changes.
Rewiring the prototype screens off `localStorage`.

**M3.** Stripe Connect behind the marked gateway interface, so each parish is
paid directly and fundraiser progress is real. ROEA-wide news, calendar and
SOLIA feeds. Push notifications and native builds.

## Pre-launch tasks

- **Move to a dedicated Neon database.** Parohia currently shares
  `neon-chestnut-fence` with a leftover workout and task planner that occupies
  `public`. Schema separation holds today and is enforced in both directions,
  but a shared database means shared backups, shared restore boundaries, and a
  shared blast radius. This should be its own database before real parishes
  onboard. Not urgent; do not do it mid-milestone.

## Known gaps

These are deliberate, and marked `TODO` in the code.

- **No payment processing.** `Fundraiser` and `Donation` exist as models;
  `PaymentProvider` admits only `NONE` and `STRIPE`. Zelle, Venmo and PayPal are
  display-only handles on `Parish`, because none exposes an API that could
  confirm a payment. No M1 code assumes the money-flow model is settled.
- **No email delivery.** Codes go to the server console.
- **Rate limiting is per-account, not per-IP.** Resend throttles per account;
  there is no shared limiter yet.
- **No audit log.** Membership changes record `approvedById` and timestamps, but
  there is no history of role changes.
- **Rejected memberships are terminal.** The row persists with
  `status = REJECTED` and blocks a second attempt. Whether someone may reapply
  is undecided.
- **Nothing sets `deletedAt`.** Soft-delete columns exist on `Parish` and `User`
  but no endpoint writes them, pending a policy for dependent records.
