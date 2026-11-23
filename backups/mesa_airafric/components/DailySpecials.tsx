import React from 'react';
import { Sparkles, Heart, Clock, Utensils, Leaf } from 'lucide-react';
import { Dish, Chef } from '../types';

interface DailySpecialsProps {
  chefs: Chef[];
  onAddDish: (dish: Dish) => void;
  favorites: string[];
  onToggleFavorite: (dishId: string) => void;
}

const DEFAULT_FOOD_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';

export const DailySpecials: React.FC<DailySpecialsProps> = ({ chefs, onAddDish, favorites, onToggleFavorite }) => {
  const specials = chefs.flatMap(chef => {
      const chefDishes = chef.dishes.slice(0, 1).concat(chef.dishes.slice(4, 5));
      return chefDishes.map(dish => ({ ...dish, chefName: chef.name }));
  }).sort(() => 0.5 - Math.random()).slice(0, 6);

  return (
    <div className="mb-14 animate-fade-in">
      <div className="flex items-center justify-between mb-8 px-1">
        <div className="flex items-center space-x-3">
          <div className="bg-orange-600 p-2.5 rounded-2xl shadow-md shadow-orange-200">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tighter">Piatti del Giorno</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Le scelte fresche degli chef per oggi</p>
          </div>
        </div>
      </div>
      
      <div className="flex overflow-x-auto space-x-6 sm:space-x-8 pb-10 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        {specials.map((dish) => (
          <div 
            key={dish.id} 
            className="flex-none w-[280px] sm:w-[380px] md:w-[440px] bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-500 cursor-pointer relative flex flex-col justify-between"
            onClick={() => onAddDish(dish)}
          >
            {/* Image Container */}
            <div className="relative h-48 sm:h-64 md:h-[280px] overflow-hidden">
              <img 
                src={dish.image || DEFAULT_FOOD_IMAGE} 
                alt={dish.name} 
                onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_FOOD_IMAGE; }}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
              
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                <div className="bg-orange-600 text-white text-[9px] font-black px-3 py-1 rounded-xl uppercase tracking-widest shadow-xl flex items-center">
                  <Sparkles className="w-3 h-3 mr-1.5" />
                  Speciale
                </div>
                <div className="bg-white/90 backdrop-blur-md text-black text-[8px] font-black px-2.5 py-1 rounded-xl uppercase tracking-widest shadow-lg flex items-center w-fit">
                  <Clock className="w-3 h-3 mr-1.5 text-orange-600" />
                  Solo oggi • 25-35m
                </div>
              </div>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(dish.id);
                }}
                className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur rounded-2xl shadow-xl hover:bg-white transition-all transform hover:scale-110 active:scale-95 z-10 border border-gray-100"
              >
                <Heart className={`w-4 h-4 ${favorites.includes(dish.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
              </button>
            </div>

            {/* Content Section */}
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 pr-2">
                    <h3 className="font-black text-gray-900 text-lg sm:text-xl leading-tight mb-1 group-hover:text-orange-600 transition-colors">{dish.name}</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Chef <span className="text-gray-900">{dish.chefName}</span>
                    </p>
                  </div>
                  <div className="text-lg sm:text-2xl font-black text-orange-600 bg-orange-50 px-3 py-1 rounded-xl shrink-0">
                    €{dish.price.toFixed(2)}
                  </div>
                </div>
                
                <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2 italic">
                  "{dish.description}"
                </p>

                {/* Key Ingredients Pill */}
                {dish.ingredients && dish.ingredients.length > 0 && (
                  <div className="mb-4 flex items-center gap-1.5 text-[10px] text-gray-600 bg-gray-50 p-2 rounded-xl border border-gray-100">
                    <Leaf className="w-3.5 h-3.5 text-green-600 shrink-0" />
                    <span className="font-bold truncate">{dish.ingredients.join(', ')}</span>
                  </div>
                )}
              </div>

              <button className="w-full py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest text-xs flex items-center justify-center space-x-2 transition-all shadow-lg active:scale-95 border-b-4 border-orange-850 hover:border-orange-950">
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