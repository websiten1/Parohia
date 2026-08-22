"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/Feedback";
import { PhotoHero } from "@/components/PhotoHero";
import { ClockIcon } from "@/components/icons";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import type { TranslationKey } from "@/lib/i18n/translations";
import { EVENTS } from "@/lib/seedData";
import type { EventCategory, EventStatus } from "@/lib/types";

const STATUS_TABS: { id: EventStatus; labelKey: TranslationKey }[] = [
  { id: "upcoming", labelKey: "events.tabUpcoming" },
  { id: "past", labelKey: "events.tabPast" },
];

const CATEGORY_FILTERS: { id: EventCategory | "all"; labelKey: TranslationKey }[] = [
  { id: "all", labelKey: "events.filterAll" },
  { id: "youth", labelKey: "events.filterYouth" },
  { id: "clergy", labelKey: "events.filterClergy" },
  { id: "diocesan", labelKey: "events.filterDiocesan" },
  { id: "parish", labelKey: "events.filterParish" },
];

function formatEventDate(start: string, end: string, language: "en" | "ro"): string {
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  const month = s.toLocaleDateString(language === "ro" ? "ro-RO" : "en-US", { month: "long" }).toUpperCase();
  if (start === end) return `${s.getDate()} ${month} ${s.getFullYear()}`;
  return `${s.getDate()}–${e.getDate()} ${month} ${s.getFullYear()}`;
}

export function EventsClient() {
  const [status, setStatus] = useState<EventStatus>("upcoming");
  const [category, setCategory] = useState<EventCategory | "all">("all");
  const { t, language } = useTranslation();

  const events = useMemo(
    () => EVENTS.filter((e) => e.status === status).filter((e) => category === "all" || e.category === category),
    [status, category]
  );

  return (
    <>
      <div className="flex gap-[20px] px-outer">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setStatus(tab.id)}
            className={`press pb-[8px] font-sans text-[13px] font-semibold uppercase tracking-[0.04em] ${
              status === tab.id ? "border-b-2 border-burgundy text-burgundy" : "text-muted"
            }`}
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </div>

      <div className="no-scrollbar mt-[12px] flex gap-[8px] overflow-x-auto px-outer">
        {CATEGORY_FILTERS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategory(c.id)}
            className={`press shrink-0 rounded-pill px-[14px] py-[7px] font-sans text-[12.5px] font-medium ${
              category === c.id ? "bg-navy text-white" : "bg-soft-surface text-text"
            }`}
          >
            {t(c.labelKey)}
          </button>
        ))}
      </div>

      <div key={`${status}-${category}`} className="anim-fade-through px-outer pt-[20px] pb-tabbar">
        {events.length === 0 ? (
          <EmptyState icon={<ClockIcon className="h-[20px] w-[20px]" />} message={t("events.noResults")} />
        ) : (
          events.map((e) => {
            const title = language === "ro" ? (e.titleRo ?? e.title) : e.title;
            return (
              <Link key={e.id} href={`/event/${e.id}`} className="press mb-[24px] block last:mb-0">
                <PhotoHero alt={title} scrim="none" className="h-[160px] w-full rounded-md" />
                <p className="mt-[12px] font-sans text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
                  {formatEventDate(e.startDate, e.endDate, language)}
                </p>
                <p className="mt-[4px] font-serif text-[19px] font-bold leading-[1.25] text-text">{title}</p>
                <p className="mt-[2px] font-sans text-[13.5px] text-muted">{e.location}</p>
              </Link>
            );
          })
        )}
      </div>
    </>
  );
}
