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
