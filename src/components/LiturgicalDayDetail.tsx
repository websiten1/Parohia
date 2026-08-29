"use client";

import { useTranslation } from "@/lib/i18n/LanguageProvider";
import type { LiturgicalDay2026 } from "@/lib/calendar-data/liturgicalYear2026";

interface Props {
  day: LiturgicalDay2026;
}

const MARKER_ACCENT = {
  slate: "decoration-slate",
  violet: "decoration-violet",
  clay: "decoration-clay",
  burgundy: "decoration-burgundy",
  forest: "decoration-forest",
} as const;

function Marker({ label, value, accent }: { label: string; value: string; accent: keyof typeof MARKER_ACCENT }) {
  return (
    <div className="min-w-0">
      <p
        className={`inline font-sans text-[10.5px] font-semibold uppercase tracking-[0.07em] text-muted underline decoration-2 underline-offset-[5px] ${MARKER_ACCENT[accent]}`}
      >
        {label}
      </p>
      <p className="mt-[5px] font-sans text-[13.5px] leading-[1.4] text-text">{value}</p>
    </div>
  );
}

/** Rich day-detail panel used on the Calendar month page. */
export function LiturgicalDayDetail({ day }: Props) {
  const { t, language } = useTranslation();
  const commemorations = language === "ro" ? day.commemorationsRo : day.commemorationsEn;
  const notes = language === "ro" ? day.notesRo : day.notesEn;
  const sunday = language === "ro" ? day.sundayRo : day.sundayEn;
  const dateObj = new Date(day.date + "T00:00:00");
  const formattedDate = dateObj.toLocaleDateString(language === "ro" ? "ro-RO" : "en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div>
      <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.06em] text-muted">
        {language === "ro" ? formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1) : formattedDate}
        {day.isMajorFeast && (
          <span className="ml-[8px] rounded-pill bg-burgundy-10 px-[8px] py-[2px] text-burgundy">{t("liturgical.majorFeast")}</span>
        )}
      </p>
      <p className="mt-[6px] font-serif text-[19px] font-bold leading-[1.3] text-text">{commemorations}</p>

      {(day.tone != null || day.matinsGospel != null || sunday) && (
        <div className="mt-[18px] flex flex-wrap gap-x-[28px] gap-y-[16px]">
          {day.tone != null && <Marker label={t("liturgical.glas")} value={String(day.tone)} accent="slate" />}
          {day.matinsGospel != null && (
            <Marker label={t("liturgical.voskresna")} value={String(day.matinsGospel)} accent="violet" />
          )}
          {sunday?.epistle && <Marker label={t("liturgical.apostle")} value={sunday.epistle} accent="clay" />}
          {sunday?.gospel && <Marker label={t("liturgical.gospel")} value={sunday.gospel} accent="burgundy" />}
        </div>
      )}

      {notes.length > 0 && (
        <div className="mt-[16px]">
          <Marker label={t("liturgical.fasting")} value={notes.join(" · ")} accent="forest" />
        </div>
      )}
    </div>
  );
}
