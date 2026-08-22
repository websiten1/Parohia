"use client";

import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { FEAST_DAY_NOTICES, WEEKLY_SCHEDULE } from "@/lib/scheduleData";

export default function SchedulePage() {
  const { t, language } = useTranslation();

  const grouped = WEEKLY_SCHEDULE.reduce<Record<string, typeof WEEKLY_SCHEDULE>>((acc, entry) => {
    const key = language === "ro" ? entry.dayRo : entry.day;
    (acc[key] ??= []).push(entry);
    return acc;
  }, {});

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="px-outer pt-[max(env(safe-area-inset-top),18px)] pb-[16px]">
        <h1 className="font-serif text-[30px] font-bold text-text">{t("schedule.title")}</h1>
      </header>

      <main className="flex-1 px-outer pb-tabbar">
        <section>
          <p className="font-sans text-[10.5px] font-semibold uppercase tracking-[0.08em] text-clay">
            {t("schedule.weekly")}
          </p>

          <div className="mt-[14px] flex flex-col gap-[20px]">
            {Object.entries(grouped).map(([day, entries]) => (
              <div key={day} className="border-b border-divider pb-[16px] last:border-none">
                <p className="font-serif text-[19px] font-bold leading-[1.3] text-text">{day}</p>
                <div className="mt-[8px] flex flex-col gap-[6px]">
                  {entries.map((entry) => (
                    <div key={entry.id} className="flex items-baseline justify-between gap-[10px]">
                      <span className="font-sans text-[14px] text-text/80">
                        {language === "ro" ? entry.serviceRo : entry.service}
                      </span>
                      <span className="shrink-0 font-sans text-[13.5px] font-semibold text-navy">{entry.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-[14px] font-sans text-[12.5px] italic leading-[1.5] text-muted">{t("schedule.editNote")}</p>
        </section>

        <section className="mt-[36px]">
          <p className="font-sans text-[10.5px] font-semibold uppercase tracking-[0.08em] text-clay">
            {t("schedule.feastDays")}
          </p>
          <div className="mt-[14px] flex flex-col gap-[18px]">
            {FEAST_DAY_NOTICES.map((notice) => (
              <div key={notice.id}>
                <p className="font-serif text-[16px] font-bold leading-[1.3] text-text">
                  {language === "ro" ? notice.titleRo : notice.title}
                </p>
                <p className="mt-[4px] font-sans text-[13.5px] leading-[1.55] text-text/80">
                  {language === "ro" ? notice.noteRo : notice.note}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
