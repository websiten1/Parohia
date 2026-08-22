"use client";

import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { ChevronRightIcon } from "@/components/icons";
import { SegmentedChoice, SettingsRow, SettingsSectionLabel, Switch } from "@/components/SettingsControls";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { useSettings } from "@/lib/storage";

export default function SettingsPage() {
  const { settings, update, hydrated } = useSettings();
  const { t } = useTranslation();

  if (!hydrated) return null;

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <AppHeader title={t("settings.title")} />
      <main className="flex-1 px-outer py-[10px] pb-[40px]">
        <Link href="/menu/sign-in" className="press flex items-center justify-between border-b border-divider py-[14px]">
          <span className="font-sans text-[14.5px] text-text">{t("settings.accountSignIn")}</span>
          <ChevronRightIcon className="h-[16px] w-[16px] text-muted" />
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
        <Link href="/menu/downloads" className="press flex items-center justify-between border-b border-divider py-[14px]">
          <span className="font-sans text-[14.5px] text-text">{t("settings.audioDownloads")}</span>
          <ChevronRightIcon className="h-[16px] w-[16px] text-muted" />
        </Link>

        <SettingsSectionLabel>{t("settings.privacySection")}</SettingsSectionLabel>
        <p className="pb-[6px] font-sans text-[13.5px] leading-[1.5] text-muted">{t("settings.privacyBody")}</p>
      </main>
    </div>
  );
}
