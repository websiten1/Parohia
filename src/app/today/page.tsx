"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ChevronRightIcon } from "@/components/icons";
import { Reveal } from "@/components/Reveal";
import { TodayVideoHero } from "@/components/TodayVideoHero";
import { getAnnouncementsForParish, getGlobalAnnouncements, getTodaysServices } from "@/lib/data/parishes";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import type { Article } from "@/lib/articleData";
import {
  getLiturgicalDay2026,
  getNextMajorFeast2026,
  REFERENCE_DATE_2026,
} from "@/lib/calendar-data/liturgicalYear2026";
import { oldCalendarDate } from "@/lib/seedData";
import { useSelectedParishId } from "@/lib/storage";
import { PullToRefreshToday } from "./PullToRefreshToday";

function useGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "today.greetingMorning" as const;
  if (hour < 18) return "today.greetingAfternoon" as const;
  return "today.greetingEvening" as const;
}

/** One consistent voice for the page's section headings — a real heading, never a tracked-out kicker. */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="font-serif text-[16px] font-bold text-text">{children}</h2>;
}

/** Hairline separator that does the work section labels would otherwise have to. */
function Divider() {
  return <div className="mt-[28px] border-t border-divider pt-[28px]" />;
}

export default function TodayPage() {
  const { t, language } = useTranslation();
  const day = getLiturgicalDay2026(REFERENCE_DATE_2026);
  const greetingKey = useGreeting();
  const [selectedParishId, , parishHydrated] = useSelectedParishId();
  const [servicesToday, setServicesToday] = useState<{ nume: string; ora: string }[]>([]);
  const [latestAnnouncement, setLatestAnnouncement] = useState<Article | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    const weekday = new Date(REFERENCE_DATE_2026 + "T00:00:00").getDay();
    (async () => {
      const announcements = selectedParishId
        ? await getAnnouncementsForParish(selectedParishId)
        : await getGlobalAnnouncements();
      const services = selectedParishId ? await getTodaysServices(selectedParishId, weekday) : [];
      if (cancelled) return;
      setLatestAnnouncement(announcements[0]);
      setServicesToday(services);
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedParishId]);

  const upcoming = getNextMajorFeast2026(REFERENCE_DATE_2026);
  const upcomingTitle = upcoming ? (language === "ro" ? upcoming.commemorationsRo : upcoming.commemorationsEn) : null;
  const upcomingDateLabel = upcoming
    ? new Date(upcoming.date + "T00:00:00").toLocaleDateString(language === "ro" ? "ro-RO" : "en-US", {
        month: "long",
        day: "numeric",
      })
    : null;

  const locale = language === "ro" ? "ro-RO" : "en-US";
  const dateLine = new Date(REFERENCE_DATE_2026 + "T00:00:00").toLocaleDateString(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const oldCalLabel = new Date(oldCalendarDate(REFERENCE_DATE_2026) + "T00:00:00").toLocaleDateString(locale, {
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
      <TodayVideoHero greeting={t(greetingKey)} dateLine={dateLine} />

      <PullToRefreshToday>
        <main className="flex-1 px-outer pb-tabbar pt-[30px]">
          {/* What today is in the Church's life — the largest thing below the fold. */}
          <Reveal delay={0}>
            <p className="font-serif text-[23px] font-bold leading-[1.3] text-text">{commemorations}</p>
            {metaLine && <p className="mt-[8px] font-sans text-[13.5px] leading-[1.5] text-muted">{metaLine}</p>}
            <p className="mt-[3px] font-sans text-[12.5px] text-muted">
              {t("today.oldCalendarLabel")}: {oldCalLabel}
            </p>
          </Reveal>

          {/* The parish's own day — the reason someone opens this app before a service. */}
          <Reveal delay={80}>
            <Divider />
            <SectionHeading>{t("today.servicesToday")}</SectionHeading>
            {servicesToday.length > 0 ? (
              <div className="mt-[12px]">
                {servicesToday.map((s, i) => (
                  <div
                    key={`${s.nume}-${s.ora}`}
                    className={`flex items-baseline justify-between gap-[12px] py-[11px] ${
                      i !== servicesToday.length - 1 ? "border-b border-divider/70" : ""
                    }`}
                  >
                    <span className="font-sans text-[14.5px] text-text">{s.nume}</span>
                    <span className="shrink-0 font-serif text-[17px] font-bold tabular-nums text-navy">{s.ora}</span>
                  </div>
                ))}
              </div>
            ) : selectedParishId ? (
              // A parish is chosen; today simply has nothing scheduled.
              <p className="mt-[10px] font-sans text-[13.5px] text-muted">{t("today.noServicesToday")}</p>
            ) : (
              // Nobody has picked a parish — offer the way in without gating the page on it.
              parishHydrated && (
                <div className="mt-[10px]">
                  <p className="font-sans text-[13.5px] leading-[1.55] text-muted">{t("today.noParishPrompt")}</p>
                  <Link
                    href="/menu/parish"
                    className="press mt-[12px] inline-flex items-center gap-[6px] font-sans text-[14px] font-semibold text-burgundy"
                  >
                    {t("today.noParishCta")}
                    <ChevronRightIcon className="h-[13px] w-[13px]" />
                  </Link>
                </div>
              )
            )}
          </Reveal>

          {upcoming && (
            <Reveal delay={160}>
              <Divider />
              <SectionHeading>{t("today.upcoming")}</SectionHeading>
              <Link href="/calendar" className="press mt-[10px] block">
                <motion.div whileTap={{ scale: 0.99 }} transition={{ type: "spring", stiffness: 500, damping: 32 }}>
                  <p className="font-serif text-[19px] font-bold leading-[1.3] text-text">{upcomingTitle}</p>
                  <p className="mt-[4px] font-sans text-[13px] text-muted">{upcomingDateLabel}</p>
                </motion.div>
              </Link>
            </Reveal>
          )}

          {latestAnnouncement && (
            <Reveal delay={240}>
              <Divider />
              <Link href={`/anunturi/${latestAnnouncement.id}`} className="press block">
                <motion.div
                  whileTap={{ scale: 0.99 }}
                  transition={{ type: "spring", stiffness: 500, damping: 32 }}
                  className="flex items-start gap-[14px]"
                >
                  {/* Only reserve the thumbnail when there is genuinely an image to put in it. */}
                  {latestAnnouncement.photo && (
                    <span className="h-[58px] w-[58px] shrink-0 overflow-hidden rounded-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={latestAnnouncement.photo} alt="" className="h-full w-full object-cover" />
                    </span>
                  )}
                  <span className="min-w-0">
                    <span className="block font-serif text-[17px] font-bold leading-[1.3] text-text">
                      {latestAnnouncement.title}
                    </span>
                    <span className="mt-[5px] block font-sans text-[13px] leading-[1.5] text-muted">
                      {latestAnnouncement.excerpt}
                    </span>
                    {latestAnnouncement.author && (
                      <span className="mt-[7px] block font-sans text-[12px] text-muted">{latestAnnouncement.author}</span>
                    )}
                  </span>
                </motion.div>
              </Link>
            </Reveal>
          )}
        </main>
      </PullToRefreshToday>
    </div>
  );
}
