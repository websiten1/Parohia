"use client";

import { AppHeader } from "@/components/AppHeader";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import type { TranslationKey } from "@/lib/i18n/translations";

const INSTITUTIONS: { nameKey: TranslationKey; descriptionKey: TranslationKey }[] = [
  { nameKey: "institutions.camp", descriptionKey: "institutions.campDesc" },
  { nameKey: "institutions.scholarship", descriptionKey: "institutions.scholarshipDesc" },
  { nameKey: "institutions.heritage", descriptionKey: "institutions.heritageDesc" },
  { nameKey: "institutions.council", descriptionKey: "institutions.councilDesc" },
];

export default function InstitutionsPage() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <AppHeader title={t("institutions.title")} />
      <main className="flex-1 px-outer py-[16px]">
        {INSTITUTIONS.map((inst, i) => (
          <div key={inst.nameKey} className={`py-[16px] ${i !== INSTITUTIONS.length - 1 ? "border-b border-divider" : ""}`}>
            <p className="font-serif text-[17px] font-bold text-text">{t(inst.nameKey)}</p>
            <p className="mt-[4px] font-sans text-[13.5px] leading-[1.5] text-muted">{t(inst.descriptionKey)}</p>
          </div>
        ))}
      </main>
    </div>
  );
}
