import React from 'react';
import { Review } from '../types';
import { StarRating } from './StarRating';

interface ReviewListProps {
  reviews: Review[];
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  return (
    <div className="space-y-4">
      {reviews.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          Nessuna recensione ancora. Sii il primo!
        </div>
      ) : (
        reviews.map(review => (
          <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-gray-900">{review.author}</div>
              <div className="text-xs text-gray-400">{review.date}</div>
            </div>
            <div className="mb-2">
              <StarRating rating={review.rating} size={3} />
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
          </div>
        ))
      )}
    </div>
  );
};
