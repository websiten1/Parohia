"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { dayTitle, weekdayOf } from "@/lib/seedData";
import type { LiturgicalDay } from "@/lib/types";

export function DateDetailCard({ day }: { day: LiturgicalDay }) {
  const { t, language } = useTranslation();
  const dayNum = Number(day.civilDate.slice(-2));
  const monthName = new Date(day.civilDate + "T00:00:00").toLocaleDateString(language === "ro" ? "ro-RO" : "en-US", {
    month: "long",
  });
  const hasSaint = day.saints.length > 0;
  const weekday = weekdayOf(day.civilDate, language);

  return (
    <div>
      <p className="font-serif text-[19px] font-bold text-text">
        {weekday.charAt(0) + weekday.slice(1).toLowerCase()}, {monthName} {dayNum}
      </p>
      <p className="mt-[6px] font-serif text-[17px] leading-[1.3] text-text">{dayTitle(day, language)}</p>
      <p className="mt-[6px] font-sans text-[13px] text-muted">{t("calendar.toneAndGospel", { tone: day.tone })}</p>
      {hasSaint && (
        <Link
          href={`/saint/${day.saints[0]}`}
          className="press mt-[10px] inline-block font-sans text-[13px] font-semibold text-navy"
        >
          {t("calendar.saintOfTheDay")}
        </Link>
      )}
    </div>
  );
}
