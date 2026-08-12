import React, { useState } from 'react';
import { Search, SlidersHorizontal, Leaf, Flame, Fish, Drumstick, Globe, ChevronDown, ChevronUp, X, Check } from 'lucide-react';
import { FilterState } from '../types';
import { MOCK_CHEFS } from '../constants';

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
  '🇰🇷': ['Corea', 'Coreano', 'Korea'],
  '🇻🇳': ['Vietnam', 'Vietnamita', 'Vietnam'],
  '🇱🇧': ['Libano', 'Libanese', 'Lebanon'],
  '🇹🇷': ['Turchia', 'Turco', 'Turkey'],
  '🇲🇽': ['Messico', 'Messicano', 'Mexico', 'Tacos'],
  '🇧🇷': ['Brasile', 'Brasiliano', 'Brazil'],
  '🇵🇪': ['Peru', 'Peruviano', 'Peru'],
  '🇦🇷': ['Argentina', 'Argentino'],
  '🇺🇸': ['USA', 'America', 'Americano', 'Burger'],
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
  '🇨🇩': ['Congo', 'Congolese'],
  '🇲🇱': ['Mali'],
  '🇹🇳': ['Tunisia', 'Tunisino'],
};

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryOptions = [
    { name: 'Carne', icon: Drumstick },
    { name: 'Pesce', icon: Fish },
    { name: 'Piccante', icon: Flame },
    { name: 'Vegetariano', icon: Leaf },
  ];

  const countryOptions = Array.from(new Set(MOCK_CHEFS.map(chef => chef.nationality))).sort();

  const toggleCountry = (option: string) => {
    const current = filters.countries || [];
    const next = current.includes(option)
      ? current.filter(c => c !== option)
      : [...current, option];
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
    <div className="bg-white border-b border-orange-100 py-4 sticky top-20 z-40 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-orange-500" />
            </div>
            <input
              type="text"
              placeholder="Cerca piatto, nazione o chef..."
              className="block w-full pl-12 pr-4 py-4 border-2 border-gray-50 rounded-[1.5rem] bg-gray-50 text-sm font-bold focus:outline-none focus:border-orange-500 focus:bg-white transition-all shadow-inner"
              value={filters.search}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            />
            {filters.search && (
              <button 
                onClick={() => onFilterChange({ ...filters, search: '' })}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-orange-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className={`relative flex items-center gap-3 px-8 py-4 rounded-[1.5rem] border-2 text-[10px] font-black uppercase tracking-widest transition-all ${
              isExpanded || activeFiltersCount > 0 
                ? 'bg-black border-black text-white shadow-xl' 
                : 'bg-white border-gray-100 text-gray-700 hover:border-orange-500'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filtri</span>
            {activeFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-orange-600 text-black border-2 border-white rounded-full flex items-center justify-center text-[10px] font-black">
                {activeFiltersCount}
              </span>
            )}
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {isExpanded && (
          <div className="mt-6 pt-6 border-t border-gray-100 animate-fade-in space-y-8">
            {/* Categorie Section */}
            <div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-4">Preferenze Alimentari</span>
              <div className="flex flex-wrap gap-3">
                {categoryOptions.map(cat => {
                  const Icon = cat.icon;
                  const isActive = filters.categories.includes(cat.name);
                  return (
                    <button
                      key={cat.name}
                      onClick={() => toggleCategory(cat.name)}
                      className={`flex items-center gap-2 px-5 py-3 rounded-2xl border-2 transition-all font-bold text-xs ${
                        isActive 
                          ? 'bg-orange-600 border-orange-600 text-black shadow-lg scale-105' 
                          : 'bg-white border-gray-100 text-gray-500 hover:border-orange-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Paesi Section con Bandiere e Nomi Dinamici */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block">Esplora per Origine</span>
                {filters.countries.length > 0 && (
                  <button onClick={() => onFilterChange({...filters, countries: []})} className="text-[9px] font-black text-orange-600 uppercase underline">Svuota paesi</button>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {countryOptions.map(country => {
                  const isActive = filters.countries.includes(country);
                  const countryName = nationalityNames[country]?.[0] || 'Paese';
                  return (
                    <button
                      key={country}
                      onClick={() => toggleCountry(country)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-2xl transition-all border-2 duration-300 ${
                        isActive
                          ? 'bg-orange-50 border-orange-500 shadow-md ring-2 ring-orange-100'
                          : 'bg-gray-50/50 border-gray-100 grayscale hover:grayscale-0 hover:bg-white'
                      }`}
                    >
                      <span className="text-2xl">{country}</span>
                      {isActive && (
                        <span className="text-[10px] font-black uppercase tracking-widest text-orange-700 animate-fade-in whitespace-nowrap">
                          {countryName}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <button 
                onClick={resetFilters}
                className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-black transition-colors"
              >
                Resetta Tutti i Filtri
              </button>
              <button 
                onClick={() => setIsExpanded(false)}
                className="px-10 py-4 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl hover:bg-orange-600 transition-all active:scale-95"
              >
                Mostra Risultati
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
