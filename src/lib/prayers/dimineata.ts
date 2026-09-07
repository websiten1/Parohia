import type { PrayerStep } from "./types";

/** Rugăciunile dimineţii — one prayer per step, advanced with the arrow. */
export const DIMINEATA: PrayerStep[] = [
  {
    id: "incepatoare",
    title: "Rugăciunile începătoare",
    rubric:
      "După ce creştinul se scoală din pat şi se spală, înainte de a începe vreun lucru, se îndreaptă spre icoane, aprinde candela sau o lumânare, aşteaptă puţine clipe până se linişteşte, apoi cu multă atenţie începe aşa:",
    paragraphs: [
      "Doamne, Iisuse Hristoase, Fiul lui Dumnezeu, pentru rugăciunile Preacuratei Maicii Tale şi ale tuturor Sfinţilor, miluieşte-ne pe noi. Amin.",
      "Apoi:",
      "Slavă Ţie, Dumnezeul nostru, slavă Ţie.",
      "Împărate ceresc, Mângâietorule, Duhul adevărului, Care pretutindenea eşti şi toate le plineşti, Vistierul bunătăţilor şi dătătorule de viaţă, vino şi sălăşluieşte întru noi, şi ne curăţeşte pe noi de toată întinăciunea şi mântuieşte, Bunule, sufletele noastre.",
      "Sfinte Dumnezeule, Sfinte tare, Sfinte fără de moarte, miluieşte-ne pe noi (de 3 ori).",
      "Slavă Tatălui şi Fiului şi Sfântului Duh; şi acum şi pururea şi în vecii vecilor. Amin.",
      "Preasfântă Treime, miluieşte-ne pe noi. Doamne, curăţeşte-ne de păcatele noastre; Stăpâne, iartă fărădelegile noastre; Sfinte, cercetează şi vindecă neputinţele noastre, pentru numele Tău.",
      "Doamne miluieşte (de 3 ori).",
      "Slavă..., Şi acum...",
      "Tatăl nostru, Care eşti în ceruri, sfinţească-Se numele Tău, vie Împărăţia Ta, facă-se voia Ta, precum în cer, aşa şi pe pământ. Pâinea noastră cea spre fiinţă, dă-ne-o nouă astăzi, şi ne iartă nouă greşelile noastre, precum şi noi iertăm greşiţilor noştri. Şi nu ne duce pe noi în ispită, ci ne izbăveşte de cel viclean. Că a Ta este împărăţia şi puterea şi slava în veci. Amin.",
    ],
    note:
      "(Aceste rugăciuni, numite „rugăciunile începătoare”, se vor pune la începutul fiecărui moment de rugăciune, indiferent de timpul zilei. În perioada de la Paşti până la Înălţarea Domnului, în loc de „Împărate Ceresc” se spune „Hristos a înviat din morţi, cu moartea pe moarte călcând şi celor din morminte viaţă dăruindu-le” – de 3 ori; iar de la Înălţare până la Pogorârea Sfântului Duh, se trece direct la „Sfinte Dumnezeule…”. În restul anului, „rugăciunile începătoare” se rostesc aşa cum apar ele mai sus.)",
  },
  {
    id: "tropare",
    title: "Troparele",
    rubric: "Apoi aceste tropare:",
    paragraphs: [
      "Sculându-ne din somn, cădem către Tine, Bunule, şi a îngerilor cântare strigăm Ţie, Puternice: Sfânt, Sfânt, Sfânt eşti Dumnezeule; pentru rugăciunile îngerilor Tăi, miluieşte-ne pe noi.",
      "Slavă Tatălui şi Fiului şi Sfântului Duh.",
      "Din pat şi din somn m-ai ridicat, Doamne; mintea mea o luminează, inima şi buzele mele le deschide, ca să Te laud pe Tine, Preasfântă Treime: Sfânt, Sfânt, Sfânt eşti Dumnezeule; pentru rugăciunile tuturor sfinţilor Tăi, miluieşte-ne pe noi.",
      "Şi acum şi pururea şi în vecii vecilor. Amin.",
      "Fără de veste Judecătorul va veni şi faptele fiecăruia se vor descoperi; deci cu frică să strigăm: Sfânt, Sfânt, Sfânt eşti Dumnezeule; pentru Născătoarea de Dumnezeu, miluieşte-ne pe noi.",
      "Doamne miluieşte (de 12 ori),",
    ],
  },
  {
    id: "din-somn-sculandu-ma",
    title: "Din somn sculându-mă",
    rubric: "apoi rugăciunea aceasta:",
    paragraphs: [
      "Din somn sculându-mă, îţi mulţumesc Ţie, Preasfântă Treime, că pentru multa Ta bunătate şi îndelunga-răbdare nu Te-ai mâniat pe mine leneşul şi păcătosul, nici nu m-ai pierdut împreună cu fărădelegile mele, ci ai făcut iubire de oameni după obicei; şi în nesimţirea somnului zăcând eu, m-ai ridicat, ca dis-de-dimineaţă să slăvesc puterea Ta. Deci, acum luminează-mi ochii gândului, deschide-mi gura ca să învăţ cuvintele Tale, să înţeleg poruncile Tale, să fac voia Ta, să-Ţi cânt în mărturisirea inimii şi să laud preasfânt numele Tău: al Tatălui şi al Fiului şi al Sfântului Duh, acum şi pururea şi în vecii vecilor. Amin.",
    ],
  },
  {
    id: "veniti-sa-ne-inchinam",
    title: "Veniţi să ne închinăm",
    rubric: "Apoi:",
    paragraphs: [
      "Veniţi să ne închinăm Împăratului nostru Dumnezeu.",
      "Veniţi să ne închinăm şi să cădem la Hristos, Împăratul nostru Dumnezeu.",
      "Veniţi să ne închinăm şi să cădem la Însuşi Hristos, Împăratul şi Dumnezeul nostru (cu trei închinăciuni).",
    ],
  },
  {
    id: "psalmul-50",
    title: "Psalmul 50",
    rubric: "Apoi îndată:",
    paragraphs: [
      "Miluieşte-mă, Dumnezeule, după mare mila Ta şi după mulţimea îndurărilor Tale, şterge fărădelegea mea. Spală-mă cu totul de fărădelegea mea şi de păcatul meu mă curăţeşte. Că fărădelegea mea eu o cunosc şi păcatul meu înaintea mea este pururea; Ţie Unuia am greşit şi rău înaintea Ta am făcut, aşa încât îndreptăţit eşti întru cuvintele Tale şi la Judecată vei fi biruitor.",
      "Iată întru fărădelegi m-am zămislit şi în păcate m-a născut maica mea; Tu însă adevărul ai iubit; cele nearătate şi cele ascunse ale înţelepciunii Tale, mi-ai arătat mie. Stropi-mă-vei cu isop şi mă voi curăţi; spăla-mă-vei şi mai mult decât zăpada mă voi albi. Auzului meu vei da bucurie şi veselie; bucura-se-vor oasele cele smerite. Întoarce faţa Ta de la păcatele mele şi toate fărădelegile mele şterge-le. Inimă curată zideşte întru mine, Dumnezeule, şi duh drept înnoieşte întru cele dinlăuntru ale mele. Nu mă lepăda de la faţa Ta şi Duhul Tău cel Sfânt nu-l lua de la mine. Dă-mi iarăşi bucuria mântuirii Tale şi cu duh stăpânitor mă întăreşte. Învăţa-voi pe cei fără de lege căile Tale şi cei nelegiuiţi la Tine se vor întoarce. Izbăveşte-mă de vărsarea de sânge, Dumnezeule, Dumnezeul mântuirii mele, şi limba mea va slăvi dreptatea Ta. Doamne, buzele mele vei deschide şi gura mea va vesti lauda Ta. Căci jertfă de ai fi voit, Ţi-aş fi dat, dar nici arderile-de-tot nu le binevoieşti. Jertfa plăcută lui Dumnezeu este duhul zdrobit; inima zdrobită şi smerită Dumnezeu nu o va urgisi.",
      "Fă bine, Doamne, întru bunăvoirea Ta, Sionului, şi să se zidească zidurile Ierusalimului. Atunci vei binevoi jertfa dreptăţii, prinosul şi arderile-de-tot; atunci vor pune pe altarul Tău viţei.",
    ],
  },
  {
    id: "crezul",
    title: "Simbolul credinţei (Crezul)",
    paragraphs: [
      "Cred întru unul Dumnezeu, Tatăl Atotţiitorul, Făcătorul cerului şi al pământului, al tuturor celor văzute şi nevăzute.",
      "Şi întru unul Domn Iisus Hristos, Fiul lui Dumnezeu, Unul Născut, Care din Tatăl S-a născut mai înainte de toţi vecii: Lumină din Lumină, Dumnezeu adevărat din Dumnezeu adevărat, născut, nu făcut, Cel de o fiinţă cu Tatăl, prin Care toate s-au făcut; Care, pentru noi oamenii şi pentru a noastră mântuire, S-a pogorât din ceruri şi S-a întrupat de la Duhul Sfânt şi din Maria Fecioara şi S-a făcut om; Şi S-a răstignit pentru noi în zilele lui Ponţiu Pilat şi a pătimit şi S-a îngropat; Şi a înviat a treia zi după Scripturi; Şi S-a suit la ceruri şi şade de-a dreapta Tatălui şi iarăşi va să vină, cu slavă, să judece viii şi morţii, a Cărui Împărăţie nu va avea sfârşit.",
      "Şi întru Duhul Sfânt, Domnul de viaţă Făcătorul, Care din Tatăl purcede, Cel ce împreună cu Tatăl şi cu Fiul este închinat şi slăvit, Care a grăit prin proroci.",
      "Întru una, sfântă, sobornicească şi apostolească Biserică;",
      "Mărturisesc un botez spre iertarea păcatelor;",
      "Aştept învierea morţilor şi viaţa veacului ce va să fie. Amin.",
    ],
  },
  {
    id: "macarie-1",
    title: "Rugăciunea întâi, a Sfântului Macarie cel Mare",
    paragraphs: [
      "Doamne, curăţeşte-mă pe mine păcătosul, că niciodată n-am făcut bine înaintea Ta, dar izbăveşte-mă de cel viclean şi fă să fie întru mine voia Ta, ca fără de osândă să deschid gura mea cea nevrednică şi să laud preasfânt numele Tău: al Tatălui şi al Fiului şi al Sfântului Duh, acum şi pururea şi în vecii vecilor. Amin.",
    ],
  },
  {
    id: "macarie-2",
    title: "Rugăciunea a doua, a Sfântului Macarie cel Mare",
    paragraphs: [
      "Din somn sculându-mă, cântare aduc Ţie, Mântuitorule, şi înaintea Ta căzând, strig: nu mă lăsa să adorm în moartea păcatelor, ci mă miluieşte, Cel ce Te-ai răstignit de voie, şi pe mine, cel ce zac în lene, degrab mă scoală şi mă mântuieşte, ca să stau înaintea Ta în rugăciuni; iar după somnul nopţii să-mi luminezi ziua fără de păcat, Hristoase Doamne, şi mă mântuieşte.",
    ],
  },
  {
    id: "macarie-3",
    title: "Rugăciunea a treia, a Sfântului Macarie cel Mare",
    paragraphs: [
      "Sculându-mă din somn, către Tine, Stăpâne, Iubitorule de oameni, scap şi spre lucrurile Tale mă nevoiesc. Mă rog Ţie, ajută-mi cu milostivirea Ta în toată vremea şi în tot lucrul. Izbăveşte-mă de toate lucrurile rele ale lumii şi de sporirea diavolească, mântuieşte-mă şi mă du întru Împărăţia Ta cea veşnică. Că Tu eşti Făcătorul meu şi Purtătorul de grijă şi Dătătorul a tot binele şi în Tine este toată nădejdea mea şi Ţie slavă înalţ, acum şi pururea şi în vecii vecilor. Amin.",
    ],
  },
  {
    id: "macarie-4",
    title: "Rugăciunea a patra, a Sfântului Macarie cel Mare",
    paragraphs: [
      "Doamne, Cel ce cu multă bunătatea Ta şi cu îndurările Tale cele mari mi-ai dat mie, robului Tău, de am trecut timpul nopţii acesteia fără ispită din răutatea pizmaşului, Tu Însuţi Stăpâne, Făcătorule a toate câte sunt, învredniceşte-mă, întru adevărată lumina Ta, să fac voia Ta cu inimă luminată, acum şi pururea şi în vecii vecilor. Amin.",
    ],
  },
  {
    id: "rugaciunea-5",
    title: "Rugăciunea a cincea",
    paragraphs: [
      "Doamne Atotţiitorule, Dumnezeul puterilor şi a tot trupul, Care între cele de sus locuieşti şi spre cele de jos priveşti; Cel ce încerci inimile şi rărunchii, şi adâncul omului îl ştii cu adevărat; Lumină fără de început şi pururea fiitoare, în care nu este mutare sau umbră de schimbare; Însuţi, Împărate fără de moarte, primeşte rugăciunile pe care le aducem Ţie din gurile noastre cele necurate în acest ceas, îndrăznind la mulţimea milelor Tale. Iartă nouă greşelile cele cu cuvântul, cu lucrul, din ştiinţă şi din neştiinţă; curăţeşte-ne pe noi de toată întinăciunea trupului şi a duhului, făcându-ne pe noi casă Cinstitului şi Sfântului Tău Duh. Şi ne dăruieşte nouă cu inimi veghetoare şi curate să trecem toată noaptea acestei vieţi, aşteptând luminata şi sfânta zi a Unuia-Născut Fiului Tău, a Domnului Dumnezeului şi Mântuitorului nostru Iisus Hristos, când va veni pe pământ cu slavă să judece pe toţi şi să plătească fiecăruia după faptele lui. Ca să nu fim aflaţi zăcând şi dormitând, ci priveghind şi sculaţi în lucrarea poruncilor Lui, şi să fim gata a intra în bucuria şi cămara slavei Lui celei dumnezeieşti, unde este glasul cel neîncetat celor ce Te laudă şi nespusa dulceaţă a celor ce văd pururea frumuseţea cea nespusă a slavei Tale. Că Tu eşti lumina cea adevărată, Care luminezi şi sfinţeşti toate, şi pe Tine Te laudă toată făptura în veci. Amin.",
    ],
  },
  {
    id: "rugaciunea-6",
    title: "Rugăciunea a şasea",
    paragraphs: [
      "Pe Tine Te binecuvântăm, Dumnezeule preaînalte şi Doamne al milelor, Cel ce faci cu noi pururea lucruri mari şi neînţelese, slăvite şi prea minunate, care nu au număr. Cel ce ne-ai dat nouă somn spre odihna neputinţelor noastre şi spre repaos de ostenelile trupului, mulţumindu-Ţi că nu ne-ai pierdut pe noi cu fărădelegile noastre, ci după obicei Te-ai arătat iubitor de oameni şi dis-de-dimineaţă ne-ai ridicat pe noi ca să slăvim stăpânirea Ta. Pentru aceea, ne rugăm bunătăţii Tale celei neasemănate: luminează ochii gândului nostru şi ridică mintea noastră din somnul cel greu al lenei şi ne deschide gura noastră şi o umple de laudele Tale ca să putem în linişte a cânta, a lăuda şi a ne mărturisi pururea Ţie-Dumnezeului Celui slăvit în toate şi de toţi-Tatălui Celui fără de început, împreună şi Unuia-Născut Fiului Tău, şi Preasfântului şi bunului şi de viaţă făcătorului Tău Duh, acum şi pururea şi în vecii vecilor. Amin.",
    ],
  },
  {
    id: "ioan-gura-de-aur",
    title: "Rugăciunea a şaptea, a Sfântului Ioan Gură de Aur",
    rubric: "(24 de stihuri, după numărul ceasurilor nopţii şi ale zilei)",
    paragraphs: [
      "Pentru ceasurile nopţii:",
      "1. Doamne, nu mă lipsi pe mine de binele Tău cel ceresc.",
      "2. Doamne, izbăveşte-mă de chinurile cele veşnice.",
      "3. Doamne, de am greşit fie cu mintea, fie cu gândul, sau cu cuvântul, sau cu lucrul, iartă-mă.",
      "4. Doamne, izbăveşte-mă de toată neştiinţa şi uitarea, de toată uşurătatea şi de nesimţirea cea împietrită.",
      "5. Doamne, izbăveşte-mă de toată ispitirea.",
      "6. Doamne, luminează-mi inima pe care a întunecat-o pofta cea rea.",
      "7. Doamne, eu ca un om am greşit, iar Tu, ca un Dumnezeu îndurător, miluieşte-mă, văzând neputinţa sufletului meu.",
      "8. Doamne, trimite mila Ta în ajutorul meu ca să preaslăvesc preasfânt numele Tău.",
      "9. Doamne, Iisuse Hristoase, scrie-mă pe mine, robul Tău, în cartea vieţii şi-mi dăruieşte sfârşit bun.",
      "10. Doamne Dumnezeul meu, deşi n-am făcut nici un bine înaintea Ta, dă-mi, după harul Tău, să pun început bun.",
      "11. Doamne, stropeşte inima mea cu roua harului Tău.",
      "12. Doamne, al cerului şi al pământului, pomeneşte-mă pe mine, păcătosul, ruşinatul şi necuratul robul Tău, întru Împărăţia Ta. Amin.",
      "Pentru ceasurile zilei:",
      "1. Doamne, primeşte-mă întru pocăinţă.",
      "2. Doamne, nu mă lăsa pe mine.",
      "3. Doamne, nu mă duce pe mine în ispită.",
      "4. Doamne, dă-mi cuget bun.",
      "5. Doamne, dă-mi lacrimi şi aducere aminte de moarte şi umilinţă.",
      "6. Doamne, dă-mi cuget să mărturisesc toate păcatele mele.",
      "7. Doamne, dă-mi smerenie, curăţie şi ascultare.",
      "8. Doamne, dă-mi răbdare, voie nebiruită şi blândeţe.",
      "9. Doamne, sădeşte în mine rădăcina bunătăţilor şi frica Ta în inima mea.",
      "10. Doamne, învredniceşte-mă să Te iubesc cu tot sufletul şi gândul meu şi să fac în toate voia Ta.",
      "11. Doamne, apără-mă de oamenii gâlcevitori, de diavoli, de patimile trupeşti şi de toate celelalte lucruri necuviincioase.",
      "12. Doamne, ştiu că faci precum vrei Tu, deci să fie şi întru mine, păcătosul, voia Ta, că binecuvântat eşti în veci. Amin.",
    ],
  },
  {
    id: "inger-pazitor",
    title: "Rugăciunea a opta, către sfântul înger păzitor",
    paragraphs: [
      "Sfinte îngere, cel ce stai înaintea pătimaşului meu suflet şi a vieţii mele celei ticăloase, nu mă lăsa pe mine, păcătosul, nici nu te depărta de mine pentru neînfrânarea mea. Nu da loc diavolului celui viclean să-mi stăpânească cu silnicie acest trup muritor; întăreşte mâna mea cea slabă şi neputincioasă şi mă îndreptează la calea mântuirii. Aşa, sfinte îngere al lui Dumnezeu, păzitorul şi acoperitorul sufletului şi al trupului meu cel ticălos, iartă-mi toate cu câte te-am scârbit astăzi şi în toate zilele vieţii mele. Acoperă-mă şi mă păzeşte de toată ispita celui potrivnic, ca să nu mânii cu nici un păcat pe Dumnezeu; şi te roagă pentru mine către Domnul, ca să mă întărească întru frica Sa şi vrednic să mă arate pe mine, robul Său, bunătăţii Sale. Amin.",
    ],
  },
  {
    id: "nascatoare",
    title: "Rugăciunea a noua, către Preasfânta Născătoare de Dumnezeu",
    paragraphs: [
      "Preasfântă Stăpâna mea de Dumnezeu Născătoare, cu sfintele şi preaputernicile tale rugăciuni, izgoneşte de la mine ticălosul deznădăjduirea, uitarea, necunoştinţa, nepurtarea de grijă şi toate gândurile cele întinate, cele rele şi hulitoare de la ticăloasa mea inimă şi de la întunecata mea minte. Şi stinge văpaia poftelor mele, că sărac sunt şi ticălos. Izbăveşte-mă de relele amintiri şi năravuri, şi de toate faptele cele rele mă slobozeşte. Că binecuvântată eşti de toate neamurile şi se slăveşte preacinstitul tău nume în vecii vecilor. Amin.",
    ],
  },
  {
    id: "efrem-sirul",
    title: "Rugăciunea Sfântului Efrem Sirul",
    rubric:
      "În toate posturile, de luni până vineri (cu excepţia zilelor de sărbătoare), se recomandă a se zice şi rugăciunea Sf. Efrem Sirul, cu 3 metanii:",
    paragraphs: [
      "Doamne şi Stăpânul vieţii mele, duhul trândăviei, al grijii de multe, al iubirii de stăpânire şi al vorbirii în deşert nu mi-l da mie! (o metanie)",
      "Iar duhul curăţiei, al gândului smerit, al răbdării şi al dragostei, dăruieşte-l mie, slugii Tale! (o metanie)",
      "Aşa, Doamne, Împărate, dăruieşte-mi ca să-mi văd greşelile mele şi să nu osândesc pe fratele meu; că binecuvântat eşti în vecii vecilor. Amin. (o metanie)",
    ],
  },
  {
    id: "sfarsitul",
    title: "Sfârşitul",
    rubric: "Apoi sfârşitul:",
    paragraphs: [
      "Cuvine-se cu adevărat a te ferici pe tine, Născătoare de Dumnezeu, cea pururea fericită şi întru totul fără-prihană, şi Maica Dumnezeului nostru.",
      "Pe cea mai cinstită decât heruvimii şi mai slăvită fără-de-asemănare decât serafimii, care fără stricăciune pe Dumnezeu-Cuvântul a născut; pe tine, cea cu adevărat Născătoare de Dumnezeu, te mărim.",
      "Slavă…, Şi acum…, Doamne miluieşte (de 3 ori).",
      "Pentru rugăciunile Preacuratei Maicii Tale şi ale tuturor Sfinţilor, Doamne, Iisuse Hristoase Dumnezeul nostru, miluieşte-ne pe noi.",
    ],
  },
];
