"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSettings } from "@/lib/storage";
import { statusStripColor } from "@/lib/themeColors";

/**
 * Applies the Appearance setting to the document.
 *
 * "light" and "dark" stamp an explicit `data-theme` so the choice wins over
 * the OS. "system" deliberately removes the attribute, which is what lets the
 * `prefers-color-scheme` block in globals.css take over — the setting existed
 * in storage long before it was wired to anything, and this is the piece that
 * was missing.
 */
export function ThemeSync() {
  const { settings, hydrated } = useSettings();
  const pathname = usePathname();

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    if (settings.appearance === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", settings.appearance);
  }, [settings.appearance, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    // The app's own "reduce motion" switch should behave like the OS one.
    document.documentElement.classList.toggle("reduce-motion", settings.reducedMotion);
  }, [settings.reducedMotion, hydrated]);

  /*
   * Safari fills the status-bar strip with theme-color rather than letting the
   * page paint there, so a single static value would always clash with one
   * page or another. Re-pointing it per route is what makes the strip vanish
   * into the top of the page.
   */
  useEffect(() => {
    if (!hydrated) return;
    const prefersDark =
      typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = settings.appearance === "dark" || (settings.appearance === "system" && prefersDark);

    /*
     * Only ever touch a tag we created ourselves, identified by data-owner.
     * Removing or mutating a meta tag rendered by Next means fighting React
     * for a node it owns, which threw `removeChild` of null on navigation.
     */
    let tag = document.querySelector<HTMLMetaElement>('meta[name="theme-color"][data-owner="parohia"]');
    if (!tag) {
      tag = document.createElement("meta");
      tag.name = "theme-color";
      tag.dataset.owner = "parohia";
      document.head.appendChild(tag);
    }
    tag.content = statusStripColor(pathname, isDark);
  }, [pathname, settings.appearance, hydrated]);

  return null;
}
