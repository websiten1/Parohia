"use client";

import { useMemo, useRef, useState } from "react";
import { LiturgicalDateStrip } from "@/components/LiturgicalDateStrip";
import { LiturgicalDayDetail } from "@/components/LiturgicalDayDetail";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { classifyDay, type TipZi } from "@/lib/calendar-data/dayType";
import { getLiturgicalDay2026, getMonthDays2026, REFERENCE_DATE_2026 } from "@/lib/calendar-data/liturgicalYear2026";
import { WEEKDAY_INITIAL, WEEKDAY_INITIAL_RO } from "@/lib/seedData";
import type { TranslationKey } from "@/lib/i18n/translations";

const [REF_YEAR, REF_MONTH] = REFERENCE_DATE_2026.split("-").map(Number);
const SWIPE_THRESHOLD = 50;

const TIP_ZI_LABEL_KEY: Record<TipZi, TranslationKey> = {
  duminica: "calendar.legend.duminica",
  praznic: "calendar.legend.praznic",
  post: "calendar.legend.post",
  sfant: "calendar.legend.sfant",
  obisnuita: "calendar.legend.obisnuita",
};

const LEGEND_ORDER: TipZi[] = ["duminica", "praznic", "post", "sfant", "obisnuita"];

/** The disc/dot treatment for one calendar day, shared by the month grid cells and the legend swatches. */
function DayMark({ tipZi, dayNum, isToday }: { tipZi: TipZi; dayNum?: number; isToday?: boolean }) {
  const ring = isToday ? "shadow-[0_0_0_2px_var(--color-amber)] anim-ring-pulse" : "";

  if (tipZi === "duminica") {
    return (
      <span className={`flex h-[34px] w-[34px] items-center justify-center rounded-full bg-burgundy font-sans text-[14px] font-semibold text-white ${ring}`}>
        {dayNum}
      </span>
    );
  }
  if (tipZi === "praznic") {
    return (
      <span
        className={`flex h-[34px] w-[34px] items-center justify-center rounded-full bg-amber font-sans text-[14px] font-semibold text-white ${ring}`}
        style={{ boxShadow: isToday ? undefined : "0 0 0 3px var(--color-pale-amber)" }}
      >
        {dayNum}
      </span>
    );
  }
  if (tipZi === "post") {
    return (
      <span className={`flex h-[34px] w-[34px] items-center justify-center rounded-full border-2 border-forest font-sans text-[14px] font-semibold text-forest ${ring}`}>
        {dayNum}
      </span>
    );
  }
  if (tipZi === "sfant") {
    return (
      <span className={`flex h-[34px] w-[34px] flex-col items-center justify-center gap-[2px] rounded-full font-sans text-[14px] text-text ${ring}`}>
        {dayNum}
        <span className="h-[4px] w-[4px] rounded-full bg-slate" aria-hidden="true" />
      </span>
    );
  }
  return (
    <span className={`flex h-[34px] w-[34px] items-center justify-center rounded-full font-sans text-[14px] text-text ${ring}`}>
      {dayNum}
    </span>
  );
}

export function CalendarClient() {
  const { t, language } = useTranslation();
  const [year, setYear] = useState(REF_YEAR);
  const [month, setMonth] = useState(REF_MONTH);
  const [selected, setSelected] = useState<string>(REFERENCE_DATE_2026);
  const [legendOpen, setLegendOpen] = useState(false);
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

        {days.map((day, i) => {
          const dayNum = Number(day.date.slice(-2));
          const isSelected = day.date === selected;
          const isToday = day.date === REFERENCE_DATE_2026;
          const tipZi = classifyDay(day);
          return (
            <button
              key={day.date}
              type="button"
              onClick={() => setSelected(day.date)}
              aria-current={isSelected ? "date" : undefined}
              className="anim-scale-fade-in press flex h-[42px] items-center justify-center"
              style={{ animationDelay: `${Math.min(i, 20) * 12}ms` }}
            >
              {isSelected ? (
                <span className="flex h-[34px] w-[34px] scale-105 items-center justify-center rounded-full bg-burgundy font-sans text-[14px] font-semibold text-white transition-transform duration-[160ms]">
                  {dayNum}
                </span>
              ) : (
                <DayMark tipZi={tipZi} dayNum={dayNum} isToday={isToday} />
              )}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setLegendOpen((v) => !v)}
        className="press mt-[20px] flex w-full items-center justify-between border-t border-divider pt-[14px] text-left"
        aria-expanded={legendOpen}
      >
        <span className="font-sans text-[12.5px] font-medium text-muted">{t("calendar.legendToggle")}</span>
        <ChevronDownIcon
          className={`h-[15px] w-[15px] text-muted transition-transform duration-[200ms] ${legendOpen ? "rotate-180" : ""}`}
        />
      </button>
      {legendOpen && (
        <div className="anim-rise-fade-in mt-[10px] grid grid-cols-1 gap-[10px]">
          {LEGEND_ORDER.map((tipZi) => (
            <div key={tipZi} className="flex items-center gap-[12px]">
              <DayMark tipZi={tipZi} />
              <span className="font-sans text-[13px] text-muted">{t(TIP_ZI_LABEL_KEY[tipZi])}</span>
            </div>
          ))}
        </div>
      )}

      {selectedDay && (
        <div key={selectedDay.date} className="anim-fade-through mt-[32px] border-t border-divider pt-[24px]">
          <LiturgicalDayDetail day={selectedDay} />
        </div>
      )}
    </>
  );
}
