"use client";

import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { SealMark } from "@/components/SealMark";
import { PrimaryAction, QuietAction } from "@/components/ui/Controls";
import { PageContainer } from "@/components/ui/Surfaces";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { markOnboardingSkipped } from "@/lib/storage";

/**
 * The beginning of the same product, not an external form: the app's own warm
 * ground, typography and motion. The parishioner path is the composition's
 * point; priest access sits below it, quieter, and "look around first" quieter
 * still — nobody has to answer anything to see the app. (§20, §21)
 */
export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  function lookAround() {
    markOnboardingSkipped();
    router.replace("/today");
  }

  const rise = (delay: number) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <PageContainer className="px-outer pb-[48px] pt-[max(env(safe-area-inset-top),32px)]">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <motion.div {...rise(0)}>
          <SealMark size={72} />
        </motion.div>
        <motion.h1 {...rise(0.1)} className="mt-[26px] font-serif text-[40px] font-bold leading-[1.05] text-text">
          {t("brand.name")}
        </motion.h1>
        <motion.p {...rise(0.18)} className="mt-[12px] font-serif text-[17px] italic leading-[1.45] text-muted">
          {t("brand.tagline")}
        </motion.p>
      </div>

      <motion.div {...rise(0.28)} className="flex w-full flex-col items-center gap-[18px]">
        <div className="w-full max-w-[340px]">
          <PrimaryAction onClick={() => router.push("/login/account")}>{t("login.parishionerCta")}</PrimaryAction>
        </div>
        <div className="w-full max-w-[340px]">
          <QuietAction onClick={() => router.push("/login/priest")} className="font-medium text-text-secondary">
            {t("login.priestCta")}
          </QuietAction>
        </div>
        <QuietAction onClick={lookAround} className="mt-[6px] text-[13.5px]">
          {t("login.skipCta")}
        </QuietAction>
      </motion.div>
    </PageContainer>
  );
}
