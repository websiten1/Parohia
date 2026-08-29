/**
 * Colors the calendar grid by classifying each day into one of five types.
 * Sunday and major-feast status come straight off the liturgical data; fasting
 * days are derived from a real Orthodox fasting calendar computed off the
 * Gregorian date of Orthodox Pascha (Meeus' Julian algorithm, converted to
 * the Gregorian calendar by +13 days, valid for 1900–2099).
 */
export type TipZi = "duminica" | "praznic" | "post" | "sfant" | "obisnuita";

function isoOf(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function plusDays(d: Date, n: number): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + n);
  return copy;
}

function orthodoxPaschaGregorian(year: number): Date {
  const a = year % 4;
  const b = year % 7;
  const c = year % 19;
  const d = (19 * c + 15) % 30;
  const e = (2 * a + 4 * b - d + 34) % 7;
  const julianMonth = Math.floor((d + e + 114) / 31);
  const julianDay = ((d + e + 114) % 31) + 1;
  return plusDays(new Date(year, julianMonth - 1, julianDay), 13);
}

interface YearFastingBounds {
  paschaISO: string;
  lentStart: string;
  holySaturday: string;
  brightWeekEnd: string;
  trinityWeekStart: string;
  trinityWeekEnd: string;
  publicanFreeStart: string;
  publicanFreeEnd: string;
  cheesefareStart: string;
  cheesefareEnd: string;
  apostlesStart: string | null;
  apostlesEnd: string | null;
}

const boundsCache = new Map<number, YearFastingBounds>();

function boundsForYear(year: number): YearFastingBounds {
  const cached = boundsCache.get(year);
  if (cached) return cached;

  const pascha = orthodoxPaschaGregorian(year);
  const apostlesStart = plusDays(pascha, 57);
  const june28 = new Date(year, 5, 28);
  const hasApostlesFast = apostlesStart <= june28;

  const bounds: YearFastingBounds = {
    paschaISO: isoOf(pascha),
    lentStart: isoOf(plusDays(pascha, -48)),
    holySaturday: isoOf(plusDays(pascha, -1)),
    brightWeekEnd: isoOf(plusDays(pascha, 6)),
    trinityWeekStart: isoOf(plusDays(pascha, 50)),
    trinityWeekEnd: isoOf(plusDays(pascha, 56)),
    publicanFreeStart: isoOf(plusDays(pascha, -69)),
    publicanFreeEnd: isoOf(plusDays(pascha, -63)),
    cheesefareStart: isoOf(plusDays(pascha, -55)),
    cheesefareEnd: isoOf(plusDays(pascha, -49)),
    apostlesStart: hasApostlesFast ? isoOf(apostlesStart) : null,
    apostlesEnd: hasApostlesFast ? isoOf(june28) : null,
  };
  boundsCache.set(year, bounds);
  return bounds;
}

function within(dateStr: string, start: string, end: string): boolean {
  return dateStr >= start && dateStr <= end;
}

/** True for any day under a multi-day fast, or a Wed/Fri fast outside a fast-free week. */
export function isFastingDay(dateStr: string): boolean {
  const year = Number(dateStr.slice(0, 4));
  const month = Number(dateStr.slice(5, 7));
  const day = Number(dateStr.slice(8, 10));
  const b = boundsForYear(year);

  if (within(dateStr, b.lentStart, b.holySaturday)) return true;
  if (b.apostlesStart && b.apostlesEnd && within(dateStr, b.apostlesStart, b.apostlesEnd)) return true;
  if (month === 8 && day >= 1 && day <= 14) return true; // Postul Adormirii Maicii Domnului
  if (month === 11 && day >= 15) return true; // Postul Nașterii Domnului (start)
  if (month === 12 && day <= 24) return true; // Postul Nașterii Domnului (continuare)

  const weekday = new Date(dateStr + "T00:00:00").getDay();
  if (weekday !== 3 && weekday !== 5) return false;

  const fastFree =
    within(dateStr, b.paschaISO, b.brightWeekEnd) ||
    within(dateStr, b.trinityWeekStart, b.trinityWeekEnd) ||
    within(dateStr, b.publicanFreeStart, b.publicanFreeEnd) ||
    within(dateStr, b.cheesefareStart, b.cheesefareEnd) ||
    (month === 12 && day >= 25) ||
    (month === 1 && day <= 4);

  return !fastFree;
}

interface ClassifiableDay {
  date: string;
  isMajorFeast: boolean;
  notesRo: string[];
}

export function classifyDay(day: ClassifiableDay): TipZi {
  const weekday = new Date(day.date + "T00:00:00").getDay();
  if (weekday === 0) return "duminica";
  if (day.isMajorFeast) return "praznic";
  if (isFastingDay(day.date)) return "post";
  if (day.notesRo.length > 0) return "sfant";
  return "obisnuita";
}
