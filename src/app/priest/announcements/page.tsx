"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { PencilIcon, PlusIcon, TrashIcon } from "@/components/icons";
import type { Article } from "@/lib/articleData";
import { deletePriestAnnouncement, getParishById, listPriestAnnouncementsForParish, savePriestAnnouncement } from "@/lib/data/parishes";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { useAccount } from "@/lib/storage";

type View = { mode: "list" } | { mode: "form"; editing?: Article };

export default function PriestAnnouncementsPage() {
  const router = useRouter();
  const { t, language } = useTranslation();
  const [account, , hydrated] = useAccount();
  const [parishName, setParishName] = useState("");
  const [items, setItems] = useState<Article[]>([]);
  const [view, setView] = useState<View>({ mode: "list" });
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const parishId = account?.parishId;

  function reload() {
    if (!parishId) return;
    setItems(listPriestAnnouncementsForParish(parishId));
  }

  useEffect(() => {
    if (!hydrated) return;
    if (account?.role !== "priest" || !parishId) {
      router.replace("/login/priest");
      return;
    }
    getParishById(parishId).then((p) => setParishName(p?.name ?? ""));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, hydrated, parishId, router]);

  if (!hydrated || account?.role !== "priest" || !parishId) return null;

  function handleDelete(id: string) {
    deletePriestAnnouncement(id);
    setPendingDeleteId(null);
    reload();
  }

  function handleSave(article: Article) {
    savePriestAnnouncement(article);
    setView({ mode: "list" });
    reload();
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <AppHeader title={t("priest.announcementsTitle")} backHref="/priest" />

      {view.mode === "form" ? (
        <AnnouncementForm
          parishId={parishId}
          parishName={parishName}
          authorName={account.name}
          initial={view.editing}
          onCancel={() => setView({ mode: "list" })}
          onSave={handleSave}
        />
      ) : (
        <main className="flex-1 px-outer pt-[20px] pb-tabbar">
          <button
            type="button"
            onClick={() => setView({ mode: "form" })}
            className="press mb-[24px] flex w-full items-center justify-center gap-[8px] rounded-pill bg-burgundy py-[14px] font-sans text-[14.5px] font-semibold text-white"
          >
            <PlusIcon className="h-[16px] w-[16px]" />
            {t("priest.announcementsNew")}
          </button>

          {items.length === 0 ? (
            <p className="mt-[8px] font-sans text-[13.5px] leading-[1.6] text-muted">{t("priest.announcementsEmpty")}</p>
          ) : (
            <div>
              {items.map((item, i) => (
                <div key={item.id} className={`py-[16px] ${i !== items.length - 1 ? "border-b border-divider" : ""}`}>
                  {pendingDeleteId === item.id ? (
                    <div className="flex items-center justify-between gap-[12px]">
                      <p className="font-sans text-[13.5px] text-text">{t("priest.announcementsDeleteConfirm")}</p>
                      <div className="flex shrink-0 gap-[8px]">
                        <button type="button" onClick={() => setPendingDeleteId(null)} className="press font-sans text-[13px] font-medium text-muted">
                          {t("common.cancel")}
                        </button>
                        <button type="button" onClick={() => handleDelete(item.id)} className="press font-sans text-[13px] font-semibold text-burgundy">
                          {t("priest.delete")}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-[12px]">
                      <div className="min-w-0 flex-1">
                        <p className="font-serif text-[16.5px] font-bold leading-[1.25] text-text">{item.title}</p>
                        <p className="mt-[3px] font-sans text-[13px] leading-[1.5] text-text/70">{item.excerpt}</p>
                        {item.date && (
                          <p className="mt-[6px] font-sans text-[11.5px] text-muted">
                            {new Date(item.date).toLocaleDateString(language === "ro" ? "ro-RO" : "en-US", { year: "numeric", month: "long", day: "numeric" })}
                          </p>
                        )}
                      </div>
                      <div className="flex shrink-0 items-center gap-[4px]">
                        <button
                          type="button"
                          aria-label={t("priest.edit")}
                          onClick={() => setView({ mode: "form", editing: item })}
                          className="press flex h-[32px] w-[32px] items-center justify-center text-navy"
                        >
                          <PencilIcon className="h-[16px] w-[16px]" />
                        </button>
                        <button
                          type="button"
                          aria-label={t("priest.delete")}
                          onClick={() => setPendingDeleteId(item.id)}
                          className="press flex h-[32px] w-[32px] items-center justify-center text-muted"
                        >
                          <TrashIcon className="h-[16px] w-[16px]" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      )}
    </div>
  );
}

function AnnouncementForm({
  parishId,
  parishName,
  authorName,
  initial,
  onCancel,
  onSave,
}: {
  parishId: string;
  parishName: string;
  authorName: string;
  initial?: Article;
  onCancel: () => void;
  onSave: (article: Article) => void;
}) {
  const { t } = useTranslation();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [bodyText, setBodyText] = useState(initial?.body[0]?.paragraphs.join("\n\n") ?? "");

  function submit() {
    if (!title.trim() || !excerpt.trim()) return;
    const paragraphs = bodyText
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
    onSave({
      id: initial?.id ?? `priest-announcement-${Date.now().toString(36)}`,
      parishId,
      category: "parishes",
      title: title.trim(),
      excerpt: excerpt.trim(),
      author: authorName,
      publication: parishName,
      date: initial?.date ?? new Date().toISOString().slice(0, 10),
      body: [{ paragraphs: paragraphs.length > 0 ? paragraphs : [excerpt.trim()] }],
    });
  }

  return (
    <main className="flex-1 px-outer pt-[22px] pb-[40px]">
      <label className="block">
        <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">{t("priest.fieldTitle")}</span>
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t("priest.fieldTitlePlaceholder")}
          className="mt-[8px] w-full border-b border-divider bg-transparent pb-[10px] font-serif text-[18px] text-text outline-none focus:border-navy"
        />
      </label>

      <label className="mt-[24px] block">
        <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">{t("priest.fieldExcerpt")}</span>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder={t("priest.fieldExcerptPlaceholder")}
          rows={2}
          className="mt-[8px] w-full resize-none border-b border-divider bg-transparent pb-[10px] font-sans text-[14.5px] leading-[1.5] text-text outline-none focus:border-navy"
        />
      </label>

      <label className="mt-[24px] block">
        <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">{t("priest.fieldBody")}</span>
        <textarea
          value={bodyText}
          onChange={(e) => setBodyText(e.target.value)}
          placeholder={t("priest.fieldBodyPlaceholder")}
          rows={8}
          className="mt-[8px] w-full resize-none border-b border-divider bg-transparent pb-[10px] font-sans text-[14.5px] leading-[1.6] text-text outline-none focus:border-navy"
        />
      </label>

      <p className="mt-[16px] font-sans text-[12px] text-muted">{t("priest.attributionNote", { name: authorName, parish: parishName })}</p>

      <button
        type="button"
        disabled={!title.trim() || !excerpt.trim()}
        onClick={submit}
        className="press mt-[28px] w-full rounded-pill bg-burgundy py-[15px] text-center font-sans text-[15px] font-semibold text-white disabled:opacity-40"
      >
        {t(initial ? "priest.saveChanges" : "priest.publish")}
      </button>
      <button type="button" onClick={onCancel} className="press mt-[16px] w-full text-center font-sans text-[13px] text-muted">
        {t("common.cancel")}
      </button>
    </main>
  );
}
