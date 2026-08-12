import React, { useState } from 'react';
import { Search, SlidersHorizontal, Leaf, Flame, Fish, Drumstick, Globe, ChevronDown, ChevronUp, X, Check, UtensilsCrossed } from 'lucide-react';
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

  // Map country choices directly with amazing dedicated cuisine headers & local dish imagery
  const countryCuisines = [
    { 
      flag: '🇮🇹', 
      name: 'Italia', 
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=260&h=180&q=80',
      cuisine: 'Pizza e Pasta'
    },
    { 
      flag: '🇲🇽', 
      name: 'Messico', 
      image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=260&h=180&q=80',
      cuisine: 'Tacos e Tortillas'
    },
    { 
      flag: '🇯🇵', 
      name: 'Giappone', 
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=260&h=180&q=80',
      cuisine: 'Sushi e Ramen'
    },
    { 
      flag: '🇨🇳', 
      name: 'Cina', 
      image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=260&h=180&q=80',
      cuisine: 'Gyoza e Anatra'
    },
    { 
      flag: '🇲🇦', 
      name: 'Marocco', 
      image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=260&h=180&q=80',
      cuisine: 'Couscous e Tajine'
    },
    { 
      flag: '🇮🇳', 
      name: 'India', 
      image: 'https://images.unsplash.com/photo-1585938338392-50a599d02177?auto=format&fit=crop&w=260&h=180&q=80',
      cuisine: 'Samosa e Curry'
    },
    { 
      flag: '🇫🇷', 
      name: 'Francia', 
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=260&h=180&q=80',
      cuisine: 'Boulangerie'
    }
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
    <div id="main-filter-bar" className="bg-white border-b border-orange-100 py-6 sticky top-20 z-40 shadow-sm animate-fade-in">
      <div className="max-w-6xl mx-auto px-4">
        {/* Search Header Container */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-orange-500" />
            </div>
            <input
              type="text"
              placeholder="Cercare cucine o deliziosi piatti fatti in casa..."
              className="block w-full pl-12 pr-4 py-4.5 border-2 border-gray-100 rounded-[1.8rem] bg-gray-50/50 text-sm font-bold focus:outline-none focus:border-orange-500 focus:bg-white transition-all shadow-inner placeholder-gray-400"
              value={filters.search}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            />
            {filters.search && (
              <button 
                onClick={() => onFilterChange({ ...filters, search: '' })}
                className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-orange-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className={`relative flex items-center gap-3 px-8 py-4 px-5 sm:px-8 py-4.5 rounded-[1.8rem] border-2 text-[10px] font-black uppercase tracking-widest transition-all ${
              isExpanded || activeFiltersCount > 0 
                ? 'bg-black border-black text-white shadow-xl' 
                : 'bg-white border-gray-100 text-gray-700 hover:border-orange-500'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Advanced</span>
            {activeFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-orange-600 text-black border-2 border-white rounded-full flex items-center justify-center text-[10px] font-black">
                {activeFiltersCount}
              </span>
            )}
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Visually Highlighted Options Below Search Bar (Permanent and Beautiful with Images) */}
        <div className="mt-6 pt-2">
          {/* Categorie Section with Real Food Banners */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-1.5">
                <UtensilsCrossed className="w-3.5 h-3.5 text-orange-500" />
                Preferenze Alimentari in Evidenza
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

            <div className="flex overflow-x-auto space-x-4 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
              {categoryOptions.map(cat => {
                const Icon = cat.icon;
                const isActive = filters.categories.includes(cat.name);
                return (
                  <button
                    key={cat.name}
                    onClick={() => toggleCategory(cat.name)}
                    className={`relative flex-none w-44 h-24 rounded-[1.5rem] overflow-hidden border-2 transition-all group cursor-pointer ${
                      isActive 
                        ? 'border-orange-500 shadow-xl scale-105 ring-4 ring-orange-500/15' 
                        : 'border-transparent hover:border-orange-200 hover:shadow-md'
                    }`}
                  >
                    {/* Background image & overlay */}
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-300 ${
                      isActive ? 'from-orange-600/90 to-black/35 opacity-95' : 'from-black/80 via-black/45 to-transparent'
                    }`}></div>

                    {/* Content inside card */}
                    <div className="absolute inset-0 p-3.5 flex flex-col justify-end text-left z-10">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-orange-500'}`} />
                        <span className={`text-[12px] font-black tracking-tight uppercase leading-none ${isActive ? 'text-black' : 'text-white'}`}>
                          {cat.name}
                        </span>
                      </div>
                      <span className={`text-[9px] font-medium leading-none ${isActive ? 'text-orange-950 font-bold' : 'text-gray-300'}`}>
                        {cat.description}
                      </span>
                    </div>

                    {/* Selected Badge */}
                    {isActive && (
                      <div className="absolute top-2.5 right-2.5 bg-black text-orange-500 p-1.5 rounded-full shadow-lg">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>


        </div>

        {/* Traditional Advanced Filters Expandable Drawer Section */}
        {isExpanded && (
          <div className="mt-4 pt-6 border-t border-gray-100 animate-slide-up space-y-6">
            <div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-3">Tutte le Altre Nazioni</span>
              <div className="flex flex-wrap gap-2.5">
                {countryOptions.map(country => {
                  const alreadyFeatured = countryCuisines.some(item => item.flag === country);
                  if (alreadyFeatured) return null; // Avoid duplicating featured cards
                  
                  const isActive = filters.countries.includes(country);
                  const countryName = nationalityNames[country]?.[0] || 'Paese';
                  return (
                    <button
                      key={country}
                      onClick={() => toggleCountry(country)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all border-2 duration-300 ${
                        isActive
                          ? 'bg-orange-50 border-orange-500 text-orange-950 font-black'
                          : 'bg-gray-50/50 border-gray-100 text-gray-500 hover:bg-white'
                      }`}
                    >
                      <span className="text-xl">{country}</span>
                      <span className="text-xs font-bold">{countryName}</span>
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
                Resetta Filtri
              </button>
              <button 
                onClick={() => setIsExpanded(false)}
                className="px-10 py-3.5 bg-black hover:bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95"
              >
                Chiudi Avanzate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
