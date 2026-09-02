"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";

interface WheelPickerProps<T extends string> {
  options: T[];
  value: T;
  onChange: (value: T) => void;
  /** Height of one row in px. */
  itemHeight?: number;
  /** How many rows are visible at once — must be odd so one row sits exactly centered. */
  visibleCount?: number;
  renderLabel?: (option: T) => string;
  "aria-label": string;
}

/**
 * The app's signature selection interaction: a vertical, momentum-scrolled
 * wheel where the centered row is the value. Built on native CSS scroll-snap
 * (real touch/trackpad inertia and precise snapping come from the browser,
 * not a hand-rolled physics simulation) with the surrounding rows fading and
 * shrinking by distance from center. Reused for state, city, and time — one
 * interaction language across onboarding and priest scheduling.
 */
export function WheelPicker<T extends string>({
  options,
  value,
  onChange,
  itemHeight = 44,
  visibleCount = 5,
  renderLabel,
  ...aria
}: WheelPickerProps<T>) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const padCount = Math.floor(visibleCount / 2);
  const containerHeight = itemHeight * visibleCount;
  const lastReportedIndex = useRef<number>(options.indexOf(value));

  const label = useCallback((opt: T) => (renderLabel ? renderLabel(opt) : opt), [renderLabel]);

  const applyRowStyles = useCallback(
    (scrollTop: number) => {
      const scroller = scrollerRef.current;
      if (!scroller) return;
      const centerFloat = scrollTop / itemHeight;
      scroller.querySelectorAll<HTMLElement>("[data-wheel-row]").forEach((row) => {
        const i = Number(row.dataset.index);
        const distance = Math.abs(i - centerFloat);
        const clamped = Math.min(distance, 2.4);
        const scale = 1 - clamped * 0.16;
        const opacity = Math.max(1 - clamped * 0.42, 0.12);
        row.style.transform = `scale(${scale})`;
        row.style.opacity = String(opacity);
        row.setAttribute("aria-selected", distance < 0.5 ? "true" : "false");
      });
    },
    [itemHeight]
  );

  const scrollToIndex = useCallback(
    (index: number, smooth: boolean) => {
      scrollerRef.current?.scrollTo({ top: index * itemHeight, behavior: smooth ? "smooth" : "auto" });
    },
    [itemHeight]
  );

  const handleScroll = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => applyRowStyles(scroller.scrollTop));

    if (settleTimer.current) clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => {
      const nearest = Math.round(scroller.scrollTop / itemHeight);
      const clamped = Math.max(0, Math.min(options.length - 1, nearest));
      if (clamped !== lastReportedIndex.current) {
        lastReportedIndex.current = clamped;
        onChange(options[clamped]);
      }
    }, 110);
  }, [applyRowStyles, itemHeight, onChange, options]);

  // Reset scroll position when the value changes from outside (e.g. state
  // change resetting the city list) or on mount, without an animated jump.
  useEffect(() => {
    const index = Math.max(0, options.indexOf(value));
    lastReportedIndex.current = index;
    scrollToIndex(index, false);
    requestAnimationFrame(() => applyRowStyles(index * itemHeight));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const currentIndex = Math.max(0, options.indexOf(value));
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = Math.min(options.length - 1, currentIndex + 1);
        lastReportedIndex.current = next;
        scrollToIndex(next, true);
        onChange(options[next]);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = Math.max(0, currentIndex - 1);
        lastReportedIndex.current = prev;
        scrollToIndex(prev, true);
        onChange(options[prev]);
      }
    },
    [onChange, options, scrollToIndex, value]
  );

  const padding = useMemo(() => itemHeight * padCount, [itemHeight, padCount]);

  return (
    <div className="relative" style={{ height: containerHeight }} {...aria} role="listbox" tabIndex={0} onKeyDown={handleKeyDown}>
      {/* Focus band: two hairlines around the centered row — not a filled pill. */}
      <div
        className="pointer-events-none absolute inset-x-0 border-y border-divider"
        style={{ top: padCount * itemHeight, height: itemHeight }}
        aria-hidden="true"
      />
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="no-scrollbar h-full overflow-y-auto"
        style={{ scrollSnapType: "y mandatory" }}
      >
        <div style={{ height: padding }} aria-hidden="true" />
        {options.map((opt, i) => (
          <div
            key={opt}
            data-wheel-row
            data-index={i}
            role="option"
            aria-selected={opt === value}
            onClick={() => {
              lastReportedIndex.current = i;
              scrollToIndex(i, true);
              onChange(opt);
            }}
            className="flex items-center justify-center font-serif text-[20px] font-bold text-text"
            style={{ height: itemHeight, scrollSnapAlign: "center" }}
          >
            {label(opt)}
          </div>
        ))}
        <div style={{ height: padding }} aria-hidden="true" />
      </div>
    </div>
  );
}
