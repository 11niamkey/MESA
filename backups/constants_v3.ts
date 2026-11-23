import { Chef, CultureStory } from './types';

export const MOCK_CULTURE_STORIES: CultureStory[] = [
  {
    id: 's-afric-1',
    title: 'Garba & Attiéké: L\'Oro Bianco della Costa d\'Avorio',
    country: 'Costa d\'Avorio',
    flag: '🇨🇮',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=1200&q=80',
    content: 'L\'Attiéké è una semola di manioca fermentata e cotta al vapore, patrimonio culinario immateriale ivoriano. Nella versione "Garba", viene abbinato al tonno fritto croccante, brunoise di cipolle rosse, pomodoro fresco e olio speziato. Una sinfonia di contrasti tra l\'acidità rinfrescante della manioca e la sapidità del pesce.',
    funFact: 'Il termine "Garba" deriva dal nome del primo cuoco nigerino che rese celebre questa combinazione sulle rive della laguna di Abidjan negli anni \'90.'
  },
  {
    id: 's-afric-2',
    title: 'Jollof Wars: Il Mito del Riso di West Africa',
    country: 'Nigeria & Ghana',
    flag: '🇳🇬',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1200&q=80',
    content: 'La "Jollof War" tra Nigeria, Ghana e Senegal è una delle rivalità gastronomiche più celebri al mondo. Il Jollof nigeriano è noto per il suo inconfondibile retrogusto "Party Smoke" cotto a legna con pomodoro ridotto e pepe Scotch Bonnet; la versione ghanese preferisce riso Jasmine profumato e spezie aromatiche.',
    funFact: 'L\'antenato storico comune del Jollof è il "Thieboudienne" (Ceebu Jën) nato nella regione di Saint-Louis in Senegal tra il popolo Wolof.'
  },
  {
    id: 's-afric-3',
    title: 'Thieboudienne & Teranga: L\'Ospitalità Senegalese',
    country: 'Senegal',
    flag: '🇸🇳',
    image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=1200&q=80',
    content: 'Dichiarato Patrimonio Culturale UNESCO, il Thieboudienne (Ceebu Jën) è l\'incarnazione della "Teranga", il valore sacro dell\'accoglienza senegalese. Cernia o pesce nobile stufato con manioca, carote, cavolo e melanzane in un brodo di pomodoro concentrato e riso spezzato.',
    funFact: 'Secondo la tradizione, si mangia tutti insieme attorno a un grande piatto comune "bol", condividendo i pezzi migliori con gli ospiti.'
  },
  {
    id: 's-afric-4',
    title: 'Injera & Doro Wat: Il Ritmo Sacro dell\'Altopiano Etiope',
    country: 'Etiopia',
    flag: '🇪🇹',
    image: 'https://images.unsplash.com/photo-1542354256-4b68e7d7f26c?auto=format&fit=crop&w=1200&q=80',
    content: 'L\'Injera è una crêpe spugnosa a base di Teff, un cereale antico privo di glutine fatto fermentare per tre giorni. Funziona sia da piatto che da posata per raccogliere il Doro Wat (stufato di pollo speziato con Berbere e uova sode), in un rito conviviale di condivisione.',
    funFact: 'La cerimonia tradizionale del "Gursha" consiste nell\'imboccare con le proprie mani la persona amata o un ospite d\'onore in segno di rispetto.'
  },
  {
    id: 's-afric-5',
    title: 'Ndolé: Il Tesoro di Foglie Amare del Camerun',
    country: 'Camerun',
    flag: '🇨🇲',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
    content: 'Piatto d\'onore della costa camerunese dei Sawa, il Ndolé richiede ore di sapiente preparazione. Le foglie amare selvatiche vengono lavate accuratamente e stufate con pasta di arachidi fresche macinate, gamberi essiccati, carne affumicata e rifinite con olio profumato di cipolle.',
    funFact: 'Nei grandi matrimoni e celebrazioni in Camerun, la presenza del Ndolé è considerata il termometro dell\'eccellenza e della ricchezza dell\'evento.'
  },
  {
    id: 's-afric-6',
    title: 'Suya: Lo Street Food Notturno dei Maestri Mai Suya',
    country: 'Nigeria & Niger',
    flag: '🇳🇬',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    content: 'Spiedini di manzo succulento tagliato sottilissimo e marinato nella miscela Yaji (panello di arachidi tostate Kuli-Kuli, zenzero, aglio, peperoncino e spezie africane). Cotti sulla brace ardente e serviti avvolti in carta con cipolle rosse crude.',
    funFact: 'I veri maestri "Mai Suya" del popolo Hausa tramandano la composizione esatta del loro mix Yaji come un segreto di famiglia inaccessibile.'
  },
  {
    id: 's-afric-7',
    title: 'Poulet Braisé & Alloco: La Vita Notturna nei Maquis',
    country: 'Costa d\'Avorio & Africa Occidentale',
    flag: '🇨🇮',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1200&q=80',
    content: 'Nei vivaci "Maquis" all\'aperto di Abidjan, Bamako e Cotonou, il profumo del pollo ruspante marinato alle erbe africane e arrostito sul carbone di legna si mescola a quello dell\'Alloco dorato e caramellato. Un inno alla convivialità notturna.',
    funFact: 'L\'Alloco perfetto si ottiene solo usando platani al giusto grado di maturazione, con buccia gialla screziata di nero per la massima dolcezza.'
  },
  {
    id: 's-afric-8',
    title: 'Tajine & Pastilla: La Geometria degli Aromi del Maghreb',
    country: 'Marocco & Nord Africa',
    flag: '🇲🇦',
    image: 'https://images.unsplash.com/photo-1511690656952-34342d5c2895?auto=format&fit=crop&w=1200&q=80',
    content: 'La cucina del Maghreb è un equilibrio millenario tra dolce e salato: carne stufata a fuoco lento nella terracotta con prugne e mandorle, o la Pastilla andaluso-marocchina che unisce strati croccanti di pasta brick, piccione o pollo speziato, cannella e zucchero a velo.',
    funFact: 'Il coperchio conico della tajine fa condensare il vapore arricchito di spezie, permettendo cotture tenerissime con pochissima acqua nei climi aridi.'
  }
];

