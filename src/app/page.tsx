"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { SealMark } from "@/components/SealMark";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { readEntryRoute } from "@/lib/storage";

/**
 * A short, cinematic logo entrance rather than a splash the visitor has to
 * wait through: the seal resolves in from a soft blur, holds briefly, then
 * the whole scene scales up and fades as it hands off to the next screen —
 * a continuous motion rather than logo → blank → login.
 */
export default function SplashPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<"enter" | "exit">("enter");

  useEffect(() => {
    const destination = readEntryRoute();
    const exitTimer = setTimeout(() => setPhase("exit"), 700);
    const navTimer = setTimeout(() => router.replace(destination), reduceMotion ? 750 : 1000);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(navTimer);
    };
  }, [router, reduceMotion]);

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-navy-texture px-outer">
      <motion.div
        className="flex flex-col items-center text-center text-white"
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.88, filter: "blur(6px)" }}
        animate={
          phase === "enter"
            ? reduceMotion
              ? { opacity: 1 }
              : { opacity: 1, scale: 1, filter: "blur(0px)" }
            : reduceMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 1.06, filter: "blur(2px)" }
        }
        transition={
          phase === "enter" ? { duration: 0.5, ease: [0.22, 1, 0.36, 1] } : { duration: 0.3, ease: [0.4, 0, 1, 1] }
        }
      >
        <SealMark size={84} tone="light" />
        <motion.p
          className="mt-[20px] font-serif text-[24px] font-bold uppercase leading-[1.15]"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: phase === "enter" ? 1 : 0, y: 0 }}
          transition={{ delay: phase === "enter" && !reduceMotion ? 0.18 : 0, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {t("brand.splashName")}
        </motion.p>
      </motion.div>
    </div>
  );
}
