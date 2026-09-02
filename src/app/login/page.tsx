"use client";

import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { SealMark } from "@/components/SealMark";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

/**
 * The parishioner path is the whole visual point of this screen — large,
 * centered, first. Priest access exists, deliberately quieter and lower, so
 * it never competes with the primary path for attention.
 */
export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-between overflow-hidden bg-navy-texture px-outer py-[56px] text-white">
      <motion.div
        className="flex flex-col items-center text-center"
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <SealMark size={52} tone="light" />
        <p className="mt-[14px] font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">
          {t("brand.splashName")}
        </p>
      </motion.div>

      <motion.div
        className="flex w-full flex-col items-center"
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.button
          type="button"
          onClick={() => router.push("/login/account")}
          whileTap={reduceMotion ? undefined : { scale: 0.97 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="w-full max-w-[320px] rounded-pill bg-burgundy py-[16px] text-center font-sans text-[16px] font-semibold text-white"
        >
          {t("login.parishionerCta")}
        </motion.button>

        <button
          type="button"
          onClick={() => router.push("/login/priest")}
          className="press mt-[26px] font-sans text-[13px] text-white/50"
        >
          {t("login.priestCta")}
        </button>
      </motion.div>
    </div>
  );
}
