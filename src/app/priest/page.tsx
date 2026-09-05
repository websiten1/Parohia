"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRow } from "@/components/ChevronRow";
import { SealMark } from "@/components/SealMark";
import { ClockIcon, MegaphoneIcon } from "@/components/icons";
import { getParishById } from "@/lib/data/parishes";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { useAccount } from "@/lib/storage";
import type { Parish } from "@/lib/types";
import { PageContainer } from "@/components/ui/Surfaces";

/**
 * Priest admin home. A priest account is bound to exactly one parish (see
 * Account.parishId), so there is nothing here to scope or switch between —
 * every action reachable from this screen only ever touches that one parish.
 */
export default function PriestDashboardPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [account, , hydrated] = useAccount();
  const [parish, setParish] = useState<Parish | undefined>(undefined);

  useEffect(() => {
    if (!hydrated) return;
    if (account?.role !== "priest" || !account.parishId) {
      router.replace("/login/priest");
      return;
    }
    getParishById(account.parishId).then(setParish);
  }, [account, hydrated, router]);

  if (!hydrated || !account || account.role !== "priest") return null;

  return (
    <PageContainer wash="coral">
      <div className="flex items-center gap-[14px] bg-navy-texture px-outer pb-[30px] pt-[max(env(safe-area-inset-top),24px)]">
        <SealMark size={44} tone="light" />
        <span className="min-w-0">
          <span className="block font-serif text-[19px] font-bold leading-[1.2] text-white">{parish?.name ?? "…"}</span>
          {parish && <span className="mt-[2px] block font-serif text-[13px] italic text-white/70">{parish.patronSaint}</span>}
        </span>
      </div>

      <main className="-mt-[18px] flex-1 rounded-t-3xl bg-surface px-outer pt-[28px] pb-tabbar">
        <p className="pb-[10px] font-serif text-[22px] font-bold text-text">{t("priest.sectionManage")}</p>
        <ChevronRow href="/priest/announcements" title={t("priest.announcementsTitle")} subtitle={t("priest.announcementsSubtitle")} icon={<MegaphoneIcon className="h-[16px] w-[16px]" />} />
        <ChevronRow href="/priest/schedule" title={t("priest.scheduleTitle")} subtitle={t("priest.scheduleSubtitle")} icon={<ClockIcon className="h-[16px] w-[16px]" />} divider={false} />

        <p className="mt-[36px] font-sans text-[13.5px] leading-[1.6] text-muted">{t("priest.signedInAs", { name: account.name })}</p>
      </main>
    </PageContainer>
  );
}
