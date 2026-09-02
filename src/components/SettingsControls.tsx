"use client";

import { useId } from "react";
import { motion } from "motion/react";

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`press relative h-[26px] w-[46px] shrink-0 rounded-pill transition-colors duration-150 ${
        checked ? "bg-burgundy" : "bg-navy-14"
      }`}
    >
      <span
        className={`absolute top-[3px] h-[20px] w-[20px] rounded-full bg-white transition-transform duration-150 ${
          checked ? "translate-x-[23px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}

export function SettingsRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-divider py-[14px] last:border-b-0">
      <span className="font-sans text-[14.5px] text-text">{label}</span>
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
  // Scopes the sliding pill's layoutId to this instance, so two SegmentedChoice
  // controls on the same screen (e.g. Appearance's theme + text size) don't
  // animate as if they were one shared element.
  const scope = useId();
  return (
    <div className="glass-thin flex rounded-pill p-[3px]">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className="press relative rounded-pill px-[10px] py-[5px] font-sans text-[12px] font-semibold"
        >
          {value === o.id && (
            <motion.span
              layoutId={`segmented-pill-${scope}`}
              className="absolute inset-0 rounded-pill bg-burgundy"
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
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

export function SettingsSectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-[28px] pb-[6px] font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted first:mt-0">
      {children}
    </p>
  );
}
