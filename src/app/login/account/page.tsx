"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { BackIcon } from "@/components/icons";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { useAccount } from "@/lib/storage";

type Step = "name" | "email" | "age";

const STEP_TRANSITION = { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const };

/**
 * One question at a time rather than a single long form — each step is its
 * own quiet moment, sliding in from the direction of progress rather than
 * just appearing, so the sequence reads as one continuous conversation.
 */
export default function AccountPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [, setAccount] = useAccount();
  const [step, setStep] = useState<Step>("name");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [error, setError] = useState("");

  function goBack() {
    setError("");
    if (step === "name") router.push("/login");
    else if (step === "email") setStep("name");
    else setStep("email");
  }

  function handleNameContinue() {
    if (!name.trim()) {
      setError(t("account.errorName"));
      return;
    }
    setError("");
    setStep("email");
  }

  function handleEmailContinue() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(t("account.errorEmail"));
      return;
    }
    setError("");
    setStep("age");
  }

  function finish(ageValue: string) {
    setAccount({ role: "parishioner", name: name.trim(), email: email.trim(), age: ageValue.trim() || undefined });
    router.push("/login/location");
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background px-outer pt-[max(env(safe-area-inset-top),24px)] pb-[32px]">
      <button
        type="button"
        onClick={goBack}
        aria-label={t("common.back")}
        className="press flex h-[36px] w-[36px] items-center justify-center rounded-full text-navy"
      >
        <BackIcon className="h-[20px] w-[20px]" />
      </button>

      <div className="flex flex-1 flex-col justify-center">
        <AnimatePresence mode="wait">
          {step === "name" && (
            <motion.div key="name" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={STEP_TRANSITION}>
              <h1 className="font-serif text-[28px] font-bold leading-[1.25] text-text">{t("account.stepNameTitle")}</h1>
              <input
                autoFocus
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleNameContinue()}
                placeholder={t("account.namePlaceholder")}
                className="mt-[26px] w-full border-b border-divider bg-transparent pb-[10px] font-serif text-[20px] text-text outline-none focus:border-navy"
              />
              {error && <p className="mt-[8px] font-sans text-[12.5px] text-red-600">{error}</p>}
              <button
                type="button"
                onClick={handleNameContinue}
                className="press mt-[32px] w-full rounded-pill bg-burgundy py-[15px] text-center font-sans text-[15px] font-semibold text-white"
              >
                {t("common.continue")}
              </button>
            </motion.div>
          )}

          {step === "email" && (
            <motion.div key="email" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={STEP_TRANSITION}>
              <h1 className="font-serif text-[28px] font-bold leading-[1.25] text-text">{t("account.stepEmailTitle")}</h1>
              <input
                autoFocus
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleEmailContinue()}
                placeholder={t("account.emailPlaceholder")}
                className="mt-[26px] w-full border-b border-divider bg-transparent pb-[10px] font-serif text-[20px] text-text outline-none focus:border-navy"
              />
              {error && <p className="mt-[8px] font-sans text-[12.5px] text-red-600">{error}</p>}
              <button
                type="button"
                onClick={handleEmailContinue}
                className="press mt-[32px] w-full rounded-pill bg-burgundy py-[15px] text-center font-sans text-[15px] font-semibold text-white"
              >
                {t("common.continue")}
              </button>
            </motion.div>
          )}

          {step === "age" && (
            <motion.div key="age" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={STEP_TRANSITION}>
              <h1 className="font-serif text-[28px] font-bold leading-[1.25] text-text">{t("account.stepAgeTitle")}</h1>
              <input
                autoFocus
                type="number"
                inputMode="numeric"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && finish(age)}
                placeholder={t("account.agePlaceholder")}
                className="mt-[26px] w-full border-b border-divider bg-transparent pb-[10px] font-serif text-[20px] text-text outline-none focus:border-navy"
              />
              <button
                type="button"
                onClick={() => finish(age)}
                className="press mt-[32px] w-full rounded-pill bg-burgundy py-[15px] text-center font-sans text-[15px] font-semibold text-white"
              >
                {t("common.continue")}
              </button>
              <button type="button" onClick={() => finish("")} className="press mt-[16px] w-full text-center font-sans text-[13px] text-muted">
                {t("account.skip")}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
