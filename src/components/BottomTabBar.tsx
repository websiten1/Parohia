"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
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

/**
 * A floating Liquid Glass capsule, inset from the edges rather than docked
 * flush to them. The active tab isn't a color swap — a soft burgundy-tinted
 * pill slides beneath it (one shared layout animation, `layoutId`), so
 * switching tabs reads as the material itself moving into place.
 */
export function BottomTabBar() {
  const pathname = usePathname();
  const active = tabForPath(pathname);
  const { t } = useTranslation();

  return (
    <nav
      className="glass-thick fixed inset-x-0 bottom-[max(env(safe-area-inset-bottom),14px)] z-30 mx-auto flex w-[calc(100%-32px)] max-w-[370px] items-stretch justify-between rounded-pill p-[6px]"
      aria-label="Primary"
    >
      {TABS.map(({ id, href, labelKey, Icon }) => {
        const isActive = id === active;
        return (
          <Link
            key={id}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className="relative flex min-h-[44px] flex-1 flex-col items-center justify-center gap-[2px] rounded-pill py-[8px]"
          >
            {isActive && (
              <motion.span
                layoutId="tab-active-pill"
                className="absolute inset-0 rounded-pill bg-burgundy/11"
                style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55)" }}
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <motion.span
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={`relative z-10 flex flex-col items-center gap-[2px] ${isActive ? "text-burgundy" : "text-navy/55"}`}
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
