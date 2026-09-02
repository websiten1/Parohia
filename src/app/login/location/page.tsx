"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { BackIcon } from "@/components/icons";
import { WheelPicker } from "@/components/WheelPicker";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { useAccount } from "@/lib/storage";
import { CITIES_BY_STATE, US_STATES, type USState } from "@/lib/usLocationData";

type Step = "state" | "city";
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
          {step === "state" && (
            <motion.div key="state" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={STEP_TRANSITION}>
              <h1 className="text-center font-serif text-[26px] font-bold leading-[1.25] text-text">{t("location.stateTitle")}</h1>
              <div className="mt-[8px]">
                <WheelPicker options={[...US_STATES]} value={state} onChange={handleStateChange} aria-label={t("location.stateTitle")} />
              </div>
              <button
                type="button"
                onClick={() => setStep("city")}
                className="press mt-[8px] w-full rounded-pill bg-burgundy py-[15px] text-center font-sans text-[15px] font-semibold text-white"
              >
                {t("common.continue")}
              </button>
            </motion.div>
          )}

          {step === "city" && (
            <motion.div key="city" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={STEP_TRANSITION}>
              <h1 className="text-center font-serif text-[26px] font-bold leading-[1.25] text-text">{t("location.cityTitle")}</h1>
              <div className="mt-[8px]">
                <WheelPicker options={CITIES_BY_STATE[state]} value={city} onChange={setCity} aria-label={t("location.cityTitle")} />
              </div>
              <button
                type="button"
                onClick={confirmCity}
                className="press mt-[8px] w-full rounded-pill bg-burgundy py-[15px] text-center font-sans text-[15px] font-semibold text-white"
              >
                {t("common.continue")}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
