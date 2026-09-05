"use client";

import { TodayVideoHero } from "@/components/TodayVideoHero";
import { PageContainer } from "@/components/ui/Surfaces";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { getLiturgicalDay2026, REFERENCE_DATE_2026 } from "@/lib/calendar-data/liturgicalYear2026";

function useGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "today.greetingMorning" as const;
  if (hour < 18) return "today.greetingAfternoon" as const;
  return "today.greetingEvening" as const;
}

/**
 * One screen, one scene. The video runs the full height and carries
 * everything the page says.
 *
 * Deliberately nothing else: the parish's services live on the Schedule, the
 * next feast on the Calendar, and announcements on News. Repeating them here
 * only made Today a summary of screens the user can already reach from the
 * navigation.
 */
export default function TodayPage() {
  const { t, language } = useTranslation();
  const day = getLiturgicalDay2026(REFERENCE_DATE_2026);
  const greetingKey = useGreeting();

  const commemorations = day ? (language === "ro" ? day.commemorationsRo : day.commemorationsEn) : "";
  const notes = day ? (language === "ro" ? day.notesRo : day.notesEn) : [];
  const meta = [
    day?.tone != null ? `${t("liturgical.glas")} ${day.tone}` : null,
    notes[0] ?? null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <PageContainer>
      <TodayVideoHero greeting={t(greetingKey)} commemorations={commemorations} meta={meta} />
    </PageContainer>
  );
}
