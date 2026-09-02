import { ARTICLES, type Article } from "@/lib/articleData";
import type { TranslationKey } from "@/lib/i18n/translations";
import { PARISHES } from "@/lib/seedData";
import type { Parish, ProgramLiturgic } from "@/lib/types";

/**
 * Backend-shaped read layer for parish content. Every export here is async
 * and returns plain data, even though it currently just reads the bundled
 * mock arrays — so swapping the bodies for Supabase queries later touches
 * no caller. Nothing outside this file should import PARISHES directly for
 * anything other than the parish-finder map, which predates this layer.
 */

const PRIEST_PARISHES_KEY = "parohia:priestParishes";

function readPriestParishes(): Record<string, Parish> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(PRIEST_PARISHES_KEY) ?? "{}");
  } catch {
    return {};
  }
}

/**
 * A parish a priest created during onboarding (the "my parish isn't listed
 * yet" path). Stored the same way the parishioner-side demo parish is —
 * there is no real backend — but keyed by id rather than a single slot, so
 * more than one priest-created parish can exist and parishioners can find it
 * through the normal parish directory.
 */
export function savePriestParish(parish: Parish): void {
  if (typeof window === "undefined") return;
  const all = readPriestParishes();
  all[parish.id] = parish;
  window.localStorage.setItem(PRIEST_PARISHES_KEY, JSON.stringify(all));
}

export function listPriestParishes(): Parish[] {
  return Object.values(readPriestParishes());
}

export async function listParishes(): Promise<Parish[]> {
  return [...listPriestParishes(), ...PARISHES];
}

const DEMO_PARISH_KEY = "parohia:demoParish";

/**
 * The onboarding flow's "3 demo parishes" aren't part of the static seed
 * data — the one the visitor actually picks gets its city/state filled in
 * from what they entered, then saved here so the rest of the app (Today,
 * Menu, the Liturgical Schedule) can look it up like any other parish. This
 * is a prototype stand-in for a real per-account parish record.
 */
export function saveDemoParish(parish: Parish): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DEMO_PARISH_KEY, JSON.stringify(parish));
}

function readDemoParish(): Parish | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage.getItem(DEMO_PARISH_KEY);
    return raw ? (JSON.parse(raw) as Parish) : undefined;
  } catch {
    return undefined;
  }
}

export async function getParishById(id: string): Promise<Parish | undefined> {
  const demo = readDemoParish();
  if (demo?.id === id) return demo;
  const priestParishes = readPriestParishes();
  if (priestParishes[id]) return priestParishes[id];
  return PARISHES.find((p) => p.id === id);
}

export const WEEKDAY_RO = ["Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"];

/** Shared between the Liturgical Schedule reader and the priest schedule editor, so a day always has one true label. */
export const WEEKDAY_LABEL_KEY: Record<string, TranslationKey> = {
  Duminică: "schedule.sunday",
  Luni: "schedule.monday",
  Marți: "schedule.tuesday",
  Miercuri: "schedule.wednesday",
  Joi: "schedule.thursday",
  Vineri: "schedule.friday",
  Sâmbătă: "schedule.saturday",
};

const PRIEST_PROGRAMS_KEY = "parohia:priestPrograms";

function readPriestPrograms(): Record<string, ProgramLiturgic> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(PRIEST_PROGRAMS_KEY) ?? "{}");
  } catch {
    return {};
  }
}

/** Publishes a priest-authored weekly schedule for their parish, superseding the synthesized fallback below. */
export function savePriestProgram(program: ProgramLiturgic): void {
  if (typeof window === "undefined") return;
  const all = readPriestPrograms();
  all[program.parishId] = program;
  window.localStorage.setItem(PRIEST_PROGRAMS_KEY, JSON.stringify(all));
}

export function readPriestProgram(parishId: string): ProgramLiturgic | undefined {
  return readPriestPrograms()[parishId];
}

/**
 * Every parish currently ships the same flat Sunday schedule (`Parish.schedule`),
 * so Saturday Vespers and Wednesday Paraclesis are synthesized alongside it — a
 * stand-in for the day-by-day schedule a real backend would supply. A parish with
 * an empty `schedule` is treated as not having submitted a program yet, so
 * `undefined` is returned and callers fall back to an empty state rather than a
 * fabricated one. A priest who has published a real schedule for their parish
 * (see `savePriestProgram`) always takes precedence over the synthesized one.
 */
export async function getProgramForParish(parishId: string): Promise<ProgramLiturgic | undefined> {
  const published = readPriestProgram(parishId);
  if (published) return published;
  const parish = await getParishById(parishId);
  if (!parish || parish.schedule.length === 0) return undefined;
  return {
    parishId,
    saptamanal: [
      { zi: WEEKDAY_RO[0], slujbe: parish.schedule.map((s) => ({ nume: s.label, ora: s.time })) },
      { zi: WEEKDAY_RO[6], slujbe: [{ nume: "Vespers", ora: "6:00 PM" }] },
      { zi: WEEKDAY_RO[3], slujbe: [{ nume: "Paraclesis to the Theotokos", ora: "6:00 PM" }] },
    ],
    praznice: [],
  };
}

/** Services scheduled today at the given parish, for the given JS Date weekday (0=Sunday). */
export async function getTodaysServices(parishId: string, weekday: number): Promise<{ nume: string; ora: string }[]> {
  const program = await getProgramForParish(parishId);
  if (!program) return [];
  const zi = WEEKDAY_RO[weekday];
  return program.saptamanal.find((d) => d.zi === zi)?.slujbe ?? [];
}

const PRIEST_ANNOUNCEMENTS_KEY = "parohia:priestAnnouncements";

function readPriestAnnouncements(): Article[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(PRIEST_ANNOUNCEMENTS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writePriestAnnouncements(all: Article[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PRIEST_ANNOUNCEMENTS_KEY, JSON.stringify(all));
}

/** Creates or updates one priest-authored announcement for their own parish. */
export function savePriestAnnouncement(article: Article): void {
  const all = readPriestAnnouncements();
  const idx = all.findIndex((a) => a.id === article.id);
  if (idx >= 0) all[idx] = article;
  else all.unshift(article);
  writePriestAnnouncements(all);
}

export function deletePriestAnnouncement(id: string): void {
  writePriestAnnouncements(readPriestAnnouncements().filter((a) => a.id !== id));
}

export function listPriestAnnouncementsForParish(parishId: string): Article[] {
  return readPriestAnnouncements().filter((a) => a.parishId === parishId);
}

export function findPriestAnnouncementById(id: string): Article | undefined {
  return readPriestAnnouncements().find((a) => a.id === id);
}

export async function getGlobalAnnouncements(): Promise<Article[]> {
  return ARTICLES.filter((a) => !a.parishId);
}

/** Parish-specific announcements first (priest-authored, then any seeded ones), falling back to diocese-wide ones — newest first. */
export async function getAnnouncementsForParish(parishId: string): Promise<Article[]> {
  const own = [...listPriestAnnouncementsForParish(parishId), ...ARTICLES.filter((a) => a.parishId === parishId)];
  const global = await getGlobalAnnouncements();
  return [...own, ...global];
}
