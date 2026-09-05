"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { BookmarkButton } from "@/components/BookmarkButton";
import { ShareButton } from "@/components/ShareButton";
import { findPriestAnnouncementById } from "@/lib/data/parishes";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import type { TranslationKey } from "@/lib/i18n/translations";
import { ARTICLE_CATEGORY_ACCENT, getArticle, getRelatedArticles, type Article, type ArticleCategory } from "@/lib/articleData";
import { PageContainer } from "@/components/ui/Surfaces";

const CATEGORY_LABEL_KEY: Record<ArticleCategory, TranslationKey> = {
  diocesan: "announcements.categoryDiocesan",
  parishes: "announcements.categoryParishes",
  youth: "announcements.categoryYouth",
  culture: "announcements.categoryCulture",
  history: "announcements.categoryHistory",
  spiritual: "announcements.categorySpiritual",
  world: "announcements.categoryWorld",
};

const ACCENT_TEXT: Record<string, string> = {
  forest: "text-forest",
  slate: "text-slate",
  burgundy: "text-burgundy",
  violet: "text-violet",
  clay: "text-clay",
  teal: "text-teal",
  plum: "text-plum",
};

export default function AnnouncementPage() {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useTranslation();
  // Priest-authored announcements live in localStorage, unlike the static
  // ARTICLES seed — resolving both in an effect (rather than during render)
  // keeps the server-rendered HTML and the first client render identical,
  // so a hard reload never flashes a false "not found" before hydration.
  const [article, setArticle] = useState<Article | null | undefined>(undefined);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setArticle(getArticle(id) ?? findPriestAnnouncementById(id) ?? null);
  }, [id]);

  if (article === undefined) return null;
  if (article === null) return notFound();

  const related = getRelatedArticles(article.id);
  const accent = ACCENT_TEXT[ARTICLE_CATEGORY_ACCENT[article.category]];

  return (
    <PageContainer wash="blue">
      <AppHeader
        title={t("nav.announcements")}
        right={
          <div className="flex items-center gap-[2px]">
            <BookmarkButton entityType="resource" entityId={article.id} title={article.title} subtitle={article.excerpt} />
            <ShareButton title={article.title} text={article.excerpt} />
          </div>
        }
      />
      <main className="flex-1 px-outer py-[22px]">
        <p className={`font-sans text-[11px] font-semibold uppercase tracking-[0.08em] ${accent}`}>
          {t(CATEGORY_LABEL_KEY[article.category])}
        </p>
        <h1 className="mt-[8px] font-serif text-[27px] font-bold leading-[1.2] text-text">{article.title}</h1>
        {article.subtitle && (
          <p className="mt-[8px] font-serif text-[15px] italic leading-[1.5] text-muted">{article.subtitle}</p>
        )}
        <p className="mt-[10px] font-sans text-[13.5px] text-muted">
          {article.author ?? article.publication}
          {article.date && ` · ${new Date(article.date).toLocaleDateString(language === "ro" ? "ro-RO" : "en-US", { year: "numeric", month: "long", day: "numeric" })}`}
        </p>

        {language === "ro" && (
          <p className="mt-[14px] font-sans text-[13.5px] italic leading-[1.5] text-muted">{t("announcements.englishOnlyNote")}</p>
        )}

        <div className="mt-[20px] flex flex-col gap-[20px]">
          {article.body.map((section, i) => (
            <div key={i}>
              {section.heading && (
                <p className="mb-[8px] font-serif text-[18px] font-bold leading-[1.3] text-text">{section.heading}</p>
              )}
              {section.paragraphs.map((para, j) => (
                <p key={j} className="mb-[14px] font-serif text-[16px] leading-[1.6] text-text last:mb-0">
                  {para}
                </p>
              ))}
            </div>
          ))}
        </div>

        <p className="mt-[24px] border-t border-divider pt-[14px] font-sans text-[11.5px] text-muted">
          {t("announcements.source")}: {article.publication}
        </p>

        {related.length > 0 && (
          <div className="mt-[36px] border-t border-divider pt-[20px]">
            <p className="font-serif text-[22px] font-bold text-text">
              {t("announcements.continueReading")}
            </p>
            <div className="mt-[14px] flex flex-col gap-[16px]">
              {related.map((r) => (
                <Link key={r.id} href={`/anunturi/${r.id}`} className="press block">
                  <p className={`font-sans text-[10px] font-semibold uppercase tracking-[0.08em] ${ACCENT_TEXT[ARTICLE_CATEGORY_ACCENT[r.category]]}`}>
                    {t(CATEGORY_LABEL_KEY[r.category])}
                  </p>
                  <p className="mt-[3px] font-serif text-[16px] font-bold leading-[1.3] text-text">{r.title}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </PageContainer>
  );
}
