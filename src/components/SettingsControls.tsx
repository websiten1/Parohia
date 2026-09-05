"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * Native switch behaviour in the app's own tonal palette.
 *
 * `left-0` is load-bearing: without it the knob falls back to its static
 * position, which the button's centered text-align puts at the middle of the
 * track — pushing the knob off the right edge in both states.
 */
export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`press relative h-[31px] w-[52px] shrink-0 rounded-pill transition-colors duration-200 ${
        checked ? "bg-charcoal" : "bg-navy-14"
      }`}
    >
      <span
        className={`elev-subtle absolute left-0 top-[3px] h-[25px] w-[25px] rounded-full bg-white transition-transform duration-200 ${
          checked ? "translate-x-[24px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}

/** A settings row: generous touch height, no rule — grouped by space instead. (§18, §32) */
export function SettingsRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-[60px] items-center justify-between gap-[16px] py-[10px]">
      <span className="font-sans text-[16.5px] text-text">{label}</span>
      {children}
    </div>
  );
}

export function SegmentedChoice<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  // Scopes the sliding pill to this instance, so two controls on one screen
  // don't animate as if they were the same element.
  const scope = useId();
  const reduceMotion = useReducedMotion();
  return (
    <div className="flex shrink-0 rounded-pill bg-surface-soft p-[4px]">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          aria-pressed={value === o.id}
          className="press relative min-h-[36px] rounded-pill px-[14px] font-sans text-[14px] font-semibold"
        >
          {value === o.id && (
            <motion.span
              layoutId={`segmented-pill-${scope}`}
              className="absolute inset-0 rounded-pill bg-charcoal"
              transition={reduceMotion ? { duration: 0.12 } : { type: "spring", duration: 0.38, bounce: 0.04 }}
            />
          )}
          <span className={`relative z-10 transition-colors duration-150 ${value === o.id ? "text-white" : "text-muted"}`}>
            {o.label}
          </span>
        </button>
      ))}
    </div>
  );
}

/** A real section heading, in the same voice the rest of the app uses. */
export function SettingsSectionLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-[40px] pb-[6px] font-serif text-[22px] font-bold text-text first:mt-0">{children}</h2>;
}
