"use client";

import { useEffect, useState } from "react";
import { CandleIcon, CrossIcon } from "@/components/icons";
import { EmptyState } from "@/components/Feedback";
import { GlassSurface } from "@/components/glass/GlassSurface";
import { Reveal } from "@/components/Reveal";
import { getParishById, getProgramForParish } from "@/lib/data/parishes";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import type { TranslationKey } from "@/lib/i18n/translations";
import { FEAST_DAY_NOTICES } from "@/lib/scheduleData";
import { useSelectedParishId } from "@/lib/storage";
import type { Parish, ProgramLiturgic } from "@/lib/types";

const DAY_LABEL_KEY: Record<string, TranslationKey> = {
  Duminică: "schedule.sunday",
  Sâmbătă: "schedule.saturday",
  Miercuri: "schedule.wednesday",
};

const SERVICE_LABEL_KEY: Record<string, TranslationKey> = {
  Matins: "schedule.matins",
  "Divine Liturgy": "schedule.divineLiturgy",
  Vespers: "schedule.vespers",
  "Paraclesis to the Theotokos": "schedule.paraclesis",
};

/** Each day of the week gets its own identity — a colored top edge and heading, not three identical cards. */
const DAY_ACCENT: Record<string, { edge: string; text: string }> = {
  Duminică: { edge: "bg-burgundy", text: "text-burgundy" },
  Sâmbătă: { edge: "bg-slate", text: "text-slate" },
  Miercuri: { edge: "bg-teal", text: "text-teal" },
};

const FEAST_ICONS = [CandleIcon, CrossIcon];

/** Faint arched watermark anchored to the bottom of the screen — this page's one unique "rich moment". */
function ArchWatermark() {
  return (
    <svg
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[260px] w-full opacity-[0.08]"
      viewBox="0 0 400 260"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <path d="M20 260V140a180 180 0 0 1 360 0v120" fill="none" stroke="var(--color-amber)" strokeWidth="3" />
      <path d="M70 260V160a130 130 0 0 1 260 0v100" fill="none" stroke="var(--color-navy)" strokeWidth="2" />
    </svg>
  );
}

export default function ProgramLiturgicPage() {
  const { t, language } = useTranslation();
  const [selectedParishId] = useSelectedParishId();
  const [parish, setParish] = useState<Parish | undefined>(undefined);
  const [program, setProgram] = useState<ProgramLiturgic | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const foundParish = selectedParishId ? await getParishById(selectedParishId) : undefined;
      const foundProgram = selectedParishId ? await getProgramForParish(selectedParishId) : undefined;
      if (cancelled) return;
      setParish(foundParish);
      setProgram(foundProgram ?? null);
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedParishId]);

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-background">
      <ArchWatermark />
      <main className="relative flex-1 px-outer pt-[max(env(safe-area-inset-top),24px)] pb-tabbar">
        <h1 className="font-serif text-[32px] font-bold leading-[1.1] text-text">{t("schedule.title")}</h1>
        {parish && (
          <p className="mt-[6px] font-serif text-[15px] italic text-burgundy">
            {parish.name} · {parish.patronSaint}
          </p>
        )}

        {program === null && (
          <Reveal delay={0} className="mt-[36px]">
            <GlassSurface tier="thin" radius="2xl" className="px-outer py-[36px]">
              <EmptyState
                icon={<CandleIcon className="h-[22px] w-[22px]" />}
                message={parish ? `${parish.name} — ${t("schedule.emptyState")}` : t("schedule.emptyState")}
              />
            </GlassSurface>
          </Reveal>
        )}

        {program && (
          <>
            <div className="mt-[30px] flex flex-col gap-[16px]">
              {program.saptamanal.map((day, i) => {
                const accent = DAY_ACCENT[day.zi] ?? DAY_ACCENT["Duminică"];
                return (
                  <Reveal key={day.zi} delay={i * 100}>
                    <GlassSurface tier="thin" radius="2xl" className="overflow-hidden">
                      <div className={`h-[4px] w-full ${accent.edge}`} aria-hidden="true" />
                      <div className="px-[20px] py-[18px]">
                        <p className={`font-serif text-[21px] font-bold ${accent.text}`}>
                          {t(DAY_LABEL_KEY[day.zi] ?? "schedule.sunday")}
                        </p>
                        <div className="mt-[12px] flex flex-col gap-[10px]">
                          {day.slujbe.map((s) => (
                            <div key={s.nume} className="flex items-baseline justify-between gap-[16px]">
                              <span className="font-sans text-[14px] text-text">{t(SERVICE_LABEL_KEY[s.nume] ?? s.nume)}</span>
                              <span className="shrink-0 whitespace-nowrap font-serif text-[18px] font-bold tabular-nums text-navy">
                                {s.ora}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </GlassSurface>
                  </Reveal>
                );
              })}
            </div>

            <p className="mt-[40px] font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
              {t("schedule.feastDays")}
            </p>

            <div className="mt-[16px] flex flex-col gap-[14px]">
              {FEAST_DAY_NOTICES.map((notice, i) => {
                const Icon = FEAST_ICONS[i % FEAST_ICONS.length];
                return (
                  <Reveal key={notice.id} delay={i * 100}>
                    <GlassSurface tier="thin" radius="xl" className="flex items-start gap-[14px] px-[18px] py-[16px]">
                      <span className="glass-navy-thin flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-pill text-amber">
                        <Icon className="h-[19px] w-[19px]" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-serif text-[16px] font-bold text-text">
                          {language === "ro" ? notice.titleRo : notice.title}
                        </p>
                        <p className="mt-[4px] font-serif text-[14.5px] leading-[1.6] text-muted">
                          {language === "ro" ? notice.noteRo : notice.note}
                        </p>
                      </div>
                    </GlassSurface>
                  </Reveal>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
