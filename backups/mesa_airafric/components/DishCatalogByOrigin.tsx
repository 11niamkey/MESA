import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, MapPin, Star, Clock, ShoppingBag, Leaf, Flame, Info, ChevronDown, ChevronUp, Utensils, ShieldCheck, Soup } from 'lucide-react';
import { Chef, Dish, AfricanRegion } from '../types';

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
}

const DEFAULT_FOOD_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';

export const DishCatalogByOrigin: React.FC<DishCatalogByOriginProps> = ({
  chefs,
  onAddDish,
  favorites,
  onToggleFavorite,
  onViewProfile
}) => {
  const [selectedRegion, setSelectedRegion] = useState<AfricanRegion | 'Tutti'>('Tutti');
  const [expandedDishId, setExpandedDishId] = useState<string | null>(null);

  // List of African regions to display in AirAFRIC
  const regions: { key: AfricanRegion | 'Tutti'; label: string; icon: string; bg: string; subtitle: string }[] = [
    { key: 'Tutti', label: 'Tutta l\'Africa', icon: '🌍', bg: 'bg-amber-500', subtitle: 'Tutti i sapori' },
    { key: 'West Africa', label: 'West Africa', icon: '🇨🇮', bg: 'bg-orange-500', subtitle: 'Attiéké, Thieb, Jollof, Ndolé' },
    { key: 'East Africa', label: 'Corno & East Africa', icon: '🇪🇹', bg: 'bg-emerald-500', subtitle: 'Injera, Doro Wat, Pilau' },
    { key: 'Central & Southern Africa', label: 'Africa Centrale & Sud', icon: '🇨🇩', bg: 'bg-amber-600', subtitle: 'Moambé, Pondu, Makemba' },
    { key: 'North Africa & Maghreb', label: 'Nord Africa & Maghreb', icon: '🇲🇦', bg: 'bg-red-500', subtitle: 'Tajine, Couscous, Pastilla' },
    { key: 'Afro-Fusion & Grocery', label: 'Bevande & Dolci', icon: '🍹', bg: 'bg-purple-500', subtitle: 'Bissap, Zenzero, Puff Puff' }
  ];

  // Extract all dishes and bundle with chef info
  const allDishesWithChef: DishWithChefDetails[] = chefs.flatMap(chef => 
    chef.dishes.map(dish => ({
      ...dish,
      chefName: chef.name,
      chefAvatar: chef.avatar,
      chefNationality: chef.nationality,
      chefRating: chef.rating,
      chefDistance: chef.distance
    }))
  );

  // Filter based on selected tab
  const displayedDishes = allDishesWithChef.filter(dish => {
    if (selectedRegion === 'Tutti') return true;
    return dish.africanRegion === selectedRegion;
  });

  // Count available dishes per region for badges
  const getCount = (regionKey: AfricanRegion | 'Tutti') => {
    if (regionKey === 'Tutti') return allDishesWithChef.length;
    return allDishesWithChef.filter(d => d.africanRegion === regionKey).length;
  };

  return (
    <div id="dish-catalog-provenance" className="my-14 animate-fade-in scroll-mt-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 px-1 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-600/20 to-orange-600/20 text-amber-900 border border-amber-500/30 text-[10px] font-black uppercase tracking-widest mb-2">
            <span>✨</span> MESA AirAFRIC Culinaria
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tighter italic">
            Piatti Tradizionali per Regione Africana
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm mt-1 max-w-2xl font-medium">
            Esplora le grandi tradizioni gastronomiche del continente: cotture lente, marinate aromatiche e ricette di famiglia preparate dai migliori cuochi della tua città.
          </p>
        </div>
      </div>

      {/* Regional Pills / Tabs */}
      <div className="flex overflow-x-auto space-x-3 pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide mb-8">
        {regions.map((reg) => {
          const isActive = selectedRegion === reg.key;
          const dishCount = getCount(reg.key);
          
          if (dishCount === 0 && reg.key !== 'Tutti') return null;

          return (
            <button
              key={reg.key}
              onClick={() => setSelectedRegion(reg.key)}
              className={`relative flex items-center gap-3 px-5 sm:px-6 py-3.5 rounded-full text-xs font-black uppercase tracking-wider transition-all shadow-sm flex-shrink-0 border ${
                isActive
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white border-orange-600 scale-105 shadow-xl font-bold'
                  : 'bg-white text-gray-700 border-gray-100 hover:border-amber-200'
              }`}
            >
              <span className="text-lg">{reg.icon}</span>
              <span>{reg.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                isActive ? 'bg-black/30 text-white' : 'bg-amber-50 text-amber-800'
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
                className="group bg-white rounded-[2.5rem] border border-amber-100/60 overflow-hidden flex flex-col justify-between hover:shadow-2xl transition-all duration-500 hover:border-orange-200 cursor-pointer relative shadow-sm"
                onClick={() => onAddDish(dish)}
              >
                {/* Image & Badges */}
                <div className="relative h-60 sm:h-64 overflow-hidden bg-neutral-900">
                  <img
                    src={dish.image || DEFAULT_FOOD_IMAGE}
                    alt={dish.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_FOOD_IMAGE; }}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out opacity-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 opacity-70"></div>
                  
                  {/* Floating Left: Price */}
                  <div className="absolute top-4 left-4 bg-black/90 backdrop-blur-md text-amber-300 text-[11px] font-black px-3.5 py-1.5 rounded-2xl uppercase tracking-widest shadow-xl flex items-center border border-amber-500/30">
                    € {dish.price.toFixed(2)}
                  </div>

                  {/* Floating Top Left Badge: Slow Cook if applicable */}
                  {dish.isSlowCook && (
                    <div className="absolute top-12 left-4 bg-orange-950/90 text-orange-200 text-[9px] font-black px-2.5 py-1 rounded-xl uppercase tracking-wider shadow-md flex items-center gap-1 border border-orange-700/50 mt-1">
                      <Soup className="w-3 h-3 text-orange-400" />
                      <span>Slow Cook</span>
                    </div>
                  )}

                  {/* Floating Middle Bottom: Origin Flag Badge */}
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm text-black text-[10px] font-black px-3 py-1.5 rounded-2xl uppercase tracking-wider shadow-md flex items-center gap-1.5 border border-white/20">
                    <span className="text-xl leading-none">{dish.countryFlag || dish.chefNationality}</span>
                    <span className="text-gray-800 tracking-tight">{dish.countryOrigin || associatedChef?.countryName}</span>
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
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Header line: Title & Quick Details Toggle */}
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className="font-black italic text-gray-900 text-lg sm:text-xl leading-tight group-hover:text-orange-600 transition-colors">
                        {dish.name}
                      </h3>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedDishId(prev => prev === dish.id ? null : dish.id);
                        }}
                        className="p-1.5 bg-gray-50 hover:bg-amber-50 text-gray-400 hover:text-orange-600 rounded-full transition-colors shrink-0"
                        title="Dettagli, Accompagnamenti e Ingredienti"
                      >
                        {expandedDishId === dish.id ? <ChevronUp className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Short Description */}
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-3 line-clamp-2 italic font-medium">
                      "{dish.description}"
                    </p>

                    {/* Collapsible Info / Ingredients Box */}
                    {expandedDishId === dish.id && (
                      <div className="mb-4 p-3.5 bg-amber-50/80 border border-amber-200/70 rounded-2xl space-y-2 text-xs animate-fade-in" onClick={(e) => e.stopPropagation()}>
                        {dish.ingredients && dish.ingredients.length > 0 && (
                          <div>
                            <span className="font-black text-amber-950 uppercase tracking-wider text-[9px] flex items-center gap-1 mb-0.5">
                              <Leaf className="w-3 h-3 text-green-600" /> Ingredienti Selezionati:
                            </span>
                            <p className="text-gray-800 font-medium">{dish.ingredients.join(', ')}</p>
                          </div>
                        )}
                        {dish.accompanimentOptions && dish.accompanimentOptions.length > 0 && (
                          <div className="pt-1.5 border-t border-amber-200/60">
                            <span className="font-black text-amber-950 uppercase tracking-wider text-[9px] flex items-center gap-1 mb-0.5">
                              <Utensils className="w-3 h-3 text-orange-600" /> Accompagnamenti Tradizionali a Scelta:
                            </span>
                            <p className="text-gray-700 italic">{dish.accompanimentOptions.join(' • ')}</p>
                          </div>
                        )}
                        {dish.preparation && (
                          <div className="pt-1.5 border-t border-amber-200/60">
                            <span className="font-black text-amber-950 uppercase tracking-wider text-[9px] flex items-center gap-1 mb-0.5">
                              <Utensils className="w-3 h-3 text-amber-700" /> Note dello Chef:
                            </span>
                            <p className="text-gray-700 italic">{dish.preparation}</p>
                          </div>
                        )}
                        <div className="pt-1.5 border-t border-amber-200/60 flex items-center justify-between text-[10px] text-gray-700 font-bold">
                          <span>Porzione: {dish.servingPortion || '1 Persona Generosa'}</span>
                          <span className="text-emerald-700 font-black flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Cucina Certificata
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Tag list & Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      <span className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200/60 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" /> 30-45 min
                      </span>
                      {dish.dietary?.map(d => (
                        <span key={d} className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200/60 rounded-xl text-[9px] font-black uppercase tracking-wider">
                          {d === 'Gluten Free' ? '🌾 Senza Glutine' : d}
                        </span>
                      ))}
                      {dish.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-500">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Chef Info block and Booking button */}
                  <div className="space-y-3.5">
                    {associatedChef && (
                      <div 
                        onClick={(e) => {
                          if (onViewProfile) {
                            e.stopPropagation();
                            onViewProfile(associatedChef);
                          }
                        }}
                        className="flex items-center justify-between p-3 bg-gray-50/80 hover:bg-amber-50/60 rounded-2xl border border-gray-100 transition-colors group/chef cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={dish.chefAvatar} 
                            alt={dish.chefName}
                            className="w-8 h-8 rounded-xl object-cover border border-white shadow-sm shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-0.5">Chef Tradizionale</p>
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
                    <button className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:to-orange-500 text-white font-black uppercase tracking-widest text-[10px] sm:text-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 border-b-4 border-orange-900">
                      <ShoppingBag className="w-4 h-4" />
                      <span>Ordina / Personalizza Piatto</span>
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

