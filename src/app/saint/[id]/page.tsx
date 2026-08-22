"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { BookmarkButton } from "@/components/BookmarkButton";
import { PhotoHero } from "@/components/PhotoHero";
import { SegmentedTabs } from "@/components/SegmentedTabs";
import { ShareButton } from "@/components/ShareButton";
import { BackIcon } from "@/components/icons";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { formatMediumDate, SAINTS } from "@/lib/seedData";

export default function SaintDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useTranslation();
  const saint = SAINTS.find((s) => s.id === id);
  const [tab, setTab] = useState("life");

  const TABS = [
    { id: "life", label: t("saint.tabLife") },
    { id: "troparion", label: t("saint.tabTroparion") },
    { id: "kontakion", label: t("saint.tabKontakion") },
  ];

  if (!saint) return notFound();

  const isRo = language === "ro";
  const primaryName = isRo ? saint.nameRo : saint.nameEn;
  const secondaryName = isRo ? saint.nameEn : saint.nameRo;
  const shortLife = isRo ? (saint.shortLifeRo ?? saint.shortLife) : saint.shortLife;
  const fullLife = isRo ? (saint.fullLifeRo ?? saint.fullLife) : saint.fullLife;
  const troparion = isRo ? (saint.troparionRo ?? saint.troparion) : saint.troparion;
  const kontakion = isRo ? (saint.kontakionRo ?? saint.kontakion) : saint.kontakion;
  const bodyText = tab === "life" ? fullLife : tab === "troparion" ? troparion : kontakion;

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <div className="relative">
        <PhotoHero alt={primaryName} scrim="bottom" className="h-[300px] w-full" />
        <div className="absolute inset-x-0 top-[max(env(safe-area-inset-top),14px)] flex items-center justify-between px-outer">
          <Link
            href="/today"
            aria-label={t("common.back")}
            className="press flex h-[36px] w-[36px] items-center justify-center rounded-full bg-navy/45 text-white"
          >
            <BackIcon className="h-[20px] w-[20px]" />
          </Link>
          <ShareButton
            title={primaryName}
            text={shortLife}
            className="press flex h-[36px] w-[36px] items-center justify-center rounded-full bg-navy/45 text-white"
          />
        </div>
      </div>

      <main className="-mt-[24px] flex-1 rounded-t-sheet bg-surface px-outer pt-[24px] pb-[36px]">
        <div className="flex items-start justify-between gap-[10px]">
          <div>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
              {formatMediumDate(saint.feastDate, language).toUpperCase()}
            </p>
            <h1 className="mt-[6px] font-serif text-[29px] font-bold leading-[1.15] text-text">{primaryName}</h1>
            <p className="mt-[2px] font-sans text-[13px] text-muted">{secondaryName}</p>
          </div>
          <BookmarkButton entityType="saint" entityId={saint.id} title={primaryName} subtitle={secondaryName} />
        </div>

        <div className="mt-[16px]">
          <SegmentedTabs tabs={TABS} active={tab} onChange={setTab} />
        </div>

        <div key={tab} className="anim-fade-through mt-[18px]">
          {bodyText.split("\n\n").map((para, i) => (
            <p key={i} className="mb-[14px] font-serif text-[16.5px] leading-[1.45] text-text last:mb-0">
              {para}
            </p>
          ))}
        </div>
      </main>
    </div>
  );
}
