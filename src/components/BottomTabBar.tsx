"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import type { TranslationKey } from "@/lib/i18n/translations";
import {
  NavCalendarIcon,
  NavHomeIcon,
  NavMenuLinesIcon,
  NavNewsIcon,
  NavProgramIcon,
} from "./icons";

type NavTab = "today" | "calendar" | "news" | "history" | "menu";

/** Today sits center — the app's home base, not a corner destination. */
const TABS: {
  id: NavTab;
  href: string;
  labelKey: TranslationKey;
  Icon: (p: { className?: string; active?: boolean }) => React.JSX.Element;
}[] = [
  { id: "calendar", href: "/calendar", labelKey: "nav.calendar", Icon: NavCalendarIcon },
  { id: "news", href: "/anunturi", labelKey: "nav.announcements", Icon: NavNewsIcon },
  { id: "today", href: "/today", labelKey: "nav.today", Icon: NavHomeIcon },
  { id: "history", href: "/program-liturgic", labelKey: "nav.schedule", Icon: NavProgramIcon },
  { id: "menu", href: "/menu", labelKey: "nav.menu", Icon: NavMenuLinesIcon },
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

/**
 * A plain, solid bar — no blur, no floating pill. The one piece of real
 * motion is the focus bubble: it doesn't just fade in on the new tab, it
 * carries over from wherever it was (one shared `layoutId`) and settles with
 * a touch of overshoot, so arriving somewhere reads as a small physical
 * event rather than a color swap.
 */
export function BottomTabBar() {
  const pathname = usePathname();
  const active = tabForPath(pathname);
  const { t } = useTranslation();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 mx-auto flex w-full max-w-[402px] items-stretch border-t border-divider bg-surface pb-[env(safe-area-inset-bottom,0px)]"
      aria-label="Primary"
    >
      {TABS.map(({ id, href, labelKey, Icon }) => {
        const isActive = id === active;
        return (
          <Link
            key={id}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className="relative flex min-h-[56px] flex-1 flex-col items-center justify-center gap-[3px] py-[8px]"
          >
            {isActive && (
              <motion.span
                layoutId="tab-focus-bubble"
                className="absolute h-[46px] w-[46px] rounded-2xl bg-burgundy/8"
                transition={{ type: "spring", stiffness: 380, damping: 26 }}
              />
            )}
            <motion.span
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={`relative z-10 flex flex-col items-center gap-[3px] ${isActive ? "text-burgundy" : "text-navy/50"}`}
            >
              <Icon className="h-[21px] w-[21px]" active={isActive} />
              <span className="font-sans text-[10px] font-medium">{t(labelKey)}</span>
            </motion.span>
          </Link>
        );
      })}
    </nav>
  );
}
