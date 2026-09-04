"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { BackIcon } from "@/components/icons";
import { StepProgress } from "@/components/StepProgress";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { markOnboardingSkipped, useAccount } from "@/lib/storage";

type Step = "name" | "email" | "age";

const STEPS: Step[] = ["name", "email", "age"];
const STEP_TRANSITION = { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const };

const FIELD_BASE =
  "mt-[30px] w-full border-b-[1.5px] bg-transparent pb-[12px] font-serif text-[22px] text-text outline-none transition-colors duration-150 placeholder:text-muted/70";

/**
 * One question at a time rather than a single long form — each step is its
 * own quiet moment, sliding in from the direction of progress.
 *
 * Nothing here is required. Every field may be left empty and every step can
 * be skipped outright; validation only speaks up when someone has actually
 * typed something malformed, never to block an empty answer.
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
    setError("");
    setStep("email");
  }

  function handleEmailContinue() {
    const value = email.trim();
    // Only a malformed address is worth stopping for; an empty one is a choice.
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
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

  /** Leaves onboarding entirely, keeping whatever was answered so far. */
  function skipAll() {
    setAccount({ role: "parishioner", name: name.trim(), email: email.trim(), age: age.trim() || undefined });
    markOnboardingSkipped();
    router.replace("/today");
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background px-outer pb-[36px] pt-[max(env(safe-area-inset-top),20px)]">
      <div className="flex items-center gap-[14px]">
        <button
          type="button"
          onClick={goBack}
          aria-label={t("common.back")}
          className="press -ml-[8px] flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full text-navy"
        >
          <BackIcon className="h-[20px] w-[20px]" />
        </button>
        <StepProgress total={STEPS.length} current={STEPS.indexOf(step)} />
      </div>

      <div className="flex flex-1 flex-col justify-center pb-[8vh]">
        <AnimatePresence mode="wait">
          {step === "name" && (
            <motion.div key="name" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={STEP_TRANSITION}>
              <h1 className="font-serif text-[30px] font-bold leading-[1.2] text-text">{t("account.stepNameTitle")}</h1>
              <input
                autoFocus
                value={name}
                autoComplete="name"
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleNameContinue()}
                placeholder={t("account.namePlaceholder")}
                className={`${FIELD_BASE} border-navy/25 focus:border-navy`}
              />
              <StepActions onContinue={handleNameContinue} onSkip={skipAll} />
            </motion.div>
          )}

          {step === "email" && (
            <motion.div key="email" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={STEP_TRANSITION}>
              <h1 className="font-serif text-[30px] font-bold leading-[1.2] text-text">{t("account.stepEmailTitle")}</h1>
              <input
                autoFocus
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleEmailContinue()}
                placeholder={t("account.emailPlaceholder")}
                aria-invalid={error ? true : undefined}
                className={`${FIELD_BASE} ${error ? "border-burgundy" : "border-navy/25 focus:border-navy"}`}
              />
              {error && (
                <p role="alert" className="mt-[10px] font-sans text-[13px] text-burgundy">
                  {error}
                </p>
              )}
              <StepActions onContinue={handleEmailContinue} onSkip={skipAll} />
            </motion.div>
          )}

          {step === "age" && (
            <motion.div key="age" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={STEP_TRANSITION}>
              <h1 className="font-serif text-[30px] font-bold leading-[1.2] text-text">{t("account.stepAgeTitle")}</h1>
              <input
                autoFocus
                type="number"
                inputMode="numeric"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && finish(age)}
                placeholder={t("account.agePlaceholder")}
                className={`${FIELD_BASE} border-navy/25 focus:border-navy`}
              />
              <StepActions onContinue={() => finish(age)} onSkip={() => finish("")} skipLabel={t("account.skip")} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StepActions({ onContinue, onSkip, skipLabel }: { onContinue: () => void; onSkip: () => void; skipLabel?: string }) {
  const { t } = useTranslation();
  return (
    <>
      <motion.button
        type="button"
        onClick={onContinue}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="mt-[36px] w-full rounded-pill bg-burgundy py-[16px] text-center font-sans text-[15px] font-semibold text-white"
      >
        {t("common.continue")}
      </motion.button>
      <button type="button" onClick={onSkip} className="press mt-[18px] w-full text-center font-sans text-[13.5px] text-muted">
        {skipLabel ?? t("common.skipForNow")}
      </button>
    </>
  );
}
