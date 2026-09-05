"use client";

import { useEffect, useState } from "react";
import { CandleIcon } from "@/components/icons";
import { EmptyState } from "@/components/Feedback";
import { Reveal } from "@/components/Reveal";
import { PageBody, PageContainer, SectionHeader, SoftCard } from "@/components/ui/Surfaces";
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
    <PageContainer wash="cyan">
      <header className="px-outer pt-[max(env(safe-area-inset-top),24px)]">
        <h1 className="font-serif text-[32px] font-bold leading-[1.1] text-text">{t("schedule.title")}</h1>
        {parish && (
          <p className="mt-[8px] font-serif text-[16px] italic leading-[1.4] text-muted">
            {parish.name} · {parish.patronSaint}
          </p>
        )}
      </header>

      <PageBody className="pt-[28px]">
        {program === null && (
          <Reveal delay={0} className="mt-[24px]">
            <EmptyState
              icon={<CandleIcon className="h-[22px] w-[22px]" />}
              message={parish ? `${parish.name} — ${t("schedule.emptyState")}` : t("schedule.emptyState")}
            />
          </Reveal>
        )}

        {program && (
          <>
            {/* One day per soft surface — grouped by material rather than by a rule. */}
            <div className="flex flex-col gap-[14px]">
              {program.saptamanal.map((day, i) => (
                <Reveal key={day.zi} delay={i * 90}>
                  <SoftCard>
                    <h2 className="font-serif text-[20px] font-bold text-text">
                      {t(WEEKDAY_LABEL_KEY[day.zi] ?? "schedule.sunday")}
                    </h2>
                    <div className="mt-[14px] flex flex-col gap-[12px]">
                      {day.slujbe.map((s) => (
                        <div key={s.nume} className="flex items-baseline justify-between gap-[16px]">
                          <span className="font-sans text-[15.5px] text-text-secondary">
                            {SERVICE_LABEL_KEY[s.nume] ? t(SERVICE_LABEL_KEY[s.nume]) : s.nume}
                          </span>
                          <span className="shrink-0 whitespace-nowrap font-serif text-[19px] font-bold tabular-nums text-text">
                            {s.ora}
                          </span>
                        </div>
                      ))}
                    </div>
                  </SoftCard>
                </Reveal>
              ))}
            </div>

            <div className="mt-[44px]">
              <SectionHeader>{t("schedule.feastDays")}</SectionHeader>
              <div className="mt-[18px] flex flex-col gap-[22px]">
                {(program.praznice.length > 0
                  ? program.praznice.map((p) => ({
                      id: p.titlu,
                      title: p.titlu,
                      titleRo: p.titlu,
                      note: p.descriere,
                      noteRo: p.descriere,
                    }))
                  : FEAST_DAY_NOTICES
                ).map((notice, i) => (
                  <Reveal key={notice.id} delay={i * 90}>
                    {/* No badge beside these: the section heading already says
                        what they are, and an identical marker on every row
                        carries no information. */}
                    <div className="min-w-0">
                      <p className="font-serif text-[18px] font-bold leading-[1.25] text-text">
                        {language === "ro" ? notice.titleRo : notice.title}
                      </p>
                      <p className="mt-[6px] font-serif text-[15.5px] leading-[1.55] text-muted">
                        {language === "ro" ? notice.noteRo : notice.note}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </>
        )}
      </PageBody>
    </PageContainer>
  );
}
