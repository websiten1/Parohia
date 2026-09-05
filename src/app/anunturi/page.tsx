"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { PageBody, PageContainer, SectionHeader } from "@/components/ui/Surfaces";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import type { TranslationKey } from "@/lib/i18n/translations";
import { ARTICLES, type Article, type ArticleCategory } from "@/lib/articleData";
import { listPriestAnnouncementsForParish } from "@/lib/data/parishes";
import { useSelectedParishId } from "@/lib/storage";
import { CATEGORY_TINT, TINTS } from "@/lib/tints";

const CATEGORY_LABEL_KEY: Record<ArticleCategory, TranslationKey> = {
  diocesan: "announcements.categoryDiocesan",
  parishes: "announcements.categoryParishes",
  youth: "announcements.categoryYouth",
  culture: "announcements.categoryCulture",
  history: "announcements.categoryHistory",
  spiritual: "announcements.categorySpiritual",
  world: "announcements.categoryWorld",
};

export default function AnnouncementsPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<ArticleCategory | "all">("all");
  const [selectedParishId, , parishHydrated] = useSelectedParishId();
  const reduceMotion = useReducedMotion();

  // A priest's own announcements lead their parishioners' feed. Read only
  // once storage has hydrated, so the server and first client render agree.
  const items: Article[] = useMemo(() => {
    if (!parishHydrated || !selectedParishId) return ARTICLES;
    return [...listPriestAnnouncementsForParish(selectedParishId), ...ARTICLES];
  }, [selectedParishId, parishHydrated]);

  const categories = Array.from(new Set(items.map((a) => a.category)));
  const filtered = filter === "all" ? items : items.filter((a) => a.category === filter);
  const [featured, ...rest] = filtered;

  return (
    <PageContainer>
      <header className="px-outer pt-[max(env(safe-area-inset-top),24px)]">
        <h1 className="font-serif text-[32px] font-bold leading-[1.1] text-text">{t("announcements.title")}</h1>
      </header>

      <div className="no-scrollbar mt-[20px] flex gap-[8px] overflow-x-auto px-outer pb-[6px]">
        <FilterPill active={filter === "all"} onClick={() => setFilter("all")}>
          {t("announcements.filterAll")}
        </FilterPill>
        {categories.map((cat) => (
          <FilterPill key={cat} active={filter === cat} onClick={() => setFilter(cat)}>
            {t(CATEGORY_LABEL_KEY[cat])}
          </FilterPill>
        ))}
      </div>

      <PageBody className="pt-[26px]">
        {/* One story leads rather than every article becoming an identical tile. */}
        {featured && (
          <Link href={`/anunturi/${featured.id}`} className="block">
            <motion.article
              whileTap={reduceMotion ? undefined : { scale: 0.99 }}
              transition={{ type: "spring", stiffness: 520, damping: 34 }}
            >
              <h2 className="font-serif text-[29px] font-bold leading-[1.12] text-text">{featured.title}</h2>
              <p className="mt-[12px] font-sans text-[15.5px] leading-[1.5] text-text-secondary">{featured.excerpt}</p>
              <p className="mt-[12px] font-sans text-[13.5px] text-muted">
                <span style={{ color: TINTS[CATEGORY_TINT[featured.category]].ink }} className="font-semibold">
                  {t(CATEGORY_LABEL_KEY[featured.category])}
                </span>
                {featured.author ? ` · ${featured.author}` : ""}
              </p>
            </motion.article>
          </Link>
        )}

        {rest.length > 0 && (
          <div className="mt-[44px]">
            <SectionHeader>{t("announcements.latest")}</SectionHeader>
            <div className="mt-[10px]">
              {rest.map((item) => (
                <Link key={item.id} href={`/anunturi/${item.id}`} className="block">
                  <motion.article
                    whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                    transition={{ type: "spring", stiffness: 520, damping: 34 }}
                    className="py-[20px]"
                  >
                    <h3 className="font-serif text-[19px] font-bold leading-[1.25] text-text">{item.title}</h3>
                    <p className="mt-[7px] font-sans text-[14.5px] leading-[1.45] text-muted">{item.excerpt}</p>
                    <p className="mt-[10px] font-sans text-[13px] text-muted">
                      <span style={{ color: TINTS[CATEGORY_TINT[item.category]].ink }} className="font-semibold">
                        {t(CATEGORY_LABEL_KEY[item.category])}
                      </span>
                      {item.author ? ` · ${item.author}` : ""}
                    </p>
                  </motion.article>
                </Link>
              ))}
            </div>
          </div>
        )}
      </PageBody>
    </PageContainer>
  );
}

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 520, damping: 34 }}
      className={`min-h-[44px] shrink-0 rounded-pill px-[18px] font-sans text-[14.5px] font-medium transition-colors duration-200 ${
        active ? "bg-charcoal text-white" : "bg-surface-soft text-text"
      }`}
    >
      {children}
    </motion.button>
  );
}
