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
  Globe,
  Clock
} from 'lucide-react';
import { HeritageJourney } from './HeritageJourney';
import { CountryFlag } from './CountryFlag';
import { isChefBookable } from '../utils/chefUtils';
import { getDishHeritageStory } from '../utils/heritageStories';

interface HeritageMenuProps {
  chefs: Chef[];
  onAddDish: (dish: Dish) => void;
  onViewProfile: (chef: Chef) => void;
  favorites: string[];
  onToggleFavorite: (dishId: string) => void;
}

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
    return chefs.flatMap(chef => {
      const canBook = isChefBookable(chef);
      return chef.dishes.map(dish => {
        const storyData = getDishHeritageStory(dish, chef);
        return {
          ...dish,
          chefName: chef.name,
          chefNationality: chef.nationality,
          chefAvatar: chef.avatar,
          chefRating: chef.rating,
          chefData: chef,
          storyData,
          canBook
        };
      });
    });
  }, [chefs]);

  // Filtriamo i piatti tradizionali in base all'input dell'utente
  const filteredDishes = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return allHeritageDishes;
    return allHeritageDishes.filter(dish => 
      dish.name.toLowerCase().includes(query) ||
      dish.description.toLowerCase().includes(query) ||
      dish.chefName.toLowerCase().includes(query) ||
      (dish.chefData.countryName || '').toLowerCase().includes(query) ||
      dish.storyData.history.toLowerCase().includes(query) ||
      dish.storyData.secret.toLowerCase().includes(query) ||
      dish.storyData.vintage.toLowerCase().includes(query) ||
      dish.tags.some(t => t.toLowerCase().includes(query))
    );
  }, [allHeritageDishes, searchQuery]);

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header Premium dal sapore editoriale (Libro Antico / Fine Art) */}
      <div className="relative bg-[#0b0b0b] text-white rounded-[2.5rem] p-6 md:p-10 border border-orange-950/40 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-orange-600/10 to-amber-600/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-900/5 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-950/20 shrink-0">
            <BookOpen className="w-8 h-8 text-black shrink-0" />
          </div>
          <div className="flex-1 text-center md:text-left space-y-2 min-w-0">
            <div className="inline-flex items-center gap-2 bg-orange-600/10 border border-orange-500/20 px-3 py-1 rounded-xl">
              <History className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">Archivio delle Tradizioni MESA</span>
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black italic tracking-tight leading-none uppercase whitespace-nowrap truncate text-orange-500">
              Le Radici del Gusto
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 max-w-2xl font-serif italic leading-relaxed line-clamp-2">
              "In questa sezione riscopri il patrimonio invisibile delle nostre cucine rionali: le tradizioni, gli aneddoti e le storie che compongono l'anima delle ricette di famiglia."
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
                      <CountryFlag flag={dish.chefNationality} title={dish.chefData.countryName} size="md" className="drop-shadow" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 font-mono">Ricetta del Cuore</span>
                   </div>
                   <h3 className="text-xl sm:text-2xl font-black italic tracking-tighter leading-none font-sans uppercase text-orange-400 truncate">
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
                  
                  <div className="bg-orange-50/50 rounded-2xl p-5 border border-orange-100">
                    <p className="text-xs sm:text-sm text-black leading-relaxed font-serif italic">
                      "{dish.storyData.history}"
                    </p>
                  </div>
                </div>

                {/* Il Segreto di Famiglia */}
                <div className="space-y-2 border-t border-gray-100 pt-5">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-orange-600">
                    <Sparkles className="w-3.5 h-3.5 text-orange-500 shrink-0" /> 
                    <span>Il Segreto del Cuoco:</span>
                  </div>
                  <p className="text-xs text-black leading-relaxed">
                    <strong>Come lo prepara {dish.chefName}:</strong> {dish.storyData.secret}
                  </p>
                </div>

                {/* Era/Epoca e Riferimenti */}
                <div className="flex items-start gap-2.5 bg-neutral-50 px-4 py-3 rounded-xl border border-neutral-100 text-[11px] text-black font-medium">
                  <Hourglass className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                  <span className="leading-snug break-words">
                    <strong className="font-black text-gray-900">Origine:</strong> {dish.storyData.vintage}
                  </span>
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

                    {dish.canBook ? (
                      <button 
                        onClick={() => onAddDish(dish)}
                        className="w-full py-3 bg-black hover:bg-orange-600 text-white hover:text-black rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                      >
                        <UtensilsCrossed className="w-3.5 h-3.5 shrink-0" /> Ordina Tradizione
                      </button>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="w-full py-1 px-2 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg font-black uppercase tracking-widest text-[8px] flex items-center justify-center gap-1">
                          <Clock className="w-3 h-3 shrink-0" />
                          <span>Disponibile a breve</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => onAddDish(dish)}
                          className="w-full py-2.5 bg-black hover:bg-orange-600 text-white hover:text-black rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                        >
                          <UtensilsCrossed className="w-3.5 h-3.5 shrink-0" /> Aggiungi al carrello
                        </button>
                      </div>
                    )}
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
         <h3 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tight mb-4 text-orange-500">Insieme per salvaguardare il cibo rionale</h3>
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
