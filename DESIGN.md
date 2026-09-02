---
name: Parohia
description: Apple Liquid Glass redesign of a mobile-first Orthodox parish companion app — translucent material, capsule controls, spring motion, restrained brand color.
colors:
  background: "#fafaf8"
  surface: "#ffffff"
  navy: "#071a33"
  navy-2: "#0a2444"
  burgundy: "#8f1735"
  burgundy-pressed: "#73122b"
  text: "#111827"
  muted: "#68707c"
  divider: "#e6e8eb"
  soft-surface: "#f1f4f7"
  amber: "#e0a458"
  forest: "#60796a"
  violet: "#756681"
  rose: "#b87982"
  slate: "#617a98"
  clay: "#a66d5a"
  teal: "#557e80"
  plum: "#765568"
typography:
  display:
    fontFamily: "var(--font-pt-serif), Georgia, serif"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.01em to -0.02em at largest sizes"
  editorial-body:
    fontFamily: "var(--font-pt-serif), Georgia, serif"
    fontWeight: 400
  ui:
    fontFamily: "-apple-system, BlinkMacSystemFont, var(--font-inter), system-ui"
    fontWeight: 400
rounded:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "18px"
  xl: "20px"
  2xl: "28px"
  3xl: "36px"
  pill: "999px"
spacing:
  4: "4px"
  8: "8px"
  12: "12px"
  16: "16px"
  20: "20px"
  24: "24px"
  28: "28px"
  32: "32px"
  outer: "20px"
components:
  glass-thin:
    backgroundColor: "rgba(255,255,255,0.46)"
    rounded: "{rounded.lg}"
  glass-regular:
    backgroundColor: "rgba(255,255,255,0.66)"
    rounded: "{rounded.lg}"
  glass-thick:
    backgroundColor: "rgba(255,255,255,0.82)"
    rounded: "{rounded.pill}"
  button-primary:
    backgroundColor: "rgba(143,23,53,0.86)"
    textColor: "#fdfaf3"
    rounded: "{rounded.pill}"
    padding: "13px 22px"
---

## Overview

Parohia is being redesigned screen-by-screen into an Apple Liquid Glass language: real translucent material (blur + saturate + soft shadow + top-edge highlight, never flat tinted rectangles), continuous rounded corners scaling from hairline (8px) to sheet-scale (36px) to full pills/circles, and spring-based motion via the `motion` library. Brand identity (burgundy, navy, amber, PT Serif display type) is preserved and carried *through* the glass system as tinting, not replaced by it.

**Status: foundation + 5 flagship screens complete, ~30 routes pending.** Migrated: the global nav shell (`BottomTabBar`, `AppShell`), Today, Calendar, Menu, and the onboarding flow (welcome, features, parish selector, confirm). Everything else (Announcements, Program Liturgic, Readings/Prayers/Fasting/Resources/Events, all detail/reader screens, Settings, Parish Finder, Notifications) still runs the pre-glass visual system and should be migrated using this file as the reference, screen by screen, reusing `src/components/glass/*` rather than hand-rolling new translucent surfaces.

## Colors

Brand colors are unchanged from the pre-glass system — burgundy carries primary actions and selection state, amber is reserved for rare, precious accents (a single small dot, a thin ring, a tint wash on one prominent card — never a flooded surface), navy is the "sacred dark" hero/header tone. The secondary editorial palette (forest/violet/rose/slate/clay/teal/plum) exists only for calendar day-type and article-category coding — never as a primary surface color.

Glass tints (`glass-tint-burgundy-strong`, `glass-tint-amber`) ride *inside* a glass material class, composited over its blur — they are not standalone background colors.

## Typography

Display and editorial content (dates, saint names, article titles, liturgical text) uses PT Serif — this is a deliberate brand decision, not a system-font fallback, and should never be swapped for a sans face regardless of how "Apple-like" that might look elsewhere. UI chrome (labels, buttons, nav, form controls) uses the system font stack (`-apple-system, BlinkMacSystemFont, Inter`) — on Apple devices this resolves to real SF Pro; Inter (metrics-compatible) carries every other platform. Never source or fake an SF Pro webfont file.

