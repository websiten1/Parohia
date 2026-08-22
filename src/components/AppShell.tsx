"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { BottomTabBar } from "./BottomTabBar";

/**
 * Exact routes that show the persistent bottom tab bar — the same set that
 * used to render <BottomTabBar /> inline on each page. Kept as an exact-match
 * list (not a prefix match) so detail/reader screens under these sections
 * (e.g. /menu/about, /reading/[id]) stay bar-free, matching prior behavior.
 */
const BAR_ROUTES = new Set([
  "/today",
  "/calendar",
  "/readings",
  "/resources",
  "/prayers",
  "/fasting",
  "/events",
  "/parish-finder",
  "/menu",
  "/news",
  "/history",
]);

/**
 * Renders the bottom nav as a SIBLING of the animated page content, never a
 * descendant — a transform on the page-transition wrapper must not touch an
 * ancestor of the fixed nav, or position:fixed starts tracking that ancestor
 * instead of the viewport and the bar would visibly jump during transitions.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <>
      <div key={pathname} className="page-transition flex flex-1 flex-col">
        {children}
      </div>
      {BAR_ROUTES.has(pathname) && <BottomTabBar />}
    </>
  );
}
