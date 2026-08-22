"use client";

import { AppHeader } from "@/components/AppHeader";
import { EmptyState } from "@/components/Feedback";
import { BookmarkIcon, CloseIcon } from "@/components/icons";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { useBookmarks } from "@/lib/storage";

const ENTITY_HREF: Record<string, (id: string) => string> = {
  saint: (id) => `/saint/${id}`,
  reading: (id) => `/reading/${id}`,
  prayer: (id) => `/prayer/${id}`,
  event: (id) => `/event/${id}`,
  parish: (id) => `/parish/${id}`,
  resource: () => `/resources`,
};

export default function BookmarksPage() {
  const { bookmarks, toggle, hydrated } = useBookmarks();
  const { t } = useTranslation();

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <AppHeader title={t("bookmarks.title")} />
      <main className="flex-1 px-outer py-[10px]">
        {!hydrated ? null : bookmarks.length === 0 ? (
          <EmptyState icon={<BookmarkIcon className="h-[20px] w-[20px]" />} message={t("bookmarks.empty")} />
        ) : (
          bookmarks.map((b, i) => (
            <div
              key={b.id}
              className={`flex items-center gap-[12px] py-[15px] ${i !== bookmarks.length - 1 ? "border-b border-divider" : ""}`}
            >
              <a href={ENTITY_HREF[b.entityType]?.(b.entityId) ?? "#"} className="min-w-0 flex-1">
                <p className="truncate font-serif text-[16px] text-text">{b.title}</p>
                {b.subtitle && <p className="mt-[2px] truncate font-sans text-[12.5px] text-muted">{b.subtitle}</p>}
              </a>
              <button
                type="button"
                aria-label="Remove bookmark"
                onClick={() => toggle({ entityType: b.entityType, entityId: b.entityId, title: b.title, subtitle: b.subtitle })}
                className="press flex h-[32px] w-[32px] items-center justify-center rounded-sm text-muted"
              >
                <CloseIcon className="h-[16px] w-[16px]" />
              </button>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
