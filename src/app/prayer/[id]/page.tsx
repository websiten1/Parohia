"use client";

import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { BookmarkButton } from "@/components/BookmarkButton";
import { DownloadButton } from "@/components/DownloadButton";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { PRAYERS } from "@/lib/seedData";

const FONT_SIZES = ["16px", "18px", "21px"];

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
    <div className="flex min-h-dvh flex-col bg-background">
      <AppHeader
        title={title}
        right={
          <div className="flex items-center gap-[2px]">
            {prayer.downloadable && <DownloadButton entityType="prayer" entityId={prayer.id} title={title} />}
            <BookmarkButton entityType="prayer" entityId={prayer.id} title={title} subtitle={subtitle} />
          </div>
        }
      />

      <div className="flex items-center justify-between px-outer pt-[10px]">
        <span className="font-sans text-[12.5px] text-muted">
          {prayer.estimatedMinutes} {t("common.min")}
        </span>
        <div className="flex items-center gap-[4px]">
          {FONT_SIZES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSizeIdx(i)}
              aria-label={`Text size ${i + 1}`}
              className={`press flex h-[28px] w-[28px] items-center justify-center rounded-full font-sans font-semibold ${
                sizeIdx === i ? "bg-navy text-white" : "text-muted"
              }`}
              style={{ fontSize: 11 + i * 3 }}
            >
              A
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 px-outer py-[22px]">
        {paragraphs.map((para, i) => (
          <p key={i} className="mb-[16px] font-serif leading-[1.55] text-text" style={{ fontSize: FONT_SIZES[sizeIdx] }}>
            {para}
          </p>
        ))}
      </main>
    </div>
  );
}
