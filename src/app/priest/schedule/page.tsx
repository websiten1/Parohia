"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { BackIcon, PlusIcon, TrashIcon } from "@/components/icons";
import { TimeWheelPicker, defaultTimeValue, formatTimeValue, type TimeValue } from "@/components/TimeWheelPicker";
import { REFERENCE_DATE_2026, getUpcomingMajorFeasts2026 } from "@/lib/calendar-data/liturgicalYear2026";
import { getParishById, readPriestProgram, savePriestProgram, WEEKDAY_LABEL_KEY, WEEKDAY_RO } from "@/lib/data/parishes";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import type { TranslationKey } from "@/lib/i18n/translations";
import { useAccount } from "@/lib/storage";
import type { ProgramLiturgic } from "@/lib/types";

const QUICK_SERVICE_NAMES = ["Matins", "Divine Liturgy", "Vespers", "Paraclesis to the Theotokos"];
const SERVICE_LABEL: Record<string, TranslationKey> = {
  Matins: "schedule.matins",
  "Divine Liturgy": "schedule.divineLiturgy",
  Vespers: "schedule.vespers",
  "Paraclesis to the Theotokos": "schedule.paraclesis",
};

type Weekly = ProgramLiturgic["saptamanal"];
type Feasts = ProgramLiturgic["praznice"];

function addToWeekly(weekly: Weekly, zi: string, nume: string, ora: string): Weekly {
  const idx = weekly.findIndex((d) => d.zi === zi);
  if (idx < 0) return [...weekly, { zi, slujbe: [{ nume, ora }] }];
  if (weekly[idx].slujbe.some((s) => s.nume === nume)) return weekly;
  const updated = [...weekly];
  updated[idx] = { ...updated[idx], slujbe: [...updated[idx].slujbe, { nume, ora }] };
  return updated;
}

/**
 * Priest-facing schedule editor. Writes a real ProgramLiturgic via
 * savePriestProgram, which getProgramForParish already prefers over the
 * synthesized fallback — so publishing here is immediately reflected on
 * Today and the Liturgical Schedule for every parishioner of this parish.
 */
