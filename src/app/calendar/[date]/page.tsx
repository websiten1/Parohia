"use client";

import { notFound, useParams } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { DateDetailCard } from "@/components/DateDetailCard";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { formatMediumDate, getLiturgicalDay, oldCalendarDate } from "@/lib/seedData";

export default function DateDetailPage() {
  const { date } = useParams<{ date: string }>();
  const { t, language } = useTranslation();
  const day = getLiturgicalDay(date);
  if (!day) return notFound();

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <AppHeader title={t("calendar.dateDetailTitle")} backHref="/calendar" />
      <main className="flex-1 px-outer py-[20px]">
        <p className="font-sans text-[12px] text-muted">
          {t("calendar.oldCalendar")}: {formatMediumDate(oldCalendarDate(day.civilDate), language)}
        </p>
        <div className="mt-[10px]">
          <DateDetailCard day={day} />
        </div>
      </main>
    </div>
  );
}
