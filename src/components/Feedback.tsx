"use client";

import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { PrimaryAction, SecondaryAction } from "@/components/ui/Controls";

/**
 * An intentional version of the screen, not evidence that content failed to
 * load — same typography, spacing and background as everywhere else, with one
 * action only when there is genuinely an action to take. (§35)
 */
export function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  onAction,
}: {
  icon?: React.ReactNode;
  title?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center px-outer py-[56px] text-center">
      {icon && (
        <span className="mb-[18px] flex h-[52px] w-[52px] items-center justify-center rounded-full bg-surface-soft text-text">
          {icon}
        </span>
      )}
      {title && <p className="font-serif text-[21px] font-bold leading-[1.25] text-text">{title}</p>}
      <p className={`max-w-[280px] font-sans text-[15px] leading-[1.5] text-muted ${title ? "mt-[8px]" : ""}`}>
        {message}
      </p>
      {actionLabel && onAction && (
        <div className="mt-[24px] w-full max-w-[260px]">
          <SecondaryAction onClick={onAction}>{actionLabel}</SecondaryAction>
        </div>
      )}
    </div>
  );
}

/**
 * Keeps the user inside the current context and says what could not be
 * completed, using the global surface and button language. Minor errors never
 * get alarming full-screen treatment. (§37)
 */
export function InlineErrorCard({
  title,
  message,
  onRetry,
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="mx-outer rounded-card bg-surface-soft p-[20px]">
      <p className="font-sans text-[15.5px] font-semibold text-text">{title ?? t("common.somethingWrong")}</p>
      <p className="mt-[6px] font-sans text-[14px] leading-[1.45] text-muted">{message}</p>
      {onRetry && (
        <div className="mt-[16px]">
          <PrimaryAction onClick={onRetry}>{t("common.retry")}</PrimaryAction>
        </div>
      )}
    </div>
  );
}

export function LoadingMark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${className} anim-spin-slow text-text`} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" strokeOpacity="0.18" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/**
 * A structural placeholder that preserves the layout the real content will
 * occupy, so nothing jumps when it arrives. (§36)
 */
export function Skeleton({ className }: { className: string }) {
  return <div className={`skeleton anim-pulse-subtle ${className}`} />;
}

/** Placeholder shaped like the card it stands in for. */
export function LoadingPlaceholder({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={`rounded-card bg-surface p-[22px] ${className ?? ""}`} aria-hidden="true">
      <Skeleton className="h-[18px] w-[55%] rounded-sm" />
      <div className="mt-[14px] flex flex-col gap-[10px]">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className={`h-[12px] rounded-sm ${i === lines - 1 ? "w-[70%]" : "w-full"}`} />
        ))}
      </div>
    </div>
  );
}
