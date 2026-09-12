/**
 * The jurisdiction this deployment serves.
 *
 * ROEA is the first customer, not the only possible one: a Greek or Serbian
 * diocese would run the same product with its own identity. Nothing in the
 * codebase should name ROEA literally, so a second jurisdiction is a set of
 * environment variables and a translations file rather than a search and
 * replace through the source.
 *
 * Per-parish facts belong on the Parish record, which already carries its own
 * `jurisdiction` string. This describes the deployment as a whole: whose
 * diocese it is, who leads it, and where its shared content comes from.
 */
export interface Jurisdiction {
  /** Short code used in data, e.g. on Parish.jurisdiction. */
  code: string;
  /** Full name, as it should appear in running text. */
  name: string;
  /** How the app refers to itself. */
  brand: string;
  /** Ruling hierarch. Left generic when no name is configured. */
  hierarchName: string;
  hierarchTitle: string;
  /** Default country for a newly pre-created parish. */
  defaultCountry: string;
  /** Where shared content will come from in M3. Absent means the feed is off. */
  newsFeedUrl?: string;
  calendarFeedUrl?: string;
  /** Public site, for "about" links. */
  websiteUrl?: string;
}

/**
 * Defaults describe ROEA because that is the first deployment, but they are
 * only defaults: every field is overridable, and nothing reads these constants
 * directly. Anything that would otherwise hardcode a jurisdiction reads
 * `jurisdiction()` instead.
 */
const DEFAULTS: Jurisdiction = {
  code: "ROEA",
  name: "Episcopia Ortodoxă Română din America",
  brand: "Parohia",
  hierarchName: "His Grace, Our Bishop",
  hierarchTitle: "Ruling Hierarch of the Diocese",
  defaultCountry: "Statele Unite",
};

function env(name: string): string | undefined {
  const value = process.env[name];
  return value && value.trim() !== "" ? value.trim() : undefined;
}

let cached: Jurisdiction | null = null;

export function jurisdiction(): Jurisdiction {
  if (cached) return cached;
  cached = {
    code: env("JURISDICTION_CODE") ?? DEFAULTS.code,
    name: env("JURISDICTION_NAME") ?? DEFAULTS.name,
    brand: env("JURISDICTION_BRAND") ?? DEFAULTS.brand,
    hierarchName: env("JURISDICTION_HIERARCH_NAME") ?? DEFAULTS.hierarchName,
    hierarchTitle: env("JURISDICTION_HIERARCH_TITLE") ?? DEFAULTS.hierarchTitle,
    defaultCountry: env("JURISDICTION_DEFAULT_COUNTRY") ?? DEFAULTS.defaultCountry,
    newsFeedUrl: env("JURISDICTION_NEWS_FEED_URL"),
    calendarFeedUrl: env("JURISDICTION_CALENDAR_FEED_URL"),
    websiteUrl: env("JURISDICTION_WEBSITE_URL"),
  };
  return cached;
}

/** Only for tests, which change the environment between cases. */
export function resetJurisdictionCache(): void {
  cached = null;
}
