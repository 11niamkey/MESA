import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Leaf, Flame, Fish, Drumstick, ChevronDown, ChevronUp, X, Check, UtensilsCrossed } from 'lucide-react';
import { Chef, FilterState } from '../types';
import { MOCK_CHEFS } from '../constants';
import { CountryFlag } from './CountryFlag';

export const nationalityNames: Record<string, string[]> = {
  '🇮🇹': ['Italia', 'Italiano', 'Pizza', 'Pasta', 'Italy'],
  '🇫🇷': ['Francia', 'Francese', 'France'],
  '🇪🇸': ['Spagna', 'Spagnolo', 'Spain', 'Paella'],
  '🇬🇷': ['Grecia', 'Greco', 'Greece'],
  '🇩🇪': ['Germania', 'Tedesco', 'Germany'],
  '🇵🇹': ['Portogallo', 'Portoghese', 'Portugal'],
  '🇸🇪': ['Svezia', 'Svedese', 'Sweden'],
  '🇬🇧': ['Regno Unito', 'Inghilterra', 'Inglese', 'UK'],
  '🇯🇵': ['Giappone', 'Giapponese', 'Japan', 'Sushi'],
  '🇨🇳': ['Cina', 'Cinese', 'China', 'Ravioli'],
  '🇮🇳': ['India', 'Indiano', 'Curry'],
  '🇹🇭': ['Thailandia', 'Thailandese', 'Thai'],
  '🇰🇷': ['Corea del Sud', 'Corea', 'Coreano', 'Korea'],
  '🇻🇳': ['Vietnam', 'Vietnamita', 'Vietnam'],
  '🇱🇧': ['Libano', 'Libanese', 'Lebanon'],
  '🇹🇷': ['Turchia', 'Turco', 'Turkey'],
  '🇲🇽': ['Messico', 'Messicano', 'Mexico', 'Tacos'],
  '🇧🇷': ['Brasile', 'Brasiliano', 'Brazil'],
  '🇵🇪': ['Perù', 'Peru', 'Peruviano'],
  '🇦🇷': ['Argentina', 'Argentino'],
  '🇺🇸': ['Stati Uniti', 'USA', 'America', 'Americano', 'Burger'],
  '🇲🇦': ['Marocco', 'Marocchino', 'Morocco', 'Couscous'],
  '🇸🇳': ['Senegal', 'Senegalese'],
  '🇨🇮': ['Costa d\'Avorio', 'Ivoriano'],
  '🇬🇭': ['Ghana', 'Ghanese'],
  '🇳🇬': ['Nigeria', 'Nigeriano', 'Jollof'],
  '🇪🇹': ['Etiopia', 'Etiopico', 'Ethiopia', 'Zighini'],
  '🇪🇬': ['Egitto', 'Egiziano', 'Egypt'],
  '🇰🇪': ['Kenya', 'Keniano'],
  '🇿🇦': ['Sudafrica', 'South Africa'],
  '🇨🇲': ['Camerun', 'Cameroon'],
  '🇨🇩': ['R.D. Congo', 'Congo', 'Congolese'],
  '🇲🇱': ['Mali', 'Maliano'],
  '🇹🇳': ['Tunisia', 'Tunisino'],
  '🇸🇴': ['Somalia', 'Somalo'],
  '🇲🇬': ['Madagascar', 'Malgascio'],
};

