"use client";

import { ChevronRow } from "@/components/ChevronRow";
import { SealMark } from "@/components/SealMark";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

export default function MenuPage() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <div className="flex items-center gap-[14px] bg-navy-texture px-outer pb-[26px] pt-[max(env(safe-area-inset-top),24px)]">
        <SealMark size={44} tone="light" />
        <p className="font-sans text-[13px] font-semibold uppercase leading-[1.35] tracking-[0.02em] text-white">
          {t("brand.name")}
        </p>
      </div>

      <main className="-mt-[14px] flex-1 rounded-t-sheet bg-surface px-outer pt-[20px] pb-tabbar">
        <Section label={t("menu.sectionLibrary")}>
          <ChevronRow href="/menu/bookmarks" title={t("menu.bookmarks")} />
          <ChevronRow href="/menu/notes" title={t("menu.notes")} />
          <ChevronRow href="/menu/downloads" title={t("menu.downloadedAudio")} divider={false} />
        </Section>

        <Section label={t("menu.sectionExplore")}>
          <ChevronRow href="/readings" title={t("menu.readings")} />
          <ChevronRow href="/prayers" title={t("menu.prayers")} />
          <ChevronRow href="/fasting" title={t("menu.fasting")} />
          <ChevronRow href="/resources" title={t("menu.resources")} />
          <ChevronRow href="/events" title={t("menu.events")} divider={false} />
        </Section>

        <Section label={t("menu.sectionParish")}>
          <ChevronRow href="/menu/about" title={t("menu.about")} />
          <ChevronRow href="/menu/bishop" title={t("menu.ourBishop")} />
          <ChevronRow href="/parish-finder" title={t("menu.parishes")} />
          <ChevronRow href="/menu/institutions" title={t("menu.institutions")} />
          <ChevronRow href="/program-liturgic" title={t("menu.liturgicalSchedule")} divider={false} />
        </Section>

        <Section label={t("menu.sectionApplication")}>
          <ChevronRow href="/notifications" title={t("menu.notifications")} />
          <ChevronRow href="/menu/language" title={t("menu.language")} />
          <ChevronRow href="/menu/appearance" title={t("menu.appearance")} />
          <ChevronRow href="/menu/settings" title={t("menu.settings")} divider={false} />
        </Section>
      </main>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-[28px] last:mb-0">
      <p className="pb-[6px] font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">{label}</p>
      {children}
    </div>
  );
}
