"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import type { TranslationKey } from "@/lib/i18n/translations";
import { RESOURCE_ITEMS } from "@/lib/seedData";
import type { ResourceCategoryId } from "@/lib/types";

const LABEL_KEYS: Record<ResourceCategoryId, TranslationKey> = {
  "church-fathers": "resources.churchFathers",
  videos: "resources.videos",
  articles: "resources.articles",
};

export default function ResourceCategoryPage() {
  const { category } = useParams<{ category: string }>();
  const { t, language } = useTranslation();
  if (!(category in LABEL_KEYS)) return notFound();
  const categoryId = category as ResourceCategoryId;
  const items = RESOURCE_ITEMS.filter((r) => r.category === categoryId);

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <AppHeader title={t(LABEL_KEYS[categoryId])} backHref="/resources" />
      <main className="flex-1 px-outer py-[16px]">
        {items.map((item, i) => (
          <Link
            key={item.id}
            href={`/${item.contentType}/${item.id}`}
            className={`press block py-[16px] ${i !== items.length - 1 ? "border-b border-divider" : ""}`}
          >
            <p className="font-serif text-[17px] leading-[1.3] text-text">
              {language === "ro" ? (item.titleRo ?? item.title) : item.title}
            </p>
            <p className="mt-[3px] font-sans text-[13px] text-muted">
              {language === "ro" ? (item.subtitleRo ?? item.subtitle) : item.subtitle}
            </p>
          </Link>
        ))}
      </main>
    </div>
  );
}
