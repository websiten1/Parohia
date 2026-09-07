import type { PrayerStep } from "./types";

export const PARACLIS_INTRO =
  "Acest Paraclis este o rânduială de rugăciune foarte folositoare adresată Maicii Domnului, care poate fi citită la necesitate, chiar şi în fiecare zi, când poate fiecare. Paraclisul constă din Canonul Născătoarei de Dumnezeu şi alte câteva rugăciuni care se pun înainte şi după Canon. Atunci când Paraclisul este săvârşit în Biserică, cu preot, el poate avea Evanghelie şi alte elemente specifice.\n\nDacă acest Paraclis este făcut separat, fără a fi încadrat în rugăciunile de dimineaţă sau Pavecerniţă, el trebuie să înceapă cu rugăciunile începătoare (vezi la rugăciunile dimineţii), troparele: „Către Născătoarea de Dumnezeu…”, apoi Psalmul 50 şi Canonul, încheind cu rugăciunile finale. Dacă însă Paraclisul este încadrat într-o altă rânduială (de obicei Pavecerniţa), din el se va citi doar Canonul, aşa cum urmează mai jos.";

/** Paraclisul Maicii lui Dumnezeu. */
export const PARACLIS: PrayerStep[] = [
  {
    id: "tropare",
    title: "Troparele Paraclisului, glasul al 4-lea",
    paragraphs: [
      "Către Născătoarea de Dumnezeu acum cu osârdie să alergăm noi, păcătoşii şi smeriţii, şi să cădem cu pocăinţă, strigând din adâncul sufletului: „Stăpână, ajută-ne, milostivindu-te spre noi; sârguieşte, că pierim de mulţimea păcatelor; nu întoarce pe robii tăi neajutoraţi, că pe tine singură nădejde te-am câştigat.”",
      "Slavă…, Şi acum…",
      "Nu vom tăcea, Născătoare de Dumnezeu, pururea a spune puterile tale, noi, nevrednicii. Că de nu ai fi stat tu înainte rugându-te, cine ne-ar fi izbăvit din atâtea nevoi? Sau cine ne-ar fi păzit până acum slobozi? Nu ne vom depărta de la tine, Stăpână, că tu izbăveşti pe robii tăi pururea din toate nevoile.",
      "Urmează Psalmul 50 (vezi la rugăciunile de dimineaţă), apoi Canonul:",
    ],
  },
  {
    id: "cantarea-1",
    title: "Cântarea întâi",
    rubric:
      "Irmos: Apa trecând-o ca pe uscat şi din răutatea egiptenilor scăpând, israiliteanul striga: „Izbăvitorului şi Dumnezeului nostru să-I cântăm”.",
    paragraphs: [
      "Stih: Preasfântă Născătoare de Dumnezeu, roagă-te pentru noi.",
      "De multe ispite fiind cuprins, către tine alerg, căutând mântuire; o, Maică a Cuvântului şi Fecioară, de rele şi de nevoi mântuieşte-mă.",
      "Stih: Preasfântă Născătoare de Dumnezeu, roagă-te pentru noi.",
      "Asupririle chinurilor mă tulbură şi de multe întristări se umple sufletul meu; alină-le, Fecioară, cu liniştea Fiului şi Dumnezeului tău, ceea ce eşti cu totul fără de prihană.",
      "Slavă Tatălui şi Fiului şi Sfântului Duh.",
      "Pe tine, care ai născut pe Mântuitorul şi Dumnezeu, te rog, Fecioară, izbăveşte-mă din nevoi; că la tine scăpând acum îmi tind şi sufletul şi gândul.",
      "Şi acum şi pururea şi în vecii vecilor. Amin.",
      "Fiind bolnav cu trupul şi cu sufletul, cercetării celei dumnezeieşti şi purtării tale de grijă învredniceşte-mă, Maica lui Dumnezeu, ceea ce eşti bună şi Născătoarea Celui bun.",
    ],
  },
  {
    id: "cantarea-3",
    title: "Cântarea a treia",
    rubric:
      "Irmos: Doamne, Cel ce ai făcut cele de deasupra crugului ceresc şi ai zidit Biserica, Tu pe mine mă întăreşte întru dragostea Ta; că Tu eşti marginea doririlor şi credincioşilor întărire, Unule, Iubitorule de oameni.",
    paragraphs: [
      "Stih: Preasfântă Născătoare de Dumnezeu, roagă-te pentru noi.",
      "Folositoare şi acoperământ vieţii mele te pun pe tine, Născătoare de Dumnezeu Fecioară; tu mă îndreptează la adăpostirea ta, ceea ce eşti izvorul bunătăţilor şi credincioşilor întărire, una întru tot lăudată.",
      "Stih: Preasfântă Născătoare de Dumnezeu, roagă-te pentru noi.",
      "Te rog, Fecioară, risipeşte-mi tulburarea sufletului şi viforul întristărilor mele; că tu, Mireasă dumnezeiască, pe Hristos, începătorul liniştii, L-ai născut, ceea ce eşti de Dumnezeu fericită.",
      "Slavă Tatălui şi Fiului şi Sfântului Duh.",
      "Ceea ce ai născut pe Făcătorul de bine, Care este pricina bunătăţilor, bogăţia facerii de bine izvorăşte-o tuturor; că toate le poţi, ca ceea ce ai născut pe Hristos, Cel puternic întru tărie, una preacurată.",
      "Şi acum şi pururea şi în vecii vecilor. Amin.",
      "De neputinţe cumplite şi de chinurile bolilor fiind cuprins, Fecioară, ajută-mi; că pe tine te ştiu comoară de tămăduiri neîmpuţinată şi necheltuită, ceea ce eşti cu totul fără de prihană.",
    ],
  },
  {
    id: "imn-1",
    title: "Imn:",
    paragraphs: [
      "Izbăveşte din nevoi pe robii tăi, Născătoare de Dumnezeu, că toţi, după Dumnezeu, la tine scăpăm, ca la un zid nestricat şi folositor.",
      "Caută cu milostivire, cu totul lăudată Născătoare de Dumnezeu, spre necazul cel cumplit al trupului meu şi vindecă durerea sufletului meu.",
      "Şezânda (Sedealna):",
      "Ceea ce eşti rugătoare caldă şi zid nebiruit, izvor de milă şi lumii scăpare, cu stăruință strigăm către tine, Născătoare de Dumnezeu: Stăpână, vino degrabă şi ne izbăveşte din nevoi, ceea ce eşti una grabnică folositoare.",
    ],
  },
  {
    id: "cantarea-4",
    title: "Cântarea a patra",
    rubric:
      "Irmos: Am auzit, Doamne, taina rânduielii Tale, am înţeles lucrurile Tale şi am preaslăvit Dumnezeirea Ta.",
    paragraphs: [
      "Stih: Preasfântă Născătoare de Dumnezeu, roagă-te pentru noi.",
      "Tulburarea patimilor mele şi viforul greşelilor mele alină-le, ceea ce ai născut pe Domnul îndreptătorul, dumnezeiască Mireasă.",
      "Stih: Preasfântă Născătoare de Dumnezeu, roagă-te pentru noi.",
      "Chemând eu adâncul milostivirii tale, dă-mi-l, ceea ce ai născut pe Cel milostiv şi pe Mântuitorul tuturor celor ce te laudă pe tine.",
      "Slavă Tatălui şi Fiului şi Sfântului Duh.",
      "Îndulcindu-ne, Preacurată, de darurile tale, ţie cântare de mulţumire cântăm, ştiindu-te pe tine Maica lui Dumnezeu.",
      "Şi acum şi pururea şi în vecii vecilor. Amin.",
      "Nădejde şi întărire şi zid de scăpare nemişcat câştigându-te pe tine, ceea ce eşti întru tot lăudată, de tot necazul ne izbăvim.",
    ],
  },
  {
    id: "cantarea-5",
    title: "Cântarea a cincea",
    rubric:
      "Irmos: Luminează-ne pe noi, Doamne, cu poruncile Tale şi cu braţul Tău cel înalt; pacea Ta dă-ne-o nouă, Iubitorule de oameni.",
    paragraphs: [
      "Stih: Preasfântă Născătoare de Dumnezeu, roagă-te pentru noi.",
      "Umple, Preacurată, inima mea de veselie, dăruindu-mi bucuria ta cea nestricăcioasă, ceea ce ai născut izvorul veseliei.",
      "Stih: Preasfântă Născătoare de Dumnezeu, roagă-te pentru noi.",
      "Izbăveşte-ne din primejdii, Născătoare de Dumnezeu curată, ceea ce ai născut izbăvirea cea veşnică şi pacea care covârşeşte toată mintea.",
      "Slavă Tatălui şi Fiului şi Sfântului Duh.",
      "Risipeşte negura greşelilor mele, dumnezeiască Mireasă, cu strălucirea luminii tale, ceea ce ai născut lumina cea dumnezeiască şi veşnică.",
      "Şi acum şi pururea şi în vecii vecilor. Amin.",
      "Tămăduieşte, Curată, neputinţa sufletului meu, învrednicindu-mă cercetării tale; şi sănătate, cu rugăciunile tale, dăruieşte-mi.",
    ],
  },
  {
    id: "cantarea-6",
    title: "Cântarea a şasea",
    rubric:
      "Irmos: Rugăciunea mea voi vărsa către Domnul şi Lui voi spune necazurile mele, căci s-a umplut sufletul meu de răutăţi şi viaţa mea de iad s-a apropiat; dar ca Iona mă rog: „Dumnezeule, din stricăciune scoate-mă!”",
    paragraphs: [
      "Stih: Preasfântă Născătoare de Dumnezeu, roagă-te pentru noi.",
      "Pe Cel ce a mântuit de moarte şi de stricăciune firea mea, care era ţinută de moarte şi de stricăciune, însuşi pe Sine dându-Se spre moarte, pe Fiul şi Dumnezeul tău roagă-L, Fecioară, să mă izbăvească şi de răutăţile vrăjmaşilor.",
      "Stih: Preasfântă Născătoare de Dumnezeu, roagă-te pentru noi.",
      "Folositoare şi păzitoare prea tare vieţii mele te ştiu pe tine, Fecioară, care risipeşti tulburarea cea dintru ispită şi izgoneşti asupririle diavolilor; deci mă rog totdeauna: de stricăciunea chinurilor mele izbăveşte-mă.",
      "Slavă Tatălui şi Fiului şi Sfântului Duh.",
      "Pe tine, Fecioară, te-am dobândit ca un zid de scăpare şi mijlocitoare desăvârşită, şi desfătare întru scarbe: de lumina ta pururea ne bucurăm, o, Stăpână; şi acum ne izbăveşte din nevoi şi din chinuri.",
      "Şi acum şi pururea şi în vecii vecilor. Amin.",
      "Acum zac în patul durerilor şi nu este tămăduire trupului meu; ci mă rog ţie, celei bune, care ai născut pe Dumnezeu, Mântuitorul lumii şi tămăduitorul bolilor, ridică-mă din chinul durerilor.",
    ],
  },
  {
    id: "imn-2",
    title: "Imn:",
    paragraphs: [
      "Izbăveşte din nevoi pe robii tăi, Născătoare de Dumnezeu, că toţi, după Dumnezeu, la tine scăpăm, ca la un zid nestricat şi folositor.",
      "Caută cu milostivire, cu totul lăudată Născătoare de Dumnezeu, spre necazul cel cumplit al trupului meu şi vindecă durerea sufletului meu.",
      "Condacul:",
      "Ceea ce eşti neînfruntată folositoare creştinilor şi neschimbată mijlocitoare către Făcătorul, nu trece cu vederea glasurile de rugăciune ale păcătoşilor, ci sârguieşte ca o bună, spre ajutorul nostru, al celor care cu credinţă ne rugăm ţie: grăbeşte spre rugăciune şi te nevoieşte spre îmblânzire, apărând pururea pe cei ce te cinstesc pe tine, Născătoare de Dumnezeu.",
    ],
  },
  {
    id: "cantarea-7",
    title: "Cântarea a şaptea",
    rubric:
      "Irmos: Tinerii cei ce au mers din Iudeea în Babilon oarecând, cu credinţa Treimii văpaia cuptorului au călcat-o, cântând: „Dumnezeul părinţilor noştri, bine eşti cuvântat!”.",
    paragraphs: [
      "Stih: Preasfântă Născătoare de Dumnezeu, roagă-te pentru noi.",
      "Când ai vrut să lucrezi mântuirea noastră, Mântuitorule, Te-ai sălăşluit în pântecele Fecioarei, pe care o ai arătat-o lumii folositoare; Dumnezeul părinţilor noştri, bine eşti cuvântat!",
      "Stih: Preasfântă Născătoare de Dumnezeu, roagă-te pentru noi.",
      "Pe dătătorul milei, pe care L-ai născut, Maică Preacurată, roagă-L să mântuiască de păcate şi de întinăciunea sufletească pe cei ce strigă cu credinţă: Dumnezeul părinţilor noştri, bine eşti cuvântat!",
      "Slavă Tatălui şi Fiului şi Sfântului Duh.",
      "Comoară de mântuire şi izvor de curăţie, turn de tărie şi uşă de pocăinţă, pe ceea ce Te-a născut pe Tine, ai arătat-o celor ce strigă: Dumnezeul părinţilor noştri, bine eşti cuvântat!",
      "Şi acum şi pururea şi în vecii vecilor. Amin.",
      "De neputinţele trupeşti şi de păcatele sufleteşti, pe cei ce vin cu dragoste către acoperământul tău cel dumnezeiesc, învredniceşte-i să fie tămăduiţi, Născătoare de Dumnezeu, care ai născut nouă pe Mântuitorul Hristos.",
    ],
  },
  {
    id: "cantarea-8",
    title: "Cântarea a opta",
    rubric:
      "Irmos: Pe Împăratul Ceresc, pe Care îl lăudă oştile îngereşti, lăudaţi-L şi-L preaînălţaţi întru toţi vecii.",
    paragraphs: [
      "Stih: Preasfântă Născătoare de Dumnezeu, roagă-te pentru noi.",
      "Nu trece cu vederea pe cei ce au trebuinţă de ajutor de la tine, Fecioară, care îți cântă şi te preaînalţă întru toţi vecii.",
      "Stih: Preasfântă Născătoare de Dumnezeu, roagă-te pentru noi.",
      "Tămăduieşte neputinţa sufletului meu şi durerile chinurilor mele, Fecioară, ca să te slăvesc, Curată, în veci.",
      "Binecuvântăm pe Tatăl, pe Fiul și pe Sfântul Duh, Domnul.",
      "Bogăţie de tămăduiri verşi, Fecioară, celor ce te laudă cu credinţă şi preaînalţă Naşterea ta, cea negrăită.",
      "Şi acum şi pururea şi în vecii vecilor. Amin.",
      "Tu izgoneşti asuprirea ispitelor şi năvălirea patimilor, Fecioară; pentru aceea, te lăudăm întru toţi vecii.",
    ],
  },
  {
    id: "cantarea-9",
    title: "Cântarea a noua",
    rubric:
      "Irmos: Cu adevărat, Născătoare de Dumnezeu, te mărturisim pe tine Fecioară curată, noi, cei izbăviţi prin tine, slăvindu-te cu cetele cele fără de trup.",
    paragraphs: [
      "Stih: Preasfântă Născătoare de Dumnezeu, roagă-te pentru noi.",
      "Să nu te întorci, Fecioară, de la izvorul lacrimilor mele, care ai născut pe Hristos, Cel ce a şters lacrimile de pe feţele tuturor.",
      "Stih: Preasfântă Născătoare de Dumnezeu, roagă-te pentru noi.",
      "Umple de bucurie inima mea, Fecioară, ceea ce ai primit plinătatea bucuriei şi ai pierdut grija păcatului.",
      "Slavă Tatălui şi Fiului şi Sfântului Duh.",
      "Cu strălucirea luminii tale, luminează, Fecioară, negura neştiinţei şi o izgoneşte de la cei ce cu credinţă te mărturisesc pe tine, Născătoare de Dumnezeu.",
      "Şi acum şi pururea şi în vecii vecilor. Amin.",
      "Pe mine, care zac de boală, în locul cel de răutate, tămăduieşte-mă, Fecioară, şi mă întoarce dintru nesănătate în sănătate.",
    ],
  },
  {
    id: "catavasia",
    title: "Catavasia:",
    paragraphs: [
      "O, prealuminate nor, Maica lui Dumnezeu, pe cei ce se luptă cu noi surpă-i, cu dreapta ta cea stăpânitoare şi atotputernică, şi celor ce sunt în scârbe le ajută, pe cei asupriţi îi mântuieşte şi dezleagă de păcate pe cei ce se roagă ţie, că toate le poţi, câte le voieşti.",
      "Apoi:",
      "Cuvine-se cu adevărat a te ferici pe tine, Născătoare de Dumnezeu, cea pururea fericită şi întru totul fără-prihană, şi Maica Dumnezeului nostru.",
      "Pe cea mai cinstită decât heruvimii şi mai slăvită fără-de-asemănare decât serafimii, care fără stricăciune pe Dumnezeu-Cuvântul a născut, pe tine, cea cu adevărat Născătoare de Dumnezeu, te mărim.",
    ],
  },
  {
    id: "stihiri",
    title: "Apoi stihirile acestea:",
    paragraphs: [
      "Pentru toţi, care scapă cu credinţă sub acoperământul tău cel puternic, te rogi, ceea ce eşti bună; că noi, păcătoşii, nu avem altă izbăvire către Dumnezeu, în nevoi şi în necazuri, fiind pururea împovăraţi cu multe păcate, Maica lui Dumnezeu cel Preaînalt. Pentru aceea, cădem înaintea ta, să ne izbăveşti pe noi, robii tăi, din toate nevoile.",
      "Stih: Pomeni-voi numele tău întru tot neamul şi neamul.",
      "Bucurie celor scârbiţi, folositoare celor asupriţi şi dătătoare de hrană celor flămânzi, străinilor mângâiere, celor învăluiţi adăpostire, bolnavilor cercetare, acoperământ neputincioşilor, toiag bătrâneţilor, tu eşti, Preacurată, Maica lui Dumnezeu cel Preaînalt; pentru aceea, ţie ne rugăm: grăbeşte de mântuieşte pe robii tăi.",
      "Stih: Ascultă, fiică, şi vezi şi pleacă urechea ta şi uită poporul tău şi casa părintelui tău.",
      "Bucură-te, Fecioară Preacurată; bucură-te, cinstitul sceptru al Împăratului Hristos; bucură-te, ceea ce ai crescut strugurele cel de taină; bucură-te, uşa cerului şi rugul cel nears; bucură-te, lumină a toată lumea; bucură-te, bucuria tuturor; bucură-te, mântuirea credincioşilor; bucură-te, apărătoarea şi scăparea tuturor creştinilor, Stăpână!",
      "Slavă..., Şi acum...",
      "Bucură-te, lauda a toată lumea; bucură-te, casa Domnului; bucură-te, munte umbrit; bucură-te, scăpare; bucură-te, ceea ce eşti sfeşnic de aur; bucură-te, Preacurată, ceea ce eşti slava creştinilor; bucură-te, Marie, Maica lui Hristos Dumnezeu; bucură-te, rai; bucură-te, masa cea dumnezeiască; bucură-te, biserică; bucură-te, potir de aur; bucură-te, bucuria tuturor!",
      "Urmează și aceste stihuri:",
      "Pe cea mai înaltă decât cerurile şi mai curată decât strălucirile soarelui, care ne-a izbăvit pe noi din blestem, pe Stăpâna lumii, cu cântări să o cinstim.",
      "Pentru păcatele mele cele multe mi se îmbolnăveşte trupul şi slăbeşte sufletul meu; la tine scap, ceea ce eşti plină de har; nădejdea celor fără de nădejde, tu îmi ajută.",
      "Stăpână şi Maica Izbăvitorului, primeşte rugăciunea nevrednicilor robilor tăi, ca să fii folositoare către Cel ce S-a născut din tine, o, Stăpâna lumii, fii mijlocitoare.",
      "Toate oştile îngereşti, Înaintemergătorule al Domnului, cei doisprezece Apostoli şi toţi Sfinţii, împreună cu Născătoarea de Dumnezeu, faceţi rugăciuni că să ne mântuim.",
      "Milostivă fii mie, smeritului, Maica lui Dumnezeu, că afară de tine altă scăpare nu ştiu eu, cel ce sunt plin de tot felul de păcate. Miluieşte-mă, nădejdea creştinilor.",
    ],
  },
  {
    id: "rugaciune-finala",
    title: "Rugăciune către Născătoarea de Dumnezeu",
    paragraphs: [
      "Stăpână de Dumnezeu Născătoare, împărăteasa cerului şi a pământului, cinstea şi lauda creştinilor, ceea ce eşti mai înaltă decât cerurile şi mai curată decât soarele, Fecioară prealăudată, nădejdea celor păcătoşi şi liniştea celor înviforaţi, caută spre noi, nevrednicii, şi ne scapă de vicleşugurile diavolului, că ne-au împresurat întristările, nevoile şi răutăţile. Dă-ne mână de ajutor, Stăpână, că pierim. Îndură-te de noi şi mijloceşte la Fiul tău cu rugăciunile tale preaputernice şi nebiruite, ca să-Şi întoarcă spre noi mila Sa cea bogată şi pe toţi să ne învrednicească a ne păstra viaţa cinstită şi fără de prihană, pentru ca noi, cu o gura şi cu o inimă, pe El pururea să-L slăvim, iar ţie să-ţi zicem: \"Bucură-te, ceea ce eşti plină de har, Domnul este cu tine!“. Amin.",
    ],
  },
];
