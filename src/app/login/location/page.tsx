"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { BackIcon } from "@/components/icons";
import { StepProgress } from "@/components/StepProgress";
import { CircularActionButton, PrimaryAction, QuietAction } from "@/components/ui/Controls";
import { PageContainer } from "@/components/ui/Surfaces";
import { WheelPicker } from "@/components/WheelPicker";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { markOnboardingSkipped, useAccount } from "@/lib/storage";
import { CITIES_BY_STATE, US_STATES, type USState } from "@/lib/usLocationData";

type Step = "state" | "city";
const STEPS: Step[] = ["state", "city"];
const STEP_TRANSITION = { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const };

export default function LocationPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [account, setAccount] = useAccount();
  const [step, setStep] = useState<Step>("state");
  const [state, setState] = useState<USState>((account?.state as USState) || US_STATES[0]);
  const [city, setCity] = useState<string>(account?.city || CITIES_BY_STATE[(account?.state as USState) || US_STATES[0]][0]);

  function handleStateChange(next: USState) {
    setState(next);
    setCity(CITIES_BY_STATE[next][0]);
  }

  function goBack() {
    if (step === "state") router.push("/login/account");
    else setStep("state");
  }

  function confirmCity() {
    setAccount(account ? { ...account, state, city } : { role: "parishioner", name: "", email: "", state, city });
    router.push("/login/parish");
  }

  function skipAll() {
    markOnboardingSkipped();
    router.replace("/today");
  }

  return (
    <PageContainer wash="violet" className="px-outer pb-[40px] pt-[max(env(safe-area-inset-top),20px)]">
      <div className="flex items-center gap-[16px]">
        <CircularActionButton label={t("common.back")} onClick={goBack}>
          <BackIcon className="h-[19px] w-[19px]" />
        </CircularActionButton>
        <StepProgress total={STEPS.length} current={STEPS.indexOf(step)} />
      </div>

      <div className="flex flex-1 flex-col justify-center pb-[6vh]">
        <AnimatePresence mode="wait">
          {step === "state" && (
            <motion.div key="state" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={STEP_TRANSITION}>
              <h1 className="text-center font-serif text-[30px] font-bold leading-[1.15] text-text">{t("location.stateTitle")}</h1>
              <div className="mt-[26px]">
                <WheelPicker options={[...US_STATES]} value={state} onChange={handleStateChange} aria-label={t("location.stateTitle")} />
              </div>
              <StepActions onContinue={() => setStep("city")} onSkip={skipAll} />
            </motion.div>
          )}

          {step === "city" && (
            <motion.div key="city" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={STEP_TRANSITION}>
              <h1 className="text-center font-serif text-[30px] font-bold leading-[1.15] text-text">{t("location.cityTitle")}</h1>
              <div className="mt-[26px]">
                <WheelPicker options={CITIES_BY_STATE[state]} value={city} onChange={setCity} aria-label={t("location.cityTitle")} />
              </div>
              <StepActions onContinue={confirmCity} onSkip={skipAll} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageContainer>
  );
}

function StepActions({ onContinue, onSkip }: { onContinue: () => void; onSkip: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="mt-[30px] flex flex-col gap-[12px]">
      <PrimaryAction onClick={onContinue}>{t("common.continue")}</PrimaryAction>
      <QuietAction onClick={onSkip}>{t("common.skipForNow")}</QuietAction>
    </div>
  );
}
