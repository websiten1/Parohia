"use client";

import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { ChevronDownIcon, MailIcon, PhoneIcon } from "@/components/icons";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import type { TranslationKey } from "@/lib/i18n/translations";

const FAQS: { qKey: TranslationKey; aKey: TranslationKey }[] = [
  { qKey: "support.faq1Q", aKey: "support.faq1A" },
  { qKey: "support.faq2Q", aKey: "support.faq2A" },
  { qKey: "support.faq3Q", aKey: "support.faq3A" },
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");
  const { t } = useTranslation();

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <AppHeader title={t("support.title")} />
      <main className="flex-1 px-outer py-[22px]">
        <div className="flex gap-[10px]">
          <a
            href="tel:+13125550100"
            className="press flex flex-1 flex-col items-center gap-[6px] rounded-sm bg-soft-surface py-[14px] text-navy"
          >
            <PhoneIcon className="h-[19px] w-[19px]" />
            <span className="font-sans text-[12px] font-medium">{t("support.call")}</span>
          </a>
          <a
            href="mailto:support@romanianorthodoxepiscopate.org"
            className="press flex flex-1 flex-col items-center gap-[6px] rounded-sm bg-soft-surface py-[14px] text-navy"
          >
            <MailIcon className="h-[19px] w-[19px]" />
            <span className="font-sans text-[12px] font-medium">{t("support.email")}</span>
          </a>
        </div>

        <p className="mt-[28px] pb-[6px] font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
          {t("support.faq")}
        </p>
        {FAQS.map((f, i) => {
          const open = openFaq === i;
          return (
            <div key={f.qKey} className={i !== FAQS.length - 1 ? "border-b border-divider" : ""}>
              <button
                type="button"
                onClick={() => setOpenFaq(open ? null : i)}
                className="press flex w-full items-center justify-between gap-[10px] py-[13px] text-left"
              >
                <span className="font-sans text-[14px] font-medium text-text">{t(f.qKey)}</span>
                <ChevronDownIcon className={`h-[15px] w-[15px] shrink-0 text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
              </button>
              {open && <p className="anim-fade-through pb-[13px] font-sans text-[13.5px] leading-[1.5] text-muted">{t(f.aKey)}</p>}
            </div>
          );
        })}

        <p className="mt-[28px] pb-[8px] font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
          {t("support.contactForm")}
        </p>
        {sent ? (
          <p className="rounded-lg bg-soft-surface px-[16px] py-[14px] font-sans text-[13.5px] text-navy">
            {t("support.thankYou")}
          </p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder={t("support.messagePlaceholder")}
              className="w-full rounded-sm border border-divider bg-surface px-[14px] py-[12px] font-sans text-[14px] text-text outline-none focus:border-navy"
            />
            <button
              type="submit"
              className="press mt-[10px] w-full rounded-pill bg-navy py-[13px] font-sans text-[14px] font-semibold text-white"
            >
              {t("common.sendMessage")}
            </button>
          </form>
        )}

        <a
          href="mailto:calendar@romanianorthodoxepiscopate.org?subject=Calendar%20Issue%20Report"
          className="press mt-[28px] block text-center font-sans text-[13px] font-semibold text-burgundy"
        >
          {t("support.reportIssue")}
        </a>
      </main>
    </div>
  );
}
