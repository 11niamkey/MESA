import React, { useState, useMemo } from 'react';
import { Chef, Dish } from '../types';
import { 
  Compass, 
  Sparkles, 
  History, 
  ArrowRight, 
  Heart, 
  MapPin, 
  Quote, 
  BookOpen, 
  Hourglass, 
  ChefHat, 
  Search, 
  Info,
  UtensilsCrossed,
  Globe
} from 'lucide-react';
import { HeritageJourney } from './HeritageJourney';

interface HeritageMenuProps {
  chefs: Chef[];
  onAddDish: (dish: Dish) => void;
  onViewProfile: (chef: Chef) => void;
  favorites: string[];
  onToggleFavorite: (dishId: string) => void;
}

// Database di aneddoti e storie tradizionali d'eccellenza collegate alle ricette
const TRADITI_STORIES: Record<string, {
  history: string;
  secret: string;
  vintage: string; // Origine temporale o aneddoto storico aggiuntivo
}> = {
  'af_ci_1': {
    history: "Il Garba è il re indiscusso delle strade di Abidjan. Nato tra le bancarelle vivaci della Costa d'Avorio, unisce l'attiéké (semole fine di manioca fermentata a vapore) al tonno fresco fritto e marinato con peperoncino fresco e cipolla dolce.",
    secret: "L'amido e l'acidità naturale dell'attiéké fermentato a legna, irrorato con olio di cottura del tonno rosso speziato con peperoncino locale.",
    vintage: "Icona culinaria urbana nata nel cuore di Treichville ad Abidjan."
  },
  'af_sn_1': {
    history: "Il Thieboudienne (Ceebu Jën) è il piatto nazionale del Senegal, dichiarato Patrimonio Immateriale dell'Umanità UNESCO. Nato dalla maestria delle cuoche dell'antica Saint-Louis (Ndar).",
    secret: "Il riso assorbe lentamente il denso brodo di pesce, pomodoro concentrato, tamarindo e 'yet' (mollusco essiccato) creando il mitico 'xooñ' (la crosticina dorata e croccante sul fondo).",
    vintage: "Creato dalla leggendaria cuoca Penda Mbaye a Saint-Louis nel XIX secolo."
  },
  'af_ng_1': {
    history: "Il Jollof Rice è il centro gravitazionale delle celebrazioni in tutta l'Africa Occidentale. La versione nigeriana a cottura lenta sprigiona il caratteristico profumo affumicato 'party style'.",
    secret: "La base di 'Obé Ata' (purea di peperoni rossi dolci, pomodori e peperoncino Scotch Bonnet) cotta a legna e ridotta fino alla perfetta caramellizzazione.",
    vintage: "Erede dell'antico impero Wolof, affinato nelle grandiose feste di Lagos."
  },
  'af_et_1': {
    history: "Il Doro Wat è lo stufato di pollo delle grandi occasioni e del Capodanno copto etiope. Richiede ore di lenta cottura paziente e devota, accompagnato dalla soffice Injera di farina pura di Teff fermentata per tre giorni.",
    secret: "La tostatura a secco del Berbere artigianale miscelato con Niter Kibbeh (burro chiarificato infuso con cardamomo nero, kosseret e fieno greco).",
    vintage: "Tradizione conviviale della corte imperiale di Gondar e Axum."
  },
  'af_cm_1': {
    history: "Il Ndolé è il piatto cerimoniale del Camerun, preparato dal popolo Sawa per i matrimoni e le feste sacre con foglie selvatiche di Ndolé, gamberi di fiume e pasta cremosa di arachidi fresche.",
    secret: "Le foglie vengono lavate e strizzate ripetutamente per bilanciare l'amaro nobile, poi cotte a fuoco lento con arachidi appena macinate su pietra.",
    vintage: "Piatto reale delle coste del fiume Wouri nel Golfo di Guinea."
  },
  'af_ma_1': {
    history: "Il Tajine di Agnello con prugne caramellate, mandorle tostate e sesamo dorato è la massima espressione dell'ospitalità maghrebina e dell'equilibrio tra dolce e salato.",
    secret: "Cottura a fuoco lentissimo nel cono di terracotta con zafferano puro di Taliouine, cannella di Ceylon e miele millefiori d'arancio.",
    vintage: "Sapienza millenaria delle antiche città imperiali di Fès e Marrakech."
  }
};

