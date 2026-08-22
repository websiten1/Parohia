import Link from "next/link";
import { ChevronRightIcon } from "./icons";

interface ChevronRowProps {
  href: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
  divider?: boolean;
}

/** Full-width tappable list row: optional leading icon, title/subtitle, trailing chevron. */
export function ChevronRow({ href, title, subtitle, icon, trailing, divider = true }: ChevronRowProps) {
  return (
    <Link
      href={href}
      className={`press flex min-h-[44px] items-center gap-[14px] py-[14px] ${divider ? "border-b border-divider" : ""}`}
    >
      {icon && (
        <span className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-sm bg-navy-08 text-navy">
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate font-sans text-[15px] font-medium text-text">{title}</span>
        {subtitle && <span className="mt-[2px] block truncate font-sans text-[13px] text-muted">{subtitle}</span>}
      </span>
      {trailing}
      <ChevronRightIcon className="h-[18px] w-[18px] shrink-0 text-muted" />
    </Link>
  );
}
