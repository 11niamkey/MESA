import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ChevronDown, ChevronUp, X, Check } from 'lucide-react';
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

  const categoryOptions: {
    name: string;
    microLabel: string;
    ariaLabel: string;
    circleIdleClass: string;
    circleActiveClass: string;
    labelIdleClass: string;
    labelActiveClass: string;
    badgeClass: string;
    illustration: React.ReactNode;
  }[] = [
    {
      name: 'Carne',
      microLabel: 'Carne',
      ariaLabel: 'Filtra piatti di Carne',
      circleIdleClass: 'bg-rose-50 border-rose-200 hover:bg-rose-100/80 hover:border-rose-400',
      circleActiveClass: 'bg-rose-100 border-rose-600 ring-2 ring-rose-500/30 shadow-md shadow-rose-500/20 scale-105',
      labelIdleClass: 'text-rose-900/80',
      labelActiveClass: 'text-rose-700 font-black',
      badgeClass: 'bg-rose-600',
      illustration: (
        <svg viewBox="0 0 32 32" className="w-6 h-6 shrink-0" aria-hidden="true">
          {/* Bone */}
          <path
            d="M21.8 10.2l3.4-3.4a2.2 2.2 0 1 1 3.1 3.1l-.4.4a2.2 2.2 0 1 1-3.1 3.1l-3.4 3.4"
            fill="#FEF3C7"
            stroke="#9A3412"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="27.2" cy="7.2" r="2.1" fill="#FEF3C7" stroke="#9A3412" strokeWidth="1.4" />
          <circle cx="24.8" cy="4.8" r="2.1" fill="#FEF3C7" stroke="#9A3412" strokeWidth="1.4" />
          {/* Meat drumstick / cut */}
          <path
            d="M7.5 13.5c3.5-4 9.5-5.2 13.5-2.2 3.2 2.4 3.4 7.1.3 10.6-3.1 3.5-8.5 6.3-13.2 5.4-3.5-.7-5.1-4.1-4-7.6.6-2 1.7-4.3 3.4-6.2z"
            fill="#DC2626"
            stroke="#7F1D1D"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M8.5 16.5c2.2-2.6 5.9-3.6 8.4-2.1"
            fill="none"
            stroke="#FCA5A5"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <ellipse cx="14.5" cy="19.5" rx="2.4" ry="1.4" transform="rotate(-35 14.5 19.5)" fill="#FECACA" opacity="0.6" />
        </svg>
      ),
    },
    {
      name: 'Pesce',
      microLabel: 'Pesce',
      ariaLabel: 'Filtra piatti di Pesce',
      circleIdleClass: 'bg-sky-50 border-sky-200 hover:bg-sky-100/80 hover:border-sky-400',
      circleActiveClass: 'bg-sky-100 border-sky-600 ring-2 ring-sky-500/30 shadow-md shadow-sky-500/20 scale-105',
      labelIdleClass: 'text-sky-900/80',
      labelActiveClass: 'text-sky-700 font-black',
      badgeClass: 'bg-sky-600',
      illustration: (
        <svg viewBox="0 0 32 32" className="w-6 h-6 shrink-0" aria-hidden="true">
          {/* Tail fin */}
          <path
            d="M22 16l6.5-5.5c.6-.5 1.5 0 1.4.8l-.8 4.7.8 4.7c.1.8-.8 1.3-1.4.8L22 16z"
            fill="#0284C7"
            stroke="#0C4A6E"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Top & bottom fins */}
          <path d="M13 10.5l3.5-4c.5-.6 1.5-.3 1.6.5l.4 3.5" fill="#38BDF8" stroke="#0C4A6E" strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M14 21.5l2.5 3.3c.5.6 1.4.3 1.5-.4l.3-2.9" fill="#38BDF8" stroke="#0C4A6E" strokeWidth="1.4" strokeLinejoin="round" />
          {/* Fish body */}
          <path
            d="M3 16c2.6-4.5 7.7-7 13-6.5 4.2.4 7.5 3.1 8.8 6.5-1.3 3.4-4.6 6.1-8.8 6.5-5.3.5-10.4-2-13-6.5z"
            fill="#38BDF8"
            stroke="#0C4A6E"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          {/* Belly highlight */}
          <path d="M6.5 18.2c2.8 1.8 6.8 2.4 10.6 1.3" fill="none" stroke="#E0F2FE" strokeWidth="1.8" strokeLinecap="round" />
          {/* Gill & Eye */}
          <path d="M11.5 12.2c1.2 2.2 1.2 5.4 0 7.6" fill="none" stroke="#0369A1" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="8" cy="14.7" r="1.5" fill="#0F172A" />
          <circle cx="7.5" cy="14.2" r="0.5" fill="#FFFFFF" />
        </svg>
      ),
    },
    {
      name: 'Piccante',
      microLabel: 'Piccante',
      ariaLabel: 'Filtra piatti Piccanti',
      circleIdleClass: 'bg-amber-50 border-red-200 hover:bg-red-50 hover:border-red-400',
      circleActiveClass: 'bg-red-100 border-red-600 ring-2 ring-red-500/30 shadow-md shadow-red-500/20 scale-105',
      labelIdleClass: 'text-red-900/80',
      labelActiveClass: 'text-red-700 font-black',
      badgeClass: 'bg-red-600',
      illustration: (
        <svg viewBox="0 0 32 32" className="w-6 h-6 shrink-0" aria-hidden="true">
          {/* Stem */}
          <path
            d="M21 8.5c1-2.6 2.8-4 5-4.3"
            fill="none"
            stroke="#15803D"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Calyx */}
          <path
            d="M17.2 9.4c1.5-1.6 4.4-1.8 6-.2.7.7.8 1.9.1 2.7l-6.1-2.5z"
            fill="#22C55E"
            stroke="#14532D"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          {/* Red chili pepper body */}
          <path
            d="M17.5 9.2c3.2.5 5.4 2.8 5.2 5.7-.4 5.2-4.8 10.6-12.5 12.6-2.4.6-5.2-.1-5.8-1.5-.5-1.2.8-2.2 2.4-2.8 4.4-1.6 7.1-5.5 7.7-10.3.3-2.1 1.3-3.9 3-3.7z"
            fill="#EF4444"
            stroke="#991B1B"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          {/* Chili gloss */}
          <path
            d="M18.2 13.8c-.7 3.8-2.7 7.1-6.2 9.2"
            fill="none"
            stroke="#FCA5A5"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      name: 'Vegetariano',
      microLabel: 'Veg',
      ariaLabel: 'Filtra piatti Vegetariani e Vegani',
      circleIdleClass: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100/80 hover:border-emerald-400',
      circleActiveClass: 'bg-emerald-100 border-emerald-600 ring-2 ring-emerald-500/30 shadow-md shadow-emerald-500/20 scale-105',
      labelIdleClass: 'text-emerald-900/80',
      labelActiveClass: 'text-emerald-700 font-black',
      badgeClass: 'bg-emerald-600',
      illustration: (
        <svg viewBox="0 0 32 32" className="w-6 h-6 shrink-0" aria-hidden="true">
          {/* Bright green leaf */}
          <path
            d="M7 23C5.8 14.5 11.2 6.8 25.5 5.5c-.6 13.6-7.6 19.8-16 18.8-.9-.1-1.9-.6-2.5-1.3z"
            fill="#22C55E"
            stroke="#14532D"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          {/* Soft highlight */}
          <path
            d="M11.5 15.5c2-4.2 5.6-6.8 10.5-7.6"
            fill="none"
            stroke="#BBF7D0"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          {/* Central vein & stem */}
          <path
            d="M5.5 26.5C10.5 20.8 15.8 15.5 22 10.5"
            fill="none"
            stroke="#14532D"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <path d="M13 18.5h4.2M16.2 15.3l3.2-.2" fill="none" stroke="#14532D" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      ),
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
    <>
      <div id="main-filter-bar" className="bg-white border-b border-gray-100 py-2.5 sm:py-3 animate-fade-in transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
          {/* Search Header Container */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="relative flex-1 min-w-0 overflow-hidden rounded-2xl">
              <div className="absolute inset-y-0 left-0 pl-3.5 sm:pl-4 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-orange-500 shrink-0" />
              </div>
              <input
                type="text"
                placeholder="Cerca piatti o ingredienti..."
                className="block w-full min-w-0 overflow-hidden text-ellipsis whitespace-nowrap pl-10 pr-9 py-2.5 sm:py-3 border-2 border-gray-100 rounded-2xl bg-gray-50/50 text-xs sm:text-sm font-bold focus:outline-none focus:border-orange-500 focus:bg-white transition-all shadow-inner placeholder-gray-400"
                value={filters.search}
                onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              />
              {filters.search && (
                <button 
                  onClick={() => onFilterChange({ ...filters, search: '' })}
                  className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-orange-600"
                  title="Pulisci ricerca"
                >
                  <X className="w-4 h-4 shrink-0" />
                </button>
              )}
            </div>

            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className={`relative flex items-center gap-1.5 px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-2xl border-2 text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
                isExpanded || activeFiltersCount > 0 
                  ? 'bg-black border-black text-white shadow-xl' 
                  : 'bg-white border-gray-100 text-gray-700 hover:border-orange-500'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Filtri</span>
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-orange-600 text-black border-2 border-white rounded-full flex items-center justify-center text-[9px] font-black">
                  {activeFiltersCount}
                </span>
              )}
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5 shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 shrink-0" />}
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
      </div>

      {/* Sticky Single-Row Dietary Preferences Bar */}
      <div
        id="dietary-preferences-bar"
        className="sticky top-16 md:top-20 z-20 bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-sm"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="max-w-2xl mx-auto grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <div aria-hidden="true" />

            <div className="flex items-center justify-center gap-3.5 sm:gap-5">
              {categoryOptions.map(cat => {
                const isActive = filters.categories.includes(cat.name);
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => toggleCategory(cat.name)}
                    title={cat.name}
                    aria-label={cat.ariaLabel}
                    aria-pressed={isActive}
                    className="group flex flex-col items-center justify-center shrink-0 cursor-pointer focus:outline-none active:scale-95 transition-transform"
                  >
                    <div
                      className={`relative w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        isActive ? cat.circleActiveClass : cat.circleIdleClass
                      }`}
                    >
                      {cat.illustration}
                      {isActive && (
                        <span
                          className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${cat.badgeClass} text-white border-2 border-white flex items-center justify-center shadow-sm`}
                        >
                          <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[10px] leading-none mt-1 tracking-tight whitespace-nowrap transition-colors ${
                        isActive ? cat.labelActiveClass : `font-bold ${cat.labelIdleClass}`
                      }`}
                    >
                      {cat.microLabel}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end">
              {filters.categories.length > 0 && (
                <button
                  type="button"
                  onClick={() => onFilterChange({ ...filters, categories: [] })}
                  title="Svuota preferenze alimentari"
                  aria-label="Svuota preferenze alimentari"
                  className="shrink-0 whitespace-nowrap inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-full bg-black text-white hover:bg-orange-600 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95 shadow-sm"
                >
                  <X className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline whitespace-nowrap">Svuota</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
