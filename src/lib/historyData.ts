export interface TimelineEvent {
  id: string;
  year: number;
  /** Month/day when the source gave an exact date, for "On This Day" matching. */
  monthDay?: { month: number; day: number };
  /** Editorial headline — distinct from a literal restatement of the fact. */
  headline: string;
  headlineRo: string;
  place?: string;
  placeRo?: string;
  body: string;
  bodyRo: string;
}

/**
 * Every entry here is transcribed directly from material the user supplied
 * (the Episcopate's own "Historical Background" / "Canonical Status" text
 * and the St. George Cathedral parish page). Nothing is invented — dates,
 * names and facts not present in that source are simply not included. Where
 * a sentence adds context (e.g. Romanian immigration patterns), it stays
 * general and undocumented-specific rather than asserting a new fact about
 * the Episcopate itself.
 */
export const ROEA_TIMELINE: TimelineEvent[] = [
  {
    id: "1912-st-george-founded",
    year: 1912,
    headline: "A Parish Before There Was a Diocese",
    headlineRo: "O parohie înainte de a exista o eparhie",
    place: "Southfield, Michigan",
    placeRo: "Southfield, Michigan",
    body: "St. George is founded seventeen years before the Episcopate itself exists — one of the Romanian parishes already gathering in America at the turn of the century, long before there was any diocesan structure to belong to. It would later become part of the Romanian Orthodox Episcopate of America.",
    bodyRo: "Sf. Gheorghe se înființează cu șaptesprezece ani înainte ca Episcopia însăși să existe — una dintre parohiile românești deja adunate în America la începutul secolului, cu mult înainte să existe vreo structură eparhială din care să facă parte. Avea să devină, mai târziu, parte a Episcopiei Ortodoxe Române a Americii.",
  },
  {
    id: "1929-founding-congress",
    year: 1929,
    monthDay: { month: 4, day: 25 },
    headline: "A Diocese Takes Shape",
    headlineRo: "O eparhie prinde contur",
    place: "Detroit, Michigan",
    placeRo: "Detroit, Michigan",
    body: "By the late 1920s, Romanian Orthodox parishes had been gathering across the United States and Canada for a generation, each largely on its own. Over four days in Detroit — April 25 to 28, 1929 — a general Church Congress brought them under a single Diocese: the Romanian Orthodox Episcopate of America.",
    bodyRo: "Spre sfârșitul anilor 1920, parohiile ortodoxe române se adunau de o generație în Statele Unite și Canada, fiecare mai mult pe cont propriu. În patru zile la Detroit — 25 până la 28 aprilie 1929 — un Congres bisericesc general le-a adus sub o singură eparhie: Episcopia Ortodoxă Română a Americii.",
  },
  {
    id: "1936-solia",
    year: 1936,
    headline: "A Voice in Two Languages",
    headlineRo: "Un glas în două limbi",
    body: "SOLIA — The Herald begins publication, carrying news of the Episcopate to its parishes in Romanian and English alike. It has not stopped since.",
    bodyRo: "Începe publicarea revistei SOLIA, purtând veștile Episcopiei către parohiile sale, deopotrivă în română și engleză. Nu s-a oprit de atunci.",
  },
  {
    id: "1991-teoctist-letter",
    year: 1991,
    monthDay: { month: 5, day: 8 },
    headline: "A Letter from the Patriarch",
    headlineRo: "O scrisoare de la Patriarh",
    body: "Patriarch Teoctist writes to Bishop Nathaniel — one thread in the documented, ongoing relationship between the Romanian Orthodox Episcopate of America and the Church in Romania.",
    bodyRo: "Patriarhul Teoctist îi scrie Episcopului Nathaniel — un fir din relația documentată și continuă dintre Episcopia Ortodoxă Română a Americii și Biserica din România.",
  },
  {
    id: "1994-constitution",
    year: 1994,
    monthDay: { month: 7, day: 2 },
    headline: "Writing Down How It Governs Itself",
    headlineRo: "Se scrie felul în care se conduce",
    body: "On July 2, the Episcopate's National Church Congress adopts the Constitution and By-Laws still in force today — the framework its Church Congress and Episcopate Council, and every parish within them, govern by.",
    bodyRo: "La 2 iulie, Congresul Național Bisericesc al Episcopiei adoptă Constituția și Statutul, încă în vigoare astăzi — cadrul după care se conduc Congresul bisericesc, Consiliul Episcopiei și fiecare parohie din cuprinsul lor.",
  },
];

export interface HistoricParish {
  name: string;
  nameRo: string;
  founded: number;
  address: string;
  deanery: string;
  phone: string;
  email: string;
  clergy: { name: string; role: string; roleRo: string }[];
  body: string;
  bodyRo: string;
  directions: string;
}

export const ST_GEORGE_CATHEDRAL: HistoricParish = {
  name: "St. George Romanian Orthodox Cathedral",
  nameRo: "Catedrala Ortodoxă Română Sf. Gheorghe",
  founded: 1912,
  address: "18405 W 9 Mile Rd, Southfield, MI 48075-4033",
  deanery: "Michigan Deanery",
  phone: "248-569-4833",
  email: "chancery@roea.org",
  clergy: [
    { name: "Fr. George Cautiș", role: "Parish Priest", roleRo: "Preot paroh" },
    { name: "V. Rev. Protopresbyter Laurence Lazar", role: "Attached (Retired)", roleRo: "Atașat (pensionat)" },
    { name: "V. Rev. Dimitrie Vincent", role: "Attached (Retired)", roleRo: "Atașat (pensionat)" },
    { name: "Rev. Hierodeacon Benedict (Oancea)", role: "Attached", roleRo: "Atașat" },
  ],
  body: "More than a century old, St. George has outlasted the immigrant generation that founded it and gone on serving the ones that followed — a place of worship, formation, and plain community life for Orthodox faithful in the Southfield area.",
  bodyRo: "Cu o vechime de peste un secol, Sf. Gheorghe a supraviețuit generației de imigranți care a înființat-o și a continuat să slujească generațiilor care i-au urmat — un loc de închinare, de formare și de viață comunitară obișnuită pentru credincioșii ortodocși din zona Southfield.",
  directions:
    "From the South: On the Ohio Turnpike, use Toledo Exit 5 and go north on I-280 toward Detroit to I-75 North. At exit 41 (Lincoln Park) turn left (north) on Southfield Rd, which becomes Southfield Freeway (Rt 39). Exit at 8 Mile Rd and continue straight to the sign for 9 Mile Rd. Turn left (crossing freeway), then right to the light at 9 Mile Rd. Turn left, and the Cathedral is on the left.\n\nFrom the West: On I-94 East go to Southfield Freeway North (Rt 39). Exit at 8 Mile Rd, continue straight to the sign for 9 Mile Rd, turn left (crossing freeway), then right to the light at 9 Mile Rd. Turn left, and the Cathedral is on the left. Or from I-96 East take I-696 East to Lodge Freeway (Rt 10) South, exit at 9 Mile Rd, turn right at the light, and the Cathedral is on the left.\n\nFrom the North and East: On I-75, Michigan Rt 53 (Van Dyke), or I-94, take I-696 West to the Greenfield Rd exit. Turn left (south) on Greenfield to 9 Mile Rd, turn right (west); the Cathedral is on the left after the overpass.",
};

export function getOnThisDay(month: number, day: number): TimelineEvent[] {
  return ROEA_TIMELINE.filter((e) => e.monthDay && e.monthDay.month === month && e.monthDay.day === day);
}
