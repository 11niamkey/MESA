import React, { useState } from 'react';
import { Search, SlidersHorizontal, Leaf, Flame, Fish, Drumstick, Globe, ChevronDown, ChevronUp, X, Check, UtensilsCrossed } from 'lucide-react';
import { FilterState } from '../types';
import { MOCK_CHEFS } from '../constants';

export const nationalityNames: Record<string, string[]> = {
  '🇨🇮': ['Costa d\'Avorio', 'Ivoriano', 'Cote d\'Ivoire', 'Abidjan', 'Garba', 'Attiéké', 'Alloco', 'Kedjenou'],
  '🇸🇳': ['Senegal', 'Senegalese', 'Dakar', 'Thieboudienne', 'Ceebu Jen', 'Yassa', 'Pastels'],
  '🇳🇬': ['Nigeria', 'Nigeriano', 'Lagos', 'Jollof', 'Suya', 'Egusi', 'Pounded Yam'],
  '🇬🇭': ['Ghana', 'Ghanese', 'Accra', 'Waakye', 'Shito', 'Kelewele', 'Red Red'],
  '🇨🇲': ['Camerun', 'Camerunese', 'Cameroon', 'Douala', 'Ndole', 'Poulet DG'],
  '🇪🇹': ['Etiopia', 'Etiopico', 'Ethiopia', 'Addis Abeba', 'Injera', 'Doro Wat', 'Beyaynetu', 'Zighini'],
  '🇰🇪': ['Kenya', 'Keniano', 'Nairobi', 'Mombasa', 'Pilau', 'Nyama Choma', 'Chapati'],
  '🇨🇩': ['Congo', 'RDC Congo', 'Congolese', 'Kinshasa', 'Moambe', 'Pondu', 'Saka Saka'],
  '🇲🇦': ['Marocco', 'Marocchino', 'Morocco', 'Marrakech', 'Tajine', 'Pastilla', 'Couscous'],
  '🇪🇬': ['Egitto', 'Egiziano', 'Egypt', 'Cairo', 'Koshary', 'Taameya'],
  '🇹🇳': ['Tunisia', 'Tunisino', 'Carthage', 'Harissa', 'Couscous di Pesce', 'Brik'],
  '🇲🇱': ['Mali', 'Maliano', 'Bamako', 'Tiga Dega Na'],
  '🇿🇦': ['Sudafrica', 'South Africa', 'Cape Town', 'Bobotie'],
  '🌍': ['Pan-Africana', 'Africana', 'Bissap', 'Zenzero', 'Gnamakoudji', 'Degue', 'Puff Puff']
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
      flag: '🇨🇮', 
      name: 'Costa d\'Avorio', 
      image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=260&h=180&q=80',
      cuisine: 'Garba e Alloco'
    },
    { 
      flag: '🇸🇳', 
      name: 'Senegal', 
      image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=260&h=180&q=80',
      cuisine: 'Thieboudienne e Yassa'
    },
    { 
      flag: '🇳🇬', 
      name: 'Nigeria', 
      image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=260&h=180&q=80',
      cuisine: 'Party Jollof e Suya'
    },
    { 
      flag: '🇪🇹', 
      name: 'Etiopia', 
      image: 'https://images.unsplash.com/photo-1542354256-4b68e7d7f26c?auto=format&fit=crop&w=260&h=180&q=80',
      cuisine: 'Injera e Doro Wat'
    },
    { 
      flag: '🇲🇦', 
      name: 'Marocco', 
      image: 'https://images.unsplash.com/photo-1511690656952-34342d5c2895?auto=format&fit=crop&w=260&h=180&q=80',
      cuisine: 'Tajine e Pastilla'
    },
    { 
      flag: '🇨🇲', 
      name: 'Camerun', 
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=260&h=180&q=80',
      cuisine: 'Ndolé e Poulet DG'
    },
    { 
      flag: '🇰🇪', 
      name: 'Kenya', 
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=260&h=180&q=80',
      cuisine: 'Beef Pilau e Nyama Choma'
    },
    { 
      flag: '🇨🇩', 
      name: 'RDC Congo', 
      image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=260&h=180&q=80',
      cuisine: 'Poulet Moambé e Pondu'
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
    <div id="main-filter-bar" className="bg-white border-b border-orange-100 py-3.5 md:py-6 sticky top-16 md:top-20 z-40 shadow-sm animate-fade-in transition-all">
      <div className="max-w-6xl mx-auto px-4">
        {/* Search Header Container */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none">
              <Search className="h-4.5 w-4.5 text-orange-500" />
            </div>
            <input
              type="text"
              placeholder="Cerca piatti, cucine..."
              className="block w-full pl-11 pr-4 py-3 md:py-4 border-2 border-gray-100 rounded-[1.3rem] md:rounded-[1.8rem] bg-gray-50/50 text-xs md:text-sm font-bold focus:outline-none focus:border-orange-500 focus:bg-white transition-all shadow-inner placeholder-gray-400"
              value={filters.search}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            />
            {filters.search && (
              <button 
                onClick={() => onFilterChange({ ...filters, search: '' })}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-orange-600"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            )}
          </div>

          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className={`relative flex items-center gap-2 px-4 md:px-8 py-3 md:py-4 rounded-[1.3rem] md:rounded-[1.8rem] border-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${
              isExpanded || activeFiltersCount > 0 
                ? 'bg-black border-black text-white shadow-xl' 
                : 'bg-white border-gray-100 text-gray-700 hover:border-orange-500'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Advanced</span>
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-orange-600 text-black border-2 border-white rounded-full flex items-center justify-center text-[9px] font-black">
                {activeFiltersCount}
              </span>
            )}
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Visually Highlighted Options Below Search Bar (Permanent and Beautiful with Images) */}
        <div className="mt-4 md:mt-6 pt-1">
          {/* Categorie Section with Real Food Banners */}
          <div className="mb-2 md:mb-6">
            <div className="flex items-center justify-between mb-2 md:mb-3 px-1">
              <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-1.5">
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

            <div className="flex overflow-x-auto space-x-2 md:space-x-4 pb-2 md:pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
              {categoryOptions.map(cat => {
                const Icon = cat.icon;
                const isActive = filters.categories.includes(cat.name);
                return (
                  <button
                    key={cat.name}
                    onClick={() => toggleCategory(cat.name)}
                    className={`relative flex-none w-[140px] sm:w-44 h-16 sm:h-24 rounded-xl sm:rounded-[1.5rem] overflow-hidden border-2 transition-all group cursor-pointer ${
                      isActive 
                        ? 'border-orange-500 shadow-xl scale-[1.02] sm:scale-105 ring-4 ring-orange-500/15' 
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
                    <div className="absolute inset-0 p-2 md:p-3.5 flex flex-col justify-end text-left z-10">
                      <div className="flex items-center gap-1 md:gap-1.5 mb-0.5">
                        <Icon className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isActive ? 'text-black' : 'text-orange-500'}`} />
                        <span className={`text-[11px] md:text-[13px] font-black tracking-tight uppercase leading-none ${isActive ? 'text-black' : 'text-white'}`}>
                          {cat.name}
                        </span>
                      </div>
                      <span className={`text-[8px] md:text-[9.5px] font-medium leading-none ${isActive ? 'text-orange-950 font-bold' : 'text-gray-300'}`}>
                        {cat.description}
                      </span>
                    </div>

                    {/* Selected Badge */}
                    {isActive && (
                      <div className="absolute top-1.5 right-1.5 md:top-2.5 md:right-2.5 bg-black text-orange-500 p-1 md:p-1.5 rounded-full shadow-lg">
                        <Check className="w-2.5 h-2.5 md:w-3 md:h-3 stroke-[3]" />
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
