"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ChevronRightIcon } from "./icons";

interface ChevronRowProps {
  href: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
  divider?: boolean;
}

/**
 * A list row that lives directly on the page background rather than inside
 * another card. Generous touch height, separated by space; the divider — when
 * one is genuinely needed — insets past the leading element instead of
 * stretching edge to edge. (§12)
 */
export function ChevronRow({ href, title, subtitle, icon, trailing, divider = true }: ChevronRowProps) {
  const reduceMotion = useReducedMotion();
  return (
    <Link href={href} className="block">
      <motion.div
        whileTap={reduceMotion ? undefined : { scale: 0.99 }}
        transition={{ type: "spring", stiffness: 520, damping: 34 }}
        className="flex min-h-[64px] items-center gap-[14px] py-[14px]"
      >
        {icon && (
          <span className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-surface-soft text-text">
            {icon}
          </span>
        )}
        <span className={`flex min-w-0 flex-1 items-center gap-[14px] ${divider ? "border-b border-divider/60 pb-[14px]" : ""}`}>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-sans text-[16.5px] font-medium text-text">{title}</span>
            {subtitle && <span className="mt-[3px] block truncate font-sans text-[14px] text-muted">{subtitle}</span>}
          </span>
          {trailing}
          <ChevronRightIcon className="h-[16px] w-[16px] shrink-0 text-muted/60" />
        </span>
      </motion.div>
    </Link>
  );
}
