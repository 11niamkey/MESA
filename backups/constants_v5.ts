import { Chef, CultureStory } from './types';

export const MOCK_CULTURE_STORIES: CultureStory[] = [
  {
    id: 's-afric-1',
    title: 'Garba & Attiéké: L\'Oro Bianco della Laguna Ébrié',
    country: 'Costa d\'Avorio',
    flag: '🇨🇮',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=1200&q=80',
    content: 'L\'Attiéké è una semola di manioca fermentata e cotta al vapore secondo un metodo plurisecolare delle donne Ebrié e Adjoukrou. Nella ricetta del "Garba", viene abbinata al tonno fritto croccante, brunoise di cipolle rosse, pomodoro fresco, piment bec d\'oiseau e un filo d\'olio di friture speziato. Il contrasto tra la morbida acidità della manioca e la sapidità calda del pesce è una firma inconfondibile.',
    funFact: 'La parola "Garba" deriva dal nome del primo celebre venditore nigerino che popolarizzò il piatto ad Abidjan (Treichville) negli anni \'90.'
  },
  {
    id: 's-afric-2',
    title: 'Jollof Wars & Smoky Party Rice: Il Mito del Riso di West Africa',
    country: 'Nigeria & Ghana',
    flag: '🇳🇬',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1200&q=80',
    content: 'La competizione culinaria "Jollof Wars" tra Nigeria, Ghana e Senegal accende gli animi dei buongustai in tutto il mondo. Il Party Jollof nigeriano è celebre per il suo irresistibile aroma "Party Smoke" ottenuto dalla tostatura sul fondo della pentola con salsa concentrata di pomodori freschi, peperoni rossi e Scotch Bonnet.',
    funFact: 'L\'antenato storico del Jollof risale all\'Impero Wolof nel XIV secolo con il leggendario piatto senegalese Ceebu Jën.'
  },
  {
    id: 's-afric-3',
    title: 'Thieboudienne & Teranga: Il Patrimonio Immateriale UNESCO del Senegal',
    country: 'Senegal',
    flag: '🇸🇳',
    image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=1200&q=80',
    content: 'Dichiarato Patrimonio Culturale UNESCO, il Thieboudienne (Ceebu Jën Penda Mbaye) è il cuore pulsante della Teranga (l\'ospitalità sacra senegalese). Riso spezzato Wolof cotto a fuoco lento nel brodo concentrato di cernia nobile (Thiof) farcita di Roff alle erbe, manioca, carote, cavolo e melanzane.',
    funFact: 'In Senegal, condividere il grande vassoio circolare comune "Bol" è un rito di unione familiare in cui i pezzi più prelibati vengono offerti all\'ospite.'
  },
  {
    id: 's-afric-4',
    title: 'Injera & Doro Wat: Il Ritmo Millenario dell\'Altopiano Etiope',
    country: 'Etiopia',
    flag: '🇪🇹',
    image: 'https://images.unsplash.com/photo-1542354256-4b68e7d7f26c?auto=format&fit=crop&w=1200&q=80',
    content: 'L\'Injera è una crêpe lievitata naturalmente per 3 giorni a base di farina di Teff 100% (cereale antico degli altipiani privo di glutine). Spugnosa e profumata, funge contemporaneamente da piatto e da posata per raccogliere il celebre Doro Wat (stufato di pollo nobile al Berbere con burro chiarificato Niter Kibbeh e uova sode).',
    funFact: 'Il rito del "Gursha" consiste nell\'imboccare con le proprie mani un ospite o la persona cara in segno di profondo affetto e rispetto.'
  },
  {
    id: 's-afric-5',
    title: 'Ndolé & Poivre de Penja: Il Tesoro Costiero Sawa del Camerun',
    country: 'Camerun',
    flag: '🇨🇲',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
    content: 'Piatto d\'onore e d\'alta cerimonia del popolo Sawa del litorale camerunese, il Ndolé unisce foglie selvatiche amare di Vernonia (lavate fino a 7 volte) cotte lentamente in una vellutata di pasta di arachidi fresche torrefatte, gamberi essiccati, carne fondente e gamberoni saltati all\'olio di cipolla novello.',
    funFact: 'Il Poivre Blanc de Penja camerunense, prima Indicazione Geografica Protetta (IGP) dell\'Africa subsahariana, arricchisce il piatto con note vulcaniche uniche.'
  },
  {
    id: 's-afric-6',
    title: 'Mai Suya: L\'Antica Arte dei Maestri Grigliatori Hausa',
    country: 'Nigeria & Sahel',
    flag: '🇳🇬',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    content: 'Il Suya (o Tsire) è il re indiscusso dello street food notturno nigeriano. Fette finissime di manzo tenero marinate nel prezioso blend "Yaji" a base di farina di panello di arachidi Kuli-Kuli, zenzero, aglio, pepe nero africano e peperoncino, arrostite su griglia a carbonella viva e servite su carta paglia con cipolle fresche.',
    funFact: 'I maestri artigiani "Mai Suya" custodiscono il bilanciamento delle spezie Yaji per generazioni con segreti di bottega inaccessibili.'
  },
  {
    id: 's-afric-7',
    title: 'Poulet Braisé & I Maquis Notturni di Abidjan',
    country: 'Costa d\'Avorio & Africa Occidentale',
    flag: '🇨🇮',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1200&q=80',
    content: 'Nei vivaci "Maquis" all\'aperto di Abidjan, Bamako e Cotonou, l\'aroma del pollo ruspante e della tilapia intera marinati con spezie forestali (Pèbè, Akpi, Djansang) e arrostiti su brace ardente è la colonna sonora olfattiva della convivialità serale, sempre accompagnati da Alloco dorato.',
    funFact: 'L\'Alloco perfetto si prepara rigorosamente con platani maturi a buccia screziata di nero, che rilasciano zuccheri caramellati durante la doratura.'
  },
  {
    id: 's-afric-8',
    title: 'Tajine & Pastilla: L\'Alchimia di Aromi e Zafferano del Maghreb',
    country: 'Marocco & Nord Africa',
    flag: '🇲🇦',
    image: 'https://images.unsplash.com/photo-1511690656952-34342d5c2895?auto=format&fit=crop&w=1200&q=80',
    content: 'La gastronomia del Nord Africa è un perfetto equilibrio tra spezie nobili (Zafferano puro di Taliouine, Ras el Hanout, cannella di Ceylon) e sfoglie croccanti. Dalla Tajine di agnello e prugne cotta dolcemente in terracotta alla Pastilla andaluso-marocchina che unisce strati di pasta warka, pollo sfilacciato e mandorle tostate.',
    funFact: 'Il coperchio conico della tajine fa ricadere per condensazione i vapori aromatici, regalando una morbidezza inarrivabile alla carne.'
  }
];

