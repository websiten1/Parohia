"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { PhotoHero } from "@/components/PhotoHero";
import { ShareButton } from "@/components/ShareButton";
import { BackIcon, ChevronRightIcon, ClockIcon, DirectionsIcon, GlobeIcon, MailIcon } from "@/components/icons";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { PARISHES } from "@/lib/seedData";

export default function ParishProfilePage() {
  const { id } = useParams<{ id: string }>();
  const parish = PARISHES.find((p) => p.id === id);
  const { t } = useTranslation();
  if (!parish) return notFound();

  const directionsUrl = `https://maps.google.com/?q=${encodeURIComponent(`${parish.address}, ${parish.city}, ${parish.state}`)}`;

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="relative">
        <PhotoHero alt={parish.name} scrim="bottom" className="h-[322px] w-full" />
        <div className="absolute inset-x-0 top-[max(env(safe-area-inset-top),14px)] flex items-center justify-between px-outer">
          <Link
            href="/parish-finder"
            aria-label={t("common.back")}
            className="press flex h-[36px] w-[36px] items-center justify-center rounded-full bg-navy/45 text-white"
          >
            <BackIcon className="h-[20px] w-[20px]" />
          </Link>
          <ShareButton
            title={parish.name}
            text={`${parish.name} — ${parish.city}, ${parish.state}`}
            className="press flex h-[36px] w-[36px] items-center justify-center rounded-full bg-navy/45 text-white"
          />
        </div>
      </div>

      <main className="-mt-[24px] flex-1 rounded-t-sheet bg-surface px-outer pt-[28px] pb-[36px]">
        <p className="font-serif text-[24px] font-bold uppercase leading-[1.2] text-text">{parish.name.split(" ").slice(0, 2).join(" ")}</p>
        <p className="mt-[2px] font-sans text-[12px] font-semibold uppercase tracking-[0.04em] text-muted">
          {t("parishProfile.churchType")}
        </p>
        <p className="mt-[4px] font-sans text-[13.5px] text-muted">
          {parish.city}, {parish.state}
        </p>

        <div className="mt-[20px] flex gap-[10px]">
          <ActionButton href={directionsUrl} icon={<DirectionsIcon className="h-[18px] w-[18px]" />} label={t("parishProfile.directions")} />
          <ActionButton href={`https://${parish.website}`} icon={<GlobeIcon className="h-[18px] w-[18px]" />} label={t("parishProfile.website")} />
          <ActionButton href={`mailto:${parish.email}`} icon={<MailIcon className="h-[18px] w-[18px]" />} label={t("parishProfile.contact")} />
        </div>

        <p className="mt-[28px] font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
          {t("parishProfile.sundaySchedule")}
        </p>
        {parish.schedule.length === 0 && <p className="mt-[8px] font-sans text-[13.5px] text-muted">{t("schedule.emptyState")}</p>}
        {parish.schedule.map((s, i) => (
          <div
            key={s.label}
            className={`flex items-center justify-between py-[12px] ${i !== parish.schedule.length - 1 ? "border-b border-divider" : ""}`}
          >
            <span className="flex items-center gap-[10px] font-sans text-[14.5px] text-text">
              <ClockIcon className="h-[16px] w-[16px] text-navy" />
              {s.label === "Matins" ? t("schedule.matins") : s.label === "Divine Liturgy" ? t("schedule.divineLiturgy") : s.label}
            </span>
            <span className="font-sans text-[14px] font-medium text-navy">{s.time}</span>
          </div>
        ))}

        <button
          type="button"
          className="press mt-[16px] flex w-full items-center justify-between border-t border-divider py-[14px] text-left"
        >
          <span className="font-sans text-[14.5px] text-text">{t("parishProfile.clergy")}</span>
          <ChevronRightIcon className="h-[16px] w-[16px] text-muted" />
        </button>
      </main>
    </div>
  );
}

function ActionButton({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="press flex flex-1 flex-col items-center gap-[6px]"
    >
      <span className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-soft-surface text-navy">
        {icon}
      </span>
      <span className="font-sans text-[11px] font-medium text-text">{label}</span>
    </a>
  );
}
