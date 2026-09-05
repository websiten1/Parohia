"use client";

import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { BookmarkButton } from "@/components/BookmarkButton";
import { PhotoHero } from "@/components/PhotoHero";
import { ShareButton } from "@/components/ShareButton";
import { PauseIcon, PlayIcon } from "@/components/icons";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { RESOURCE_ITEMS } from "@/lib/seedData";
import { PageContainer } from "@/components/ui/Surfaces";

export default function VideoPlayerPage() {
  const { id } = useParams<{ id: string }>();
  const video = RESOURCE_ITEMS.find((r) => r.id === id && r.contentType === "video");
  const [playing, setPlaying] = useState(false);
  const { t, language } = useTranslation();
  if (!video) return notFound();

  const title = language === "ro" ? (video.titleRo ?? video.title) : video.title;
  const subtitle = language === "ro" ? (video.subtitleRo ?? video.subtitle) : video.subtitle;
  const attribution = language === "ro" ? (video.attributionRo ?? video.attribution) : video.attribution;

  return (
    <PageContainer>
      <AppHeader
        title={t("resource.video")}
        right={
          <div className="flex items-center gap-[2px]">
            <BookmarkButton entityType="resource" entityId={video.id} title={title} subtitle={subtitle} />
            <ShareButton title={title} text={subtitle} />
          </div>
        }
      />
      <main className="flex-1 px-outer py-[16px]">
        <PhotoHero alt={title} scrim="full" className="h-[210px] w-full rounded-compact">
          <button
            type="button"
            aria-label={playing ? "Pause" : "Play"}
            onClick={() => setPlaying((p) => !p)}
            className="press absolute inset-0 flex items-center justify-center"
          >
            <span className="flex h-[58px] w-[58px] items-center justify-center rounded-full bg-white/90 text-navy">
              {playing ? <PauseIcon className="h-[22px] w-[22px]" /> : <PlayIcon className="h-[22px] w-[22px]" />}
            </span>
          </button>
        </PhotoHero>

        <h1 className="mt-[16px] font-serif text-[20px] font-bold leading-[1.25] text-text">{title}</h1>
        <p className="mt-[4px] font-sans text-[13px] text-muted">
          {subtitle} · {video.durationLabel}
        </p>
        <p className="mt-[14px] font-sans text-[11.5px] text-muted">{attribution}</p>
      </main>
    </PageContainer>
  );
}
