export interface Province {
  code: string;
  name: string;
}

export interface Region {
  name: string;
  flag: string; // Emoji representing food or style
  specialties: string[];
  provinces: Province[];
}

export const ITALIAN_REGIONS: Region[] = [
  {
    name: "Abruzzo",
    flag: "🐑",
    specialties: ["Arrosticini", "Chitarra al Pomodoro", "Confetti di Sulmona"],
    provinces: [
      { code: "CH", name: "Chieti" },
      { code: "AQ", name: "L'Aquila" },
      { code: "PE", name: "Pescara" },
      { code: "TE", name: "Teramo" }
    ]
  },
  {
    name: "Basilicata",
    flag: "🌶️",
    specialties: ["Peperoni Cruschi", "Pasta con Mollica", "Caciocavallo Podolico"],
    provinces: [
      { code: "MT", name: "Matera" },
      { code: "PZ", name: "Potenza" }
    ]
  },
  {
    name: "Calabria",
    flag: "🌶️",
    specialties: ["'Nduja di Spilinga", "Fileja con la Cipolla di Tropea", "Pittanchiusa"],
    provinces: [
      { code: "CZ", name: "Catanzaro" },
      { code: "CS", name: "Cosenza" },
      { code: "KR", name: "Crotone" },
      { code: "RC", name: "Reggio Calabria" },
      { code: "VV", name: "Vibo Valentia" }
    ]
  },
  {
    name: "Campania",
    flag: "🍕",
    specialties: ["Ragù Napoletano", "Mozzarella di Bufala", "Sfogliatella Riccia"],
    provinces: [
      { code: "AV", name: "Avellino" },
      { code: "BN", name: "Benevento" },
      { code: "CE", name: "Caserta" },
      { code: "NA", name: "Napoli" },
      { code: "SA", name: "Salerno" }
    ]
  },
  {
    name: "Emilia-Romagna",
    flag: "🍝",
    specialties: ["Tortellini in Brodo", "Lasagne alla Bolognese", "Piadina Romagnola"],
    provinces: [
      { code: "BO", name: "Bologna" },
      { code: "FE", name: "Ferrara" },
      { code: "FC", name: "Forlì-Cesena" },
      { code: "MO", name: "Modena" },
      { code: "PR", name: "Parma" },
      { code: "PC", name: "Piacenza" },
      { code: "RA", name: "Ravenna" },
      { code: "RE", name: "Reggio Emilia" },
      { code: "RN", name: "Rimini" }
    ]
  },
  {
    name: "Friuli-Venezia Giulia",
    flag: "🥓",
    specialties: ["Frico con le Patate", "Prosciutto di San Daniele", "Cjarsons"],
    provinces: [
      { code: "GO", name: "Gorizia" },
      { code: "PN", name: "Pordenone" },
      { code: "TS", name: "Trieste" },
      { code: "UD", name: "Udine" }
    ]
  },
  {
    name: "Lazio",
    flag: "🧀",
    specialties: ["Spaghetti alla Carbonara", "Rigatoni all'Amatriciana", "Carciofi alla Romana"],
    provinces: [
      { code: "FR", name: "Frosinone" },
      { code: "LT", name: "Latina" },
      { code: "RI", name: "Rieti" },
      { code: "RM", name: "Roma" },
      { code: "VT", name: "Viterbo" }
    ]
  },
  {
    name: "Liguria",
    flag: "🌿",
    specialties: ["Trofie con Pesto alla Genovese", "Focaccia di Recco", "Farinata"],
    provinces: [
      { code: "GE", name: "Genova" },
      { code: "IM", name: "Imperia" },
      { code: "SP", name: "La Spezia" },
      { code: "SV", name: "Savona" }
    ]
  },
  {
    name: "Lombardia",
    flag: "🍚",
    specialties: ["Risotto alla Milanese", "Cotoletta", "Pizzoccheri della Valtellina"],
    provinces: [
      { code: "BG", name: "Bergamo" },
      { code: "BS", name: "Brescia" },
      { code: "CO", name: "Como" },
      { code: "CR", name: "Cremona" },
      { code: "LC", name: "Lecco" },
      { code: "LO", name: "Lodi" },
      { code: "MN", name: "Mantova" },
      { code: "MI", name: "Milano" },
      { code: "MB", name: "Monza e della Brianza" },
      { code: "PV", name: "Pavia" },
      { code: "SO", name: "Sondrio" },
      { code: "VA", name: "Varese" }
    ]
  },
  {
    name: "Marche",
    flag: "🥘",
    specialties: ["Vincisgrassi", "Olive all'Ascolana", "Brodetto all'Anconetana"],
    provinces: [
      { code: "AN", name: "Ancona" },
      { code: "AP", name: "Ascoli Piceno" },
      { code: "FM", name: "Fermo" },
      { code: "MC", name: "Macerata" },
      { code: "PU", name: "Pesaro e Urbino" }
    ]
  },
  {
    name: "Molise",
    flag: "🍲",
    specialties: ["Cavatelli con Sugo di Maiale", "Pampanella", "Brodetto Termolese"],
    provinces: [
      { code: "CB", name: "Campobasso" },
      { code: "IS", name: "Isernia" }
    ]
  },
  {
    name: "Piemonte",
    flag: "🍷",
    specialties: ["Bagna Cauda", "Tajarin al Tartufo Bianco", "Brasato al Barolo"],
    provinces: [
      { code: "AL", name: "Alessandria" },
      { code: "AT", name: "Asti" },
      { code: "BI", name: "Biella" },
      { code: "CN", name: "Cuneo" },
      { code: "NO", name: "Novara" },
      { code: "TO", name: "Torino" },
      { code: "VB", name: "Verbano-Cusio-Ossola" },
      { code: "VC", name: "Vercelli" }
    ]
  },
  {
    name: "Puglia",
    flag: "🍞",
    specialties: ["Orecchiette alle Cime di Rapa", "Focaccia Barese", "Pasticciotto Leccese"],
    provinces: [
      { code: "BA", name: "Bari" },
      { code: "BT", name: "Barletta-Andria-Trani" },
      { code: "BR", name: "Brindisi" },
      { code: "FG", name: "Foggia" },
      { code: "LE", name: "Lecce" },
      { code: "TA", name: "Taranto" }
    ]
  },
  {
    name: "Sardegna",
    flag: "🐖",
    specialties: ["Culurgiones", "Malloreddus alla Campidanese", "Porceddu Sardo"],
    provinces: [
      { code: "CA", name: "Cagliari" },
      { code: "NU", name: "Nuoro" },
      { code: "OR", name: "Oristano" },
      { code: "SS", name: "Sassari" },
      { code: "SU", name: "Sud Sardegna" }
    ]
  },
  {
    name: "Sicilia",
    flag: "🍊",
    specialties: ["Arancine", "Pasta alla Norma", "Cannoli Siciliani alla Ricotta"],
    provinces: [
      { code: "AG", name: "Agrigento" },
      { code: "CL", name: "Caltanissetta" },
      { code: "CT", name: "Catania" },
      { code: "EN", name: "Enna" },
      { code: "ME", name: "Messina" },
      { code: "PA", name: "Palermo" },
      { code: "RG", name: "Ragusa" },
      { code: "SR", name: "Siracusa" },
      { code: "TP", name: "Trapani" }
    ]
  },
  {
    name: "Toscana",
    flag: "🥩",
    specialties: ["Bistecca alla Fiorentina", "Pappa al Pomodoro", "Pici all'Aglione"],
    provinces: [
      { code: "AR", name: "Arezzo" },
      { code: "FI", name: "Firenze" },
      { code: "GR", name: "Grosseto" },
      { code: "LI", name: "Livorno" },
      { code: "LU", name: "Lucca" },
      { code: "MS", name: "Massa-Carrara" },
      { code: "PI", name: "Pisa" },
      { code: "PT", name: "Pistoia" },
      { code: "PO", name: "Prato" },
      { code: "SI", name: "Siena" }
    ]
  },
  {
    name: "Trentino-Alto Adige",
    flag: "🍏",
    specialties: ["Canederli al Burro", "Strudel di Mele", "Spätzle di Spinaci"],
    provinces: [
      { code: "BZ", name: "Bolzano" },
      { code: "TN", name: "Trento" }
    ]
  },
  {
    name: "Umbria",
    flag: "🐗",
    specialties: ["Strangozzi al Tartufo Nero", "Porchetta Umbra", "Torta al Testo"],
    provinces: [
      { code: "PG", name: "Perugia" },
      { code: "TR", name: "Terni" }
    ]
  },
  {
    name: "Valle d'Aosta",
    flag: "🧀",
    specialties: ["Fonduta alla Valdostana", "Zuppa alla Valpellinentze", "Carbonada"],
    provinces: [
      { code: "AO", name: "Aosta" }
    ]
  },
  {
    name: "Veneto",
    flag: "🍷",
    specialties: ["Bigoli con l'Anatra", "Baccalà alla Vicentina", "Risi e Bisi"],
    provinces: [
      { code: "BL", name: "Belluno" },
      { code: "PD", name: "Padova" },
      { code: "RO", name: "Rovigo" },
      { code: "TV", name: "Treviso" },
      { code: "VE", name: "Venezia" },
      { code: "VR", name: "Verona" },
      { code: "VI", name: "Vicenza" }
    ]
  }
];

