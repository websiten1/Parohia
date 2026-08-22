"use client";

import { useState } from "react";
import Link from "next/link";
import { LiturgicalDayDetail } from "@/components/LiturgicalDayDetail";
import { TodayVideoHero } from "@/components/TodayVideoHero";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { ARTICLE_CATEGORY_ACCENT, ARTICLES } from "@/lib/articleData";
import {
  getLiturgicalDay2026,
  getNextMajorFeast2026,
  REFERENCE_DATE_2026,
} from "@/lib/calendar-data/liturgicalYear2026";
import { getOnThisDay } from "@/lib/historyData";
import { oldCalendarDate } from "@/lib/seedData";
import { PullToRefreshToday } from "./PullToRefreshToday";

const ACCENT_BORDER: Record<string, string> = {
  forest: "border-forest",
  slate: "border-slate",
  burgundy: "border-burgundy",
  violet: "border-violet",
  clay: "border-clay",
  teal: "border-teal",
  plum: "border-plum",
};

function useGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "today.greetingMorning" as const;
  if (hour < 18) return "today.greetingAfternoon" as const;
  return "today.greetingEvening" as const;
}

export default function TodayPage() {
  const { t, language } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(REFERENCE_DATE_2026);
  const day = getLiturgicalDay2026(selectedDate);
  const greetingKey = useGreeting();

  const upcoming = getNextMajorFeast2026(REFERENCE_DATE_2026);
  const upcomingTitle = upcoming ? (language === "ro" ? upcoming.commemorationsRo : upcoming.commemorationsEn) : null;
  const upcomingDateLabel = upcoming
    ? new Date(upcoming.date + "T00:00:00").toLocaleDateString(language === "ro" ? "ro-RO" : "en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const [, refMonth, refDay] = REFERENCE_DATE_2026.split("-").map(Number);
  const historyEvent = getOnThisDay(refMonth, refDay)[0];
  const featuredArticle = ARTICLES[0];

  const locale = language === "ro" ? "ro-RO" : "en-US";
  const weekdayCaps = new Date(selectedDate + "T00:00:00").toLocaleDateString(locale, { weekday: "long" }).toUpperCase();
  const dateCaps = new Date(selectedDate + "T00:00:00")
    .toLocaleDateString(locale, { month: "long", day: "numeric", year: "numeric" })
    .toUpperCase();
  const oldCalLabel = new Date(oldCalendarDate(selectedDate) + "T00:00:00").toLocaleDateString(locale, {
    month: "long",
    day: "numeric",
  });

  const commemorations = day ? (language === "ro" ? day.commemorationsRo : day.commemorationsEn) : "";
  const notes = day ? (language === "ro" ? day.notesRo : day.notesEn) : [];
  const metaParts = [
    day?.tone != null ? `${t("liturgical.glas")} ${day.tone}` : null,
    day?.matinsGospel != null ? `${t("liturgical.voskresna")} ${day.matinsGospel}` : null,
    notes[0] ?? null,
  ].filter(Boolean);
  const metaLine = metaParts.join(" · ");

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <TodayVideoHero
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        weekdayCaps={weekdayCaps}
        dateCaps={dateCaps}
        commemorations={commemorations}
        metaLine={metaLine}
      />

      <PullToRefreshToday>
        <main className="flex-1 px-outer pb-tabbar pt-[24px]">
          <p className="font-serif text-[15px] italic leading-[1.4] text-muted">{t(greetingKey)}</p>
          <p className="mt-[2px] font-sans text-[12px] text-muted">
            {t("today.oldCalendarLabel")}: {oldCalLabel}
          </p>

          <div className="mt-[18px]">{day && <LiturgicalDayDetail day={day} />}</div>

          <p className="mt-[24px] font-sans text-[14.5px] leading-[1.6] text-navy">
            {t("today.exploreToday")}{" "}
            <Link href="/calendar" className="press underline decoration-navy/25 underline-offset-4">
              {t("nav.calendar")}
            </Link>
            {", "}
            <Link href="/readings" className="press underline decoration-navy/25 underline-offset-4">
              {t("nav.readings")}
            </Link>
            {", "}
            <Link href="/prayers" className="press underline decoration-navy/25 underline-offset-4">
              {t("prayers.title")}
            </Link>
            {" — "}
            <Link href="/fasting" className="press underline decoration-navy/25 underline-offset-4">
              {t("fasting.title")}
            </Link>
            .
          </p>

          {upcoming && (
            <Link href="/calendar" className="press mt-[24px] block rounded-md bg-navy-texture px-[18px] py-[16px]">
              <p className="font-sans text-[10.5px] font-semibold uppercase tracking-[0.08em] text-white/55">{t("today.upcoming")}</p>
              <p className="mt-[6px] font-serif text-[19px] font-bold text-white">{upcomingTitle}</p>
              <p className="mt-[2px] font-sans text-[13px] text-white/60">{upcomingDateLabel}</p>
            </Link>
          )}

          {historyEvent && (
            <Link href="/history" className="press mt-[24px] block border-t border-divider pt-[18px]">
              <p className="font-sans text-[10.5px] font-semibold uppercase tracking-[0.08em] text-clay">{t("today.onThisDay")}</p>
              <p className="mt-[6px] font-serif text-[17px] font-bold leading-[1.3] text-text">
                {historyEvent.year} — {language === "ro" ? historyEvent.headlineRo : historyEvent.headline}
              </p>
            </Link>
          )}

          {featuredArticle && (
            <Link
              href={`/news/${featuredArticle.id}`}
              className={`press mt-[18px] block border-l-2 pl-[14px] ${ACCENT_BORDER[ARTICLE_CATEGORY_ACCENT[featuredArticle.category]]}`}
            >
              <p className="font-sans text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted">
                {t("today.fromOurChurch")}
              </p>
              <p className="mt-[5px] font-serif text-[16px] font-bold leading-[1.3] text-text">{featuredArticle.title}</p>
              <p className="mt-[2px] font-sans text-[12.5px] leading-[1.4] text-muted">{featuredArticle.excerpt}</p>
            </Link>
          )}

          <Link href="/resources" className="press mt-[18px] block">
            <p className="font-sans text-[10.5px] font-semibold uppercase tracking-[0.08em] text-teal">
              {t("today.readWatchListen")}
            </p>
            <p className="mt-[5px] font-serif text-[16px] font-bold leading-[1.3] text-text">{t("resources.title")} →</p>
          </Link>
        </main>
      </PullToRefreshToday>
    </div>
  );
}
