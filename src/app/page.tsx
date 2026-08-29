"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SealMark } from "@/components/SealMark";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { readSelectedParishId } from "@/lib/storage";

export default function SplashPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const destination = readSelectedParishId() ? "/today" : "/onboarding";
    const leaveTimer = setTimeout(() => setLeaving(true), 1500);
    const navTimer = setTimeout(() => router.replace(destination), 1750);
    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(navTimer);
    };
  }, [router]);

  return (
    <div
      className={`relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-navy-texture px-outer transition-opacity duration-[250ms] ease-out ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative flex flex-col items-center text-center text-white">
        <div className="anim-scale-fade-in">
          <SealMark size={88} tone="light" />
        </div>

        <div className="mt-[22px] font-serif text-[26px] font-bold uppercase leading-[1.15]">
          <p className="anim-rise-fade-in" style={{ animationDelay: "140ms" }}>
            {t("brand.splashName")}
          </p>
        </div>

        <div className="anim-draw-line mt-[24px] h-px w-[120px] bg-white/30" style={{ animationDelay: "440ms" }} />

        <p
          className="anim-rise-fade-in mt-[16px] font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60"
          style={{ animationDelay: "500ms" }}
        >
          {t("brand.tagline")}
        </p>
      </div>
    </div>
  );
}
