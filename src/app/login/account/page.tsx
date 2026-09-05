"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { BackIcon } from "@/components/icons";
import { StepProgress } from "@/components/StepProgress";
import { CircularActionButton, PrimaryAction, QuietAction } from "@/components/ui/Controls";
import { Field } from "@/components/ui/Field";
import { PageContainer } from "@/components/ui/Surfaces";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { markOnboardingSkipped, useAccount } from "@/lib/storage";

type Step = "name" | "email" | "age";

const STEPS: Step[] = ["name", "email", "age"];
const STEP_TRANSITION = { duration: 0.34, ease: [0.22, 1, 0.36, 1] as const };

/**
 * One decision at a time — a sequence of scenes, not a stack of form fields.
 * Nothing is required: every field may be left empty and every step skipped,
 * and validation only speaks up for an address that is actually malformed.
 * (§21)
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

  function handleEmailContinue() {
    const value = email.trim();
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

  function skipAll() {
    setAccount({ role: "parishioner", name: name.trim(), email: email.trim(), age: age.trim() || undefined });
    markOnboardingSkipped();
    router.replace("/today");
  }

  return (
    <PageContainer className="px-outer pb-[40px] pt-[max(env(safe-area-inset-top),20px)]">
      <div className="flex items-center gap-[16px]">
        <CircularActionButton label={t("common.back")} onClick={goBack}>
          <BackIcon className="h-[19px] w-[19px]" />
        </CircularActionButton>
        <StepProgress total={STEPS.length} current={STEPS.indexOf(step)} />
      </div>

      <div className="flex flex-1 flex-col justify-center pb-[10vh]">
        <AnimatePresence mode="wait">
          {step === "name" && (
            <Scene key="name">
              <Heading>{t("account.stepNameTitle")}</Heading>
              <Field
                autoFocus
                value={name}
                onChange={setName}
                autoComplete="name"
                onEnter={() => setStep("email")}
                placeholder={t("account.namePlaceholder")}
              />
              <Actions onContinue={() => setStep("email")} onSkip={skipAll} />
            </Scene>
          )}

          {step === "email" && (
            <Scene key="email">
              <Heading>{t("account.stepEmailTitle")}</Heading>
              <Field
                autoFocus
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                error={error}
                onChange={(v) => {
                  setEmail(v);
                  setError("");
                }}
                onEnter={handleEmailContinue}
                placeholder={t("account.emailPlaceholder")}
              />
              <Actions onContinue={handleEmailContinue} onSkip={skipAll} />
            </Scene>
          )}

          {step === "age" && (
            <Scene key="age">
              <Heading>{t("account.stepAgeTitle")}</Heading>
              <Field
                autoFocus
                type="number"
                inputMode="numeric"
                value={age}
                onChange={setAge}
                onEnter={() => finish(age)}
                placeholder={t("account.agePlaceholder")}
              />
              <Actions onContinue={() => finish(age)} onSkip={() => finish("")} skipLabel={t("account.skip")} />
            </Scene>
          )}
        </AnimatePresence>
      </div>
    </PageContainer>
  );
}

/** Existing content softens away as the next step arrives, so steps read as one continuous sequence. */
function Scene({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={STEP_TRANSITION}
    >
      {children}
    </motion.div>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return <h1 className="mb-[28px] font-serif text-[32px] font-bold leading-[1.15] text-text">{children}</h1>;
}

function Actions({ onContinue, onSkip, skipLabel }: { onContinue: () => void; onSkip: () => void; skipLabel?: string }) {
  const { t } = useTranslation();
  return (
    <div className="mt-[36px] flex flex-col gap-[12px]">
      <PrimaryAction onClick={onContinue}>{t("common.continue")}</PrimaryAction>
      <QuietAction onClick={onSkip}>{skipLabel ?? t("common.skipForNow")}</QuietAction>
    </div>
  );
}
