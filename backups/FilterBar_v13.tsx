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
    { name: 'Carne', icon: Drumstick },
    { name: 'Pesce', icon: Fish },
    { name: 'Piccante', icon: Flame },
    { name: 'Vegetariano', icon: Leaf },
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
    <>
      <div id="main-filter-bar" className="bg-white border-b border-gray-100 py-2 md:py-3.5 animate-fade-in transition-all">
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
                className="block w-full min-w-0 overflow-hidden text-ellipsis whitespace-nowrap pl-9 sm:pl-11 pr-9 sm:pr-10 py-2 md:py-3.5 border-2 border-gray-100 rounded-2xl md:rounded-[1.8rem] bg-gray-50/50 text-xs md:text-sm font-bold focus:outline-none focus:border-orange-500 focus:bg-white transition-all shadow-inner placeholder-gray-400"
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
              className={`relative flex items-center gap-1.5 sm:gap-2 px-3.5 md:px-6 py-2 md:py-3.5 rounded-2xl md:rounded-[1.8rem] border-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
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

      {/* Sticky Single-Row Dietary Preferences Bar */}
      <div
        id="dietary-preferences-bar"
        className="sticky top-16 md:top-20 z-20 bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-sm"
      >
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2">
          <div className="flex items-center overflow-x-auto gap-2 scrollbar-hide">
            <span className="inline-flex items-center gap-1.5 text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.14em] shrink-0 whitespace-nowrap pr-0.5">
              <UtensilsCrossed className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              <span className="hidden sm:inline">Preferenze Alimentari</span>
            </span>

            {categoryOptions.map(cat => {
              const Icon = cat.icon;
              const isActive = filters.categories.includes(cat.name);
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => toggleCategory(cat.name)}
                  className={`shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border text-[11px] sm:text-xs font-black uppercase tracking-wide transition-all cursor-pointer active:scale-95 ${
                    isActive
                      ? 'bg-orange-600 border-orange-600 text-white shadow-sm shadow-orange-500/20'
                      : 'bg-gray-50 hover:bg-orange-50 border-gray-200 hover:border-orange-300 text-gray-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-orange-500'}`} />
                  <span className="whitespace-nowrap">{cat.name}</span>
                  {isActive && <Check className="w-3 h-3 stroke-[3] shrink-0 text-white" />}
                </button>
              );
            })}

            {filters.categories.length > 0 && (
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, categories: [] })}
                className="shrink-0 whitespace-nowrap inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-black text-white hover:bg-orange-600 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95"
              >
                <X className="w-3 h-3 shrink-0" />
                <span className="whitespace-nowrap">Svuota</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
