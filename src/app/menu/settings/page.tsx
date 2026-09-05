"use client";

import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { ChevronRightIcon } from "@/components/icons";
import { SegmentedChoice, SettingsRow, SettingsSectionLabel, Switch } from "@/components/SettingsControls";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { PageContainer } from "@/components/ui/Surfaces";
import { useSettings } from "@/lib/storage";

export default function SettingsPage() {
  const { settings, update, hydrated } = useSettings();
  const { t } = useTranslation();

  if (!hydrated) return null;

  return (
    <PageContainer>
      <AppHeader title={t("settings.title")} />
      <main className="flex-1 px-outer pb-[48px] pt-[6px]">
        <Link href="/menu/sign-in" className="press flex min-h-[60px] items-center justify-between gap-[16px] py-[10px]">
          <span className="font-sans text-[16.5px] text-text">{t("settings.accountSignIn")}</span>
          <ChevronRightIcon className="h-[16px] w-[16px] shrink-0 text-muted/60" />
        </Link>

        <SettingsSectionLabel>{t("settings.calendarSection")}</SettingsSectionLabel>
        <SettingsRow label={t("settings.calendarStyle")}>
          <SegmentedChoice
            options={[
              { id: "new", label: t("settings.calendarNew") },
              { id: "old", label: t("settings.calendarOld") },
            ]}
            value={settings.calendarPreference}
            onChange={(v) => update("calendarPreference", v)}
          />
        </SettingsRow>

        <SettingsSectionLabel>{t("settings.notificationsSection")}</SettingsSectionLabel>
        <SettingsRow label={t("settings.feastReminders")}>
          <Switch checked={settings.notificationsFeastReminders} onChange={(v) => update("notificationsFeastReminders", v)} label={t("settings.feastReminders")} />
        </SettingsRow>
        <SettingsRow label={t("settings.fastingReminders")}>
          <Switch checked={settings.notificationsFastingReminders} onChange={(v) => update("notificationsFastingReminders", v)} label={t("settings.fastingReminders")} />
        </SettingsRow>
        <SettingsRow label={t("settings.sundayReminder")}>
          <Switch checked={settings.notificationsSundayReminder} onChange={(v) => update("notificationsSundayReminder", v)} label={t("settings.sundayReminder")} />
        </SettingsRow>
        <SettingsRow label={t("settings.parishEventUpdates")}>
          <Switch checked={settings.notificationsParishEvents} onChange={(v) => update("notificationsParishEvents", v)} label={t("settings.parishEventUpdates")} />
        </SettingsRow>
        <SettingsRow label={t("settings.diocesanAnnouncements")}>
          <Switch checked={settings.notificationsDiocesanAnnouncements} onChange={(v) => update("notificationsDiocesanAnnouncements", v)} label={t("settings.diocesanAnnouncements")} />
        </SettingsRow>

        <SettingsSectionLabel>{t("settings.storageSection")}</SettingsSectionLabel>
        <Link href="/menu/downloads" className="press flex min-h-[60px] items-center justify-between gap-[16px] py-[10px]">
          <span className="font-sans text-[16.5px] text-text">{t("settings.audioDownloads")}</span>
          <ChevronRightIcon className="h-[16px] w-[16px] shrink-0 text-muted/60" />
        </Link>

        <SettingsSectionLabel>{t("settings.privacySection")}</SettingsSectionLabel>
        <p className="pb-[6px] font-sans text-[15px] leading-[1.55] text-muted">{t("settings.privacyBody")}</p>
      </main>
    </PageContainer>
  );
}
