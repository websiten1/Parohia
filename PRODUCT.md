# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Romanian Orthodox believers living in the diaspora — first-generation immigrants and their families across the US, Germany, Italy, the UK, France, and beyond. They are often geographically far from the nearest parish and want a single, trustworthy daily companion for their liturgical life. Skews toward an older demographic; low-vision and reduced-dexterity users are a core segment, not an edge case.

Job to be done: "Show me what today means in the Church's life, tell me when my parish's services are, and keep me connected to my community's announcements and prayers — in a language and format I can actually read comfortably."

## Product Purpose

Parohia is a mobile-first companion app for Orthodox parish life. It combines a real Orthodox liturgical calendar (tone, saints, fasting status, computed from Orthodox Pascha) with per-parish content — service schedules, announcements, clergy/contact info — selected once by the user and persisted locally. Success is a user who opens the app and immediately knows what today is liturgically and what their own parish is doing about it, without hunting through a parish website or a paper bulletin.

## Positioning

Generic Orthodox calendar apps are global and parish-agnostic; parish websites are parish-specific but don't carry the liturgical calendar or work well on mobile. Parohia is the only layer that binds a real, computed Orthodox calendar (not a static list) to a specific, user-chosen parish's own schedule and announcements — a global diaspora directory with local, personal relevance once a parish is picked.

## Operating Context

- Mobile-first PWA, reference artboard 390×844; used primarily one-handed, often during a commute or before/after services.
- Bilingual by design: Romanian and English content and UI coexist; some content (real catechetical articles, Scripture readings) is English-only by editorial policy and is labeled as such rather than machine-translated.
- First run: onboarding → parish selection (search + country/jurisdiction filter) → persisted locally; "Today" and the schedule screen are meaningless until a parish is chosen.
- No backend yet — all parish, article, and schedule data is structured mock data behind an async read layer (`src/lib/data/`) written to be swapped for a real backend (e.g. Supabase) without touching callers.
- Existing user-facing settings already signal accessibility intent: text size (standard/large/extra-large), reduce motion, reduce decorative imagery, light/system/dark appearance (dark not yet implemented).

## Capabilities and Constraints

- Next.js 16 App Router, React 19, Tailwind v4 (`@theme inline` tokens in `globals.css`), TypeScript. No Framer Motion — motion is deliberately done via lightweight CSS keyframes/utility classes to protect mobile perf and bundle size; this is a considered constraint, not an oversight.
- Existing screens/flows to preserve: Today (video hero + liturgical day detail + parish-scoped services/announcements), Calendar (colored day-type grid + legend), Announcements (editorial article hierarchy), Liturgical Schedule (per-parish weekly schedule + feast notices), Menu (settings, bookmarks, notes, downloads, parish switch), onboarding, parish selector/finder, Readings/Prayers/Fasting/Resources/Events, and various detail/reader screens.
- All content, i18n strings, real liturgical data (2026 calendar, real article text), and mock data must be preserved as-is; only presentation, layout, and interaction may change.
- Undecided: real photography/parish imagery (current screens intentionally fall back to a textured navy placeholder rather than fabricated photos); a real backend; native app wrapper (currently web/PWA only).

## Brand Commitments

- Name: "Parohia" (Romanian for "the parish"), recently rebranded away from a single-diocese identity to be parish-neutral.
- Existing accent palette: deep burgundy (#8f1735), night navy (#071a33), amber/gold (#e0a458) as a sparingly-used sacred/festive accent, plus a small set of desaturated "icon-tempera" hues (forest, slate, clay, teal, violet, plum, rose) used for calendar/category coding.
- Typography: PT Serif for editorial/liturgical content, Inter for UI chrome — an intentional serif/sans split that reads as "printed liturgical text vs. app interface."
- A parish seal/monogram mark (crest-style) is the primary brand mark; current artwork is a placeholder explicitly flagged for replacement with parish-neutral art.
- Sacred visual restraint matters here specifically: this is a religious app, not a lifestyle brand — gold/amber should read as precious and rare (like gilding in an icon), not as a generic accent color flooding the UI.

## Evidence on Hand

- Real 2026 Orthodox liturgical calendar data (Romanian + English), computed fasting periods (Orthodox Pascha-based), real saints/commemorations — `src/lib/calendar-data/`.
- Real catechetical article content ("Treasures of Orthodoxy" series and similar), English-only by policy — `src/lib/articleData.ts`.
- Mock parish data across US + four European countries (Germany, Italy, UK, France), clearly fictional/placeholder (invented clergy names, example addresses) and treated as such — `src/lib/seedData.ts`.
- No real photography exists; do not fabricate parish/clergy photos — preserve the existing "no photo → textured placeholder" fallback pattern rather than inventing imagery.

## Product Principles

1. The liturgical calendar is real and computed, not decorative — never let visual redesign obscure or approximate what tone, fast, or feast day it actually is.
2. One parish, chosen once, colors the whole experience — Today and Schedule are empty/onboarding states until a parish is selected, and that should feel like a deliberate, warm moment, not a gate.
3. Gold is a sacrament, not a theme color — reserve amber/gold for the same restrained, precious role an icon's gilding plays; everyday chrome stays quiet.
4. Bilingual is a first-class constraint, not a toggle bolted on after — every layout must survive Romanian's longer strings and diacritics gracefully.
5. Legible and calm beats trendy — the core audience skews older; motion, contrast, and text scale must serve reading comfort before they serve visual flourish.

## Accessibility & Inclusion

Older and low-vision users are a core audience, not an edge case. The redesign must: support the existing text-size scaling (standard/large/extra-large) without breaking layouts at the largest setting; respect `prefers-reduced-motion` and the app's own "reduce motion" setting by removing motion, not just slowing it; maintain strong text/background contrast even through translucent "glass" surfaces; and never rely on color alone to convey liturgical meaning (calendar day types, fasting status) — shape/label must carry the same information color does.
