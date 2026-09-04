"use client";

import { motion } from "motion/react";

/**
 * How far through a multi-step flow the visitor is. Segments rather than a
 * single bar, because the count itself is the reassurance — it says how many
 * questions are left, which is the thing people actually want to know before
 * committing to a flow.
 */
export function StepProgress({ total, current }: { total: number; current: number }) {
  return (
    <div
      className="flex flex-1 items-center gap-[6px]"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current + 1}
    >
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className="h-[3px] flex-1 overflow-hidden rounded-pill bg-navy/10">
          <motion.span
            className="block h-full rounded-pill bg-burgundy"
            initial={false}
            animate={{ scaleX: i <= current ? 1 : 0 }}
            style={{ transformOrigin: "left" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </span>
      ))}
    </div>
  );
}
