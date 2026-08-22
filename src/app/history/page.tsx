"use client";

import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { REFERENCE_DATE_2026 } from "@/lib/calendar-data/liturgicalYear2026";
import { getOnThisDay, ROEA_TIMELINE, ST_GEORGE_CATHEDRAL } from "@/lib/historyData";

const ACCENT_TEXT = ["text-clay", "text-slate", "text-violet", "text-forest", "text-burgundy"];

export default function HistoryPage() {
  const { t, language } = useTranslation();
  const [, month, day] = REFERENCE_DATE_2026.split("-").map(Number);
  const todayEvents = getOnThisDay(month, day);

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="px-outer pt-[max(env(safe-area-inset-top),18px)] pb-[16px]">
        <h1 className="font-serif text-[30px] font-bold text-text">{t("history.title")}</h1>
      </header>

      <main className="flex-1 px-outer pb-tabbar">
        <section>
          <p className="font-sans text-[10.5px] font-semibold uppercase tracking-[0.08em] text-clay">{t("history.onThisDay")}</p>
          {todayEvents.length === 0 ? (
            <p className="mt-[8px] font-sans text-[14px] italic leading-[1.5] text-muted">{t("history.noEventToday")}</p>
          ) : (
            todayEvents.map((event) => (
              <div key={event.id} className="mt-[10px]">
                <p className="font-serif text-[19px] font-bold leading-[1.3] text-text">
                  {language === "ro" ? event.headlineRo : event.headline}
                </p>
                <p className="mt-[6px] font-sans text-[13.5px] leading-[1.55] text-text/80">
                  {language === "ro" ? event.bodyRo : event.body}
                </p>
              </div>
            ))
          )}
        </section>

        <section className="mt-[40px]">
          <p className="font-serif text-[22px] font-bold leading-[1.25] text-text">{t("history.timelineTitle")}</p>

          <div className="mt-[28px] flex flex-col gap-[36px]">
            {ROEA_TIMELINE.map((event, i) => {
              const accentClass = ACCENT_TEXT[i % ACCENT_TEXT.length];
              return (
                <div key={event.id}>
                  <p
                    className="font-serif font-bold leading-none text-text/10"
                    style={{ fontSize: "64px", WebkitTextStroke: "1px var(--color-divider)", color: "transparent" }}
                  >
                    {event.year}
                  </p>
                  <p className={`-mt-[30px] font-sans text-[11px] font-semibold uppercase tracking-[0.08em] ${accentClass}`}>
                    {event.place ?? (language === "ro" ? event.placeRo : event.place)}
                  </p>
                  <p className="mt-[6px] font-serif text-[20px] font-bold leading-[1.25] text-text">
                    {language === "ro" ? event.headlineRo : event.headline}
                  </p>
                  <p className="mt-[8px] font-sans text-[14px] leading-[1.6] text-text/80">
                    {language === "ro" ? event.bodyRo : event.body}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-[40px] rounded-md bg-navy-texture px-[18px] py-[20px]">
          <p className="font-sans text-[10.5px] font-semibold uppercase tracking-[0.08em] text-white/55">
            {t("history.cathedralSpotlight")}
          </p>
          <p className="mt-[8px] font-serif text-[21px] font-bold leading-[1.25] text-white">
            {language === "ro" ? ST_GEORGE_CATHEDRAL.nameRo : ST_GEORGE_CATHEDRAL.name}
          </p>
          <p className="mt-[2px] font-sans text-[12.5px] text-white/60">
            {t("history.founded", { year: ST_GEORGE_CATHEDRAL.founded })} · {ST_GEORGE_CATHEDRAL.deanery}
          </p>
          <p className="mt-[12px] font-sans text-[13.5px] leading-[1.6] text-white/85">
            {language === "ro" ? ST_GEORGE_CATHEDRAL.bodyRo : ST_GEORGE_CATHEDRAL.body}
          </p>

          <p className="mt-[16px] font-sans text-[13px] text-white/75">{ST_GEORGE_CATHEDRAL.address}</p>
          <p className="mt-[2px] font-sans text-[13px] text-white/75">
            {ST_GEORGE_CATHEDRAL.phone} · {ST_GEORGE_CATHEDRAL.email}
          </p>

          <div className="mt-[16px] flex flex-col gap-[8px] border-t border-white/15 pt-[14px]">
            {ST_GEORGE_CATHEDRAL.clergy.map((c) => (
              <div key={c.name} className="flex items-baseline justify-between gap-[10px]">
                <span className="font-sans text-[13.5px] text-white">{c.name}</span>
                <span className="shrink-0 font-sans text-[11.5px] text-white/55">{language === "ro" ? c.roleRo : c.role}</span>
              </div>
            ))}
          </div>

          <details className="mt-[16px] border-t border-white/15 pt-[14px]">
            <summary className="press cursor-pointer font-sans text-[13px] font-semibold text-white">
              {t("history.directions")}
            </summary>
            <p className="mt-[8px] whitespace-pre-line font-sans text-[12px] leading-[1.6] text-white/60">
              {ST_GEORGE_CATHEDRAL.directions}
            </p>
          </details>
        </section>
      </main>
    </div>
  );
}
