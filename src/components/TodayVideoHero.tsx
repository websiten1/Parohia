"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { SealMark } from "@/components/SealMark";
import { BellIcon } from "@/components/icons";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

interface Props {
  greeting: string;
  dateLine: string;
}

/**
 * The video is the atmosphere for the whole first impression of Today, not
 * a component inserted into a card — a tall, near-full-screen scene with
 * only a greeting and the date resting on it. Everything else (saints,
 * services, announcements) lives below, in the room this restraint leaves
 * for it. A slow scale drift stands in for parallax here — true
 * viewport-fixed video isn't safe under the app's page-transition transform
 * without breaking `position: fixed` for its whole subtree, so the video
 * still scrolls, just slowly and only after a very tall hold.
 */
export function TodayVideoHero({ greeting, dateLine }: Props) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 700], [1, reduceMotion ? 1 : 1.06]);

  return (
    <div className="relative h-[92vh] max-h-[820px] min-h-[600px] w-full overflow-hidden bg-navy">
      <motion.video
        className="anim-flicker-subtle absolute inset-0 h-full w-full object-cover"
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
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(7,26,51,0.28) 0%, rgba(7,26,51,0.36) 45%, rgba(7,26,51,0.68) 78%, #fafaf8 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full flex-col">
        <header className="flex items-center justify-between px-outer pt-[max(env(safe-area-inset-top),18px)]">
          <div className="flex items-center gap-[10px]">
            <SealMark size={28} tone="light" />
            <p className="font-sans text-[10.5px] font-semibold uppercase leading-[1.3] tracking-[0.03em] text-white">
              {t("brand.name")}
            </p>
          </div>
          <Link
            href="/notifications"
            aria-label={t("notifications.title")}
            className="flex h-[40px] w-[40px] items-center justify-center text-white"
            style={{ filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.45))" }}
          >
            <BellIcon className="h-[19px] w-[19px]" />
          </Link>
        </header>

        <div className="flex flex-1 flex-col justify-end px-outer pb-[15vh]">
          <p className="anim-rise-fade-in font-serif text-[19px] italic leading-[1.4] text-white/90">{greeting}</p>
          <p
            className="anim-rise-fade-in mt-[10px] font-serif text-[30px] font-bold leading-[1.15] text-white"
            style={{ animationDelay: "90ms" }}
          >
            {dateLine}
          </p>
        </div>
      </div>
    </div>
  );
}
