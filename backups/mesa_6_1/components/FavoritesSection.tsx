import React, { useMemo } from 'react';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { Chef, Dish } from '../types';

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
    const allDishes = chefs.flatMap(chef => 
      chef.dishes.map(dish => ({ ...dish, chefName: chef.name, chefNationality: chef.nationality }))
    );
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
      <div className="flex items-center space-x-3 mb-10">
        <div className="p-3 bg-red-100 rounded-2xl">
          <Heart className="w-6 h-6 text-red-600 fill-current" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Salvati per dopo</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {favoriteDishes.map((dish) => (
          <div key={dish.id} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div 
              className="relative h-64 sm:h-72 overflow-hidden cursor-pointer"
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
                className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur rounded-2xl shadow-lg z-10 hover:bg-white transition-all"
              >
                <Heart className="w-5 h-5 text-red-500 fill-current" />
              </button>
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-2xl text-xs font-black text-gray-900 shadow-xl flex items-center border border-white">
                 <span className="mr-2 text-xl">{dish.chefNationality}</span>
                 {dish.chefName}
              </div>
            </div>
            
            <div className="p-7 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <h3 
                  className="text-xl font-black text-gray-900 leading-tight cursor-pointer hover:text-orange-600 transition-colors"
                  onClick={() => onAddDish(dish)}
                >
                  {dish.name}
                </h3>
                <span className="text-xl font-black text-orange-600 ml-4">€{dish.price.toFixed(2)}</span>
              </div>
              
              <p className="text-sm text-gray-500 line-clamp-2 mb-6 flex-grow leading-relaxed">
                {dish.description}
              </p>

              <button 
                onClick={() => onAddDish(dish)}
                className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest rounded-2xl flex items-center justify-center space-x-3 transition-all shadow-lg active:scale-95 border-b-4 border-orange-850 hover:border-orange-950"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Prenota ora</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};