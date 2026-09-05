"use client";

import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons";
import { PhotoHero } from "@/components/PhotoHero";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { PageContainer } from "@/components/ui/Surfaces";
import {
  CURRENT_FAST_EXPLANATION,
  CURRENT_FAST_EXPLANATION_RO,
  CURRENT_FAST_LABEL,
  CURRENT_FAST_LABEL_RO,
  FASTS,
  formatLongDate,
  formatMediumDate,
  REFERENCE_DATE,
} from "@/lib/seedData";

export default function FastingPage() {
  const { t, language } = useTranslation();
  const nextFast = FASTS[0];
  const fastLabel = language === "ro" ? CURRENT_FAST_LABEL_RO : CURRENT_FAST_LABEL;
  const fastExplanation = language === "ro" ? CURRENT_FAST_EXPLANATION_RO : CURRENT_FAST_EXPLANATION;

  return (
    <PageContainer>
      <PhotoHero alt="Bread, olives and oil" scrim="bottom" className="h-[300px] w-full shrink-0">
        <h1 className="absolute bottom-[20px] left-[20px] font-serif text-[32px] font-bold text-white">{t("fasting.title")}</h1>
      </PhotoHero>

      <main className="-mt-[30px] flex-1 rounded-t-sheet bg-surface px-outer pt-[32px] pb-tabbar">
        <p className="font-serif text-[22px] font-bold text-text">{t("fasting.today")}</p>
        <p className="mt-[6px] font-serif text-[26px] font-bold text-text">{fastLabel}</p>
        <p className="mt-[4px] font-sans text-[15px] text-muted">{formatLongDate(REFERENCE_DATE, language)}</p>
        <p className="mt-[10px] font-sans text-[16px] leading-[1.5] text-text">{fastExplanation}</p>

        <div className="mt-[24px] border-t border-divider pt-[20px]">
          <p className="font-serif text-[22px] font-bold text-text">{t("fasting.comingNext")}</p>
          <Link href={`/fasting/${nextFast.id}`} className="press mt-[8px] block">
            <span className="block font-serif text-[22px] font-bold text-text">
              {language === "ro" ? (nextFast.titleRo ?? nextFast.title) : nextFast.title}
            </span>
            <span className="mt-[3px] flex items-center gap-[6px] font-sans text-[15.5px] text-navy">
              {formatMediumDate(nextFast.startDate, language)} – {formatMediumDate(nextFast.endDate, language)}
              <ChevronRightIcon className="h-[13px] w-[13px]" />
            </span>
          </Link>

          {FASTS.slice(1).map((fast) => (
            <Link key={fast.id} href={`/fasting/${fast.id}`} className="press mt-[16px] block">
              <span className="block font-serif text-[17px] font-bold text-text">
                {language === "ro" ? (fast.titleRo ?? fast.title) : fast.title}
              </span>
              <span className="mt-[2px] block font-sans text-[13px] text-muted">
                {formatMediumDate(fast.startDate, language)} – {formatMediumDate(fast.endDate, language)}
              </span>
            </Link>
          ))}
        </div>
      </main>
    </PageContainer>
  );
}
