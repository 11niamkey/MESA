
import React from 'react';
import { Chef, Dish } from '../types';
import { ChefCard } from './ChefCard';
import { ArrowRight, Globe } from 'lucide-react';

interface ChefGroupSectionProps {
  title: string;
  chefs: Chef[];
  onAddDish: (dish: Dish) => void;
  onViewProfile: (chef: Chef) => void;
  favorites: string[];
  onToggleFavorite: (dishId: string) => void;
}

export const ChefGroupSection: React.FC<ChefGroupSectionProps> = ({ 
  title, chefs, onAddDish, onViewProfile, favorites, onToggleFavorite 
}) => {
  if (chefs.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between gap-3 mb-5 px-1">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-black rounded-xl flex items-center justify-center text-white shrink-0">
            <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-orange-600 tracking-tight whitespace-nowrap truncate">{title}</h2>
        </div>
        <button className="text-xs font-black text-orange-600 uppercase tracking-widest flex items-center gap-1.5 hover:translate-x-1 transition-transform shrink-0 whitespace-nowrap">
          Vedi tutti <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {chefs.slice(0, 4).map(chef => (
          <ChefCard 
            key={chef.id} 
            chef={chef} 
            onAddDish={onAddDish} 
            onViewProfile={onViewProfile} 
            favorites={favorites} 
            onToggleFavorite={onToggleFavorite} 
          />
        ))}
      </div>
    </div>
  );
};
