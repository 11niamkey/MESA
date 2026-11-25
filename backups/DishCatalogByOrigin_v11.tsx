import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, MapPin, Star, Clock, ShoppingBag, Leaf, Flame, Info, ChevronDown, ChevronUp, Utensils } from 'lucide-react';
import { Chef, Dish, Continent } from '../types';
import { CountryFlag } from './CountryFlag';
import { AllergensRow } from './Allergens';

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

const DEFAULT_FOOD_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';

export const DishCatalogByOrigin: React.FC<DishCatalogByOriginProps> = ({
  chefs,
  onAddDish,
  favorites,
  onToggleFavorite,
  onViewProfile
}) => {
  const [expandedDishId, setExpandedDishId] = useState<string | null>(null);

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

  return (
    <div id="dish-catalog-provenance" className="my-6 sm:my-8 animate-fade-in scroll-mt-24">
      {/* Compact Single-Line Header */}
      <div className="flex items-center justify-between gap-3 mb-4 sm:mb-5 px-1">
        <h2 className="text-[17px] sm:text-2xl font-black text-orange-600 tracking-tight italic whitespace-nowrap truncate min-w-0">
          Piatti del Mondo per Provenienza
        </h2>
        <span className="hidden sm:inline-flex text-[10px] font-black text-orange-600 uppercase tracking-[0.2em] shrink-0">
          Esplora
        </span>
      </div>

      {/* Grid of Dishes with Smooth Category Swap AnimatePresence */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
      >
        <AnimatePresence mode="popLayout">
          {allDishesWithChef.map((dish) => {
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
                className="group bg-white rounded-[2rem] border border-gray-100 overflow-hidden flex flex-col justify-between hover:shadow-2xl transition-all duration-300 hover:border-orange-100 cursor-pointer relative shadow-sm"
                onClick={() => onAddDish(dish)}
              >
                {/* Image & Badges */}
                <div className="relative h-44 overflow-hidden shrink-0">
                  <img
                    src={dish.image || DEFAULT_FOOD_IMAGE}
                    alt={dish.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_FOOD_IMAGE; }}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60"></div>
                  
                  {/* Floating Left: Price */}
                  <div className="absolute top-3 left-3 bg-black/85 backdrop-blur-md text-white text-[11px] font-black px-3 py-1 rounded-xl uppercase tracking-widest shadow-xl flex items-center">
                    € {dish.price.toFixed(2)}
                  </div>

                  {/* Floating Middle Bottom: Origin Flag Badge */}
                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm text-black text-[10px] font-black px-2.5 py-1 rounded-xl uppercase tracking-wider shadow-md flex items-center gap-1.5 border border-white/20">
                    <CountryFlag flag={dish.chefNationality} title={associatedChef?.countryName || dish.chefContinent} size="sm" />
                    <span className="text-black tracking-tight">{associatedChef?.countryName || dish.chefContinent}</span>
                  </div>

                  {/* Favorite Toggle button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(dish.id);
                    }}
                    className="absolute top-3 right-3 p-2 bg-white/95 backdrop-blur rounded-2xl shadow-xl hover:bg-white transition-all transform hover:scale-110 active:scale-95 z-10 border border-gray-100"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                  </button>
                </div>

                {/* Card Content & Descriptions */}
                <div className="p-4 flex-1 flex flex-col justify-between gap-2.5">
                  <div className="space-y-2">
                    {/* Header line: Title & Quick Details Toggle */}
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-black italic text-orange-600 text-[15px] leading-snug group-hover:text-orange-700 transition-colors line-clamp-2 min-w-0">
                        {dish.name}
                      </h3>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedDishId(prev => prev === dish.id ? null : dish.id);
                        }}
                        className="p-1.5 bg-gray-50 hover:bg-orange-50 text-gray-400 hover:text-orange-600 rounded-full transition-colors shrink-0"
                        title="Dettagli e Ingredienti"
                      >
                        {expandedDishId === dish.id ? <ChevronUp className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Short Description */}
                    <p className="text-black text-xs leading-snug line-clamp-2 italic font-medium">
                      "{dish.description}"
                    </p>

                    <AllergensRow allergens={dish.allergens} />

                    {/* Collapsible Info / Ingredients Box */}
                    {expandedDishId === dish.id && (
                      <div className="p-3 bg-orange-50/70 border border-orange-100 rounded-2xl space-y-2 text-xs animate-fade-in" onClick={(e) => e.stopPropagation()}>
                        {dish.ingredients && dish.ingredients.length > 0 && (
                          <div>
                            <span className="font-black text-orange-700 uppercase tracking-wider text-[9px] flex items-center gap-1 mb-0.5">
                              <Leaf className="w-3 h-3 text-green-600" /> Ingredienti:
                            </span>
                            <p className="text-black font-medium">{dish.ingredients.join(', ')}</p>
                          </div>
                        )}
                        {dish.preparation && (
                          <div className="pt-1.5 border-t border-orange-200/50">
                            <span className="font-black text-orange-700 uppercase tracking-wider text-[9px] flex items-center gap-1 mb-0.5">
                              <Utensils className="w-3 h-3 text-orange-600" /> Note dello Chef:
                            </span>
                            <p className="text-black italic">{dish.preparation}</p>
                          </div>
                        )}
                        <div className="pt-1.5 border-t border-orange-200/50 flex items-center justify-between gap-2 text-[10px] text-black font-bold">
                          <span>Porzione: ~350g</span>
                          <span className="text-orange-700 font-black truncate">
                            {dish.allergens && dish.allergens.length > 0
                              ? `Allergeni: ${dish.allergens.join(', ')}`
                              : 'Nessun allergene principale'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Tag list & Glovo-style delivery info */}
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 bg-orange-50 text-orange-800 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                        <Clock className="w-3 h-3 text-orange-600" /> 25-35 min
                      </span>
                      <span className="px-2 py-0.5 bg-green-50 text-green-800 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                        🛵 €2.50
                      </span>
                      {dish.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-500">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Chef Info block and Booking button */}
                  <div className="space-y-2.5">
                    {associatedChef && (
                      <div 
                        onClick={(e) => {
                          if (onViewProfile) {
                            e.stopPropagation();
                            onViewProfile(associatedChef);
                          }
                        }}
                        className="flex items-center justify-between p-2.5 bg-gray-50/80 hover:bg-orange-50/60 rounded-2xl border border-gray-100 transition-colors group/chef cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img 
                            src={dish.chefAvatar} 
                            alt={dish.chefName}
                            className="w-7 h-7 rounded-xl object-cover border border-white shadow-sm shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-0.5">Chef Locale</p>
                            <span className="text-xs font-bold text-gray-800 group-hover/chef:text-orange-600 transition-colors truncate block">{dish.chefName}</span>
                          </div>
                        </div>

                        {/* Chef stats */}
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center gap-0.5 bg-amber-400/15 text-amber-800 px-2 py-0.5 rounded-lg text-[9px] font-black">
                            <Star className="w-2.5 h-2.5 fill-current text-amber-500" />
                            {dish.chefRating}
                          </div>
                          <div className="flex items-center gap-0.5 text-gray-500 text-[9px] font-bold">
                            <MapPin className="w-2.5 h-2.5 text-orange-600" />
                            {dish.chefDistance} km
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Book Now Button */}
                    <button className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 border-b-4 border-orange-850 hover:border-orange-950">
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
