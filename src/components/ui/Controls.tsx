"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { BackIcon } from "@/components/icons";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

/* ==========================================================================
 * Header controls (§08)
 * ======================================================================== */

/**
 * An independent circular utility control — never welded into a full-width
 * toolbar. Visible surface stays compact while the touch target holds 44px.
 */
export function CircularActionButton({
  onClick,
  href,
  label,
  children,
  tone = "light",
}: {
  onClick?: () => void;
  href?: string;
  label: string;
  children: React.ReactNode;
  tone?: "light" | "onDark";
}) {
  const reduceMotion = useReducedMotion();
  const surface =
    tone === "onDark" ? "bg-white/15 text-white" : "text-text elev-subtle";

  const inner = (
    <motion.span
      whileTap={reduceMotion ? undefined : { scale: 0.96 }}
      transition={{ type: "spring", stiffness: 520, damping: 32 }}
      style={tone === "onDark" ? undefined : { background: "var(--gradient-surface)" }}
      className={`flex h-[44px] w-[44px] items-center justify-center rounded-full ${surface}`}
    >
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <Link href={href} aria-label={label} className="touch-manipulation">
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} aria-label={label} className="touch-manipulation">
      {inner}
    </button>
  );
}

/**
 * Editorial page opening: utility controls first, then the large title
 * standing alone underneath with room to breathe. No kicker above it, no
 * stack of subtitles and badges beneath it.
 */
export function LargePageHeader({
  title,
  caption,
  backHref,
  showBack = false,
  actions,
}: {
  title: string;
  caption?: string;
  backHref?: string;
  showBack?: boolean;
  actions?: React.ReactNode;
}) {
  const router = useRouter();
  const { t } = useTranslation();
  const hasControls = showBack || backHref || actions;

  return (
    <header className="px-outer pt-[max(env(safe-area-inset-top),18px)]">
      {hasControls && (
        <div className="flex items-center justify-between">
          {showBack || backHref ? (
            <CircularActionButton
              label={t("common.back")}
              href={backHref}
              onClick={backHref ? undefined : () => router.back()}
            >
              <BackIcon className="h-[19px] w-[19px]" />
            </CircularActionButton>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-[10px]">{actions}</div>
        </div>
      )}
      <h1 className={`font-serif text-[32px] font-bold leading-[1.1] text-text ${hasControls ? "mt-[22px]" : "mt-[4px]"}`}>
        {title}
      </h1>
      {caption && <p className="mt-[8px] font-sans text-[15px] leading-[1.45] text-muted">{caption}</p>}
    </header>
  );
}

/* ==========================================================================
 * Actions (§14)
 * ======================================================================== */

/**
 * Primary action: a capsule that earns attention through surface contrast and
 * scale, not a heavy outline. Loading resolves inside the same geometry so the
 * button never gets swapped for an unrelated component.
 */
export function PrimaryAction({
  children,
  onClick,
  disabled,
  loading,
  className,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: "button" | "submit";
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      whileTap={disabled || loading || reduceMotion ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 520, damping: 32 }}
      style={disabled || loading ? undefined : { backgroundImage: "var(--gradient-primary-action)" }}
      className={`min-h-[54px] w-full rounded-pill bg-burgundy px-[24px] text-center font-sans text-[16px] font-semibold text-white transition-colors duration-150 disabled:bg-burgundy/45 ${
        className ?? ""
      }`}
    >
      {loading ? <span className="anim-pulse-subtle">{children}</span> : children}
    </motion.button>
  );
}

/** Quieter companion to PrimaryAction — same geometry, receding surface. */
export function SecondaryAction({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 520, damping: 32 }}
      style={{ backgroundImage: "var(--gradient-secondary-action)" }}
      className={`min-h-[50px] w-full rounded-pill px-[24px] text-center font-sans text-[15.5px] font-medium text-text ${
        className ?? ""
      }`}
    >
      {children}
    </motion.button>
  );
}

/* ==========================================================================
 * Search (§13)
 * ======================================================================== */

/**
 * A soft integrated surface rather than a bordered input. Contrast lifts
 * slightly on focus instead of a ring snapping on.
 */
export function SearchSurface({
  value,
  onChange,
  placeholder,
  leading,
  trailing,
  autoFocus,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  autoFocus?: boolean;
}) {
  return (
    <div className="flex h-[52px] items-center gap-[10px] rounded-search bg-surface-soft px-[16px] transition-colors duration-200 focus-within:bg-surface-active">
      {leading}
      <input
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full min-w-0 bg-transparent font-sans text-[15.5px] text-text outline-none placeholder:text-muted"
      />
      {trailing}
    </div>
  );
}

/** Lowest-emphasis action — plain text, still a full 44px touch target. */
export function QuietAction({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`press min-h-[44px] w-full text-center font-sans text-[14.5px] text-muted ${className ?? ""}`}
    >
      {children}
    </button>
  );
}
