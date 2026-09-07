import type { PrayerStep } from "./types";

export const CEASUL_PASCAL_INTRO =
  "SĂ SE ŞTIE că din Duminica Paştilor şi pănă la Duminica Tomii (adică toată Săptămâna Luminată), Miezonoptica, Ceasurile şi Pavecerniţa (şi chiar rugăciunile de dimineaţă şi de seară) se citesc așa:\n\nPentru rugăciunile sfinţilor părinţilor noştri, Doamne Iisuse Hristoase, Fiul lui Dumnezeu, miluieşte-ne pe noi. Amin.\n\nHristos a înviat din morţi, cu moartea pe moarte călcând şi celor din morminte viaţă dăruindu-le (de 3 ori).\n\nÎnvierea lui Hristos văzând, să ne închinăm Sfântului Domnului Iisus, Unuia Celui fără de păcat. Crucii Tale ne închinăm, Hristoase, şi Sfântă învierea Ta o lăudăm şi o slăvim; că Tu eşti Dumnezeul nostru, afară de Tine pe altul nu ştim, numele Tău numim. Veniţi, toţi credincioşii, să ne închinăm Sfintei învierii lui Hristos, că iată, a venit prin Cruce bucurie la toată lumea. Totdeauna binecuvântând pe Domnul, lăudăm învierea Lui, că răstignire răbdând pentru noi, cu moartea pe moarte a stricat (de trei ori).";

/** Rânduiala ceasului pascal. */
export const CEASUL_PASCAL: PrayerStep[] = [
  {
    id: "ipacoi",
    title: "Ipacoi, glasul al 4-lea :",
    paragraphs: [
      "Venind mai înainte de zori cele ce au fost cu Maria şi, găsind piatra răsturnată de pe mormânt, auzit-au de la înger: Pentru ce căutaţi printre morţi, ca pe un om, pe Cel ce este întru lumina cea pururea fiitoare? Vedeţi giulgiurile cele de îngropare! Alergaţi şi propovăduiţi că S-a sculat Domnul, omorând moartea, că este Fiul lui Dumnezeu, Cel ce mântuieşte neamul omenesc.",
    ],
  },
  {
    id: "condacul",
    title: "Condacul, glasul al 8-lea :",
    paragraphs: [
      "De Te-ai şi pogorât în mormînt, Cel ce eşti fără de moarte, dar puterea iadului ai zdrobit şi ai înviat ca un biruitor, Hristoase Dumnezeule, zicând femeilor mironosiţe: „Bucuraţi-vă!” şi Apostolilor Tăi pace dăruindu-le, Cel ce dai celor căzuţi înviere.",
    ],
  },
  {
    id: "tropare",
    title: "Şi aceste tropare, acelaşi glas :",
    paragraphs: [
      "În mormânt cu trupul, în iad cu sufletul ca un Dumnezeu, în rai cu tâlharul şi pe scaun ai fost, Hristoase, cu Tatăl şi cu Duhul, toate umplându-le, Cel ce eşti necuprins.",
      "Slavă...",
      "Ca un purtător de viaţă, ca un mai înfrumuseţat decât raiul, cu adevărat, şi mai luminat decât orice cămară împărătească s-a arătat, Hristoase, mormântul Tău, izvorul învierii noastre.",
      "Şi acum..., al Născătoarei de Dumnezeu:",
      "Ceea ce eşti locaş sfinţit dumnezeiesc al Celui Preaînalt, bucură-te, că prin tine s-a dat bucuria, Născătoare de Dumnezeu, celor ce strigă: Binecuvîntată eşti tu între femei, Stăpînă, ceea ce eşti cu totul fără-prihană.",
      "Doamne miluieşte (de 40 de ori), Slavă..., Şi acum..., Pe cea mai cinstită decât heruvimii...",
      "Pentru rugăciunile Sfinţilor Părinţilor noştri...",
    ],
  },
];
