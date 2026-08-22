"use client";

import { useCallback, useEffect, useRef } from "react";
import { getLiturgicalDayRange2026 } from "@/lib/calendar-data/liturgicalYear2026";

interface Props {
  selectedDate: string;
  onSelect: (date: string) => void;
  /** "light" (default) is for use on a plain background — navy text, no fill.
   * "dark" is for layering directly over photography/video — translucent
   * navy-glass circles with ivory text, for legibility over moving footage. */
  variant?: "light" | "dark";
}

const WINDOW_BEFORE = 10;
const WINDOW_AFTER = 10;
const CIRCLE_SIZE = 36;

/**
 * Small horizontally-scrollable strip of date circles, centered on the
 * selected day. Sizing is set via inline style (not just Tailwind arbitrary
 * classes) so the circle geometry can never be lost to a CSS build issue —
 * every button always has an explicit, non-collapsible width/height.
 */
export function LiturgicalDateStrip({ selectedDate, onSelect, variant = "light" }: Props) {
  const days = getLiturgicalDayRange2026(selectedDate, WINDOW_BEFORE, WINDOW_AFTER);
  const selectedRef = useRef<HTMLButtonElement | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const updateProximity = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const scrollerRect = scroller.getBoundingClientRect();
    const centerX = scrollerRect.left + scrollerRect.width / 2;
    scroller.querySelectorAll<HTMLElement>("[data-date-circle]").forEach((circle) => {
      const rect = circle.getBoundingClientRect();
      const itemCenter = rect.left + rect.width / 2;
      const distance = Math.abs(itemCenter - centerX);
      const normalized = Math.min(distance / (scrollerRect.width / 2), 1);
      const scale = 1.04 - normalized * 0.06;
      const opacity = 1 - normalized * 0.28;
      circle.style.transform = `scale(${scale})`;
      circle.style.opacity = String(opacity);
    });
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const onScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(() => {
        updateProximity();
        rafRef.current = null;
      });
    };
    updateProximity();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [updateProximity]);

  useEffect(() => {
    selectedRef.current?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    const id = window.setTimeout(updateProximity, 260);
    return () => window.clearTimeout(id);
  }, [selectedDate, updateProximity]);

  return (
    <div
      ref={scrollerRef}
      className="no-scrollbar flex snap-x snap-mandatory gap-[10px] overflow-x-auto px-outer py-[6px]"
    >
      {days.map((day) => {
        const dayNum = Number(day.date.slice(-2));
        const isSelected = day.date === selectedDate;
        return (
          <button
            key={day.date}
            ref={isSelected ? selectedRef : undefined}
            type="button"
            onClick={() => onSelect(day.date)}
            aria-current={isSelected ? "date" : undefined}
            className="press flex shrink-0 snap-center flex-col items-center gap-[4px] py-[2px]"
            style={{ width: CIRCLE_SIZE + 8 }}
          >
            <span
              data-date-circle
              className={`flex items-center justify-center rounded-full font-sans text-[14px] transition-[transform,background-color,color] duration-[220ms] ease-out ${
                isSelected
                  ? "bg-burgundy font-semibold text-white"
                  : variant === "dark"
                    ? "bg-white/12 text-white/90 backdrop-blur-[2px]"
                    : "text-navy"
              }`}
              style={{
                width: CIRCLE_SIZE,
                height: CIRCLE_SIZE,
                transform: isSelected ? "scale(1.04)" : undefined,
              }}
            >
              {dayNum}
            </span>
            <span
              className={`h-[4px] w-[4px] rounded-full ${
                day.isMajorFeast
                  ? isSelected
                    ? "bg-burgundy"
                    : variant === "dark"
                      ? "bg-white/70"
                      : "bg-burgundy/60"
                  : "bg-transparent"
              }`}
              aria-hidden="true"
            />
          </button>
        );
      })}
    </div>
  );
}
