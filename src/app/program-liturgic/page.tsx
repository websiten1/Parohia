"use client";

import { useEffect, useState } from "react";
import { EmptyState } from "@/components/Feedback";
import { CandleIcon } from "@/components/icons";
import { Reveal } from "@/components/Reveal";
import { getProgramForParish } from "@/lib/data/parishes";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import type { TranslationKey } from "@/lib/i18n/translations";
import { FEAST_DAY_NOTICES } from "@/lib/scheduleData";
import { useSelectedParishId } from "@/lib/storage";
import type { ProgramLiturgic } from "@/lib/types";

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

/** A hairline that fades toward its ends rather than a flat 1px rule, drawn in from the center. */
function OrnamentalSeparator() {
  return (
    <div
      className="anim-draw-line my-[4px] h-px w-full"
      style={{ background: "linear-gradient(to right, transparent, var(--color-amber) 50%, transparent)" }}
      aria-hidden="true"
    />
  );
}

function FeastMark() {
  return <span className="mt-[3px] h-[7px] w-[7px] shrink-0 rotate-45 bg-amber" aria-hidden="true" />;
}

/** Faint arched watermark anchored to the bottom of the screen — this page's one unique "rich moment". */
function ArchWatermark() {
  return (
    <svg
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[220px] w-full opacity-[0.07]"
      viewBox="0 0 400 220"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <path d="M20 220V110a180 180 0 0 1 360 0v110" fill="none" stroke="var(--color-navy)" strokeWidth="3" />
      <path d="M70 220V130a130 130 0 0 1 260 0v90" fill="none" stroke="var(--color-navy)" strokeWidth="2" />
    </svg>
  );
}

export default function ProgramLiturgicPage() {
  const { t, language } = useTranslation();
  const [selectedParishId] = useSelectedParishId();
  const [program, setProgram] = useState<ProgramLiturgic | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const found = selectedParishId ? await getProgramForParish(selectedParishId) : undefined;
      if (!cancelled) setProgram(found ?? null);
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

        {program === null && (
          <div className="mt-[40px]">
            <EmptyState icon={<CandleIcon className="h-[22px] w-[22px]" />} message={t("schedule.emptyState")} />
          </div>
        )}

        {program && (
          <>
            <div className="mt-[28px]">
              {program.saptamanal.map((day, i) => (
                <div key={day.zi}>
                  {i > 0 && <OrnamentalSeparator />}
                  <Reveal delay={i * 90} className={i === 0 ? "mt-0" : "mt-[4px]"}>
                    <div className="py-[14px]">
                      <p className="font-serif text-[20px] font-bold text-burgundy">
                        {t(DAY_LABEL_KEY[day.zi] ?? "schedule.sunday")}
                      </p>
                      <div className="mt-[8px] flex flex-col gap-[8px]">
                        {day.slujbe.map((s) => (
                          <div key={s.nume} className="flex items-baseline justify-between gap-[16px]">
                            <span className="font-sans text-[14px] text-text">{t(SERVICE_LABEL_KEY[s.nume] ?? s.nume)}</span>
                            <span className="shrink-0 whitespace-nowrap font-sans text-[15px] font-bold tabular-nums text-navy">
                              {s.ora}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                </div>
              ))}
            </div>

            <p className="mt-[36px] font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
              {t("schedule.feastDays")}
            </p>

            {FEAST_DAY_NOTICES.map((notice, i) => (
              <Reveal key={notice.id} delay={i * 90} className={i === 0 ? "mt-[16px]" : "mt-[22px]"}>
                <div className="flex gap-[10px]">
                  <FeastMark />
                  <div>
                    <p className="font-serif text-[16px] font-bold text-text">
                      {language === "ro" ? notice.titleRo : notice.title}
                    </p>
                    <p className="mt-[4px] font-serif text-[14.5px] leading-[1.6] text-muted">
                      {language === "ro" ? notice.noteRo : notice.note}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </>
        )}
      </main>
    </div>
  );
}
