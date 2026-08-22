"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { ShareIcon } from "./icons";

interface Props {
  title: string;
  text?: string;
  className?: string;
}

/** Uses the Web Share API (the browser's native share sheet); falls back to copying a link. */
export function ShareButton({ title, text, className }: Props) {
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {
        // user cancelled — no-op
      }
      return;
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  }

  return (
    <button
      type="button"
      aria-label="Share"
      onClick={handleShare}
      className={className ?? "press flex h-[36px] w-[36px] items-center justify-center rounded-sm"}
    >
      {copied ? (
        <span className="font-sans text-[11px] font-semibold text-burgundy">{t("common.copied")}</span>
      ) : (
        <ShareIcon className="h-[20px] w-[20px] text-text" />
      )}
    </button>
  );
}
