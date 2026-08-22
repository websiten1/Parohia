"use client";

import { notFound, useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { AudioPlayerCard } from "@/components/AudioPlayerCard";
import { BookmarkButton } from "@/components/BookmarkButton";
import { DownloadButton } from "@/components/DownloadButton";
import { ShareButton } from "@/components/ShareButton";
import { BackIcon, NoteIcon } from "@/components/icons";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { useNotes } from "@/lib/storage";
import { READINGS } from "@/lib/seedData";

export default function ReadingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { t, language } = useTranslation();
  const reading = READINGS.find((r) => r.id === id);
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [textScale, setTextScale] = useState(1);
  const { addNote } = useNotes();

  if (!reading) return notFound();

  function submitNote() {
    if (!noteText.trim()) return;
    addNote({ entityType: "reading", entityId: reading!.id, anchor: reading!.reference, body: noteText.trim() });
    setNoteText("");
    setNoteOpen(false);
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="flex items-center justify-between px-outer pt-[max(env(safe-area-inset-top),18px)]">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label={t("common.back")}
          className="press flex h-[36px] w-[36px] items-center justify-center rounded-sm text-text"
        >
          <BackIcon className="h-[20px] w-[20px]" />
        </button>
        <div className="flex items-center gap-[6px]">
          <button
            type="button"
            aria-label={t("reader.decreaseText")}
            onClick={() => setTextScale((s) => Math.max(0.85, s - 0.1))}
            className="press flex h-[36px] w-[36px] items-center justify-center rounded-sm font-sans text-[13px] text-text"
          >
            A-
          </button>
          <button
            type="button"
            aria-label={t("reader.increaseText")}
            onClick={() => setTextScale((s) => Math.min(1.3, s + 0.1))}
            className="press flex h-[36px] w-[36px] items-center justify-center rounded-sm font-sans text-[16px] text-text"
          >
            A+
          </button>
          <DownloadButton entityType="reading" entityId={reading.id} title={reading.title} />
          <BookmarkButton entityType="reading" entityId={reading.id} title={reading.reference} subtitle={reading.title} />
          <ShareButton title={reading.title} text={reading.reference} />
        </div>
      </header>

      <main className="flex-1 px-outer pt-[16px] pb-[24px]">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">{t("reader.title")}</p>
        <p className="mt-[16px] font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
          {reading.type === "epistle" ? t("readings.epistle") : t("readings.gospel")}
        </p>
        <h1 className="mt-[4px] font-serif text-[28px] font-bold leading-[1.15] text-text">
          {reading.reference.replace("; ", ";\n")}
        </h1>
        <p className="mt-[8px] font-sans text-[13px] text-muted">{reading.chapterLabel}</p>

        <div className="mt-[20px]" style={{ fontSize: `${textScale}em` }}>
          {language === "ro" && (
            <p className="mb-[14px] font-sans text-[12.5px] italic text-muted">{t("reader.englishOnlyNote")}</p>
          )}
          {reading.textEn.map((v) => (
            <p key={v.verse} className="mb-[14px] font-serif text-[16px] leading-[1.5] text-text">
              <span className="mr-[6px] align-super font-sans text-[10.5px] font-semibold text-romanian-blue">
                {v.verse}
              </span>
              {v.text}
            </p>
          ))}
          <p className="mt-[6px] font-sans text-[11.5px] text-muted">{reading.translationSource}</p>
        </div>

        <div className="mt-[20px] border-t border-divider pt-[16px]">
          {noteOpen ? (
            <div className="anim-fade-through">
              <textarea
                autoFocus
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder={t("reader.notePlaceholder")}
                rows={3}
                className="w-full rounded-sm border border-divider bg-soft-surface px-[12px] py-[10px] font-sans text-[14px] text-text outline-none"
              />
              <div className="mt-[8px] flex justify-end gap-[8px]">
                <button
                  type="button"
                  onClick={() => setNoteOpen(false)}
                  className="press rounded-pill px-[14px] py-[8px] font-sans text-[13px] font-medium text-muted"
                >
                  {t("common.cancel")}
                </button>
                <button
                  type="button"
                  onClick={submitNote}
                  className="press rounded-pill bg-navy px-[16px] py-[8px] font-sans text-[13px] font-semibold text-white"
                >
                  {t("common.saveNote")}
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setNoteOpen(true)}
              className="press flex items-center gap-[8px] font-sans text-[13px] font-medium text-navy"
            >
              <NoteIcon className="h-[17px] w-[17px]" />
              {t("reader.addNote")}
            </button>
          )}
        </div>
      </main>

      <div className="sticky bottom-0 border-t border-divider bg-surface px-outer py-[16px]">
        <AudioPlayerCard
          readingId={reading.id}
          title={reading.title}
          reference={reading.reference}
          durationLabel={reading.duration}
          audioUrl={reading.audioUrl}
        />
      </div>
    </div>
  );
}
