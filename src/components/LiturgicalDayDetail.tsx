"use client";

import { useTranslation } from "@/lib/i18n/LanguageProvider";
import type { LiturgicalDay2026 } from "@/lib/calendar-data/liturgicalYear2026";

interface Props {
  day: LiturgicalDay2026;
}

/**
 * A label/value pair. The label is a field name, not a category kicker, and it
 * carries no decorative rule — the colored underlines this used to draw were
 * five arbitrary hues standing in for meaning the data never had.
 */
function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="font-sans text-[11px] font-medium text-muted">{label}</dt>
      <dd className="mt-[3px] font-sans text-[14px] leading-[1.4] text-text">{value}</dd>
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
  const dateLabel = language === "ro" ? formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1) : formattedDate;

  return (
    <div>
      {/* The day itself leads; the date is a caption underneath it, not a kicker above it. */}
      <h2 className="font-serif text-[20px] font-bold leading-[1.3] text-text">{commemorations}</h2>
      <p className="mt-[7px] flex items-center gap-[8px] font-sans text-[13px] text-muted">
        <span>{dateLabel}</span>
        {day.isMajorFeast && (
          <>
            {/* Same gilded dot the month grid uses for a feast, so the two read as one language. */}
            <span className="h-[4px] w-[4px] shrink-0 rounded-full bg-amber" aria-hidden="true" />
            <span className="font-medium text-text">{t("liturgical.majorFeast")}</span>
          </>
        )}
      </p>

      {(day.tone != null || day.matinsGospel != null || sunday) && (
        <dl className="mt-[20px] flex flex-wrap gap-x-[32px] gap-y-[16px]">
          {day.tone != null && <Field label={t("liturgical.glas")} value={String(day.tone)} />}
          {day.matinsGospel != null && <Field label={t("liturgical.voskresna")} value={String(day.matinsGospel)} />}
          {sunday?.epistle && <Field label={t("liturgical.apostle")} value={sunday.epistle} />}
          {sunday?.gospel && <Field label={t("liturgical.gospel")} value={sunday.gospel} />}
        </dl>
      )}

      {notes.length > 0 && (
        <dl className="mt-[16px]">
          <Field label={t("liturgical.fasting")} value={notes.join(" · ")} />
        </dl>
      )}
    </div>
  );
}
