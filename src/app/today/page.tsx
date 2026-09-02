"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
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

export default function TodayPage() {
  const { t, language } = useTranslation();
  const day = getLiturgicalDay2026(REFERENCE_DATE_2026);
  const greetingKey = useGreeting();
  const [selectedParishId] = useSelectedParishId();
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
          <Reveal delay={0}>
            <p className="font-serif text-[22px] font-bold leading-[1.35] text-text">{commemorations}</p>
            {metaLine && <p className="mt-[6px] font-sans text-[13.5px] text-muted">{metaLine}</p>}
            <p className="mt-[4px] font-sans text-[12px] text-muted">
              {t("today.oldCalendarLabel")}: {oldCalLabel}
            </p>
          </Reveal>

          {upcoming && (
            <Reveal delay={80} className="mt-[34px]">
              <Link href="/calendar">
                <motion.div whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 500, damping: 32 }}>
                  <p className="font-serif text-[19px] font-bold leading-[1.3] text-text">{upcomingTitle}</p>
                  <p className="mt-[4px] font-sans text-[13px] text-muted">{upcomingDateLabel}</p>
                </motion.div>
              </Link>
            </Reveal>
          )}

          {latestAnnouncement && (
            <Reveal delay={160} className="mt-[30px]">
              <Link href={`/anunturi/${latestAnnouncement.id}`}>
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 500, damping: 32 }}
                  className="flex items-start gap-[14px]"
                >
                  <span className="h-[56px] w-[56px] shrink-0 overflow-hidden rounded-md bg-navy-texture">
                    {latestAnnouncement.photo && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={latestAnnouncement.photo} alt="" className="h-full w-full object-cover" />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-serif text-[16px] font-bold leading-[1.3] text-text">
                      {latestAnnouncement.title}
                    </span>
                    <span className="mt-[3px] block font-sans text-[12.5px] leading-[1.4] text-muted">
                      {latestAnnouncement.excerpt}
                    </span>
                  </span>
                </motion.div>
              </Link>
            </Reveal>
          )}

          {servicesToday.length > 0 && (
            <Reveal delay={240} className="mt-[30px]">
              <p className="font-serif text-[16px] font-bold text-text">{t("today.servicesToday")}</p>
              <div className="mt-[10px] flex flex-col gap-[8px]">
                {servicesToday.map((s) => (
                  <p key={s.nume} className="flex items-baseline justify-between gap-[10px]">
                    <span className="font-sans text-[14px] text-muted">{s.nume}</span>
                    <span className="font-serif text-[18px] font-bold tabular-nums text-navy">{s.ora}</span>
                  </p>
                ))}
              </div>
            </Reveal>
          )}
        </main>
      </PullToRefreshToday>
    </div>
  );
}
