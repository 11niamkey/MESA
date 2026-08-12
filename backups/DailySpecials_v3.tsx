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
  return null;
};
