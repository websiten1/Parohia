"use client";

import { AppHeader } from "@/components/AppHeader";
import { EmptyState } from "@/components/Feedback";
import { CloseIcon, NoteIcon } from "@/components/icons";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { useNotes } from "@/lib/storage";
import { PageContainer } from "@/components/ui/Surfaces";

export default function NotesPage() {
  const { notes, removeNote, hydrated } = useNotes();
  const { t, language } = useTranslation();

  return (
    <PageContainer>
      <AppHeader title={t("notes.title")} />
      <main className="flex-1 px-outer py-[10px]">
        {!hydrated ? null : notes.length === 0 ? (
          <EmptyState icon={<NoteIcon className="h-[20px] w-[20px]" />} message={t("notes.empty")} />
        ) : (
          notes.map((n, i) => (
            <div key={n.id} className={`py-[15px] ${i !== notes.length - 1 ? "border-b border-divider" : ""}`}>
              <div className="flex items-start justify-between gap-[10px]">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.06em] text-burgundy">{n.anchor}</p>
                <button
                  type="button"
                  aria-label="Delete note"
                  onClick={() => removeNote(n.id)}
                  className="press flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-sm text-muted"
                >
                  <CloseIcon className="h-[14px] w-[14px]" />
                </button>
              </div>
              <p className="mt-[4px] font-serif text-[15px] leading-[1.5] text-text">{n.body}</p>
              <p className="mt-[4px] font-sans text-[11.5px] text-muted">
                {new Date(n.createdAt).toLocaleDateString(language === "ro" ? "ro-RO" : "en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          ))
        )}
      </main>
    </PageContainer>
  );
}
