import React, { useMemo } from 'react';
import { Sparkles, Heart, Clock, Utensils, Leaf } from 'lucide-react';
import { Dish, Chef } from '../types';
import { AllergensRow } from './Allergens';

interface DailySpecialsProps {
  chefs: Chef[];
  onAddDish: (dish: Dish) => void;
  favorites: string[];
  onToggleFavorite: (dishId: string) => void;
}

const DEFAULT_FOOD_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';

const formatChefDisplayName = (name?: string) => {
  const trimmed = (name || 'MESA').trim();
  return /^chef\b/i.test(trimmed) ? trimmed : `Chef ${trimmed}`;
};

export const DailySpecials: React.FC<DailySpecialsProps> = ({ chefs, onAddDish, favorites, onToggleFavorite }) => {
  const specials = useMemo(() => {
    return chefs
      .flatMap(chef => {
        const chefDishes = chef.dishes.slice(0, 1).concat(chef.dishes.slice(4, 5));
        return chefDishes.map(dish => ({ ...dish, chefName: chef.name }));
      })
      .sort(() => 0.5 - Math.random())
      .slice(0, 6);
  }, [chefs]);

  return (
    <div className="mb-6 sm:mb-8 animate-fade-in">
      <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4 px-1">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="bg-orange-600 p-1.5 sm:p-2 rounded-xl shadow-md shadow-orange-200 shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-orange-600 tracking-tight whitespace-nowrap truncate">
            Piatti del Giorno
          </h2>
          <span className="hidden md:inline-block text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
            • Scelte fresche di oggi
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {specials.map((dish) => (
          <div
            key={dish.id}
            className="bg-white rounded-[2rem] shadow-lg border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300 cursor-pointer relative flex flex-col justify-between"
            onClick={() => onAddDish(dish)}
          >
            {/* Image Container */}
            <div className="relative h-44 overflow-hidden shrink-0">
              <img
                src={dish.image || DEFAULT_FOOD_IMAGE}
                alt={dish.name}
                onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_FOOD_IMAGE; }}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>

              <div className="absolute top-3 left-3 flex flex-col gap-1">
                <div className="bg-orange-600 text-white text-[9px] font-black px-2.5 py-1 rounded-xl uppercase tracking-widest shadow-xl flex items-center w-fit">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Speciale
                </div>
                <div className="bg-white/90 backdrop-blur-md text-black text-[8px] font-black px-2.5 py-0.5 rounded-xl uppercase tracking-widest shadow-lg flex items-center w-fit">
                  <Clock className="w-3 h-3 mr-1 text-orange-600" />
                  Solo oggi • 25-35m
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(dish.id);
                }}
                className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-2xl shadow-xl hover:bg-white transition-all transform hover:scale-110 active:scale-95 z-10 border border-gray-100"
              >
                <Heart className={`w-4 h-4 ${favorites.includes(dish.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
              </button>
            </div>

            {/* Content Section */}
            <div className="p-4 flex-1 flex flex-col justify-between gap-2.5">
              <div className="space-y-1.5">
                <div className="flex justify-between items-start gap-2.5">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-orange-600 text-[15px] leading-snug mb-0.5 group-hover:text-orange-700 transition-colors line-clamp-2 break-words">
                      {dish.name}
                    </h3>
                    <p className="text-[10px] font-black text-black uppercase tracking-widest truncate">
                      {formatChefDisplayName(dish.chefName)}
                    </p>
                  </div>
                  <div className="text-base font-black text-orange-600 bg-orange-50 px-2.5 py-1 rounded-xl shrink-0">
                    €{dish.price.toFixed(2)}
                  </div>
                </div>

                <p className="text-gray-800 text-xs leading-snug line-clamp-2 italic">
                  "{dish.description}"
                </p>

                <AllergensRow allergens={dish.allergens} />

                {/* Key Ingredients Pill */}
                {dish.ingredients && dish.ingredients.length > 0 && (
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-600 bg-gray-50 px-2.5 py-1 rounded-xl border border-gray-100 min-w-0">
                    <Leaf className="w-3.5 h-3.5 text-green-600 shrink-0" />
                    <span className="font-bold line-clamp-1">{dish.ingredients.join(', ')}</span>
                  </div>
                )}
              </div>

              <button className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest text-xs flex items-center justify-center space-x-2 transition-all shadow-lg active:scale-95 border-b-4 border-orange-850 hover:border-orange-950">
                <Utensils className="w-4 h-4" />
                <span>Prenota Ora</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};