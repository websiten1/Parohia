---
name: Parohia
description: A mobile-first Orthodox parish companion — warm luminous grounds, large soft geometry, restrained pastel tints, a deep charcoal navigation vessel, and motion that explains where things went.
colors:
  background: "#faf7f4"
  background-secondary: "#f4efeb"
  background-reading: "#fdfaf5"
  background-elevated: "#fffdfb"
  surface: "#fffdfb"
  surface-soft: "#f3efec"
  surface-active: "#ebe5e0"
  charcoal: "#1f1d1c"
  charcoal-soft: "#2e2b29"
  burgundy: "#8f1735"
  burgundy-pressed: "#73122b"
  navy: "#14212f"
  navy-2: "#1c2c3d"
  text: "#1c1a19"
  text-secondary: "#57524e"
  muted: "#86807b"
  divider: "#ebe5e0"
  tint-coral: "#fbe4dc"
  tint-peach: "#fdeada"
  tint-blue: "#dfeaf6"
  tint-cyan: "#d9ecec"
  tint-green: "#e0edde"
  tint-lavender: "#e8e3f3"
  tint-rose: "#f8e0e6"
  amber: "#d99b4a"
  forest: "#5b8a63"
  slate: "#5b83a8"
typography:
  display:
    fontFamily: "var(--font-pt-serif), Georgia, serif"
    fontWeight: 700
    lineHeight: 1.1
  editorial-body:
    fontFamily: "var(--font-pt-serif), Georgia, serif"
    fontWeight: 400
    lineHeight: 1.55
  ui:
    fontFamily: "-apple-system, BlinkMacSystemFont, var(--font-inter), system-ui"
    fontWeight: 400
rounded:
  compact: "22px"
  search: "24px"
  card: "28px"
  feature: "32px"
  sheet: "36px"
  nav: "33px"
  nav-item: "26px"
  pill: "999px"
spacing:
  outer: "22px"
  section: "40px"
  4: "4px"
  8: "8px"
  12: "12px"
  16: "16px"
  20: "20px"
  24: "24px"
  32: "32px"
  40: "40px"
  48: "48px"
  64: "64px"
components:
  soft-card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
    padding: "22px"
  tinted-feature-card:
    rounded: "{rounded.feature}"
    padding: "24px"
  primary-action:
    backgroundColor: "{colors.burgundy}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    minHeight: "54px"
  field:
    backgroundColor: "{colors.surface-soft}"
    rounded: "{rounded.search}"
    height: "54px"
  video-scrim:
    background: "{gradients.scrim-video}"
  floating-navigation:
    backgroundColor: "{colors.charcoal}"
    rounded: "{rounded.nav}"
    height: "68px"
---

## Overview

A quiet, tactile, spacious product. Refinement comes from proportion and
restraint, not decoration: warm luminous grounds, large rounded geometry,
generous empty space, very few visible containers or outlines, and precise
alignment. Every screen should read as one composition rather than a set of
components assembled from a kit.

The whole app is built from shared tokens (`globals.css`) and shared
primitives (`components/ui/`). A new page should not need to re-invent
margins, backgrounds, headers, buttons, cards, navigation, typography or
motion — those already exist, and a page that consumes them belongs to the
product by default.

## Gradients

Every page carries a soft vertical wash, painted on `body` so it stays
anchored to the viewport (a transformed ancestor would break a fixed
background). Each section owns the light at the top — Calendar violet, News
blue, Schedule cyan, Menu rose, Prayers violet, Fasting green, Resources and
Events peach, priest screens coral — and all of them settle into the same warm
neutral, which is what keeps them one family rather than seven themes. A page
opts in with `<PageContainer wash="…">`. Cards, primary and secondary actions,
circular controls and the navigation vessel each carry their own soft
gradient. `--scrim-video` is the legibility layer for type resting on video.

## Colors

