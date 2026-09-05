"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { CandleIcon, ChevronRightIcon } from "@/components/icons";
import { Reveal } from "@/components/Reveal";
import { TodayVideoHero } from "@/components/TodayVideoHero";
import { PageBody, PageContainer, SectionHeader, TintedFeatureCard, TintMarker } from "@/components/ui/Surfaces";
import { DOMAIN_TINT } from "@/lib/tints";
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

/** Space, not rules, separates the page's sections. (§05, §32) */
function Section({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={`mt-[40px] ${className ?? ""}`}>{children}</section>;
}

export default function TodayPage() {
  const router = useRouter();
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
    <PageContainer>
      <TodayVideoHero greeting={t(greetingKey)} dateLine={dateLine} />

      <PullToRefreshToday>
        <PageBody className="pt-[34px]">
          {/* What today is in the Church's life — the largest thing below the fold. */}
          <Reveal delay={0}>
            <h2 className="font-serif text-[25px] font-bold leading-[1.25] text-text">{commemorations}</h2>
            {metaLine && <p className="mt-[10px] font-sans text-[15px] leading-[1.5] text-text-secondary">{metaLine}</p>}
            <p className="mt-[4px] font-sans text-[13.5px] text-muted">
              {t("today.oldCalendarLabel")}: {oldCalLabel}
            </p>
          </Reveal>

          {/* The parish's own day — the reason someone opens this app before a service. */}
          <Reveal delay={80}>
            <Section>
              <SectionHeader>{t("today.servicesToday")}</SectionHeader>
              {servicesToday.length > 0 ? (
                <TintedFeatureCard tint={DOMAIN_TINT.service} className="mt-[16px]">
                  {servicesToday.map((s, i) => (
                    <div
                      key={`${s.nume}-${s.ora}`}
                      className={`flex items-baseline justify-between gap-[14px] ${i === 0 ? "" : "mt-[16px]"}`}
                    >
                      <span className="font-sans text-[16px] font-medium">{s.nume}</span>
                      <span className="shrink-0 font-serif text-[19px] font-bold tabular-nums">{s.ora}</span>
                    </div>
                  ))}
                </TintedFeatureCard>
              ) : selectedParishId ? (
                // A parish is chosen; today simply has nothing scheduled.
                <p className="mt-[12px] font-sans text-[15px] text-muted">{t("today.noServicesToday")}</p>
              ) : (
                // Nobody has picked a parish — offer the way in without gating the page on it.
                parishHydrated && (
                  <div className="mt-[12px]">
                    <p className="font-sans text-[15px] leading-[1.5] text-muted">{t("today.noParishPrompt")}</p>
                    <Link
                      href="/menu/parish"
                      className="press mt-[16px] inline-flex min-h-[44px] items-center gap-[7px] font-sans text-[15px] font-semibold text-burgundy"
                    >
                      {t("today.noParishCta")}
                      <ChevronRightIcon className="h-[14px] w-[14px]" />
                    </Link>
                  </div>
                )
              )}
            </Section>
          </Reveal>

          {upcoming && upcomingTitle && (
            <Reveal delay={160}>
              <Section>
                <SectionHeader>{t("today.upcoming")}</SectionHeader>
                <TintedFeatureCard
                  tint={DOMAIN_TINT.feast}
                  className="mt-[16px]"
                  onClick={() => router.push("/calendar")}
                  ariaLabel={upcomingTitle}
                >
                  <div className="flex items-start gap-[16px]">
                    <TintMarker tint={DOMAIN_TINT.feast}>
                      <CandleIcon className="h-[19px] w-[19px]" />
                    </TintMarker>
                    <span className="min-w-0 flex-1">
                      <span className="block font-serif text-[19px] font-bold leading-[1.25]">{upcomingTitle}</span>
                      <span className="mt-[6px] block font-sans text-[14px] opacity-80">{upcomingDateLabel}</span>
                    </span>
                  </div>
                </TintedFeatureCard>
              </Section>
            </Reveal>
          )}

          {latestAnnouncement && (
            <Reveal delay={240}>
              <Section>
                <Link href={`/anunturi/${latestAnnouncement.id}`} className="press block">
                <motion.div
                  whileTap={{ scale: 0.99 }}
                  transition={{ type: "spring", stiffness: 500, damping: 32 }}
                  className="flex items-start gap-[16px]"
                >
                  {/* Only reserve the thumbnail when there is genuinely an image to put in it. */}
                  {latestAnnouncement.photo && (
                    <span className="h-[68px] w-[68px] shrink-0 overflow-hidden rounded-compact">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={latestAnnouncement.photo} alt="" className="h-full w-full object-cover" />
                    </span>
                  )}
                  <span className="min-w-0">
                    <span className="block font-serif text-[19px] font-bold leading-[1.25] text-text">
                      {latestAnnouncement.title}
                    </span>
                    <span className="mt-[7px] block font-sans text-[14.5px] leading-[1.45] text-muted">
                      {latestAnnouncement.excerpt}
                    </span>
                    {latestAnnouncement.author && (
                      <span className="mt-[9px] block font-sans text-[13px] text-muted">{latestAnnouncement.author}</span>
                    )}
                  </span>
                </motion.div>
                </Link>
              </Section>
            </Reveal>
          )}
        </PageBody>
      </PullToRefreshToday>
    </PageContainer>
  );
}
