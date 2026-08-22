export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`press relative h-[26px] w-[46px] shrink-0 rounded-pill transition-colors duration-150 ${
        checked ? "bg-burgundy" : "bg-navy-14"
      }`}
    >
      <span
        className={`absolute top-[3px] h-[20px] w-[20px] rounded-full bg-white transition-transform duration-150 ${
          checked ? "translate-x-[23px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}

export function SettingsRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-divider py-[14px] last:border-b-0">
      <span className="font-sans text-[14.5px] text-text">{label}</span>
      {children}
    </div>
  );
}

export function SegmentedChoice<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex rounded-pill bg-soft-surface p-[3px]">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`press rounded-pill px-[10px] py-[5px] font-sans text-[12px] font-semibold transition-colors duration-150 ${
            value === o.id ? "bg-navy text-white" : "text-muted"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function SettingsSectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-[28px] pb-[6px] font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted first:mt-0">
      {children}
    </p>
  );
}
