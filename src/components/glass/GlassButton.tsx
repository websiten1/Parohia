"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "quiet";
type Size = "md" | "sm";

interface GlassButtonProps {
  variant?: Variant;
  size?: Size;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}

const VARIANT_CLASS: Record<Variant, string> = {
  primary: "glass-regular glass-tint-burgundy-strong font-semibold",
  secondary: "glass-thin text-navy font-medium",
  quiet: "bg-transparent text-navy/70 font-medium",
};

const SIZE_CLASS: Record<Size, string> = {
  md: "px-[22px] py-[13px] text-[15px]",
  sm: "px-[16px] py-[9px] text-[13.5px]",
};

/**
 * A tactile capsule button: filled/tinted glass for primary actions, quiet
 * glass for secondary, plain text for tertiary. Every variant compresses and
 * settles with a real spring on press rather than snapping — the interface
 * should feel physically responsive, not just clickable.
 */
export function GlassButton({
  variant = "primary",
  size = "md",
  onClick,
  type = "button",
  disabled,
  className,
  children,
  ...aria
}: GlassButtonProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={reduceMotion || disabled ? undefined : { scale: 0.96 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`inline-flex items-center justify-center rounded-pill text-center transition-opacity duration-150 disabled:opacity-40 ${VARIANT_CLASS[variant]} ${SIZE_CLASS[size]} ${className ?? ""}`}
      {...aria}
    >
      {children}
    </motion.button>
  );
}
