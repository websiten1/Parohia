"use client";

import { useRouter } from "next/navigation";
import { BellIcon, NavCalendarIcon, NavReadingsIcon } from "@/components/icons";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import type { TranslationKey } from "@/lib/i18n/translations";

const FEATURES: { Icon: (p: { className?: string }) => React.JSX.Element; key: TranslationKey }[] = [
  { Icon: NavCalendarIcon, key: "onboarding.feature1" },
  { Icon: BellIcon, key: "onboarding.feature2" },
  { Icon: NavReadingsIcon, key: "onboarding.feature3" },
];

export default function OnboardingFeaturesPage() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="flex min-h-dvh flex-col bg-navy-texture px-outer pt-[max(env(safe-area-inset-top),64px)] text-white">
      <div className="flex flex-1 flex-col justify-center gap-[30px]">
        {FEATURES.map(({ Icon, key }, i) => (
          <div
            key={key}
            className="anim-rise-fade-in flex items-center gap-[18px]"
            style={{ animationDelay: `${i * 120}ms` }}
          >
            <span className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full border border-white/20">
              <Icon className="h-[22px] w-[22px] text-amber" />
            </span>
            <p className="font-serif text-[17px] leading-[1.35] text-white/90">{t(key)}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-[6px] pb-[26px]">
        <span className="h-[6px] w-[6px] rounded-full bg-white/25" aria-hidden="true" />
        <span className="h-[6px] w-[18px] rounded-pill bg-amber" aria-hidden="true" />
      </div>

      <button
        type="button"
        onClick={() => router.push("/onboarding/parish")}
        className="press mb-[max(env(safe-area-inset-bottom),24px)] w-full rounded-pill bg-burgundy py-[15px] text-center font-sans text-[15px] font-semibold text-white"
      >
        {t("common.continue")}
      </button>
    </div>
  );
}
