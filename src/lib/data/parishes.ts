import { ARTICLES, type Article } from "@/lib/articleData";
import { PARISHES } from "@/lib/seedData";
import type { Parish, ProgramLiturgic } from "@/lib/types";

/**
 * Backend-shaped read layer for parish content. Every export here is async
 * and returns plain data, even though it currently just reads the bundled
 * mock arrays — so swapping the bodies for Supabase queries later touches
 * no caller. Nothing outside this file should import PARISHES directly for
 * anything other than the parish-finder map, which predates this layer.
 */

export async function listParishes(): Promise<Parish[]> {
  return PARISHES;
}

export async function getParishById(id: string): Promise<Parish | undefined> {
  return PARISHES.find((p) => p.id === id);
}

const WEEKDAY_RO = ["Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"];

/**
 * Every parish currently ships the same flat Sunday schedule (`Parish.schedule`),
 * so Saturday Vespers and Wednesday Paraclesis are synthesized alongside it — a
 * stand-in for the day-by-day schedule a real backend would supply. A parish with
 * an empty `schedule` is treated as not having submitted a program yet, so
 * `undefined` is returned and callers fall back to an empty state rather than a
 * fabricated one.
 */
export async function getProgramForParish(parishId: string): Promise<ProgramLiturgic | undefined> {
  const parish = PARISHES.find((p) => p.id === parishId);
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

export async function getGlobalAnnouncements(): Promise<Article[]> {
  return ARTICLES.filter((a) => !a.parishId);
}

/** Parish-specific announcements first, falling back to diocese-wide ones — newest first. */
export async function getAnnouncementsForParish(parishId: string): Promise<Article[]> {
  const own = ARTICLES.filter((a) => a.parishId === parishId);
  const global = await getGlobalAnnouncements();
  return [...own, ...global];
}
