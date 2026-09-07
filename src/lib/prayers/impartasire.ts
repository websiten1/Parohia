import type { PrayerStep } from "./types";

export const IMPARTASIRE_INTRO =
  "Cei care doresc să se împărtăşească cu Sfintele Taine, pe lângă participarea obligatorie la Vecernia şi Utrenia din acea zi, trebuie să citească (sau să asculte) şi această pravilă înainte de împărtăşanie. Pravila este alcătuită din două părţi: Canonul şi rugăciunile dinainte de Împărtăşanie.\n\nDacă acest canon se citeşte seara, atunci el se încadrează, împreună cu celelalte canoane, în rânduiala Pavecerniţei Mici. Iar dacă acesta este lăsat spre citire dimineaţa, atunci el se pune imediat după rugăciunile de dimineaţă, unit cu rugăciunile dinainte de împărtăşire.";

/** Rânduiala sfintei împărtăşiri: Canonul, psalmii şi cele zece rugăciuni. */
export const IMPARTASIRE: PrayerStep[] = [
  {
    id: "cantarea-1",
    title: "Cântarea întâi, glasul al 2-lea:",
    rubric:
      "Irmos: Veniţi, popoarelor, să cântăm cântare lui Hristos Dumnezeu, Cel ce a călăuzit pe poporul pe care l-a scos din robia egiptenilor, că S-a preaslăvit.",
    paragraphs: [
      "Stih: Inimă curată zideşte întru mine, Dumnezeule, şi duh drept înnoieşte întru cele dinlăuntru ale mele.",
      "Pâine a vieţii celei veşnice să-mi fie mie Trupul Tău cel sfânt, Milostive Doamne, şi scump Sângele Tău, şi tămăduire durerilor celor de multe feluri.",
      "Stih: Nu mă lepăda de la faţa Ta şi Duhul Tău cel Sfânt nu-L lua de la mine.",
      "Învredniceşte-mă, Stăpâne, pe mine, nevrednicul, să mănânc Trupul Tău cel preacurat şi să beau Sângele Tău cel preascump, cu credinţă şi cu dragoste.",
      "Slavă…",
      "Întinat fiind cu lucruri netrebnice, eu, ticălosul, nu sunt vrednic să mă împărtăşesc cu preacuratul Tău Trup şi cu dumnezeiescul Tău Sânge, Hristoase; dar fă-mă vrednic de aceasta.",
      "Şi acum…",
      "Dumnezeiască Mireasă, ceea ce eşti bună şi binecuvântată, care ai odrăslit Spicul cel nearat şi de mântuire a lumii, învredniceşte-mă ca, mâncându-L pe Acesta, să mă mântuiesc.",
    ],
  },
  {
    id: "cantarea-3",
    title: "Cântarea a treia:",
    rubric:
      "Irmos: Întăreşte-ne pe noi întru Tine, Doamne, Cel ce prin lemn ai omorât păcatul; şi frica Ta sădeşte-o în inimile noastre, ale celor ce Te lăudăm pe Tine.",
    paragraphs: [
      "Dă-mi, Hristoase, picături de lacrimi, care să-mi curăţească necurăţia inimii mele, ca, fiind curăţit, în cuget curat, cu credinţă şi cu frică să vin, Stăpâne, spre împărtăşirea Darurilor Tale.",
      "Preacuratul Tău Trup şi dumnezeiescul Tău Sânge, Iubitorule de oameni, să-mi fie mie spre iertarea păcatelor spre împărtășirea cu Duhul Sfânt, spre viața de veci și spre îndepărtarea durerilor și a necazurilor.",
      "Slavă…",
      "Doamne, învredniceşte-mă să mă împărtăşesc fără de osândă cu preacurat Trupul Tău şi cu scumpul Tău Sânge şi să slăvesc bunătatea Ta.",
      "Şi acum…",
      "Preacurată, ceea ce eşti masă a Pâinii Vieţii, Care din milă S-a pogorât de sus şi a dăruit lumii o nouă viaţă, învredniceşte-mă acum şi pe mine, nevrednicul, să gust cu frică din Aceasta şi să fiu viu.",
      "Doamne miluieşte (de 3 ori).",
    ],
  },
  {
    id: "sedealna",
    title: "Şezânda (Sedealna):",
    paragraphs: [
      "Foc şi lumină să-mi fie mie primirea Preacuratelor şi de viaţă făcătoarelor Tale Taine, Mântuitorule, arzând neghina păcatelor şi luminându-mă peste tot, spre cuvântarea de Dumnezeu cea adevărată; că nu voi da înşelăciunii vrăjmaşului cele sfinte, nici nu-ți voi da sărutare înşelătoare, ci ca desfrânata, căzând înaintea Ta, şi ca tâlharul, mărturisindu-mă, strig către Tine: Pomeneşte-mă, Doamne, când vei veni întru împărăţia Ta.",
    ],
  },
  {
    id: "cantarea-4",
    title: "Cântarea a patra:",
    rubric:
      "Irmos: Te laud, că glas am auzit, Doamne, şi m-am spăimântat că ai venit până la mine, căutându-mă pe mine, cel rătăcit. Pentru aceea, preaslăvesc pogorârea Ta cea multă către mine, Mult-milostive.",
    paragraphs: [
      "Întrupându-Te, Mult-milostive, voit-ai a Te da spre junghiere, ca un miel, pentru păcatele noastre; pentru aceasta, mă rog Ţie să curăţeşti şi păcatele mele.",
      "Tămăduieşte rănile sufletului meu, Doamne, şi mă sfinţeşte tot şi mă învredniceşte, Stăpâne, să fiu părtaş dumnezeieştii Tale Cine celei de taină eu, ticălosul.",
      "Slavă…",
      "Să stăm toţi cu frică şi cu cutremur, ţinând ochii inimii în sus şi strigând către Mântuitorul: Întăreşte-ne şi ne înţelepţeşte, Milostive Doamne, întru frica Ta.",
      "Şi acum…",
      "Fă şi mie milostiv pe Cel pe Care L-ai purtat în pântecele tău, Stăpână, şi mă păzeşte pe mine, robul tău, neîntinat şi fără de prihană, ca, primind înăuntrul meu Mărgăritarul cel duhovnicesc, să mă sfinţesc.",
    ],
  },
  {
    id: "cantarea-5",
    title: "Cântarea a cincea:",
    rubric:
      "Irmos: Dătătorule de lumină şi făcătorul veacurilor, Doamne, întru lumina poruncilor Tale îndreptează-ne pe noi; că afară de Tine pe alt Dumnezeu nu ştim.",
    paragraphs: [
      "Precum ai zis mai înainte, Hristoase, fii acum cu smeritul robul Tău şi petrece întru mine, precum ai făgăduit, că iată, mănânc Trupul Tău cel dumnezeiesc şi beau Sângele Tău.",
      "Cuvinte al lui Dumnezeu şi Dumnezeule, cărbunele Trupului Tău să-mi fie mie, întunecatului, spre luminare şi Sângele Tău spre curăţirea întinatului meu suflet.",
      "Slavă…",
      "Având suflet întinat şi buze necurate, nu cutez să mă apropii de Tine, Hristoase, şi să primesc Trupul Tău; dar fă-mă vrednic de aceasta.",
      "Şi acum…",
      "Marie, Maica lui Dumnezeu, care eşti sălaş scump al bunei miresme, cu rugăciunile tale fă-mă vas ales pentru a mă împărtăşi cu Sfintele Taine ale Fiului tău.",
    ],
  },
  {
    id: "cantarea-6",
    title: "Cântarea a şasea:",
    rubric:
      "Irmos: Întru adâncul greşelilor fiind învăluit, chem adâncul cel nesfârşit al milostivirii Tale; scoate-mă din stricăciune, Dumnezeule.",
    paragraphs: [
      "Mintea, sufletul şi inima sfinţeşte-mi-le, Mântuitorule, şi mă învredniceşte fără de osândă, Stăpâne, să mă apropii de înfricoşătoarele Tale Taine.",
      "Ca, înstrăinându-mă de patimi, să am adăugirea harului Tău şi întărirea vieţii, prin împărtăşirea cu Sfintele Tale Taine, Hristoase.",
      "Slavă…",
      "Cu frică şi cu cutremur să ne apropiem toţi de dumnezeieştile Taine ale lui Hristos şi să primim adevăratul şi sfântul Lui Trup şi adevăratul, sfântul şi scumpul Lui Sânge.",
      "Şi acum…",
      "Dumnezeule, Cuvântul lui Dumnezeu cel Sfânt, sfinţeşte-mă acum cu totul pe mine, cel ce vin către dumnezeieştile Tale Taine, pentru rugăciunile Sfintei Maicii Tale.",
      "Apoi: Doamne miluieşte (de 3 ori), Slavă…",
      "Şi acum…",
    ],
  },
  {
    id: "condacul",
    title: "Condacul:",
    paragraphs: [
      "Să nu mă treci cu vederea, Hristoase, pe mine, cel ce primesc Pâinea, adică Trupul Tău, şi dumnezeiescul Tău Sânge şi mă împărtăşesc cu Preacuratele şi înfricoşătoarele Tale Taine, Stăpâne; să nu-mi fie mie, ticălosului, spre osândă, ci spre viaţa veşnică şi fără de moarte.",
    ],
  },
  {
    id: "cantarea-7",
    title: "Cântarea a şaptea:",
    rubric:
      "Irmos: Chipul cel de aur în câmpul Deira fiind cinstit, cei trei tineri au defăimat porunca cea fără de Dumnezeu; şi, fiind aruncaţi în mijlocul focului, răcorindu-se cântau: “Bine eşti cuvântat, Dumnezeul părinţilor noştri!”.",
    paragraphs: [
      "Împărtăşirea nemuritoarelor Tale Taine, Hristoase, să-mi fie mie acum izvor de bunătăţi, lumină, viaţă, nepătimire şi solire spre adăugirea şi înmulţirea dumnezeieştii Tale bunătăţi, ca să Te slăvesc pe Tine, Cel ce Singur eşti bun.",
      "Izbăveşte-mă de patimi, de vrăjmaşi, de nevoi şi de tot necazul, pe mine, cel ce mă apropii acum cu cutremur, cu dragoste şi cu sfială, Iubitorule de oameni, de Tainele Tale cele nemuritoare şi dumnezeieşti, şi-Ţi cânt Ţie: Bine eşti cuvântat, Doamne, Dumnezeul părinţilor noştri.",
      "Slavă…",
      "Suflete al meu ticălos, suflete pătimaş, spăimântează-te, văzând preaslăvitele Taine; lăcrimează, suspinând şi, bătându-te în piept, strigă şi zi: Doamne, curăţeşte-mă pe mine, desfrânatul.",
      "Şi acum…",
      "Celei ce ai născut pe Mântuitorul Hristos mai presus de minte, de Dumnezeu dăruită, ţie, celei curate, mă rog acum eu, robul tău cel necurat: Pe mine, cel ce voiesc să mă apropii acum de Tainele cele Preacurate, curăţeşte-mă întru totul de întinăciunea trupului şi a sufletului.",
    ],
  },
  {
    id: "cantarea-8",
    title: "Cântarea a opta:",
    rubric:
      "Irmos: Pe Dumnezeu, Cel ce S-a pogorât în cuptorul cel cu foc la tinerii evreilor şi a prefăcut văpaia în răcoreală, pe Domnul lucrurile lăudați-L și-L preaînălțați întru toți vecii.",
    paragraphs: [
      "Cereştilor, înfricoşătoarelor şi Sfintelor Tale Taine, Hristoase, şi Cinei Tale celei dumnezeieşti şi de taină, şi pe mine, cel deznădăjduit, acum părtaş a fi mă învredniceşte, Dumnezeule, Mântuitorul meu.",
      "Către a Ta milostivire alergând, Bunule, cu frică strig către Tine: „Petrece întru mine, Mântuitorule, şi eu întru Tine”, precum ai zis; că iată, îndrăznind spre mila Ta, mănânc Trupul Tău şi beau Sângele Tău.",
      "Binecuvântăm pe Tatăl, pe Fiul şi pe Sfântul Duh, Domnul.",
      "Mă cutremur, ca primind focul, să nu mă aprind ca iarba sau să mă topesc ca ceara. O, înfricoşătoare Taină! O, milostivire a lui Dumnezeu! Cum eu, tină fiind, mă împărtăşesc cu dumnezeiescul Trup şi Sânge şi mă fac fără stricăciune.",
      "Şi acum…",
      "Cu adevărat, Maica lui Dumnezeu, în pântecele tău S-a copt Pâinea cea dumnezeiască a Vieţii, păzind nevătămat pântecele tău cel nevinovat. Pentru aceasta, te lăudăm pe tine ca pe hrănitoarea noastră, întru toţi vecii.",
    ],
  },
  {
    id: "cantarea-9",
    title: "Cântarea a noua:",
    rubric:
      "Irmos: Pe Dumnezeu-Cuvântul cel din Dumnezeu, Care cu negrăită înţelepciune a venit să înnoiască pe Adam, cel căzut rău întru stricăciune prin mâncare, din sfânta Fecioară negrăit întrupându-Se pentru noi, credincioşii, cu un gând în cântări să-L slăvim.",
    paragraphs: [
      "Gustați și vedeți că bun este Domnul, Care, pentru noi, asemenea nouă S-a făcut; și, Tatălui o singură dată jertfă aducându-Se, pururea Se junghie, sfințind pe cei ce se împărtășesc cu Dânsul.",
      "Cu sufletul şi cu trupul să mă sfinţesc, Stăpâne, să mă luminez, să mă mântuiesc, să-Ţi fiu Ţie locaş prin împărtăşirea Sfintelor Taine, avându-Te pe Tine locuitor întru mine, împreună cu Tatăl şi cu Duhul, Făcătorule de bine, Mult-milostive.",
      "Slavă…",
      "Ca focul şi ca lumina să-mi fie mie Trupul şi Sângele Tău cel scump, Mântuitorul Meu, arzând materia păcatului şi mistuind spinii patimilor şi luminându-mă pe mine întreg, cel ce mă închin Dumnezeirii Tale.",
      "Şi acum…",
      "Dumnezeu S-a întrupat din sângiurile tale cele curate. Pentru aceasta, te laudă pe tine, Stăpână, tot neamul şi te măreşte mulţimea îngerilor, că prin tine au văzut pe Cel ce stăpâneşte toate, luând fiinţă omenească.",
      "Şi îndată:",
      "Cuvine-se cu adevărat a te ferici pe tine, Născătoare de Dumnezeu, cea pururea fericită şi întru totul fără-prihană, şi Maica Dumnezeului nostru.",
      "Pe cea mai cinstită decât heruvimii şi mai slăvită fără-de-asemănare decât serafimii, care fără stricăciune pe Dumnezeu-Cuvântul a născut, pe tine, cea cu adevărat Născătoare de Dumnezeu, te mărim.",
      "Sfinte Dumnezeule…, Preasfântă Treime…,Tatăl nostru…,",
      "Apoi troparele: Miluieşte-ne pe noi, Doamne, miluieşte-ne pe noi…, Slavă…, Doamne, miluieşte-ne pe noi…, Şi acum…, Uşa milostivirii deschide-o nouă… (caută la rugăciunile de seară).",
      "Dacă acest Canon a fost citit seara, atunci după troparele de mai sus, se încheie cu rugăciunile Pavecerniţei: „Nepătată, neîntinată…” şi celelalte, iar, dacă el se citeşte dimineaţa, imediat după tropare de mai sus se trece la „Veninţi să ne închinăm…”, Psalmul 22 şi toate celelalte de mai jos, inclusiv cele 10 rugăciuni dinainte de împărtăşire (mai ales dacă ele nu se citesc în Biserică).",
      "Dacă rugăciunele se citesc separat de Canonul de mai sus, după rugăciunile de dimineaţă se zice iarăşi: Doamne miluieşte (de 12 ori), Slavă…, Şi acum…, Veniţi să ne închinăm… (de 3 ori) şi cele de mai jos:",
    ],
  },
  {
    id: "psalmul-22",
    title: "Psalmul 22:",
    paragraphs: [
      "Domnul mă paşte şi nimic nu-mi va lipsi. La loc de verdeaţă, acolo m-a sălăşluit; la apa odihnei m-a hrănit. Sufletul meu l-a întors, povăţuitu-m-a pe căile dreptăţii, pentru Numele Lui. Că de voi şi umbla în mijlocul morţii, nu mă voi teme de rele, căci Tu cu mine eşti. Toiagul Tău şi varga Ta, acestea m-au mângâiat. Gătit-ai masă înaintea mea, împotriva celor ce mă necăjesc; uns-ai cu untdelemn capul meu şi paharul Tău mă adapă, ca un puternic. Şi mila Ta mă va urma în toate zilele vieţii mele, ca să locuiesc în casa Domnului, întru lungime de zile.",
    ],
  },
  {
    id: "psalmul-23",
    title: "Psalmul 23:",
    paragraphs: [
      "Al Domnului este pământul şi plinătatea lui, lumea şi toţi cei ce locuiesc în ea. Acesta pe mări l-a întemeiat pe el şi pe râuri l-a aşezat pe el. Cine se va sui în muntele Domnului şi cine va sta în locul cel sfânt al Lui? Cel nevinovat cu mâinile şi curat cu inima, care n-a luat în deşert sufletul său şi nu s-a jurat cu vicleşug aproapelui său. Acesta va lua binecuvântare de la Domnul şi milostenie de la Dumnezeu, Mântuitorul său. Acesta este neamul celor ce-L caută pe Domnul, al celor ce caută faţa Dumnezeului lui Iacob. Ridicaţi, căpetenii, porţile voastre şi vă ridicaţi porţile cele veşnice şi va intra Împăratul slavei. Cine este Acesta Împăratul slavei? – Domnul, Cel tare şi puternic, Domnul, Cel tare în război. Ridicaţi, căpetenii, porţile voastre şi vă ridicaţi porţile cele veşnice şi va intra Împăratul slavei. Cine este Acesta, Împăratul slavei? – Domnul puterilor, Acesta este Împăratul slavei.",
    ],
  },
  {
    id: "psalmul-115",
    title: "Psalmul 115:",
    paragraphs: [
      "Crezut-am, pentru aceea am grăit, iar eu m-am smerit foarte. Eu am zis întru uimirea mea: „Tot omul este mincinos!” Ce voi răsplăti Domnului pentru toate câte mi-a dat mie? Paharul mântuirii voi lua şi numele Domnului voi chema. Făgăduinţele mele le voi plini Domnului, înaintea a tot poporul Său. Scumpă este înaintea Domnului moartea cuvioşilor Lui. O, Doamne, eu sunt robul Tău, eu sunt robul Tău şi fiul roabei Tale; rupt-ai legăturile mele. Ţie-ţi voi aduce jertfă de laudă şi numele Domnului voi chema. Făgăduinţele mele le voi plini Domnului, înaintea a tot poporul Lui, în curţile casei Domnului, în mijlocul tău, Ierusalime.",
      "Slavă…, Şi acum…, Aliluia… (de 3 ori);",
      "Şi trei metanii.",
    ],
  },
  {
    id: "tropare",
    title: "Tropare, glasul al 6-lea:",
    paragraphs: [
      "Fărădelegile mele trece-le cu vederea, Doamne, Cel ce Te-ai născut din Fecioară, şi curăţeşte inima mea, făcând-o biserică a Preacuratului Tău Trup şi Sânge şi nu mă lepăda pe mine de la faţa Ta, Cel ce ai nemăsurată milă.",
      "Slavă…",
      "Spre împărtăşirea Sfintelor Tale Taine cum voi îndrăzni să vin eu, nevrednicul? Că de voi cuteza să mă apropii de Tine laolaltă cu cei vrednici, haina mă vădeşte că nu este de Cină, şi osândă voi pricinui mult-păcătosului meu suflet; dar curăţeşte, Doamne, necurăţia sufletului meu şi mă mântuieşte, ca un iubitor de oameni.",
      "Şi acum…",
      "Mare este mulţimea păcatelor mele, Născătoare de Dumnezeu, curată, la tine alerg, având trebuinţă de vindecare. Cercetează neputinciosul meu suflet şi te roagă Fiului tău şi Dumnezeului nostru să-mi dăruiască iertare de relele ce am făcut, ceea ce eşti una binecuvântată.",
      "Apoi: Doamne miluieşte (de 40 ori) şi 12 metanii.",
    ],
  },
  {
    id: "stihuri-de-indemn",
    title: "Rugăciunile dinainte de dumnezeiasca împărtăşire",
    rubric: "(după numărul şi ordinea din Ceaslovul grecesc)",
    paragraphs: [
      "Stihuri de îndemn:",
      "Trupul Stăpânului vrând să-L primeşti spre hrană, fii cu fricăsă nu te arzi, că foc este; Sângele Lui vrând să-L bei spre-mpărtăşire, mergi şi cu cei ce te-au mâhnit te împacă,și aşa îndrăzneşte de ia hrana sfântă. Vrând să te-mpărtăşeşti cu Jertfa de Taină, cu al Stăpânului Trup făcător de viaţă, întru acest chip te roagă cu cutremur:",
    ],
  },
  {
    id: "rugaciunea-1",
    title: "Rugăciunea întâi",
    rubric: "(a Sfântului Vasile cel Mare)",
    paragraphs: [
      "Stăpâne Doamne, Iisuse Hristoase, Dumnezeul nostru, Cel ce eşti izvorul vieţii şi al nemuririi, Făcătorul a toată făptura văzută şi nevăzută, Fiul Tatălui celui fără de început, Cel ce împreună cu Dânsul eşti veşnic şi fără de început, Care pentru multa bunătate, în zilele cele din urmă, ai purtat Trup şi Te-ai răstignit şi Te-ai jertfit pentru noi, cei nemulţumitori şi nerecunoscători, şi cu Sângele Tău ai înnoit firea noastră cea stricată prin păcat, Însuţi Împărate, Cel ce eşti fără de moarte, primeşte şi pocăinţa mea, a păcătosului, şi pleacă urechea Ta către mine şi ascultă graiurile mele, că am greşit, Doamne; greşit-am la cer şi înaintea Ta şi nu sunt vrednic a căuta spre înălţimea slavei Tale. Că am mâniat bunătatea Ta, călcând învăţăturile Tale şi neascultând de poruncile Tale. Dar Tu, Doamne, fără răutate fiind, îndelung-răbdător şi mult-milostiv, nu m-ai dat pe mine să pier cu fărădelegile mele, în tot chipul aşteptând întoarcerea mea. Că Tu ai zis, Iubitorule de oameni, prin prorocul Tău că nu voieşti moartea păcătosului, ci să se întoarcă și să fie viu. Că nu vrei, Stăpâne, să pierzi făptura mâinilor Tale, nici nu voieşti pierderea oamenilor, „ci vrei ca toţi să se mântuiască şi la cunoştinţa adevărului să vină”. Pentru aceasta, şi eu, deşi sunt nevrednic cerului şi pământului şi acestei vieţi trecătoare, pentru că m-am supus cu totul păcatului şi m-am făcut rob dezmierdărilor şi am necinstit chipul Tău, dar, fiind făptura şi zidirea Ta, nu deznădăjduiesc de a mea mântuire, eu ticălosul, ci, nădăjduind în milostivirea Ta cea fără de margini, vin către Tine. Primeşte-mă, deci, şi pe mine, Iubitorule de oameni, Hristoase, ca pe desfrânata şi ca pe tâlharul, ca pe vameşul şi ca pe fiul cel pierdut, şi ridică sarcina cea grea a păcatelor mele, Cel ce ridici păcatul lumii şi tămăduieşti neputinţele oamenilor. Cel ce chemi la Tine pe cei osteniţi şi împovăraţi şi le dai odihnă, Cel ce n-ai venit să chemi la pocăinţă pe cei drepţi, ci pe cei păcătoşi, curăţeşte-mă şi pe mine de toată necurăţia trupului şi a duhului, învaţă-mă să săvârşesc sfinţenie întru frica Ta, ca, întru curată mărturisire a cugetului meu, primind părticica Sfintelor Tale Taine, să mă unesc cu Sfântul Tău Trup şi Sânge şi să Te am pe Tine locuind şi petrecând întru mine împreună cu Tatăl şi cu Sfântul Duh. Aşa, Doamne, Iisuse Hristoase, Dumnezeul meu, să nu-mi fie mie spre osândă împărtăşirea Preacuratelor şi de viaţă făcătoarelor Tale Taine, nici să ajung neputincios cu sufletul şi cu trupul, împărtăşindu-mă cu nevrednicie; ci dă-mi, până la suflarea mea cea mai de pe urmă, fără de osândă să primesc părticica Sfintelor Tale Taine, spre împărtăşirea cu Duhul Sfânt, ca merinde pentru viaţa de veci şi spre răspuns bineprimit la înfricoşătorul Tău scaun de judecată, ca şi eu, dimpreună cu toţi aleşii Tăi, să fiu părtaş bunătăţilor Tale celor nestricăcioase, pe care le-ai gătit, Doamne, celor ce Te iubesc pe Tine, întru care eşti preaslăvit în vecii vecilor. Amin.",
    ],
  },
  {
    id: "rugaciunea-2",
    title: "Rugăciunea a doua",
    rubric: "(a Sfântului Vasile cel Mare)",
    paragraphs: [
      "Ştiu, Doamne, că mă împărtăşesc întru nevrednicie cu Preacuratul Tău Trup şi cu Scump Sângele Tău şi vinovat sunt, şi osândă mie însumi mănânc şi beau, neputându-mi da seama, precum se cuvine, de Trupul şi Sângele Tău, Hristoase, Dumnezeul meu. Ci, îndrăznind spre îndurările Tale, mă apropii de Tine, Cel ce ai zis: „Cel ce mănâncă Trupul Meu şi bea Sângele Meu întru Mine rămâne şi Eu întru dânsul”. Deci, milostiveşte-Te, Doamne, şi nu mă pedepsi pe mine, păcătosul, ci fă cu mine după mila Ta. Şi să-mi fie mie Sfintele Tale Taine spre tămăduire şi curăţire, spre luminare şi pază, spre mântuirea şi sfinţirea sufletului şi a trupului; spre izgonirea a toată nălucirea, a faptei celei rele şi a lucrării diavoleşti, care se lucrează cu gândul întru mădularele mele, spre îndrăznirea şi dragostea cea către Tine, spre îndreptarea şi întărirea vieţii, spre înmulţirea faptelor bune şi a desăvârşirii, spre plinirea poruncilor şi spre împărtăşirea cu Sfântul Duh, ca merinde pentru viaţa de veci şi spre răspuns bineprimit la înfricoşătorul Tău scaun de judecată, iar nu spre certare sau spre osândă.",
    ],
  },
  {
    id: "rugaciunea-3",
    title: "Rugăciunea a treia",
    rubric: "(a Sfântului Ioan Gură de Aur)",
    paragraphs: [
      "Doamne, Dumnezeul meu, ştiu că nu sunt vrednic, nici pregătit ca să intri sub acoperemântul casei sufletului meu, pentru că este cu totul pustiu şi surpat şi nu afli în mine loc potrivit ca să-Ţi pleci capul. Ci, precum din înălţime Te-ai plecat pentru noi, pleacă-Te şi acum spre smerenia mea. Şi, precum ai binevoit a Te culca în peşteră şi în ieslea dobitoacelor, aşa binevoieşte a intra şi în ieslea dobitocescului meu suflet şi în întinatul meu trup. Şi, precum n-ai socotit lucru nevrednic a intra şi a cina împreună cu păcătoşii în casa lui Simon cel lepros, aşa binevoieşte a intra şi în casa smeritului, leprosului şi păcătosului meu suflet. Şi precum n-ai îndepărtat pe desfrânata cea păcătoasă, care a venit şi s-a atins de Tine, aşa Te milostiveşte şi de mine, păcătosul, care vin şi mă ating de Tine. Şi precum nu Te-ai scârbit de întinata şi necurata ei gură, ce Te-a sărutat, aşa nu Te scârbi nici de întinata şi mai necurata mea gură, nici de buzele mele cele necurate şi pângărite, nici de limba mea cea cu totul necurată. Ci să-mi fie mie cărbunele Preasfântului Tău Trup şi al Scumpului Tău Sânge spre sfinţire şi spre luminare, spre însănătoşirea smeritului meu suflet şi trup, spre uşurarea greutăţii greşelilor mele celor multe, spre paza de toată lucrarea diavolească, spre îndepărtarea şi schimbarea răului şi vicleanului meu obicei, spre omorârea patimilor, spre plinirea poruncilor Tale, spre adăugirea dumnezeiescului Tău har şi spre dobândirea împărăţiei Tale. Că nu vin la Tine ca un nepăsător, Hristoase Dumnezeule, ci încrezându-mă în bunătatea Ta cea nespusă; şi ca nu cumva rămânând departe prea multă vreme de împărtăşirea Ta, să fiu prins de lupul cel înţelegător. Pentru aceasta, mă rog Ţie, Cel ce singur eşti sfânt, Stăpâne, sfinţeşte-mi sufletul şi trupul, mintea şi inima, rărunchii şi măruntaiele; înnoieşte-mă tot şi înrădăcinează frica Ta întru mădularele mele şi sfinţenia Ta fă-o neştearsă de la mine. Şi-mi fii mie ajutor şi folositor, îndreptând în pace viaţa mea şi învrednicindu-mă a sta de-a dreapta Ta, cu sfinţii Tăi, pentru rugăciunile şi mijlocirile Preacuratei Maicii Tale şi ale slujitorilor Tăi celor fără de trup, ale preacuratelor puteri, şi pentru ale tuturor sfinţilor, care din veac au bineplăcut Ţie. Amin.",
    ],
  },
  {
    id: "rugaciunea-4",
    title: "Rugăciunea a patra",
    rubric: "(a Sfântului Ioan Gură de Aur)",
    paragraphs: [
      "Nu sunt vrednic, Stăpâne Doamne, să intri sub acoperământul sufletului meu, ci, de vreme ce Tu, ca un iubitor de oameni, vrei să locuieşti întru mine, îndrăznind, mă apropii. Porunceşte-mi, şi voi deschide uşile pe care Tu însuţi le-ai zidit şi intră cu iubirea Ta de oameni, pe care pururea o ai. Intră şi luminează cugetul meu cel întunecat. Şi cred că aceasta vei face, că n-ai îndepărtat pe desfrânata care a venit la Tine cu lacrimi, nici pe vameşul care s-a pocăit nu l-ai alungat, nici pe tâlharul care a cunoscut Împărăţia Ta nu l-ai izgonit, nici pe prigonitorul Pavel care s-a pocăit nu l-ai lăsat cum era; ci pe toţi care au venit la Tine cu pocăinţă i-ai rânduit în ceata prietenilor Tăi, Cel ce singur eşti binecuvântat totdeauna, acum şi în vecii nesfârşiţi. Amin.",
    ],
  },
  {
    id: "rugaciunea-5",
    title: "Rugăciunea a cincea",
    rubric: "(a Sfântului Ioan Gură de Aur)",
    paragraphs: [
      "Doamne Iisuse Hristoase, Dumnezeul meu, slăbeşte, lasă, milostiveşte-Te şi-mi iartă mie, păcătosului, netrebnicului şi nevrednicului robului Tău, căderile în păcat, smintelile şi greşelile mele, toate câte am păcătuit faţă de Tine, din tinereţile mele până în ziua şi ceasul de acum: fie cu ştiinţă, fie din neştiinţă, cu cuvântul, sau cu fapta, sau cu gândul, sau cu cugetul, cu deprinderile şi cu toate simţurile mele. Şi, pentru rugăciunile celei ce fără de prihană Te-a născut pe Tine, ale Preacuratei şi pururea Fecioarei Maria, Maicii Tale, singura nădejde neînfruntată şi ocrotitoare şi izbăvitoare a mea, învredniceşte-mă să mă împărtăşesc fără de osândă cu preacuratele, nemuritoarele, de viaţă făcătoarele şi înfricoşătoarele Tale Taine, spre iertarea păcatelor şi spre viaţa de veci, spre sfinţire, spre luminare, spre tărie, spre vindecare şi spre sănătatea sufletului şi a trupului, spre ştergerea şi pierderea cu totul a cugetelor, a gândurilor şi a deprinderilor mele celor rele şi a nălucirilor de noapte, ale duhurilor celor viclene şi întunecate. Că a Ta este împărăţia şi puterea, slava, cinstea şi închinăciunea, împreună cu Tatăl şi cu Duhul Sfânt, acum şi pururea şi în vecii vecilor. Amin.",
    ],
  },
  {
    id: "rugaciunea-6",
    title: "Rugăciunea a şasea",
    rubric: "(a Sfântului Ioan Damaschin)",
    paragraphs: [
      "Stăpâne Doamne, Iisuse Hristoase, Dumnezeul nostru, Cel ce singur ai putere a ierta păcatele oamenilor, ca un bun şi iubitor de oameni, treci cu vederea toate greşelile mele cele cu ştiinţă şi cu neştiinţă şi mă învredniceşte să mă împărtăşesc fără de osândă cu dumnezeieştile, preaslăvitele, preacuratele şi de viaţă făcătoarele Tale Taine, nu spre osândă, nici spre adăugirea păcatelor, ci spre curăţire şi sfinţire şi spre dobândirea vieţii şi împărăţiei ce va să fie, spre zid şi ajutor, spre izgonirea celor potrivnici şi spre pierderea greşelilor mele celor multe; că Tu eşti Dumnezeul milei şi al îndurărilor şi al iubirii de oameni şi Ţie slavă înălţăm, împreună şi Tatălui şi Duhului Sfânt, acum şi pururea şi în vecii vecilor. Amin.",
    ],
  },
  {
    id: "rugaciunea-7",
    title: "Rugăciunea a şaptea",
    rubric: "(a Sfântului Simeon Noul Teolog)",
    paragraphs: [
      "Din buze spurcate, din inimă pângărită, din limbă necurată, din suflet spurcat, primeşte-mi rugăciunea, Hristoase al meu, şi, trecând cu vederea cuvintele şi obişnuinţele şi neruşinarea, dă-mi mie a grăi cu îndrăzneală cele ce voiesc, Hristoase al meu, dar, mai bine, învaţă-mă Tu ce se cuvine a face şi a grăi. Greşit-am mai mult decât desfrânata, care, aflând unde sălăşluieşti, cumpărând mir, cu îndrăzneală a venit să ungă picioarele Tale, ale Stăpânului meu Hristos şi Dumnezeului meu. Cum pe aceea, apropiindu-se din inimă, n-ai lepădat-o, nici de mine nu Te scârbi, Cuvinte, ci dă-mi să ţin şi să sărut picioarele Tale şi cu izvor de lacrimi, ca şi cu nişte mir de mult preţ, cu îndrăzneală să le ung. Spală-mă cu lacrimile mele, curăţeşte-mă cu ele, Cuvinte. Iartă-mi greşelile şi îmi dă îndreptare. Ştii mulţimea răutăţilor mele, ştii şi bubele mele, şi rănile mele le vezi, dar şi credinţa mi-o ştii, voinţa mi-o vezi şi suspinele mi le auzi. Nu se ascunde înaintea Ta, Doamne, Dumnezeul meu, Făcătorul şi Izbăvitorul meu, nici picătura de lacrimi, nici din picătură vreo parte. Cele încă nesăvârşite de mine le-au cunoscut ochii Tăi şi în cartea Ta se vor scrie şi cele încă nefăcute de mine. Vezi smerenia mea, vezi-mi osteneala câtă este şi toate păcatele mi le iartă, Dumnezeule a toate, încât, cu inima curată, cu gândul înfricoşat şi cu sufletul smerit să mă împărtăşesc cu Tainele Tale cele preacurate şi preasfinte, cu care se îndumnezeieşte şi se face viu tot cel ce mănâncă şi bea din ele cu inimă curată; că Tu ai zis, Stăpânul meu: „Tot cel ce mănâncă Trupul Meu şi bea Sângele Meu întru Mine rămâne şi Eu întru dânsul”. Cu totul adevărat este cuvântul Stăpânului şi Dumnezeului meu, că cel ce se împărtăşeşte cu Darurile cele dumnezeieşti şi îndumnezeitoare nu este singur, ci cu Tine, Hristoase al meu, Cel ce eşti din Lumina cea cu trei străluciri, Care luminează lumea. Deci, pentru ca să nu rămân singur, fără de Tine, Dătătorule de viaţă, suflarea mea, viaţa mea, bucuria mea, mântuirea lumii, pentru aceasta m-am apropiat de Tine, precum vezi, cu lacrimi şi cu sufletul umilit. Mă rog să iau izbăvire de greşelile mele şi să mă împărtăşesc fără de osândă cu Tainele Tale cele dătătoare de viaţă şi fără de prihană, ca să rămâi, precum ai zis, cu mine, cel de trei ori ticălos, ca să nu mă răpească cu vicleşug înşelătorul, aflându-mă depărtat de harul Tău şi înşelându-mă, să mă depărteze şi de îndumnezeitoarele Tale cuvinte. Pentru aceasta, cad înaintea Ta şi cu căldură strig către Tine: precum pe fiul cel pierdut şi pe desfrânata, care au venit la Tine, i-ai primit, aşa mă primeşte şi pe mine, desfrânatul şi spurcatul, Milostive, care cu suflet umilit vin acum la Tine. Ştiu, Mântuitorule, că altul ca mine n-a greşit Ţie, nici nu a făcut faptele pe care le-am făcut eu. Dar şi aceasta ştiu, că mărimea greşelilor mele şi mulţimea păcatelor mele nu covârşesc răbdarea cea multă a Dumnezeului meu, nici iubirea Lui de oameni cea înaltă; ci pe cei ce fierbinte se pocăiesc, cu mila îndurării îi curăţeşti şi îi luminezi şi cu lumina îi uneşti, părtaşi Dumnezeirii Tale făcându-i fără pizmuire şi – lucru străin de gândurile îngereşti şi omeneşti – de multe ori vorbeşti cu ei ca şi cu nişte prieteni ai Tăi adevăraţi. Acestea mă fac îndrăzneţ, acestea îmi dau aripi, Hristoase al meu, şi, punându-mi nădejdea în multele Tale binefaceri faţă de noi, bucurându-mă şi cutremurându-mă, cu focul mă împărtăşesc; iarbă uscată fiind eu, şi — străină minune! — mă răcoresc nears, ca rugul de demult, care, aprins fiind, nu se mistuia. Pentru aceasta, cu gând mulţumitor şi cu mulţumitoare inimă, cu mulţumitoare mădulare ale sufletului şi ale trupului meu mă închin şi Te măresc şi Te preaslăvesc pe Tine, Dumnezeul meu, Cel ce cu adevărat eşti binecuvântat, acum şi în veci. Amin.",
    ],
  },
  {
    id: "rugaciunea-8",
    title: "Rugăciunea a opta",
    rubric: "(a Sfântului Simeon Metafrastul)",
    paragraphs: [
      "Doamne, Cel ce singur eşti curat şi fără stricăciune, Care pentru nespusa milostivire a iubirii de oameni ai luat toată firea noastră din curatul şi feciorescul sânge al celei ce mai presus de fire Te-a născut pe Tine, cu venirea dumnezeiescului Duh şi cu bunăvoirea Tatălui celui de-a pururea veşnic, Hristoase Iisuse, înţelepciunea lui Dumnezeu, pacea şi puterea; Cel ce ai primit cu trupul Tău patimile cele de viaţă făcătoare şi mântuitoare: crucea, piroanele, suliţa, moartea – omoară-mi patimile cele trupeşti, care îmi strică sufletul. Cel ce cu îngroparea Ta ai prădat împărăţia iadului, îngroapă-mi sfaturile mele cele viclene, prin gânduri bune, şi risipeşte duhurile cele viclene. Cel ce cu învierea Ta cea de a treia zi şi de viaţă purtătoare ai ridicat pe strămoşul cel căzut, ridică-mă şi pe mine, cel ce am alunecat în păcat, punându-mi înainte chipuri de pocăinţă. Cel ce cu preaslăvită înălţarea Ta la cer ai îndumnezeit trupul pe care L-ai luat şi L-ai cinstit cu şederea de-a dreapta Tatălui, învredniceşte-mă prin împărtăşirea Sfintelor Tale Taine să dobândesc partea cea de-a dreapta, a celor mântuiţi. Cel ce prin pogorârea Mângâietorului Duh ai făcut vase cinstite pe sfinţii Tăi ucenici, arată-mă şi pe mine a fi locaş al venirii Lui. Cel ce vei veni iarăşi să judeci toată lumea întru dreptate, binevoieşte să Te întâmpin şi eu pe nori, pe Tine, Judecătorul şi Făcătorul meu, împreună cu toţi sfinţii Tăi, ca neîncetat să Te slăvesc şi să Te laud pe Tine, împreună cu Părintele Tău cel fără de început şi cu Preasfântul şi Bunul şi de viaţă Făcătorul Tău Duh, acum şi pururea şi în vecii vecilor. Amin.",
    ],
  },
  {
    id: "rugaciunea-9",
    title: "Rugăciunea a noua",
    rubric: "(a Sfântului Ioan Damaschin)",
    paragraphs: [
      "Înaintea uşilor casei Tale stau şi de gândurile cele rele nu mă depărtez. Ci Tu, Hristoase Dumnezeule, Care ai îndreptat pe vameşul şi ai miluit pe cananeianca şi ai deschis tâlharului uşile raiului, deschide-mi şi mie îndurările iubirii Tale de oameni şi mă primeşte pe mine, cel ce vin şi mă ating de Tine, ca pe desfrânata şi ca pe cea cu scurgerea de sânge. Că aceasta, atingându-se de marginea hainei Tale, îndată a luat tămăduire, iar cealaltă, cuprinzând preacuratele Tale picioare, a dobândit dezlegare de păcate. Iar eu, ticălosul, întreg Trupul Tău cutezând a-L primi, să nu fiu ars, ci mă primeşte ca şi pe dânsele şi-mi luminează simţirile cele sufleteşti, arzând nelegiuirile păcatelor mele, pentru rugăciunile celei ce fără de sămânţă Te-a născut pe Tine şi ale puterilor cereşti, că binecuvântat eşti în vecii vecilor. Amin.",
    ],
  },
  {
    id: "rugaciunea-10",
    title: "Rugăciunea a zecea",
    rubric: "(a Sfântului Ioan Gură de Aur)",
    paragraphs: [
      "Cred, Doamne, şi mărturisesc că Tu eşti cu adevărat Hristos, Fiul lui Dumnezeu celui viu, Care ai venit în lume să mântuieşti pe cei păcătoşi, dintre care cel dintâi sunt eu. Cred, de asemenea, că acesta este însuşi preacurat Trupul Tău şi acesta este însuşi scump Sângele Tău. Deci, mă rog Ţie: miluieşte-mă şi-mi iartă greşelile mele cele de voie şi cele fără de voie, cele cu cuvântul sau cu lucrul, cele cu ştiinţa şi cu neştiinţa, şi mă învredniceşte fără de osândă să mă împărtăşesc cu preacuratele Tale Taine, spre iertarea păcatelor şi spre viaţa de veci. Amin.",
    ],
  },
  {
    id: "invatatura",
    title: "Învăţătură despre primirea Sfintei Împărtăşanii:",
    paragraphs: [
      "Şi după ce s-au citit toate aceste rugăciuni şi altele pe care le doreşte creştinul, fiind împăcat cu toată lumea, merge la Sfânta Liturghie, se roagă şi se împărtăşeşte cu Trupul şi Sângele lui Hristos. Iar aceasta să nu o facă doar o dată sau de patru ori pe an, ci cât mai des, chiar şi în fiecare săptămână, dacă nu este oprit de la împărtășire pentru unele păcate grave.",
      "Pentru ca un creştin să se poată împărtăşi în fiecare duminică sau măcar o dată la 2-3 duminici (nu mai rar), este suficient să ţină posturile de miercuri şi vineri (dacă nu e perioada unui post de durată), să-şi facă sistematic rugăciunile de dimineaţă şi de seară, să se ferească de păcate şi să vieţuiască în dragoste de Dumnezeu şi de aproapele, aşa cum învaţă Evanghelia. Posturi speciale sau perioade restrictive în ceea ce priveşte Împărtăşania nu există în Tradiţia Bisericii, iar credincioşii trebuie să dorească şi să ceară cât mai des acest „Dar al nemuririi”, alegându-şi duhovnici care să-i povăţuiască corect pe calea mântuirii.",
      "După primirea dumnezeieştii Împărtăşanii, credinciosul trebuie să ducă şi mai departe o viaţă evlavioasă şi smerită, mulţumind lui Dumnezeu pentru Darul primit. Dacă este o perioadă de post, acesta nu se întrerupe odată cu împărtăşirea, iar dacă nu este post, cel împărtăşit se poate bucura de toate bunătăţile lui Dumnezeu, dar cu cumpătare.",
    ],
  },
];
