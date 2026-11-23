import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, max = 5, size = 4 }) => {
  return (
    <div className="flex items-center">
      {[...Array(max)].map((_, i) => (
        <Star
          key={i}
          className={`w-${size} h-${size} ${
            i < Math.round(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};
