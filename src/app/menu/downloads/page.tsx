"use client";

import { AppHeader } from "@/components/AppHeader";
import { EmptyState } from "@/components/Feedback";
import { CloseIcon, DownloadIcon } from "@/components/icons";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { useDownloads } from "@/lib/storage";

export default function DownloadsPage() {
  const { downloads, remove, hydrated } = useDownloads();
  const { t, language } = useTranslation();
  const totalSize = downloads.length * 1.2;

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <AppHeader title={t("downloads.title")} />
      <main className="flex-1 px-outer py-[10px]">
        {!hydrated ? null : downloads.length === 0 ? (
          <EmptyState icon={<DownloadIcon className="h-[20px] w-[20px]" />} message={t("downloads.empty")} />
        ) : (
          <>
            <p className="pb-[10px] font-sans text-[12.5px] text-muted">
              {t("downloads.summary", {
                count: downloads.length,
                plural: downloads.length === 1 ? "" : language === "ro" ? "e" : "s",
                size: totalSize.toFixed(1),
              })}
            </p>
            {downloads.map((d, i) => (
              <div
                key={d.id}
                className={`flex items-center justify-between gap-[12px] py-[15px] ${i !== downloads.length - 1 ? "border-b border-divider" : ""}`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-serif text-[16px] text-text">{d.title}</span>
                  <span className="mt-[2px] block font-sans text-[12.5px] text-muted">{d.sizeLabel}</span>
                </span>
                <button
                  type="button"
                  aria-label="Remove download"
                  onClick={() => remove(d.entityType, d.entityId)}
                  className="press flex h-[32px] w-[32px] items-center justify-center rounded-sm text-muted"
                >
                  <CloseIcon className="h-[16px] w-[16px]" />
                </button>
              </div>
            ))}
          </>
        )}
      </main>
    </div>
  );
}
