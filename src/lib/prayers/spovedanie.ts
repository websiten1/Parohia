import type { PrayerStep } from "./types";

export const SPOVEDANIE_INTRO =
  "Fiecare creştin trebuie să-şi mărturisească păcatele ori de câte ori simte nevoia (o dată la câteva săptămâni sau cel puţin în cele 4 posturi). Când cineva se mărturiseşte pentru prima dată sau când trece la un alt duhovnic, trebuie să facă o mărturisire generală (din copilărie), urmând ca după aceea să mărturisească doar păcatele pe care le-a făcut de la ultima mărturisire. Problemele care nu ţin de spovedanie trebuie discutate cu preotul aparte, nu în cadrul tainei mărturisirii.";

/**
 * Rânduială înainte de spovedanie.
 *
 * The supplied text ends mid-sentence inside the confession guide, at
 * "…n-am iertat pe cei care mi-au făcut rău, am blestemat". Nothing has been
 * written past that point; the remainder is awaited rather than guessed.
 */
export const SPOVEDANIE: PrayerStep[] = [
  {
    id: "psalmul-6",
    title: "Psalmul 6",
    rubric:
      "După rugăciunile începătoare, cel care se pregăteşte pentru a-şi mărturisi păcatele, spune cu toată umilinţa:",
    paragraphs: [
      "Doamne, nu cu mânia Ta să mă mustri pe mine, nici cu urgia Ta să mă cerţi. Miluieşte-mă, Doamne, că neputincios sunt; vindecă-mă, Doamne, că s-au tulburat oasele mele; şi sufletul meu s-a tulburat foarte şi Tu, Doamne, până când? Întoarce-Te, Doamne; izbăveşte sufletul meu, mântuieşte-mă, pentru mila Ta. Că nu este în moarte cine să Te pomenească pe Tine şi în iad cine Te va lăuda? Ostenit-am întru suspinul meu, spăla-voi în fiecare noapte patul meu, cu lacrimile mele aşternutul meu voi uda. S-a tulburat de supărare ochiul meu, îmbătrânit-am între toţi vrăjmaşii mei. Depărtaţi-vă de la mine toţi cei ce lucraţi fărădelegea, că a auzit Domnul glasul plângerii mele. Auzit-a Domnul cererea mea, Domnul rugăciunea mea a primit. Să se ruşineze şi să se tulbure foarte toţi vrăjmaşii mei; să se întoarcă şi să se ruşineze foarte degrabă.",
    ],
  },
  {
    id: "rugaciune-de-pocainta",
    title: "Rugăciune de pocăinţă",
    paragraphs: [
      "Doamne, Dumnezeul nostru, Cel bogat în milă şi necuprins în îndurări, Care Singur din fire eşti fără de păcat şi pentru noi Te-ai făcut om fără de păcat, ascultă în ceasul acesta, această rugăciune dureroasă a mea, că sărac şi lipsit sunt eu de fapte bune şi inima mea s-a tulburat în mine! Tu, Doamne preaînalte, Împărate al cerului şi al pământului, ştii că toată viaţa mea am petrecut-o în păcate şi, umblând după poftele trupului, mi s-a întunecat mintea, încât n-am vrut să fac voia Ta cea sfântă; ci cu totul robindu-mă de poftele care mă înconjoară, m-am făcut de râs şi de batjocură dracilor, uitând că nesuferită este urgia îngrozirii Tale asupra păcătoşilor. Apoi, căzând în deznădăjduire şi nesimţire, m-am făcut pustiu şi gol de dragostea cea de la Tine. Mintea cu totul mi-am întinat prin cugete trupeşti; trupul mi-am spurcat prin amestecări; duhul cu totul mi l-am pângărit cu învoirea spre păcate. Toate mădularele ticălosului meu trup le-am pornit a lucra şi a sluji păcatului. Dar de vreme ce eşti mult-milostiv şi aştepţi întoarcerea oamenilor, iată, şi eu cad la înfricoşatul Tău Scaun şi, căzând către Tine, din adâncul sufletului strig Ţie: Milostiveşte-te, Doamne, iartă-mă, Îndurate, ajută neputinţei mele, pleacă-Te spre nepriceperea mea, ia aminte la rugăciunea mea şi lacrimile mele să nu le treci cu vederea. Primeşte-mă pe mine, cel ce mă pocăiesc, şi, rătăcit fiind, întoarce-mă, şi, întorcându-mă, îmbrăţişează-mă şi mă iartă, căci n-ai pus pocăinţă pentru cei drepţi şi n-ai adus iertare celor ce nu greşesc, ci ai rânduit pocăinţă pentru mine păcătosul, care cu atâtea fapte te-am mâniat. Gol şi descoperit stau înaintea Ta, cunoscătorule de inimi, Doamne, mărturisindu-mi păcatele mele, pentru că nu pot să caut şi să văd înălţimea cerului, fiind împilat de greutatea păcatelor mele. Deci, luminează-mi ochii inimii mele şi dă-mi umilinţă spre pocăinţă şi zdrobire de inimă spre îndreptare, ca să merg cu bună nădejde şi cu adevărată şi deplină adeverire la lumea cea de dincolo, lăudând şi binecuvântând totdeauna preasfânt numele Tău: al Tatălui şi al Fiului şi al Sfântului Duh, acum şi pururea şi în vecii vecilor. Amin.",
    ],
  },
  {
    id: "invatatura-spovedanie",
    title: "Scurtă învăţătură despre Spovedanie",
    paragraphs: [
      "Înainte de mărturisirea păcatelor, creştinul va scrie pe o foaie păcatele făcute, pentru a nu lăsa ceva nemărturisit, iar lista de mai jos este menită să-i ajute chiar şi pe cei care se mărturisesc mai des. În cazul în care cineva are de adăugat ceva, acest lucru trebuie făcut neapărat, având mai jos doar un îndrumar general, care nu poate fi valabil pentru toţi creştinii. Cei care nu înţeleg ce înseamnă un anumit păcat sau cât de grav este acesta, să-l întrebe pe preotul duhovnic. Primul şi ultimul aliniat din această mărturisire se vor citi de către fiecare, pentru că ele constituie o introducere şi un sfârşit general valabil pentru toţi.",
    ],
  },
];
