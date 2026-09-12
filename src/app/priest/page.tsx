"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRow } from "@/components/ChevronRow";
import { SealMark } from "@/components/SealMark";
import { ClockIcon, MegaphoneIcon } from "@/components/icons";
import { getParishById } from "@/lib/data/parishes";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { signOut, useAccount } from "@/lib/storage";
import type { Parish } from "@/lib/types";
import { PageContainer } from "@/components/ui/Surfaces";
import { SecondaryAction } from "@/components/ui/Controls";

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
  // Two steps on purpose: signing out of a parish is not something to do by
  // brushing a button, and a priest on a phone in a vestry will.
  const [confirming, setConfirming] = useState(false);
  const [leaving, setLeaving] = useState(false);

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
        <SealMark size={44}  />
        <span className="min-w-0">
          <span className="block font-serif text-[19px] font-bold leading-[1.2] text-text">{parish?.name ?? "…"}</span>
          {parish && <span className="mt-[2px] block font-serif text-[13px] italic text-muted">{parish.patronSaint}</span>}
        </span>
      </div>

      <main className="-mt-[18px] flex-1 rounded-t-3xl bg-surface px-outer pt-[28px] pb-tabbar">
        <p className="pb-[10px] font-serif text-[22px] font-bold text-text">{t("priest.sectionManage")}</p>
        <ChevronRow href="/priest/announcements" title={t("priest.announcementsTitle")} subtitle={t("priest.announcementsSubtitle")} icon={<MegaphoneIcon className="h-[16px] w-[16px]" />} />
        <ChevronRow href="/priest/schedule" title={t("priest.scheduleTitle")} subtitle={t("priest.scheduleSubtitle")} icon={<ClockIcon className="h-[16px] w-[16px]" />} divider={false} />

        <div className="mt-[36px] flex flex-col gap-[14px]">
          <p className="font-sans text-[13.5px] leading-[1.6] text-muted">
            {t("priest.signedInAs", { name: account.name })}
          </p>

          {confirming ? (
            <div className="flex flex-col gap-[10px]">
              <p className="font-sans text-[15px] leading-[1.5] text-text">{t("priest.signOutConfirm")}</p>
              <div className="flex gap-[10px]">
                <SecondaryAction onClick={() => setConfirming(false)}>{t("common.cancel")}</SecondaryAction>
                <SecondaryAction
                  onClick={async () => {
                    // Guarded so a double tap cannot fire two sign-outs, and
                    // router.replace rather than push so Back cannot return to
                    // a parish this person is no longer signed in to.
                    if (leaving) return;
                    setLeaving(true);
                    await signOut();
                    router.replace("/login/priest");
                  }}
                >
                  {leaving ? t("priest.signingOut") : t("priest.signOut")}
                </SecondaryAction>
              </div>
            </div>
          ) : (
            <SecondaryAction onClick={() => setConfirming(true)}>{t("priest.signOut")}</SecondaryAction>
          )}
        </div>
      </main>
    </PageContainer>
  );
}
