"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/Feedback";
import { LocationCrosshairIcon, MapPinIcon, SearchIcon } from "@/components/icons";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { PARISHES } from "@/lib/seedData";

const MARKERS = [
  { top: "30%", left: "38%" },
  { top: "48%", left: "62%" },
  { top: "68%", left: "28%" },
];

export function ParishFinderClient() {
  const [query, setQuery] = useState("");
  const [locating, setLocating] = useState(false);
  const { t } = useTranslation();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? PARISHES.filter((p) => p.name.toLowerCase().includes(q) || p.city.toLowerCase().includes(q))
      : PARISHES;
    return [...filtered].sort((a, b) => (a.distanceMi ?? 0) - (b.distanceMi ?? 0));
  }, [query]);

  return (
    <>
      <div className="bg-navy-texture px-outer pb-[36px] pt-[max(env(safe-area-inset-top),24px)]">
        <p className="font-serif text-[15px] text-white/70">{t("parishFinder.findYour")}</p>
        <h1 className="mt-[2px] font-serif text-[32px] font-bold leading-[1.05] text-white">{t("parishFinder.parish")}</h1>
      </div>

      <div className="-mt-[24px] px-outer pb-[16px]">
        <div
          className="flex items-center gap-[10px] rounded-sm bg-surface px-[14px] py-[12px]"
          style={{ boxShadow: "0 4px 14px rgba(7,26,51,0.16)" }}
        >
          <SearchIcon className="h-[16px] w-[16px] shrink-0 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("parishFinder.searchPlaceholder")}
            className="w-full bg-transparent font-sans text-[14px] text-text outline-none placeholder:text-muted"
          />
        </div>
      </div>

      <div className="relative h-[248px] w-full shrink-0 overflow-hidden bg-[#EFE8D8]">
        <svg className="absolute inset-0 h-full w-full opacity-70" aria-hidden="true">
          <defs>
            <pattern id="roads" width="46" height="46" patternUnits="userSpaceOnUse">
              <path d="M 46 0 L 0 0 0 46" fill="none" stroke="#D8CBA8" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#roads)" />
          <path d="M -10 30 Q 60 10 120 60 T 260 40" stroke="#BFE0EE" strokeWidth="22" fill="none" opacity="0.7" />
        </svg>
        {MARKERS.map((m, i) => (
          <span
            key={i}
            className="anim-scale-fade-in absolute -translate-x-1/2 -translate-y-full text-navy"
            style={{ top: m.top, left: m.left, animationDelay: `${i * 60}ms` }}
          >
            <MapPinIcon className="h-[30px] w-[30px] fill-navy" />
          </span>
        ))}
        <button
          type="button"
          onClick={() => setLocating(true)}
          aria-label={t("parishFinder.useMyLocation")}
          className="press absolute bottom-[10px] right-[10px] flex h-[38px] w-[38px] items-center justify-center rounded-full bg-surface text-navy"
          style={{ boxShadow: "0 4px 10px rgba(7,26,51,0.18)" }}
        >
          <LocationCrosshairIcon className="h-[19px] w-[19px]" />
        </button>
        {locating && (
          <div className="absolute inset-x-0 bottom-0 bg-navy/90 px-outer py-[8px] text-center font-sans text-[11.5px] text-white">
            {t("parishFinder.locationNote")}
          </div>
        )}
      </div>

      <div className="px-outer pt-[20px] pb-tabbar">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">{t("parishFinder.nearby")}</p>

        {results.length === 0 ? (
          <EmptyState icon={<MapPinIcon className="h-[20px] w-[20px]" />} message={t("parishFinder.noResults")} />
        ) : (
          results.map((p, i) => (
            <Link
              key={p.id}
              href={`/parish/${p.id}`}
              className={`press flex items-center justify-between gap-[10px] py-[15px] ${i !== results.length - 1 ? "border-b border-divider" : ""}`}
            >
              <span className="min-w-0">
                <span className="block font-serif text-[16px] text-text">{p.name}</span>
                <span className="mt-[2px] block font-sans text-[13px] text-muted">
                  {p.city}, {p.state}
                </span>
              </span>
              {p.distanceMi != null && (
                <span className="shrink-0 font-sans text-[13px] text-muted">
                  {p.distanceMi} {t("parishFinder.miles")}
                </span>
              )}
            </Link>
          ))
        )}
      </div>
    </>
  );
}
