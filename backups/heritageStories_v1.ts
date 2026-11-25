import { Chef, Dish } from '../types';

export interface DishHeritageStory {
  history: string;
  secret: string;
  vintage: string;
}

/**
 * Archivio curato delle storie, tecniche e origini per ogni piatto della sezione Radici.
 * Ogni voce è unica e coerente con la tradizione culturale e lo stile del cuoco.
 */
const DISH_HERITAGE_STORIES: Record<string, DishHeritageStory> = {
  // --- CUOCHI REALI ATTIVI SU MESA ---
  'dish-app-chef-0ad2nt-1': {
    history: "Nella cucina di Tizita questo piatto nasce dal piacere di trasformare la spesa fresca di giornata in una tavola accogliente, dove ogni portata racconta il ritmo lento delle domeniche in famiglia.",
    secret: "Prepara le basi al momento con cotture dolci a fuoco controllato, bilanciando erbe fresche e condimenti solo a fine cottura per preservare profumi nitidi.",
    vintage: "Cucina casalinga italiana contemporanea • Pordenone e tradizioni familiari"
  },
  'dish-app-reg-usrtuuzk-1': {
    history: "Pensata come piatto simbolo dell'ospitalità domestica su MESA, questa ricetta unisce la cura artigianale di casa alla genuinità dei prodotti stagionali del territorio friulano.",
    secret: "Seleziona materie prime fresche in piccoli lotti quotidiani e cura la mantecatura finale lontano dalla fiamma per mantenere consistenze morbide e avvolgenti.",
    vintage: "Tradizione gastronomica casalinga del Nord-Est italiano"
  },
  'dish-app-chef-hfldk5-1': {
    history: "Ispirata alle tavole conviviali dell'altopiano etiope, dove il pasto è un rito di condivisione che scalda la casa con aromi caldi di spezie tostate e lunghe preparazioni pazienti.",
    secret: "Tosta a secco le spezie prima della cottura e lascia sobbollire lentamente il fondo aromatico affinché ogni ingrediente assorba calore senza perdere freschezza.",
    vintage: "Tradizione conviviale dell'Etiopia • Ricetta familiare di Addis Abeba"
  },

  // --- EUROPA ---
  'd1_1': {
    history: "Nata tra le cucine bolognesi come piatto della festa grande, la lasagna di Nonna Maria porta a Pordenone il gesto antico della sfoglia tirata sottile a mattarello sulla spianatoia di legno.",
    secret: "Lascia sobbollire il ragù di manzo e maiale in casseruola per 6 ore con un pizzico di noce moscata e aggiunge un mestolo di latte intero caldo per smorzare l'acidità del pomodoro.",
    vintage: "Emilia-Romagna, Italia • Documentata nei ricettari bolognesi dal XVI secolo"
  },
  'd1_2': {
    history: "Figlia delle trattorie popolari di Trastevere nel dopoguerra, questa carbonara rifiuta ogni scorciatoia e vive dell'incontro istantaneo tra calore della pasta, grasso del guanciale e tuorli montati.",
    secret: "Suda il guanciale di Amatrice a fuoco dolcissimo per renderlo croccante fuori e scioglievole dentro, poi manteca tuorli biologici e Pecorino Romano DOP a fuoco rigorosamente spento.",
    vintage: "Roma (Trastevere), Lazio • Tradizione popolare romana dal 1944"
  },
  'd9_1': {
    history: "Piatto contadino della Borgogna diventato emblema dei bistrot parigini: Jean-Luc lo prepara come nelle domeniche d'autunno in Francia, trasformando un taglio tenace in pura morbidezza.",
    secret: "Marina il pollo ruspante per una notte intera nel vino rosso corposo con cipolline borettane e timo, poi riduce la salsa fino a ottenere una glassa lucida e vellutata.",
    vintage: "Borgogna e Parigi, Francia • Classico della cucina rurale francese dall'Ottocento"
  },
  'd11_1': {
    history: "Sulle tavole soleggiate di Creta la moussaka riunisce il profumo dell'orto estivo e il calore delle spezie d'Oriente: Nikos la cuoce seguendo la teglia generosa di sua madre.",
    secret: "Aromatizza il ragù d'agnello con cannella in stecche e chiodi di garofano pestati al momento, stendendo le fette di melanzana solo dopo averle asciugate su carta da cucina.",
    vintage: "Isola di Creta, Grecia • Tradizione egeo-bizantina tramandata in famiglia"
  },
  'd27_1': {
    history: "Dalle osterie bavaresi alle feste di paese ai piedi delle Alpi, questo abbinamento celebra l'arte paziente della fermentazione invernale che Hans conserva con rigore ad Aviano.",
    secret: "Lascia fermentare il cavolo cappuccio per almeno 4 settimane con bacche di ginepro e cumino, poi rosola i bratwurst in padella con un goccio di birra chiara prima di sfumarli.",
    vintage: "Baviera, Germania • Tradizione delle birrerie e gastronomie alpine dal Medioevo"
  },
  'd28_1': {
    history: "Nata nelle taverne del Bairro Alto a Lisbona grazie all'oste che le diede il nome, questa ricetta di Maria celebra il legame viscerale dei navigatori portoghesi con il merluzzo salato.",
    secret: "Dissala il baccalà in acqua fredda per 48 ore cambiando l'acqua più volte, poi lo sfalda a mano e lo amalgama con patatine a fiammifero e uova tenute morbidissime fuori dal fuoco.",
    vintage: "Lisbona (Bairro Alto), Portogallo • Classico atlantico del XIX secolo"
  },
  'd31_1': {
    history: "Simbolo delle sere d'inverno in Scandinavia, le polpettine di Sven raccontano la tavola svedese dove il sapore sapido della carne incontra la nota boschiva e acidula dei mirtilli rossi.",
    secret: "Imbeve il pangrattato nella panna fresca prima di unirlo al macinato misto con cipolla stufata nel burro, completando la cottura nella sua salsa gravy bruna ridotta lentamente.",
    vintage: "Svezia • Ricetta domestica scandinava codificata dal XVIII secolo"
  },
  'd32_1': {
    history: "Piccolo scrigno dorato nato nella Palermo araba del IX secolo per portare con sé un pasto completo: Don Calogero modella a mano ogni arancina esattamente come nei mercati di Ballarò.",
    secret: "Cuoce il riso nel brodo allo zafferano e lo lascia raffreddare su marmo, poi sigilla al centro il ragù freddo di frigorifero con piselli e caciocavallo prima della doppia panatura croccante.",
    vintage: "Palermo, Sicilia • Street food siciliano dalle radici arabo-normanne (IX secolo)"
  },
  'd33_1': {
    history: "Nata nelle campagne del Nord dell'Inghilterra come confortante piatto della domenica per valorizzare gli stufati d'agnello, nella cucina di Emma profuma di focolare e pioggia fuori dalla finestra.",
    secret: "Sfuma l'agnello macinato con birra scura Stout artigianale e salsa Worcestershire, quindi riga con i rebbi della forchetta il purè al burro per ottenere una crosticina croccante al forno.",
    vintage: "Nord dell'Inghilterra e Scozia • Tradizione rurale britannica di fine Settecento"
  },
  'd34_1': {
    history: "Ispirata alle grandi padelle condivise lungo la laguna dell'Albufera a Valencia, la paella di Jordi trasforma il pasto in un rito collettivo in cui nessuno tocca il riso mentre assorbe il mare.",
    secret: "Usa esclusivamente riso bomba nel fumetto di crostacei e zafferano tostato, lasciando la paellera immobile negli ultimi minuti sul fuoco vivo per creare l'irresistibile crosticina 'socarrat'.",
    vintage: "Valencia (Albufera), Spagna • Rito conviviale levantino del XVIII secolo"
  },

  // --- AFRICA ---
  'd3_1': {
    history: "Nessuna festa a Lagos è completa senza il profumo del Party Jollof: per Adunni questo piatto rosso rubino rappresenta l'orgoglio della cucina nigeriana condivisa tra amici e musica.",
    secret: "Frulla pomodori, peperoni rossi arrostiti e scotch bonnet riducendoli fino a far caramellare gli zuccheri sul fondo della pentola, regalando al riso parboiled l'inconfondibile nota affumicata.",
    vintage: "Lagos, Nigeria • Eredità dell'Impero Wolof diffusa in tutta l'Africa Occidentale"
  },
  'd3_2': {
    history: "Nato tra i mercati notturni del Nord della Nigeria, il Suya di Adunni porta il fumo delle braci di strada e il profumo tostato delle spezie yaji direttamente alla tavola di casa.",
    secret: "Avvolge le fettine sottili di manzo nella polvere di arachidi pressate Kuli-Kuli con zenzero essiccato, chiodi di garofano e peperoncino, lasciando marinare per almeno 4 ore prima della griglia.",
    vintage: "Nigeria Settentrionale (tradizione Hausa) • Street food serale dell'Africa Occidentale"
  },
  'd3_3': {
    history: "Piatto delle grandi occasioni nell'etnia Yoruba e Igbo, la zuppa Egusi unisce la ricchezza dei semi di melone essiccati alla consistenza elastica e vellutata del Pounded Yam.",
    secret: "Tosta dolcemente la pasta di semi di egusi nell'olio di palma rosso con gamberetti secchi tritati e foglie verdi amare, mescolando spesso per creare piccoli grumi saporiti nella zuppa.",
    vintage: "Sud della Nigeria (tradizione Yoruba e Igbo) • Cucina cerimoniale dell'Africa Occidentale"
  },
  'd4_1': {
    history: "Dichiarato patrimonio culturale UNESCO, il Thieboudienne è l'anima della Teranga senegalese: ogni mattina Moussa sceglie il pesce fresco per ricreare l'abbondanza dei mercati di Dakar.",
    secret: "Farcisce la cernia fresca con un battuto 'nokoss' di prezzemolo, aglio e peperoncino verde prima di rosolarla, cuocendo poi il riso spezzato nel brodo saporito di verdure e yet fermentato.",
    vintage: "Saint-Louis e Dakar, Senegal • Patrimonio Immateriale UNESCO nato nel XIX secolo"
  },
  'd4_2': {
    history: "Originario della regione verdeggiante della Casamance nel Sud del Senegal, lo Yassa di Moussa conquista per l'equilibrio sorprendente tra dolcezza delle cipolle e sferzata agrumata del lime.",
    secret: "Marina il pollo per 12 ore con succo di lime fresco, senape di Digione e tante cipolle affettate fini, poi griglia la carne sulla brace prima di terminarla nella salsa caramellata.",
    vintage: "Regione della Casamance, Senegal • Classico delle feste senegalesi"
  },
  'd4_3': {
    history: "Sulle spiagge di Dakar al tramonto i pastels fumano nei cestini: Moussa li frigge al momento con ripieno generoso di pesce azzurro e una salsa al pomodoro che pizzica il palato.",
    secret: "Lavora l'impasto con un pizzico di noce moscata e lo stende sottilissimo per sigillare lo sgombro sfilettato a mano, servendoli subito con salsa calda di habanero e prezzemolo.",
    vintage: "Dakar e costa atlantica del Senegal • Cibo di strada costiero tradizionale"
  },
  'd8_1': {
    history: "Cotto nella terracotta conica che Fatima custodisce da tre generazioni, questo tagine racconta i banchetti di Marrakech dove spezie calde e frutta dolce si fondono senza bisogno d'acqua aggiunta.",
    secret: "Sigilla lo stufato d'agnello a fuoco bassissimo sotto il coperchio a cono affinché il vapore ricada continuo sulla carne, caramellando le prugne secche negli ultimi 15 minuti con miele e cannella.",
    vintage: "Marrakech e Fez, Marocco • Cucina berbera e imperiale marocchina dal IX secolo"
  },
  'd8_2': {
    history: "Gioiello della cucina di palazzo andaluso-marocchina, la Pastilla di Fatima racchiude il contrasto raffinato tra croccantezza dorata della sfoglia, tenerezza delle carni e profumo di cannella.",
    secret: "Cuoce separatamente il pollo nello zafferano, le uova strapazzate nel fondo aromatico e le mandorle tostate con zucchero a velo, assemblando gli strati croccanti di pasta brick solo prima del forno.",
    vintage: "Fez e Tétouan, Marocco • Eredità andaluso-araba delle grandi tavole marocchine"
  },
  'd8_3': {
    history: "Il venerdì in Marocco riunisce tutta la famiglia attorno a un solo grande piatto di couscous fumante: Fatima lavora la semola a mano per onorare il rito dell'ospitalità maghrebina.",
    secret: "Incoccia e cuoce la semola tre volte al vapore nella couscoussiera sopra il brodo di sette verdure, zafferano e coriandolo, sgranandola con una noce di smen (burro chiarificato aromatico).",
    vintage: "Maghreb (Marocco e Nord Africa) • Patrimonio UNESCO della convivialità settimanale"
  },
  'd13_1': {
    history: "Sulle alture di Addis Abeba lo Zighinì si gusta strappando lembi di injera calda con la mano destra in segno di amicizia: Amara porta questo rito autentico sulle tavole di Pordenone.",
    secret: "Stufa le cipolle rosse tritate finissime a secco per quasi un'ora prima di aggiungere il burro speziato niter kibbeh e la miscela piccante berberé, lasciando sobbollire il manzo fino a sciogliersi.",
    vintage: "Etiopia ed Eritrea • Cucina dell'altopiano abissino legata al cereale antico teff"
  },
  'd13_2': {
    history: "Piatto solenne del Capodanno etiope ed emblema dell'arte culinaria di Addis Abeba, il Doro Wat richiede pazienza devota e dodici spezie pestate per accogliere gli ospiti più cari.",
    secret: "Marina il pollo nel succo di limone e lo immerge in un soffritto lunghissimo di cipolle ridotte a crema con berberé e cardamomo nero korarima, aggiungendo le uova sode incise negli ultimi minuti.",
    vintage: "Addis Abeba, Etiopia • Piatto cerimoniale delle feste tradizionali etiopi"
  },
  'd13_3': {
    history: "Preparate per rompere il digiuno e aprire i pranzi festivi in Etiopia, le sambusa di Amara sprigionano croccantezza leggera e tutto il calore aromatico delle leguminose d'alta quota.",
    secret: "Cuoce le lenticchie intere lasciandole sode e le insaporisce fuori dal fuoco con coriandolo fresco e peperoncino verde mitmita, sigillando i triangoli di sfoglia con una pastella leggera d'acqua e farina.",
    vintage: "Corno d'Africa (Etiopia) • Antipasto tradizionale dell'altopiano etiope"
  },
  'd5_1': {
    history: "Nato nei chioschi vivaci di Abidjan e portato ad Azzano Decimo da Koffi, il Garba è il simbolo della street-food ivoriana: semplice, energico e profumato di manioca appena sgranata.",
    secret: "Cuoce l'attiéké di manioca fermentata al vapore per mantenerlo soffice e sgranato, poi frigge il trancio di tonno in olio bollente servendolo subito con dadolata cruda di cipolla rossa e piment.",
    vintage: "Abidjan, Costa d'Avorio • Cucina popolare urbana delle coste ivoriane"
  },
  'd5_2': {
    history: "Quando in Costa d'Avorio cala la sera, le braci lungo le lagune si accendono per l'alloco e il pesce grigliato: Koffi ripropone questo incontro irresistibile tra dolcezza tropicale e mare.",
    secret: "Sceglie platani ben maturi dalla buccia maculata, li frigge a temperatura vivace perché restino caramellati fuori e morbidi dentro, abbinandoli a pesce inciso e marinato con zenzero e aglio.",
    vintage: "Costa d'Avorio e Africa Occidentale • Street food serale dei villaggi lagunari"
  },
  'd5_3': {
    history: "Il Kédjénou significa letteralmente 'scuotere dentro' in lingua baoulé: era il piatto dei cacciatori ivoriani che cuocevano tutto in anfore d'argilla sigillate senza mai sollevare il coperchio.",
    secret: "Cuoce il pollo esclusivamente nei propri succhi con pomodori maturi, melanzane africane e zenzero fresco dentro la pentola chiusa ermeticamente, scuotendola di tanto in tanto senza usare mestoli.",
    vintage: "Regione Baoulé, Costa d'Avorio • Antica cottura a vapore in terracotta sigillata"
  },
  'd6_1': {
    history: "Dalle vie frenetiche del Cairo fino a Fiume Veneto, il Koshary di Nadia racconta la storia di un crocevia millenario dove pasta, riso, lenticchie e ceci si fondono in un solo abbraccio.",
    secret: "Cuoce separatamente ogni cereale e legume per preservarne la consistenza, completa con salsa al pomodoro e aceto all'aglio ('da'a') e una nuvola croccante di cipolle fritte dorate.",
    vintage: "Il Cairo, Egitto • Comfort food nazionale egiziano nato tra XIX e XX secolo"
  },
  'd6_2': {
    history: "Antenati egiziani dei falafel mediorientali, i Ta'ameya si distinguono per l'uso esclusivo delle fave al posto dei ceci, regalando un cuore verde brillante come le rive del Nilo.",
    secret: "Ammolla e frulla le fave decorticate a crudo insieme a coriandolo, prezzemolo e cipollotto fresco fino a ottenere un composto spumoso, ricoperto di sesamo tostato subito prima della frittura.",
    vintage: "Alessandria e Il Cairo, Egitto • Ricetta copta ed egiziana di tradizione millenaria"
  },
  'd6_3': {
    history: "Dolce simbolo delle serate di festa al Cairo e delle visite tra vicini di casa, la Basbousa di Nadia unisce la semplicità della semola al profumo intenso dei giardini d'agrumi.",
    secret: "Lavora la semola con yogurt e burro fuso senza mescolare troppo per mantenerla granulosa, versando lo sciroppo caldo di miele e fiori d'arancio sulla torta appena uscita dal forno.",
    vintage: "Egitto e Levante • Pasticceria tradizionale mediterraneo-egiziana"
  },
  'd7_1': {
    history: "Dalle bancarelle del mattino ad Accra alla tavola di Kwame, il Waakye è il piatto che mette tutti d'accordo in Ghana grazie al suo caratteristico colore violaceo e al profumo terroso.",
    secret: "Fa bollire riso e fagioli dell'occhio insieme a foglie essiccate di sorgo rosso che tingono naturalmente i chicchi e donano una nota erbacea unica, servendo tutto con stufato speziato e shito.",
    vintage: "Accra e Nord del Ghana • Piatto quotidiano tradizionale ghanese"
  },
  'd7_2': {
    history: "Chiamato così per il doppio rosso dell'olio di palma non raffinato e dei pomodori maturi, il Red Red di Kwame racchiude il conforto genuino della cucina casalinga dell'Africa Occidentale.",
    secret: "Cuoce i fagioli dell'occhio molto lentamente con cipolla dolce, zenzero e olio di palma puro Zomi, creando un contrasto avvolgente con i platani maturi fritti dorati al momento.",
    vintage: "Ghana • Classico casalingo della cucina tradizionale Fante e Akan"
  },
  'd7_3': {
    history: "Appena fa buio nelle piazze di Kumasi e Accra, l'aroma dolce e pungente del Kelewele guida i passanti: Kwame lo prepara croccante fuori, scioglievole al centro e vivace di spezie.",
    secret: "Marina i cubetti di platano maturo in una crema fresca di zenzero grattugiato, chiodi di garofano, noce moscata e peperoncino prima di friggerli in olio ben caldo fino a leggera caramellizzazione.",
    vintage: "Accra e Kumasi, Ghana • Street food serale tradizionale ghanese"
  },
  'd21_1': {
    history: "Nato lungo le rotte delle spezie che lambivano Mombasa e l'Oceano Indiano, il Beef Pilau di Zalika fonde l'anima swahili con l'aroma caldo di cardamomo, cumino e cannella.",
    secret: "Tosta le spezie intere nel grasso prima di rosolare il manzo e caramellare le cipolle fino a un bruno intenso, lasciando poi cuocere il riso coperto nel brodo ristretto senza mai mescolarlo.",
    vintage: "Mombasa e costa Swahili, Kenya • Incrocio storico tra Africa Orientale e Oceano Indiano"
  },
  'd21_2': {
    history: "Il Nyama Choma è molto più di una grigliata in Kenya: è il rito del fine settimana attorno al fuoco lento, accompagnato da polenta bianca Ugali e insalata fresca di pomodori.",
    secret: "Lascia riposare la carne con sale grosso, succo di limone, coriandolo e aglio prima di cuocerla alta sopra la brace dolce, girandola con calma perché resti succosa fino all'ultimo morso.",
    vintage: "Nairobi e costa del Kenya • Rito conviviale dell'Africa Orientale"
  },
  'd21_3': {
    history: "Triangoli sottilissimi nati nei bazar costieri di Lamu e Mombasa, le samosa swahili di Zalika custodiscono un ripieno asciutto e profumatissimo di coriandolo fresco e cumino.",
    secret: "Stende dischi di pasta così sottili da sfogliarsi in padella sul fuoco dolce prima di farcirli con manzo macinato, cipolla verde e spezie macinate al momento per una croccantezza asciutta.",
    vintage: "Costa Swahili (Lamu e Mombasa), Kenya • Street food costiero dalle rotte marittime"
  },
  'd22_1': {
    history: "Emblema della storia multiculturale di Cape Town, il Bobotie di Jabari intreccia spezie cape-malay, foglie d'alloro e frutta secca sotto una coperta vellutata dorata al forno.",
    secret: "Aggiunge chutney di albicocche, curry dolce e una fetta di pane ammollata nel latte al macinato speziato, infilando foglie fresche di alloro nella crema d'uovo prima della cottura in forno.",
    vintage: "Città del Capo, Sudafrica • Tradizione Cape Malay documentata dal XVII secolo"
  },
  'd22_2': {
    history: "Nata nelle cucine popolari delle township intorno a Johannesburg, la Chakalaka di Jabari trasforma verdure di stagione e fagioli in una salsa vivace che accende la semplicità del Pap.",
    secret: "Lascia appassire carote grattugiate, peperoni e zenzero fresco nel curry piccante prima di unire i fagioli stufati, lasciando riposare il composto affinché i sapori si leghino con la polenta bianca.",
    vintage: "Johannesburg, Sudafrica • Cucina popolare sudafricana del XX secolo"
  },
  'd22_3': {
    history: "Nessun braai sudafricano si accende senza la spirale generosa di Boerewors: Jabari insacca personalmente tagli scelti profumati al coriandolo tostato e chiodi di garofano.",
    secret: "Tosta i semi interi di coriandolo in padella prima di macinarli grossolanamente insieme a noce moscata e un goccio d'aceto scuro nell'impasto di manzo e maiale, cuocendo poi su brace media.",
    vintage: "Sudafrica • Tradizione storica dei 'braai' sudafricani dall'Ottocento"
  },
  'd23_1': {
    history: "Considerato il piatto principe del Camerun, il Ndolé richiede pazienza quasi rituale: Samuel lava ripetutamente le foglie amare fino a renderle setose e armoniose nella crema d'arachidi.",
    secret: "Dopo aver sbollentato e lavato le foglie verdi, le unisce lentamente a una pasta liscia di arachidi bianche crude, zenzero e cipollotti, completando il piatto con gamberi saltati nell'olio caldo.",
    vintage: "Douala e litorale del Camerun • Piatto cerimoniale del popolo Duala"
  },
  'd23_2': {
    history: "Nato negli anni Ottanta nei quartieri eleganti di Yaoundé come 'Pollo del Direttore Generale', il Poulet DG di Samuel celebra l'incontro festoso tra pollo dorato, verdure croccanti e platano.",
    secret: "Rosola il pollo marinato al sedano e zenzero finché non diventa dorato, poi lo salta negli ultimi istanti con dadini di platano fritti e verdure croccanti per non perderne mai la freschezza.",
    vintage: "Yaoundé, Camerun • Classico conviviale camerunense degli anni Ottanta"
  },
  'd23_3': {
    history: "Colazione prediletta di generazioni intere tra Douala e Yaoundé, l'abbinamento tra beignets caldi e salsa speziata di fagioli unisce morbidezza lievitata e carattere deciso.",
    secret: "Lascia lievitare l'impasto soffice alla noce moscata finché non diventa leggero, poi frigge le palline nell'olio profondo servendole calde accanto ai fagioli neri stufati con cipolla e zenzero.",
    vintage: "Douala e Yaoundé, Camerun • Tradizione popolare da colazione e mercato"
  },
  'd24_1': {
    history: "Cuore pulsante delle cucine familiari lungo il fiume Congo, il Pollo alla Moambe di Bantu avvolge la carne in una salsa densa e vellutata ottenuta dal frutto della palma africana.",
    secret: "Estrae la polpa cremosa delle noci di palma lasciandola ridurre a fuoco lento con aglio, cipolla e spinaci selvatici fino a quando affiora naturalmente il velo rosso aromatico in superficie.",
    vintage: "Kinshasa, R.D. Congo • Piatto nazionale della cucina congolese centro-africana"
  },
  'd24_2': {
    history: "Cotto avvolto nelle larghe foglie di banano come lungo le rive del fiume Congo, il Liboke di Bantu sprigiona un aroma erbaceo intenso appena si apre il cartoccio fumante a tavola.",
    secret: "Incide leggermente il pesce fresco, lo massaggia con zenzero fresco, peperoncino e pomodorini e lega stretto il fagotto di foglie di banano così da farlo cuocere dolcemente nel proprio vapore.",
    vintage: "Bacino del fiume Congo (R.D. Congo) • Tecnica fluviale tradizionale al cartoccio"
  },
  'd24_3': {
    history: "Accompagnamento inseparabile di ogni tavola congolese, il fufu caldo e vellutato incontra la golosità dorata delle mikate, rievocando i pomeriggi di festa nei cortili di Kinshasa.",
    secret: "Mescola energicamente la farina di manioca nell'acqua bollente fino a ottenere una nuvola liscia e senza grumi, servendola con frittelle lievitate alla vaniglia fritte al momento.",
    vintage: "R.D. Congo e Africa Centrale • Ricetta base della convivialità congolese"
  },
  'd25_1': {
    history: "Dalle rive del Niger fino alle cucine di famiglia a Bamako, il Maafe di Anika racconta l'antica arte maliana di trasformare le arachidi tostate a mano in una salsa avvolgente come seta.",
    secret: "Tosta i semi d'arachide a fuoco lento prima di ridurli in crema liscia, poi la scioglie nel sugo ristretto d'agnello e patate dolci lasciando sobbollire pianissimo senza farla attaccare.",
    vintage: "Bamako e bacino del Niger, Mali • Tradizione Mandinka e Bambara dell'Africa Occidentale"
  },
  'd25_2': {
    history: "Nella versione maliana preparata da Anika, lo Yassa valorizza il pesce d'acqua dolce marinato negli agrumi con una pioggia generosa di cipolle dolci che si sciolgono sul palato.",
    secret: "Lascia il pesce nel succo di limone e aglio pestato per far penetrare la marinatura, poi caramella lentamente le cipolle a fiamma bassa fino a renderle dorate e scioglievoli insieme al platano.",
    vintage: "Mali e Sahel • Variante continentale dell'antico Yassa dell'Africa Occidentale"
  },
  'd25_3': {
    history: "Preparazione rara e profondamente domestica del Mali settentrionale, il Widjila nasce dalla cottura a vapore del pane sopra la stessa pentola della salsa affinché ne catturi ogni profumo.",
    secret: "Sovrappone i piccoli pani lievitati in un cestello forato proprio sopra il tegame dove sobbolle il sugo di pomodoro ed erbe selvatiche, servendoli caldissimi e intrisi d'aromi.",
    vintage: "Timbuctù e Nord del Mali • Specialità domestica tradizionale al vapore"
  },
  'd26_1': {
    history: "Sulla costa di Biserta e Tunisi il couscous abbraccia il mare: Leila incoccia la semola fine a mano e la serve con pescato fresco e un brodo rosso acceso dal profumo di harissa artigianale.",
    secret: "Prepara l'harissa pestando peperoncini essiccati al sole, cumino e carvi con aglio e olio d'oliva, poi lascia riposare la semola cotta al vapore perché beva esattamente la giusta dose di brodo.",
    vintage: "Tunisi, Biserta e Sfax, Tunisia • Tradizione marinara della costa tunisina"
  },
  'd26_2': {
    history: "Simbolo delle serate del Ramadan e dei vicoli profumati della Medina di Tunisi, il Brik di Leila sfida l'abilità di chi lo frigge: guscio sottilissimo fuori e cuore d'uovo ancora fondente.",
    secret: "Spalma la sottile sfoglia malsouka in padella, vi adagia tonno, capperi e prezzemolo lasciando intatto il tuorlo al centro, poi chiude a triangolo e immerge nell'olio bollente per 90 secondi esatti.",
    vintage: "Medina di Tunisi, Tunisia • Antipasto tradizionale nordafricano di origine ottomana"
  },
  'd26_3': {
    history: "Piatto rapido e appagante delle case tunisine, l'Ojja di Leila sprigiona tutto il temperamento della Tunisia attraverso peperoni verdi, pomodoro ristretto e spezie calde di carvi.",
    secret: "Rosola la salsiccia d'agnello Merguez per sfruttarne il grasso aromatico come base del sugo all'harissa, rompendo infine le uova direttamente nella padella calda fino a rapprendere gli albumi.",
    vintage: "Tunisia • Piatto popolare tunisino della tradizione casalinga maghrebina"
  },
  'd40_1': {
    history: "Tra i porti storici di Mogadiscio e l'Oceano Indiano, il Bariis Iskukaris di Faduma racconta secoli di incontri tra spezie d'Oriente, agrumi e ospitalità somala nelle grandi feste di famiglia.",
    secret: "Tosta e macina in casa la miscela Xawaash con cumino, cardamomo, cannella, curcuma e chiodi di garofano, cuocendo poi il riso basmati insieme allo stufato d'agnello, uvetta e cipolle fritte.",
    vintage: "Mogadiscio, Somalia • Piatto celebrativo dell'Oceano Indiano e Corno d'Africa"
  },
  'd40_2': {
    history: "Croccanti al primo morso e leggere come carta, le sambusa di Faduma scandiscono gli incontri serali e le tavole di festa somale con il profumo vivo di coriandolo fresco e Xawaash.",
    secret: "Stende una sfoglia finissima quasi trasparente e fa asciugare completamente il ripieno di manzo macinato, cipolla rossa e aglio prima di sigillarlo, garantendo una frittura asciutta e croccante.",
    vintage: "Somalia e Corno d'Africa • Classico antipasto croccante delle coste somale"
  },
  'd41_1': {
    history: "Considerato il piatto nazionale del Madagascar, il Romazava di Tendry unisce l'anima africana della carne stufata al tocco verde delle erbe fresche dell'isola rossa e all'influsso asiatico.",
    secret: "Cuoce dolcemente il manzo con tanto zenzero fresco grattugiato e pomodori maturi, aggiungendo le foglie verdi piccanti (brèdes) solo negli ultimi minuti per conservarne il colore e il brio.",
    vintage: "Antananarivo, Madagascar • Piatto nazionale malgascio degli altipiani"
  },
  'd41_2': {
    history: "Sulle coste orientali del Madagascar, dove crescono le palme da cocco e le orchidee di vaniglia, questo piatto di Tendry sposa la dolcezza esotica del baccello al calore della curcuma.",
    secret: "Incide per lungo il baccello di vaniglia Bourbon facendone infondere i semi nel latte di cocco insieme a curcuma e zenzero fresco, lasciando ridurre la salsa a fiamma minima attorno al pollo.",
    vintage: "Costa orientale del Madagascar • Tradizione creolo-malgascia della vaniglia Bourbon"
  },

  // --- ASIA ---
  'd2_1': {
    history: "Cresciuto tra i banchi dei mercati del pesce di Osaka per vent'anni, Kenji tratta ogni taglio con rispetto assoluto verso la stagionalità e la temperatura perfetta tra riso e pescato.",
    secret: "Prepara il riso shari con una miscela segreta di aceto di riso invecchiato e alga kombu, ventilandolo a mano mentre è ancora tiepido per ottenere chicchi lucidi e compatti.",
    vintage: "Osaka ed Edo (Tokyo), Giappone • Tradizione Edomae-zushi perfezionata dal XIX secolo"
  },
  'd15_1': {
    history: "Nato tra le barche-cucina dei canali di Bangkok e lanciato negli anni Trenta come simbolo della cucina thailandese, il Pad Thai di Siriwat gioca sull'armonia esatta di quattro sapori.",
    secret: "Spennella il wok rovente con pasta di tamarindo estratta a mano, zucchero di palma e salsa di pesce, saltando i noodles di riso per pochi secondi così che restino elastici e saporiti.",
    vintage: "Bangkok, Thailandia • Piatto nazionale thailandese degli anni Trenta"
  },
  'd16_1': {
    history: "Piatto dell'armonia dei cinque colori secondo la filosofia coreana, il Bibimbap di Ji-Soo raccoglie in una sola ciotola verdure di stagione, riso caldo e il carattere fermentato della casa.",
    secret: "Serve le verdure saltate separatamente sopra il riso insieme al suo kimchi fermentato naturalmente per almeno tre mesi in giara e a un cucchiaio generoso di salsa gochujang.",
    vintage: "Jeonju e Seul, Corea del Sud • Tradizione reale e popolare coreana dal XVI secolo"
  },
  'd17_1': {
    history: "Creato negli anni Cinquanta a Delhi per recuperare il pollo tandoori avanzato in una salsa vellutata al pomodoro, nella cucina del Punjab di Priya diventa un abbraccio cremoso di spezie fresche.",
    secret: "Macina ogni mattina cardamomo verde, cumino e coriandolo, poi affumica il pollo marinato nello yogurt prima di tuffarlo nella salsa passata al setaccio con burro chiarificato e fieno greco.",
    vintage: "Punjab e Nuova Delhi, India • Classico della cucina tandoori nord-indiana (anni '50)"
  },
  'd18_1': {
    history: "In Libano l'ospitalità si misura dallo spazio al centro della tavola: i Mezzé di Samir invitano a spezzare insieme il pane pita caldo attingendo tra creme vellutate e croccantezza vegetale.",
    secret: "Lascia i ceci in ammollo con un pizzico di bicarbonato e li frulla con cubetti di ghiaccio e tahina di sesamo chiaro per ottenere un hummus aerato e chiaro come una mousse.",
    vintage: "Beirut e Monti del Libano • Tradizione conviviale del Levante mediterraneo"
  },
  'd19_1': {
    history: "Ad Hanoi il giorno comincia davanti a una ciotola fumante di Pho lungo i marciapiedi: Minh ricrea quel rito mattutino fatto di calma, erbe fresche e brodo limpido come cristallo.",
    secret: "Arrostisce zenzero intero e cipolla sulla fiamma viva prima di cuocere le ossa di manzo per 12 ore a leggero fremito con anice stellato, cannella e cardamomo nero.",
    vintage: "Hanoi e Delta del Fiume Rosso, Vietnam • Zuppa simbolo del Vietnam dal primo Novecento"
  },
  'd20_1': {
    history: "Pasticcere di terza generazione, Osman custodisce l'eredità dei laboratori di Gaziantep dove la sfoglia per il baklava si stende così sottile da poter leggere un giornale in controluce.",
    secret: "Spennella ogni singolo foglio di pasta fillo con burro chiarificato caldo, farcisce generosamente con pistacchi interi tritati grossolanamente e versa lo sciroppo freddo sul dolce appena sfornato.",
    vintage: "Gaziantep e Istanbul, Turchia • Pasticceria imperiale anatolica riconosciuta IGP"
  },
  'd35_1': {
    history: "A Pechino e nel Nord della Cina chiudere i ravioli insieme alla vigilia delle feste è simbolo di buon augurio: Wei piega a mano ogni singolo bordo con gesti precisi e ritmati.",
    secret: "Sbatte il ripieno di maiale con un cucchiaio di brodo freddo allo zenzero e olio di sesamo finché la carne assorbe tutto il liquido, così ogni raviolo al vapore resta succoso al morso.",
    vintage: "Pechino e Nord della Cina • Tradizione imperiale e familiare dei Jiaozi (oltre 1800 anni)"
  },

  // --- AMERICHE ---
  'd10_1': {
    history: "Nati dall'incontro tra gli immigrati libanesi a Puebla e le spezie mesoamericane, i Tacos Al Pastor di Elena portano a Montereale il profumo vivace delle notti di Città del Messico.",
    secret: "Marina il maiale a fette sottili in pasta di achiote, peperoncini guajillo e succo d'ananas, rosolandolo ad alta temperatura e servendolo su tortillas di mais pressate a mano al momento.",
    vintage: "Città del Messico e Puebla, Messico • Icona dello street food messicano dal Novecento"
  },
  'd29_1': {
    history: "Dal Nord montuoso di Salta fino alle pampas argentine, ogni empanada porta la firma della mano che l'ha chiusa: Sofia intreccia trecce diverse per svelare subito il gusto del ripieno.",
    secret: "Taglia la carne a punta di coltello invece di tritarla e la lascia raffreddare nel proprio sugo con cumino, cipollotto e uova sode prima di chiudere la pasta con il tradizionale 'repulgue'.",
    vintage: "Salta e Buenos Aires, Argentina • Tradizione criolla delle provincie andine argentine"
  },
  'd12_1': {
    history: "Il sabato a Rio de Janeiro scorre al ritmo lento della Feijoada condivisa in famiglia: Beatriz dedica un'intera giornata a questo stufato nato dall'ingegno e dalla resilienza della cultura afro-brasiliana.",
    secret: "Dissala con cura i tagli di maiale per 24 ore, poi lascia sobbollire i fagioli neri fino a creare una crema scura e lucida, servita con farofa tostata al burro e spicchi d'arancia fresca.",
    vintage: "Rio de Janeiro, Brasile • Piatto simbolo della tradizione popolare brasiliana"
  },
  'd14_1': {
    history: "Nato tra i pescatori della costa pacifica peruviana già in epoca precolombiana, il Ceviche di Carlos vive sull'istante preciso in cui l'acidità del lime 'cuoce' il pesce senza mai spegnerne la freschezza.",
    secret: "Spreme i lime al momento senza schiacciare la parte bianca amara e prepara una leche de tigre ghiacciata con zenzero, sedano e peperoncino rocoto versandola sul pesce solo prima di servire.",
    vintage: "Lima e costa del Perù • Patrimonio Culturale Peruviano dalle radici Moche"
  },
  'd30_1': {
    history: "Figlio delle grandi gare di barbecue del Texas, il Pulled Pork di John nasce da legno di quercia, pazienza notturna nello smoker e una crosticina speziata ('bark') dal sapore profondo.",
    secret: "Massaggia la spalla di maiale con paprika affumicata, zucchero di canna e pepe nero, poi la affumica a temperatura costante per 12 ore finché le fibre cedono sotto le dita con un filo di salsa BBQ.",
    vintage: "Texas e Sud degli Stati Uniti • Tradizione americana dello slow smoking BBQ"
  },
};

