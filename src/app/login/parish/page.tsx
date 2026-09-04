"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { saveDemoParish } from "@/lib/data/parishes";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { DEMO_PARISH_TEMPLATES } from "@/lib/usLocationData";
import { markOnboardingSkipped, useAccount, useSelectedParishId } from "@/lib/storage";
import type { Parish } from "@/lib/types";

/**
 * Three fixed demo parishes, framed by whatever city/state the visitor just
 * chose — a real placeholder until a real parish directory covers this
 * location, per the current prototype's scope. Confirming builds a full
 * Parish record (see saveDemoParish) so the rest of the app treats it like
 * any other parish from here on.
 */
export default function ParishOnboardingPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [account] = useAccount();
  const [, setSelectedParishId] = useSelectedParishId();

  const city = account?.city ?? "";
  const state = account?.state ?? "";

  function confirm(templateId: string) {
    const template = DEMO_PARISH_TEMPLATES.find((p) => p.id === templateId);
    if (!template) return;
    const parish: Parish = {
      id: template.id,
      name: template.name,
      patronSaint: template.patronSaint,
      city,
      state,
      country: "SUA",
      jurisdiction: "ROEA",
      address: "123 Church St",
      latitude: 0,
      longitude: 0,
      phone: "(555) 010-1234",
      email: "office@example.org",
      website: "example.org",
      clergy: [{ name: template.priestName, role: "Parish Priest", roleRo: "Preot paroh" }],
      schedule: [
        { label: "Matins", time: "9:00 AM" },
        { label: "Divine Liturgy", time: "10:00 AM" },
      ],
      verifiedAt: new Date().toISOString().slice(0, 10),
    };
    saveDemoParish(parish);
    setSelectedParishId(parish.id);
    router.replace("/today");
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background px-outer pt-[max(env(safe-area-inset-top),24px)] pb-[32px]">
      <h1 className="font-serif text-[26px] font-bold leading-[1.25] text-text">{t("parishOnboarding.title", { city, state })}</h1>
      <p className="mt-[6px] font-serif text-[15px] italic text-muted">{t("parishOnboarding.subtitle")}</p>

      <div className="mt-[30px] flex flex-col gap-[32px]">
        {DEMO_PARISH_TEMPLATES.map((template, i) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="aspect-[16/9] w-full rounded-md bg-navy-texture" aria-hidden="true" />
            <p className="mt-[12px] font-serif text-[19px] font-bold text-text">{template.name}</p>
            <p className="mt-[2px] font-serif text-[14px] italic text-burgundy">{template.patronSaint}</p>
            <p className="mt-[4px] font-sans text-[13px] text-muted">
              {city}, {state} · {t("parishOnboarding.priestLabel")}: {template.priestName}
            </p>
            <button
              type="button"
              onClick={() => confirm(template.id)}
              className="press mt-[14px] rounded-pill border border-navy px-[18px] py-[9px] font-sans text-[13.5px] font-semibold text-navy"
            >
              {t("parishOnboarding.cta")}
            </button>
          </motion.div>
        ))}
      </div>

      <p className="mt-[28px] text-center font-sans text-[11.5px] italic text-muted">{t("parishOnboarding.disclaimer")}</p>

      <button
        type="button"
        onClick={() => {
          markOnboardingSkipped();
          router.replace("/today");
        }}
        className="press mt-[22px] w-full text-center font-sans text-[13.5px] text-muted"
      >
        {t("common.skipForNow")}
      </button>
    </div>
  );
}
