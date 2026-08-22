"use client";

import { AppHeader } from "@/components/AppHeader";
import { PhotoHero } from "@/components/PhotoHero";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

export default function BishopPage() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <AppHeader title={t("bishop.title")} />
      <main className="flex-1 px-outer py-[16px]">
        <PhotoHero alt="Bishop portrait" scrim="none" className="h-[220px] w-full rounded-md" />
        <p className="mt-[16px] font-serif text-[21px] font-bold text-text">{t("bishop.name")}</p>
        <p className="mt-[2px] font-sans text-[13px] text-muted">{t("bishop.role")}</p>
        <p className="mt-[18px] font-sans text-[15px] leading-[1.55] text-text">{t("bishop.body")}</p>
      </main>
    </div>
  );
}
