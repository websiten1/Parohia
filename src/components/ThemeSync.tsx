"use client";

import { useEffect } from "react";
import { useSettings } from "@/lib/storage";

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

  return null;
}
