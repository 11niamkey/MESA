import React, { useMemo } from 'react';
import { Heart, ShoppingBag, ArrowRight, Clock } from 'lucide-react';
import { Chef, Dish } from '../types';
import { CountryFlag } from './CountryFlag';
import { AllergensRow } from './Allergens';
import { isChefBookable } from '../utils/chefUtils';

interface FavoritesSectionProps {
  favorites: string[];
  chefs: Chef[];
  onAddDish: (dish: Dish) => void;
  onToggleFavorite: (dishId: string) => void;
}

const DEFAULT_FOOD_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';

export const FavoritesSection: React.FC<FavoritesSectionProps> = ({ 
  favorites, 
  chefs, 
  onAddDish,
  onToggleFavorite 
}) => {
  
  const favoriteDishes = useMemo(() => {
    const allDishes = chefs.flatMap(chef => {
      const canBook = isChefBookable(chef);
      return chef.dishes.map(dish => ({ ...dish, chefName: chef.name, chefNationality: chef.nationality, canBook }));
    });
    return allDishes.filter(dish => favorites.includes(dish.id));
  }, [favorites, chefs]);

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center animate-fade-in">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Heart className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ancora nulla nei preferiti</h2>
        <p className="text-gray-500 max-w-md mb-8">
          Salva i piatti che ami per ritrovarli subito.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in px-2">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2.5 bg-red-100 rounded-xl shrink-0">
          <Heart className="w-5 h-5 text-red-600 fill-current" />
        </div>
        <h2 className="text-lg sm:text-2xl font-black text-orange-600 tracking-tight whitespace-nowrap truncate">Salvati per dopo</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {favoriteDishes.map((dish) => (
          <div key={dish.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col h-full">
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
                className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-2xl shadow-lg z-10 hover:bg-white transition-all"
              >
                <Heart className="w-4 h-4 text-red-500 fill-current shrink-0" />
              </button>
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-black text-gray-900 shadow-xl flex items-center gap-1.5 border border-white">
                 <CountryFlag flag={dish.chefNationality} size="sm" />
                 <span>{dish.chefName}</span>
              </div>
            </div>
            
            <div className="p-4 flex flex-col flex-1 justify-between gap-2.5">
              <div>
                <div className="flex justify-between items-start gap-2 mb-1.5">
                  <h3 
                    className="text-[15px] font-black text-orange-600 leading-snug line-clamp-2 cursor-pointer hover:text-orange-700 transition-colors"
                    onClick={() => onAddDish(dish)}
                  >
                    {dish.name}
                  </h3>
                  <span className="text-base font-black text-orange-600 shrink-0">€{dish.price.toFixed(2)}</span>
                </div>
                
                <p className="text-xs text-black line-clamp-2 mb-2 leading-snug">
                  {dish.description}
                </p>

                <AllergensRow allergens={dish.allergens} />
              </div>

              {dish.canBook ? (
                <button 
                  onClick={() => onAddDish(dish)}
                  className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest text-xs rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg active:scale-95 border-b-4 border-orange-850 hover:border-orange-950"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Prenota ora</span>
                </button>
              ) : (
                <div className="space-y-1.5">
                  <div className="w-full py-1 px-2.5 bg-amber-50 text-amber-800 border border-amber-200 font-black uppercase tracking-widest text-[10px] rounded-lg flex items-center justify-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span>Disponibile a breve</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onAddDish(dish)}
                    className="w-full py-2.5 bg-black hover:bg-orange-600 text-white font-black uppercase tracking-widest text-xs rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md active:scale-95"
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
    </div>
  );
};