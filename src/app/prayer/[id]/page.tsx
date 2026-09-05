"use client";

import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { BookmarkButton } from "@/components/BookmarkButton";
import { DownloadButton } from "@/components/DownloadButton";
import { PageContainer } from "@/components/ui/Surfaces";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { PRAYERS } from "@/lib/seedData";

const FONT_SIZES = ["17px", "19px", "22px"];

/**
 * The quietest screen in the app. Chrome recedes so the sacred text carries
 * the page: a warm reading ground, wide margins, generous leading, and no
 * card wrapped around the prayer itself. (§16, §46)
 */
export default function PrayerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useTranslation();
  const prayer = PRAYERS.find((p) => p.id === id);
  const [sizeIdx, setSizeIdx] = useState(1);

  if (!prayer) return notFound();

  const title = language === "ro" ? prayer.titleRo : prayer.titleEn;
  const subtitle = language === "ro" ? (prayer.subtitleRo ?? prayer.subtitle) : prayer.subtitle;
  const paragraphs = language === "ro" ? (prayer.textRo ?? prayer.text) : prayer.text;

  return (
    <PageContainer tone="reading">
      <AppHeader
        right={
          <>
            {prayer.downloadable && <DownloadButton entityType="prayer" entityId={prayer.id} title={title} />}
            <BookmarkButton entityType="prayer" entityId={prayer.id} title={title} subtitle={subtitle} />
          </>
        }
      />

      <main className="flex-1 px-[26px] pb-[64px] pt-[8px]">
        <h1 className="font-serif text-[30px] font-bold leading-[1.18] text-text">{title}</h1>
        <div className="mt-[14px] flex items-center justify-between gap-[16px]">
          <span className="font-sans text-[13.5px] text-muted">
            {prayer.estimatedMinutes} {t("common.min")}
          </span>
          <div className="flex items-center gap-[6px]">
            {FONT_SIZES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSizeIdx(i)}
                aria-label={`Text size ${i + 1}`}
                aria-pressed={sizeIdx === i}
                className={`press flex h-[34px] w-[34px] items-center justify-center rounded-full font-sans font-semibold transition-colors duration-150 ${
                  sizeIdx === i ? "bg-charcoal text-white" : "bg-surface-soft text-muted"
                }`}
                style={{ fontSize: 12 + i * 3 }}
              >
                A
              </button>
            ))}
          </div>
        </div>

        <div className="mt-[32px]">
          {paragraphs.map((para, i) => (
            <p
              key={i}
              className="mb-[22px] font-serif leading-[1.62] text-text last:mb-0"
              style={{ fontSize: FONT_SIZES[sizeIdx] }}
            >
              {para}
            </p>
          ))}
        </div>
      </main>
    </PageContainer>
  );
}
