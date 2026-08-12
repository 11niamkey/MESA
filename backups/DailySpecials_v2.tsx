import React from 'react';
import { Sparkles, Heart, Clock } from 'lucide-react';
import { Dish, Chef } from '../types';

interface DailySpecialsProps {
  chefs: Chef[];
  onAddDish: (dish: Dish) => void;
  favorites: string[];
  onToggleFavorite: (dishId: string) => void;
}

export const DailySpecials: React.FC<DailySpecialsProps> = ({ chefs, onAddDish, favorites, onToggleFavorite }) => {
  const specials = chefs.flatMap(chef => {
      const chefDishes = chef.dishes.slice(0, 1).concat(chef.dishes.slice(4, 5));
      return chefDishes.map(dish => ({ ...dish, chefName: chef.name }));
  }).sort(() => 0.5 - Math.random()).slice(0, 6);

  return (
    <div className="mb-14 animate-fade-in">
      <div className="flex items-center justify-between mb-8 px-1">
        <div className="flex items-center space-x-3">
          <div className="bg-orange-600 p-2 rounded-xl shadow-lg shadow-orange-200">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Piatti del Giorno</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Le scelte degli chef per oggi</p>
          </div>
        </div>
      </div>
      
      <div className="flex overflow-x-auto space-x-6 sm:space-x-8 pb-10 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        {specials.map((dish) => (
          <div 
            key={dish.id} 
            className="flex-none w-[280px] sm:w-[420px] md:w-[500px] bg-white rounded-[2.5rem] sm:rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-500 cursor-pointer relative"
            onClick={() => onAddDish(dish)}
          >
            {/* Massive Image Container */}
            <div className="relative h-52 sm:h-80 md:h-[380px] overflow-hidden">
              <img 
                src={dish.image} 
                alt={dish.name} 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
              
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-col gap-1.5 sm:gap-2">
                <div className="bg-orange-600 text-white text-[9px] sm:text-[11px] font-black px-3 py-1 sm:px-4 sm:py-1.5 rounded-2xl uppercase tracking-widest shadow-xl flex items-center">
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1.5 sm:mr-2" />
                  Speciale
                </div>
                <div className="bg-white/90 backdrop-blur-md text-black text-[8px] sm:text-[10px] font-black px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-2xl uppercase tracking-widest shadow-lg flex items-center w-fit">
                  <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1.5 sm:mr-2 text-orange-600" />
                  Solo oggi
                </div>
              </div>

              <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(dish.id);
                  }}
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 sm:p-3 bg-white/90 backdrop-blur rounded-[1rem] sm:rounded-[1.2rem] shadow-xl hover:bg-white transition-all transform hover:scale-110 active:scale-95 z-10"
                >
                  <Heart className={`w-5 h-5 sm:w-6 sm:h-6 ${favorites.includes(dish.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                </button>
            </div>

            {/* Content Section */}
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <div className="flex-1">
                  <h3 className="font-black text-gray-900 text-xl sm:text-2xl md:text-3xl leading-tight mb-1 sm:mb-2 group-hover:text-orange-600 transition-colors">{dish.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] sm:text-sm font-black text-gray-400 uppercase tracking-widest">Preparato da <span className="text-black">Chef {dish.chefName}</span></span>
                  </div>
                </div>
                <div className="text-xl sm:text-3xl font-black text-orange-600 bg-orange-50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl">
                  €{dish.price.toFixed(2)}
                </div>
              </div>
              
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8 line-clamp-2">
                {dish.description}
              </p>

              <button className="w-full py-4 sm:py-5 rounded-[1.5rem] sm:rounded-[2rem] bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest text-[11px] sm:text-sm flex items-center justify-center space-x-2 sm:space-x-3 transition-all shadow-xl active:scale-95 shadow-orange-950/15 border-b-4 border-orange-850 hover:border-orange-950">
                <span>Prenota ora</span>
                <span className="text-sm sm:text-xl">→</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
