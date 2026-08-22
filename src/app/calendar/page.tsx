"use client";

import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { CalendarClient } from "./CalendarClient";

export default function CalendarPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="px-outer pt-[max(env(safe-area-inset-top),18px)]">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">{t("calendar.eyebrow")}</p>
      </header>
      <main className="flex-1 px-outer pt-[4px] pb-tabbar">
        <CalendarClient />
      </main>
    </div>
  );
}