export const MOCK_CHEFS: Chef[] = [
  // ==========================================
  // --- AFRICA OCCIDENTALE (WEST AFRICA) ---
  // ==========================================
  {
    id: 'c-amara-ci',
    name: 'Chef Amara Koffi & Mamy Lou',
    nationality: '🇨🇮',
    countryName: 'Costa d\'Avorio',
    continent: 'Africa',
    bio: 'Maestri del Garba Reale di Treichville, Tilapia Braisée au Charbon e Kédjénou in terracotta.',
    fullBio: 'Amara Koffi e Mamy Lou custodiscono i segreti secolari della fermentazione dell\'Attiéké lagunare e delle marinature da Maquis di Abidjan (Treichville e Cocody). Usano solo manioca lavorata artigianalmente e miscele di spezie forestali come Akpi e Pèbè.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    rating: 4.98,
    location: 'Milano, Porta Venezia & Stazione Centrale',
    distance: 1.1,
    specialties: ['Garba Reale d\'Abidjan', 'Tilapia Braisée au Charbon', 'Kédjénou di Pollo in Canari', 'Placali Sauce Gombo & Crabe'],
    availability: ['11:30 - 15:00', '18:30 - 23:00'],
    availableDays: [1, 2, 3, 4, 5, 6, 0],
    reviews: [
      { id: 'rev-ci-1', author: 'Bakary Traoré', rating: 5, comment: 'Attiéké fresco identico a quello di Treichville ad Abidjan. Il tonno croccante e la brunoise di cipolle con piment sono sublimi!', date: '2026-08-10' },
      { id: 'rev-ci-2', author: 'Chiara', rating: 5, comment: 'La Tilapia braisée è spettacolare, la polpa è succosa e la salsa maquis ha un profumo incredibile.', date: '2026-08-05' }
    ],
    dishes: [
      {
        id: 'd-garba-ci',
        name: 'Garba Reale d\'Abidjan (Attiéké & Thon Frit)',
        description: 'La leggenda ivoriana: semola di manioca fermentata a grana fine cotta al vapore (Attiéké autentico) con trancio di tonno marinato e fritto dorato, brunoise fresca di pomodoro, cipolle rosse, piment fresco e filo d\'olio speziato aromatico.',
        price: 13.50,
        image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-amara-ci',
        tags: ['Pesce', 'Manioca Fermentata', 'Gluten Free', 'Best Seller'],
        dietary: ['Gluten Free', 'Halal'],
        africanRegion: 'West Africa',
        countryOrigin: 'Costa d\'Avorio',
        countryFlag: '🇨🇮',
        servingPortion: '1 Persona (Generosa)',
        accompanimentOptions: ['Attiéké Fresco al Vapore', 'Extra Alloco Dorato (+€3.00)', 'Riso Bianco Profumato'],
        spiceOptions: ['Dolce / Zero Piccante', 'Leggero Aromatico', 'Medio Tradizionale', 'Piquant Africain (Peperoncino Habanero)'],
        ingredients: ['Attiéké artigianale biologico', 'Trancio di Tonno fresco', 'Cipolla rossa di Tropea', 'Pomodori freschi da insalata', 'Piment bec d\'oiseau', 'Olio aromatico da fritto', 'Bouillon tradizionale'],
        preparation: 'L\'Attiéké viene riscaldato delicatamente a vapore con qualche goccia d\'acqua salata. Il tonno viene marinato per ore con erbe fini e fritto rapidamente a temperatura alta per conservare il cuore morbido.'
      },
      {
        id: 'd-braise-ci',
        name: 'Poisson Braisé Tilapia Intera & Alloco Dorato',
        description: 'Tilapia intera fresca marinata con zenzero fresco pestato, aglio, pepe bianco di Penja e spezie del sottobosco Akpi, arrostita a fuoco vivo sulla brace di carbone. Servita con platani dolci maturi fritti (Alloco) e salsa maquis.',
        price: 18.50,
        image: 'https://images.unsplash.com/photo-1534080564607-c980d49451d7?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-amara-ci',
        tags: ['Pesce Intero', 'Grigliato a Legna', 'Gluten Free', 'Specialità'],
        dietary: ['Gluten Free', 'Halal'],
        africanRegion: 'West Africa',
        countryOrigin: 'Costa d\'Avorio',
        countryFlag: '🇨🇮',
        servingPortion: '1-2 Persone',
        accompanimentOptions: ['Alloco Dorato Caldo', 'Attiéké al Vapore', 'Riso Jollof (+€2.50)'],
        spiceOptions: ['Delicato Aromatico', 'Medio Tradizionale', 'Piccante Maquis Ivoriano'],
        ingredients: ['Tilapia intera fresca', 'Platani maturi', 'Semi di Akpi', 'Zenzero fresco', 'Aglio novello', 'Olio vegetale vergine']
      },
      {
        id: 'd-kedjenou-ci',
        name: 'Kédjénou di Pollo Fermier in Canari di Terracotta',
        description: 'Stufato tradizionale a cottura lenta ermetica nel recipiente d\'argilla canari: pollo ruspante marinato cotto a vapore nei suoi stessi succhi con melanzane africane Gnangnan, pomodori freschi, zenzero e timo selvatico, senza grassi aggiunti.',
        price: 15.50,
        image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-amara-ci',
        tags: ['Pollo', 'Cottura Lenta in Argilla', 'Senza Grassi', 'Tradizionale'],
        dietary: ['Gluten Free', 'Halal'],
        africanRegion: 'West Africa',
        countryOrigin: 'Costa d\'Avorio',
        countryFlag: '🇨🇮',
        isSlowCook: true,
        servingPortion: '1 Persona',
        accompanimentOptions: ['Attiéké Fresco', 'Riso Bianco al Vapore', 'Foutou di Banana Pilonato (+€2.50)']
      }
    ]
  },
  {
    id: 'c-moussa-sn',
    name: 'Chef Cheikh Ndiaye & Teranga Dakar',
    nationality: '🇸🇳',
    countryName: 'Senegal',
    continent: 'Africa',
    bio: 'Ambasciatore del Thieboudienne Rosso UNESCO e del Poulet Yassa al lime di Casamance.',
    fullBio: 'Nato a Saint-Louis (Ndar) in Senegal, culla storica della gastronomia Wolof, Chef Cheikh tramanda le ricette regali di Penda Mbaye. Il suo Thieboudienne vanta pesce Thiof nobile farcito con Roff fatto a mano e riso spezzato due volte a vapore.',
    avatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=400&q=80',
    rating: 4.96,
    location: 'Torino, San Salvario',
    distance: 1.4,
    specialties: ['Thieboudienne Rosso UNESCO', 'Poulet Yassa au Feu de Bois', 'Dibi d\'Agneau Dibiterie', 'Pastels de Poisson Frais'],
    availability: ['12:00 - 15:00', '19:00 - 22:30'],
    availableDays: [2, 3, 4, 5, 6, 0],
    reviews: [
      { id: 'rev-sn-1', author: 'Ousmane Sow', rating: 5, comment: 'Il miglior Ceebu Jën di Torino! Il riso ha il colore rosso rubino perfetto e la cernia è farcita al roff in modo magistrale.', date: '2026-08-14' }
    ],
    dishes: [
      {
        id: 'd-thieb-sn',
        name: 'Thieboudienne Rosso UNESCO (Ceebu Jën Penda Mbaye)',
        description: 'Il celebre piatto nazionale senegalese patrimonio UNESCO: riso spezzato Wolof cotto a fuoco lento nel concentrato di pomodoro speziato con cernia nobile (Thiof) farcita al roff (prezzemolo, aglio, piment), manioca, carote, cavolo cappuccio, melanzana e tamarindo dolce.',
        price: 16.50,
        image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-moussa-sn',
        tags: ['Pesce Nobile', 'Riso Spezzato Wolof', 'UNESCO', 'Signature'],
        dietary: ['Halal'],
        africanRegion: 'West Africa',
        countryOrigin: 'Senegal',
        countryFlag: '🇸🇳',
        isSlowCook: true,
        servingPortion: '1 Persona Abbondante',
        accompanimentOptions: ['Riso Rosso al Brodo di Pesce', 'Verdure Stufate Miste del Mercato', 'Salsa Beugueudj (Foglie di Ibisco)']
      },
      {
        id: 'd-yassa-sn',
        name: 'Poulet Yassa al Limone di Casamance & Cipolle Caramellate',
        description: 'Cosce di pollo ruspante marinate per 12 ore con succo di lime fresco di Casamance, senape di Digione, aglio e noce moscata, cotte a legna con una montagna di cipolle dolci caramellate a fuoco lento. Servito con riso bianco Jasmine profumato.',
        price: 14.50,
        image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-moussa-sn',
        tags: ['Pollo', 'Agrumato', 'Cipolle Caramellate', 'Classico'],
        dietary: ['Gluten Free', 'Halal'],
        africanRegion: 'West Africa',
        countryOrigin: 'Senegal',
        countryFlag: '🇸🇳',
        servingPortion: '1 Persona',
        accompanimentOptions: ['Riso Bianco Jasmine', 'Attiéké', 'Platani Fritti Dorati (+€2.50)']
      },
      {
        id: 'd-dibi-sn',
        name: 'Dibi d\'Agneau alla Griglia in Stile Dibiterie Haoussa',
        description: 'Bocconcini succulenti di agnello marinati con pepe nero, senape dolce e povere aromatica Kan-Kan, arrostiti al carbone di legna e serviti avvolti in carta con cipolle crude croccanti e senape.',
        price: 16.00,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-moussa-sn',
        tags: ['Carne d\'Agnello', 'Grigliato a Legna', 'Street Food'],
        dietary: ['Gluten Free', 'Halal'],
        africanRegion: 'West Africa',
        countryOrigin: 'Senegal',
        countryFlag: '🇸🇳'
      },
      {
        id: 'd-pastels-sn',
        name: 'Pastels de Poisson Frais Dorati con Salsa Piment Vert (6 pz)',
        description: 'Fagottini artigianali di sfoglia dorata ripieni di polpa di pesce Thiof speziato con erbe fresche, serviti con salsa densa di pomodoro e piment senegalese fatto in casa.',
        price: 8.50,
        image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-moussa-sn',
        tags: ['Antipasto', 'Street Food', 'Pesce'],
        dietary: ['Halal'],
        africanRegion: 'West Africa',
        countryOrigin: 'Senegal',
        countryFlag: '🇸🇳'
      }
    ]
  },
  {
    id: 'c-adunni-ng',
    name: 'Chef Adunni Adebayo (Mama Lagos Kitchen)',
    nationality: '🇳🇬',
    countryName: 'Nigeria',
    continent: 'Africa',
    bio: 'Lo street food leggendario di Lagos: Smoky Party Jollof, Suya Skewers e Egusi Soup con Pounded Yam.',
    fullBio: 'Adunni porta a Milano la maestria culinaria delle cucine di Lagos e Ibadan. Celebre per il suo Party Jollof con affumicatura naturale a fondo pentola e per la miscela segreta Yaji dei migliori spiedini Mai Suya.',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&q=80',
    rating: 4.97,
    location: 'Milano, Loreto & NoLo',
    distance: 2.2,
    specialties: ['Smoky Party Jollof Rice', 'Authentic Mai Suya Beef', 'Egusi Soup & Pounded Yam', 'Goat Meat Pepper Soup'],
    availability: ['12:00 - 22:00'],
    availableDays: [1, 2, 3, 4, 5, 6],
    reviews: [
      { id: 'rev-ng-1', author: 'David Okafor', rating: 5, comment: 'The Smoky Jollof is literally 100% authentic Lagos party quality! The Suya with extra Yaji spice brought me right back home.', date: '2026-08-16' }
    ],
    dishes: [
      {
        id: 'd-jollof-ng',
        name: 'Smoky Party Jollof Rice & Crispy Fried Chicken',
        description: 'Riso a chicco lungo parboiled tostato e cotto nella densa riduzione di pomodori freschi, peperoni rossi Tatashe e Scotch Bonnet, con la celebre nota affumicata a fondo pentola. Servito con pollo speziato dorato e platani fritti Dodo.',
        price: 15.50,
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-adunni-ng',
        tags: ['Pollo', 'Riso Speziato', 'Affumicato', 'Party Favorite'],
        dietary: ['Gluten Free', 'Halal'],
        africanRegion: 'West Africa',
        countryOrigin: 'Nigeria',
        countryFlag: '🇳🇬',
        servingPortion: '1 Persona Generosa',
        accompanimentOptions: ['Dodo (Platani Fritti Dolci)', 'Insalata Coleslaw Tradizionale', 'Extra Coscia di Pollo Speziata (+€4.00)'],
        spiceOptions: ['Mild (Delicato)', 'Medium (Equilibrato)', 'Nigerian Hot (Scotch Bonnet Autentico)']
      },
      {
        id: 'd-suya-ng',
        name: 'Mai Suya Beef Skewers alle Spezie Tradizionali Yaji (Tris)',
        description: 'Fette sottilissime di controfiletto di manzo scelte marinate nella speciale polvere Yaji (arachidi tostate Kuli-Kuli, zenzero, aglio novello, noce moscata africana e peperoncino), cotte su brace ardente con cipolle rosse e pomodori.',
        price: 13.50,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-adunni-ng',
        tags: ['Carne di Manzo', 'Street Food', 'Spezie Yaji', 'Grigliato'],
        dietary: ['Gluten Free', 'Halal'],
        africanRegion: 'West Africa',
        countryOrigin: 'Nigeria',
        countryFlag: '🇳🇬'
      },
      {
        id: 'd-egusi-ng',
        name: 'Egusi Soup con Foglie di Zucca Ugwu & Pounded Yam',
        description: 'Zuppa densa e profumata preparata con semi di melone egusi macinati, foglie fresche di zucca ugwu, gamberetti secchi macinati, manzo tenero stufato e shaki, accompagnata da morbido Pounded Yam fatto a mano.',
        price: 17.50,
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-adunni-ng',
        tags: ['Carne & Pesce Essiccato', 'Cottura Lenta', 'Tradizionale'],
        dietary: ['Gluten Free', 'Halal'],
        africanRegion: 'West Africa',
        countryOrigin: 'Nigeria',
        countryFlag: '🇳🇬',
        isSlowCook: true,
        servingPortion: '1 Persona'
      }
    ]
  },
  {
    id: 'c-kwame-gh',
    name: 'Chef Kwame Mensah (Accra Heritage)',
    nationality: '🇬🇭',
    countryName: 'Ghana',
    continent: 'Africa',
    bio: 'Waakye Supreme con salsa Shito nera artigianale, Kelewele allo zenzero e Red Red stew.',
    fullBio: 'Kwame celebra la raffinata tradizione culinaria ghanese di Accra e Kumasi. Famoso per la sua densa salsa Shito preparata con gamberi essiccati e peperoncino tostato, e per il saporito Waakye cotto con foglie di sorgo.',
    avatar: 'https://images.unsplash.com/photo-1583336137348-82836e28d6c7?auto=format&fit=crop&w=400&q=80',
    rating: 4.90,
    location: 'Bologna, Bolognina',
    distance: 2.7,
    specialties: ['Waakye Supreme con Shito', 'Red Red Bean Stew', 'Kelewele allo Zenzero Fresco'],
    availability: ['17:00 - 22:30'],
    availableDays: [0, 2, 4, 5, 6],
    reviews: [],
    dishes: [
      {
        id: 'd-waakye-gh',
        name: 'Waakye Supreme con Salsa Shito Nera Tradizionale',
        description: 'Riso e fagioli dell\'occhio cotti con foglie rosse essiccate di sorgo per un colore porpora naturale, servito con spezzatino di manzo tenero, spaghetti locali talia, uovo sodo, gari e l\'autentica salsa scura piccante Shito.',
        price: 15.00,
        image: 'https://images.unsplash.com/photo-1542354256-4b68e7d7f26c?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-kwame-gh',
        tags: ['Carne', 'Riso & Fagioli', 'Ghanese Tradizionale'],
        dietary: ['Halal'],
        africanRegion: 'West Africa',
        countryOrigin: 'Ghana',
        countryFlag: '🇬🇭',
        servingPortion: '1 Persona',
        accompanimentOptions: ['Salsa Shito Nera Artigianale', 'Uovo Sodo Dorato', 'Gari Tostato']
      },
      {
        id: 'd-kelewele-gh',
        name: 'Kelewele Croccante allo Zenzero Fresco e Peperoncino',
        description: 'Bocconcini dorati di platano maturo marinati con zenzero fresco pestato al mortaio, aglio, noce moscata, anice e peperoncino selvatico, fritti fino a doratura caramellata.',
        price: 7.50,
        image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-kwame-gh',
        tags: ['Vegetariano', 'Antipasto', 'Speziato allo Zenzero'],
        dietary: ['Vegetarian', 'Vegan', 'Gluten Free'],
        africanRegion: 'West Africa',
        countryOrigin: 'Ghana',
        countryFlag: '🇬🇭'
      }
    ]
  },
  {
    id: 'c-samuel-cm',
    name: 'Chef Samuel Mengue (Douala & Yaoundé)',
    nationality: '🇨🇲',
    countryName: 'Camerun',
    continent: 'Africa',
    bio: 'Ndolé Reale dei Sawa con gamberoni e manzo, Poulet DG festivo e Poivre de Penja.',
    fullBio: 'Samuel è un maestro indiscusso delle grandi preparazioni festive camerunensi. Il suo Ndolé segue il rito tradizionale del lavaggio minuzioso delle foglie di Vernonia con crema di arachidi fresche e gamberetti essiccati macinati.',
    avatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=400&q=80',
    rating: 4.94,
    location: 'Torino, Cenisia',
    distance: 2.0,
    specialties: ['Ndolé Royal Sawa Gambas & Viande', 'Poulet DG des Fêtes', 'Koki de Niébé al Vapore'],
    availability: ['18:00 - 22:00'],
    availableDays: [2, 4, 5, 6],
    reviews: [],
    dishes: [
      {
        id: 'd-ndole-cm',
        name: 'Ndolé Reale dei Sawa con Gamberoni & Manzo Fondente',
        description: 'Foglie selvatiche di Vernonia lavate 7 volte, stufate in vellutata crema di arachidi fresche macinate, gamberetti secchi, cubotti di manzo tenero e sormontate da gamberi giganti saltati all\'olio profumato di cipolle novelle. Servito con Miondo o platani.',
        price: 18.50,
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-samuel-cm',
        tags: ['Gamberoni & Carne', 'Cottura Lenta', 'Gourmet Africano', 'Signature'],
        dietary: ['Gluten Free'],
        africanRegion: 'West Africa',
        countryOrigin: 'Camerun',
        countryFlag: '🇨🇲',
        isSlowCook: true,
        servingPortion: '1 Persona Generosa',
        accompanimentOptions: ['Miondo / Bobolo (Bastoncini di Manioca Fermentata)', 'Platani Fritti o Bolliti', 'Riso Bianco al Vapore']
      },
      {
        id: 'd-pouletdg-cm',
        name: 'Poulet DG (Directeur Général) delle Grandi Feste',
        description: 'Il prestigioso piatto camerunese delle feste: bocconcini di pollo ruspante marinato saltati nel wok con rondelle di platani maturi dolci, carotine novelle, peperoni dolci, zenzero e prezioso pepe bianco di Penja IGP.',
        price: 16.50,
        image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-samuel-cm',
        tags: ['Pollo', 'Platano Dolce', 'Pepe di Penja IGP'],
        dietary: ['Gluten Free', 'Halal'],
        africanRegion: 'West Africa',
        countryOrigin: 'Camerun',
        countryFlag: '🇨🇲'
      }
    ]
  },

  // ==========================================
  // --- CORNO D'AFRICA & EAST AFRICA ---
  // ==========================================
  {
    id: 'c-amara-et',
    name: 'Chef Yodit Bekele (Addis Abeba Heritage)',
    nationality: '🇪🇹',
    countryName: 'Etiopia',
    continent: 'Africa',
    bio: 'Injera 100% puro Teff fermentato, Doro Wat reale delle feste e Beyaynetu vegano.',
    fullBio: 'Yodit fa arrivare il Teff biologico direttamente dagli altipiani etiopi di Shewa. La fermentazione naturale dell\'Injera dura 72 ore per garantire la consistenza perfettamente spugnosa e areata.',
    avatar: 'https://images.unsplash.com/photo-1531123414780-f74242c2b052?auto=format&fit=crop&w=400&q=80',
    rating: 4.99,
    location: 'Roma, Esquilino & Termini',
    distance: 1.2,
    specialties: ['Doro Wat Reale con Berbere', 'Beyaynetu Vegano (Tris di Salse)', 'Zigni di Manzo Speziato', 'Sambusa al Cardamomo'],
    availability: ['12:30 - 15:30', '19:00 - 23:00'],
    availableDays: [1, 2, 3, 4, 5, 6, 0],
    reviews: [
      { id: 'rev-et-1', author: 'Elena Moretti', rating: 5, comment: 'L\'Injera è 100% Teff autentico, morbidissima ed elastica. Il Doro Wat ha un equilibrio di spezie Berbere e Niter Kibbeh sublime!', date: '2026-08-11' }
    ],
    dishes: [
      {
        id: 'd-dorowat-et',
        name: 'Doro Wat delle Feste con Uova Sode & Injera di Teff',
        description: 'Il più nobile stufato etiope: cosce di pollo marinate al succo di limone e cotte per 4 ore con purea di cipolle rosse caramellate lentamente, burro chiarificato aromatico (Niter Kibbeh) e miscela Berbere. Servito su grande Injera di Teff con uova sode immerse nella salsa.',
        price: 18.00,
        image: 'https://images.unsplash.com/photo-1542354256-4b68e7d7f26c?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-amara-et',
        tags: ['Pollo', 'Spezie Berbere', 'Niter Kibbeh', 'Tradizionale'],
        dietary: ['Gluten Free', 'Halal'],
        africanRegion: 'East Africa',
        countryOrigin: 'Etiopia',
        countryFlag: '🇪🇹',
        isSlowCook: true,
        servingPortion: '1-2 Persone',
        accompanimentOptions: ['Injera Tradizionale Extra', 'Formaggio Fresco Ayib', 'Gomen (Spinaci Etiopi al Vapore)'],
        spiceOptions: ['Berbere Delicato', 'Berbere Tradizionale Etiopico (Intenso)', 'Extra Piccante con Polvere Mitmita']
      },
      {
        id: 'd-beyaynetu-et',
        name: 'Beyaynetu Misto Vegano (Tris di Salse su Injera)',
        description: 'Piatto 100% vegetale della tradizione di digiuno etiope: Shiro Wat (vellutata di ceci ed erbe fini), Misir Wat (lenticchie rosse speziate al Berbere), Kik Alicha (piselli spezzati dolci alla curcuma) e spinaci Gomen.',
        price: 16.00,
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-amara-et',
        tags: ['Vegano', 'Lenticchie', 'Gluten Free', 'Salutare'],
        dietary: ['Vegetarian', 'Vegan', 'Gluten Free', 'Lactose Free'],
        africanRegion: 'East Africa',
        countryOrigin: 'Etiopia',
        countryFlag: '🇪🇹'
      }
    ]
  },
  {
    id: 'c-zalika-ke',
    name: 'Chef Zalika Juma (Mombasa & Swahili Coast)',
    nationality: '🇰🇪',
    countryName: 'Kenya',
    continent: 'Africa',
    bio: 'Cucina della costa Swahili di Mombasa e Zanzibar: Beef Pilau, Nyama Choma e Chapati caldi.',
    fullBio: 'Zalika porta in tavola la ricchezza degli aromi dell\'Oceano Indiano e della costa swahili: cardamomo verde, cannella, chiodi di garofano, latte di cocco e carni alla brace accompagnate dalla freschezza dell\'insalata Kachumbari.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    rating: 4.92,
    location: 'Firenze, Rifredi',
    distance: 2.3,
    specialties: ['Beef Pilau Speziato', 'Swahili Nyama Choma', 'Chapati Sfoglia Dorati'],
    availability: ['18:30 - 22:30'],
    availableDays: [4, 5, 6, 0],
    reviews: [],
    dishes: [
      {
        id: 'd-pilau-ke',
        name: 'Swahili Beef Pilau con Insalata Fresca Kachumbari',
        description: 'Riso basmati cotto a fuoco lento nel ricco brodo di manzo speziato con baccelli di cardamomo verde, cannella intera, cumino tostato e cipolle dorate caramellate, servito con insalata fresca kachumbari di pomodoro, cipolla rossa e lime.',
        price: 14.50,
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-zalika-ke',
        tags: ['Carne di Manzo', 'Riso Aromatico', 'Swahili Coast'],
        dietary: ['Gluten Free', 'Halal'],
        africanRegion: 'East Africa',
        countryOrigin: 'Kenya',
        countryFlag: '🇰🇪'
      },
      {
        id: 'd-choma-ke',
        name: 'Kenyan Nyama Choma & Chapati Morbidi Dorati (Duo)',
        description: 'Bocconi teneri di manzo e agnello marinati alle erbe costiere e arrostiti alla brace, serviti con morbidi chapati sfogliati caldi cotti sulla piastra tradizionale.',
        price: 17.00,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-zalika-ke',
        tags: ['Carne', 'Grigliato a Brace', 'Pane Fresco'],
        dietary: ['Halal'],
        africanRegion: 'East Africa',
        countryOrigin: 'Kenya',
        countryFlag: '🇰🇪'
      }
    ]
  },

  // ==========================================
  // --- AFRICA CENTRALE & AUSTRALE ---
  // ==========================================
  {
    id: 'c-grace-cd',
    name: 'Mama Grace Mukendi (Kinshasa & Brazza)',
    nationality: '🇨🇩',
    countryName: 'RDC Congo',
    continent: 'Africa',
    bio: 'Poulet à la Moambé (Mwamba), Pondu / Saka-Saka fresco al mortaio e Makemba.',
    fullBio: 'Mama Grace prepara i piatti leggendari delle rive del grande fiume Congo. La polpa di palma selvatica naturale e le tenere foglie di manioca pestate a mano conferiscono sapori profondi e indimenticabili.',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80',
    rating: 4.96,
    location: 'Roma, Tuscolana',
    distance: 3.0,
    specialties: ['Poulet à la Moambé (Mwamba)', 'Pondu / Saka-Saka con Pesce Affumicato', 'Platani Makemba Fritti'],
    availability: ['12:00 - 21:30'],
    availableDays: [1, 3, 5, 6, 0],
    reviews: [],
    dishes: [
      {
        id: 'd-moambe-cd',
        name: 'Poulet à la Moambé Tradizionale con Riso e Platani',
        description: 'Pollo ruspante cotto a fuoco lento nella vellutata salsa naturale di noci di palma selvatica (Moambé), aglio, noce moscata e peperoncino dolce, servito con riso profumato e platani Makemba fritti.',
        price: 16.50,
        image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-grace-cd',
        tags: ['Pollo', 'Noci di Palma Naturale', 'Tradizionale Congolese'],
        dietary: ['Gluten Free', 'Halal'],
        africanRegion: 'Central & Southern Africa',
        countryOrigin: 'RDC Congo',
        countryFlag: '🇨🇩',
        isSlowCook: true,
        servingPortion: '1 Persona'
      },
      {
        id: 'd-pondu-cd',
        name: 'Pondu / Saka-Saka con Pesce Secco Affumicato',
        description: 'Foglie tenere di manioca pestate a mano nel mortaio di legno con cipollotto, porri e aglio, stufate lentamente con olio di palma puro e scaglie di pesce nobile affumicato.',
        price: 15.00,
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-grace-cd',
        tags: ['Foglie di Manioca', 'Pesce Affumicato', 'Cottura Lenta'],
        dietary: ['Gluten Free'],
        africanRegion: 'Central & Southern Africa',
        countryOrigin: 'RDC Congo',
        countryFlag: '🇨🇩',
        isSlowCook: true
      }
    ]
  },

  // ==========================================
  // --- NORD AFRICA & MAGHREB ---
  // ==========================================
  {
    id: 'c-fatima-ma',
    name: 'Chef Fatima El-Amrani (Marrakech Medina)',
    nationality: '🇲🇦',
    countryName: 'Marocco',
    continent: 'Africa',
    bio: 'Tajine d\'agnello con prugne caramellate, Couscous Reale e Pastilla andaluso-marocchina.',
    fullBio: 'Fatima cucina con tajine di terracotta antica tramandata da tre generazioni e spezie raccolte nei souk dell\'Alto Atlante: puro zafferano di Taliouine, cannella di Ceylon e Ras el Hanout alle 27 spezie.',
    avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=400&q=80',
    rating: 5.0,
    location: 'Palermo, Centro Storico',
    distance: 0.9,
    specialties: ['Tajine d\'Agnello & Prugne Caramellate', 'Pastilla Reale di Pollo & Mandorle', 'Couscous alle 7 Verdure'],
    availability: ['12:00 - 15:00', '19:00 - 22:30'],
    availableDays: [1, 2, 4, 5, 6, 0],
    reviews: [
      { id: 'rev-ma-1', author: 'Samir', rating: 5, comment: 'La carne della tajine si scioglie in bocca come burro. Il profumo di zafferano e fiori d\'arancio è incredibile.', date: '2026-08-08' }
    ],
    dishes: [
      {
        id: 'd-tagine-ma',
        name: 'Tajine d\'Agnello con Prugne Caramellate & Mandorle Tostate',
        description: 'Bocconcini teneri di spalla d\'agnello cotti a fuoco dolcissimo per 5 ore in terracotta con zafferano puro di Taliouine, cipolle dorate, prugne secche caramellate all\'acqua di fiori d\'arancio, cannella e mandorle tostate croccanti.',
        price: 18.50,
        image: 'https://images.unsplash.com/photo-1511690656952-34342d5c2895?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-fatima-ma',
        tags: ['Carne d\'Agnello', 'Cottura Lenta in Terracotta', 'Agrodolce', 'Signature'],
        dietary: ['Gluten Free', 'Halal'],
        africanRegion: 'North Africa & Maghreb',
        countryOrigin: 'Marocco',
        countryFlag: '🇲🇦',
        isSlowCook: true,
        servingPortion: '1 Persona',
        accompanimentOptions: ['Pane Marocchino Tradizionale Khobz', 'Couscous Fine al Vapore']
      },
      {
        id: 'd-pastilla-ma',
        name: 'Pastilla Reale Tradizionale di Pollo e Mandorle Speziate',
        description: 'Sfoglia warka/brick sottilissima e croccante ripiena di pollo sfilacciato al limone confit e coriandolo fresco, uova montate cremose e mandorle tostate tritate con cannella e zucchero a velo.',
        price: 14.50,
        image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-fatima-ma',
        tags: ['Pollo', 'Agrodolce', 'Croccante', 'Capolavoro Marocchino'],
        dietary: ['Halal'],
        africanRegion: 'North Africa & Maghreb',
        countryOrigin: 'Marocco',
        countryFlag: '🇲🇦'
      }
    ]
  },
  {
    id: 'c-nadia-eg',
    name: 'Chef Nadia Mansour (Al-Qahira Heritage)',
    nationality: '🇪🇬',
    countryName: 'Egitto',
    continent: 'Africa',
    bio: 'Koshary Reale dell\'Antico Cairo, Ta\'ameya dorata alle fave e spezie del Nilo.',
    fullBio: 'Nadia porta a Roma il comfort food più autentico delle sponde del Nilo. Piatti ricchi di legumi, spezie delicate e salse tradizionali come la Daqqa all\'aglio e all\'aceto.',
    avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=400&q=80',
    rating: 4.93,
    location: 'Roma, Esquilino',
    distance: 0.8,
    specialties: ['Koshary Reale del Cairo', 'Ta\'ameya alle Fave Decorticate', 'Basbousa al Miele'],
    availability: ['11:30 - 20:00'],
    availableDays: [1, 2, 3, 4, 5, 6],
    reviews: [],
    dishes: [
      {
        id: 'd-koshary-eg',
        name: 'Koshary Reale dell\'Antico Cairo con Salsa Daqqa',
        description: 'La leggenda egiziana: strati di riso speziato, lenticchie brune, ceci morbidi, vermicelli dorati, coperti da salsa densa di pomodoro al cumino, salsa Daqqa all\'aglio e aceto e cipolle croccantissime fritte dorate.',
        price: 11.50,
        image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-nadia-eg',
        tags: ['Vegano', 'Comfort Food Egiziano', 'Legumi'],
        dietary: ['Vegetarian', 'Vegan', 'Halal'],
        africanRegion: 'North Africa & Maghreb',
        countryOrigin: 'Egitto',
        countryFlag: '🇪🇬'
      }
    ]
  },
  {
    id: 'c-leila-tn',
    name: 'Chef Leila Trabelsi (Carthage Flavors)',
    nationality: '🇹🇳',
    countryName: 'Tunisia',
    continent: 'Africa',
    bio: 'Couscous di pesce piccante all\'Harissa artigianale e Brik croccante all\'uovo coulant.',
    fullBio: 'Leila lavora la semola fine a mano e prepara l\'Harissa fresca con peperoni rossi affumicati essiccati al sole e semi di carvi selvatico.',
    avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=400&q=80',
    rating: 4.95,
    location: 'Trapani, Centro Storico',
    distance: 0.5,
    specialties: ['Couscous di Pesce alla Tunisina', 'Brik Tunisino all\'Uovo & Tonno', 'Ojja alle Merguez'],
    availability: ['12:00 - 22:00'],
    availableDays: [1, 2, 3, 4, 5, 6, 0],
    reviews: [],
    dishes: [
      {
        id: 'd-couscous-tn',
        name: 'Couscous di Pesce con Brodo Piccante all\'Harissa',
        description: 'Semola fine incocciata a mano cotta al vapore su brodo aromatico di cernia e triglie, servita con tranci di pesce freschissimo, zucca dolce, ceci e Harissa artigianale tunisina.',
        price: 18.00,
        image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-leila-tn',
        tags: ['Pesce Fresco', 'Piccante', 'Harissa Artigianale', 'Tradizionale'],
        dietary: ['Halal'],
        africanRegion: 'North Africa & Maghreb',
        countryOrigin: 'Tunisia',
        countryFlag: '🇹🇳'
      }
    ]
  },

  // ==========================================
  // --- BEVANDE, DOLCI & DISPENSA AFRO-GOURMET ---
  // ==========================================
  {
    id: 'c-afro-drinks',
    name: 'AirAFRIC - Bar & Pasticceria Tradizionale',
    nationality: '🌍',
    countryName: 'Pan-Africana',
    continent: 'Africa',
    bio: 'Bissap ai fiori d\'ibisco, Succo di Zenzero Gnamakoudji, Degue al miglio e Puff Puff caldi.',
    fullBio: 'Laboratorio artigianale dedicato a bevande rinfrescanti naturali, infusi di calici d\'ibisco selvatico, estratti di zenzero fresco e pasticceria secolare africana senza conservanti.',
    avatar: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80',
    rating: 5.0,
    location: 'Milano, Roma, Torino & Bologna',
    distance: 0.1,
    specialties: ['Bissap ai Fiori d\'Ibisco', 'Gnamakoudji allo Zenzero Fresco', 'Degue / Thiakry Gourmet', 'Puff Puff / Bofrot Caldi'],
    availability: ['10:00 - 23:00'],
    availableDays: [0, 1, 2, 3, 4, 5, 6],
    reviews: [],
    dishes: [
      {
        id: 'd-bissap',
        name: 'Bissap Artigianale ai Fiori d\'Ibisco & Menta (500ml)',
        description: 'Infuso puro di calici di ibisco selvatico africano (Karkadè) con foglie di menta fresca del giardino, scorza d\'arancia e un tocco di vaniglia naturale. Servito freddissimo.',
        price: 4.50,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-afro-drinks',
        tags: ['Bevanda Naturale', 'Ibisco Karkadè', 'Antiossidante', 'Vegano'],
        dietary: ['Vegetarian', 'Vegan', 'Gluten Free', 'Halal'],
        africanRegion: 'Afro-Fusion & Grocery',
        countryOrigin: 'Senegal & West Africa',
        countryFlag: '🇸🇳'
      },
      {
        id: 'd-gnama',
        name: 'Gnamakoudji - Succo Energizzante di Zenzero & Ananas (500ml)',
        description: 'Estratto puro di radice di zenzero fresco spremuto a freddo con ananas Victoria dolce, lime e noce moscata. Piccante, rinfrescante ed energizzante.',
        price: 5.00,
        image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-afro-drinks',
        tags: ['Bevanda Naturale', 'Zenzero Fresco', 'Detox', 'Energizzante'],
        dietary: ['Vegetarian', 'Vegan', 'Gluten Free', 'Halal'],
        africanRegion: 'Afro-Fusion & Grocery',
        countryOrigin: 'Costa d\'Avorio',
        countryFlag: '🇨🇮'
      },
      {
        id: 'd-degue',
        name: 'Degue / Thiakry Gourmet al Miglio & Yogurt Dolce',
        description: 'Couscous dolce di granelli di miglio lavorati a mano e cotti al vapore, immersi in crema densa di yogurt fresco artigianale, noce moscata e fiori d\'arancio.',
        price: 6.00,
        image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-afro-drinks',
        tags: ['Dolce Tradizionale', 'Miglio al Vapore', 'Yogurt Artigianale'],
        dietary: ['Vegetarian', 'Gluten Free'],
        africanRegion: 'Afro-Fusion & Grocery',
        countryOrigin: 'West Africa',
        countryFlag: '🇨🇮'
      },
      {
        id: 'd-puffpuff',
        name: 'Puff Puff / Bofrot Dorati alla Cannella (8 pz)',
        description: 'Soffici bignè fritti dorati africani profumati alla noce moscata e vaniglia, serviti caldissimi con spolverata leggera di zucchero o salsa al caramello di cocco.',
        price: 6.50,
        image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-afro-drinks',
        tags: ['Dolce Frittelle', 'Street Food Dorato'],
        dietary: ['Vegetarian', 'Vegan', 'Halal'],
        africanRegion: 'Afro-Fusion & Grocery',
        countryOrigin: 'Nigeria & Ghana',
        countryFlag: '🇳🇬'
      }
    ]
  }
];
