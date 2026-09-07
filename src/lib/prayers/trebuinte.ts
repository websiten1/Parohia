import type { PrayerStep } from "./types";

/**
 * Rugăciuni pentru diferite trebuinţe — an index; each opens in a sheet.
 *
 * Note on one title: the section list calls this "Rugăciune pentru şcolari",
 * while the text's own heading reads "Rugăciune pentru elevi şi studenţi".
 * The heading from the text is used, unaltered.
 */
export const TREBUINTE_INTRO =
  "Dacă este nevoie şi dorinţă, la rugăciunile de dimineaţă şi de seară, înainte de a face sfârşitul acelora, credincioşii pot adăuga şi următoarele rugăciuni:";

export const TREBUINTE: PrayerStep[] = [
  {
    id: "inceputul-lucrului",
    title: "Rugăciune la începutul lucrului",
    paragraphs: [
      "Doamne Dumnezeul nostru, Care dintru început toate le-ai făcut spre a noastră bucurie şi desfătare, iar noi nemulţumitori fiind şi lipindu-ne mintea de cele zidite de Tine, am uitat de Însuşi Ziditorul tuturor. Pentru aceasta ne-ai rânduit ca prin multă osteneală să câştigăm darurile Tale, zicând prin David prorocul: „Ieşi-va omul la lucrul şi la munca sa până seara”. Asemenea şi prin gura fericitului Pavel ai zis: „Cel ce nu vrea să lucreze, nici să nu mănânce”, amintindu-ne că „Fără de Tine nu putem face nimic”. Aşadar, Doamne Dumnezeule, cu umilinţă alerg la bunătatea Ta: ajută-mi mie, păcătosului, cu harul Tău, să săvârşesc lucrul ce-l încep acum şi să-l sfârşesc cu bine, spre slava Ta: a Tatălui şi a Fiului şi a Sfântului Duh. Amin.",
    ],
  },
  {
    id: "sfarsitul-lucrului",
    title: "Rugăciune după sfârşitul lucrului",
    paragraphs: [
      "Doamne, Iisuse Hristoase, Cel ce eşti împlinirea tuturor lucrurilor celor bune, umple de bucurie şi de veselie sufletele noastre, primeşte mulţumirea noastră şi ne dăruieşte toate cele de folos sufletelor şi trupurilor noastre, că a Ta este împărăţia şi puterea şi slava, în veci. Amin.",
    ],
  },
  {
    id: "inainte-de-calatorie",
    title: "Rugăciune înainte de călătorie",
    paragraphs: [
      "Doamne, Iisuse Hristoase, Dumnezeul nostru, Cel ce eşti Calea, Adevărul şi Viaţa, şi ai călătorit împreună cu robul Tău Iosif şi cu cei doi ucenici care au mers la Emaus, Însuţi, Stăpâne, călătoreşte şi cu mine robul tău, binecuvântându-mi drumul. Trimite-mi şi mie înger păzitor ca lui Tobie, ca să-mi fie povăţuitor şi apărător şi să mă ferească nevătămat de toată întâmplarea cea rea. Şi, astfel, cu pace, sănătate şi bună sporire să mă întorc şi toată viaţa să proslăvesc preacinstitul şi de mare cuviinţă numele Tău: al Tatălui şi al Fiului şi al Sfântului Duh. Amin.",
    ],
  },
  {
    id: "elevi-si-studenti",
    title: "Rugăciune pentru elevi şi studenţi",
    paragraphs: [
      "Doamne, Iisuse Hristoase, Dumnezeul nostru, Cel ce Te-ai sălăşluit în inimile cele curate ale celor doisprezece Apostoli prin harul Preasfântului Duh, Care S-a coborât în chipul limbilor de foc şi a deschis gurile lor de au început a grăi în alte limbi, Însuţi, Doamne Iisuse Hristoase, Dumnezeul nostru, trimite acelaşi Duh Sfânt peste mine, robul Tău, luminează mintea mea şi sădeşte în urechile mele Sfânta Scriptură cea insuflată de Tine, precum şi toată învăţătura cea bună şi folositoare. Trimite în mintea şi inima mea duhul înţelepciunii, al ştiinţei, al evlaviei şi al fricii Tale, duhul cel bun care povăţuieşte pe calea cea dreaptă spre înţelegerea şi lucrarea a toată fapta cea bună, spre slava sfântului Tău nume, pentru rugăciunile Preacuratei Maicii Tale, ale înţelepţilor Tăi Apostoli şi ale tuturor sfinţilor. Că Tu eşti luminarea sufletelor şi a trupurilor noastre şi Ţie slavă şi mulţumire înălţăm, împreună şi Celui fără de început al Tău Părinte şi Preasfântului şi bunului şi de viaţă făcătorului Tău Duh, acum şi pururea şi în vecii vecilor. Amin.",
    ],
  },
  {
    id: "bolnavi",
    title: "Rugăciune pentru bolnavi",
    paragraphs: [
      "Stăpâne Atotţiitorule, Împărate Sfinte, Cel ce pedepseşti, dar nu omori, Care întăreşti pe cei neputincioşi şi ridici pe cei căzuţi, Cel ce vindeci bolile trupeşti ale oamenilor, rugămu-ne Ţie, Dumnezeul nostru: întru milostivirea Ta, cercetează pe robii Tăi (N) şi le iartă lor orice au greşit cu voie sau fără de voie; trimite din cer puterea Ta cea tămăduitoare, atinge-Te de trup, potoleşte-le fierbinţeala, uşurează-le suferinţele şi izgoneşte toată boala. Fii tămăduitor robilor Tăi, ridică-i pe dânşii din patul durerii şi din aşternutul chinuirii. Dăruieşte-i pe ei sănătoşi şi întregi Bisericii Tale ca să fie bineplăcuţi Ţie şi să facă voia Ta. Că Ţie se cuvine să ne miluieşti şi să ne mântuieşti pe noi, Dumnezeul nostru, şi Ţie slavă înălţăm, Tatălui şi Fiului şi Sfântului Duh, acum şi pururea şi în vecii vecilor. Amin.",
    ],
  },
  {
    id: "parintii-pentru-copii",
    title: "Rugăciunea părinţilor pentru copii",
    paragraphs: [
      "Doamne, Dumnezeul nostru, Cel ce cu înțelepciunea Ta ai zidit pe om şi, binecuvântându-l, ai zis: „Creșteți şi vă înmulțiți, şi umpleți pământul”, cu umilință mă rog ca neîncetat să reverși harul Tău şi să Te milostivești asupra copiilor mei, pe care mi i-ai dat ca dar dumnezeiesc. Umple-i pe ei de credinţă, înțelepciune şi pricepere. Îndreaptă pașii lor pe calea dreptății şi-i fereşte de toată ispita şi păcatul. Nu cer pentru ei, Doamne, bogații şi slavă omenească, ci te rog, dă-le sănătate trupului şi sufletului şi minte luminată pentru a face voia Ta ca să nu se depărteze niciodată de Biserica Ta cea sfântă şi pururi să binecuvânteze numele Tău. Amin.",
    ],
  },
  {
    id: "sotii-unul-pentru-altul",
    title: "Rugăciunea soţilor unul pentru altul",
    paragraphs: [
      "Doamne Iisuse Hristoase, Dumnezeul nostru, care ne-ai învăţat să ne rugam unul pentru altul, cer mila şi bunăvoința Ta asupra soţului meu (soţiei mele) şi-i dă lui (ei) sănătate şi înțelepciune ca să-şi îndeplinească toate îndatoririle după voia şi porunca Ta. Păzește-l (-o) de toate ispitele care ar putea să-i vină şi întăreşte-l (-o) în credinţa şi dragostea cea adevărată. Bunule Doamne, sfinţeşte căsnicia noastră şi depărtează de la noi neîncrederea, egoismul şi iuţimea. Binecuvântează-ne şi ne primeşte împreună în Împărăţia Ta, iar dacă ne este de folos, scapă-ne şi de greutăţile acestei vieţi. Căci Tu eşti Dumnezeul nostru şi Ţie slavă înălţăm: Tatălui şi Fiului şi Sfântului Duh, acum şi pururea şi în vecii vecilor. Amin.",
    ],
  },
  {
    id: "copiii-pentru-parinti",
    title: "Rugăciunea copiilor pentru părinți",
    paragraphs: [
      "Dumnezeule cel bun şi iubitor, care m-ai adus la viaţă şi la credinţă prin părinţii mei, primeşte mulţumirea şi rugăciunea mea pe care o aduc pentru ei. Dă-le lor sănătate şi bună-înţelegere, şi-i umple pe ei de bucurie şi de toate darurile cele cereşti şi pământeşti. Iar mie, Doamne, dă-mi putere şi înţelepciune ca să-mi iubesc părinţii şi să-i ascult întru toate, căci Tu ai poruncit: „Cinsteşte pe tatăl tău şi pe mama ta, ca să-ţi fie bine şi să trăieşti ani mulţi pe pământ”. Amin.",
    ],
  },
  {
    id: "frati-si-surori",
    title: "Rugăciune pentru frați şi surori",
    paragraphs: [
      "Doamne, Ţie mă rog pentru fraţii şi surorile mele. Dăruiește-le lor sănătate, înţelepciune, pace şi dragoste, ca să umble în căile Tale şi sa facă cele plăcute Ţie. Dă-ne, Doamne, să trăim în pace şi iubire şi să ne ajutăm unii pe alţii întru toate. Că milostiv şi iubitor de oameni eşti şi Ţie slavă înălțăm: Tatălui şi Fiului şi Sfântului Duh, acum şi pururea şi în vecii vecilor. Amin.",
    ],
  },
  {
    id: "cei-raposati",
    title: "Rugăciune pentru cei răposaţi",
    paragraphs: [
      "Pomeneşte, Doamne, pe cei ce întru nădejdea învierii şi a vieţii celei ce va să fie au adormit, părinţi şi fraţi ai noştri (N) şi pe toţi cei care întru dreapta credinţă s-au săvârşit, şi le iartă lor toate greşelile pe care le-au săvârşit cu cuvântul, cu fapta sau cu gândul. Aşază-i pe ei, Doamne, unde cercetarea feţei Tale veseleşte pe toţi sfinţii Tăi cei din veac. Dăruieşte-le lor şi nouă împărăţia Ta şi împărtăşirea bunătăţilor Tale celor negrăite şi veşnice şi desfătarea vieţii Tale celei nesfârşite şi fericite. Că Tu eşti învierea şi viaţa şi odihna celor adormiţi, Hristoase, Dumnezeul nostru şi Ţie slavă înălţăm, împreună şi Celui fără de început al Tău Părinte şi Preasfântului şi Bunului şi de viaţă făcătorului Tău Duh, acum şi pururea şi în vecii vecilor. Amin.",
    ],
  },
  {
    id: "parintele-duhovnicesc",
    title: "Rugăciune pentru părintele duhovnicesc",
    paragraphs: [
      "Doamne, Iisuse Hristoase, Fiul lui Dumnezeu, care ai primit rugăciunea desfrânatei şi suspinul tâlharului, primeşte şi rugăciunea mea, a păcătosului, ce o aduc Ţie pentru părintele meu duhovnicesc, preotul / ieromonahul (N), pe care Tu l-ai rânduit să poarte povara păcatelor mele în faţa Ta, precum şi Tu porţi povara întregii lumi în faţa Tatălui Ceresc.",
      "Iartă-i toate greşelile cele de voie şi fără de voie, vindecă-i toată boala şi întinăciunea trupească şi sufletească, cercetează-i neputinţele şi slăbiciunile, căci dintre oameni l-ai ales şi poartă aceeaşi fire ca şi mine. Izbăveşte-l de toţi vrăjmaşii văzuţi şi nevăzuţi şi de orice ispită. Sporeşte-i înţelepciunea, îndelunga-răbdare, liniştea, pacea şi bucuria. Înmulţeşte-i puterile, sporeşte-i blândeţea şi purtarea de grijă şi împlineşte toate cele de folos lui. Pune în inima şi în gura lui cuvintele Tale cele mântuitoare, umple-l de har, dă-i minte luminată şi pricepere sfântă. Bine sporeşte în el, Doamne, şi dăruieşte-l sănătos, îndelungat în zile, drept învăţând cuvântul adevărului Tău, pentru rugăciunile Preacuratei Maicii Tale şi ale tuturor Sfinţilor Tăi. Amin.",
    ],
  },
  {
    id: "staretii-de-la-optina",
    title: "Rugăciunea stareţilor de la Optina",
    paragraphs: [
      "Doamne, dă-mi să întâmpin cu linişte sufletească tot ce-mi va aduce ziua de azi. Doamne, dă-mi întru totul să mă supun voii Tale Sfinte.",
      "În tot ceasul acestei zile povăţuieşte-mă şi ajută-mă în toate. Toate câte le voi auzi şi mi se vor întâmpla în această zi, învaţă-mă să le primesc cu suflet liniştit şi cu credinţă tare, după sfântă voia Ta.",
      "În toate cuvintele şi faptele mele călăuzeşte-mi gândurile şi simţurile. În toate întâmplările neprevăzute, fă să nu uit că totul este trimis de către Tine.",
      "Doamne, învaţă-mă să mă port cu dreptate şi cu înţelepciune cu toţi fraţii mei, să nu tulbur şi să nu supăr pe nimeni.",
      "Doamne, dă-mi putere să duc povara zilei şi toate câte mi se vor întâmpla în această zi, cu pace în suflet.",
      "Doamne, călăuzeşte-mi voia mea şi învaţă-mă să mă rog, să cred, să nădăjduiesc, să rabd, să iert şi să iubesc. Amin.",
    ],
  },
];
