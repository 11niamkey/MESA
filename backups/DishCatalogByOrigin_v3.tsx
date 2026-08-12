import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, MapPin, Star, Clock, ShoppingBag } from 'lucide-react';
import { Chef, Dish, Continent } from '../types';

interface DishCatalogByOriginProps {
  chefs: Chef[];
  onAddDish: (dish: Dish) => void;
  favorites: string[];
  onToggleFavorite: (dishId: string) => void;
  onViewProfile?: (chef: Chef) => void;
}

interface DishWithChefDetails extends Dish {
  chefName: string;
  chefAvatar: string;
  chefNationality: string;
  chefRating: number;
  chefDistance: number;
  chefContinent: Continent;
}

export const DishCatalogByOrigin: React.FC<DishCatalogByOriginProps> = ({
  chefs,
  onAddDish,
  favorites,
  onToggleFavorite,
  onViewProfile
}) => {
  const [selectedProvenance, setSelectedProvenance] = useState<Continent | 'Tutti'>('Tutti');

  // List of provenances to display
  const provenances: { key: Continent | 'Tutti'; label: string; icon: string; bg: string; text: string }[] = [
    { key: 'Tutti', label: 'Tutti i Sapori', icon: '🌟', bg: 'bg-orange-500', text: 'text-orange-900' },
    { key: 'Europa', label: 'Europa', icon: '🇪🇺', bg: 'bg-blue-500', text: 'text-blue-900' },
    { key: 'Africa', label: 'Sapori d\'Africa', icon: '🇲🇦', bg: 'bg-amber-500', text: 'text-amber-900' },
    { key: 'Asia', label: 'Tradizioni Asiatiche', icon: '🇨🇳', bg: 'bg-red-500', text: 'text-red-900' },
    { key: 'Americhe', label: 'Dalle Americhe', icon: '🇲🇽', bg: 'bg-emerald-500', text: 'text-emerald-950' }
  ];

  // Extract all dishes and bundle with chef info
  const allDishesWithChef: DishWithChefDetails[] = chefs.flatMap(chef => 
    chef.dishes.map(dish => ({
      ...dish,
      chefName: chef.name,
      chefAvatar: chef.avatar,
      chefNationality: chef.nationality,
      chefRating: chef.rating,
      chefDistance: chef.distance,
      chefContinent: chef.continent
    }))
  );

  // Filter based on selected tab
  const displayedDishes = allDishesWithChef.filter(dish => 
    selectedProvenance === 'Tutti' || dish.chefContinent === selectedProvenance
  );

  // Count available dishes per provenance for badges
  const getCount = (prov: Continent | 'Tutti') => {
    if (prov === 'Tutti') return allDishesWithChef.length;
    return allDishesWithChef.filter(d => d.chefContinent === prov).length;
  };

  return (
    <div id="dish-catalog-provenance" className="my-14 animate-fade-in scroll-mt-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 px-1 gap-4">
        <div>
          <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.25em] block mb-2">Esplora Libero</span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tighter italic">
            Piatti del Mondo per Provenienza
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-1 max-w-xl">
            Scegli la provenienza culinaria che desideri e scopri i piatti tradizionali preparati oggi dai cuochi locali nel tuo quartiere.
          </p>
        </div>
      </div>

      {/* Provenance Pills / Tabs */}
      <div className="flex overflow-x-auto space-x-3 pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide mb-8">
        {provenances.map((prov) => {
          const isActive = selectedProvenance === prov.key;
          const dishCount = getCount(prov.key);
          
          if (dishCount === 0 && prov.key !== 'Tutti') return null; // Hide if empty

          return (
            <button
              key={prov.key}
              onClick={() => setSelectedProvenance(prov.key)}
              className={`relative flex items-center gap-3 px-5 sm:px-6 py-3.5 rounded-full text-xs font-black uppercase tracking-wider transition-all shadow-sm flex-shrink-0 border ${
                isActive
                  ? 'bg-black text-white border-black scale-105 shadow-xl font-bold'
                  : 'bg-white text-gray-700 border-gray-100 hover:border-orange-200'
              }`}
            >
              <span className="text-lg">{prov.icon}</span>
              <span>{prov.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                isActive ? 'bg-orange-600 text-black' : 'bg-gray-100 text-gray-500'
              }`}>
                {dishCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid of Dishes with Smooth Category Swap AnimatePresence */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10"
      >
        <AnimatePresence mode="popLayout">
          {displayedDishes.map((dish) => {
            const isFav = favorites.includes(dish.id);
            const associatedChef = chefs.find(c => c.id === dish.chefId);

            return (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                key={dish.id}
                className="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden flex flex-col justify-between hover:shadow-2xl transition-all duration-500 hover:border-orange-100 cursor-pointer relative"
                onClick={() => onAddDish(dish)}
              >
                {/* Image & Badges */}
                <div className="relative h-60 sm:h-64 overflow-hidden">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60"></div>
                  
                  {/* Floating Left: Price */}
                  <div className="absolute top-4 left-4 bg-black/85 backdrop-blur-md text-white text-[11px] font-black px-3.5 py-1.5 rounded-2xl uppercase tracking-widest shadow-xl flex items-center">
                    € {dish.price.toFixed(2)}
                  </div>

                  {/* Floating Middle Bottom: Origin Flag Badge */}
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm text-black text-[10px] font-black px-3 py-1.5 rounded-2xl uppercase tracking-wider shadow-md flex items-center gap-1.5 border border-white/20">
                    <span className="text-xl leading-none">{dish.chefNationality}</span>
                    <span className="text-gray-800 tracking-tight">{associatedChef?.countryName || dish.chefContinent}</span>
                  </div>

                  {/* Favorite Toggle button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(dish.id);
                    }}
                    className="absolute top-4 right-4 p-2.5 sm:p-3 bg-white/95 backdrop-blur rounded-2xl shadow-xl hover:bg-white transition-all transform hover:scale-110 active:scale-95 z-10 border border-gray-100"
                  >
                    <Heart className={`w-5 h-5 ${isFav ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                  </button>
                </div>

                {/* Card Content & Descriptions */}
                <div className="p-7 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Header line: Title */}
                    <h3 className="font-black italic text-gray-900 text-xl sm:text-2xl leading-tight mb-2 group-hover:text-orange-600 transition-colors">
                      {dish.name}
                    </h3>

                    {/* Short Description */}
                    <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-2 italic font-medium">
                      "{dish.description}"
                    </p>

                    {/* Tag list & Glovo-style delivery info */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      <span className="px-2.5 py-1 bg-orange-50 text-orange-800 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                        ⏱️ 25-35 min
                      </span>
                      <span className="px-2.5 py-1 bg-green-50 text-green-800 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                        🛵 €2.50
                      </span>
                      {dish.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Chef Info block and Booking button */}
                  <div className="space-y-4">
                    {associatedChef && (
                      <div 
                        onClick={(e) => {
                          if (onViewProfile) {
                            e.stopPropagation();
                            onViewProfile(associatedChef);
                          }
                        }}
                        className="flex items-center justify-between p-3.5 bg-gray-50/50 hover:bg-orange-50/50 rounded-2xl border border-gray-100 transition-colors group/chef cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={dish.chefAvatar} 
                            alt={dish.chefName}
                            className="w-8 h-8 rounded-xl object-cover border border-white shadow-sm"
                          />
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-0.5">Chef Locale</p>
                            <span className="text-xs font-bold text-gray-800 group-hover/chef:text-orange-600 transition-colors">{dish.chefName}</span>
                          </div>
                        </div>

                        {/* Chef stats */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-0.5 bg-yellow-400/10 text-yellow-700 px-2 py-0.5 rounded-lg text-[9px] font-black">
                            <Star className="w-2.5 h-2.5 fill-current" />
                            {dish.chefRating}
                          </div>
                          <div className="flex items-center gap-0.5 text-gray-400 text-[9px] font-bold">
                            <MapPin className="w-2.5 h-2.5 text-orange-600" />
                            {dish.chefDistance} km
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Book Now Button */}
                    <button className="w-full py-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest text-[10px] sm:text-xs flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 border-b-4 border-orange-850 hover:border-orange-950">
                      <ShoppingBag className="w-4 h-4" />
                      <span>Scegli e Prenota</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