export const findLocationByInput = (query: string) => {
  const sanitized = query.toLowerCase().trim();
  if (sanitized.length < 2) return null;

  // 1. Try to find region directly
  const matchedRegion = ITALIAN_REGIONS.find(
    r => r.name.toLowerCase() === sanitized || sanitized.includes(r.name.toLowerCase())
  );
  if (matchedRegion) {
    return {
      type: 'region' as const,
      region: matchedRegion,
      province: null,
      name: matchedRegion.name,
      flag: matchedRegion.flag,
      specialties: matchedRegion.specialties
    };
  }

  // 2. Try to find province by code (e.g. "MI", "RM")
  const matchedProvinceByCode = ITALIAN_REGIONS.flatMap(r => r.provinces.map(p => ({ ...p, region: r })))
    .find(p => p.code.toLowerCase() === sanitized);
  
  if (matchedProvinceByCode) {
    return {
      type: 'province' as const,
      region: matchedProvinceByCode.region,
      province: matchedProvinceByCode,
      name: `${matchedProvinceByCode.name} (${matchedProvinceByCode.code})`,
      flag: matchedProvinceByCode.region.flag,
      specialties: matchedProvinceByCode.region.specialties
    };
  }

  // 3. Try to find province by name or partial string
  const matchedProvinceByName = ITALIAN_REGIONS.flatMap(r => r.provinces.map(p => ({ ...p, region: r })))
    .find(p => sanitized.includes(p.name.toLowerCase()) || p.name.toLowerCase().includes(sanitized));

  if (matchedProvinceByName) {
    return {
      type: 'province' as const,
      region: matchedProvinceByName.region,
      province: matchedProvinceByName,
      name: `${matchedProvinceByName.name} (${matchedProvinceByName.code})`,
      flag: matchedProvinceByName.region.flag,
      specialties: matchedProvinceByName.region.specialties
    };
  }

  return null;
};

