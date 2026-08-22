export type FastingStatus = "fast-free" | "strict-fast" | "fast" | "fast-fish" | "fast-wine-oil";

export interface LiturgicalDay {
  id: string;
  civilDate: string; // ISO yyyy-mm-dd
  oldCalendarDate: string;
  tone: number;
  saints: string[]; // Saint ids
  feasts: string[]; // feast titles
  isMajorFeast: boolean;
  fastingStatus: FastingStatus;
  epistle: string; // Reading id
  gospel: string; // Reading id
  troparia: string[];
  kontakia: string[];
  heroImage?: string;
  lastVerifiedAt: string;
}

export interface Saint {
  id: string;
  nameRo: string;
  nameEn: string;
  feastDate: string;
  iconAsset?: string;
  shortLife: string;
  shortLifeRo?: string;
  fullLife: string;
  fullLifeRo?: string;
  troparion: string;
  troparionRo?: string;
  kontakion: string;
  kontakionRo?: string;
  readings: string[];
}

export type ReadingType = "epistle" | "gospel";

export interface Reading {
  id: string;
  type: ReadingType;
  title: string;
  book: string;
  reference: string;
  chapterLabel: string;
  textEn: ReadingVerse[];
  audioUrl?: string;
  duration: string;
  translationSource: string;
}

export interface ReadingVerse {
  verse: number;
  text: string;
}

export type PrayerCategory =
  | "morning"
  | "evening"
  | "divine-liturgy"
  | "akathists"
  | "paraklesis"
  | "before-after-meals"
  | "different-needs";

export interface Prayer {
  id: string;
  category: PrayerCategory;
  titleRo: string;
  titleEn: string;
  subtitle?: string;
  subtitleRo?: string;
  text: string[];
  textRo?: string[];
  audioUrl?: string;
  estimatedMinutes: number;
  downloadable: boolean;
}

export interface FastPeriod {
  id: string;
  title: string;
  titleRo?: string;
  startDate: string;
  endDate: string;
  description: string;
  descriptionRo?: string;
  permittedFoods: string;
  permittedFoodsRo?: string;
  liturgicalContext: string;
  liturgicalContextRo?: string;
}

export interface ClergyMember {
  name: string;
  role: string;
  roleRo?: string;
}

export interface ServiceTime {
  label: string;
  time: string;
}

export interface Parish {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  latitude: number;
  longitude: number;
  distanceMi?: number;
  phone: string;
  email: string;
  website: string;
  clergy: ClergyMember[];
  schedule: ServiceTime[];
  photo?: string;
  verifiedAt: string;
}

export type EventCategory = "youth" | "clergy" | "diocesan" | "parish";
export type EventStatus = "upcoming" | "past";

export interface EventItem {
  id: string;
  title: string;
  titleRo?: string;
  category: EventCategory;
  description: string;
  descriptionRo?: string;
  startDate: string;
  endDate: string;
  location: string;
  photo?: string;
  registrationUrl?: string;
  status: EventStatus;
}

export type ResourceCategoryId = "church-fathers" | "videos" | "articles";

export interface ResourceItem {
  id: string;
  category: ResourceCategoryId;
  title: string;
  titleRo?: string;
  subtitle: string;
  subtitleRo?: string;
  contentType: "article" | "video";
  photo?: string;
  body?: string[];
  bodyRo?: string[];
  durationLabel?: string;
  attribution: string;
  attributionRo?: string;
}

export interface Bookmark {
  id: string;
  entityType: "saint" | "reading" | "prayer" | "event" | "parish" | "resource";
  entityId: string;
  title: string;
  subtitle?: string;
  createdAt: string;
}

export interface NoteEntry {
  id: string;
  entityType: "reading" | "prayer" | "saint";
  entityId: string;
  anchor: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}
