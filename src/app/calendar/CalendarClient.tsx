"use client";

import { useMemo, useRef, useState } from "react";
import { LiturgicalDateStrip } from "@/components/LiturgicalDateStrip";
import { LiturgicalDayDetail } from "@/components/LiturgicalDayDetail";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { getLiturgicalDay2026, getMonthDays2026, REFERENCE_DATE_2026 } from "@/lib/calendar-data/liturgicalYear2026";
import { WEEKDAY_INITIAL, WEEKDAY_INITIAL_RO } from "@/lib/seedData";

const [REF_YEAR, REF_MONTH] = REFERENCE_DATE_2026.split("-").map(Number);
const SWIPE_THRESHOLD = 50;

export function CalendarClient() {
  const { language } = useTranslation();
  const [year, setYear] = useState(REF_YEAR);
  const [month, setMonth] = useState(REF_MONTH);
  const [selected, setSelected] = useState<string>(REFERENCE_DATE_2026);
  const touchStartX = useRef<number | null>(null);

  const days = useMemo(() => getMonthDays2026(year, month), [year, month]);
  const blanks = useMemo(() => new Date(year, month - 1, 1).getDay(), [year, month]);
  const weekdayInitials = language === "ro" ? WEEKDAY_INITIAL_RO : WEEKDAY_INITIAL;
  const monthYearLabel = new Date(year, month - 1, 1).toLocaleDateString(language === "ro" ? "ro-RO" : "en-US", {
    month: "long",
    year: "numeric",
  });
  const selectedDay = getLiturgicalDay2026(selected);

  function goToMonth(delta: number) {
    let newMonth = month + delta;
    let newYear = year;
    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    } else if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }
    setYear(newYear);
    setMonth(newMonth);
    setSelected(`${newYear}-${String(newMonth).padStart(2, "0")}-01`);
  }

  function selectDate(date: string) {
    setSelected(date);
    const [y, m] = date.split("-").map(Number);
    if (y !== year || m !== month) {
      setYear(y);
      setMonth(m);
    }
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > SWIPE_THRESHOLD) goToMonth(-1);
    else if (delta < -SWIPE_THRESHOLD) goToMonth(1);
    touchStartX.current = null;
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-[30px] font-bold capitalize text-text">{monthYearLabel}</h1>
        <div className="flex gap-[4px]">
          <button
            type="button"
            onClick={() => goToMonth(-1)}
            aria-label="Previous month"
            className="press flex h-[36px] w-[36px] items-center justify-center rounded-full text-navy"
          >
            <ChevronLeftIcon className="h-[18px] w-[18px]" />
          </button>
          <button
            type="button"
            onClick={() => goToMonth(1)}
            aria-label="Next month"
            className="press flex h-[36px] w-[36px] items-center justify-center rounded-full text-navy"
          >
            <ChevronRightIcon className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>

      <div className="-mx-outer mt-[14px]">
        <LiturgicalDateStrip selectedDate={selected} onSelect={selectDate} />
      </div>

      <div
        key={`${year}-${month}`}
        className="anim-fade-through mt-[18px] grid grid-cols-7 gap-y-[10px]"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {weekdayInitials.map((w, i) => (
          <span key={i} className="pb-[8px] text-center font-sans text-[12px] font-semibold text-muted">
            {w}
          </span>
        ))}

        {Array.from({ length: blanks }).map((_, i) => (
          <div key={`b-${i}`} />
        ))}

        {days.map((day) => {
          const dayNum = Number(day.date.slice(-2));
          const isSelected = day.date === selected;
          const isSunday = new Date(day.date + "T00:00:00").getDay() === 0;
          const emphasize = day.isMajorFeast || isSunday;
          return (
            <button
              key={day.date}
              type="button"
              onClick={() => setSelected(day.date)}
              aria-current={isSelected ? "date" : undefined}
              className="press flex h-[42px] items-center justify-center"
            >
              <span
                className={`flex h-[34px] w-[34px] items-center justify-center rounded-full font-sans text-[14px] transition-transform duration-[160ms] ${
                  isSelected
                    ? "scale-100 bg-burgundy font-semibold text-white"
                    : emphasize
                      ? "font-semibold text-burgundy"
                      : "text-text"
                }`}
              >
                {dayNum}
              </span>
            </button>
          );
        })}
      </div>

      {selectedDay && (
        <div key={selectedDay.date} className="anim-fade-through mt-[32px] border-t border-divider pt-[24px]">
          <LiturgicalDayDetail day={selectedDay} />
        </div>
      )}
    </>
  );
}
