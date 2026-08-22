"use client";

interface Tab {
  id: string;
  label: string;
}

interface SegmentedTabsProps {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
}

/** Underline slides between labels (180ms); pair with a keyed .anim-fade-through content wrapper. */
export function SegmentedTabs({ tabs, active, onChange }: SegmentedTabsProps) {
  const idx = Math.max(0, tabs.findIndex((t) => t.id === active));
  return (
    <div>
      <div className="flex">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            aria-current={t.id === active ? "true" : undefined}
            className={`press flex-1 py-[10px] text-center font-sans text-[13px] font-semibold uppercase tracking-[0.04em] ${
              t.id === active ? "text-burgundy" : "text-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="relative h-[2px] bg-divider">
        <div
          className="absolute top-0 h-[2px] bg-burgundy transition-[left] duration-[180ms] ease-out"
          style={{ width: `${100 / tabs.length}%`, left: `${(100 / tabs.length) * idx}%` }}
        />
      </div>
    </div>
  );
}
