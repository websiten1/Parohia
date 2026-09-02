"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { SealMark } from "@/components/SealMark";
import { WAITLIST_COPY, type WaitlistLang } from "./strings";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormValues {
  name: string;
  parish: string;
  location: string;
  email: string;
  phone: string;
  parishioners: string;
}

const EMPTY_VALUES: FormValues = { name: "", parish: "", location: "", email: "", phone: "", parishioners: "" };

type FormErrors = Partial<Record<keyof FormValues, string>>;

/**
 * Standalone waitlist landing page for the QR code on the printed magazine —
 * deliberately flat (no glass, no boxed cards) to match the app's older,
 * still-unmigrated editorial screens (e.g. /anunturi) rather than the
 * in-progress Liquid Glass system, since a priest arriving fresh from a
 * magazine scan has no prior screen to compare it against either way.
 */
export default function WaitlistPage() {
  const [lang, setLang] = useState<WaitlistLang>("ro");
  const copy = WAITLIST_COPY[lang];

  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [success, setSuccess] = useState(false);

  function updateField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  }

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!values.name.trim()) next.name = copy.form.name.error;
    if (!values.parish.trim()) next.parish = copy.form.parish.error;
    if (!values.location.trim()) next.location = copy.form.location.error;
    if (!values.email.trim()) next.email = copy.form.email.errorRequired;
    else if (!EMAIL_PATTERN.test(values.email.trim())) next.email = copy.form.email.errorInvalid;
    return next;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const foundErrors = validate();
    setErrors(foundErrors);
    if (Object.keys(foundErrors).length > 0) return;

    setSubmitting(true);
    setSubmitError(false);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, language: lang }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean } | null;
      if (!res.ok || !data?.ok) throw new Error("submit_failed");
      setSuccess(true);
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="flex items-center justify-between border-b border-divider px-outer py-[16px]">
        <div className="flex items-center gap-[8px]">
          <SealMark size={26} />
          <p className="font-serif text-[15px] font-bold text-text">{copy.header.wordmark}</p>
        </div>
        <div className="flex items-center gap-[6px]" role="group" aria-label={copy.header.langToggleLabel}>
          <button
            type="button"
            onClick={() => setLang("ro")}
            aria-pressed={lang === "ro"}
            className={`press font-sans text-[13px] font-semibold ${lang === "ro" ? "text-burgundy" : "text-muted"}`}
          >
            RO
          </button>
          <span className="text-muted">·</span>
          <button
            type="button"
            onClick={() => setLang("en")}
            aria-pressed={lang === "en"}
            className={`press font-sans text-[13px] font-semibold ${lang === "en" ? "text-burgundy" : "text-muted"}`}
          >
            EN
          </button>
        </div>
      </header>

      <main className="flex-1 px-outer pb-[56px]">
        {/* Hero */}
        <div className="mt-[28px]">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-burgundy">{copy.hero.eyebrow}</p>
          <p className="mt-[3px] font-sans text-[11.5px] text-muted">{copy.hero.hierarchPlaceholder}</p>
          <h1 className="mt-[16px] font-serif text-[34px] font-bold leading-[1.15] text-text">{copy.hero.tagline}</h1>
          <p className="mt-[12px] max-w-[360px] font-sans text-[15px] leading-[1.6] text-muted">{copy.hero.description}</p>
        </div>

        {/* Screenshot placeholder */}
        <div className="mt-[28px]">
          <Image
            src="/waitlist/screenshot-placeholder.svg"
            alt={copy.screenshot.alt}
            width={320}
            height={640}
            unoptimized
            className="mx-auto h-auto w-full max-w-[240px] rounded-lg"
          />
          <p className="mt-[8px] text-center font-sans text-[11px] italic text-muted">{copy.screenshot.placeholderNote}</p>
        </div>

        {/* Features */}
        <div className="mt-[44px]">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">{copy.featuresHeading}</p>
          <div className="mt-[16px] flex flex-col gap-[22px]">
            {copy.features.map((f) => (
              <div key={f.title} className="border-l-2 border-teal pl-[14px]">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.08em] text-teal">{f.eyebrow}</p>
                <p className="mt-[5px] font-serif text-[18px] font-bold leading-[1.25] text-text">{f.title}</p>
                <p className="mt-[4px] font-sans text-[13.5px] leading-[1.5] text-muted">{f.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Waitlist form */}
        <div className="mt-[48px]">
          <h2 className="font-serif text-[22px] font-bold leading-[1.25] text-text">{copy.form.heading}</h2>

          {success ? (
            <div className="mt-[24px]">
              <p className="font-serif text-[19px] font-bold text-text">{copy.form.successTitle}</p>
              <p className="mt-[6px] font-sans text-[14px] text-muted">{copy.form.successBody}</p>
            </div>
          ) : (
            <form className="mt-[24px] flex flex-col gap-[18px]" onSubmit={handleSubmit} noValidate>
              <Field
                id="wl-name"
                label={copy.form.name.label}
                placeholder={copy.form.name.placeholder}
                value={values.name}
                onChange={(v) => updateField("name", v)}
                error={errors.name}
                autoComplete="name"
              />
              <Field
                id="wl-parish"
                label={copy.form.parish.label}
                placeholder={copy.form.parish.placeholder}
                value={values.parish}
                onChange={(v) => updateField("parish", v)}
                error={errors.parish}
              />
              <Field
                id="wl-location"
                label={copy.form.location.label}
                placeholder={copy.form.location.placeholder}
                value={values.location}
                onChange={(v) => updateField("location", v)}
                error={errors.location}
                autoComplete="address-level2"
              />
              <Field
                id="wl-email"
                type="email"
                label={copy.form.email.label}
                placeholder={copy.form.email.placeholder}
                value={values.email}
                onChange={(v) => updateField("email", v)}
                error={errors.email}
                autoComplete="email"
              />
              <Field
                id="wl-phone"
                type="tel"
                label={copy.form.phone.label}
                placeholder={copy.form.phone.placeholder}
                value={values.phone}
                onChange={(v) => updateField("phone", v)}
                autoComplete="tel"
              />

              <div>
                <label htmlFor="wl-parishioners" className="block font-sans text-[12px] font-medium text-muted">
                  {copy.form.parishioners.label}
                </label>
                <select
                  id="wl-parishioners"
                  value={values.parishioners}
                  onChange={(e) => updateField("parishioners", e.target.value)}
                  className="mt-[6px] w-full rounded-sm border border-divider bg-surface px-[14px] py-[12px] font-sans text-[14px] text-text outline-none focus:border-burgundy"
                >
                  <option value="">{copy.form.parishioners.placeholder}</option>
                  {copy.form.parishioners.options.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-[6px]">
                <button
                  type="submit"
                  disabled={submitting}
                  className="press w-full rounded-pill bg-burgundy py-[14px] font-sans text-[14.5px] font-semibold text-white disabled:opacity-60"
                >
                  {submitting ? copy.form.submitting : submitError ? copy.form.retry : copy.form.submit}
                </button>

                {submitError && (
                  <p className="mt-[10px] font-sans text-[12.5px] text-red-600" role="alert">
                    {copy.form.errorTitle} {copy.form.errorBody}
                  </p>
                )}

                <p className="mt-[14px] font-sans text-[11.5px] italic leading-[1.5] text-muted">{copy.form.gdpr}</p>
              </div>
            </form>
          )}
        </div>
      </main>

      <footer className="border-t border-divider px-outer py-[20px]">
        <p className="font-serif text-[13px] font-bold text-text">{copy.header.wordmark}</p>
        <p className="mt-[2px] font-sans text-[12px] text-muted">
          {copy.footer.contactLabel}: {copy.footer.contactEmail}
        </p>
      </footer>
    </div>
  );
}

function Field({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
}: {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block font-sans text-[12px] font-medium text-muted">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`mt-[6px] w-full rounded-sm border bg-surface px-[14px] py-[12px] font-sans text-[14px] text-text outline-none focus:border-burgundy ${
          error ? "border-red-400" : "border-divider"
        }`}
      />
      {error && (
        <p id={`${id}-error`} className="mt-[5px] font-sans text-[12px] text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
