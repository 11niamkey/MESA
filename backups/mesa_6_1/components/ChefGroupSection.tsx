
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
    <div className="mb-16">
      <div className="flex items-center justify-between mb-8 px-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center text-white">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">{title}</h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Eccellenze del continente</p>
          </div>
        </div>
        <button className="text-xs font-black text-orange-600 uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform">
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
