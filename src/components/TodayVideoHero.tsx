"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { SealMark } from "@/components/SealMark";
import { BellIcon } from "@/components/icons";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

interface Props {
  greeting: string;
  weekdayCaps: string;
  dateCaps: string;
  commemorations: string;
  metaLine: string;
}

/**
 * The video is the living background for the entire upper Today
 * composition — header and the greeting/date/title/saints block all render
 * as one layered scene above it, not as a separate "hero card". A navy
 * gradient overlay (stronger toward the bottom) keeps everything legible and
 * dissolves the footage into the page's background by the time this section
 * ends, so the cut into the light content below is invisible rather than a
 * hard edge. The footage itself drifts slower than the page as you scroll
 * (a real parallax, not just a fade) and the notification bell is the one
 * floating glass control resting on top of it — everything else stays
 * directly on the image rather than caged in a card.
 */
export function TodayVideoHero({ greeting, weekdayCaps, dateCaps, commemorations, metaLine }: Props) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 600], [0, reduceMotion ? 0 : 50]);

  return (
    <div ref={heroRef} className="relative h-[76vh] max-h-[680px] min-h-[520px] w-full overflow-hidden bg-navy">
      <motion.video
        className="anim-flicker-subtle absolute inset-0 h-full w-full object-cover"
        style={{ y: parallaxY }}
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
              {t("brand.name")}
            </p>
          </div>
          <Link href="/notifications" aria-label={t("notifications.title")}>
            <motion.span
              whileTap={reduceMotion ? undefined : { scale: 0.88 }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
              className="glass-navy-thin flex h-[40px] w-[40px] items-center justify-center rounded-pill text-white"
            >
              <BellIcon className="h-[18px] w-[18px]" />
            </motion.span>
          </Link>
        </header>

        <div className="flex flex-1 flex-col justify-end px-outer pb-[34px]">
          <p className="anim-rise-fade-in font-serif text-[15px] italic leading-[1.3] text-white/70">{greeting}</p>
          <p
            className="anim-rise-fade-in mt-[5px] font-sans text-[13px] font-medium uppercase tracking-[0.16em] text-white/80"
            style={{ animationDelay: "60ms" }}
          >
            {weekdayCaps}
          </p>
          <p className="anim-rise-fade-in mt-[3px] font-serif text-[27px] font-bold leading-[1.1] text-white" style={{ animationDelay: "110ms" }}>
            {dateCaps}
          </p>
          <p
            className="anim-rise-fade-in mt-[10px] font-serif text-[46px] font-bold uppercase leading-[0.88] tracking-[-0.02em] text-white"
            style={{ animationDelay: "160ms" }}
          >
            {t("liturgical.today")}
          </p>
          <p
            className="anim-rise-fade-in mt-[14px] font-serif text-[18px] font-semibold leading-[1.35] text-white/95"
            style={{ animationDelay: "210ms" }}
          >
            {commemorations}
          </p>
          {metaLine && (
            <p className="anim-rise-fade-in mt-[9px] font-sans text-[13px] text-white/70" style={{ animationDelay: "260ms" }}>
              {metaLine}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