export const COUNTRY_FLAG_PRESETS: { flag: string; countryName: string; continent: 'Europa' | 'Africa' | 'Asia' | 'Americhe' }[] = [
  { flag: '🇮🇹', countryName: 'Italia', continent: 'Europa' },
  { flag: '🇫🇷', countryName: 'Francia', continent: 'Europa' },
  { flag: '🇪🇸', countryName: 'Spagna', continent: 'Europa' },
  { flag: '🇬🇷', countryName: 'Grecia', continent: 'Europa' },
  { flag: '🇩🇪', countryName: 'Germania', continent: 'Europa' },
  { flag: '🇵🇹', countryName: 'Portogallo', continent: 'Europa' },
  { flag: '🇸🇪', countryName: 'Svezia', continent: 'Europa' },
  { flag: '🇬🇧', countryName: 'Regno Unito', continent: 'Europa' },
  { flag: '🇨🇮', countryName: 'Costa d\'Avorio', continent: 'Africa' },
  { flag: '🇳🇬', countryName: 'Nigeria', continent: 'Africa' },
  { flag: '🇸🇳', countryName: 'Senegal', continent: 'Africa' },
  { flag: '🇲🇦', countryName: 'Marocco', continent: 'Africa' },
  { flag: '🇪🇹', countryName: 'Etiopia', continent: 'Africa' },
  { flag: '🇪🇬', countryName: 'Egitto', continent: 'Africa' },
  { flag: '🇬🇭', countryName: 'Ghana', continent: 'Africa' },
  { flag: '🇰🇪', countryName: 'Kenya', continent: 'Africa' },
  { flag: '🇨🇲', countryName: 'Camerun', continent: 'Africa' },
  { flag: '🇹🇳', countryName: 'Tunisia', continent: 'Africa' },
  { flag: '🇿🇦', countryName: 'Sudafrica', continent: 'Africa' },
  { flag: '🇨🇩', countryName: 'R.D. Congo', continent: 'Africa' },
  { flag: '🇲🇱', countryName: 'Mali', continent: 'Africa' },
  { flag: '🇸🇴', countryName: 'Somalia', continent: 'Africa' },
  { flag: '🇲🇬', countryName: 'Madagascar', continent: 'Africa' },
  { flag: '🇯🇵', countryName: 'Giappone', continent: 'Asia' },
  { flag: '🇨🇳', countryName: 'Cina', continent: 'Asia' },
  { flag: '🇮🇳', countryName: 'India', continent: 'Asia' },
  { flag: '🇹🇭', countryName: 'Thailandia', continent: 'Asia' },
  { flag: '🇰🇷', countryName: 'Corea del Sud', continent: 'Asia' },
  { flag: '🇻🇳', countryName: 'Vietnam', continent: 'Asia' },
  { flag: '🇱🇧', countryName: 'Libano', continent: 'Asia' },
  { flag: '🇹🇷', countryName: 'Turchia', continent: 'Asia' },
  { flag: '🇲🇽', countryName: 'Messico', continent: 'Americhe' },
  { flag: '🇦🇷', countryName: 'Argentina', continent: 'Americhe' },
  { flag: '🇧🇷', countryName: 'Brasile', continent: 'Americhe' },
  { flag: '🇵🇪', countryName: 'Perù', continent: 'Americhe' },
  { flag: '🇺🇸', countryName: 'Stati Uniti', continent: 'Americhe' },
];

