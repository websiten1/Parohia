"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
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
const SPRING = { type: "spring" as const, stiffness: 420, damping: 34 };

const TIP_ZI_LABEL_KEY: Record<TipZi, TranslationKey> = {
  duminica: "calendar.legend.duminica",
  praznic: "calendar.legend.praznic",
  post: "calendar.legend.post",
  sfant: "calendar.legend.sfant",
  obisnuita: "calendar.legend.obisnuita",
};

const LEGEND_ORDER: TipZi[] = ["duminica", "praznic", "post", "sfant", "obisnuita"];

/** Distinct numerals keep the legend from reading as five copies of the same cell. */
const LEGEND_SAMPLE_DAY: Record<TipZi, number> = {
  duminica: 7,
  praznic: 15,
  post: 12,
  sfant: 23,
  obisnuita: 18,
};

/**
 * How one day reads in the grid. Sunday is already obvious from the column it
 * sits in, so it gets typographic weight rather than the loudest treatment —
 * which frees the single filled disc to mean "selected" and nothing else.
 * Day type is carried by a marker under the numeral whose *shape* differs as
 * well as its color (filled / hollow / small), so the grid never depends on
 * color alone to say what a day is.
 */
const NUMERAL_CLASS: Record<TipZi, string> = {
  duminica: "font-semibold text-burgundy",
  praznic: "font-semibold text-text",
  post: "text-text",
  sfant: "text-text",
  obisnuita: "text-text",
};

function DayTypeMarker({ tipZi }: { tipZi: TipZi }) {
  if (tipZi === "praznic") {
    // Gilding: the one place amber appears in the grid, and it stays small.
    return <span className="h-[4px] w-[4px] rounded-full bg-amber" aria-hidden="true" />;
  }
  if (tipZi === "post") {
    return <span className="h-[4px] w-[4px] rounded-full border border-forest" aria-hidden="true" />;
  }
  if (tipZi === "sfant") {
    return <span className="h-[3px] w-[3px] rounded-full bg-slate/70" aria-hidden="true" />;
  }
  return null;
}

/**
 * Shared by the month grid cells and the legend swatches so both stay
 * identical. Selection renders through the same structure rather than as a
 * separate branch, so the numeral keeps its baseline instead of jumping when
 * a day is picked.
 */
function DayMark({
  tipZi,
  dayNum,
  isToday,
  isSelected,
}: {
  tipZi: TipZi;
  dayNum?: number;
  isToday?: boolean;
  isSelected?: boolean;
}) {
  return (
    <span className="relative flex h-[34px] w-[34px] flex-col items-center justify-center">
      {isSelected && (
        <motion.span
          layoutId="calendar-selected-day"
          transition={SPRING}
          className="absolute inset-0 rounded-full bg-burgundy"
          aria-hidden="true"
        />
      )}
      {isToday && !isSelected && (
        <span className="pointer-events-none absolute inset-0 rounded-full border-[1.5px] border-amber" aria-hidden="true" />
      )}
      <span
        className={`relative font-sans text-[15px] tabular-nums leading-none ${
          isSelected ? "font-semibold text-white" : NUMERAL_CLASS[tipZi]
        }`}
      >
        {dayNum}
      </span>
      {/* Reserved whether or not a marker renders, so every numeral shares one baseline. */}
      <span className="relative mt-[4px] flex h-[4px] items-center justify-center">
        {!isSelected && <DayTypeMarker tipZi={tipZi} />}
      </span>
    </span>
  );
}

function MonthNavButton({ onClick, label, children }: { onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      whileTap={{ scale: 0.88 }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
      className="flex h-[36px] w-[36px] items-center justify-center text-navy"
    >
      {children}
    </motion.button>
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
        <div className="flex gap-[8px]">
          <MonthNavButton onClick={() => goToMonth(-1)} label="Previous month">
            <ChevronLeftIcon className="h-[16px] w-[16px]" />
          </MonthNavButton>
          <MonthNavButton onClick={() => goToMonth(1)} label="Next month">
            <ChevronRightIcon className="h-[16px] w-[16px]" />
          </MonthNavButton>
        </div>
      </div>

      <div className="-mx-outer mt-[16px]">
        <LiturgicalDateStrip selectedDate={selected} onSelect={selectDate} />
      </div>

      <div
        key={`${year}-${month}`}
        className="anim-fade-through mt-[20px] grid grid-cols-7 gap-y-[10px]"
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
              <DayMark tipZi={tipZi} dayNum={dayNum} isToday={isToday} isSelected={isSelected} />
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setLegendOpen((v) => !v)}
        className="press mt-[24px] flex w-full items-center justify-between border-t border-divider pt-[16px] text-left"
        aria-expanded={legendOpen}
      >
        <span className="font-sans text-[12.5px] font-medium text-muted">{t("calendar.legendToggle")}</span>
        <motion.span animate={{ rotate: legendOpen ? 180 : 0 }} transition={SPRING}>
          <ChevronDownIcon className="h-[15px] w-[15px] text-muted" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {legendOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={SPRING}
            className="overflow-hidden"
          >
            <div className="mt-[16px] flex flex-col gap-[14px]">
              {LEGEND_ORDER.map((tipZi) => (
                <div key={tipZi} className="flex items-center gap-[12px]">
                  {/* A representative numeral, so the swatch is literally what the grid draws. */}
                  <DayMark tipZi={tipZi} dayNum={LEGEND_SAMPLE_DAY[tipZi]} />
                  <span className="font-sans text-[13px] text-muted">{t(TIP_ZI_LABEL_KEY[tipZi])}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedDay && (
        <div key={selectedDay.date} className="anim-fade-through mt-[32px]">
          <LiturgicalDayDetail day={selectedDay} />
        </div>
      )}
    </>
  );
}
