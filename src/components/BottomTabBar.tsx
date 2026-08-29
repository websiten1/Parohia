"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import type { TranslationKey } from "@/lib/i18n/translations";
import {
  NavCalendarIcon,
  NavHomeIcon,
  NavNewsIcon,
  NavPersonIcon,
  NavProgramIcon,
} from "./icons";

type NavTab = "today" | "calendar" | "news" | "history" | "menu";

const TABS: {
  id: NavTab;
  href: string;
  labelKey: TranslationKey;
  Icon: (p: { className?: string; active?: boolean }) => React.JSX.Element;
}[] = [
  { id: "today", href: "/today", labelKey: "nav.today", Icon: NavHomeIcon },
  { id: "calendar", href: "/calendar", labelKey: "nav.calendar", Icon: NavCalendarIcon },
  { id: "news", href: "/anunturi", labelKey: "nav.announcements", Icon: NavNewsIcon },
  { id: "history", href: "/program-liturgic", labelKey: "nav.schedule", Icon: NavProgramIcon },
  { id: "menu", href: "/menu", labelKey: "nav.menu", Icon: NavPersonIcon },
];

function tabForPath(pathname: string): NavTab | null {
  if (pathname.startsWith("/today") || pathname.startsWith("/saint") || pathname.startsWith("/notifications")) return "today";
  if (pathname.startsWith("/calendar")) return "calendar";
  if (pathname.startsWith("/anunturi") || pathname.startsWith("/events") || pathname.startsWith("/event")) return "news";
  if (pathname.startsWith("/program-liturgic")) return "history";
  if (
    pathname.startsWith("/menu") ||
    pathname.startsWith("/parish") ||
    pathname.startsWith("/readings") ||
    pathname.startsWith("/reading") ||
    pathname.startsWith("/prayer") ||
    pathname.startsWith("/fasting") ||
    pathname.startsWith("/resources") ||
    pathname.startsWith("/resource") ||
    pathname.startsWith("/article") ||
    pathname.startsWith("/video")
  )
    return "menu";
  return null;
}

export function BottomTabBar() {
  const pathname = usePathname();
  const active = tabForPath(pathname);
  const { t } = useTranslation();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 mx-auto flex w-full max-w-[402px] shrink-0 items-stretch border-t border-divider bg-surface pb-[max(env(safe-area-inset-bottom),0px)]"
      aria-label="Primary"
    >
      {TABS.map(({ id, href, labelKey, Icon }) => {
        const isActive = id === active;
        const isMenu = id === "menu";
        return (
          <Link
            key={id}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`press flex min-h-[44px] flex-1 flex-col items-center justify-center gap-[4px] py-[10px] transition-colors duration-150 ${
              isActive && isMenu ? "bg-burgundy text-surface" : isActive ? "text-burgundy" : "text-navy/55"
            }`}
          >
            <Icon className="h-[22px] w-[22px]" active={isActive} />
            <span className="font-sans text-[10px] font-medium">{t(labelKey)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
