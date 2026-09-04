"use client";

import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { SealMark } from "@/components/SealMark";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { markOnboardingSkipped } from "@/lib/storage";

/**
 * The parishioner path is the whole visual point of this screen — large,
 * centered, first. Priest access sits below it, quieter. "Look around first"
 * is quieter still and last: it exists so nobody has to answer anything to
 * see the app, without competing with the path most visitors want.
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
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-navy-texture px-outer pb-[44px] pt-[max(env(safe-area-inset-top),32px)] text-white">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <motion.div {...rise(0)}>
          <SealMark size={68} tone="light" />
        </motion.div>
        <motion.h1 {...rise(0.1)} className="mt-[22px] font-serif text-[38px] font-bold leading-[1.05] text-white">
          {t("brand.name")}
        </motion.h1>
        <motion.p {...rise(0.18)} className="mt-[10px] font-serif text-[16px] italic leading-[1.45] text-white/60">
          {t("brand.tagline")}
        </motion.p>
      </div>

      <motion.div {...rise(0.28)} className="flex w-full flex-col items-center">
        <motion.button
          type="button"
          onClick={() => router.push("/login/account")}
          whileTap={reduceMotion ? undefined : { scale: 0.97 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="w-full max-w-[330px] rounded-pill bg-burgundy py-[17px] text-center font-sans text-[16px] font-semibold text-white"
        >
          {t("login.parishionerCta")}
        </motion.button>

        <button
          type="button"
          onClick={() => router.push("/login/priest")}
          className="press mt-[22px] font-sans text-[14px] font-medium text-white/70"
        >
          {t("login.priestCta")}
        </button>

        <button type="button" onClick={lookAround} className="press mt-[30px] font-sans text-[13px] text-white/45">
          {t("login.skipCta")}
        </button>
      </motion.div>
    </div>
  );
}
