/**
 * The prayer book's structure.
 *
 * Text is reproduced exactly as supplied. The only transcription applied is
 * rejoining lines the source PDF wrapped mid-sentence and dropping its bare
 * page numbers; not one word is added, removed or reworded.
 */

/** One screen of a sequence — a single prayer within, say, the morning rule. */
export interface PrayerStep {
  id: string;
  title: string;
  /** Guidance shown above the prayer, italicised, as in the book. */
  rubric?: string;
  paragraphs: string[];
  /** Trailing guidance, e.g. "(o metanie)". */
  note?: string;
}

export type SectionKind =
  /** Stepped: one prayer per screen, advanced with the arrow. */
  | "sequence"
  /** An index of prayers, each opening in a sheet. */
  | "list"
  /** A single continuous reading. */
  | "page";

export interface PrayerSection {
  id: string;
  title: string;
  kind: SectionKind;
  intro?: string;
  steps: PrayerStep[];
  /** True when the text for this section has not been supplied yet. */
  pending?: boolean;
}