export interface PordenoneComune {
  name: string;
  zip: string;
  zoneExample?: string;
}

export const PORDENONE_COMUNI: PordenoneComune[] = [
  { name: 'Pordenone', zip: '33170', zoneExample: 'Centro / Torre / Rorai Grande' },
  { name: 'Sacile', zip: '33077', zoneExample: 'Centro / San Giovanni del Tempio' },
  { name: 'Cordenons', zip: '33084', zoneExample: 'Centro / Sclavons' },
  { name: 'Porcia', zip: '33080', zoneExample: 'Centro / Palse' },
  { name: 'Azzano Decimo', zip: '33082', zoneExample: 'Centro / Tiezzo' },
  { name: 'San Vito al Tagliamento', zip: '33078', zoneExample: 'Centro / Ligugnana' },
  { name: 'Spilimbergo', zip: '33097', zoneExample: 'Centro / Tauriano' },
  { name: 'Maniago', zip: '33085', zoneExample: 'Centro / Maniagolibero' },
  { name: 'Fontanafredda', zip: '33074', zoneExample: 'Centro / Vigonovo' },
  { name: 'Fiume Veneto', zip: '33080', zoneExample: 'Centro / Bannia' },
  { name: 'Aviano', zip: '33081', zoneExample: 'Centro / Castello' },
  { name: 'Casarsa della Delizia', zip: '33072', zoneExample: 'Centro / San Giovanni' },
  { name: 'Zoppola', zip: '33080', zoneExample: 'Centro / Orcenico' },
  { name: 'Brugnera', zip: '33070', zoneExample: 'Centro / Maron' },
  { name: 'Prata di Pordenone', zip: '33080', zoneExample: 'Centro / Ghirano' },
  { name: 'Pasiano di Pordenone', zip: '33087', zoneExample: 'Centro / Cecchini' },
  { name: 'Roveredo in Piano', zip: '33080', zoneExample: 'Centro' },
  { name: 'San Quirino', zip: '33080', zoneExample: 'Centro / Sedrano' },
  { name: 'Caneva', zip: '33070', zoneExample: 'Centro / Sarone' },
  { name: 'Polcenigo', zip: '33070', zoneExample: 'Centro / Coltura' },
  { name: 'Valvasone Arzene', zip: '33098', zoneExample: 'Centro' },
  { name: 'Cordovado', zip: '33075', zoneExample: 'Centro' },
  { name: 'Sesto al Reghena', zip: '33079', zoneExample: 'Centro' },
  { name: 'Chions', zip: '33083', zoneExample: 'Centro' },
  { name: 'Morsano al Tagliamento', zip: '33075', zoneExample: 'Centro' },
  { name: 'Pravisdomini', zip: '33076', zoneExample: 'Centro' },
  { name: 'San Martino al Tagliamento', zip: '33098', zoneExample: 'Centro' },
  { name: 'Sequals', zip: '33090', zoneExample: 'Centro' },
  { name: 'Pinzano al Tagliamento', zip: '33094', zoneExample: 'Centro' },
  { name: 'Travesio', zip: '33090', zoneExample: 'Centro' },
  { name: 'Castelnovo del Friuli', zip: '33090', zoneExample: 'Centro' },
  { name: 'Montereale Valcellina', zip: '33086', zoneExample: 'Centro' },
  { name: 'Budoia', zip: '33070', zoneExample: 'Centro' },
  { name: 'Barcis', zip: '33080', zoneExample: 'Centro' },
  { name: 'Claut', zip: '33080', zoneExample: 'Centro' },
  { name: 'Cimolais', zip: '33080', zoneExample: 'Centro' },
  { name: 'Erto e Casso', zip: '33080', zoneExample: 'Centro' },
  { name: 'Andreis', zip: '33080', zoneExample: 'Centro' },
  { name: 'Frisanco', zip: '33080', zoneExample: 'Centro' },
  { name: 'Cavasso Nuovo', zip: '33092', zoneExample: 'Centro' },
  { name: 'Fanna', zip: '33092', zoneExample: 'Centro' },
  { name: 'Arba', zip: '33090', zoneExample: 'Centro' },
  { name: 'Vivaro', zip: '33099', zoneExample: 'Centro' },
  { name: 'San Giorgio della Richinvelda', zip: '33095', zoneExample: 'Centro' },
  { name: 'Vajont', zip: '33080', zoneExample: 'Centro' },
  { name: 'Meduno', zip: '33092', zoneExample: 'Centro' },
  { name: 'Tramonti di Sopra', zip: '33090', zoneExample: 'Centro' },
  { name: 'Tramonti di Sotto', zip: '33090', zoneExample: 'Centro' },
  { name: 'Clauzetto', zip: '33090', zoneExample: 'Centro' },
  { name: 'Vito d\'Asio', zip: '33090', zoneExample: 'Centro' }
];

