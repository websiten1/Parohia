"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRightIcon } from "@/components/icons";
import { ChevronRow } from "@/components/ChevronRow";
import { PageBody, PageContainer, SectionHeader, TintedFeatureCard } from "@/components/ui/Surfaces";
import { getParishById } from "@/lib/data/parishes";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { useSelectedParishId } from "@/lib/storage";
import { DOMAIN_TINT } from "@/lib/tints";
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
    <PageContainer wash="rose">
      <header className="px-outer pt-[max(env(safe-area-inset-top),24px)]">
        <h1 className="font-serif text-[32px] font-bold leading-[1.1] text-text">{t("brand.name")}</h1>
      </header>

      <PageBody className="pt-[24px]">
        {/* The user's own parish is the one piece of identity on this screen,
            so it carries the page's single tinted surface. */}
        <Link href="/menu/parish" className="block">
          <TintedFeatureCard tint={DOMAIN_TINT.parish}>
            <div className="flex items-center gap-[14px]">
              <span className="min-w-0 flex-1">
                {parish ? (
                  <>
                    <span className="block font-serif text-[21px] font-bold leading-[1.2]">{parish.name}</span>
                    <span className="mt-[5px] block font-serif text-[15px] italic opacity-80">{parish.patronSaint}</span>
                  </>
                ) : (
                  <span className="block font-sans text-[16px] font-medium">{t("menu.changeParish")}</span>
                )}
              </span>
              <ChevronRightIcon className="h-[17px] w-[17px] shrink-0 opacity-60" />
            </div>
          </TintedFeatureCard>
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
      </PageBody>
    </PageContainer>
  );
}

/** Rows are grouped by space and a heading, not boxed into separate containers. (§12, §18) */
function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-[40px]">
      <SectionHeader className="mb-[6px]">{label}</SectionHeader>
      {children}
    </div>
  );
}
