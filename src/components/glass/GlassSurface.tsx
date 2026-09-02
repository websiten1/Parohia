import type { ElementType, ReactNode } from "react";

export type GlassTier = "thin" | "regular" | "thick";
export type GlassTone = "light" | "navy";
export type GlassTint = "none" | "burgundy" | "amber";
export type GlassRadius = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "pill";

const RADIUS_CLASS: Record<GlassRadius, string> = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
  pill: "rounded-pill",
};

function glassClassName(tier: GlassTier, tone: GlassTone, tint: GlassTint, radius: GlassRadius, className?: string) {
  const base = tone === "navy" ? `glass-navy-${tier}` : `glass-${tier}`;
  const tintClass = tint === "none" ? "" : ` glass-tint-${tint}`;
  return `${base}${tintClass} ${RADIUS_CLASS[radius]} ${className ?? ""}`;
}

interface GlassSurfaceProps {
  /** Depth tier: thin (content-adjacent chrome), regular (floating cards), thick (nav/overlays). */
  tier?: GlassTier;
  /** Which background the glass sits over — light page vs. the dark navy hero. */
  tone?: GlassTone;
  /** A hairline wash of brand color riding inside the material, for selected/active states. */
  tint?: GlassTint;
  radius?: GlassRadius;
  as?: ElementType;
  className?: string;
  children?: ReactNode;
  [key: string]: unknown;
}

/**
 * The base Liquid Glass surface: a real translucent material (blur + saturate
 * + soft shadow + top-edge highlight), never a flat tinted rectangle. Compose
 * this instead of hand-rolling `backdrop-blur` + `bg-white/60` per component,
 * so every glass surface in the app shares the same optical behavior.
 */
export function GlassSurface({
  tier = "regular",
  tone = "light",
  tint = "none",
  radius = "lg",
  as: Component = "div",
  className,
  children,
  ...rest
}: GlassSurfaceProps) {
  return (
    <Component className={glassClassName(tier, tone, tint, radius, className)} {...rest}>
      {children}
    </Component>
  );
}
