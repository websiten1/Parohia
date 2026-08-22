import type {
  ClergyMember,
  EventItem,
  FastPeriod,
  LiturgicalDay,
  Parish,
  Prayer,
  PrayerCategory,
  Reading,
  ResourceItem,
  Saint,
  ServiceTime,
} from "./types";

export type Locale = "en" | "ro";

export const WEEKDAY_SHORT = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
export const WEEKDAY_SHORT_RO = ["DUM", "LUN", "MAR", "MIE", "JOI", "VIN", "SÂM"];
export const WEEKDAY_INITIAL = ["S", "M", "T", "W", "T", "F", "S"];
export const WEEKDAY_INITIAL_RO = ["D", "L", "M", "M", "J", "V", "S"];

/** The app's fixed reference "today" — matches the build spec's reference screens exactly. */
export const REFERENCE_DATE = "2025-05-15";

export function oldCalendarDate(civilDate: string): string {
  const d = new Date(civilDate + "T00:00:00");
  d.setDate(d.getDate() - 13);
  return d.toISOString().slice(0, 10);
}

export function weekdayOf(dateStr: string, locale: Locale = "en"): string {
  const d = new Date(dateStr + "T00:00:00");
  return locale === "ro" ? WEEKDAY_SHORT_RO[d.getDay()] : WEEKDAY_SHORT[d.getDay()];
}

