"use client";

import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { EventsClient } from "./EventsClient";

export default function EventsPage() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="px-outer pt-[max(env(safe-area-inset-top),18px)] pb-[20px]">
        <p className="font-serif text-[15px] text-muted">{t("events.eyebrow")}</p>
        <h1 className="mt-[2px] font-serif text-[34px] font-bold leading-[1.05] text-text">{t("events.title")}</h1>
      </header>

      <main className="flex-1">
        <EventsClient />
      </main>
    </div>
  );
}
