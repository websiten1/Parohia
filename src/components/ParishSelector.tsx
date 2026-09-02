"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { EmptyState } from "@/components/Feedback";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassSurface } from "@/components/glass/GlassSurface";
import { BackIcon, MapPinIcon, SearchIcon } from "@/components/icons";
import { listParishes } from "@/lib/data/parishes";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import type { Parish } from "@/lib/types";

interface ParishSelectorProps {
  onChoose: (parishId: string) => void;
}

const SPRING = { type: "spring" as const, stiffness: 420, damping: 34 };

function ParishThumb({ parish }: { parish: Parish }) {
  return (
    <div
      className="h-[56px] w-[56px] shrink-0 overflow-hidden rounded-lg border border-amber/40 bg-navy-texture"
      role="img"
      aria-label={parish.name}
    >
      {parish.photo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={parish.photo} alt={parish.name} className="h-full w-full object-cover" />
      )}
    </div>
  );
}

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`press relative shrink-0 rounded-pill px-[14px] py-[7px] font-sans text-[12.5px] font-medium ${
        active ? "text-white" : "text-muted"
      }`}
    >
      {active && (
        <motion.span layoutId="country-filter-pill" transition={SPRING} className="absolute inset-0 rounded-pill bg-burgundy" />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

/**
 * Search + country-filtered parish list, with an inline confirmation step —
 * shared by first-run onboarding ("/onboarding/parish") and the "Change
 * parish" flow reachable from Menu ("/menu/parish"). The two callers differ
 * only in what onChoose does afterward (go to Today vs. go back to Menu).
 */
export function ParishSelector({ onChoose }: ParishSelectorProps) {
  const { t } = useTranslation();
  const [parishes, setParishes] = useState<Parish[]>([]);
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState<string>("all");
  const [pending, setPending] = useState<Parish | null>(null);

  useEffect(() => {
    listParishes().then(setParishes);
  }, []);

  const countries = useMemo(() => Array.from(new Set(parishes.map((p) => p.country))), [parishes]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return parishes.filter((p) => {
      const matchesQuery = !q || p.name.toLowerCase().includes(q) || p.city.toLowerCase().includes(q);
      const matchesCountry = country === "all" || p.country === country;
      return matchesQuery && matchesCountry;
    });
  }, [parishes, query, country]);

  const grouped = useMemo(() => {
    const map = new Map<string, Parish[]>();
    for (const p of filtered) {
      if (!map.has(p.country)) map.set(p.country, []);
      map.get(p.country)!.push(p);
    }
    return [...map.entries()];
  }, [filtered]);

  if (pending) {
    return (
      <div className="anim-rise-fade-in flex flex-1 flex-col px-outer pt-[max(env(safe-area-inset-top),24px)] pb-[36px]">
        <motion.button
          type="button"
          onClick={() => setPending(null)}
          aria-label={t("common.back")}
          whileTap={{ scale: 0.88 }}
          transition={{ type: "spring", stiffness: 500, damping: 28 }}
          className="glass-thin flex h-[36px] w-[36px] items-center justify-center rounded-pill text-navy"
        >
          <BackIcon className="h-[18px] w-[18px]" />
        </motion.button>

        <div className="mt-[40px] flex flex-1 flex-col items-center text-center">
          <div className="h-[120px] w-[120px] overflow-hidden rounded-2xl border border-amber/50 bg-navy-texture">
            {pending.photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={pending.photo} alt={pending.name} className="h-full w-full object-cover" />
            )}
          </div>
          <p className="mt-[24px] font-serif text-[24px] font-bold leading-[1.15] text-text">{pending.name}</p>
          <p className="mt-[4px] font-serif text-[16px] italic text-burgundy">{pending.patronSaint}</p>
          <p className="mt-[7px] font-sans text-[13.5px] text-muted">
            {pending.city}, {pending.country}
          </p>
          {pending.clergy[0] && (
            <p className="mt-[2px] font-sans text-[13px] text-muted">
              {t("parishSelector.priestLabel")}: {pending.clergy[0].name}
            </p>
          )}
        </div>

        <GlassButton onClick={() => onChoose(pending.id)} className="w-full">
          {t("parishSelector.confirmCta")}
        </GlassButton>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="px-outer pt-[max(env(safe-area-inset-top),24px)]">
        <h1 className="font-serif text-[30px] font-bold leading-[1.1] text-text">{t("parishSelector.title")}</h1>
        <p className="mt-[7px] font-serif text-[15px] italic text-muted">{t("parishSelector.subtitle")}</p>

        <GlassSurface tier="thin" radius="pill" className="mt-[22px] flex items-center gap-[10px] px-[16px] py-[12px]">
          <SearchIcon className="h-[16px] w-[16px] shrink-0 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("parishSelector.searchPlaceholder")}
            className="w-full bg-transparent font-sans text-[14px] text-text outline-none placeholder:text-muted"
          />
        </GlassSurface>

        <div className="no-scrollbar -mx-outer mt-[16px] flex gap-[6px] overflow-x-auto px-outer pb-[4px]">
          <FilterPill active={country === "all"} onClick={() => setCountry("all")}>
            {t("parishSelector.allCountries")}
          </FilterPill>
          {countries.map((c) => (
            <FilterPill key={c} active={country === c} onClick={() => setCountry(c)}>
              {c}
            </FilterPill>
          ))}
        </div>
      </div>

      <div className="flex-1 px-outer pt-[24px] pb-tabbar">
        {grouped.length === 0 ? (
          <EmptyState icon={<MapPinIcon className="h-[20px] w-[20px]" />} message={t("parishSelector.noResultsMessage")} />
        ) : (
          grouped.map(([countryName, group]) => (
            <div key={countryName} className="mb-[24px] last:mb-0">
              <p className="mb-[8px] font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                {countryName} · {t(group.length === 1 ? "parishSelector.countSingular" : "parishSelector.countPlural", { count: group.length })}
              </p>
              <GlassSurface tier="thin" radius="xl" className="px-[14px]">
                {group.map((p, i) => (
                  <motion.button
                    key={p.id}
                    type="button"
                    onClick={() => setPending(p)}
                    whileTap={{ scale: 0.985 }}
                    transition={{ type: "spring", stiffness: 500, damping: 32 }}
                    className={`anim-rise-fade-in flex w-full items-center gap-[14px] py-[14px] text-left ${
                      i !== group.length - 1 ? "border-b border-divider/70" : ""
                    }`}
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <ParishThumb parish={p} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-serif text-[16px] text-text">{p.name}</span>
                      <span className="mt-[2px] block truncate font-serif text-[13.5px] italic text-burgundy">{p.patronSaint}</span>
                      <span className="mt-[2px] block truncate font-sans text-[12.5px] text-muted">
                        {p.city}, {p.country}
                      </span>
                    </span>
                  </motion.button>
                ))}
              </GlassSurface>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
