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
