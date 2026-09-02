"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ChevronRightIcon } from "@/components/icons";
import { ChevronRow } from "@/components/ChevronRow";
import { SealMark } from "@/components/SealMark";
import { getParishById } from "@/lib/data/parishes";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { useSelectedParishId } from "@/lib/storage";
import type { Parish } from "@/lib/types";

export default function MenuPage() {
  const { t } = useTranslation();
  const [selectedParishId] = useSelectedParishId();
  const [parish, setParish] = useState<Parish | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const found = selectedParishId ? await getParishById(selectedParishId) : undefined;
      if (!cancelled) setParish(found);
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedParishId]);

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <div className="flex items-center gap-[14px] bg-navy-texture px-outer pb-[30px] pt-[max(env(safe-area-inset-top),24px)]">
        <SealMark size={44} tone="light" />
        <p className="font-sans text-[13px] font-semibold uppercase leading-[1.35] tracking-[0.02em] text-white">
          {t("brand.name")}
        </p>
      </div>

      <main className="-mt-[18px] flex-1 rounded-t-3xl bg-surface px-outer pt-[24px] pb-tabbar">
        <Link href="/menu/parish">
          <motion.div
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 500, damping: 32 }}
            className="mb-[36px] flex items-center justify-between gap-[10px] border-b border-divider pb-[18px]"
          >
            <span className="min-w-0">
              {parish ? (
                <>
                  <span className="block truncate font-serif text-[20px] font-bold text-text">{parish.name}</span>
                  <span className="mt-[2px] block truncate font-serif text-[14px] italic text-burgundy">{parish.patronSaint}</span>
                </>
              ) : (
                <span className="block font-sans text-[15px] font-medium text-text">{t("menu.changeParish")}</span>
              )}
            </span>
            <ChevronRightIcon className="h-[16px] w-[16px] shrink-0 text-muted" />
          </motion.div>
        </Link>

        <Section label={t("menu.sectionLibrary")}>
          <ChevronRow href="/menu/bookmarks" title={t("menu.bookmarks")} />
          <ChevronRow href="/menu/notes" title={t("menu.notes")} />
          <ChevronRow href="/menu/downloads" title={t("menu.downloadedAudio")} divider={false} />
        </Section>

        <Section label={t("menu.sectionExplore")}>
          <ChevronRow href="/readings" title={t("menu.readings")} />
          <ChevronRow href="/prayers" title={t("menu.prayers")} />
          <ChevronRow href="/fasting" title={t("menu.fasting")} />
          <ChevronRow href="/resources" title={t("menu.resources")} />
          <ChevronRow href="/events" title={t("menu.events")} divider={false} />
        </Section>

        <Section label={t("menu.sectionParish")}>
          <ChevronRow href="/menu/about" title={t("menu.about")} />
          <ChevronRow href="/menu/bishop" title={t("menu.ourBishop")} />
          <ChevronRow href="/parish-finder" title={t("menu.parishes")} />
          <ChevronRow href="/menu/institutions" title={t("menu.institutions")} />
          <ChevronRow href="/program-liturgic" title={t("menu.liturgicalSchedule")} divider={false} />
        </Section>

        <Section label={t("menu.sectionApplication")}>
          <ChevronRow href="/notifications" title={t("menu.notifications")} />
          <ChevronRow href="/menu/language" title={t("menu.language")} />
          <ChevronRow href="/menu/appearance" title={t("menu.appearance")} />
          <ChevronRow href="/menu/settings" title={t("menu.settings")} divider={false} />
        </Section>
      </main>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-[36px] last:mb-0">
      <p className="pb-[10px] font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">{label}</p>
      {children}
    </div>
  );
}
