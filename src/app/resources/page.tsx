"use client";

import Link from "next/link";
import { PhotoHero } from "@/components/PhotoHero";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import type { TranslationKey } from "@/lib/i18n/translations";

const MODULES: { href: string; titleKey: TranslationKey; actionKey: TranslationKey }[] = [
  { href: "/readings", titleKey: "resources.holyScripture", actionKey: "resources.holyScriptureAction" },
  { href: "/resources/church-fathers", titleKey: "resources.churchFathers", actionKey: "resources.churchFathersAction" },
  { href: "/resources/videos", titleKey: "resources.videos", actionKey: "resources.videosAction" },
  { href: "/resources/articles", titleKey: "resources.articles", actionKey: "resources.articlesAction" },
];

export default function ResourcesPage() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="px-outer pt-[max(env(safe-area-inset-top),18px)] pb-[16px]">
        <h1 className="font-serif text-[30px] font-bold text-text">{t("resources.title")}</h1>
      </header>

      <main className="flex-1 px-outer pb-tabbar">
        {MODULES.map((m) => (
          <Link key={m.href} href={m.href} className="press mb-[14px] block last:mb-0">
            <PhotoHero alt={t(m.titleKey)} scrim="bottom" className="h-[138px] w-full rounded-md">
              <div className="absolute inset-x-0 bottom-0 px-[18px] pb-[14px]">
                <p className="font-serif text-[20px] font-bold text-white">{t(m.titleKey)}</p>
                <p className="mt-[2px] font-sans text-[13px] text-white/75">{t(m.actionKey)} →</p>
              </div>
            </PhotoHero>
          </Link>
        ))}
      </main>
    </div>
  );
}