const PORDENONE_ZIP_SET = new Set(PORDENONE_COMUNI.map(c => c.zip));

const normalizeLocText = (value?: string) =>
  (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

export const findPordenoneComune = (value?: string): PordenoneComune | undefined => {
  const norm = normalizeLocText(value);
  if (!norm) return undefined;
  return PORDENONE_COMUNI.find(c => norm.includes(normalizeLocText(c.name)));
};

export const isPordenoneLocation = (value?: string, zip?: string): boolean => {
  const cleanZip = (zip || '').trim();
  if (cleanZip && PORDENONE_ZIP_SET.has(cleanZip)) return true;

  const norm = normalizeLocText(value);
  if (!norm) return false;

  if (/\b(pn|pordenone)\b/.test(norm)) return true;
  if (PORDENONE_COMUNI.some(c => norm.includes(normalizeLocText(c.name)))) return true;

  // Check for PN postal codes inside free text (33070-33099, 33170)
  const zipMatch = norm.match(/\b(330[7-9]\d|33170)\b/);
  if (zipMatch) return true;

  return false;
};

export const resolvePordenoneZip = (value?: string): string => {
  const matched = findPordenoneComune(value);
  return matched?.zip || '33170';
};

export const normalizeLocationToPordenone = (
  value?: string,
  fallback = 'Pordenone (PN), Centro'
): string => {
  if (isPordenoneLocation(value)) {
    return (value || '').trim() || fallback;
  }
  return fallback;
};

