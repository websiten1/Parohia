"use client";

import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons";
import { PhotoHero } from "@/components/PhotoHero";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import type { TranslationKey } from "@/lib/i18n/translations";
import { PageContainer } from "@/components/ui/Surfaces";

const MODULES: { href: string; titleKey: TranslationKey; actionKey: TranslationKey }[] = [
  { href: "/readings", titleKey: "resources.holyScripture", actionKey: "resources.holyScriptureAction" },
  { href: "/resources/church-fathers", titleKey: "resources.churchFathers", actionKey: "resources.churchFathersAction" },
  { href: "/resources/videos", titleKey: "resources.videos", actionKey: "resources.videosAction" },
  { href: "/resources/articles", titleKey: "resources.articles", actionKey: "resources.articlesAction" },
];

export default function ResourcesPage() {
  const { t } = useTranslation();
  return (
    <PageContainer>
      <header className="px-outer pt-[max(env(safe-area-inset-top),18px)] pb-[16px]">
        <h1 className="font-serif text-[30px] font-bold text-text">{t("resources.title")}</h1>
      </header>

      <main className="flex-1 px-outer pb-tabbar">
        {MODULES.map((m) => (
          <Link key={m.href} href={m.href} className="press mb-[14px] block last:mb-0">
            <PhotoHero alt={t(m.titleKey)} scrim="bottom" className="h-[138px] w-full rounded-compact">
              <div className="absolute inset-x-0 bottom-0 px-[18px] pb-[14px]">
                <p className="font-serif text-[20px] font-bold text-white">{t(m.titleKey)}</p>
                <p className="mt-[2px] flex items-center gap-[6px] font-sans text-[13px] text-white/75">
                  {t(m.actionKey)}
                  <ChevronRightIcon className="h-[13px] w-[13px]" />
                </p>
              </div>
            </PhotoHero>
          </Link>
        ))}
      </main>
    </PageContainer>
  );
}
