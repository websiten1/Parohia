"use client";

import { useEffect, useState } from "react";
import { CandleIcon, CrossIcon } from "@/components/icons";
import { EmptyState } from "@/components/Feedback";
import { Reveal } from "@/components/Reveal";
import { getParishById, getProgramForParish, WEEKDAY_LABEL_KEY } from "@/lib/data/parishes";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import type { TranslationKey } from "@/lib/i18n/translations";
import { FEAST_DAY_NOTICES } from "@/lib/scheduleData";
import { useSelectedParishId } from "@/lib/storage";
import type { Parish, ProgramLiturgic } from "@/lib/types";

const SERVICE_LABEL_KEY: Record<string, TranslationKey> = {
  Matins: "schedule.matins",
  "Divine Liturgy": "schedule.divineLiturgy",
  Vespers: "schedule.vespers",
  "Paraclesis to the Theotokos": "schedule.paraclesis",
};

/** Each day reads as its own paragraph, told apart by a heading color and generous space — never a bordered box. */
const DAY_TEXT_COLOR: Record<string, string> = {
  Duminică: "text-burgundy",
  Luni: "text-clay",
  Marți: "text-violet",
  Miercuri: "text-teal",
  Joi: "text-forest",
  Vineri: "text-plum",
  Sâmbătă: "text-slate",
};

const FEAST_ICONS = [CandleIcon, CrossIcon];

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
    <div className="flex min-h-dvh flex-col bg-background">
      <main className="flex-1 px-outer pt-[max(env(safe-area-inset-top),24px)] pb-tabbar">
        <h1 className="font-serif text-[32px] font-bold leading-[1.1] text-text">{t("schedule.title")}</h1>
        {parish && (
          <p className="mt-[6px] font-serif text-[15px] italic text-burgundy">
            {parish.name} · {parish.patronSaint}
          </p>
        )}

        {program === null && (
          <Reveal delay={0} className="mt-[48px]">
            <EmptyState
              icon={<CandleIcon className="h-[22px] w-[22px]" />}
              message={parish ? `${parish.name} — ${t("schedule.emptyState")}` : t("schedule.emptyState")}
            />
          </Reveal>
        )}

        {program && (
          <>
            <div className="mt-[38px] flex flex-col gap-[36px]">
              {program.saptamanal.map((day, i) => (
                <Reveal key={day.zi} delay={i * 100}>
                  <p className={`font-serif text-[21px] font-bold ${DAY_TEXT_COLOR[day.zi] ?? "text-burgundy"}`}>
                    {t(WEEKDAY_LABEL_KEY[day.zi] ?? "schedule.sunday")}
                  </p>
                  <div className="mt-[10px] flex flex-col gap-[8px]">
                    {day.slujbe.map((s) => (
                      <div key={s.nume} className="flex items-baseline justify-between gap-[16px]">
                        <span className="font-sans text-[14px] text-muted">
                          {SERVICE_LABEL_KEY[s.nume] ? t(SERVICE_LABEL_KEY[s.nume]) : s.nume}
                        </span>
                        <span className="shrink-0 whitespace-nowrap font-serif text-[18px] font-bold tabular-nums text-navy">
                          {s.ora}
                        </span>
                      </div>
                    ))}
                  </div>
                </Reveal>
              ))}
            </div>

            <p className="mt-[48px] font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
              {t("schedule.feastDays")}
            </p>

            <div className="mt-[20px] flex flex-col gap-[26px]">
              {(program.praznice.length > 0
                ? program.praznice.map((p) => ({ id: p.titlu, title: p.titlu, titleRo: p.titlu, note: p.descriere, noteRo: p.descriere }))
                : FEAST_DAY_NOTICES
              ).map((notice, i) => {
                const Icon = FEAST_ICONS[i % FEAST_ICONS.length];
                return (
                  <Reveal key={notice.id} delay={i * 100}>
                    <div className="flex items-start gap-[12px]">
                      <Icon className="mt-[3px] h-[17px] w-[17px] shrink-0 text-amber" />
                      <div className="min-w-0">
                        <p className="font-serif text-[16px] font-bold text-text">
                          {language === "ro" ? notice.titleRo : notice.title}
                        </p>
                        <p className="mt-[4px] font-serif text-[14.5px] leading-[1.6] text-muted">
                          {language === "ro" ? notice.noteRo : notice.note}
                        </p>
                      </div>
                    </div>
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
