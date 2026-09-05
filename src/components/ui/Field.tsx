"use client";

/**
 * A soft rounded input surface, not a bordered box — the field separates from
 * the page by tone, and lifts its contrast on focus rather than snapping a
 * ring on. Errors sit directly beneath the field so nothing else on the page
 * shifts when one appears. (§20, §32, §37)
 */
export function Field({
  value,
  onChange,
  placeholder,
  error,
  type = "text",
  inputMode,
  autoComplete,
  autoFocus,
  onEnter,
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  error?: string;
  type?: "text" | "email" | "number";
  inputMode?: "text" | "email" | "numeric";
  autoComplete?: string;
  autoFocus?: boolean;
  onEnter?: () => void;
  ariaLabel?: string;
}) {
  return (
    <div>
      <input
        autoFocus={autoFocus}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        value={value}
        aria-label={ariaLabel ?? placeholder}
        aria-invalid={error ? true : undefined}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
        placeholder={placeholder}
        className={`h-[54px] w-full rounded-search px-[20px] font-sans text-[17px] text-text outline-none transition-colors duration-200 placeholder:text-muted ${
          error ? "bg-tint-rose/60" : "bg-surface-soft focus:bg-surface-active"
        }`}
      />
      {error && (
        <p role="alert" className="mt-[10px] px-[6px] font-sans text-[14px] text-burgundy">
          {error}
        </p>
      )}
    </div>
  );
}