export default function PriestSchedulePage() {
  const router = useRouter();
  const { t, language } = useTranslation();
  const [account, , hydrated] = useAccount();
  const [parishName, setParishName] = useState("");
  const [weekly, setWeekly] = useState<Weekly>([]);
  const [feasts, setFeasts] = useState<Feasts>([]);
  const [view, setView] = useState<"edit" | "confirm">("edit");

  const [showAddService, setShowAddService] = useState(false);
  const [day, setDay] = useState<string>(WEEKDAY_RO[0]);
  const [serviceName, setServiceName] = useState("");
  const [time, setTime] = useState<TimeValue>(defaultTimeValue());

  const [showAddFeast, setShowAddFeast] = useState(false);
  const [feastTitle, setFeastTitle] = useState("");
  const [feastDesc, setFeastDesc] = useState("");

  const parishId = account?.parishId;

  useEffect(() => {
    if (!hydrated) return;
    if (account?.role !== "priest" || !parishId) {
      router.replace("/login/priest");
      return;
    }
    getParishById(parishId).then((p) => setParishName(p?.name ?? ""));
    const existing = readPriestProgram(parishId);
    if (existing) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setWeekly(existing.saptamanal);
      setFeasts(existing.praznice);
    }
  }, [account, hydrated, parishId, router]);

  const upcomingFeasts = useMemo(() => getUpcomingMajorFeasts2026(REFERENCE_DATE_2026, 3), []);

  if (!hydrated || account?.role !== "priest" || !parishId) return null;

  function submitAddService() {
    if (!serviceName.trim()) return;
    setWeekly((prev) => addToWeekly(prev, day, serviceName.trim(), formatTimeValue(time)));
    setServiceName("");
    setShowAddService(false);
  }

  function removeService(zi: string, nume: string) {
    setWeekly((prev) =>
      prev.map((d) => (d.zi === zi ? { ...d, slujbe: d.slujbe.filter((s) => s.nume !== nume) } : d)).filter((d) => d.slujbe.length > 0)
    );
  }

  function addSuggestedDay(zi: string, entries: { nume: string; ora: string }[]) {
    setWeekly((prev) => entries.reduce((acc, e) => addToWeekly(acc, zi, e.nume, e.ora), prev));
  }

  function submitAddFeast() {
    if (!feastTitle.trim() || !feastDesc.trim()) return;
    setFeasts((prev) => [...prev, { titlu: feastTitle.trim(), descriere: feastDesc.trim() }]);
    setFeastTitle("");
    setFeastDesc("");
    setShowAddFeast(false);
  }

  function addFeastSuggestion(titlu: string, dateIso: string) {
    if (feasts.some((f) => f.titlu === titlu)) return;
    const dateLabel = new Date(dateIso + "T00:00:00").toLocaleDateString(language === "ro" ? "ro-RO" : "en-US", {
      month: "long",
      day: "numeric",
    });
    setFeasts((prev) => [...prev, { titlu, descriere: dateLabel }]);
  }

  function removeFeast(titlu: string) {
    setFeasts((prev) => prev.filter((f) => f.titlu !== titlu));
  }

  function publish() {
    if (!parishId) return;
    savePriestProgram({ parishId, saptamanal: weekly, praznice: feasts });
    router.replace("/priest");
  }

  if (view === "confirm") {
    return (
      <div className="flex min-h-dvh flex-col bg-background">
        <header className="flex h-[52px] shrink-0 items-center justify-between border-b border-divider bg-surface px-outer">
          <button
            type="button"
            onClick={() => setView("edit")}
            aria-label={t("priestSchedule.confirmBackCta")}
            className="press flex h-[36px] w-[36px] items-center justify-center rounded-sm"
          >
            <BackIcon className="h-[22px] w-[22px] text-text" />
          </button>
          <h1 className="flex-1 truncate text-center font-sans text-[16px] font-semibold text-text">{t("priestSchedule.confirmTitle")}</h1>
          <div className="w-[36px]" />
        </header>
        <main className="flex-1 px-outer pt-[20px] pb-[40px]">
          <p className="font-serif text-[17px] font-bold text-text">{parishName}</p>

          <p className="mt-[28px] font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">{t("priestSchedule.weeklyTitle")}</p>
          {weekly.length === 0 ? (
            <p className="mt-[8px] font-sans text-[13.5px] text-muted">{t("priestSchedule.confirmWeeklyEmpty")}</p>
          ) : (
            <div className="mt-[12px] flex flex-col gap-[18px]">
              {weekly.map((d) => (
                <div key={d.zi}>
                  <p className="font-serif text-[16px] font-bold text-burgundy">{t("priestSchedule.everyDay", { day: t(WEEKDAY_LABEL_KEY[d.zi] ?? "schedule.sunday") })}</p>
                  {d.slujbe.map((s) => (
                    <div key={s.nume} className="mt-[4px] flex items-baseline justify-between font-sans text-[14px] text-text">
                      <span>{SERVICE_LABEL[s.nume] ? t(SERVICE_LABEL[s.nume]) : s.nume}</span>
                      <span className="font-medium text-navy">{s.ora}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          <p className="mt-[28px] font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">{t("priestSchedule.feastTitle")}</p>
          {feasts.length === 0 ? (
            <p className="mt-[8px] font-sans text-[13.5px] text-muted">{t("priestSchedule.confirmFeastEmpty")}</p>
          ) : (
            <div className="mt-[12px] flex flex-col gap-[10px]">
              {feasts.map((f) => (
                <div key={f.titlu}>
                  <p className="font-serif text-[15px] font-bold text-text">{f.titlu}</p>
                  <p className="font-sans text-[13px] text-muted">{f.descriere}</p>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={publish}
            className="press mt-[36px] w-full rounded-pill bg-burgundy py-[16px] text-center font-sans text-[15px] font-semibold text-white"
          >
            {t("priestSchedule.confirmPublishCta")}
          </button>
          <button type="button" onClick={() => setView("edit")} className="press mt-[16px] w-full text-center font-sans text-[13px] text-muted">
            {t("priestSchedule.confirmBackCta")}
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <AppHeader title={t("priest.scheduleTitle")} backHref="/priest" />

      <main className="flex-1 px-outer pt-[20px] pb-[120px]">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">{t("priestSchedule.weeklyTitle")}</p>

        {weekly.length === 0 ? (
          <p className="mt-[8px] font-sans text-[13.5px] text-muted">{t("priestSchedule.weeklyEmpty")}</p>
        ) : (
          <div className="mt-[10px] flex flex-col gap-[16px]">
            {weekly.map((d) => (
              <div key={d.zi}>
                <p className="font-serif text-[15px] font-bold text-burgundy">{t(WEEKDAY_LABEL_KEY[d.zi] ?? "schedule.sunday")}</p>
                {d.slujbe.map((s) => (
                  <div key={s.nume} className="mt-[4px] flex items-center justify-between border-b border-divider/70 py-[8px]">
                    <span className="font-sans text-[13.5px] text-text">
                      {SERVICE_LABEL[s.nume] ? t(SERVICE_LABEL[s.nume]) : s.nume} · <span className="font-medium text-navy">{s.ora}</span>
                    </span>
                    <button type="button" aria-label={t("priestSchedule.removeService")} onClick={() => removeService(d.zi, s.nume)} className="press text-muted">
                      <TrashIcon className="h-[15px] w-[15px]" />
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        <p className="mt-[24px] font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">{t("priestSchedule.suggestionsTitle")}</p>
        <div className="mt-[10px] flex flex-col gap-[8px]">
          <button
            type="button"
            onClick={() =>
              addSuggestedDay(WEEKDAY_RO[0], [
                { nume: "Matins", ora: "9:00 AM" },
                { nume: "Divine Liturgy", ora: "10:00 AM" },
              ])
            }
            className="press rounded-pill border border-divider py-[10px] text-center font-sans text-[13px] font-medium text-navy"
          >
            {t("priestSchedule.suggestSundayLabel")}
          </button>
          <button
            type="button"
            onClick={() => addSuggestedDay(WEEKDAY_RO[6], [{ nume: "Vespers", ora: "6:00 PM" }])}
            className="press rounded-pill border border-divider py-[10px] text-center font-sans text-[13px] font-medium text-navy"
          >
            {t("priestSchedule.suggestSaturdayLabel")}
          </button>
          <button
            type="button"
            onClick={() => addSuggestedDay(WEEKDAY_RO[3], [{ nume: "Paraclesis to the Theotokos", ora: "6:00 PM" }])}
            className="press rounded-pill border border-divider py-[10px] text-center font-sans text-[13px] font-medium text-navy"
          >
            {t("priestSchedule.suggestWednesdayLabel")}
          </button>
        </div>

        {showAddService ? (
          <div className="mt-[20px]">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">{t("priestSchedule.dayLabel")}</p>
            <div className="no-scrollbar mt-[8px] flex gap-[6px] overflow-x-auto">
              {WEEKDAY_RO.map((zi) => (
                <button
                  key={zi}
                  type="button"
                  onClick={() => setDay(zi)}
                  className={`press shrink-0 rounded-pill px-[14px] py-[7px] font-sans text-[12.5px] font-medium ${
                    day === zi ? "bg-burgundy text-white" : "bg-soft-surface text-text"
                  }`}
                >
                  {t(WEEKDAY_LABEL_KEY[zi] ?? "schedule.sunday")}
                </button>
              ))}
            </div>

            <p className="mt-[18px] font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">{t("priestSchedule.serviceNameLabel")}</p>
            <div className="mt-[8px] flex flex-wrap gap-[6px]">
              {QUICK_SERVICE_NAMES.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setServiceName(name)}
                  className={`press shrink-0 rounded-pill px-[12px] py-[6px] font-sans text-[12px] font-medium ${
                    serviceName === name ? "bg-navy text-white" : "bg-soft-surface text-text"
                  }`}
                >
                  {t(SERVICE_LABEL[name])}
                </button>
              ))}
            </div>
            <input
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder={t("priestSchedule.serviceNamePlaceholder")}
              className="mt-[10px] w-full border-b border-divider bg-transparent pb-[8px] font-serif text-[16px] text-text outline-none focus:border-navy"
            />

            <p className="mt-[18px] text-center font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">{t("priestSchedule.timeLabel")}</p>
            <div className="mt-[6px]">
              <TimeWheelPicker value={time} onChange={setTime} aria-label={t("priestSchedule.timeLabel")} />
            </div>

            <button
              type="button"
              disabled={!serviceName.trim()}
              onClick={submitAddService}
              className="press mt-[14px] w-full rounded-pill bg-burgundy py-[13px] text-center font-sans text-[14px] font-semibold text-white disabled:opacity-40"
            >
              {t("priestSchedule.addServiceCta")}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowAddService(true)}
            className="press mt-[16px] flex w-full items-center justify-center gap-[8px] rounded-pill border border-navy py-[12px] font-sans text-[13.5px] font-semibold text-navy"
          >
            <PlusIcon className="h-[14px] w-[14px]" />
            {t("priestSchedule.addService")}
          </button>
        )}

        <p className="mt-[40px] font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">{t("priestSchedule.feastTitle")}</p>

        {feasts.length === 0 ? (
          <p className="mt-[8px] font-sans text-[13.5px] text-muted">{t("priestSchedule.feastEmpty")}</p>
        ) : (
          <div className="mt-[10px] flex flex-col gap-[4px]">
            {feasts.map((f) => (
              <div key={f.titlu} className="flex items-center justify-between border-b border-divider/70 py-[10px]">
                <span className="min-w-0 flex-1">
                  <span className="block font-serif text-[14.5px] font-bold text-text">{f.titlu}</span>
                  <span className="block font-sans text-[12.5px] text-muted">{f.descriere}</span>
                </span>
                <button type="button" aria-label={t("priestSchedule.removeNotice")} onClick={() => removeFeast(f.titlu)} className="press shrink-0 text-muted">
                  <TrashIcon className="h-[15px] w-[15px]" />
                </button>
              </div>
            ))}
          </div>
        )}

        {upcomingFeasts.length > 0 && (
          <div className="mt-[10px] flex flex-col gap-[8px]">
            {upcomingFeasts.map((feast) => {
              const title = language === "ro" ? feast.commemorationsRo : feast.commemorationsEn;
              return (
                <button
                  key={feast.date}
                  type="button"
                  onClick={() => addFeastSuggestion(title, feast.date)}
                  className="press rounded-pill border border-divider py-[10px] text-center font-sans text-[13px] font-medium text-navy"
                >
                  {t("priestSchedule.feastSuggestionCta", { title })}
                </button>
              );
            })}
          </div>
        )}

        {showAddFeast ? (
          <div className="mt-[16px]">
            <input
              autoFocus
              value={feastTitle}
              onChange={(e) => setFeastTitle(e.target.value)}
              placeholder={t("priestSchedule.feastTitlePlaceholder")}
              className="w-full border-b border-divider bg-transparent pb-[8px] font-serif text-[16px] text-text outline-none focus:border-navy"
            />
            <input
              value={feastDesc}
              onChange={(e) => setFeastDesc(e.target.value)}
              placeholder={t("priestSchedule.feastDescPlaceholder")}
              className="mt-[14px] w-full border-b border-divider bg-transparent pb-[8px] font-sans text-[14px] text-text outline-none focus:border-navy"
            />
            <button
              type="button"
              disabled={!feastTitle.trim() || !feastDesc.trim()}
              onClick={submitAddFeast}
              className="press mt-[14px] w-full rounded-pill bg-burgundy py-[13px] text-center font-sans text-[14px] font-semibold text-white disabled:opacity-40"
            >
              {t("priestSchedule.addFeastCta")}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowAddFeast(true)}
            className="press mt-[12px] flex w-full items-center justify-center gap-[8px] rounded-pill border border-navy py-[12px] font-sans text-[13.5px] font-semibold text-navy"
          >
            <PlusIcon className="h-[14px] w-[14px]" />
            {t("priestSchedule.addFeastNotice")}
          </button>
        )}

        <button
          type="button"
          onClick={() => setView("confirm")}
          className="press mt-[40px] w-full rounded-pill bg-burgundy py-[16px] text-center font-sans text-[15px] font-semibold text-white"
        >
          {t("priestSchedule.publishCta")}
        </button>
      </main>
    </div>
  );
}
