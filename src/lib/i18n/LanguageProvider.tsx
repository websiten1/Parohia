"use client";

import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { useSettings } from "@/lib/storage";
import { en, ro, type TranslationKey } from "./translations";

type Vars = Record<string, string | number>;

interface LanguageContextValue {
  language: "en" | "ro";
  t: (key: TranslationKey, vars?: Vars) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const DICTS = { en, ro };

function interpolate(template: string, vars?: Vars) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, key) => (key in vars ? String(vars[key]) : match));
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { settings, hydrated } = useSettings();
  const language = hydrated ? settings.language : "en";

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<LanguageContextValue>(() => {
    const dict = DICTS[language];
    return {
      language,
      t: (key: TranslationKey, vars?: Vars) => interpolate(dict[key] ?? en[key], vars),
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return ctx;
}
