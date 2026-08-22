"use client";

import { notFound, useParams } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { BookmarkButton } from "@/components/BookmarkButton";
import { ShareButton } from "@/components/ShareButton";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { RESOURCE_ITEMS } from "@/lib/seedData";

export default function ArticleReaderPage() {
  const { id } = useParams<{ id: string }>();
  const article = RESOURCE_ITEMS.find((r) => r.id === id && r.contentType === "article");
  const { t, language } = useTranslation();
  if (!article) return notFound();

  const title = language === "ro" ? (article.titleRo ?? article.title) : article.title;
  const subtitle = language === "ro" ? (article.subtitleRo ?? article.subtitle) : article.subtitle;
  const body = language === "ro" ? (article.bodyRo ?? article.body) : article.body;
  const attribution = language === "ro" ? (article.attributionRo ?? article.attribution) : article.attribution;

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <AppHeader
        title={t("resource.article")}
        right={
          <div className="flex items-center gap-[2px]">
            <BookmarkButton entityType="resource" entityId={article.id} title={title} subtitle={subtitle} />
            <ShareButton title={title} text={subtitle} />
          </div>
        }
      />
      <main className="flex-1 px-outer py-[22px]">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">{subtitle}</p>
        <h1 className="mt-[6px] font-serif text-[24px] font-bold leading-[1.25] text-text">{title}</h1>
        <div className="mt-[18px]">
          {(body ?? []).map((para, i) => (
            <p key={i} className="mb-[16px] font-serif text-[16.5px] leading-[1.5] text-text last:mb-0">
              {para}
            </p>
          ))}
        </div>
        <p className="mt-[20px] font-sans text-[11.5px] text-muted">{attribution}</p>
      </main>
    </div>
  );
}
