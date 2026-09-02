"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { BackIcon } from "./icons";

interface AppHeaderProps {
  title?: string;
  backHref?: string;
  right?: React.ReactNode;
  transparent?: boolean;
  /**
   * Sticks the header to the top of the viewport as a solid surface, so long
   * pages keep the title/actions in reach while scrolling. This is the
   * default for every screen using AppHeader — pass `sticky={false}` for the
   * rare screen that wants the plain, non-sticky bar instead. Ignored when
   * `transparent` is set (a header floating over its own hero image).
   */
  sticky?: boolean;
}

/** Standard back + centered title + optional right action bar used across secondary screens. */
export function AppHeader({ title, backHref, right, transparent, sticky = true }: AppHeaderProps) {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <header
      className={`flex h-[52px] shrink-0 items-center justify-between px-outer ${
        transparent ? "" : `border-b border-divider bg-surface ${sticky ? "sticky top-0 z-30" : ""}`
      }`}
    >
      <div className="flex w-[36px]">
        {backHref ? (
          <Link
            href={backHref}
            aria-label={t("common.back")}
            className="press flex h-[36px] w-[36px] items-center justify-center rounded-sm"
          >
            <BackIcon className="h-[22px] w-[22px] text-text" />
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => router.back()}
            aria-label={t("common.back")}
            className="press flex h-[36px] w-[36px] items-center justify-center rounded-sm"
          >
            <BackIcon className="h-[22px] w-[22px] text-text" />
          </button>
        )}
      </div>
      {title && (
        <h1 className="flex-1 truncate text-center font-sans text-[16px] font-semibold text-text">{title}</h1>
      )}
      <div className="flex w-[36px] justify-end">{right}</div>
    </header>
  );
}
