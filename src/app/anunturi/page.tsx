"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Article } from "@/lib/articleData";
import { listPriestAnnouncementsForParish } from "@/lib/data/parishes";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import type { TranslationKey } from "@/lib/i18n/translations";
import { ARTICLE_CATEGORY_ACCENT, ARTICLES, type ArticleCategory } from "@/lib/articleData";
import { useSelectedParishId } from "@/lib/storage";

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

const ACCENT_BG: Record<string, string> = {
  forest: "bg-forest",
  slate: "bg-slate",
  burgundy: "bg-burgundy",
  violet: "bg-violet",
  clay: "bg-clay",
  teal: "bg-teal",
  plum: "bg-plum",
};

export default function AnnouncementsPage() {
  const { t } = useTranslation();
  const [selectedParishId] = useSelectedParishId();
  const [filter, setFilter] = useState<ArticleCategory | "all">("all");
  const [parishAnnouncements, setParishAnnouncements] = useState<Article[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParishAnnouncements(selectedParishId ? listPriestAnnouncementsForParish(selectedParishId) : []);
  }, [selectedParishId]);

  const all = [...parishAnnouncements, ...ARTICLES];
  const categories = Array.from(new Set(all.map((a) => a.category)));
  const filtered = filter === "all" ? all : all.filter((a) => a.category === filter);
  const [featured, ...rest] = filtered;

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="px-outer pt-[max(env(safe-area-inset-top),18px)] pb-[14px]">
        <h1 className="font-serif text-[30px] font-bold text-text">{t("announcements.title")}</h1>
      </header>

      <div className="no-scrollbar flex gap-[8px] overflow-x-auto px-outer pb-[16px]">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`press shrink-0 rounded-pill px-[14px] py-[7px] font-sans text-[12.5px] font-medium ${
            filter === "all" ? "bg-navy text-white" : "bg-soft-surface text-text"
          }`}
        >
          {t("announcements.filterAll")}
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
          <Link key={featured.id} href={`/anunturi/${featured.id}`} className="press block">
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
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">{t("announcements.latest")}</p>
            <div className="mt-[10px]">
              {rest.map((item) => {
                const accent = ARTICLE_CATEGORY_ACCENT[item.category];
                return (
                  <Link
                    key={item.id}
                    href={`/anunturi/${item.id}`}
                    className="press block border-b border-divider py-[16px] last:border-b-0"
                  >
                    <p className={`font-sans text-[10px] font-semibold uppercase tracking-[0.08em] ${ACCENT_TEXT[accent]}`}>
                      {t(CATEGORY_LABEL_KEY[item.category])}
                    </p>
                    <p className="mt-[5px] font-serif text-[17px] font-bold leading-[1.25] text-text">{item.title}</p>
                    <p className="mt-[4px] font-sans text-[13px] leading-[1.5] text-text/70">{item.excerpt}</p>
                    {item.author && <p className="mt-[6px] font-sans text-[11.5px] text-muted">{item.author}</p>}
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