// Generatore di storie di riserva automatico per qualsiasi altro piatto del database
const getDynamicStoryForDish = (dish: Dish, chefNationality: string) => {
  const lowercaseName = dish.name.toLowerCase();
  
  if (TRADITI_STORIES[dish.id]) {
    return TRADITI_STORIES[dish.id];
  }

  // Generatori intelligenti basati sul nome del piatto africano
  if (lowercaseName.includes('attiéké') || lowercaseName.includes('garba') || lowercaseName.includes('alloco')) {
    return {
      history: "Nato dalle comunità lacustri lagunari della Costa d'Avorio. La lavorazione paziente della manioca grattugiata, pressata e setacciata crea perle dorate leggere come il couscous.",
      secret: "Cottura rigorosamente a vapore su cestelli di foglie di banano e abbinamento con banane piantaggine mature fritte in olio dorato.",
      vintage: "Autentico rito conviviale ivoriano trasmesso di madre in figlia."
    };
  }
  if (lowercaseName.includes('jollof') || lowercaseName.includes('thieb') || lowercaseName.includes('riso')) {
    return {
      history: "Il cuore pulsante dell'Africa Occidentale. Un riso sontuoso che sobbolle lentamente nel brodo aromatico di pomodori freschi, spezie tostate e aromi selvatici.",
      secret: "Cottura ermetica a vapore per far assorbire a ogni singolo chicco l'essenza affumicata delle spezie senza romperlo.",
      vintage: "Il re di tutte le celebrazioni e feste dell'Africa Subsahariana."
    };
  }
  if (lowercaseName.includes('injera') || lowercaseName.includes('wat') || lowercaseName.includes('tib')) {
    return {
      history: "Il pane sacro del Corno d'Africa, naturalmente senza glutine a base di Teff ancestrale fermentato. Viene condiviso in un unico grande piatto ('Mesob') in segno di fratellanza.",
      secret: "Lenta fermentazione naturale di 72 ore per ottenere i caratteristici alveoli ('occhi') che trattengono gli stufati aromatici.",
      vintage: "Pilastro della cultura gastronomica di Etiopia ed Eritrea da oltre 2000 anni."
    };
  }
  if (lowercaseName.includes('suya') || lowercaseName.includes('choukouya') || lowercaseName.includes('griglia')) {
    return {
      history: "La celebre street-food d'eccellenza dell'Africa Occidentale. Carne marinata nel tipico rub 'Yaji' a base di arachidi tostate macinate, zenzero, peperoncino e spezie segrete.",
      secret: "Spiedini cotti su braci vive di legna forte con spolverata finale di polvere di arachidi tostate e cipolla rossa croccante.",
      vintage: "Tradizione nomade Hausa diffusa in tutto il continente."
    };
  }
  if (lowercaseName.includes('tajine') || lowercaseName.includes('couscous') || lowercaseName.includes('pastilla')) {
    return {
      history: "Il calore del Nord Africa e del Sahara. Lenta stufatura in piatti conici di terracotta che concentrano ogni goccia di vapore e profumo di zafferano, cumino e coriandolo.",
      secret: "L'infusione graduale di spezie macinate al momento e la cottura a fiamma minima con frutta secca e burro chiarificato Smen.",
      vintage: "Arte culinaria berbera e maghrebina tramandata nei secoli."
    };
  }

  // Fallback generico ma poetico e ben contestualizzato
  return {
    history: `Questo piatto straordinario rappresenta le radici e l'eredità storica più intima della tradizione culinaria africana (${chefNationality}). Una ricetta nata dalla vicinanza con la terra, trasmessa a voce di generazione in generazione per non perderne i sapori.`,
    secret: "Rispetto rigoroso dei tempi di marinatura e tostatura delle spezie tradizionali, con cottura a fuoco lento e costante.",
    vintage: "Custodita gelosamente nel ricettario di famiglia da generazioni."
  };
};

const DEFAULT_FOOD_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';