export const MOCK_CHEFS: Chef[] = [
  // ==========================================
  // --- AFRICA OCCIDENTALE (WEST AFRICA) ---
  // ==========================================
  {
    id: 'c-amara-ci',
    name: 'Amara Koffi & Mamy Lou',
    nationality: '🇨🇮',
    countryName: 'Costa d\'Avorio',
    continent: 'Africa',
    bio: 'Regina del Garba autentico, Alloco e Poisson Braisé di Abidjan.',
    fullBio: 'Amara ha appreso i segreti della fermentazione dell\'Attiéké e delle marinature lagunari da sua nonna a Treichville. Porta nel piatto l\'energia solare e la generosità senza eguali della cucina ivoriana autentica.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    rating: 4.98,
    location: 'Milano, Porta Venezia & Stazione Centrale',
    distance: 1.1,
    specialties: ['Garba Royale', 'Tilapia Braisée au Charbon', 'Alloco & Sauce Piment', 'Placali Sauce Gombo'],
    availability: ['11:30 - 15:00', '18:30 - 23:00'],
    availableDays: [1, 2, 3, 4, 5, 6, 0],
    reviews: [
      { id: 'rev-ci-1', author: 'Bakary', rating: 5, comment: 'Attiéké fresco identico a quello di Abidjan. Il pesce fritto con la salsa di cipolle è insuperabile!', date: '2026-08-10' },
      { id: 'rev-ci-2', author: 'Chiara', rating: 5, comment: 'L\'Alloco con la salsa a parte è una delizia dolce-piccante indimenticabile.', date: '2026-08-05' }
    ],
    dishes: [
      {
        id: 'd-garba-ci',
        name: 'Garba Reale d\'Abidjan (Attiéké & Thon Frit)',
        description: 'Semola di manioca fermentata al vapore (Attiéké fresco) con trancio di tonno marinato e fritto croccante, brunoise di cipolla rossa, pomodoro fresco, dadi aromatizzati e peperoncino ivoriano.',
        price: 13.50,
        image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-amara-ci',
        tags: ['Pesce', 'Manioca', 'Gluten Free', 'Best Seller'],
        dietary: ['Gluten Free', 'Halal'],
        africanRegion: 'West Africa',
        countryOrigin: 'Costa d\'Avorio',
        countryFlag: '🇨🇮',
        servingPortion: '1 Persona (Generosa)',
        accompanimentOptions: ['Attiéké Fresco al Vapore', 'Extra Alloco (+€3.00)', 'Riso Bianco Profumato'],
        spiceOptions: ['Dolce / Zero Piccante', 'Leggero Aromatico', 'Medio Tradizionale', 'Piquant Africain (Peperoncino Habanero)'],
        ingredients: ['Attiéké biologico', 'Trancio di Tonno fresco', 'Cipolla rossa', 'Pomodoro da insalata', 'Piment bec d\'oiseau', 'Olio vegetale vergine', 'Spezie ivoriane'],
        preparation: 'L\'Attiéké viene lavorato a grani fini e scaldato al vapore d\'acqua. Il tonno viene marinato per 4 ore con erbe e fritto in olio dorato per mantenere l\'interno succoso.'
      },
      {
        id: 'd-braise-ci',
        name: 'Poisson Braisé Tilapia Intera & Alloco',
        description: 'Tilapia intera fresca marinata con zenzero, aglio, pepe bianco di Penja e spezie del sottobosco, arrostita su griglia a carbone. Servita con platani dolci fritti (Alloco) e salsa maquis.',
        price: 18.50,
        image: 'https://images.unsplash.com/photo-1534080564607-c980d49451d7?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-amara-ci',
        tags: ['Pesce', 'Grigliato', 'Gluten Free', 'Specialità'],
        dietary: ['Gluten Free', 'Halal'],
        africanRegion: 'West Africa',
        countryOrigin: 'Costa d\'Avorio',
        countryFlag: '🇨🇮',
        servingPortion: '1-2 Persone',
        accompanimentOptions: ['Alloco Dorato', 'Attiéké al Vapore', 'Riso Jollof (+€2.00)'],
        spiceOptions: ['Dolce', 'Medio', 'Piccante Vivo'],
        ingredients: ['Tilapia intera', 'Platani maturi', 'Pepe di Penja', 'Zenzero fresco', 'Aglio', 'Olio aromatico']
      },
      {
        id: 'd-kedjenou-ci',
        name: 'Kédjénou di Pollo Rustico in Terracotta',
        description: 'Stufato a cottura lenta ermetica in vaso di terracotta con pollo ruspante, melanzane africane, pomodoro concentrato e zenzero senza aggiunta di grassi.',
        price: 15.00,
        image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-amara-ci',
        tags: ['Pollo', 'Cottura Lenta', 'Tradizionale'],
        dietary: ['Gluten Free', 'Halal'],
        africanRegion: 'West Africa',
        countryOrigin: 'Costa d\'Avorio',
        countryFlag: '🇨🇮',
        isSlowCook: true,
        servingPortion: '1 Persona',
        accompanimentOptions: ['Attiéké Fresco', 'Riso Bianco', 'Fufu di Banana']
      }
    ]
  },
  {
    id: 'c-moussa-sn',
    name: 'Chef Moussa & Teranga Dakar',
    nationality: '🇸🇳',
    countryName: 'Senegal',
    continent: 'Africa',
    bio: 'Maestro del Thieboudienne Rosso e del Poulet Yassa al lime di Casamance.',
    fullBio: 'Nato a Saint-Louis in Senegal, Moussa porta alta la bandiera della Teranga a Torino. Ogni piatto è preparato secondo i canoni della tradizione senegalese, con brodi lenti e pesce di prima scelta.',
    avatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=400&q=80',
    rating: 4.95,
    location: 'Torino, San Salvario',
    distance: 1.4,
    specialties: ['Thieboudienne Penda Mbaye', 'Poulet Yassa au Feu de Bois', 'Dibi d\'Agneau', 'Pastels de Poisson'],
    availability: ['12:00 - 15:00', '19:00 - 22:30'],
    availableDays: [2, 3, 4, 5, 6, 0],
    reviews: [
      { id: 'rev-sn-1', author: 'Ousmane', rating: 5, comment: 'Il miglior Tiep di tutto il nord Italia! Il riso ha il colore e la consistenza perfetta.', date: '2026-08-14' }
    ],
    dishes: [
      {
        id: 'd-thieb-sn',
        name: 'Thieboudienne Rosso UNESCO (Ceebu Jën Penda Mbaye)',
        description: 'Il piatto nazionale senegalese patrimonio UNESCO: riso spezzato cotto nel concentrato di pomodoro speziato con cernia fresca farcita al roff (prezzemolo, aglio, peperoncino), manioca, carote e cavolo.',
        price: 16.50,
        image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-moussa-sn',
        tags: ['Pesce', 'Riso Spezzato', 'UNESCO', 'Signature'],
        dietary: ['Halal'],
        africanRegion: 'West Africa',
        countryOrigin: 'Senegal',
        countryFlag: '🇸🇳',
        isSlowCook: true,
        servingPortion: '1 Persona Abbondante',
        accompanimentOptions: ['Riso Rosso al Brodo di Pesce', 'Verdure Stufate Miste'],
        spiceOptions: ['Medio Tradizionale', 'Non Piccante', 'Extra Piment Touba']
      },
      {
        id: 'd-yassa-sn',
        name: 'Poulet Yassa al Limone di Casamance',
        description: 'Cosce di pollo marinate per 12 ore nel succo di lime fresco, senape di Digione, aglio e una montagna di cipolle dolci caramellate a fuoco lento sul carbone.',
        price: 14.50,
        image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-moussa-sn',
        tags: ['Pollo', 'Agrumato', 'Caramellato', 'Classico'],
        dietary: ['Gluten Free', 'Halal'],
        africanRegion: 'West Africa',
        countryOrigin: 'Senegal',
        countryFlag: '🇸🇳',
        servingPortion: '1 Persona',
        accompanimentOptions: ['Riso Bianco Jasmine', 'Attiéké', 'Platani Fritti']
      },
      {
        id: 'd-pastels-sn',
        name: 'Pastels de Poisson Dorati con Salsa Piment Vert (6 pz)',
        description: 'Fagottini artigianali fritti ripieni di polpa di pesce fresco aromatizzato con erbe, serviti caldissimi con salsa densa di pomodoro e piment senegalese.',
        price: 8.50,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
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
    name: 'Adunni & Mama Lagos Kitchen',
    nationality: '🇳🇬',
    countryName: 'Nigeria',
    continent: 'Africa',
    bio: 'Lo street food di Lagos: Party Jollof affumicato, Suya Skewers ed Egusi Soup.',
    fullBio: 'Adunni porta l\'energia travolgente e le spezie inconfondibili della Nigeria. Specializzata nei grandi banchetti e nella cottura su legna naturale.',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&q=80',
    rating: 4.97,
    location: 'Milano, Loreto & NoLo',
    distance: 2.2,
    specialties: ['Smoky Party Jollof', 'Authentic Suya Beef', 'Egusi Soup & Pounded Yam', 'Pepper Soup'],
    availability: ['12:00 - 22:00'],
    availableDays: [1, 2, 3, 4, 5, 6],
    reviews: [
      { id: 'rev-ng-1', author: 'David', rating: 5, comment: 'The Smoky Jollof is literally perfection. Tastes like a true Nigerian wedding in Lagos!', date: '2026-08-16' }
    ],
    dishes: [
      {
        id: 'd-jollof-ng',
        name: 'Smoky Party Jollof Rice & Fried Chicken Box',
        description: 'Riso a chicco lungo tostato e cotto in purea di pomodori freschi, peperoni rossi dolci e Scotch Bonnet affumicato sul fuoco. Servito con coscia di pollo dorata speziata e platani fritti Dodo.',
        price: 15.50,
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-adunni-ng',
        tags: ['Pollo', 'Riso Speziato', 'Iconico', 'Party Favorite'],
        dietary: ['Gluten Free', 'Halal'],
        africanRegion: 'West Africa',
        countryOrigin: 'Nigeria',
        countryFlag: '🇳🇬',
        servingPortion: '1 Persona Generosa',
        accompanimentOptions: ['Dodo (Platani Fritti Dolci)', 'Insalata Coleslaw Tradizionale', 'Extra Coscia di Pollo (+€4.00)'],
        spiceOptions: ['Mild (Delicato)', 'Medium (Equilibrato)', 'Nigerian Hot (Autentico)']
      },
      {
        id: 'd-suya-ng',
        name: 'Mai Suya Skewers con Spezie Yaji (Tris di Spiedini)',
        description: 'Fette sottilissime di controfiletto di manzo marinate con polvere Yaji di arachidi tostate Kuli-Kuli, zenzero, aglio e pepe di Guinea, cotte su brace ardente con cipolle rosse fresche.',
        price: 13.00,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-adunni-ng',
        tags: ['Carne', 'Street Food', 'Arachidi', 'Grigliato'],
        dietary: ['Gluten Free', 'Halal'],
        africanRegion: 'West Africa',
        countryOrigin: 'Nigeria',
        countryFlag: '🇳🇬'
      },
      {
        id: 'd-egusi-ng',
        name: 'Egusi Soup Tradizionale con Pounded Yam',
        description: 'Zuppa densa e vellutata preparata con semi di melone egusi macinati, foglie amare di zucca, gamberetti secchi, manzo tenero e trippa stufata, accompagnata da morbido Pounded Yam fatto a mano.',
        price: 17.50,
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-adunni-ng',
        tags: ['Carne & Pesce', 'Cottura Lenta', 'Tradizionale'],
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
    name: 'Kwame Mensah - Accra Heritage',
    nationality: '🇬🇭',
    countryName: 'Ghana',
    continent: 'Africa',
    bio: 'Waakye reale con salsa Shito nera e Kelewele allo zenzero fresco.',
    fullBio: 'Kwame celebra la ricca cucina ghanese tramandata da tre generazioni. Famoso per la sua salsa Shito artigianale e per il Red Red stew a base di fagioli dell\'occhio.',
    avatar: 'https://images.unsplash.com/photo-1583336137348-82836e28d6c7?auto=format&fit=crop&w=400&q=80',
    rating: 4.89,
    location: 'Bologna, Bolognina',
    distance: 2.7,
    specialties: ['Waakye Special', 'Red Red Bean Stew', 'Kelewele Ginger Plantains'],
    availability: ['17:00 - 22:30'],
    availableDays: [0, 2, 4, 5, 6],
    reviews: [],
    dishes: [
      {
        id: 'd-waakye-gh',
        name: 'Waakye Ghanaian Delight con Uovo e Shito',
        description: 'Riso e fagioli cotti con foglie rosse essiccate di sorgo per un colore scuro naturale, servito con spezzatino di manzo tenero, spaghetti locali, gari e la leggendaria salsa nera piccante Shito.',
        price: 15.00,
        image: 'https://images.unsplash.com/photo-1542354256-4b68e7d7f26c?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-kwame-gh',
        tags: ['Carne', 'Riso & Fagioli', 'Ghanese'],
        dietary: ['Halal'],
        africanRegion: 'West Africa',
        countryOrigin: 'Ghana',
        countryFlag: '🇬🇭',
        servingPortion: '1 Persona',
        accompanimentOptions: ['Salsa Shito Nera Tradizionale', 'Uovo Sodo', 'Gari Tostato']
      },
      {
        id: 'd-kelewele-gh',
        name: 'Kelewele Croccante allo Zenzero e Chili Fresco',
        description: 'Cubetti dorati di platano maturo marinati con zenzero pestato al mortaio, aglio, noce moscata e peperoncino selvatico, fritti al momento.',
        price: 7.50,
        image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-kwame-gh',
        tags: ['Vegetariano', 'Antipasto', 'Speziato'],
        dietary: ['Vegetarian', 'Vegan', 'Gluten Free'],
        africanRegion: 'West Africa',
        countryOrigin: 'Ghana',
        countryFlag: '🇬🇭'
      }
    ]
  },
  {
    id: 'c-samuel-cm',
    name: 'Chef Samuel - Douala & Yaoundé',
    nationality: '🇨🇲',
    countryName: 'Camerun',
    continent: 'Africa',
    bio: 'Ndolé Reale con gamberi, Poulet DG e Koki de Niébé.',
    fullBio: 'Samuel è un maestro delle cotture lente camerunensi. Il suo Ndolé segue il rito del lavaggio delle foglie per garantire una nota amarognola sublime bilanciata dalle arachidi fresche.',
    avatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=400&q=80',
    rating: 4.93,
    location: 'Torino, Cenisia',
    distance: 2.0,
    specialties: ['Ndolé Royal Gambas & Viande', 'Poulet DG des Fêtes', 'Koki de Niébé'],
    availability: ['18:00 - 22:00'],
    availableDays: [2, 4, 5, 6],
    reviews: [],
    dishes: [
      {
        id: 'd-ndole-cm',
        name: 'Ndolé Reale del Camerun con Gamberi & Manzo',
        description: 'Foglie selvatiche di Vernonia lavate 7 volte, stufate in vellutata crema di arachidi fresche pestate, gamberetti secchi, cubotti di manzo tenero e sormontate da gamberi giganti saltati all\'olio di cipolla.',
        price: 18.50,
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-samuel-cm',
        tags: ['Pesce & Carne', 'Cottura Lenta', 'Gourmet Africano'],
        dietary: ['Gluten Free'],
        africanRegion: 'West Africa',
        countryOrigin: 'Camerun',
        countryFlag: '🇨🇲',
        isSlowCook: true,
        servingPortion: '1 Persona Generosa',
        accompanimentOptions: ['Miondo / Bobolo (Bastoncini di Manioca)', 'Platani Bolliti o Fritti', 'Riso Bianco']
      },
      {
        id: 'd-pouletdg-cm',
        name: 'Poulet DG (Directeur Général) Reale',
        description: 'Piatto festivo delle grandi occasioni: bocconcini di pollo ruspante marinato saltati con platani dolci a fette, carotine novelle, peperoni dolci, zenzero e fagiolini freschi.',
        price: 16.00,
        image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-samuel-cm',
        tags: ['Pollo', 'Platano', 'Festa'],
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
    name: 'Amara Bekele - Addis Abeba Heritage',
    nationality: '🇪🇹',
    countryName: 'Etiopia',
    continent: 'Africa',
    bio: 'Injera 100% puro Teff fermentato, Doro Wat delle feste e Zighinì.',
    fullBio: 'Amara fa arrivare il Teff biologico direttamente dagli altipiani etiopi. La fermentazione naturale dell\'Injera dura 72 ore per garantire la consistenza areata e spugnosa.',
    avatar: 'https://images.unsplash.com/photo-1531123414780-f74242c2b052?auto=format&fit=crop&w=400&q=80',
    rating: 4.99,
    location: 'Roma, Esquilino & Termini',
    distance: 1.2,
    specialties: ['Doro Wat Reale', 'Beyaynetu Vegano (10 Piatti)', 'Zighinì di Manzo Speziato', 'Sambusa al Cardamomo'],
    availability: ['12:30 - 15:30', '19:00 - 23:00'],
    availableDays: [1, 2, 3, 4, 5, 6, 0],
    reviews: [
      { id: 'rev-et-1', author: 'Elena', rating: 5, comment: 'L\'Injera è morbidissima e il piatto vegano Beyaynetu è un\'esperienza sensoriale fantastica.', date: '2026-08-11' }
    ],
    dishes: [
      {
        id: 'd-dorowat-et',
        name: 'Doro Wat delle Feste con Uova Sode & Injera',
        description: 'Il più nobile stufato etiope: cosce di pollo marinate al succo di limone e cotte per 4 ore con purea di cipolle rosse, burro chiarificato aromatico (Niter Kibbeh) e miscela Berbere. Servito su grande Injera di Teff.',
        price: 18.00,
        image: 'https://images.unsplash.com/photo-1542354256-4b68e7d7f26c?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-amara-et',
        tags: ['Pollo', 'Speziato', 'Berbere', 'Tradizionale'],
        dietary: ['Gluten Free', 'Halal'],
        africanRegion: 'East Africa',
        countryOrigin: 'Etiopia',
        countryFlag: '🇪🇹',
        isSlowCook: true,
        servingPortion: '1-2 Persone',
        accompanimentOptions: ['Injera Tradizionale Extra', 'Formaggio Fresco Ayib', 'Gomen (Spinaci Etiopi)'],
        spiceOptions: ['Berbere Delicato', 'Berbere Tradizionale Etiopico (Intenso)', 'Extra Piccante Mitmita']
      },
      {
        id: 'd-beyaynetu-et',
        name: 'Beyaynetu Misto Vegano (Tris di Salse su Injera)',
        description: 'Piatto 100% vegetale composto da Shiro Wat (farina di ceci ed erbe), Misir Wat (lenticchie rosse al Berbere), Kik Alicha (piselli spezzati dolci) e spinaci Gomen stufati.',
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
    name: 'Zalika Juma - Swahili Coast',
    nationality: '🇰🇪',
    countryName: 'Kenya',
    continent: 'Africa',
    bio: 'Cucina della costa Swahili di Mombasa: Beef Pilau, Nyama Choma e Chapati caldi.',
    fullBio: 'Zalika porta la delicatezza degli aromi dell\'Oceano Indiano: cardamomo, chiodi di garofano, latte di cocco e carni arrostite servite con salsa fresca Kachumbari.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    rating: 4.91,
    location: 'Firenze, Rifredi',
    distance: 2.3,
    specialties: ['Beef Pilau Speziato', 'Swahili Nyama Choma', 'Chapati Dorati Fatti a Mano'],
    availability: ['18:30 - 22:30'],
    availableDays: [4, 5, 6, 0],
    reviews: [],
    dishes: [
      {
        id: 'd-pilau-ke',
        name: 'Swahili Beef Pilau con Insalata Kachumbari',
        description: 'Riso basmati cotto a fuoco lento nel brodo di manzo speziato con cardamomo verde, cannella, semi di cumino tostato e cipolle dorate, servito con insalata fresca kachumbari di pomodoro, cipolla e lime.',
        price: 14.50,
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-zalika-ke',
        tags: ['Carne', 'Riso Aromatico', 'Swahili'],
        dietary: ['Gluten Free', 'Halal'],
        africanRegion: 'East Africa',
        countryOrigin: 'Kenya',
        countryFlag: '🇰🇪'
      },
      {
        id: 'd-choma-ke',
        name: 'Nyama Choma & Chapati Morbidi Dorati (Duo)',
        description: 'Agnello e manzo marinati alle erbe costiere e arrostiti alla brace, serviti con morbidi chapati sfogliati caldi cotti sulla piastra tradizionale.',
        price: 17.00,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-zalika-ke',
        tags: ['Carne', 'Grigliato', 'Pane Fresco'],
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
    name: 'Mama Grace - Kinshasa & Brazza',
    nationality: '🇨🇩',
    countryName: 'RDC Congo',
    continent: 'Africa',
    bio: 'Poulet à la Moambé, Pondu / Saka-Saka fresco e Makemba.',
    fullBio: 'Mama Grace prepara i piatti leggendari delle rive del fiume Congo. La polpa di palma naturale e le foglie di manioca pestate fresche conferiscono sapori profondi e indimenticabili.',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80',
    rating: 4.96,
    location: 'Roma, Tuscolana',
    distance: 3.0,
    specialties: ['Poulet à la Moambé', 'Pondu / Saka-Saka con Pesce Affumicato', 'Makemba Fritti'],
    availability: ['12:00 - 21:30'],
    availableDays: [1, 3, 5, 6, 0],
    reviews: [],
    dishes: [
      {
        id: 'd-moambe-cd',
        name: 'Poulet à la Moambé Tradizionale con Riso e Platani',
        description: 'Pollo ruspante cotto a fuoco lento nella vellutata salsa naturale di noci di palma selvatica (Moambé), aglio, noce moscata e peperoncino dolce, servito con riso profumato e platani Makemba.',
        price: 16.50,
        image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-grace-cd',
        tags: ['Pollo', 'Noci di Palma', 'Tradizionale Congolese'],
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
        description: 'Foglie tenere di manioca pestate a mano nel mortaio con cipollotto, porri e aglio, stufate lentamente con olio di palma e scaglie di pesce nobile affumicato.',
        price: 15.00,
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-grace-cd',
        tags: ['Foglie di Manioca', 'Pesce Affumicato', 'Salubre'],
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
    name: 'Fatima El-Amrani - Marrakech Medina',
    nationality: '🇲🇦',
    countryName: 'Marocco',
    continent: 'Africa',
    bio: 'Tajine d\'agnello con prugne e mandorle, Couscous Reale e Pastilla.',
    fullBio: 'Fatima usa una tajine di terracotta antica tramandata da tre generazioni e spezie raccolte a mano nel souk di Marrakech (zafferano di Taliouine, cannella di Ceylon, Ras el Hanout).',
    avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=400&q=80',
    rating: 5.0,
    location: 'Palermo, Centro Storico',
    distance: 0.9,
    specialties: ['Tagine d\'Agnello & Prugne', 'Pastilla di Pollo e Cannella', 'Couscous alle 7 Verdure'],
    availability: ['12:00 - 15:00', '19:00 - 22:30'],
    availableDays: [1, 2, 4, 5, 6, 0],
    reviews: [
      { id: 'rev-ma-1', author: 'Samir', rating: 5, comment: 'La carne della tajine si scioglie in bocca. Il couscous è leggero come una nuvola.', date: '2026-08-08' }
    ],
    dishes: [
      {
        id: 'd-tagine-ma',
        name: 'Tajine d\'Agnello con Prugne Caramellate & Mandorle Tostate',
        description: 'Bocconcini di spalla d\'agnello cotti a fuoco dolcissimo per 5 ore con zafferano puro, cipolle rosse, prugne secche bagnate all\'acqua di fiori d\'arancio e sesamo tostato.',
        price: 18.50,
        image: 'https://images.unsplash.com/photo-1511690656952-34342d5c2895?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-fatima-ma',
        tags: ['Carne', 'Cottura Lenta', 'Agrodolce', 'Signature'],
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
        name: 'Pastilla Tradizionale di Pollo e Mandorle Speziate',
        description: 'Sfoglia brick sottilissima e croccante ripiena di pollo sfilacciato al limone confit e coriandolo, uova montate cremose e mandorle tostate tritate con cannella e zucchero a velo.',
        price: 14.50,
        image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-fatima-ma',
        tags: ['Pollo', 'Agrodolce', 'Croccante', 'Capolavoro'],
        dietary: ['Halal'],
        africanRegion: 'North Africa & Maghreb',
        countryOrigin: 'Marocco',
        countryFlag: '🇲🇦'
      }
    ]
  },
  {
    id: 'c-nadia-eg',
    name: 'Nadia Mansour - Antico Cairo',
    nationality: '🇪🇬',
    countryName: 'Egitto',
    continent: 'Africa',
    bio: 'Koshary Reale del Cairo, Ta\'ameya dorata alle fave e Basbousa al miele.',
    fullBio: 'Nadia porta a Roma il comfort food più amato delle sponde del Nilo. Piatti ricchi di legumi, spezie delicate e salse di pomodoro e aglio aceto (Daqqa).',
    avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=400&q=80',
    rating: 4.92,
    location: 'Roma, Esquilino',
    distance: 0.8,
    specialties: ['Koshary Reale', 'Ta\'ameya alle Fave Decorticate', 'Basbousa ai Fiori d\'Arancio'],
    availability: ['11:30 - 20:00'],
    availableDays: [1, 2, 3, 4, 5, 6],
    reviews: [],
    dishes: [
      {
        id: 'd-koshary-eg',
        name: 'Koshary Reale dell\'Antico Cairo con Salsa Daqqa',
        description: 'La leggenda egiziana: strati di riso speziato, lenticchie brune, ceci morbidi, vermicelli dorati, coperti da salsa di pomodoro all\'aceto e cumino e cipolle croccantissime fritte.',
        price: 11.00,
        image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-nadia-eg',
        tags: ['Vegano', 'Comfort Food', 'Legumi'],
        dietary: ['Vegetarian', 'Vegan', 'Halal'],
        africanRegion: 'North Africa & Maghreb',
        countryOrigin: 'Egitto',
        countryFlag: '🇪🇬'
      }
    ]
  },
  {
    id: 'c-leila-tn',
    name: 'Leila Trabelsi - Carthage Flavors',
    nationality: '🇹🇳',
    countryName: 'Tunisia',
    continent: 'Africa',
    bio: 'Couscous di pesce piccante all\'Harissa artigianale e Brik croccante all\'uovo.',
    fullBio: 'Leila lavora la semola a mano e prepara l\'Harissa fresca con peperoni rossi affumicati e semi di carvi. Un viaggio nella freschezza del Mediterraneo africano.',
    avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=400&q=80',
    rating: 4.94,
    location: 'Trapani, Centro Storico',
    distance: 0.5,
    specialties: ['Couscous di Pesce alla Tunisina', 'Brik Tunisino con Tonno & Uovo', 'Ojja Merguez'],
    availability: ['12:00 - 22:00'],
    availableDays: [1, 2, 3, 4, 5, 6, 0],
    reviews: [],
    dishes: [
      {
        id: 'd-couscous-tn',
        name: 'Couscous di Pesce con Brodo Piccante all\'Harissa',
        description: 'Semola fine incocciata a mano al vapore di brodo di cernia e triglie, servita con pesce freschissimo, zucca dolce, ceci e Harissa artigianale tunisina.',
        price: 18.00,
        image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=800&q=80',
        chefId: 'c-leila-tn',
        tags: ['Pesce', 'Piccante', 'Harissa', 'Tradizionale'],
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
    bio: 'Bissap ghiacciato, Succo di Zenzero Gnamakoudji, Degue al miglio e Puff Puff caldi.',
    fullBio: 'Laboratorio artigianale dedicato a bevande rinfrescanti naturali, dolci e pasticceria secolare africana senza conservanti.',
    avatar: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80',
    rating: 5.0,
    location: 'Milano, Roma, Torino & Bologna',
    distance: 0.1,
    specialties: ['Bissap ai Fiori di Ibisco', 'Gnamakoudji allo Zenzero Fresco', 'Degue / Thiakry', 'Puff Puff / Bofrot Caldi'],
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
        tags: ['Bevanda', 'Naturale', 'Antiossidante', 'Vegano'],
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
        tags: ['Bevanda', 'Zenzero', 'Detox', 'Energizzante'],
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
        tags: ['Dolce', 'Miglio', 'Yogurt', 'Tradizionale'],
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
        tags: ['Dolce', 'Frittelle', 'Street Food'],
        dietary: ['Vegetarian', 'Vegan', 'Halal'],
        africanRegion: 'Afro-Fusion & Grocery',
        countryOrigin: 'Nigeria & Ghana',
        countryFlag: '🇳🇬'
      }
    ]
  },

  // ==========================================
  // --- CHEF INTERNAZIONALI OSPITI (PRESERVATI) ---
  // ==========================================
  {
    id: 'c1',
    name: 'Nonna Maria',
    nationality: '🇮🇹',
    countryName: 'Italia',
    continent: 'Europa',
    bio: 'Cucina romana autentica e pasta fatta a mano.',
    fullBio: 'Maria cucina da quando aveva 6 anni tra i vicoli di Trastevere. La sua cucina rispetta i tempi lenti della tradizione casalinga italiana.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    location: 'Roma, Trastevere',
    distance: 1.2,
    specialties: ['Lasagna', 'Carbonara'],
    availability: ['19:00 - 22:00'],
    availableDays: [1, 2, 3, 4, 5, 6],
    reviews: [{ id: 'r1', author: 'Marco', rating: 5, comment: 'Insuperabile.', date: '2023-10-15' }],
    dishes: [
      { id: 'd1_1', name: 'Lasagna alla Bolognese Tradizionale', description: '5 strati di sfoglia fresca tirata a mano, besciamella vellutata e ragù cotto 6 ore.', price: 12.50, image: 'https://images.unsplash.com/photo-1574868294417-75902041265e?auto=format&fit=crop&w=800&q=80', chefId: 'c1', tags: ['Carne', 'Pasta'] }
    ]
  }
];
