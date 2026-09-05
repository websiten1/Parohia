"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { NAV_TINT } from "@/lib/navColors";
import { TINTS } from "@/lib/tints";
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

/*
 * Spec'd motion: response ~0.42s with almost no visible bounce. Motion's
 * duration/bounce form expresses that directly — bounce 0.05 sits around a
 * 0.87 damping fraction, inside the 0.82–0.90 the brief asks for.
 */
const NAV_SPRING = { type: "spring" as const, duration: 0.42, bounce: 0.05 };

/** A subtle selection tick, fired as the capsule commits — not on every touch. */
function selectionHaptic() {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate?.(8);
  }
}

/**
 * A stable dark vessel containing a moving light selection object — not five
 * buttons on a background, and not an ordinary tab bar with a label under
 * every icon.
 *
 * The lit capsule is a single shared element (`layoutId`), so on a selection
 * change it physically travels and reshapes toward the new destination while
 * the outgoing label collapses its own width. Inactive destinations stay
 * compact and unlabelled; only the selected one carries text, which is what
 * makes the bar redistribute its internal space rather than sit in five
 * permanently equal columns.
 */
export function BottomTabBar() {
  const pathname = usePathname();
  const active = tabForPath(pathname);
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[402px]">
      <nav
        aria-label="Primary"
        style={{ backgroundImage: "var(--gradient-vessel)" }}
        className="pointer-events-auto mx-[22px] mb-[calc(16px+env(safe-area-inset-bottom,0px))] flex h-[68px] items-center gap-[2px] rounded-nav bg-charcoal p-[7px] elev-floating"
      >
        {TABS.map(({ id, href, labelKey, Icon }) => {
          const isActive = id === active;
          return (
            <motion.div
              key={id}
              layout={!reduceMotion}
              transition={NAV_SPRING}
              className={isActive ? "min-w-0 flex-1" : "shrink-0"}
            >
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                aria-label={t(labelKey)}
                onClick={() => {
                  if (!isActive) selectionHaptic();
                }}
                className={`relative flex h-[54px] items-center justify-center rounded-nav-item ${
                  isActive ? "w-full px-[15px]" : "w-[48px]"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-selection"
                    transition={NAV_SPRING}
                    style={{ background: TINTS[NAV_TINT[id]].surface }}
                    className="absolute inset-0 rounded-nav-item"
                    aria-hidden="true"
                  />
                )}
                <motion.span
                  whileTap={reduceMotion ? undefined : { scale: 0.975 }}
                  transition={{ type: "spring", stiffness: 620, damping: 34 }}
                  style={{ color: isActive ? TINTS[NAV_TINT[id]].ink : undefined }}
                  className={`relative z-10 flex min-w-0 items-center justify-center gap-[9px] ${
                    isActive ? "" : "text-white/50"
                  }`}
                >
                  <Icon className="h-[21px] w-[21px] shrink-0" active={isActive} />
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.span
                        // Width, opacity and a short travel together — the label
                        // grows out of the icon rather than blinking into place.
                        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, width: 0, x: -6 }}
                        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, width: "auto", x: 0 }}
                        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, width: 0, x: -6 }}
                        transition={NAV_SPRING}
                        className="max-w-[128px] overflow-hidden whitespace-nowrap font-sans text-[14.5px] font-semibold"
                      >
                        {t(labelKey)}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.span>
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </div>
  );
}
