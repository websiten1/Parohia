"use client";

import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons";
import { PhotoHero } from "@/components/PhotoHero";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { PRAYERS } from "@/lib/seedData";
import { PageContainer } from "@/components/ui/Surfaces";

export default function PrayersPage() {
  const { t, language } = useTranslation();
  return (
    <PageContainer wash="violet">
      <PhotoHero alt="Church interior" scrim="full" className="h-[252px] w-full shrink-0">
        <div className="absolute inset-x-0 bottom-0 px-outer pb-[22px] pt-[max(env(safe-area-inset-top),40px)]">
          <h1 className="font-serif text-[32px] font-bold text-white">{t("prayers.title")}</h1>
          <p className="mt-[6px] font-serif text-[15px] italic text-white/70">{t("prayers.quote")}</p>
        </div>
      </PhotoHero>

      <main className="-mt-[24px] flex-1 rounded-t-sheet bg-surface px-outer pt-[24px] pb-tabbar">
        {PRAYERS.map((p, i) => {
          const title = language === "ro" ? p.titleRo : p.titleEn;
          const subtitle = language === "ro" ? (p.subtitleRo ?? p.subtitle) : p.subtitle;
          return (
            <Link
              key={p.id}
              href={`/prayer/${p.id}`}
              className={`press flex items-center justify-between gap-[10px] py-[15px] ${i !== PRAYERS.length - 1 ? "border-b border-divider" : ""}`}
            >
              <span>
                <span className="block font-serif text-[17px] font-bold text-text">{title}</span>
                {subtitle && <span className="mt-[2px] block font-sans text-[13px] text-muted">{subtitle}</span>}
              </span>
              <ChevronRightIcon className="h-[15px] w-[15px] shrink-0 text-muted" />
            </Link>
          );
        })}

        <Link
          href="/prayer/prayer-different-needs"
          className="press mt-[16px] inline-flex items-center gap-[6px] font-sans text-[15.5px] font-semibold text-navy"
        >
          {t("prayers.viewAll")}
          <ChevronRightIcon className="h-[13px] w-[13px]" />
        </Link>
      </main>
    </PageContainer>
  );
}