export const HeritageMenu: React.FC<HeritageMenuProps> = ({ 
  chefs, 
  onAddDish, 
  onViewProfile, 
  favorites, 
  onToggleFavorite 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHeritageDish, setSelectedHeritageDish] = useState<{chef: Chef, dish: Dish} | null>(null);

  // Raccogliamo tutti i piatti in una lista piana, arricchendoli dei dati del cuoco e del loro aneddoto storico unico
  const allHeritageDishes = useMemo(() => {
    return chefs.flatMap(chef => 
      chef.dishes.map(dish => {
        const storyData = getDynamicStoryForDish(dish, chef.nationality);
        return {
          ...dish,
          chefName: chef.name,
          chefNationality: chef.nationality,
          chefAvatar: chef.avatar,
          chefRating: chef.rating,
          chefData: chef,
          storyData
        };
      })
    );
  }, [chefs]);

  // Filtriamo i piatti tradizionali in base all'input dell'utente
  const filteredDishes = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return allHeritageDishes;
    return allHeritageDishes.filter(dish => 
      dish.name.toLowerCase().includes(query) ||
      dish.description.toLowerCase().includes(query) ||
      dish.chefName.toLowerCase().includes(query) ||
      dish.storyData.history.toLowerCase().includes(query) ||
      dish.tags.some(t => t.toLowerCase().includes(query))
    );
  }, [allHeritageDishes, searchQuery]);

  return (
    <div className="animate-fade-in space-y-12">
      {/* Header Premium dal sapore editoriale (Libro Antico / Fine Art) */}
      <div className="relative bg-[#0b0b0b] text-white rounded-[3rem] p-8 md:p-16 border border-orange-950/40 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-orange-600/10 to-amber-600/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-900/5 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="w-20 h-20 bg-gradient-to-tr from-orange-500 to-amber-600 rounded-[2rem] flex items-center justify-center shadow-xl shadow-orange-950/20">
            <BookOpen className="w-10 h-10 text-black shrink-0" />
          </div>
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="inline-flex items-center gap-2 bg-orange-600/10 border border-orange-500/20 px-3.5 py-1 rounded-xl">
              <History className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">Archivio delle Tradizioni MESA</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-none uppercase">
              Le Radici del Gusto
            </h1>
            <p className="text-sm md:text-base text-gray-400 max-w-2xl font-serif italic leading-relaxed">
              "In questa sezione riscopri il patrimonio invisibile delle nostre cucine rionali. Nessun piatto è un semplice pasto: qui troverai esclusivamente le fedi, gli aneddoti e le storie tradizionali che compongono l'anima delle ricette di famiglia."
            </p>
          </div>
        </div>
      </div>

      {/* Motore di Ricerca Tradizioni */}
      <div className="relative max-w-xl mx-auto">
        <div className="flex bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-md focus-within:border-orange-500/40 transition-all">
          <div className="flex items-center pl-4 text-gray-400">
            <Search className="w-4 h-4 text-orange-500 shrink-0" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cerca un aneddoto, una regione o un piatto della memoria..."
            className="w-full bg-transparent px-3 py-4 text-xs font-bold outline-none text-gray-800 placeholder-gray-400"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="px-4 text-xs text-gray-400 hover:text-black font-extrabold uppercase"
            >
              Azzera
            </button>
          )}
        </div>
      </div>

      {/* Galleria dell'Eredità Culinaria */}
      {filteredDishes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredDishes.map((dish) => (
            <div 
              key={dish.id} 
              className="group bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-700 flex flex-col h-full relative"
            >
              {/* Box Superiore: Emozionale/Visivo */}
              <div className="relative h-72 overflow-hidden">
                <img 
                  src={dish.image || DEFAULT_FOOD_IMAGE} 
                  alt={dish.name} 
                  onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_FOOD_IMAGE; }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1200ms] grayscale-[0.1]" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                
                {/* Badge Autenticità dell'Archivio */}
                <div className="absolute top-5 left-5">
                   <span className="px-3 py-1.5 bg-black/80 backdrop-blur-md rounded-xl text-[8px] font-black uppercase tracking-wider text-orange-400 flex items-center gap-1.5 shadow-xl border border-white/10">
                     <History className="w-3 h-3 text-orange-500" /> Custodia Storica
                   </span>
                </div>

                {/* Preferiti */}
                <button 
                  onClick={(e) => { e.stopPropagation(); onToggleFavorite(dish.id); }}
                  className="absolute top-5 right-5 p-3 bg-white/90 backdrop-blur rounded-2xl shadow-xl hover:bg-white transition-all transform hover:scale-110 active:scale-95"
                >
                  <Heart className={`w-4 h-4 ${favorites.includes(dish.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                </button>

                {/* Titoli Sopra l'immagine */}
                <div className="absolute bottom-5 left-6 right-6 text-white text-left">
                   <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-2xl filter drop-shadow">{dish.chefNationality}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 font-mono">Ricetta del Cuore</span>
                   </div>
                   <h3 className="text-2xl sm:text-3xl font-black italic tracking-tighter leading-none font-sans uppercase">
                      {dish.name}
                   </h3>
                </div>
              </div>

              {/* Box Centrale: Focalizzato interamente sugli Aneddoti e Tradizione */}
              <div className="p-8 flex flex-col flex-1 justify-between bg-white space-y-6">
                
                {/* Storia Identificativa (Citazione d'Epoca) */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5">
                    <Quote className="w-5 h-5 text-orange-500 shrink-0" />
                    <span className="text-[9px] font-black uppercase tracking-wider text-orange-600 font-mono">Le Origini / Aneddoto:</span>
                  </div>
                  
                  <div className="bg-orange-50/50 rounded-2.5xl p-5 border border-orange-100">
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-serif italic">
                      "{dish.storyData.history}"
                    </p>
                  </div>
                </div>

                {/* Il Segreto di Famiglia */}
                <div className="space-y-2 border-t border-gray-100 pt-5">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <Sparkles className="w-3.5 h-3.5 text-orange-500 shrink-0" /> 
                    <span>Il Segreto del Cuoco:</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    <strong>Come lo prepara {dish.chefName}:</strong> {dish.storyData.secret}
                  </p>
                </div>

                {/* Era/Epoca e Riferimenti */}
                <div className="flex items-center gap-2 bg-neutral-50 px-4 py-2.5 rounded-xl border border-neutral-100 text-[10px] text-gray-500 font-medium">
                  <Hourglass className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span className="truncate"><strong>Origine:</strong> {dish.storyData.vintage}</span>
                </div>

                {/* Riquadro sul Custode e Tasti d'Azione */}
                <div className="space-y-4 border-t border-gray-100 pt-5 pr-1">
                  <div 
                    onClick={() => onViewProfile(dish.chefData)}
                    className="flex items-center justify-between cursor-pointer group/chef bg-neutral-50 hover:bg-orange-50/30 p-2 rounded-2xl border border-neutral-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img src={dish.chefAvatar} className="w-8 h-8 rounded-full border border-orange-200" alt={dish.chefName} />
                      <div className="text-left">
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 leading-none">Custode Ricetta</p>
                        <p className="text-xs font-extrabold text-gray-900 group-hover/chef:text-orange-600 transition-colors">{dish.chefName}</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-wider text-orange-500 pr-2">Profilo ▸</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button 
                      onClick={() => setSelectedHeritageDish({ chef: dish.chefData, dish })}
                      className="w-full py-3 border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-black rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                    >
                      <Compass className="w-3.5 h-3.5 shrink-0" /> Vivi Rituale AI
                    </button>

                    <button 
                      onClick={() => onAddDish(dish)}
                      className="w-full py-3 bg-black hover:bg-orange-600 text-white hover:text-black rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                    >
                      <UtensilsCrossed className="w-3.5 h-3.5 shrink-0" /> Ordina Tradizione
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-200 max-w-xl mx-auto px-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
             <Search className="w-8 h-8 text-gray-400 shrink-0" />
          </div>
          <h3 className="text-xl font-black text-gray-400 mb-2">Nessun capitolo storico trovato</h3>
          <p className="text-xs text-gray-500 font-medium leading-relaxed">
            Nessun aneddoto o cibo della memoria corrisponde al criterio cercato. Prova con un'altra parola chiave o sfoglia l'indice completo delle tradizioni.
          </p>
          <button 
            onClick={() => setSearchQuery('')}
            className="mt-6 px-6 py-2.5 bg-black text-white hover:bg-orange-600 hover:text-black transition-colors rounded-xl text-[10px] font-black uppercase tracking-widest"
          >
            Vedi Tutti i Piatti d'Archivio
          </button>
        </div>
      )}

      {/* Footer Storico Editoriale Magico */}
      <div className="bg-[#0b0b0b] text-white rounded-[4rem] p-8 md:p-16 text-center relative border border-orange-950/40 overflow-hidden shadow-2xl">
         <div className="absolute top-0 left-0 w-80 h-80 bg-orange-600/10 rounded-full blur-[120px] -ml-40 -mt-40 pointer-events-none"></div>
         <Sparkles className="w-10 h-10 text-orange-500 mx-auto mb-6 shrink-0" />
         <h3 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tight mb-4">Insieme per salvaguardare il cibo rionale</h3>
         <p className="text-gray-400 mb-8 max-w-xl mx-auto font-serif italic text-xs sm:text-sm leading-relaxed">
           "Ogni ordine effettuato all'interno del Menu delle Radici supporta i cuochi custodi della tradizione locale, consentendo il sostentamento di tecniche culinarie preziose e di filiere sane a km zero."
         </p>
         <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-[10px] text-gray-500 font-medium">
            <div className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-orange-500" /> Presidio Slow Food Friend</div>
            <div className="hidden sm:block text-neutral-800">•</div>
            <div className="flex items-center gap-1.5"><ChefHat className="w-4 h-4 text-orange-500" /> Cuochi Nazionali Selezionati</div>
         </div>
      </div>

      {/* Modal del Percorso Culturale delle Radici (Immersion Multimediale) */}
      {selectedHeritageDish && (
        <HeritageJourney 
          dish={selectedHeritageDish.dish} 
          chef={selectedHeritageDish.chef} 
          onClose={() => setSelectedHeritageDish(null)} 
        />
      )}
    </div>
  );
};
