"use client";

import { motion, useReducedMotion } from "motion/react";
import { TINTS, type TintName } from "@/lib/tints";

/* ==========================================================================
 * Page scaffolding (§03, §07, §42)
 * ======================================================================== */

type BackgroundTone = "primary" | "secondary" | "reading" | "elevated";

const BACKGROUND: Record<BackgroundTone, string> = {
  primary: "bg-background",
  secondary: "bg-background-secondary",
  reading: "bg-background-reading",
  elevated: "bg-background-elevated",
};

/**
 * Every page sits on a designed background rather than a default white
 * canvas, and it extends beneath the safe areas so the screen reads as one
 * continuous surface from top edge to bottom edge.
 */
export function PageContainer({
  children,
  tone = "primary",
  className,
}: {
  children: React.ReactNode;
  tone?: BackgroundTone;
  className?: string;
}) {
  return <div className={`flex min-h-dvh flex-col ${BACKGROUND[tone]} ${className ?? ""}`}>{children}</div>;
}

/** Standard horizontal page margin with the floating navigation's clearance. */
export function PageBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <main className={`flex-1 px-outer pb-tabbar ${className ?? ""}`}>{children}</main>;
}

/* ==========================================================================
 * Cards (§09, §10, §11)
 * ======================================================================== */

/**
 * A soft physical surface, not a bordered container. No stroke, generous
 * padding, and shadow only where separation genuinely needs it — most of the
 * time tone alone does the work.
 */
export function SoftCard({
  children,
  className,
  elevated = false,
}: {
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
}) {
  return (
    <div
      className={`rounded-card bg-surface p-[22px] ${elevated ? "elev-subtle" : ""} ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

/**
 * A moment of hierarchy. The color is diffused through the material as a soft
 * two-stop wash — never a flat saturated block — and the tint is chosen from
 * the global domain mapping so it means the same thing everywhere.
 */
export function TintedFeatureCard({
  tint,
  children,
  className,
  onClick,
  ariaLabel,
}: {
  tint: TintName;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  const spec = TINTS[tint];
  const reduceMotion = useReducedMotion();
  const Comp = onClick ? motion.button : motion.div;

  return (
    <Comp
      {...(onClick ? { type: "button" as const, onClick, "aria-label": ariaLabel } : {})}
      whileTap={onClick && !reduceMotion ? { scale: 0.985 } : undefined}
      transition={{ type: "spring", stiffness: 520, damping: 34 }}
      style={{ background: spec.surface, color: spec.ink }}
      className={`w-full rounded-feature p-[24px] text-left ${className ?? ""}`}
    >
      {children}
    </Comp>
  );
}

/**
 * The compact circular well used for a marker or trailing action inside a
 * tinted card — inherits the card's ink rather than introducing a new color.
 */
export function TintMarker({ tint, children }: { tint: TintName; children: React.ReactNode }) {
  return (
    <span
      style={{ background: TINTS[tint].marker, color: TINTS[tint].ink }}
      className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full"
    >
      {children}
    </span>
  );
}

/* ==========================================================================
 * Structure (§11, §12)
 * ======================================================================== */

/** A quiet grouping label. Never a tracked-out kicker announcing a headline. */
export function SectionHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`font-serif text-[22px] font-bold leading-[1.25] text-text ${className ?? ""}`}>{children}</h2>;
}

/**
 * A list row that lives directly on the background. Generous touch height,
 * separated by space rather than edge-to-edge rules; where a divider is
 * genuinely needed it insets past the leading element.
 */
export function ContentRow({
  leading,
  title,
  subtitle,
  trailing,
  onClick,
  divider = false,
}: {
  leading?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  trailing?: React.ReactNode;
  onClick?: () => void;
  divider?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const Comp = onClick ? motion.button : motion.div;
  return (
    <Comp
      {...(onClick ? { type: "button" as const, onClick } : {})}
      whileTap={onClick && !reduceMotion ? { scale: 0.99 } : undefined}
      transition={{ type: "spring", stiffness: 520, damping: 34 }}
      className={`flex w-full min-h-[64px] items-center gap-[14px] py-[14px] text-left ${
        divider ? "border-b border-divider/70" : ""
      }`}
    >
      {leading}
      <span className="min-w-0 flex-1">
        <span className="block font-sans text-[16px] font-medium leading-[1.35] text-text">{title}</span>
        {subtitle && <span className="mt-[3px] block font-sans text-[14px] leading-[1.4] text-muted">{subtitle}</span>}
      </span>
      {trailing}
    </Comp>
  );
}
