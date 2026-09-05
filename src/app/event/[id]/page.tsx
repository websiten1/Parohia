"use client";

import { notFound, useParams } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { BookmarkButton } from "@/components/BookmarkButton";
import { PhotoHero } from "@/components/PhotoHero";
import { ShareButton } from "@/components/ShareButton";
import { ClockIcon, DownloadIcon, MapPinIcon } from "@/components/icons";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { EVENTS } from "@/lib/seedData";
import { PageContainer } from "@/components/ui/Surfaces";

function buildIcs(event: (typeof EVENTS)[number], title: string, description: string): string {
  const fmt = (d: string) => d.replace(/-/g, "");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `SUMMARY:${title}`,
    `DTSTART;VALUE=DATE:${fmt(event.startDate)}`,
    `DTEND;VALUE=DATE:${fmt(event.endDate)}`,
    `LOCATION:${event.location}`,
    `DESCRIPTION:${description.replace(/\n/g, " ")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function formatRange(start: string, end: string, language: "en" | "ro"): string {
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  const tag = language === "ro" ? "ro-RO" : "en-US";
  const opts: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric" };
  return start === end ? s.toLocaleDateString(tag, opts) : `${s.toLocaleDateString(tag, opts)} – ${e.toLocaleDateString(tag, opts)}`;
}

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const event = EVENTS.find((e) => e.id === id);
  const { t, language } = useTranslation();
  if (!event) return notFound();

  const title = language === "ro" ? (event.titleRo ?? event.title) : event.title;
  const description = language === "ro" ? (event.descriptionRo ?? event.description) : event.description;
  const icsHref = `data:text/calendar;charset=utf-8,${encodeURIComponent(buildIcs(event, title, description))}`;

  return (
    <PageContainer>
      <AppHeader
        title={t("eventDetail.title")}
        right={<BookmarkButton entityType="event" entityId={event.id} title={title} subtitle={event.location} />}
      />

      <main className="flex-1 pb-[24px]">
        <div className="px-outer pt-[8px]">
          <PhotoHero alt={title} scrim="none" className="h-[190px] w-full rounded-compact" />
        </div>

        <div className="px-outer pt-[18px]">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
            {formatRange(event.startDate, event.endDate, language)}
          </p>
          <p className="mt-[6px] font-serif text-[22px] font-bold leading-[1.25] text-text">{title}</p>

          <div className="mt-[14px] flex items-start gap-[10px]">
            <MapPinIcon className="mt-[2px] h-[17px] w-[17px] shrink-0 text-navy" />
            <p className="font-sans text-[15.5px] text-text">{event.location}</p>
          </div>

          <p className="mt-[18px] font-sans text-[15px] leading-[1.55] text-text">{description}</p>

          <div className="mt-[20px] flex gap-[10px]">
            <a
              href={icsHref}
              download={`${event.id}.ics`}
              className="press flex flex-1 items-center justify-center gap-[8px] rounded-pill bg-navy py-[13px] font-sans text-[15.5px] font-semibold text-white"
            >
              <DownloadIcon className="h-[16px] w-[16px]" />
              {t("eventDetail.addToCalendar")}
            </a>
            <ShareButton
              title={title}
              text={`${title} — ${event.location}`}
              className="press flex items-center justify-center rounded-pill bg-soft-surface px-[18px] py-[13px] text-navy"
            />
          </div>

          {event.registrationUrl && (
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="press mt-[10px] block text-center font-sans text-[13px] font-semibold text-burgundy"
            >
              {t("eventDetail.register")}
            </a>
          )}

          <p className="mt-[24px] flex items-center gap-[8px] font-sans text-[13.5px] text-muted">
            <ClockIcon className="h-[14px] w-[14px]" />
            {t("eventDetail.tapNote")}
          </p>
        </div>
      </main>
    </PageContainer>
  );
}
