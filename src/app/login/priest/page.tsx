"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { BackIcon, SearchIcon } from "@/components/icons";
import { WheelPicker } from "@/components/WheelPicker";
import { listParishes, savePriestParish } from "@/lib/data/parishes";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { useAccount } from "@/lib/storage";
import { CITIES_BY_STATE, US_STATES, type USState } from "@/lib/usLocationData";
import type { Parish } from "@/lib/types";
import { PageContainer } from "@/components/ui/Surfaces";

type Step =
  | "choice"
  | "name"
  | "email"
  | "claim-search"
  | "claim-confirm"
  | "new-profile"
  | "new-state"
  | "new-city"
  | "new-address"
  | "new-confirm";

const STEP_TRANSITION = { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const };

function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${base || "parish"}-${Date.now().toString(36)}`;
}

/**
 * The distinct priest path: existing-parish claim vs new-parish profile
 * creation, ending with a real (prototype-local) parish record and a priest
 * account bound to it — one parish per priest account, for good, which is
 * what makes "a priest can only edit their own parish" true without needing
 * a real permissions check anywhere else in the app.
 */
export default function PriestLoginPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [, setAccount] = useAccount();

  const [step, setStep] = useState<Step>("choice");
  const [path, setPath] = useState<"existing" | "new">("existing");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const [parishes, setParishes] = useState<Parish[]>([]);
  const [query, setQuery] = useState("");
  const [claimed, setClaimed] = useState<Parish | null>(null);

  const [parishName, setParishName] = useState("");
  const [patronSaint, setPatronSaint] = useState("");
  const [state, setState] = useState<USState>(US_STATES[0]);
  const [city, setCity] = useState<string>(CITIES_BY_STATE[US_STATES[0]][0]);
  const [address, setAddress] = useState("");

  useEffect(() => {
    listParishes().then(setParishes);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return parishes;
    return parishes.filter((p) => p.name.toLowerCase().includes(q) || p.city.toLowerCase().includes(q));
  }, [parishes, query]);

  function goBack() {
    setError("");
    const back: Partial<Record<Step, Step>> = {
      name: "choice",
      email: "name",
      "claim-search": "email",
      "claim-confirm": "claim-search",
      "new-profile": "email",
      "new-state": "new-profile",
      "new-city": "new-state",
      "new-address": "new-city",
      "new-confirm": "new-address",
    };
    if (step === "choice") router.push("/login");
    else setStep(back[step] ?? "choice");
  }

  function chooseNameContinue() {
    setError("");
    setStep("email");
  }

  function chooseEmailContinue() {
    const value = email.trim();
    // Same rule as the parishioner flow: an empty answer is a choice, only a
    // malformed one is worth stopping for.
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError(t("priestLogin.errorEmail"));
      return;
    }
    setError("");
    setStep(path === "existing" ? "claim-search" : "new-profile");
  }

  function handleStateChange(next: USState) {
    setState(next);
    setCity(CITIES_BY_STATE[next][0]);
  }

  function finishClaim(parish: Parish) {
    setAccount({ role: "priest", name: name.trim(), email: email.trim(), parishId: parish.id });
    router.replace("/priest");
  }

  function finishNewParish() {
    const parish: Parish = {
      id: slugify(parishName),
      name: parishName.trim(),
      patronSaint: patronSaint.trim(),
      city,
      state,
      country: "SUA",
      jurisdiction: "ROEA",
      address: address.trim(),
      latitude: 0,
      longitude: 0,
      phone: "",
      email: email.trim(),
      website: "",
      clergy: [{ name: name.trim(), role: "Parish Priest", roleRo: "Preot paroh" }],
      schedule: [],
      verifiedAt: new Date().toISOString().slice(0, 10),
    };
    savePriestParish(parish);
    setAccount({ role: "priest", name: name.trim(), email: email.trim(), parishId: parish.id });
    router.replace("/priest");
  }

  return (
    <PageContainer wash="coral" className="px-outer pt-[max(env(safe-area-inset-top),24px)] pb-[32px]">
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
          {step === "choice" && (
            <motion.div key="choice" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={STEP_TRANSITION}>
              <h1 className="font-serif text-[26px] font-bold leading-[1.3] text-text">{t("priestLogin.title")}</h1>
              <button
                type="button"
                onClick={() => {
                  setPath("existing");
                  setStep("name");
                }}
                className="press mt-[28px] w-full rounded-pill bg-burgundy py-[16px] text-center font-sans text-[15px] font-semibold text-white"
              >
                {t("priestLogin.existingCta")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPath("new");
                  setStep("name");
                }}
                className="press mt-[18px] w-full text-center font-sans text-[15px] text-muted"
              >
                {t("priestLogin.newCta")}
              </button>
            </motion.div>
          )}

          {step === "name" && (
            <motion.div key="name" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={STEP_TRANSITION}>
              <h1 className="font-serif text-[28px] font-bold leading-[1.25] text-text">{t("priestLogin.nameTitle")}</h1>
              <input
                autoFocus
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && chooseNameContinue()}
                placeholder={t("priestLogin.namePlaceholder")}
                className="mt-[26px] w-full border-b border-divider bg-transparent pb-[10px] font-serif text-[20px] text-text outline-none focus:border-navy"
              />
              {error && <p className="mt-[8px] font-sans text-[13.5px] text-red-600">{error}</p>}
              <button
                type="button"
                onClick={chooseNameContinue}
                className="press mt-[32px] w-full rounded-pill bg-burgundy py-[15px] text-center font-sans text-[15px] font-semibold text-white"
              >
                {t("common.continue")}
              </button>
            </motion.div>
          )}

          {step === "email" && (
            <motion.div key="email" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={STEP_TRANSITION}>
              <h1 className="font-serif text-[28px] font-bold leading-[1.25] text-text">{t("priestLogin.emailTitle")}</h1>
              <input
                autoFocus
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && chooseEmailContinue()}
                placeholder={t("priestLogin.emailPlaceholder")}
                className="mt-[26px] w-full border-b border-divider bg-transparent pb-[10px] font-serif text-[20px] text-text outline-none focus:border-navy"
              />
              {error && <p className="mt-[8px] font-sans text-[13.5px] text-red-600">{error}</p>}
              <button
                type="button"
                onClick={chooseEmailContinue}
                className="press mt-[32px] w-full rounded-pill bg-burgundy py-[15px] text-center font-sans text-[15px] font-semibold text-white"
              >
                {t("common.continue")}
              </button>
            </motion.div>
          )}

          {step === "claim-search" && (
            <motion.div key="claim-search" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={STEP_TRANSITION} className="flex max-h-[62vh] flex-col">
              <h1 className="font-serif text-[24px] font-bold leading-[1.3] text-text">{t("priestLogin.claimSearchTitle")}</h1>
              <div className="mt-[18px] flex items-center gap-[10px] border-b border-divider pb-[12px]">
                <SearchIcon className="h-[16px] w-[16px] shrink-0 text-muted" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("priestLogin.claimSearchPlaceholder")}
                  className="w-full bg-transparent font-sans text-[15.5px] text-text outline-none placeholder:text-muted"
                />
              </div>
              <div className="mt-[6px] flex-1 overflow-y-auto">
                {filtered.length === 0 ? (
                  <p className="mt-[20px] font-sans text-[15px] leading-[1.6] text-muted">{t("priestLogin.claimNoResults")}</p>
                ) : (
                  filtered.slice(0, 30).map((p, i) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setClaimed(p);
                        setStep("claim-confirm");
                      }}
                      className={`press flex w-full flex-col items-start py-[13px] text-left ${i !== 0 ? "border-t border-divider" : ""}`}
                    >
                      <span className="font-serif text-[16px] text-text">{p.name}</span>
                      <span className="mt-[2px] font-sans text-[13.5px] text-muted">
                        {p.city}, {p.state}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {step === "claim-confirm" && claimed && (
            <motion.div key="claim-confirm" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="flex flex-col items-center text-center">
              <div className="h-[96px] w-[96px] overflow-hidden rounded-2xl bg-navy-texture" aria-hidden="true" />
              <p className="mt-[20px] font-serif text-[22px] font-bold leading-[1.2] text-text">{claimed.name}</p>
              <p className="mt-[4px] font-serif text-[15px] italic text-burgundy">{claimed.patronSaint}</p>
              <p className="mt-[6px] font-sans text-[13px] text-muted">
                {claimed.city}, {claimed.state}
              </p>
              <p className="mt-[18px] max-w-[280px] font-sans text-[15px] leading-[1.55] text-muted">{t("priestLogin.claimConfirmTitle")}</p>
              <button
                type="button"
                onClick={() => finishClaim(claimed)}
                className="press mt-[24px] w-full rounded-pill bg-burgundy py-[16px] text-center font-sans text-[15px] font-semibold text-white"
              >
                {t("priestLogin.claimConfirmCta")}
              </button>
            </motion.div>
          )}

          {step === "new-profile" && (
            <motion.div key="new-profile" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={STEP_TRANSITION}>
              <h1 className="font-serif text-[26px] font-bold leading-[1.25] text-text">{t("priestLogin.newNameTitle")}</h1>
              <input
                autoFocus
                value={parishName}
                onChange={(e) => setParishName(e.target.value)}
                placeholder={t("priestLogin.newNamePlaceholder")}
                className="mt-[24px] w-full border-b border-divider bg-transparent pb-[10px] font-serif text-[19px] text-text outline-none focus:border-navy"
              />
              <p className="mt-[24px] font-sans text-[13px] font-semibold uppercase tracking-[0.06em] text-muted">{t("priestLogin.newPatronTitle")}</p>
              <input
                value={patronSaint}
                onChange={(e) => setPatronSaint(e.target.value)}
                placeholder={t("priestLogin.newPatronPlaceholder")}
                className="mt-[10px] w-full border-b border-divider bg-transparent pb-[10px] font-serif text-[19px] text-text outline-none focus:border-navy"
              />
              <button
                type="button"
                disabled={!parishName.trim()}
                onClick={() => setStep("new-state")}
                className="press mt-[32px] w-full rounded-pill bg-burgundy py-[15px] text-center font-sans text-[15px] font-semibold text-white disabled:opacity-40"
              >
                {t("common.continue")}
              </button>
            </motion.div>
          )}

          {step === "new-state" && (
            <motion.div key="new-state" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={STEP_TRANSITION}>
              <h1 className="text-center font-serif text-[24px] font-bold leading-[1.25] text-text">{t("priestLogin.newStateTitle")}</h1>
              <div className="mt-[8px]">
                <WheelPicker options={[...US_STATES]} value={state} onChange={handleStateChange} aria-label={t("priestLogin.newStateTitle")} />
              </div>
              <button
                type="button"
                onClick={() => setStep("new-city")}
                className="press mt-[8px] w-full rounded-pill bg-burgundy py-[15px] text-center font-sans text-[15px] font-semibold text-white"
              >
                {t("common.continue")}
              </button>
            </motion.div>
          )}

          {step === "new-city" && (
            <motion.div key="new-city" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={STEP_TRANSITION}>
              <h1 className="text-center font-serif text-[24px] font-bold leading-[1.25] text-text">{t("priestLogin.newCityTitle")}</h1>
              <div className="mt-[8px]">
                <WheelPicker options={CITIES_BY_STATE[state]} value={city} onChange={setCity} aria-label={t("priestLogin.newCityTitle")} />
              </div>
              <button
                type="button"
                onClick={() => setStep("new-address")}
                className="press mt-[8px] w-full rounded-pill bg-burgundy py-[15px] text-center font-sans text-[15px] font-semibold text-white"
              >
                {t("common.continue")}
              </button>
            </motion.div>
          )}

          {step === "new-address" && (
            <motion.div key="new-address" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={STEP_TRANSITION}>
              <h1 className="font-serif text-[28px] font-bold leading-[1.25] text-text">{t("priestLogin.newAddressTitle")}</h1>
              <input
                autoFocus
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && setStep("new-confirm")}
                placeholder={t("priestLogin.newAddressPlaceholder")}
                className="mt-[26px] w-full border-b border-divider bg-transparent pb-[10px] font-serif text-[20px] text-text outline-none focus:border-navy"
              />
              <button
                type="button"
                onClick={() => setStep("new-confirm")}
                className="press mt-[32px] w-full rounded-pill bg-burgundy py-[15px] text-center font-sans text-[15px] font-semibold text-white"
              >
                {t("common.continue")}
              </button>
              <button type="button" onClick={() => setStep("new-confirm")} className="press mt-[16px] w-full text-center font-sans text-[13px] text-muted">
                {t("account.skip")}
              </button>
            </motion.div>
          )}

          {step === "new-confirm" && (
            <motion.div key="new-confirm" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="flex flex-col items-center text-center">
              <div className="h-[96px] w-[96px] overflow-hidden rounded-2xl bg-navy-texture" aria-hidden="true" />
              <p className="mt-[20px] font-serif text-[22px] font-bold text-text">{t("priestLogin.newConfirmTitle")}</p>
              <p className="mt-[8px] font-serif text-[22px] font-bold leading-[1.2] text-text">{parishName}</p>
              <p className="mt-[4px] font-serif text-[15px] italic text-burgundy">{patronSaint}</p>
              <p className="mt-[6px] font-sans text-[13px] text-muted">
                {city}, {state}
              </p>
              {address && <p className="mt-[2px] font-sans text-[13px] text-muted">{address}</p>}
              <button
                type="button"
                onClick={finishNewParish}
                className="press mt-[24px] w-full rounded-pill bg-burgundy py-[16px] text-center font-sans text-[15px] font-semibold text-white"
              >
                {t("priestLogin.newConfirmCta")}
              </button>
              <p className="mt-[14px] font-sans text-[11.5px] italic text-muted">{t("priestLogin.newConfirmDisclaimer")}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageContainer>
  );
}
