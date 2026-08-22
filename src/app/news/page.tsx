"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import type { TranslationKey } from "@/lib/i18n/translations";
import { ARTICLE_CATEGORY_ACCENT, ARTICLES, type ArticleCategory } from "@/lib/articleData";

const CATEGORY_LABEL_KEY: Record<ArticleCategory, TranslationKey> = {
  roea: "news.categoryRoea",
  parishes: "news.categoryParishes",
  youth: "news.categoryYouth",
  culture: "news.categoryCulture",
  history: "news.categoryHistory",
  spiritual: "news.categorySpiritual",
  america: "news.categoryAmerica",
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

const ACCENT_BORDER: Record<string, string> = {
  forest: "border-forest",
  slate: "border-slate",
  burgundy: "border-burgundy",
  violet: "border-violet",
  clay: "border-clay",
  teal: "border-teal",
  plum: "border-plum",
};

const ACCENT_BG: Record<string, string> = {
  forest: "bg-forest",
  slate: "bg-slate",
  burgundy: "bg-burgundy",
  violet: "bg-violet",
  clay: "bg-clay",
  teal: "bg-teal",
  plum: "bg-plum",
};

export default function NewsPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<ArticleCategory | "all">("all");

  const categories = Array.from(new Set(ARTICLES.map((a) => a.category)));
  const filtered = filter === "all" ? ARTICLES : ARTICLES.filter((a) => a.category === filter);
  const [featured, ...rest] = filtered;

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="px-outer pt-[max(env(safe-area-inset-top),18px)] pb-[14px]">
        <h1 className="font-serif text-[30px] font-bold text-text">{t("news.title")}</h1>
      </header>

      <div className="no-scrollbar flex gap-[8px] overflow-x-auto px-outer pb-[16px]">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`press shrink-0 rounded-pill px-[14px] py-[7px] font-sans text-[12.5px] font-medium ${
            filter === "all" ? "bg-navy text-white" : "bg-soft-surface text-text"
          }`}
        >
          {t("news.filterAll")}
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            className={`press shrink-0 rounded-pill px-[14px] py-[7px] font-sans text-[12.5px] font-medium ${
              filter === cat ? `${ACCENT_BG[ARTICLE_CATEGORY_ACCENT[cat]]} text-white` : "bg-soft-surface text-text"
            }`}
          >
            {t(CATEGORY_LABEL_KEY[cat])}
          </button>
        ))}
      </div>

      <main className="flex-1 px-outer pb-tabbar">
        {featured && (
          <Link key={featured.id} href={`/news/${featured.id}`} className="press block">
            <p
              className={`font-sans text-[10.5px] font-semibold uppercase tracking-[0.08em] ${ACCENT_TEXT[ARTICLE_CATEGORY_ACCENT[featured.category]]}`}
            >
              {t(CATEGORY_LABEL_KEY[featured.category])}
            </p>
            <p className="mt-[8px] font-serif text-[27px] font-bold leading-[1.15] text-text">{featured.title}</p>
            <p className="mt-[10px] font-sans text-[14px] leading-[1.55] text-text/75">{featured.excerpt}</p>
            {featured.author && <p className="mt-[8px] font-sans text-[12px] text-muted">{featured.author}</p>}
          </Link>
        )}

        {rest.length > 0 && (
          <div className="mt-[36px]">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">{t("news.latest")}</p>
            <div className="mt-[14px] flex flex-col gap-[24px]">
              {rest.map((item, i) => {
                const accent = ARTICLE_CATEGORY_ACCENT[item.category];
                const isTextLed = i % 3 === 2;
                return (
                  <Link
                    key={item.id}
                    href={`/news/${item.id}`}
                    className={`press block ${isTextLed ? "" : `border-l-2 pl-[14px] ${ACCENT_BORDER[accent]}`}`}
                  >
                    <p className={`font-sans text-[10px] font-semibold uppercase tracking-[0.08em] ${ACCENT_TEXT[accent]}`}>
                      {t(CATEGORY_LABEL_KEY[item.category])}
                    </p>
                    <p
                      className={`mt-[5px] font-serif font-bold leading-[1.25] text-text ${isTextLed ? "text-[18px] italic" : "text-[17px]"}`}
                    >
                      {item.title}
                    </p>
                    {!isTextLed && (
                      <p className="mt-[4px] font-sans text-[13px] leading-[1.5] text-text/70">{item.excerpt}</p>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
