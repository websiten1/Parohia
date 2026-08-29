"use client";

import { useEffect, useMemo, useState } from "react";
import { EmptyState } from "@/components/Feedback";
import { BackIcon, MapPinIcon, SearchIcon } from "@/components/icons";
import { listParishes } from "@/lib/data/parishes";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import type { Parish } from "@/lib/types";

interface ParishSelectorProps {
  onChoose: (parishId: string) => void;
}

function ParishThumb({ parish }: { parish: Parish }) {
  return (
    <div
      className="h-[56px] w-[56px] shrink-0 overflow-hidden rounded-xs border border-amber/40 bg-navy-texture"
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
        <button
          type="button"
          onClick={() => setPending(null)}
          aria-label={t("common.back")}
          className="press flex h-[36px] w-[36px] items-center justify-center rounded-full text-navy"
        >
          <BackIcon className="h-[20px] w-[20px]" />
        </button>

        <div className="mt-[36px] flex flex-1 flex-col items-center text-center">
          <div className="h-[120px] w-[120px] overflow-hidden rounded-xs border border-amber/50 bg-navy-texture">
            {pending.photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={pending.photo} alt={pending.name} className="h-full w-full object-cover" />
            )}
          </div>
          <p className="mt-[22px] font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-amber">
            {t("parishSelector.confirmHeading")}
          </p>
          <p className="mt-[8px] font-serif text-[24px] font-bold leading-[1.15] text-text">{pending.name}</p>
          <p className="mt-[4px] font-serif text-[16px] italic text-burgundy">{pending.patronSaint}</p>
          <p className="mt-[6px] font-sans text-[13.5px] text-muted">
            {pending.city}, {pending.country}
          </p>
          {pending.clergy[0] && (
            <p className="mt-[2px] font-sans text-[13px] text-muted">
              {t("parishSelector.priestLabel")}: {pending.clergy[0].name}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => onChoose(pending.id)}
          className="press mt-[20px] w-full rounded-pill bg-burgundy py-[15px] text-center font-sans text-[15px] font-semibold text-white"
        >
          {t("parishSelector.confirmCta")}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="px-outer pt-[max(env(safe-area-inset-top),24px)]">
        <h1 className="font-serif text-[30px] font-bold leading-[1.1] text-text">{t("parishSelector.title")}</h1>
        <p className="mt-[6px] font-serif text-[15px] italic text-muted">{t("parishSelector.subtitle")}</p>

        <div className="mt-[20px] flex items-center gap-[10px] border-b-2 border-amber py-[10px]">
          <SearchIcon className="h-[16px] w-[16px] shrink-0 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("parishSelector.searchPlaceholder")}
            className="w-full bg-transparent font-sans text-[14px] text-text outline-none placeholder:text-muted"
          />
        </div>

        <div className="no-scrollbar -mx-outer mt-[14px] flex gap-[8px] overflow-x-auto px-outer pb-[4px]">
          <button
            type="button"
            onClick={() => setCountry("all")}
            className={`press shrink-0 rounded-pill px-[14px] py-[7px] font-sans text-[12.5px] font-medium ${
              country === "all" ? "bg-navy text-white" : "bg-soft-surface text-muted"
            }`}
          >
            {t("parishSelector.allCountries")}
          </button>
          {countries.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCountry(c)}
              className={`press shrink-0 rounded-pill px-[14px] py-[7px] font-sans text-[12.5px] font-medium ${
                country === c ? "bg-navy text-white" : "bg-soft-surface text-muted"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 px-outer pt-[20px] pb-tabbar">
        {grouped.length === 0 ? (
          <EmptyState icon={<MapPinIcon className="h-[20px] w-[20px]" />} message={t("parishSelector.noResultsMessage")} />
        ) : (
          grouped.map(([countryName, group]) => (
            <div key={countryName} className="mb-[26px] last:mb-0">
              <p className="mb-[4px] font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                {countryName} · {t(group.length === 1 ? "parishSelector.countSingular" : "parishSelector.countPlural", { count: group.length })}
              </p>
              {group.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPending(p)}
                  className={`anim-rise-fade-in press flex w-full items-center gap-[14px] py-[14px] text-left ${
                    i !== group.length - 1 ? "border-b border-divider" : ""
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
                </button>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