export function formatLongDate(dateStr: string, locale: Locale = "en"): string {
  const d = new Date(dateStr + "T00:00:00");
  const tag = locale === "ro" ? "ro-RO" : "en-US";
  const formatted = d.toLocaleDateString(tag, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  return locale === "ro" ? formatted.charAt(0).toUpperCase() + formatted.slice(1) : formatted;
}

export function formatMediumDate(dateStr: string, locale: Locale = "en"): string {
  const d = new Date(dateStr + "T00:00:00");
  const tag = locale === "ro" ? "ro-RO" : "en-US";
  return d.toLocaleDateString(tag, { year: "numeric", month: "long", day: "numeric" });
}

/* ---------------------------------- Saints -------------------------------- */

export const SAINTS: Saint[] = [
  {
    id: "prophet-samuel",
    nameRo: "Sf. Proroc Samuel",
    nameEn: "Holy Prophet Samuel",
    feastDate: "2025-05-15",
    shortLife: "Last of the Judges of Israel and the prophet who anointed Saul and David as kings.",
    shortLifeRo: "Ultimul dintre judecătorii lui Israel și prorocul care i-a uns împărați pe Saul și pe David.",
    fullLife:
      "The Holy Prophet Samuel was the last of the Judges of Israel and the first of the great prophets. He was born in the city of Ramah to righteous parents, Elkanah and Hannah.\n\nFrom his youth he was dedicated to God and served in the Tabernacle under the guidance of the priest Eli. Samuel judged Israel with righteousness, anointed Saul as the first king, and later, after Saul's disobedience, anointed the young shepherd David in his place.",
    fullLifeRo:
      "Sfântul Proroc Samuel a fost ultimul dintre judecătorii lui Israel și primul dintre proorocii cei mari. El s-a născut în cetatea Rama, din părinți drepți, Elcana și Ana.\n\nDe mic a fost închinat lui Dumnezeu și a slujit în cortul întâlnirii, sub îndrumarea preotului Eli. Samuel a judecat pe Israel cu dreptate, l-a uns pe Saul ca prim rege, iar apoi, după neascultarea lui Saul, l-a uns pe tânărul păstor David în locul lui.",
    troparion:
      "Rejoicing in the Lord as one who followed His statutes, thou didst grow, O righteous one, being counted worthy of the gift of prophecy. Wherefore we honor thee, O divinely wise Samuel.",
    troparionRo:
      "Bucurându-te de Domnul ca unul ce ai urmat poruncilor Lui, ai crescut, drepte, învrednicindu-te de darul proorociei. Pentru aceasta te cinstim, de Dumnezeu înțelepțite Samuele.",
    kontakion:
      "Thou wast shown to be a divine vessel of prophecy, having been consecrated to the Lord even from the womb, O Samuel, glory of the prophets.",
    kontakionRo:
      "Vas dumnezeiesc al proorociei te-ai arătat, fiind închinat Domnului încă din pântece, Samuele, lauda proorocilor.",
    readings: ["reading-acts-6", "reading-john-4"],
  },
  {
    id: "sever-eliodor-teoharie",
    nameRo: "Sf. Mc. Sever, Eliodor și Teoharie",
    nameEn: "Holy Martyrs Sever, Heliodorus and Theoharis",
    feastDate: "2025-05-15",
    shortLife: "Martyrs commemorated together with the Prophet Samuel on May 15.",
    shortLifeRo: "Mucenici pomeniți împreună cu Prorocul Samuel, la 15 mai.",
    fullLife:
      "The Holy Martyrs Sever, Heliodorus and Theoharis contended for the Christian faith and were glorified by God through their steadfast confession even unto death. Their memory is kept together with the Holy Prophet Samuel in the calendar of the Church.",
    fullLifeRo:
      "Sfinții Mucenici Sever, Eliodor și Teoharie s-au nevoit pentru credința creștină și au fost proslăviți de Dumnezeu prin mărturisirea lor neclintită până la moarte. Pomenirea lor se ține împreună cu a Sfântului Proroc Samuel în calendarul Bisericii.",
    troparion: "Thy holy martyrs, O Lord, through their sufferings have received incorruptible crowns from Thee, our God.",
    troparionRo: "Sfinții Tăi Mucenici, Doamne, întru nevoința lor, cununile nestricăciunii au dobândit de la Tine, Dumnezeul nostru.",
    kontakion: "Having fought the good fight together, O Martyrs, ye received the crown of incorruption from the Master of all.",
    kontakionRo: "Împreună nevoindu-vă în lupta cea bună, Mucenicilor, cununa nestricăciunii ați primit de la Stăpânul tuturor.",
    readings: [],
  },
  {
    id: "jeremiah",
    nameRo: "Sf. Proroc Ieremia",
    nameEn: "Holy Prophet Jeremiah",
    feastDate: "2025-05-01",
    shortLife: "One of the four Major Prophets, author of the Book of Lamentations.",
    shortLifeRo: "Unul dintre cei patru Proroci Mari, autorul Cărții Plângerilor.",
    fullLife:
      "The Holy Prophet Jeremiah prophesied the destruction of Jerusalem and the Babylonian captivity, calling Israel to repentance amid great personal suffering and rejection by his own people.",
    fullLifeRo:
      "Sfântul Proroc Ieremia a proorocit dărâmarea Ierusalimului și robia babiloniană, chemând pe Israel la pocăință în mijlocul multor suferințe și al lepădării din partea propriului popor.",
    troparion: "We celebrate the memory of Thy prophet Jeremiah today, O Lord; through his intercessions save our souls.",
    troparionRo: "Pomenirea prorocului Tău Ieremia astăzi prăznuind, Doamne, printr-însul rugămu-ne Ție, mântuiește sufletele noastre.",
    kontakion: "Having been filled with divine grace, O Prophet, thou didst foretell the sufferings of the Just One.",
    kontakionRo: "Umplându-te de darul cel dumnezeiesc, proorocule, ai vestit mai înainte patimile Celui Drept.",
    readings: [],
  },
  {
    id: "athanasius-great",
    nameRo: "Sf. Atanasie cel Mare",
    nameEn: "St. Athanasius the Great",
    feastDate: "2025-05-02",
    shortLife: "Archbishop of Alexandria and defender of Orthodoxy against Arianism.",
    shortLifeRo: "Arhiepiscop al Alexandriei și apărător al Ortodoxiei împotriva arianismului.",
    fullLife:
      "St. Athanasius the Great, Archbishop of Alexandria, was the foremost defender of the Orthodox faith at the First Ecumenical Council against the Arian heresy, enduring repeated exile for the sake of the true confession of Christ's divinity.",
    fullLifeRo:
      "Sfântul Atanasie cel Mare, Arhiepiscopul Alexandriei, a fost cel dintâi apărător al credinței ortodoxe la Sinodul I Ecumenic împotriva ereziei ariene, îndurând exiluri repetate pentru mărturisirea cea adevărată a dumnezeirii lui Hristos.",
    troparion: "Pillar of Orthodoxy, supporting the Church with divine doctrines, O Hierarch Athanasius, thou didst confound Arius' error.",
    troparionRo: "Stâlp al Ortodoxiei, sprijinind Biserica cu învățături dumnezeiești, ierarhe Atanasie, ai risipit rătăcirea lui Arie.",
    kontakion: "The Church, filled with thy divine doctrines, has been adorned as with an ornament of gold, O Wise Athanasius.",
    kontakionRo: "Biserica, umplându-se de dumnezeieștile tale învățături, s-a împodobit ca de un veșmânt de aur, înțelepte Atanasie.",
    readings: [],
  },
  {
    id: "job-long-suffering",
    nameRo: "Sf. Drept Iov",
    nameEn: "Righteous Job the Long-suffering",
    feastDate: "2025-05-06",
    shortLife: "The righteous sufferer of the Old Testament, a model of patience and faith.",
    shortLifeRo: "Dreptul pătimitor al Vechiului Testament, model de răbdare și credință.",
    fullLife:
      "The Righteous Job endured the loss of his family, wealth and health, yet never cursed God, becoming the great scriptural icon of patient faith amid suffering.",
    fullLifeRo:
      "Dreptul Iov a îndurat pierderea familiei, a averii și a sănătății, dar nu a hulit niciodată pe Dumnezeu, devenind marele chip scripturistic al credinței răbdătoare în mijlocul suferinței.",
    troparion: "Having shown thyself righteous in all thy ways, thou wast tried like gold in the furnace of suffering, O Job.",
    troparionRo: "Arătându-te drept în toate căile tale, ai fost lămurit ca aurul în cuptorul suferinței, Iove.",
    kontakion: "My soul, having heard of the sufferings of Job, guard thyself from all boasting.",
    kontakionRo: "Suflete al meu, auzind de suferințele lui Iov, păzește-te de toată trufia.",
    readings: [],
  },
  {
    id: "constantine-helen",
    nameRo: "Sf. Constantin și Elena",
    nameEn: "Sts. Constantine and Helen, Equals-to-the-Apostles",
    feastDate: "2025-05-21",
    shortLife: "The Emperor who ended persecution of Christians and his mother who found the True Cross.",
    shortLifeRo: "Împăratul care a pus capăt prigoanei creștinilor și mama sa, care a aflat Sfânta Cruce.",
    fullLife:
      "St. Constantine the Great, first Christian Roman Emperor, ended the persecution of the Church through the Edict of Milan and convened the First Ecumenical Council. His mother, St. Helen, journeyed to Jerusalem and recovered the True Cross.",
    fullLifeRo:
      "Sfântul Constantin cel Mare, primul împărat roman creștin, a pus capăt prigoanei Bisericii prin Edictul de la Milan și a convocat Sinodul I Ecumenic. Mama sa, Sfânta Elena, a călătorit la Ierusalim și a aflat Sfânta Cruce.",
    troparion: "Having seen the image of the Cross in the heavens, and having received the call from above like Paul, thy Apostle among rulers, O Lord, committed the ruling city into Thy hand.",
    troparionRo: "Chipul Crucii pe cer văzându-l, și ca Pavel chemarea nu de la om luând-o, cel întocmai cu Apostolii, întru împărați, Doamne, cetatea stăpânirii tale în mâna Ta a pus-o.",
    kontakion: "Today Constantine and his mother Helen reveal the precious Cross.",
    kontakionRo: "Astăzi Constantin și maica sa Elena, Crucea cea de mare preț o arată lumii.",
    readings: [],
  },
  {
    id: "ascension",
    nameRo: "Înălțarea Domnului",
    nameEn: "Ascension of the Lord",
    feastDate: "2025-05-29",
    shortLife: "The Great Feast commemorating Christ's ascension into heaven forty days after Pascha.",
    shortLifeRo: "Praznicul Împărătesc ce prăznuiește înălțarea lui Hristos la cer, la patruzeci de zile după Paști.",
    fullLife:
      "Forty days after His Resurrection, our Lord Jesus Christ ascended bodily into heaven from the Mount of Olives in the presence of His disciples, promising the descent of the Holy Spirit and His own return in glory.",
    fullLifeRo:
      "La patruzeci de zile după Învierea Sa, Domnul nostru Iisus Hristos S-a înălțat cu trupul la cer de pe Muntele Măslinilor, în fața ucenicilor Săi, făgăduind pogorârea Duhului Sfânt și venirea Sa cea de-a doua întru slavă.",
    troparion: "Thou hast ascended in glory, O Christ our God, granting joy to Thy disciples by the promise of the Holy Spirit.",
    troparionRo: "Înălțatu-Te-ai întru slavă, Hristoase, Dumnezeul nostru, bucurie făcând ucenicilor cu făgăduința Sfântului Duh.",
    kontakion: "When Thou didst fulfill the dispensation for our sake, and unite earth to heaven, Thou didst ascend in glory, O Christ our God.",
    kontakionRo: "Plinind rânduiala cea pentru noi, și cele de pe pământ unindu-le cu cele cerești, Te-ai înălțat întru slavă, Hristoase, Dumnezeul nostru.",
    readings: [],
  },
];

export const FEAST_TITLE_RO: Record<string, string> = {
  "Holy Cross": "Sfânta Cruce",
  "Holy Myrrhbearing Women": "Sfintele Femei Mironosițe",
  "Great Martyr Irene": "Sfânta Mare Muceniță Irina",
  "Sign of the Precious Cross over Jerusalem": "Arătarea Cinstitei Cruci pe cer, la Ierusalim",
  "Holy Apostle and Evangelist John the Theologian": "Sfântul Apostol și Evanghelist Ioan Teologul",
  "Translation of the Relics of St. Nicholas": "Aducerea moaștelor Sfântului Nicolae",
  "Holy Apostle Simon the Zealot": "Sfântul Apostol Simon Zilotul",
  "Sunday of the Samaritan Woman": "Duminica Samarinencei",
  "St. Epiphanius of Cyprus": "Sfântul Epifanie al Ciprului",
  "Martyr Glykeria": "Sfânta Muceniță Glichiria",
  "Martyr Isidore of Chios": "Sfântul Mucenic Isidor din Chios",
  "St. Theodore the Sanctified": "Sfântul Teodor cel Sfințit",
  "Apostle Andronicus of the Seventy": "Sfântul Apostol Andronic, din cei 70",
  "Sunday of the Blind Man": "Duminica Orbului",
  "Hieromartyr Patrick of Prusa": "Sfântul Sfințit Mucenic Patrichie al Prusei",
  "Martyr Thallelaeus": "Sfântul Mucenic Talaleu",
  "Martyr Basiliscus of Comana": "Sfântul Mucenic Vasilisc de la Comana",
  "St. Michael the Confessor of Synnada": "Sfântul Mihail Mărturisitorul al Sinadei",
  "Venerable Symeon of the Wondrous Mountain": "Cuviosul Simeon de la Muntele Minunat",
  "Third Finding of the Head of St. John the Baptist": "A treia aflare a capului Sfântului Ioan Botezătorul",
  "Apostle Carpus of the Seventy": "Sfântul Apostol Carp, din cei 70",
  "Hieromartyr Therapon of Cyprus": "Sfântul Sfințit Mucenic Terapont al Ciprului",
  "Leave-taking of Pascha": "Odovania Praznicului Paștilor",
  "Ascension of the Lord": "Înălțarea Domnului",
  "Apodosis of the Ascension": "Odovania Înălțării",
  "Martyr Hermias of Comana": "Sfântul Mucenic Ermie de la Comana",
};

/* -------------------------------- Readings -------------------------------- */

export const READINGS: Reading[] = [
  {
    id: "reading-acts-6",
    type: "epistle",
    title: "Acts of the Apostles",
    book: "Acts",
    reference: "Acts 6:8-15; 7:1-5, 47-60",
    chapterLabel: "Chapter 6",
    duration: "06:35",
    audioUrl: "",
    translationSource: "King James Version (public domain)",
    textEn: [
      { verse: 8, text: "And Stephen, full of grace and power, did great wonders and signs among the people." },
      { verse: 9, text: "Then there arose certain of the synagogue, which is called the synagogue of the Libertines, and Cyrenians, and Alexandrians, and of them of Cilicia and of Asia, disputing with Stephen." },
      { verse: 10, text: "And they were not able to resist the wisdom and the Spirit by which he spoke." },
      { verse: 11, text: "Then they suborned men, which said, We have heard him speak blasphemous words against Moses, and against God." },
      { verse: 12, text: "And they stirred up the people, and the elders, and the scribes, and came upon him, and caught him, and brought him to the council." },
      { verse: 47, text: "But Solomon built him an house." },
      { verse: 48, text: "Howbeit the most High dwelleth not in temples made with hands; as saith the prophet," },
      { verse: 59, text: "And they stoned Stephen, calling upon God, and saying, Lord Jesus, receive my spirit." },
      { verse: 60, text: "And he kneeled down, and cried with a loud voice, Lord, lay not this sin to their charge. And when he had said this, he fell asleep." },
    ],
  },
  {
    id: "reading-john-4",
    type: "gospel",
    title: "Gospel of John",
    book: "John",
    reference: "John 4:46-54",
    chapterLabel: "Chapter 4",
    duration: "03:10",
    audioUrl: "",
    translationSource: "King James Version (public domain)",
    textEn: [
      { verse: 46, text: "So Jesus came again into Cana of Galilee, where he made the water wine. And there was a certain nobleman, whose son was sick at Capernaum." },
      { verse: 47, text: "When he heard that Jesus was come out of Judaea into Galilee, he went unto him, and besought him that he would come down, and heal his son: for he was at the point of death." },
      { verse: 48, text: "Then said Jesus unto him, Except ye see signs and wonders, ye will not believe." },
      { verse: 49, text: "The nobleman saith unto him, Sir, come down ere my child die." },
      { verse: 50, text: "Jesus saith unto him, Go thy way; thy son liveth. And the man believed the word that Jesus had spoken unto him, and he went his way." },
      { verse: 53, text: "So the father knew that it was at the same hour, in the which Jesus said unto him, Thy son liveth: and himself believed, and his whole house." },
      { verse: 54, text: "This is again the second miracle that Jesus did, when he was come out of Judaea into Galilee." },
    ],
  },
];

/* ------------------------------ Liturgical days ---------------------------- */

interface DaySeed {
  day: number;
  saints: string[];
  feasts: string[];
  isMajorFeast?: boolean;
}

const MAY_2025: DaySeed[] = [
  { day: 1, saints: ["jeremiah"], feasts: [] },
  { day: 2, saints: ["athanasius-great"], feasts: [] },
  { day: 3, saints: [], feasts: ["Holy Cross"] },
  { day: 4, saints: [], feasts: ["Holy Myrrhbearing Women"] },
  { day: 5, saints: [], feasts: ["Great Martyr Irene"] },
  { day: 6, saints: ["job-long-suffering"], feasts: [] },
  { day: 7, saints: [], feasts: ["Sign of the Precious Cross over Jerusalem"] },
  { day: 8, saints: [], feasts: ["Holy Apostle and Evangelist John the Theologian"] },
  { day: 9, saints: [], feasts: ["Translation of the Relics of St. Nicholas"] },
  { day: 10, saints: [], feasts: ["Holy Apostle Simon the Zealot"] },
  { day: 11, saints: [], feasts: ["Sunday of the Samaritan Woman"], isMajorFeast: true },
  { day: 12, saints: [], feasts: ["St. Epiphanius of Cyprus"] },
  { day: 13, saints: [], feasts: ["Martyr Glykeria"] },
  { day: 14, saints: [], feasts: ["Martyr Isidore of Chios"] },
  { day: 15, saints: ["prophet-samuel", "sever-eliodor-teoharie"], feasts: [] },
  { day: 16, saints: [], feasts: ["St. Theodore the Sanctified"] },
  { day: 17, saints: [], feasts: ["Apostle Andronicus of the Seventy"] },
  { day: 18, saints: [], feasts: ["Sunday of the Blind Man"], isMajorFeast: true },
  { day: 19, saints: [], feasts: ["Hieromartyr Patrick of Prusa"] },
  { day: 20, saints: [], feasts: ["Martyr Thallelaeus"] },
  { day: 21, saints: ["constantine-helen"], feasts: [] },
  { day: 22, saints: [], feasts: ["Martyr Basiliscus of Comana"] },
  { day: 23, saints: [], feasts: ["St. Michael the Confessor of Synnada"] },
  { day: 24, saints: [], feasts: ["Venerable Symeon of the Wondrous Mountain"] },
  { day: 25, saints: [], feasts: ["Third Finding of the Head of St. John the Baptist"] },
  { day: 26, saints: [], feasts: ["Apostle Carpus of the Seventy"] },
  { day: 27, saints: [], feasts: ["Hieromartyr Therapon of Cyprus"] },
  { day: 28, saints: [], feasts: ["Leave-taking of Pascha"] },
  { day: 29, saints: ["ascension"], feasts: ["Ascension of the Lord"], isMajorFeast: true },
  { day: 30, saints: [], feasts: ["Apodosis of the Ascension"] },
  { day: 31, saints: [], feasts: ["Martyr Hermias of Comana"] },
];

function toneForDay(day: number): number {
  if (day <= 3) return 1;
  if (day <= 10) return 2;
  if (day <= 17) return 3;
  if (day <= 24) return 4;
  return 5;
}

export const LITURGICAL_DAYS: LiturgicalDay[] = MAY_2025.map(({ day, saints, feasts, isMajorFeast }) => {
  const civilDate = `2025-05-${String(day).padStart(2, "0")}`;
  return {
    id: civilDate,
    civilDate,
    oldCalendarDate: oldCalendarDate(civilDate),
    tone: toneForDay(day),
    saints,
    feasts,
    isMajorFeast: Boolean(isMajorFeast),
    fastingStatus: "fast-free",
    epistle: "reading-acts-6",
    gospel: "reading-john-4",
    troparia: saints.map((id) => `troparion-${id}`),
    kontakia: saints.map((id) => `kontakion-${id}`),
    lastVerifiedAt: "2025-04-01",
  };
});

export function getLiturgicalDay(civilDate: string): LiturgicalDay | undefined {
  return LITURGICAL_DAYS.find((d) => d.civilDate === civilDate);
}

export function dayTitle(day: LiturgicalDay, locale: Locale = "en"): string {
  const saintNames = day.saints
    .map((id) => {
      const saint = SAINTS.find((s) => s.id === id);
      if (!saint) return undefined;
      return locale === "ro" ? saint.nameRo : saint.nameEn;
    })
    .filter(Boolean);
  if (saintNames.length > 0) return saintNames.join("; ");
  if (day.feasts.length > 0) {
    const feast = day.feasts[0];
    return locale === "ro" ? FEAST_TITLE_RO[feast] ?? feast : feast;
  }
  return locale === "ro" ? "Pomeniri zilnice" : "Daily commemorations";
}

/* --------------------------------- Prayers --------------------------------- */

export const PRAYER_CATEGORY_LABEL: Record<PrayerCategory, string> = {
  morning: "Morning",
  evening: "Evening",
  "divine-liturgy": "Divine Liturgy",
  akathists: "Akathists",
  paraklesis: "Paraklesis",
  "before-after-meals": "Before & After Meals",
  "different-needs": "Prayers for Different Needs",
};

export const PRAYERS: Prayer[] = [
  {
    id: "prayer-morning",
    category: "morning",
    titleRo: "Rugăciunile de dimineață",
    titleEn: "Morning",
    subtitle: "Morning Prayer Rule",
    subtitleRo: "Rânduiala rugăciunilor de dimineață",
    estimatedMinutes: 8,
    downloadable: true,
    text: [
      "O Heavenly King, Comforter, Spirit of Truth, Who art everywhere present and fillest all things, Treasury of blessings and Giver of life: come and abide in us, cleanse us from every stain, and save our souls, O Good One.",
      "Glory to God for all things. Having risen from sleep, I thank Thee, O Holy Trinity, for through Thy great goodness and patience Thou wast not angered with me, an idler and sinner.",
      "O Lord, grant that I may greet the coming day in peace, that in all things I may rely upon Thy holy will.",
    ],
    textRo: [
      "Împărate ceresc, Mângâietorule, Duhul adevărului, Care pretutindenea ești și toate le împlinești, Vistierul bunătăților și Dătătorule de viață, vino și Te sălășluiește întru noi și ne curățește pe noi de toată întinăciunea și mântuiește, Bunule, sufletele noastre.",
      "Slavă lui Dumnezeu pentru toate. Sculându-mă din somn, Îți mulțumesc, Preasfântă Treime, că pentru multă bunătatea Ta și pentru îndelunga răbdare, nu Te-ai mâniat pe mine, leneșul și păcătosul.",
      "Doamne, învrednicește-mă ca ziua aceasta ce vine s-o petrec în pace, ca în toate să mă încred voii Tale celei sfinte.",
    ],
  },
  {
    id: "prayer-evening",
    category: "evening",
    titleRo: "Rugăciunile de seară",
    titleEn: "Evening",
    subtitle: "Evening Prayer Rule",
    subtitleRo: "Rânduiala rugăciunilor de seară",
    estimatedMinutes: 10,
    downloadable: true,
    text: [
      "O Lord our God, if I have sinned in anything this day, in word, deed or thought, forgive me, for Thou art good and lovest mankind.",
      "Into Thy hands, O Lord Jesus Christ my God, I commend my spirit. Bless me, save me, and grant me eternal life.",
      "Vouchsafe, O Lord, to keep us this night without sin. Blessed art Thou, O Lord, God of our Fathers.",
    ],
    textRo: [
      "Doamne, Dumnezeul nostru, de am greșit întru ceva în ziua aceasta, cu cuvântul, cu lucrul sau cu gândul, iartă-mă, ca un bun și de oameni iubitor.",
      "În mâinile Tale, Doamne Iisuse Hristoase, Dumnezeul meu, îmi dau sufletul meu. Binecuvintează-mă, mântuiește-mă și dă-mi viața de veci.",
      "Învrednicește-ne, Doamne, în noaptea aceasta fără de păcat să ne păzim. Bine ești cuvântat, Doamne, Dumnezeul părinților noștri.",
    ],
  },
  {
    id: "prayer-divine-liturgy",
    category: "divine-liturgy",
    titleRo: "Sfânta Liturghie",
    titleEn: "Divine Liturgy",
    estimatedMinutes: 90,
    downloadable: false,
    text: [
      "The Divine Liturgy is the central act of Orthodox Christian worship, in which the faithful gather to hear the Word of God and to receive the Body and Blood of Christ in Holy Communion.",
      "Blessed is the Kingdom of the Father, and of the Son, and of the Holy Spirit, now and ever, and unto ages of ages.",
    ],
    textRo: [
      "Sfânta Liturghie este actul central al cultului creștin ortodox, în care credincioșii se adună pentru a asculta Cuvântul lui Dumnezeu și a primi Trupul și Sângele lui Hristos prin Sfânta Împărtășanie.",
      "Binecuvântată este Împărăția Tatălui și a Fiului și a Sfântului Duh, acum și pururea și în vecii vecilor.",
    ],
  },
  {
    id: "prayer-akathists",
    category: "akathists",
    titleRo: "Acatiste",
    titleEn: "Akathists",
    estimatedMinutes: 45,
    downloadable: true,
    text: [
      "The Akathist Hymn 'Chosen Champion Leader' is chanted in praise of the Theotokos in 24 stanzas of alternating Kontakia and Oikoi, standing throughout as an act of vigilance and joy.",
      "Rejoice, thou through whom joy shall shine forth; rejoice, thou through whom the curse shall cease.",
    ],
    textRo: [
      "Acatistul „Apărătoare Doamnă” se cântă spre lauda Născătoarei de Dumnezeu, în 24 de strofe de condace și icoase alternate, stând în picioare ca semn al privegherii și al bucuriei.",
      "Bucură-te, prin care va străluci bucuria; bucură-te, prin care va înceta blestemul.",
    ],
  },
  {
    id: "prayer-paraklesis",
    category: "paraklesis",
    titleRo: "Paraclisul",
    titleEn: "Paraklesis",
    estimatedMinutes: 25,
    downloadable: true,
    text: [
      "The Small Paraklesis is a service of supplication to the Most Holy Theotokos, especially beloved during the Dormition Fast, entreating her swift intercession in every affliction and need.",
      "Many afflictions rise up against me, and, seeking help, O Virgin, I flee unto thee.",
    ],
    textRo: [
      "Paraclisul cel Mic este o slujbă de rugăciune către Preasfânta Născătoare de Dumnezeu, îndrăgită mai ales în timpul Postului Adormirii Maicii Domnului, cerând grabnica ei mijlocire în orice necaz și nevoie.",
      "Multe necazuri s-au ridicat asupra mea și, căutând ajutor, la tine alerg, Fecioară.",
    ],
  },
  {
    id: "prayer-before-after-meals",
    category: "before-after-meals",
    titleRo: "Înainte și după masă",
    titleEn: "Before & After Meals",
    estimatedMinutes: 2,
    downloadable: false,
    text: [
      "Before: The eyes of all wait upon Thee, O Lord, and Thou givest them their meat in due season. Thou openest Thine hand and satisfiest the desire of every living thing.",
      "After: We thank Thee, O Christ our God, that Thou hast satisfied us with Thy earthly gifts; deprive us not of Thy heavenly Kingdom.",
    ],
    textRo: [
      "Înainte de masă: Ochii tuturor spre Tine nădăjduiesc, Doamne, și Tu le dai lor hrană la bună vreme. Deschizi Tu mâna Ta și saturi pe toate viețuitoarele de bunăvoința Ta.",
      "După masă: Bine este cuvântat Dumnezeu, Cel ce ne miluiește pe noi și ne hrănește pe noi din darurile Sale cele bogate, cu harul și cu iubirea Sa de oameni, totdeauna, acum și pururea și în vecii vecilor.",
    ],
  },
  {
    id: "prayer-different-needs",
    category: "different-needs",
    titleRo: "Rugăciuni pentru diferite trebuințe",
    titleEn: "Prayers for Different Needs",
    estimatedMinutes: 5,
    downloadable: true,
    text: [
      "The Lord is my shepherd; I shall not want. He maketh me to lie down in green pastures: He leadeth me beside the still waters. He restoreth my soul.",
      "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for Thou art with me.",
    ],
    textRo: [
      "Domnul mă paște și nimic nu-mi va lipsi. La loc de pășune, acolo m-a sălășluit; la apa odihnei m-a hrănit, sufletul meu l-a întors.",
      "Chiar de aș umbla prin mijlocul umbrei morții, nu mă voi teme de rele, că Tu cu mine ești.",
    ],
  },
];

/* --------------------------------- Fasting ---------------------------------- */

export const FASTS: FastPeriod[] = [
  {
    id: "apostles-fast",
    title: "Apostles' Fast",
    titleRo: "Postul Sfinților Apostoli",
    startDate: "2026-06-08",
    endDate: "2026-06-28",
    description: "A fast in preparation for the Feast of Ss. Peter and Paul, of variable length beginning the Monday after All Saints Sunday.",
    descriptionRo: "Un post de pregătire pentru praznicul Sfinților Apostoli Petru și Pavel, de lungime variabilă, începând lunea de după Duminica Tuturor Sfinților.",
    permittedFoods: "Fish, wine and oil are permitted on most days; strict fasting on Wednesdays and Fridays.",
    permittedFoodsRo: "Peștele, vinul și untdelemnul sunt îngăduite în majoritatea zilelor; post aspru miercurea și vinerea.",
    liturgicalContext: "Concludes with the Feast of the Holy Apostles Peter and Paul on June 29.",
    liturgicalContextRo: "Se încheie cu praznicul Sfinților Apostoli Petru și Pavel, la 29 iunie.",
  },
  {
    id: "dormition-fast",
    title: "Dormition Fast",
    titleRo: "Postul Adormirii Maicii Domnului",
    startDate: "2026-08-01",
    endDate: "2026-08-14",
    description: "A strict two-week fast in preparation for the Dormition of the Most Holy Theotokos.",
    descriptionRo: "Un post aspru de două săptămâni, de pregătire pentru Adormirea Preasfintei Născătoare de Dumnezeu.",
    permittedFoods: "Fish is permitted only on the Feast of the Transfiguration (August 6); otherwise wine and oil on weekends.",
    permittedFoodsRo: "Peștele este îngăduit doar de praznicul Schimbării la Față (6 august); altfel, vin și untdelemn sâmbăta și duminica.",
    liturgicalContext: "Concludes with the Feast of the Dormition of the Theotokos on August 15.",
    liturgicalContextRo: "Se încheie cu praznicul Adormirii Maicii Domnului, la 15 august.",
  },
  {
    id: "nativity-fast",
    title: "Nativity Fast",
    titleRo: "Postul Nașterii Domnului (Postul Crăciunului)",
    startDate: "2026-11-15",
    endDate: "2026-12-24",
    description: "A forty-day fast in preparation for the Nativity of Christ, moderate in the early weeks and stricter as the feast approaches.",
    descriptionRo: "Un post de patruzeci de zile, de pregătire pentru Nașterea Domnului, mai blând în primele săptămâni și mai aspru pe măsură ce se apropie praznicul.",
    permittedFoods: "Fish permitted on most days until December 20; wine and oil on weekends.",
    permittedFoodsRo: "Peștele este îngăduit în majoritatea zilelor până la 20 decembrie; vin și untdelemn sâmbăta și duminica.",
    liturgicalContext: "Concludes with the Feast of the Nativity of Christ on December 25.",
    liturgicalContextRo: "Se încheie cu praznicul Nașterii Domnului, la 25 decembrie.",
  },
  {
    id: "great-lent",
    title: "Great Lent",
    titleRo: "Postul Mare",
    startDate: "2026-02-23",
    endDate: "2026-04-11",
    description: "The forty-day fast preceding Holy Week and Pascha, the strictest fasting period of the liturgical year.",
    descriptionRo: "Postul de patruzeci de zile ce precede Săptămâna Patimilor și Sfintele Paști, cea mai aspră perioadă de post din anul liturgic.",
    permittedFoods: "Wine and oil on weekends; strict abstinence from meat, dairy and fish on weekdays.",
    permittedFoodsRo: "Vin și untdelemn sâmbăta și duminica; abstinență strictă de la carne, lactate și pește în zilele lucrătoare.",
    liturgicalContext: "Concludes with Holy Week and the Feast of Feasts, Pascha.",
    liturgicalContextRo: "Se încheie cu Săptămâna Patimilor și Praznicul Praznicelor, Sfintele Paști.",
  },
];

export const CURRENT_FAST_LABEL = "Fast Free";
export const CURRENT_FAST_LABEL_RO = "Fără post";
export const CURRENT_FAST_EXPLANATION = "Today is a fast-free day. You may eat any kind of food.";
export const CURRENT_FAST_EXPLANATION_RO = "Astăzi este o zi fără post. Poți mânca orice fel de mâncare.";

/* -------------------------------- Resources --------------------------------- */

export const RESOURCE_ITEMS: ResourceItem[] = [
  {
    id: "res-fathers-1",
    category: "church-fathers",
    title: "St. John Chrysostom — On the Priesthood",
    titleRo: "Sfântul Ioan Gură de Aur — Despre preoție",
    subtitle: "Homilies & letters",
    subtitleRo: "Omilii și epistole",
    contentType: "article",
    attribution: "Public domain translation",
    attributionRo: "Traducere din domeniul public",
    body: [
      "St. John Chrysostom's On the Priesthood remains one of the most searching examinations of pastoral responsibility ever written, composed in the form of a dialogue defending his own flight from ordination.",
      "He writes with unflinching honesty about the dangers of pride, the weight of teaching authority, and the purity of heart required to stand at the altar.",
    ],
    bodyRo: [
      "Despre preoție a Sfântului Ioan Gură de Aur rămâne una dintre cele mai pătrunzătoare cercetări ale răspunderii pastorale scrise vreodată, alcătuită sub forma unui dialog care își apără propria fugă de la hirotonie.",
      "El scrie cu o sinceritate neclintită despre primejdiile mândriei, greutatea autorității de a învăța și curăția inimii cerută celui ce stă la altar.",
    ],
  },
  {
    id: "res-fathers-2",
    category: "church-fathers",
    title: "St. Basil the Great — On the Holy Spirit",
    titleRo: "Sfântul Vasile cel Mare — Despre Duhul Sfânt",
    subtitle: "Theological treatise",
    subtitleRo: "Tratat teologic",
    contentType: "article",
    attribution: "Public domain translation",
    attributionRo: "Traducere din domeniul public",
    body: [
      "Written to defend the full divinity of the Holy Spirit against the pneumatomachian heresy, St. Basil's treatise carefully traces the Spirit's work through Scripture and liturgical doxology.",
    ],
    bodyRo: [
      "Scris pentru a apăra deplina dumnezeire a Duhului Sfânt împotriva ereziei pnevmatomahilor, tratatul Sfântului Vasile urmărește cu grijă lucrarea Duhului prin Scriptură și prin doxologia liturgică.",
    ],
  },
  {
    id: "res-articles-1",
    category: "articles",
    title: "Understanding the Divine Liturgy",
    titleRo: "Înțelegerea Sfintei Liturghii",
    subtitle: "12 min read",
    subtitleRo: "Citire de 12 minute",
    contentType: "article",
    attribution: "Episcopate editorial staff",
    attributionRo: "Echipa editorială a Episcopiei",
    body: [
      "The Divine Liturgy unfolds in three movements — the Liturgy of Preparation, the Liturgy of the Word, and the Liturgy of the Faithful — each carrying the assembly deeper into the mystery of Christ's self-offering.",
      "Understanding this structure transforms the experience of worship from passive attendance into conscious participation in the Church's oldest continuous act of prayer.",
    ],
    bodyRo: [
      "Sfânta Liturghie se desfășoară în trei părți — Proscomidia, Liturghia Cuvântului și Liturghia Credincioșilor — fiecare purtând adunarea mai adânc în taina jertfirii de Sine a lui Hristos.",
      "Înțelegerea acestei structuri transformă experiența închinării dintr-o prezență pasivă într-o participare conștientă la cel mai vechi act de rugăciune neîntreruptă al Bisericii.",
    ],
  },
  {
    id: "res-articles-2",
    category: "articles",
    title: "Why Do We Fast?",
    titleRo: "De ce postim?",
    subtitle: "8 min read",
    subtitleRo: "Citire de 8 minute",
    contentType: "article",
    attribution: "Episcopate editorial staff",
    attributionRo: "Echipa editorială a Episcopiei",
    body: [
      "Fasting in the Orthodox tradition is never mere dietary restriction; it is a disciplined return of the body to its proper obedience, freeing attention for prayer and almsgiving.",
    ],
    bodyRo: [
      "Postul, în tradiția ortodoxă, nu este niciodată o simplă restricție alimentară; este o întoarcere disciplinată a trupului la ascultarea sa firească, eliberând atenția pentru rugăciune și milostenie.",
    ],
  },
  {
    id: "res-videos-1",
    category: "videos",
    title: "Introduction to Orthodox Christianity",
    titleRo: "Introducere în creștinismul ortodox",
    subtitle: "24 min",
    subtitleRo: "24 min",
    contentType: "video",
    durationLabel: "24:00",
    attribution: "Episcopate media ministry",
    attributionRo: "Departamentul media al Episcopiei",
  },
  {
    id: "res-videos-2",
    category: "videos",
    title: "A Tour of the Divine Liturgy",
    titleRo: "O incursiune în Sfânta Liturghie",
    subtitle: "18 min",
    contentType: "video",
    durationLabel: "18:00",
    attribution: "Episcopate media ministry",
    attributionRo: "Departamentul media al Episcopiei",
  },
];

/* -------------------------------- Parishes ----------------------------------- */

const SUNDAY_SCHEDULE: ServiceTime[] = [
  { label: "Matins", time: "9:00 AM" },
  { label: "Divine Liturgy", time: "10:00 AM" },
];

const ST_MARY_CLERGY: ClergyMember[] = [{ name: "Fr. Michael Popescu", role: "Parish Priest", roleRo: "Preot paroh" }];

export const PARISHES: Parish[] = [
  {
    id: "st-mary-colleyville",
    name: "St. Mary Romanian Orthodox Church",
    city: "Colleyville",
    state: "Texas",
    address: "6100 Precinct Line Rd",
    latitude: 32.8801,
    longitude: -97.1547,
    distanceMi: 2.1,
    phone: "(817) 555-0142",
    email: "office@stmarycolleyville.org",
    website: "stmarycolleyville.org",
    clergy: ST_MARY_CLERGY,
    schedule: SUNDAY_SCHEDULE,
    verifiedAt: "2025-04-01",
  },
  {
    id: "st-nicholas-irving",
    name: "St. Nicholas Romanian Orthodox Church",
    city: "Irving",
    state: "Texas",
    address: "2200 W Airport Fwy",
    latitude: 32.868,
    longitude: -96.9614,
    distanceMi: 5.4,
    phone: "(972) 555-0198",
    email: "office@stnicholasirving.org",
    website: "stnicholasirving.org",
    clergy: [{ name: "Fr. Ioan Constantinescu", role: "Parish Priest", roleRo: "Preot paroh" }],
    schedule: SUNDAY_SCHEDULE,
    verifiedAt: "2025-03-18",
  },
  {
    id: "st-george-houston",
    name: "St. George Romanian Orthodox Church",
    city: "Houston",
    state: "Texas",
    address: "9600 S Gessner Rd",
    latitude: 29.6752,
    longitude: -95.5468,
    distanceMi: 12.8,
    phone: "(713) 555-0176",
    email: "office@stgeorgehouston.org",
    website: "stgeorgehouston.org",
    clergy: [{ name: "Fr. Alexandru Marin", role: "Parish Priest", roleRo: "Preot paroh" }],
    schedule: SUNDAY_SCHEDULE,
    verifiedAt: "2025-02-27",
  },
];

/* --------------------------------- Events ------------------------------------ */

export const EVENTS: EventItem[] = [
  {
    id: "youth-retreat",
    title: "Romanian Orthodox Youth Retreat",
    titleRo: "Retragere pentru tineret ortodox român",
    category: "youth",
    description:
      "A weekend retreat for Orthodox youth featuring talks, discussion groups, services and fellowship, hosted in the Dallas area.",
    descriptionRo:
      "O retragere de weekend pentru tinerii ortodocși, cu conferințe, grupuri de discuții, slujbe și părtășie, găzduită în zona Dallas.",
    startDate: "2026-10-23",
    endDate: "2026-10-25",
    location: "Dallas, Texas",
    status: "upcoming",
  },
  {
    id: "diocesan-assembly",
    title: "Diocesan Assembly",
    titleRo: "Adunarea Eparhială",
    category: "diocesan",
    description: "The annual Diocesan Assembly bringing together clergy and lay delegates from across the Episcopate.",
    descriptionRo: "Adunarea Eparhială anuală, care reunește clerici și delegați mireni din întreaga Episcopie.",
    startDate: "2026-11-15",
    endDate: "2026-11-15",
    location: "Chicago, IL",
    status: "upcoming",
  },
];
