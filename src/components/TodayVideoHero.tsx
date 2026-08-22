"use client";

import Link from "next/link";
import { LiturgicalDateStrip } from "@/components/LiturgicalDateStrip";
import { SealMark } from "@/components/SealMark";
import { BellIcon } from "@/components/icons";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

interface Props {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  weekdayCaps: string;
  dateCaps: string;
  commemorations: string;
  metaLine: string;
}

/**
 * The video is the living background for the entire upper Today
 * composition — header, date strip, and the date/title/saints block all
 * render as one layered scene above it, not as a separate "hero card". A
 * navy gradient overlay (stronger toward the bottom) keeps everything
 * legible and dissolves the footage into the page's #FAFAF8 background by
 * the time this section ends, so the cut into the light content below is
 * invisible rather than a hard edge.
 */
export function TodayVideoHero({ selectedDate, onSelectDate, weekdayCaps, dateCaps, commemorations, metaLine }: Props) {
  const { t } = useTranslation();

  return (
    <div className="relative h-[76vh] max-h-[680px] min-h-[520px] w-full overflow-hidden bg-navy">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/video/today-hero.mp4"
        poster="/video/today-hero-poster.jpg"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(7,26,51,0.32) 0%, rgba(7,26,51,0.4) 40%, rgba(7,26,51,0.7) 75%, #fafaf8 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full flex-col">
        <header className="flex items-center justify-between px-outer pt-[max(env(safe-area-inset-top),18px)]">
          <div className="flex items-center gap-[10px]">
            <SealMark size={30} tone="light" />
            <p className="font-sans text-[10.5px] font-semibold uppercase leading-[1.3] tracking-[0.03em] text-white">
              {t("brand.wordmarkLine1")}
              <br />
              {t("brand.wordmarkLine2")}
            </p>
          </div>
          <Link
            href="/notifications"
            aria-label={t("notifications.title")}
            className="press flex h-[44px] w-[44px] items-center justify-center rounded-full text-white"
          >
            <BellIcon className="h-[20px] w-[20px]" />
          </Link>
        </header>

        <div className="mt-[6px]">
          <LiturgicalDateStrip selectedDate={selectedDate} onSelect={onSelectDate} variant="dark" />
        </div>

        <div className="flex flex-1 flex-col justify-end px-outer pb-[28px]">
          <p className="font-sans text-[13px] font-medium uppercase tracking-[0.16em] text-white/80">{weekdayCaps}</p>
          <p className="mt-[3px] font-serif text-[27px] font-bold leading-[1.1] text-white">{dateCaps}</p>
          <p className="mt-[10px] font-serif text-[46px] font-bold uppercase leading-[0.9] text-white">
            {t("liturgical.today")}
          </p>
          <p className="mt-[12px] font-serif text-[18px] font-semibold leading-[1.3] text-white/95">{commemorations}</p>
          {metaLine && <p className="mt-[8px] font-sans text-[13px] text-white/70">{metaLine}</p>}
        </div>
      </div>
    </div>
  );
}
