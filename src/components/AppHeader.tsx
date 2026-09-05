"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { CircularActionButton } from "@/components/ui/Controls";
import { BackIcon } from "./icons";

interface AppHeaderProps {
  title?: string;
  backHref?: string;
  right?: React.ReactNode;
  transparent?: boolean;
  /**
   * Keeps the title and actions in reach on long pages. Ignored when
   * `transparent` is set (a header floating over its own hero image).
   */
  sticky?: boolean;
}

/**
 * Secondary-screen header. Controls are independent circular surfaces rather
 * than a welded toolbar, and the bar carries no rule underneath it — it
 * separates from the content by tone, the way every other surface in this
 * system does. (§08, §32)
 */
export function AppHeader({ title, backHref, right, transparent, sticky = true }: AppHeaderProps) {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <header
      className={`flex h-[64px] shrink-0 items-center justify-between gap-[12px] px-outer ${
        transparent ? "" : `bg-background ${sticky ? "sticky top-0 z-30" : ""}`
      }`}
    >
      <div className="flex w-[44px] shrink-0">
        <CircularActionButton
          label={t("common.back")}
          href={backHref}
          onClick={backHref ? undefined : () => router.back()}
          tone={transparent ? "onDark" : "light"}
        >
          <BackIcon className="h-[19px] w-[19px]" />
        </CircularActionButton>
      </div>
      {title && (
        <h1 className="min-w-0 flex-1 truncate text-center font-sans text-[17px] font-semibold text-text">{title}</h1>
      )}
      <div className="flex min-w-[44px] shrink-0 items-center justify-end gap-[8px]">{right}</div>
    </header>
  );
}