## Layout

Mobile-first, 390×844 reference artboard, hard-capped at 402px on any wider viewport (`.app-frame`). Generous vertical rhythm: sub-fold content blocks on Today use 26–28px gaps; grouped list sections in Menu use 32px between groups. Content lives directly on the page background by default — reach for a glass surface only when something is genuinely floating over other content or is a distinct, importance-warranting data group (a settings list, a schedule's time table), never as a default per-item container.

## Elevation & Depth

Three material tiers, each with its own blur radius, fill opacity, and shadow (defined in `globals.css` as `.glass-thin/-regular/-thick` and `.glass-navy-thin/-regular/-thick`):

- **thin** — content-adjacent chrome sitting almost on the page: quiet section wells, inline search fields, popover-style disclosures (Calendar's legend).
- **regular** — floating cards that read as elevated but not top-level: the Menu "your parish" card.
- **thick** — the topmost layer, must stay legible over anything scrolling beneath it: the floating bottom tab bar, bottom sheets (`GlassSheet`).

Not every component is glass — flooding the interface with translucency erases the hierarchy it's meant to create. Plain content-on-background and glass surfaces should coexist on every screen.

## Shapes

Radius scales with importance and size: hairline controls and small badges (8–12px), standard cards (16–18px), prominent cards and thumbnails (20–28px), sheets and the menu's rising panel (36px), buttons/pills/nav (999px, full capsule). Nested elements sit one step below their container's radius. No true CSS squircle/continuous-corner masking is used (not worth the complexity at this scale) — generous `border-radius` values stand in for it, matching how most production Apple-style web UIs (not native apps) actually ship this.

## Components

- **`GlassSurface`** (`src/components/glass/GlassSurface.tsx`) — the base material primitive. Props: `tier` (thin/regular/thick), `tone` (light/navy), `tint` (none/burgundy/amber), `radius`. Compose this instead of hand-rolling `backdrop-blur` + `bg-white/60`.
- **`GlassButton`** — capsule button, three variants (primary = strong burgundy glass tint + white text; secondary = thin glass; quiet = plain text), spring `whileTap` compression via `motion`.
- **`GlassSheet`** — bottom sheet: backdrop dims+blurs, sheet rises with a spring from the bottom edge. Built but not yet used by any screen — the next screen that needs a modal/sheet interaction should reach for this rather than a plain fixed-position div.
- **Shared-layout selection indicators** — the tab bar's active-tab pill, Calendar's selected-day disc, and the parish country-filter pill all use Motion's `layoutId` so switching selection reads as one material sliding into place, not a color swap. Reuse this pattern for any new segmented/tab/filter control.
- **`Reveal`** (pre-existing, kept) — scroll-triggered fade/rise wrapper; respects `prefers-reduced-motion` by showing content immediately with no motion.

## Do's and Don'ts

- **Do** let headings carry their own weight. **Don't** add a small-caps kicker/eyebrow label above a headline to announce its category — craft-floor bans this outright, no exception. If a piece of metadata (a date, a status) is genuinely needed, put it as a caption *after* the heading, not before it.
- **Do** reserve amber for one accent per screen at most (a dot, a thin ring, one card's tint). **Don't** let it become a repeated bullet/marker color across a whole list — it stops reading as precious the moment it's everywhere.
- **Don't** use a colored `border-left`/`border-right` on any card or list row as a category accent — also banned outright; use spacing, a small dot, or a glass tint instead.
- **Do** use Motion (`motion/react`) springs for anything that should feel physically responsive (buttons, nav, shared-element selection). **Don't** reach for elastic/bounce CSS easing curves (control points >1) — Apple's deceleration is smooth, never a boing.
- **Do** keep `prefers-reduced-motion` handling on every new Motion usage (`useReducedMotion()` and branch, as done throughout).
- **Don't** migrate a screen by only swapping colors/radii — check it against this file's component list first; most screens will want at least one real `GlassSurface`/`GlassButton` usage, not just cosmetic tweaks.
