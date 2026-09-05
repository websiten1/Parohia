"use client";

import { AppHeader } from "@/components/AppHeader";
import { SegmentedChoice, SettingsRow, Switch } from "@/components/SettingsControls";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { useSettings } from "@/lib/storage";
import { PageContainer } from "@/components/ui/Surfaces";

export default function AppearancePage() {
  const { settings, update, hydrated } = useSettings();
  const { t } = useTranslation();
  if (!hydrated) return null;

  return (
    <PageContainer>
      <AppHeader title={t("appearance.title")} />
      <main className="flex-1 px-outer py-[10px]">
        <SettingsRow label={t("appearance.theme")}>
          <SegmentedChoice
            options={[
              { id: "light", label: t("appearance.light") },
              { id: "system", label: t("appearance.system") },
              { id: "dark", label: t("appearance.dark") },
            ]}
            value={settings.appearance}
            onChange={(v) => update("appearance", v)}
          />
        </SettingsRow>
        {settings.appearance === "dark" && (
          <p className="anim-fade-through pb-[14px] font-sans text-[13.5px] text-muted">{t("appearance.darkNote")}</p>
        )}
        <SettingsRow label={t("appearance.textSize")}>
          <SegmentedChoice
            options={[
              { id: "standard", label: "A" },
              { id: "large", label: "A" },
              { id: "extra-large", label: "A" },
            ]}
            value={settings.textSize}
            onChange={(v) => update("textSize", v)}
          />
        </SettingsRow>
        <SettingsRow label={t("appearance.reduceImagery")}>
          <Switch checked={settings.reduceImagery} onChange={(v) => update("reduceImagery", v)} label={t("appearance.reduceImagery")} />
        </SettingsRow>
        <SettingsRow label={t("appearance.reduceMotion")}>
          <Switch checked={settings.reducedMotion} onChange={(v) => update("reducedMotion", v)} label={t("appearance.reduceMotion")} />
        </SettingsRow>
      </main>
    </PageContainer>
  );
}
