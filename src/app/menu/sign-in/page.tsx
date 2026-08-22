"use client";

import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { NavPersonIcon } from "@/components/icons";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <AppHeader title={t("signIn.title")} />
      <main className="flex-1 px-outer py-[28px]">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-soft-surface text-navy">
            <NavPersonIcon className="h-[28px] w-[28px]" />
          </span>
          <p className="mt-[16px] font-serif text-[20px] font-bold text-text">{t("signIn.heading")}</p>
          <p className="mt-[6px] max-w-[260px] font-sans text-[13.5px] text-muted">{t("signIn.explanation")}</p>
        </div>

        {submitted ? (
          <div className="mt-[28px] rounded-lg border border-navy-08 bg-soft-surface px-[16px] py-[14px] text-center">
            <p className="font-sans text-[13.5px] text-navy">{t("signIn.submittedNote")}</p>
          </div>
        ) : (
          <form
            className="mt-[28px]"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <label className="block font-sans text-[12px] font-medium text-muted" htmlFor="email">
              {t("signIn.emailLabel")}
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-[6px] w-full rounded-sm border border-divider bg-surface px-[14px] py-[12px] font-sans text-[14px] text-text outline-none focus:border-navy"
            />
            <button
              type="submit"
              className="press mt-[16px] w-full rounded-pill bg-navy py-[13px] font-sans text-[14px] font-semibold text-white"
            >
              {t("common.continue")}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
