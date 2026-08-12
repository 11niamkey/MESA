import React from 'react';
import { Star, MapPin, ChevronRight, Heart } from 'lucide-react';
import { Chef, Dish } from '../types';

interface ChefCardProps {
  chef: Chef;
  onAddDish: (dish: Dish) => void;
  onViewProfile: (chef: Chef) => void;
  favorites: string[];
  onToggleFavorite: (dishId: string) => void;
}

export const ChefCard: React.FC<ChefCardProps> = ({ chef, onAddDish, onViewProfile, favorites, onToggleFavorite }) => {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-orange-100 overflow-hidden mb-10 transition-all hover:shadow-xl">
      {/* Chef Header - Minimal on mobile, expanded on desktop */}
      <div className="p-5 sm:p-7 border-b border-orange-50 bg-gradient-to-r from-orange-50/30 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 cursor-pointer" onClick={() => onViewProfile(chef)}>
            <div className="relative">
              <img 
                src={chef.avatar} 
                alt={chef.name} 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 text-2xl bg-white rounded-full p-0.5 shadow-sm group-hover:scale-110 transition-transform" role="img" aria-label="nationality" title={chef.countryName}>
                {chef.nationality}
              </span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5">
                <h3 className="text-lg sm:text-xl font-black text-gray-900 leading-none hover:text-orange-600 transition-colors">{chef.name}</h3>
                {chef.countryName && <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md font-bold tracking-widest uppercase">{chef.countryName}</span>}
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
      <div className="p-5 sm:p-7 bg-white">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Specialità in evidenza</h4>
          <span className="h-px flex-1 bg-gray-100 ml-4"></span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {chef.dishes.slice(0, 2).map((dish) => (
            <div key={dish.id} className="group flex flex-col h-full bg-white rounded-3xl border border-gray-100 overflow-hidden hover:border-orange-300 transition-all shadow-sm hover:shadow-lg relative">
              <div 
                className="relative h-48 sm:h-64 md:h-72 overflow-hidden cursor-pointer"
                onClick={() => onAddDish(dish)}
              >
                <img 
                  src={dish.image} 
                  alt={dish.name} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(dish.id);
                  }}
                  className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur rounded-2xl shadow-xl hover:bg-white transition-all transform hover:scale-110 active:scale-95 z-10"
                >
                  <Heart className={`w-5 h-5 ${favorites.includes(dish.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                </button>
                <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md px-4 py-2 rounded-2xl text-lg font-black text-white shadow-2xl">
                  € {dish.price.toFixed(2)}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h5 
                  className="text-xl font-black text-gray-900 mb-2 cursor-pointer hover:text-orange-600 transition-colors leading-tight"
                  onClick={() => onAddDish(dish)}
                >
                  {dish.name}
                </h5>
                <p className="text-sm text-gray-500 line-clamp-2 mb-6 flex-grow leading-relaxed">{dish.description}</p>
                <button 
                  onClick={() => onAddDish(dish)}
                  className="w-full py-4 bg-orange-600 hover:bg-black text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-orange-200 transition-all transform active:scale-95"
                >
                  Aggiungi al carrello
                </button>
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
