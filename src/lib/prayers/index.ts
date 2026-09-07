import type { PrayerSection } from "./types";
import { DIMINEATA } from "./dimineata";
import { TREBUINTE, TREBUINTE_INTRO } from "./trebuinte";
import { MESE, SEARA } from "./mese-seara";
import { SPOVEDANIE, SPOVEDANIE_INTRO } from "./spovedanie";
import { PAVECERNITA, PAVECERNITA_INTRO } from "./pavecernita";
import { CANON_POCAINTA, CANON_POCAINTA_INTRO } from "./canon-pocainta";
import { PARACLIS, PARACLIS_INTRO } from "./paraclis";
import { CANON_INGER } from "./canon-inger";
import { IMPARTASIRE, IMPARTASIRE_INTRO } from "./impartasire";
import { MULTUMIRE } from "./multumire";
import { ACATIST, ACATIST_INTRO } from "./acatist";
import { CEASUL_PASCAL, CEASUL_PASCAL_INTRO } from "./ceasul-pascal";

export * from "./types";

/**
 * The prayer book, in the order given. Every section carries the text as it was
 * supplied; none is paraphrased. `PrayerSection.pending` is kept in the type for
 * anything added later whose text has not arrived yet.
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
  {
    id: "pavecernita",
    title: "Pavecerniţa Mică",
    kind: "page",
    intro: PAVECERNITA_INTRO,
    steps: PAVECERNITA,
  },
  {
    id: "canon-pocainta",
    title: "Canon de pocăinţă către Domnul nostru Iisus Hristos",
    kind: "page",
    intro: CANON_POCAINTA_INTRO,
    steps: CANON_POCAINTA,
  },
  {
    id: "paraclis",
    title: "Paraclisul Maicii lui Dumnezeu",
    kind: "page",
    intro: PARACLIS_INTRO,
    steps: PARACLIS,
  },
  { id: "canon-inger", title: "Canonul către Îngerul păzitor", kind: "page", steps: CANON_INGER },
  {
    id: "impartasire",
    title: "Rânduiala sfintei împărtăşiri",
    kind: "page",
    intro: IMPARTASIRE_INTRO,
    steps: IMPARTASIRE,
  },
  {
    id: "multumire",
    title: "Rugăciunile de mulţumire după dumnezeiasca împărtăşire",
    kind: "page",
    steps: MULTUMIRE,
  },
  {
    id: "acatist",
    title: "Imnul Acatist al Născătoarei de Dumnezeu",
    kind: "page",
    intro: ACATIST_INTRO,
    steps: ACATIST,
  },
  {
    id: "ceasul-pascal",
    title: "Rânduiala ceasului pascal",
    kind: "page",
    intro: CEASUL_PASCAL_INTRO,
    steps: CEASUL_PASCAL,
  },
];

export function getSection(id: string): PrayerSection | undefined {
  return SECTIONS.find((s) => s.id === id);
}
