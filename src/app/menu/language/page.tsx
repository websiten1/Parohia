"use client";

import { AppHeader } from "@/components/AppHeader";
import { SegmentedChoice, SettingsRow } from "@/components/SettingsControls";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { useSettings } from "@/lib/storage";
import { PageContainer } from "@/components/ui/Surfaces";

export default function LanguagePage() {
  const { settings, update, hydrated } = useSettings();
  const { t } = useTranslation();
  if (!hydrated) return null;

  return (
    <PageContainer>
      <AppHeader title={t("language.title")} />
      <main className="flex-1 px-outer py-[10px]">
        <SettingsRow label={t("language.appLanguage")}>
          <SegmentedChoice
            options={[
              { id: "en", label: "EN" },
              { id: "ro", label: "RO" },
            ]}
            value={settings.language}
            onChange={(v) => update("language", v)}
          />
        </SettingsRow>
        <p className="mt-[20px] font-sans text-[15px] leading-[1.5] text-muted">{t("language.explanation")}</p>
      </main>
    </PageContainer>
  );
}