export const getCountryNameByFlag = (flag?: string): string | undefined => {
  if (!flag) return undefined;
  return nationalityNames[flag.trim()]?.[0];
};

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  chefs?: Chef[];
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange, chefs = MOCK_CHEFS }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryOptions = [
    { 
      name: 'Carne', 
      icon: Drumstick, 
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=260&h=180&q=80',
      description: 'Arrosti e brasati'
    },
    { 
      name: 'Pesce', 
      icon: Fish, 
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=260&h=180&q=80',
      description: 'Fresco e saporito'
    },
    { 
      name: 'Piccante', 
      icon: Flame, 
      image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=260&h=180&q=80',
      description: 'Sapori piccanti'
    },
    { 
      name: 'Vegetariano', 
      icon: Leaf, 
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=260&h=180&q=80',
      description: 'Orto a metro zero'
    },
  ];

  // Build ordered list of active countries from live chefs with their original flags and country names
  const countryOptions = useMemo(() => {
    const map = new Map<string, { flag: string; name: string; dishCount: number }>();
    chefs.forEach(chef => {
      if (!chef.nationality) return;
      const flag = chef.nationality.trim();
      const resolvedName =
        (chef.countryName && !(chef.countryName === 'Italia' && flag !== '🇮🇹') ? chef.countryName : undefined) ||
        getCountryNameByFlag(flag) ||
        'Paese';
      const existing = map.get(flag);
      if (existing) {
        existing.dishCount += chef.dishes.length;
      } else {
        map.set(flag, { flag, name: resolvedName, dishCount: chef.dishes.length });
      }
    });
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name, 'it'));
  }, [chefs]);

  const toggleCountry = (flag: string) => {
    const current = filters.countries || [];
    const next = current.includes(flag)
      ? current.filter(c => c !== flag)
      : [...current, flag];
    onFilterChange({ ...filters, countries: next });
  };

  const toggleCategory = (option: string) => {
    const current = filters.categories || [];
    const next = current.includes(option)
      ? current.filter(c => c !== option)
      : [...current, option];
    onFilterChange({ ...filters, categories: next });
  };

  const activeFiltersCount = 
    (filters.categories?.length || 0) + 
    (filters.countries?.length || 0) + 
    (filters.maxPrice < 50 ? 1 : 0);

  const resetFilters = () => {
    onFilterChange({
      search: '',
      maxPrice: 50,
      dietary: [],
      categories: [],
      countries: []
    });
  };

  return (
    <div id="main-filter-bar" className="bg-white border-b border-orange-100 py-2.5 md:py-5 md:sticky md:top-20 z-40 shadow-sm animate-fade-in transition-all">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        {/* Search Header Container */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="relative flex-1 min-w-0 overflow-hidden rounded-2xl md:rounded-[1.8rem]">
            <div className="absolute inset-y-0 left-0 pl-3.5 sm:pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-orange-500" />
            </div>
            <input
              type="text"
              placeholder="Cerca piatti o ingredienti..."
              className="block w-full min-w-0 overflow-hidden text-ellipsis whitespace-nowrap pl-9 sm:pl-11 pr-9 sm:pr-10 py-2.5 md:py-4 border-2 border-gray-100 rounded-2xl md:rounded-[1.8rem] bg-gray-50/50 text-xs md:text-sm font-bold focus:outline-none focus:border-orange-500 focus:bg-white transition-all shadow-inner placeholder-gray-400"
              value={filters.search}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            />
            {filters.search && (
              <button 
                onClick={() => onFilterChange({ ...filters, search: '' })}
                className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-orange-600"
                title="Pulisci ricerca"
              >
                <X className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
              </button>
            )}
          </div>

          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className={`relative flex items-center gap-1.5 sm:gap-2 px-3.5 md:px-7 py-2.5 md:py-4 rounded-2xl md:rounded-[1.8rem] border-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
              isExpanded || activeFiltersCount > 0 
                ? 'bg-black border-black text-white shadow-xl' 
                : 'bg-white border-gray-100 text-gray-700 hover:border-orange-500'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Filtri</span>
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-orange-600 text-black border-2 border-white rounded-full flex items-center justify-center text-[9px] font-black">
                {activeFiltersCount}
              </span>
            )}
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Categorie Section with Compact Food Banners */}
        <div className="mt-2.5 md:mt-5">
          <div>
            <div className="flex items-center justify-between mb-1.5 md:mb-2 px-0.5">
              <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.18em] flex items-center gap-1.5">
                <UtensilsCrossed className="w-3 h-3 md:w-3.5 md:h-3.5 text-orange-500" />
                Preferenze Alimentari
              </span>
              {filters.categories.length > 0 && (
                <button 
                  onClick={() => onFilterChange({ ...filters, categories: [] })}
                  className="text-[9px] font-black text-orange-600 uppercase hover:underline"
                >
                  Svuota Categorie
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3.5">
              {categoryOptions.map(cat => {
                const Icon = cat.icon;
                const isActive = filters.categories.includes(cat.name);
                return (
                  <button
                    key={cat.name}
                    onClick={() => toggleCategory(cat.name)}
                    className={`relative w-full h-11 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all group cursor-pointer ${
                      isActive 
                        ? 'border-orange-500 shadow-md ring-2 ring-orange-500/20' 
                        : 'border-transparent hover:border-orange-200 hover:shadow-md'
                    }`}
                  >
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className={`absolute inset-0 bg-gradient-to-r sm:bg-gradient-to-t transition-opacity duration-300 ${
                      isActive ? 'from-orange-600/95 via-orange-500/80 to-black/30 opacity-95' : 'from-black/85 via-black/55 to-black/25'
                    }`}></div>

                    <div className="absolute inset-0 px-2.5 py-1.5 sm:p-3 flex flex-col justify-center sm:justify-end text-left z-10 min-w-0">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Icon className={`w-3.5 h-3.5 md:w-4 md:h-4 shrink-0 ${isActive ? 'text-black' : 'text-orange-400 sm:text-orange-500'}`} />
                        <span className={`text-[11px] md:text-[13px] font-black tracking-tight uppercase leading-none truncate ${isActive ? 'text-black' : 'text-white'}`}>
                          {cat.name}
                        </span>
                      </div>
                      <span className={`hidden sm:block text-[10px] font-medium leading-tight mt-0.5 truncate ${isActive ? 'text-orange-950 font-bold' : 'text-gray-200'}`}>
                        {cat.description}
                      </span>
                    </div>

                    {isActive && (
                      <div className="absolute top-1/2 -translate-y-1/2 sm:translate-y-0 sm:top-2 right-1.5 md:right-2 bg-black text-orange-500 p-0.5 sm:p-1 rounded-full shadow-lg">
                        <Check className="w-2.5 h-2.5 md:w-3 md:h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Advanced Filters Expandable Drawer */}
        {isExpanded && (
          <div className="mt-4 pt-5 border-t border-gray-100 animate-slide-up space-y-5 max-h-[55vh] overflow-y-auto">
            {/* Price Filter */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block">Prezzo Massimo Piatto</span>
                <span className="text-sm font-black text-gray-900">
                  {filters.maxPrice >= 50 ? 'Qualsiasi prezzo' : `Fino a € ${filters.maxPrice.toFixed(0)}`}
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={50}
                step={1}
                value={filters.maxPrice}
                onChange={(e) => onFilterChange({ ...filters, maxPrice: Number(e.target.value) })}
                className="w-full sm:w-64 accent-orange-600 cursor-pointer"
              />
            </div>

            {/* Complete Countries Grid */}
            <div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-3">
                Tutte le Nazioni Disponibili ({countryOptions.length})
              </span>
              <div className="flex flex-wrap gap-2">
                {countryOptions.map(country => {
                  const isActive = filters.countries.includes(country.flag);
                  return (
                    <button
                      key={country.flag}
                      onClick={() => toggleCountry(country.flag)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all border-2 duration-200 ${
                        isActive
                          ? 'bg-orange-50 border-orange-500 text-orange-950 font-black'
                          : 'bg-gray-50/50 border-gray-100 text-gray-600 hover:bg-white hover:border-orange-200'
                      }`}
                    >
                      <CountryFlag flag={country.flag} title={country.name} size="sm" />
                      <span className="text-xs font-bold">{country.name}</span>
                      <span className="text-[10px] font-black text-gray-400">({country.dishCount})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
              <button 
                onClick={resetFilters}
                className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-black transition-colors"
              >
                Resetta Tutti i Filtri
              </button>
              <button 
                onClick={() => setIsExpanded(false)}
                className="px-8 py-3 bg-black hover:bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95"
              >
                Applica e Chiudi
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