/**
 * Restituisce storia, segreto del cuoco e origine storica personalizzati per qualsiasi piatto,
 * utilizzando prima l'archivio curato per ID e poi un generatore dinamico coerente con i dati reali del piatto/cuoco.
 */
export const getDishHeritageStory = (
  dish: Dish,
  chef: Pick<Chef, 'name' | 'countryName' | 'nationality' | 'bio' | 'fullBio' | 'location'>
): DishHeritageStory => {
  const curated = DISH_HERITAGE_STORIES[dish.id];
  if (curated) {
    return curated;
  }

  const nameLower = dish.name.toLowerCase();
  const countryLabel = chef.countryName?.trim() || 'tradizione casalinga';
  const regionLabel = chef.location ? chef.location.split(',')[0].trim() : 'Pordenone';
  const mainIngredients = dish.ingredients && dish.ingredients.length > 0
    ? dish.ingredients.slice(0, 4).join(', ')
    : null;

  if (nameLower.includes('pesto') || nameLower.includes('trofie')) {
    return {
      history: `Nato tra le colline liguri baciate dal mare, questo piatto rivive nella cucina di ${chef.name} con il profumo fresco del basilico lavorato al momento e dell'olio extravergine nuovo.`,
      secret: dish.preparation || 'Pesta le foglie tenere di basilico a freddo con pinoli, aglio dolce e formaggi stagionati senza scaldare mai la salsa.',
      vintage: `Liguria, Italia • Tradizione marinara di Genova (${regionLabel})`
    };
  }

  if (nameLower.includes('sushi') || nameLower.includes('ramen')) {
    return {
      history: `Frutto di una disciplina paziente fatta di tagli netti e brodi limpidi, nella proposta di ${chef.name} ogni elemento ricerca l'equilibrio tra freschezza ed umami.`,
      secret: dish.preparation || 'Cura al minuto temperature del riso e stagionatura delle basi affinché pesce, brodo e condimenti restino nitidi al palato.',
      vintage: `Giappone • Eredità gastronomica giapponese interpretata a ${regionLabel}`
    };
  }

  if (nameLower.includes('taco') || nameLower.includes('enchilada') || nameLower.includes('empanada')) {
    return {
      history: `Ispirato alle cucine di piazza latinoamericane, questo piatto porta nella casa di ${chef.name} il profumo caldo del mais tostato, delle spezie affumicate e delle ricette di famiglia.`,
      secret: dish.preparation || 'Lavora gli impasti a mano e lascia riposare il ripieno affinché succhi ed erbe aromatiche si fondano prima della cottura.',
      vintage: `${countryLabel} • Cucina conviviale latinoamericana (${regionLabel})`
    };
  }

  if (nameLower.includes('curry') || nameLower.includes('tikka') || nameLower.includes('samosa') || nameLower.includes('biryani')) {
    return {
      history: `Un mosaico profumato di spezie tostate che narra antiche vie commerciali e pranzi festivi di famiglia, reinterpretato con cura quotidiana da ${chef.name}.`,
      secret: dish.preparation || 'Tosta i semi interi a secco prima di macinarli e lascia sobbollire lentamente il fondo aromatico per svegliare gli oli essenziali.',
      vintage: `${countryLabel} • Tradizione speziata tramandata in famiglia`
    };
  }

  // Fallback ricco e personalizzato basato sui dati reali del piatto creato dal cuoco
  const personalizedHistory = dish.description && dish.description.trim().length > 20
    ? `Nella cucina di ${chef.name} (${countryLabel}), "${dish.name}" nasce dal desiderio di portare a tavola una ricetta vissuta in famiglia: ${dish.description.charAt(0).toLowerCase() + dish.description.slice(1).replace(/\.$/, '')}, preparata al momento con gesti pazienti e materie prime sincere.`
    : `Preparato fresco da ${chef.name}, "${dish.name}" racchiude i gesti quotidiani della cucina casalinga legata a ${countryLabel}, trasformando ingredienti semplici in un momento di condivisione autentica.`;

  const personalizedSecret = dish.preparation?.trim()
    ? dish.preparation.trim()
    : mainIngredients
      ? `Seleziona con cura ${mainIngredients} e regola cotture lente e riposi naturali affinché ogni ingrediente esprima il proprio aroma senza forzature.`
      : `Lavora gli ingredienti freschi in piccole preparazioni giornaliere, bilanciando tempi di cottura e condimenti poco prima di servire.`;

  const personalizedOrigin = `${countryLabel} • Cucina casalinga autentica preparata a ${regionLabel}`;

  return {
    history: personalizedHistory,
    secret: personalizedSecret,
    vintage: personalizedOrigin,
  };
};
