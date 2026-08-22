export interface ServiceScheduleEntry {
  id: string;
  /** e.g. "Sunday", "Saturday Evening" — editable per parish. */
  day: string;
  dayRo: string;
  service: string;
  serviceRo: string;
  time: string;
}

/**
 * Placeholder weekly liturgical schedule. Every parish keeps its own hours —
 * edit the entries below to match your parish's actual service times.
 */
export const WEEKLY_SCHEDULE: ServiceScheduleEntry[] = [
  {
    id: "sunday-matins",
    day: "Sunday",
    dayRo: "Duminică",
    service: "Matins",
    serviceRo: "Utrenie",
    time: "8:30 AM",
  },
  {
    id: "sunday-liturgy",
    day: "Sunday",
    dayRo: "Duminică",
    service: "Divine Liturgy",
    serviceRo: "Sfânta Liturghie",
    time: "10:00 AM",
  },
  {
    id: "saturday-vespers",
    day: "Saturday",
    dayRo: "Sâmbătă",
    service: "Great Vespers",
    serviceRo: "Vecernie",
    time: "6:00 PM",
  },
  {
    id: "wednesday-vespers",
    day: "Wednesday",
    dayRo: "Miercuri",
    service: "Vespers",
    serviceRo: "Vecernie",
    time: "6:30 PM",
  },
];

export interface FeastDayNotice {
  id: string;
  title: string;
  titleRo: string;
  note: string;
  noteRo: string;
}

/** Placeholder feast-day service notices — replace with your parish's actual calendar of additional services. */
export const FEAST_DAY_NOTICES: FeastDayNotice[] = [
  {
    id: "feast-vigil",
    title: "Feast Day Vigil",
    titleRo: "Priveghere la praznice",
    note: "A Vigil service is held on the eve of major feasts — check the parish calendar for dates.",
    noteRo: "O slujbă de priveghere se ține în ajunul marilor praznice — verificați calendarul parohiei pentru date.",
  },
  {
    id: "feast-liturgy",
    title: "Feast Day Liturgy",
    titleRo: "Liturghie de praznic",
    note: "The Divine Liturgy is celebrated on major feast days, in addition to the regular weekly schedule.",
    noteRo: "Sfânta Liturghie se săvârșește la marile praznice, în plus față de programul săptămânal obișnuit.",
  },
];
