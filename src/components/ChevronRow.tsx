"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ChevronRightIcon } from "./icons";

interface ChevronRowProps {
  href: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
  divider?: boolean;
}

/** Full-width tappable list row: optional leading icon, title/subtitle, trailing chevron. */
export function ChevronRow({ href, title, subtitle, icon, trailing, divider = true }: ChevronRowProps) {
  return (
    <Link href={href} className="block">
      <motion.div
        whileTap={{ backgroundColor: "rgba(7,26,51,0.05)" }}
        transition={{ duration: 0.12 }}
        className={`flex min-h-[44px] items-center gap-[14px] rounded-md px-[4px] py-[14px] ${divider ? "border-b border-divider/70" : ""}`}
      >
        {icon && (
          <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-navy-08 text-navy">{icon}</span>
        )}
        <span className="min-w-0 flex-1">
          <span className="block truncate font-sans text-[15px] font-medium text-text">{title}</span>
          {subtitle && <span className="mt-[2px] block truncate font-sans text-[13px] text-muted">{subtitle}</span>}
        </span>
        {trailing}
        <ChevronRightIcon className="h-[16px] w-[16px] shrink-0 text-muted/70" />
      </motion.div>
    </Link>
  );
}