Backgrounds are warm and illuminated, never sterile white, and never a flat
default canvas: `background` for most pages, `background-reading` (warmer)
for prayer and scripture, `background-secondary` where a page needs to sit
back. Deep charcoal anchors the navigation. Burgundy carries primary action —
it belongs to the references' terracotta family and remains the product's
brand identity.

Pastel tints are controlled accents, never a wash over the whole app. Each is
a soft two-stop gradient with an ink dark enough to read on it, and the
category→tint mapping lives once in `lib/tints.ts` so a tint means the same
thing on every screen. Never assign a tint at a call site.

## Typography

PT Serif carries display and editorial content — dates, saint names, titles,
liturgical text, section headings. The system sans stack (real SF Pro on Apple
devices) carries UI chrome. Hierarchy comes from the contrast between Regular,
Medium and Semibold plus scale, never from heavy weights everywhere. Reading
content runs 1.35–1.55 line height.

## Layout

Mobile-first, 390×844 reference, capped at 402px (`.app-frame`). Horizontal
page margin is `spacing.outer` (22px); sections are separated by 40px of space
rather than rules. Every scrollable page uses `.pb-tabbar`, which reserves the
floating navigation's full height plus its gap so the last card always clears
it.

## Elevation & Depth

Three levels only, defined globally: `elev-subtle`, `elev-floating`,
`elev-temporary`. All are large, diffuse and low-opacity. Most components
carry no shadow at all and separate by tone instead. Never invent a shadow at
a call site.

## Shapes

Radius scales with the surface: compact controls 22px, search and fields 24px,
standard cards 28px, feature cards 32px, sheets 36px, the navigation vessel
33px, and full capsules for buttons. A nested surface sits one step below its
container.

## Components

- **`PageContainer` / `PageBody`** — page ground and margins. `tone` picks the
  background family.
- **`SoftCard`** — a soft surface, no stroke, 28px radius.
- **`TintedFeatureCard` / `TintMarker`** — a moment of hierarchy; tint comes
  from `DOMAIN_TINT`, never chosen ad hoc.
- **`SectionHeader`** — a real serif heading. Never a tracked-out kicker.
- **`ContentRow` / `ChevronRow`** — list rows on the background, 64px targets,
  inset dividers only where genuinely needed.
- **`LargePageHeader` / `AppHeader` / `CircularActionButton`** — editorial
  titles and independent circular controls, never a welded toolbar.
- **`PrimaryAction` / `SecondaryAction` / `QuietAction` / `Field` /
  `SearchSurface`** — actions and inputs as soft surfaces.
- **`EmptyState` / `InlineErrorCard` / `LoadingPlaceholder`** — states that
  belong to the system rather than looking like failures.
- **`BottomTabBar`** — the signature: a stable dark vessel containing one
  moving light selection object.

## Motion

One family, from `--motion-*`: press 100ms, micro 220ms, standard 300ms,
navigation 380ms, sheet 440ms, easing out smoothly with no elastic curves.
Motion should answer what changed, where it moved and why. Every Motion usage
branches on `useReducedMotion()`, replacing travel and shared geometry with
short fades.

## Do's and Don'ts

- **Don't** put a kicker or eyebrow above a heading. This is an outright ban;
  the heading carries its own weight, and metadata goes in a caption after it.
- **Don't** use Unicode glyphs or emoji as icons. Icons are drawn, one stroke
  weight, from `components/icons.tsx`.
- **Don't** outline cards, inputs or buttons by default — separate by tone.
  A colored `border-left` as a category accent is banned.
- **Don't** let the calendar depend on color alone: day type is carried by a
  marker whose shape differs as well as its hue.
- **Do** keep the single filled disc in the calendar grid meaning "selected"
  and nothing else.
- **Do** reserve tints for genuine hierarchy, and keep gold rare and small —
  it is a sacrament here, not a theme color.
- **Do** give sacred content authority through space rather than ornament.
