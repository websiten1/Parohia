import type { PrayerStep } from "./types";

export const CANON_POCAINTA_INTRO = "Alcătuire a Sfântului Teodor Studitul";

/**
 * Canon de pocăinţă către Domnul nostru Iisus Hristos.
 *
 * The stih "Miluieşte-mă, Dumnezeule, miluieşte-mă." is said before the first
 * and second troparion of each ode, after the Irmos — as the book states once
 * at the opening, so it is kept there rather than repeated into every ode.
 */
export const CANON_POCAINTA: PrayerStep[] = [
  {
    id: "cantarea-1",
    title: "Cântarea întâi, glasul al 6-lea",
    rubric:
      "Irmos: Ajutor şi acoperitor S-a făcut mie spre mântuire. Acesta este Dumnezeul meu şi-L voi preaslăvi pe El, Dumnezeul părinţilor noştri şi-L voi înălţa pe El, căci cu slavă S-a preaslăvit.",
    paragraphs: [
      "Stih: Miluieşte-mă, Dumnezeule, miluieşte-mă. (înainte de primul şi al doilea tropar al fiecărei cântări, după Irmos)",
      "Mă cutremur cugetând la ziua cea înfricoşătoare şi negrăită a venirii Tale şi cu frică mai înainte o văd; ziua în care vei şedea să judeci pe cei vii şi pe cei morţi, Dumnezeul meu, Atotputernice.",
      "Glasul Tău cel dorit, care va chema la bucurie pe sfinţii Tăi, să-l aud şi eu, ticălosul, şi să aflu nespusa desfătare a Împărăţiei cereşti.",
      "Slavă...",
      "Să nu intri cu mine la judecată, vădind faptele, cuvintele şi gândurile mele cele rele. Ci cu îndurările Tale, trecând cu vederea răutăţile mele, mântuieşte-mă, Atotputernice.",
      "Şi acum..., a Născătoarei:",
      "Roagă-te, Maică Fecioară, către Milostivul Dumnezeu, pentru noi păcătoşii, care greşim în tot ceasul, ca să ne fie nouă milostiv în ziua judecăţii.",
    ],
  },
  {
    id: "cantarea-3",
    title: "Cântarea a treia",
    rubric:
      "Irmos: Întăreşte, Doamne, pe piatra mărturisirii Tale, inima mea care se clatină, că Singur eşti Sfânt şi Domn.",
    paragraphs: [
      "Miluieşte-mă, Doamne, miluieşte-mă, strig Ţie, când vei veni cu îngerii Tăi, să răsplăteşti tuturor după vrednicia faptelor.",
      "Întoarce-te, suspină, ticăloase suflete, înainte de a lua sfârşit priveliştea acestei vieţi, când va închide Domnul uşa cămării.",
      "Slavă...",
      "Păcătuit-am, Doamne, ca nimeni altul, întrecând pe toţi cu greşelile; dar mai înainte de judecată fii mie milostiv, Iubitorule de oameni.",
      "Şi acum..., a Născătoarei:",
      "Odrăslit-ai, Preacurată, cu naştere fără de sămânţă, pe Cuvântul cel viu, Care S-a întrupat fără schimbare în pântecele tău. Slavă naşterii tale, Maica lui Dumnezeu.",
    ],
  },
  {
    id: "sedealna",
    title: "Şezânda (Sedealna)",
    paragraphs: [
      "Gândesc la ziua cea înfricoşătoare şi plâng de faptele mele cele viclene; cum voi răspunde Împăratului celui nemuritor? Şi cu ce îndrăzneală mă voi uita la Judecătorul, eu dezmierdatul? Milostive Părinte, Fiule Unule-Născut şi Duhule Sfinte, miluieşte-mă.",
      "Slavă...",
      "În valea plângerii, în locul ce ai rânduit, Milostive, când vei şedea să faci judecată dreaptă, să nu vădeşti cele ascunse ale mele, nici să mă ruşinezi înaintea îngerilor; ci Te milostiveşte, Dumnezeule, şi mă miluieşte.",
      "Şi acum..., a Născătoarei:",
      "Nădejdea cea bună a lumii, Născătoare de Dumnezeu Fecioară, al tău ajutor îl cer; milostiveşte-te spre poporul cel ce lesne se primejduieşte, roagă pe milostivul Dumnezeu, să izbăvească sufletele noastre de toată certarea, ceea ce eşti una binecuvântată.",
    ],
  },
  {
    id: "cantarea-4",
    title: "Cântarea a patra",
    rubric:
      "Irmos: Auzit-a prorocul de venirea Ta, Doamne, şi s-a cutremurat, că vrei să te naşti din Fecioară şi să te arăţi oamenilor, şi a zis: am auzit glasul Tău şi m-am temut. Slavă puterii Tale, Doamne!",
    paragraphs: [
      "Sosit-a Ziua, iată înaintea uşilor este judecata; suflete, priveghează! Aici se vor aduna împreună conducătorii cu supuşii şi bogaţii cu săracii, luând fiecare om după vrednicia faptelor.",
      "Când vei despărţi pe păcătoşi de cei drepţi, judecând lumea, rânduieşte-mă a fi una dintre oile Tale, alegându-mă dintre capre, Iubitorule de oameni, ca să aud glasul Tău cel binecuvântat.",
      "Slavă...",
      "Auzind cuvintele cele cu plângere ale bogatului în văpaia chinurilor, plâng eu ticălosul şi mă tânguiesc în aceeaşi osândă fiind, dar mă rog: Miluieşte-mă, Mântuitorul lumii, în vremea judecăţii.",
      "Şi acum..., a Născătoarei:",
      "Fecioară, prunc născând şi curăţia păzind, tu cinstită te-ai arătat, născând pe Dumnezeu şi Omul; minunea ta, Fecioară Maică, spăimântează tot auzul şi cugetul.",
    ],
  },
  {
    id: "cantarea-5",
    title: "Cântarea a cincea",
    rubric:
      "Irmos: Pe mine, cel ce dis-de-dimineaţă mă rog, Iubitorule de oameni, Te rog, luminează-mă şi mă îndreptează întru poruncile Tale şi mă învaţă, Mântuitorule, să fac voia Ta.",
    paragraphs: [
      "Iartă-mă, Doamne, pe mine robul Tău şi să nu mă dai chinurilor celor amare şi demonilor celor cumpliţi, între care nu se poate afla odihnă.",
      "Slăbeşte, lasă şi iartă-mi, Doamne, toate câte Ţi-am greşit Ţie şi să nu mă trimiţi în osânda focului şi a ruşinii celei fără de sfârşit.",
      "Slavă...",
      "Fie-Ţi milă, Doamne, de zidirea Ta; greşit-am Ţie, iartă-mă; că numai Tu din fire ești curat și nimeni altul, înafară de Tine, nu este fără întinăciune.",
      "Şi acum..., a Născătoarei:",
      "Întru cinstită naşterea ta cea mai presus de fire, legile firii în chip arătat se dezleagă; că fără de sămânţă ai născut pe Dumnezeu Cel născut din Tatăl mai înainte de veci.",
    ],
  },
  {
    id: "cantarea-6",
    title: "Cântarea a şasea",
    rubric:
      "Irmos: Din iadul cel mai de jos am strigat din toată inima către înduratul Dumnezeu şi m-a auzit şi a scos din stricăciune viaţa mea.",
    paragraphs: [
      "La înfricoşătoarea Ta venire, Hristoase, când Te vei arăta din cer şi cărţile se vor deschide, atunci să-Ţi fie milă, Mântuitorule, de zidirea Ta.",
      "Nimic nu te va putea ajuta acolo, o suflete, judecător fiind Dumnezeu: nici învăţătura, nici meşteşugul, nici mărirea, nici prieteniile; ci numai puterea faptelor.",
      "Slavă...",
      "De porţile iadului izbăveşte-mă, Doamne; mântuieşte-mă de prăpastie şi de întunericul cel adânc, de cele mai de jos ale pământului şi de focul cel nestins şi de oricare altă pedeapsă veşnică.",
      "Şi acum..., a Născătoarei:",
      "Tu eşti uşa, prin care singur Iisus, Fiul tău, a trecut, Cel ce a intrat şi a ieşit, şi cheile fecioriei nu le-a stricat, Curată; Cel ce a zidit pe Adam.",
    ],
  },
  {
    id: "condac-icos",
    title: "Condacul şi Icosul",
    rubric: "Condacul, glasul al 6-lea:",
    paragraphs: [
      "Suflete al meu, pentru ce te îmbogăţeşti în păcate? Pentru ce faci voia diavolului? În ce-ţi pui nădejdea? Părăseşte-le pe acestea şi te întoarce către Dumnezeu, strigând: Îndurate Doamne, miluieşte-mă pe mine, păcătosul.",
      "Icos:",
      "Gândeşte, suflete al meu, la ceasul cel amar al morţii şi la judecata cea înfricoşătoare a Făcătorului Dumnezeu, că îngerii cei întunecaţi te vor lua pe tine, suflete, şi te vor duce în focul cel de veci. Iar tu, mai înainte de moarte, te pocăieşte, strigând: Miluieşte-mă, Doamne, pe mine, păcătosul.",
    ],
  },
  {
    id: "cantarea-7",
    title: "Cântarea a şaptea",
    rubric:
      "Irmos: Greşit-am, fărădelege am făcut, nu ne-am îndreptat înaintea Ta, nu am păzit şi nici nu am făcut precum ne-ai poruncit nouă. Dar nu ne părăsi pe noi până în sfârşit, Dumnezeul părinţilor noştri.",
    paragraphs: [
      "Domnul vine să judece, cine va suferi arătarea Lui? Înfricoşează-te, ticăloase suflete, înfricoşează-te şi-ţi găteşte lucrurile tale spre ieşirea ta, ca să afli milostiv şi îndurat pe Însuşi Dumnezeul părinţilor.",
      "Cad înaintea Ta şi aduc Ţie, ca nişte lacrimi, graiurile mele. Am greşit mai mult decât păcătoasa şi fărădelege am făcut ca nimeni altul pe pământ; dar milostiveşte-Te, Stăpâne, spre făptura Ta, şi la Tine mă cheamă.",
      "Slavă...",
      "Întoarce-te, căieşte-te, descoperă cele ascunse şi, ca David, zi lui Dumnezeu, Celui ce toate le ştie: „De cele ascunse ale mele curăţeşte-mă şi mă miluieşte după mare mila Ta”.",
      "Şi acum..., a Născătoarei:",
      "Ieşit-a Dumnezeu, Cel preafrumos, din cămara pântecelui tău, ca un împărat îmbrăcat cu haină ţesută de Dumnezeu, înroşită în vopseaua cea de taină a preacuratului tău sânge, şi împărăţeşte tot pământul.",
    ],
  },
  {
    id: "cantarea-8",
    title: "Cântarea a opta",
    rubric:
      "Irmos: Pe Cel pe Care oştile cereşti Îl slăvesc şi de Care se cutremură heruvimii şi serafimii, pe Acela toată suflarea şi toată făptura lăudaţi-L, binecuvântaţi-L şi-L preaînălţaţi întru toţi vecii.",
    paragraphs: [
      "Când vei judeca Tu, Dumnezeule, cine dintre pământeni, fiind înconjurat de patimi, va putea suferi? Că atunci focul cel nestins şi viermele cel neadormit va cuprinde în veci pe cei osândiţi.",
      "Dreptule Judecător, Mântuitorule, miluieşte-mă şi mă scapă de focul şi de îngrozirea ce mă aşteaptă pe dreptate la judecată; dar lasă-mă mai înainte de sfârşit să mă pregătesc, prin fapte bune şi prin pocăinţă.",
      "Binecuvântăm pe Tatăl şi pe Fiul şi pe Sfântul Duh, Domnul.",
      "Când vei şedea Judecătorule, ca un Milostiv, şi vei arăta Hristoase înfricoşătoare slava Ta – o, ce frică va fi atunci! – focul arzând şi toţi temându-se de judecata cea de nesuferit.",
      "Şi acum..., a Născătoarei:",
      "Din luminatul tău pântece ieşind Hristos, ca un mire din cămară, a luminat lumină mare celor din întuneric; pentru că strălucind Soarele dreptăţii, lumea a luminat, curată!",
    ],
  },
  {
    id: "cantarea-9",
    title: "Cântarea a noua",
    rubric:
      "Irmos: Neînţeles lucru este rodul zămislirii mai presus de fire şi naşterea Maicii celei fără de bărbat, căci naşterea lui Dumnezeu înnoieşte firile. Pentru aceasta, toate neamurile pe tine, ca pe o Maică, Mireasă dumnezeiască, cu dreaptă credinţă te mărim.",
    paragraphs: [
      "Domnul vine să-i pedepsească pe păcătoşi şi să-i mântuiască pe cei drepţi; să ne înfricoşăm, să plângem şi să ne îndreptăm, căci descoperind cele nearătate şi cele ascunse ale oamenilor, Hristos va răsplăti tuturor după vrednicie.",
      "Să nu mă întoarcă de la faţa Ta, mânia urgiei Tale, Doamne, nici să aud glasul Tău cel de blestem trimiţându-mă în foc; ci dă-mi să intru şi eu în bucuria cămării Tale celei nestricăcioase, împreună cu sfinţii Tăi.",
      "Slavă...",
      "Mintea mi s-a rănit, trupul mi s-a trândăvit, mi se îmbolnăveşte duhul, cuvântul a slăbit, viaţa a trecut, iar sfârşitul este lângă uşi. Deci, ce vei face, suflete, când va veni Judecătorul să cerceteze ale tale?",
      "Şi acum..., a Născătoarei:",
      "Minunea naşterii tale mă uimeşte, ceea ce eşti cu totul fără-prihană; spune cum ai zămislit fără sămânţă pe Cel necuprins? Cum ai rămas fecioară, născând ca o maică? Acest lucru peste fire cu credinţă primindu-l, închină-te Celui născut, căci câte le voieşte le şi poate.",
    ],
  },
  {
    id: "rugaciune-finala",
    title: "Rugăciune către Domnul nostru Iisus Hristos",
    paragraphs: [
      "Doamne Dumnezeul nostru, Cel bogat în milă şi necuprins în îndurări, Care singur din fire eşti fără de păcat, şi pentru noi fără de păcat Te-ai făcut om, ascultă această rugăciune a mea, că sărac şi lipsit sunt eu de fapte bune şi inima mea s-a tulburat în mine. Tu, Doamne, Împărate al cerului şi al pământului, ştii că toată tinereţea mea am cheltuit-o în păcate şi, umblând după poftele trupului meu, m-am făcut cu totul bucurie dracilor, tăvălindu-mă totdeauna în noroiul poftelor. Mintea cu totul mi-am întinat, trupul cu totul l-am spurcat, sufletul cu totul l-am pângărit cu învoirea spre păcat. Cine, dar, nu mă va plânge pe mine, ticălosul? Cine nu mă va tângui pe mine, osânditul? Pentru că eu singur, Stăpâne, am făcut răutate înaintea Ta, întrecând pe toţi păcătoşii cei din veac, păcătuind fără de asemănare şi fără de iertare. Însă, de vreme ce eşti milostiv şi mult-milosârd, Iubitorule de oameni, şi aştepţi întoarcerea oamenilor, iată şi eu mă arunc înaintea Ta şi din adâncul sufletului strig Ţie: milostiveşte-te, Doamne, iartă-mă, îndură-te, ajută neputinţei mele, ia aminte la glasul rugăciunii mele şi lacrimile mele nu le trece cu vederea. Primeşte-mă pe mine, cel ce mă pocăiesc, pentru că Tu eşti cel care nu doreşti moartea păcătosului. Gol şi descoperit stau înaintea Ta, Cunoscătorule de inimi, Doamne, mărturisindu-mi păcatele mele. Deci, luminează-mi ochii inimii mele şi dă-mi umilinţă spre pocăinţă şi zdrobire inimii spre îndreptarea mea, ca primind iertare mulţimii greşelilor mele, să proslăvesc milostivirea Ta şi să laud totdeauna Preasfânt numele Tău, al Tatălui şi al Fiului şi al Sfântului Duh, acum şi pururea şi în vecii vecilor. Amin.",
    ],
  },
];
