"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { useEffect } from "react";

interface GlassSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Accessible label for the sheet's dialog role. */
  label: string;
}

/**
 * A floating Liquid Glass sheet rising from the bottom edge, with the page
 * behind it dimming and softly blurring rather than being hidden outright —
 * establishing where the sheet came from and where it returns to on close.
 */
export function GlassSheet({ open, onClose, children, label }: GlassSheetProps) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-navy/25 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.12 : 0.22 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={label}
            className="glass-thick fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[402px] rounded-t-3xl px-outer pb-[max(env(safe-area-inset-bottom),20px)] pt-[10px]"
            initial={reduceMotion ? { opacity: 0 } : { y: "100%" }}
            animate={reduceMotion ? { opacity: 1 } : { y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
          >
            <div className="mx-auto mb-[14px] h-[4px] w-[36px] rounded-pill bg-navy/20" aria-hidden="true" />
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
