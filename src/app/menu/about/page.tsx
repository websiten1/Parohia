"use client";

import { AppHeader } from "@/components/AppHeader";
import { SealMark } from "@/components/SealMark";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

export default function AboutPage() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <AppHeader title={t("about.title")} />
      <main className="flex-1 px-outer py-[22px]">
        <div className="flex flex-col items-center text-center">
          <SealMark size={56} />
          <p className="mt-[14px] font-serif text-[19px] font-bold text-text">{t("brand.name")}</p>
        </div>

        <p className="mt-[28px] font-sans text-[15px] leading-[1.55] text-text">{t("about.body")}</p>

        <p className="mt-[24px] font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
          {t("about.missionLabel")}
        </p>
        <p className="mt-[8px] font-sans text-[15px] leading-[1.55] text-text">{t("about.mission")}</p>
      </main>
    </div>
  );
}
