"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { BookmarkButton } from "@/components/BookmarkButton";
import { ShareButton } from "@/components/ShareButton";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import type { TranslationKey } from "@/lib/i18n/translations";
import { ARTICLE_CATEGORY_ACCENT, getArticle, getRelatedArticles, type ArticleCategory } from "@/lib/articleData";

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
  const article = getArticle(id);
  if (!article) return notFound();

  const related = getRelatedArticles(article.id);
  const accent = ACCENT_TEXT[ARTICLE_CATEGORY_ACCENT[article.category]];

  return (
    <div className="flex min-h-dvh flex-col bg-background">
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
        <p className="mt-[10px] font-sans text-[12.5px] text-muted">
          {article.author ?? article.publication}
          {article.date && ` · ${new Date(article.date).toLocaleDateString(language === "ro" ? "ro-RO" : "en-US", { year: "numeric", month: "long", day: "numeric" })}`}
        </p>

        {language === "ro" && (
          <p className="mt-[14px] font-sans text-[12.5px] italic leading-[1.5] text-muted">{t("announcements.englishOnlyNote")}</p>
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
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
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
    </div>
  );
}
