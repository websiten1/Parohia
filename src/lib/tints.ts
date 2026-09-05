/**
 * The global tint mapping. §10 of the design brief: a card's color may signal
 * category or importance, but the mapping is established once, globally — one
 * page must never assign a tint to a concept that another page assigns to
 * something unrelated.
 *
 * Tints are soft two-stop washes, not flat saturated blocks, and every one
 * carries an ink dark enough to read on it.
 */
export type TintName = "coral" | "peach" | "blue" | "cyan" | "green" | "lavender" | "rose" | "neutral";

interface TintSpec {
  /** Soft diffused wash — the color reads as light through material. */
  surface: string;
  /** Text and icon color with adequate contrast on that wash. */
  ink: string;
  /** Slightly deeper well for a marker/icon sitting on the tinted surface. */
  marker: string;
}

export const TINTS: Record<TintName, TintSpec> = {
  coral: {
    surface: "linear-gradient(145deg, var(--color-tint-coral) 0%, var(--color-tint-coral-2) 100%)",
    ink: "var(--color-tint-coral-ink)",
    marker: "rgba(125, 52, 35, 0.1)",
  },
  peach: {
    surface: "linear-gradient(145deg, var(--color-tint-peach) 0%, var(--color-tint-peach-2) 100%)",
    ink: "var(--color-tint-peach-ink)",
    marker: "rgba(125, 79, 28, 0.1)",
  },
  blue: {
    surface: "linear-gradient(145deg, var(--color-tint-blue) 0%, var(--color-tint-blue-2) 100%)",
    ink: "var(--color-tint-blue-ink)",
    marker: "rgba(39, 71, 98, 0.1)",
  },
  cyan: {
    surface: "linear-gradient(145deg, var(--color-tint-cyan) 0%, var(--color-tint-cyan-2) 100%)",
    ink: "var(--color-tint-cyan-ink)",
    marker: "rgba(31, 77, 77, 0.1)",
  },
  green: {
    surface: "linear-gradient(145deg, var(--color-tint-green) 0%, var(--color-tint-green-2) 100%)",
    ink: "var(--color-tint-green-ink)",
    marker: "rgba(45, 74, 43, 0.1)",
  },
  lavender: {
    surface: "linear-gradient(145deg, var(--color-tint-lavender) 0%, var(--color-tint-lavender-2) 100%)",
    ink: "var(--color-tint-lavender-ink)",
    marker: "rgba(66, 52, 100, 0.1)",
  },
  rose: {
    surface: "linear-gradient(145deg, var(--color-tint-rose) 0%, var(--color-tint-rose-2) 100%)",
    ink: "var(--color-tint-rose-ink)",
    marker: "rgba(111, 43, 61, 0.1)",
  },
  neutral: {
    surface: "var(--color-surface)",
    ink: "var(--color-text)",
    marker: "var(--color-navy-08)",
  },
};

/**
 * What each tint means, product-wide. Adding a concept means adding it here,
 * not picking a pretty color at the call site.
 */
export const DOMAIN_TINT = {
  service: "blue",
  feast: "peach",
  fast: "green",
  prayer: "lavender",
  reading: "cyan",
  saint: "rose",
  announcement: "coral",
  event: "peach",
  parish: "blue",
} as const satisfies Record<string, TintName>;

export type Domain = keyof typeof DOMAIN_TINT;

/** Article/news categories reuse the same global tints rather than a parallel scheme. */
export const CATEGORY_TINT: Record<string, TintName> = {
  diocesan: "coral",
  parishes: "blue",
  youth: "green",
  culture: "lavender",
  history: "peach",
  spiritual: "cyan",
  world: "rose",
};
