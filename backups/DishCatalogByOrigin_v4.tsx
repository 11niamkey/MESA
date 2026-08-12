import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, MapPin, Star, Clock, ShoppingBag } from 'lucide-react';
import { Chef, Dish, Continent } from '../types';

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
  chefContinent: Continent;
}

const DEFAULT_FOOD_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';

export const DishCatalogByOrigin: React.FC<DishCatalogByOriginProps> = ({
  chefs,
  onAddDish,
  favorites,
  onToggleFavorite,
  onViewProfile
}) => {
  const [selectedProvenance, setSelectedProvenance] = useState<Continent | 'Tutti'>('Tutti');

  const provenances: { key: Continent | 'Tutti'; label: string; icon: string; bg: string; text: string }[] = [
    { key: 'Tutti', label: 'Tutti i Sapori', icon: '🌟', bg: 'bg-orange-500', text: 'text-orange-900' },
    { key: 'Europa', label: 'Europa', icon: '🇪🇺', bg: 'bg-blue-500', text: 'text-blue-900' },
    { key: 'Africa', label: 'Sapori d\'Africa', icon: '🇲🇦', bg: 'bg-amber-500', text: 'text-amber-900' },
    { key: 'Asia', label: 'Tradizioni Asiatiche', icon: '🇨🇳', bg: 'bg-red-500', text: 'text-red-900' },
    { key: 'Americhe', label: 'Dalle Americhe', icon: '🇲🇽', bg: 'bg-emerald-500', text: 'text-emerald-950' }
  ];

  const allDishesWithChef: DishWithChefDetails[] = chefs.flatMap(chef => 
    chef.dishes.map(dish => ({
      ...dish,
      chefName: chef.name,
      chefAvatar: chef.avatar,
      chefNationality: chef.nationality,
      chefRating: chef.rating,
      chefDistance: chef.distance,
      chefContinent: chef.continent
    }))
  );

  const displayedDishes = allDishesWithChef.filter(dish => 
    selectedProvenance === 'Tutti' || dish.chefContinent === selectedProvenance
  );

  return null;
};
