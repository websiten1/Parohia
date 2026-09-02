import roRaw from "./2026-ro.json";
import enRaw from "./2026-en.json";

export interface SundayReadingInfo {
  title: string | null;
  tone: number | null;
  matinsGospel: number | null;
  epistle: string | null;
  gospel: string | null;
}

interface RawDay {
  date: string;
  weekdayActual: string;
  isMajorFeast: boolean;
  commemorations: string;
  notes: string[];
  sunday: SundayReadingInfo | null;
}

export interface LiturgicalDay2026 {
  date: string; // YYYY-MM-DD
  weekdayActual: string;
  isMajorFeast: boolean;
  commemorationsRo: string;
  commemorationsEn: string;
  notesRo: string[];
  notesEn: string[];
  sundayRo: SundayReadingInfo | null;
  sundayEn: SundayReadingInfo | null;
  /** This day's own tone/matins-gospel if it's a Sunday, otherwise inherited from the most recent Sunday. */
  tone: number | null;
  matinsGospel: number | null;
}

/** The app's fixed reference "today" for the 2026 real-calendar experience. */
export const REFERENCE_DATE_2026 = "2026-08-21";

const roDays = roRaw as RawDay[];
const enDays = enRaw as RawDay[];

function buildYear(): Map<string, LiturgicalDay2026> {
  const enByDate = new Map(enDays.map((d) => [d.date, d]));
  const sorted = [...roDays].sort((a, b) => a.date.localeCompare(b.date));

  const map = new Map<string, LiturgicalDay2026>();
  let tone: number | null = null;
  let matinsGospel: number | null = null;

  for (const ro of sorted) {
    const en = enByDate.get(ro.date);
    if (ro.sunday) {
      tone = ro.sunday.tone;
      matinsGospel = ro.sunday.matinsGospel;
    }
    map.set(ro.date, {
      date: ro.date,
      weekdayActual: ro.weekdayActual,
      isMajorFeast: ro.isMajorFeast,
      commemorationsRo: ro.commemorations,
      commemorationsEn: en?.commemorations ?? ro.commemorations,
      notesRo: ro.notes,
      notesEn: en?.notes ?? [],
      sundayRo: ro.sunday,
      sundayEn: en?.sunday ?? null,
      tone,
      matinsGospel,
    });
  }
  return map;
}

const YEAR_2026 = buildYear();

export function getLiturgicalDay2026(dateStr: string): LiturgicalDay2026 | undefined {
  return YEAR_2026.get(dateStr);
}

export function getLiturgicalDayRange2026(centerDate: string, before: number, after: number): LiturgicalDay2026[] {
  const center = new Date(centerDate + "T00:00:00");
  const result: LiturgicalDay2026[] = [];
  for (let offset = -before; offset <= after; offset++) {
    const d = new Date(center);
    d.setDate(d.getDate() + offset);
    const iso = d.toISOString().slice(0, 10);
    const day = YEAR_2026.get(iso);
    if (day) result.push(day);
  }
  return result;
}

export function getNextMajorFeast2026(afterDate: string): LiturgicalDay2026 | undefined {
  const sorted = [...YEAR_2026.values()].sort((a, b) => a.date.localeCompare(b.date));
  return sorted.find((d) => d.date > afterDate && d.isMajorFeast);
}

/** The next `count` major feasts after a date — used to suggest feast-day notices to a priest, not to display to parishioners. */
export function getUpcomingMajorFeasts2026(afterDate: string, count: number): LiturgicalDay2026[] {
  const sorted = [...YEAR_2026.values()].sort((a, b) => a.date.localeCompare(b.date));
  return sorted.filter((d) => d.date > afterDate && d.isMajorFeast).slice(0, count);
}

export function getMonthDays2026(year: number, month: number): LiturgicalDay2026[] {
  const result: LiturgicalDay2026[] = [];
  const prefix = `${year}-${String(month).padStart(2, "0")}-`;
  for (const [dateStr, day] of YEAR_2026) {
    if (dateStr.startsWith(prefix)) result.push(day);
  }
  return result.sort((a, b) => a.date.localeCompare(b.date));
}
