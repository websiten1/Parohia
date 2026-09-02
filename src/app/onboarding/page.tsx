"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlassButton } from "@/components/glass/GlassButton";
import { SealMark } from "@/components/SealMark";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

export default function OnboardingWelcomePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const words = t("onboarding.welcomeTitle").split(" ");

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-navy-texture px-outer text-center text-white">
      <div className="anim-scale-fade-in">
        <SealMark size={64} tone="light" />
      </div>

      <h1 className="mt-[30px] max-w-[300px] font-serif text-[30px] font-bold leading-[1.2] tracking-[-0.01em]">
        {words.map((word, i) => (
          <span key={i} className="anim-rise-fade-in mr-[8px] inline-block" style={{ animationDelay: `${180 + i * 90}ms` }}>
            {word}
          </span>
        ))}
      </h1>

      <p
        className="anim-rise-fade-in mt-[18px] max-w-[280px] font-serif text-[15px] italic leading-[1.5] text-white/70"
        style={{ animationDelay: `${180 + words.length * 90 + 120}ms` }}
      >
        {t("onboarding.welcomeMission")}
      </p>

      <div
        className="anim-rise-fade-in mt-[40px] w-full max-w-[320px]"
        style={{ animationDelay: `${180 + words.length * 90 + 240}ms` }}
      >
        <GlassButton onClick={() => router.push("/onboarding/features")} className="w-full">
          {t("onboarding.start")}
        </GlassButton>
      </div>

      <Link
        href="/menu/sign-in"
        className="anim-rise-fade-in press mt-[20px] font-sans text-[12.5px] text-white/50"
        style={{ animationDelay: `${180 + words.length * 90 + 300}ms` }}
      >
        {t("onboarding.signInLink")}
      </Link>
    </div>
  );
}
