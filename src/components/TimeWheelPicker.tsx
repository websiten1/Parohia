"use client";

import { WheelPicker } from "@/components/WheelPicker";

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0"));
const MERIDIEMS = ["AM", "PM"] as const;

export interface TimeValue {
  hour: string; // "1".."12"
  minute: string; // "00".."55", step 5
  meridiem: "AM" | "PM";
}

export function formatTimeValue(t: TimeValue): string {
  return `${t.hour}:${t.minute} ${t.meridiem}`;
}

export function defaultTimeValue(hour = "10", minute = "00", meridiem: "AM" | "PM" = "AM"): TimeValue {
  return { hour, minute, meridiem };
}

interface TimeWheelPickerProps {
  value: TimeValue;
  onChange: (value: TimeValue) => void;
  "aria-label": string;
}

/**
 * Three WheelPicker columns (hour / minute / AM-PM) sharing one continuous
 * focus band — the same wheel language as the state/city onboarding picker,
 * reused for priest schedule entry rather than a native <select> or a
 * one-off time widget.
 */
export function TimeWheelPicker({ value, onChange, ...aria }: TimeWheelPickerProps) {
  return (
    <div className="flex items-stretch justify-center gap-[2px]" {...aria}>
      <div className="w-[60px]">
        <WheelPicker options={HOURS} value={value.hour} onChange={(hour) => onChange({ ...value, hour })} aria-label="Hour" />
      </div>
      <div className="flex items-center font-serif text-[20px] font-bold text-muted" style={{ height: 44 * 5 }}>
        :
      </div>
      <div className="w-[60px]">
        <WheelPicker options={MINUTES} value={value.minute} onChange={(minute) => onChange({ ...value, minute })} aria-label="Minute" />
      </div>
      <div className="w-[68px]">
        <WheelPicker
          options={[...MERIDIEMS]}
          value={value.meridiem}
          onChange={(meridiem) => onChange({ ...value, meridiem })}
          aria-label="AM or PM"
        />
      </div>
    </div>
  );
}
