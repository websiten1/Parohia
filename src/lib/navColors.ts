import type { TintName } from "@/lib/tints";

/**
 * Each destination owns a colour, so the navigation is recognisable by hue
 * before the label is read — and the selected capsule carries that colour
 * rather than being the same light slab every time.
 *
 * These deliberately match the page washes: arriving on Calendar turns the
 * capsule violet and the page's gradient violet at the same moment.
 */
export const NAV_TINT = {
  calendar: "lavender",
  news: "blue",
  today: "peach",
  history: "cyan",
  menu: "rose",
} as const satisfies Record<string, TintName>;
