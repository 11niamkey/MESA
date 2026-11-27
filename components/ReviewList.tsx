import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { ExtendedDisplayReview } from '../utils/reviewUtils';
import { StarRating } from './StarRating';

interface ReviewListProps {
  reviews: ExtendedDisplayReview[];
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  return (
    <div className="space-y-4">
      {reviews.length === 0 ? (
        <div className="text-center text-gray-500 py-8 text-sm font-medium">
          Nessuna recensione verificata ancora. Sii il primo!
        </div>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-bold text-gray-900 text-sm truncate">{review.author}</span>
                {review.isVerifiedOrder && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-black uppercase tracking-wider shrink-0">
                    <ShieldCheck className="w-3 h-3 shrink-0" /> Verificato
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-400 shrink-0">{review.date}</div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-2">
              <StarRating rating={review.rating} size={3} />
              <span className="text-xs font-black text-gray-800">{review.rating.toFixed(1)}</span>
              {typeof review.ratingDishes === 'number' && (
                <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold text-gray-500">
                  <span className="px-2 py-0.5 rounded-lg bg-gray-100">Piatti {review.ratingDishes}/5</span>
                  {typeof review.ratingService === 'number' && (
                    <span className="px-2 py-0.5 rounded-lg bg-gray-100">Servizio {review.ratingService}/5</span>
                  )}
                  {typeof review.ratingPackaging === 'number' && (
                    <span className="px-2 py-0.5 rounded-lg bg-gray-100">Packaging {review.ratingPackaging}/5</span>
                  )}
                </div>
              )}
            </div>

            {review.comment && (
              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{review.comment}</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};
