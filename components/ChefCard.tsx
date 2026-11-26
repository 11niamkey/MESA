import React from 'react';
import { Star, MapPin, ChevronRight, Heart, Clock, ShoppingBag } from 'lucide-react';
import { Chef, Dish } from '../types';
import { CountryFlag } from './CountryFlag';
import { AllergensRow } from './Allergens';
import { isChefBookable } from '../utils/chefUtils';

interface ChefCardProps {
  chef: Chef;
  onAddDish: (dish: Dish) => void;
  onViewProfile: (chef: Chef) => void;
  favorites: string[];
  onToggleFavorite: (dishId: string) => void;
}

const DEFAULT_FOOD_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80';

export const ChefCard: React.FC<ChefCardProps> = ({ chef, onAddDish, onViewProfile, favorites, onToggleFavorite }) => {
  const canBook = isChefBookable(chef);

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-orange-100 overflow-hidden transition-all hover:shadow-xl flex flex-col h-full">
      {/* Chef Header - Minimal on mobile, expanded on desktop */}
      <div className="p-5 sm:p-7 border-b border-orange-50 bg-gradient-to-r from-orange-50/30 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 cursor-pointer" onClick={() => onViewProfile(chef)}>
            <div className="relative">
              <img 
                src={chef.avatar || DEFAULT_AVATAR} 
                alt={chef.name} 
                onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_AVATAR; }}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md border border-gray-100 flex items-center justify-center">
                <CountryFlag flag={chef.nationality} title={chef.countryName} size="sm" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 min-w-0">
                <h3 className="text-base sm:text-lg font-black text-orange-600 leading-none hover:text-orange-700 transition-colors whitespace-nowrap truncate">{chef.name}</h3>
                {chef.countryName && <span className="text-[9px] bg-gray-100 text-black px-1.5 py-0.5 rounded-md font-bold tracking-widest uppercase shrink-0">{chef.countryName}</span>}
              </div>
              <div className="flex items-center text-xs font-bold text-gray-500 uppercase tracking-wide">
                <MapPin className="w-3 h-3 mr-1 text-orange-500" />
                {chef.location} • {chef.distance} km
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <div className="flex items-center bg-yellow-400 text-black px-2 py-0.5 rounded-lg text-[10px] font-black">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  {chef.rating}
                </div>
                <div className="flex items-center bg-orange-100 text-orange-800 px-2 py-0.5 rounded-lg text-[10px] font-bold">
                  ⏱️ 25-35 min
                </div>
                <div className="flex items-center bg-green-100 text-green-800 px-2 py-0.5 rounded-lg text-[10px] font-bold">
                  🛵 Consegna €2.50
                </div>
                <span className="text-[10px] text-gray-400 font-bold uppercase">{chef.reviews.length} recensioni</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => onViewProfile(chef)}
            className="bg-orange-100 p-3 rounded-2xl text-orange-600 hover:bg-orange-600 hover:text-white transition-all transform active:scale-90"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Enlarged Featured Dishes List */}
      <div className="p-4 sm:p-6 bg-white flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Specialità in evidenza</h4>
          <span className="h-px flex-1 bg-gray-100 ml-4"></span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 flex-1">
          {chef.dishes.slice(0, 2).map((dish) => (
            <div key={dish.id} className="group flex flex-col h-full bg-white rounded-3xl border border-gray-100 overflow-hidden hover:border-orange-300 transition-all shadow-sm hover:shadow-lg relative">
              <div 
                className="relative aspect-[16/10] w-full overflow-hidden shrink-0 cursor-pointer"
                onClick={() => onAddDish(dish)}
              >
                <img 
                  src={dish.image || DEFAULT_FOOD_IMAGE} 
                  alt={dish.name} 
                  onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_FOOD_IMAGE; }}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(dish.id);
                  }}
                  className="absolute top-2.5 right-2.5 p-2 bg-white/90 backdrop-blur rounded-2xl shadow-xl hover:bg-white transition-all transform hover:scale-110 active:scale-95 z-10"
                >
                  <Heart className={`w-4 h-4 shrink-0 ${favorites.includes(dish.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                </button>
                <div className="absolute bottom-2.5 left-2.5 bg-black/80 backdrop-blur-md px-3 py-1 rounded-xl text-xs sm:text-sm font-black text-white shadow-2xl">
                  € {dish.price.toFixed(2)}
                </div>
              </div>
              <div className="p-3.5 sm:p-4 flex flex-col flex-grow justify-between gap-2.5">
                <div className="space-y-1.5">
                  <h5 
                    className="text-sm sm:text-base font-black text-orange-600 leading-snug line-clamp-2 cursor-pointer hover:text-orange-700 transition-colors"
                    onClick={() => onAddDish(dish)}
                  >
                    {dish.name}
                  </h5>
                  <p className="text-xs text-black line-clamp-2 leading-snug">{dish.description}</p>
                  <AllergensRow allergens={dish.allergens} />
                </div>
                {canBook ? (
                  <button 
                    onClick={() => onAddDish(dish)}
                    className="w-full py-2.5 bg-orange-600 hover:bg-black text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-orange-200 transition-all transform active:scale-95"
                  >
                    Aggiungi al carrello
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className="inline-flex items-center justify-center gap-1.5 w-full px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-black uppercase tracking-widest">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>Disponibile a breve</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onAddDish(dish)}
                      className="w-full py-2.5 sm:py-3.5 bg-black hover:bg-orange-600 text-white text-xs sm:text-sm font-black uppercase tracking-widest rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                    >
                      <ShoppingBag className="w-4 h-4 shrink-0" />
                      <span>Aggiungi al carrello</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {chef.dishes.length > 2 && (
          <button 
             onClick={() => onViewProfile(chef)}
             className="w-full mt-8 py-4 text-center text-xs font-black uppercase tracking-widest text-orange-600 hover:bg-orange-50 rounded-2xl border-2 border-dashed border-orange-100 transition-all"
          >
            Vedi tutti i {chef.dishes.length} piatti di {chef.name}
          </button>
        )}
      </div>
    </div>
  );
};