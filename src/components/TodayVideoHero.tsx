"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { SealMark } from "@/components/SealMark";
import { CircularActionButton } from "@/components/ui/Controls";
import { BellIcon } from "@/components/icons";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

interface Props {
  greeting: string;
  /** What today is in the Church's life — the one thing this screen alone carries. */
  commemorations: string;
  meta?: string;
}

/**
 * Today is the video. The whole screen is the scene, and everything the page
 * says rests on it: a greeting, the word "Today", and the day's commemoration.
 * Nothing else — services live on the Schedule, the next feast on the
 * Calendar, announcements on News — so this screen repeats none of them.
 *
 * A slow scale drift stands in for parallax: true viewport-fixed video is not
 * safe under AppShell's page-transition transform, which would break
 * `position: fixed` for the whole subtree.
 */
export function TodayVideoHero({ greeting, commemorations, meta }: Props) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 600], [1, reduceMotion ? 1 : 1.05]);

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-navy">
      <motion.video
        className="absolute inset-0 h-full w-full object-cover"
        style={{ scale }}
        src="/video/today-hero.mp4"
        poster="/video/today-hero-poster.jpg"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      {/* Deep enough at the foot to hold the text, clear at the top so the
          scene is actually visible. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--scrim-video)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full flex-col">
        <header className="flex items-center justify-between px-outer pt-[max(env(safe-area-inset-top),18px)]">
          <div className="flex items-center gap-[10px]">
            <SealMark size={30} tone="light" />
            <p className="font-sans text-[11px] font-semibold uppercase leading-[1.3] tracking-[0.04em] text-white/90">
              {t("brand.name")}
            </p>
          </div>
          <CircularActionButton href="/notifications" label={t("notifications.title")} tone="onDark">
            <BellIcon className="h-[19px] w-[19px]" />
          </CircularActionButton>
        </header>

        <div className="flex flex-1 flex-col justify-end px-outer pb-[calc(96px+env(safe-area-inset-bottom,0px))]">
          <p className="anim-rise-fade-in font-serif text-[19px] italic leading-[1.4] text-white/75">{greeting}</p>
          <h1
            className="anim-rise-fade-in mt-[6px] font-serif text-[64px] font-bold leading-[0.95] tracking-[-0.02em] text-white"
            style={{ animationDelay: "80ms" }}
          >
            {t("today.todayLabel")}
          </h1>
          <p
            className="anim-rise-fade-in mt-[22px] max-w-[330px] font-serif text-[21px] font-bold leading-[1.3] text-white"
            style={{ animationDelay: "160ms" }}
          >
            {commemorations}
          </p>
          {meta && (
            <p
              className="anim-rise-fade-in mt-[10px] font-sans text-[14px] leading-[1.5] text-white/70"
              style={{ animationDelay: "240ms" }}
            >
              {meta}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
