"use client";

import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import type { TranslationKey } from "@/lib/i18n/translations";

const NOTIFICATIONS: { id: number; titleKey: TranslationKey; bodyKey: TranslationKey; timeKey: TranslationKey; unread: boolean }[] = [
  {
    id: 1,
    titleKey: "notifications.item1Title",
    bodyKey: "notifications.item1Body",
    timeKey: "notifications.item1Time",
    unread: true,
  },
  {
    id: 2,
    titleKey: "notifications.item2Title",
    bodyKey: "notifications.item2Body",
    timeKey: "notifications.item2Time",
    unread: true,
  },
  {
    id: 3,
    titleKey: "notifications.item3Title",
    bodyKey: "notifications.item3Body",
    timeKey: "notifications.item3Time",
    unread: false,
  },
];

export default function NotificationsPage() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <AppHeader title={t("notifications.title")} backHref="/today" />
      <main className="flex-1 px-outer py-[10px]">
        {NOTIFICATIONS.map((n, i) => (
          <div key={n.id} className={`flex items-start justify-between gap-[12px] py-[16px] ${i !== NOTIFICATIONS.length - 1 ? "border-b border-divider" : ""}`}>
            <div className="min-w-0 flex-1">
              <p className="font-sans text-[14px] font-semibold text-text">{t(n.titleKey)}</p>
              <p className="mt-[3px] font-sans text-[13px] text-muted">{t(n.bodyKey)}</p>
              <p className="mt-[4px] font-sans text-[11px] text-muted">{t(n.timeKey)}</p>
            </div>
            {n.unread && <span className="mt-[5px] h-[7px] w-[7px] shrink-0 rounded-full bg-burgundy" />}
          </div>
        ))}

        <p className="mt-[32px] text-center font-sans text-[12.5px] text-muted">
          {t("notifications.manageIn")}{" "}
          <Link href="/menu/settings" className="font-semibold text-navy underline underline-offset-2">
            {t("notifications.settings")}
          </Link>
          .
        </p>
      </main>
    </div>
  );
}
