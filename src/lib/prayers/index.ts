import type { PrayerSection } from "./types";
import { DIMINEATA } from "./dimineata";
import { TREBUINTE, TREBUINTE_INTRO } from "./trebuinte";
import { MESE, SEARA } from "./mese-seara";
import { SPOVEDANIE, SPOVEDANIE_INTRO } from "./spovedanie";

export * from "./types";

/**
 * The prayer book, in the order given.
 *
 * Sections marked `pending` are listed because they belong to the book, but
 * their text has not been supplied — the source message was truncated. They
 * are deliberately empty rather than filled with approximated text: these are
 * liturgical texts and inventing them would be worse than showing nothing.
 */
export const SECTIONS: PrayerSection[] = [
  { id: "diminetii", title: "Rugăciunile dimineţii", kind: "sequence", steps: DIMINEATA },
  {
    id: "trebuinte",
    title: "Rugăciuni pentru diferite trebuinţe",
    kind: "list",
    intro: TREBUINTE_INTRO,
    steps: TREBUINTE,
  },
  { id: "mese", title: "Rugăciunile meselor", kind: "page", steps: MESE },
  { id: "seara", title: "Rugăciunile de seară", kind: "sequence", steps: SEARA },
  {
    id: "spovedanie",
    title: "Rânduială înainte de spovedanie",
    kind: "page",
    intro: SPOVEDANIE_INTRO,
    steps: SPOVEDANIE,
  },
  { id: "pavecernita", title: "Pavecerniţa Mică", kind: "page", steps: [], pending: true },
  {
    id: "canon-pocainta",
    title: "Canon de pocăinţă către Domnul nostru Iisus Hristos",
    kind: "page",
    steps: [],
    pending: true,
  },
  { id: "paraclis", title: "Paraclisul Maicii lui Dumnezeu", kind: "page", steps: [], pending: true },
  { id: "canon-inger", title: "Canonul către Îngerul păzitor", kind: "page", steps: [], pending: true },
  { id: "impartasire", title: "Rânduiala sfintei împărtăşiri", kind: "page", steps: [], pending: true },
  {
    id: "multumire",
    title: "Rugăciunile de mulţumire după dumnezeiasca împărtăşire",
    kind: "page",
    steps: [],
    pending: true,
  },
  {
    id: "acatist",
    title: "Imnul Acatist al Născătoarei de Dumnezeu",
    kind: "page",
    steps: [],
    pending: true,
  },
  { id: "ceasul-pascal", title: "Rânduiala ceasului pascal", kind: "page", steps: [], pending: true },
];

export function getSection(id: string): PrayerSection | undefined {
  return SECTIONS.find((s) => s.id === id);
}
