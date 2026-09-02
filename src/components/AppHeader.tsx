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
   * Sticks the header to the top of the viewport as a `glass-thick` surface,
   * so page content scrolls underneath and shows through the blur. This is
   * the default for every screen using AppHeader — pass `glass={false}` for
   * the rare screen that wants the old flat, non-sticky bar instead.
   * Ignored when `transparent` is set (a header floating over its own hero
   * image, which has no material of its own).
   */
  glass?: boolean;
}

/** Standard back + centered title + optional right action bar used across secondary screens. */
export function AppHeader({ title, backHref, right, transparent, glass = true }: AppHeaderProps) {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <header
      className={`flex h-[52px] shrink-0 items-center justify-between px-outer ${
        transparent ? "" : glass ? "glass-thick sticky top-0 z-30" : "border-b border-divider bg-surface"
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
