import React, { useEffect, useState } from 'react';
import { X, Star, MessageSquare, Utensils, Clock, PackageCheck } from 'lucide-react';
import { Order } from '../types';
import { computeOverallRating, MAX_REVIEW_COMMENT_LENGTH } from '../utils/reviewUtils';
import { sanitizeInputLive, sanitizeText } from '../utils/sanitize';

export interface ReviewSubmissionPayload {
  ratingDishes: number;
  ratingService: number;
  ratingPackaging: number;
  comment: string;
}

interface OrderReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onSubmit: (payload: ReviewSubmissionPayload) => Promise<void> | void;
}

interface RatingCriterionRowProps {
  label: string;
  icon: React.ReactNode;
  value: number;
  onChange: (next: number) => void;
}

const RatingCriterionRow: React.FC<RatingCriterionRowProps> = ({ label, icon, value, onChange }) => {
  const [hover, setHover] = useState(0);
  const active = hover || value;

  return (
    <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 min-w-0">
        {icon}
        <span className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">{label}</span>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(star)}
            aria-label={`${label}: ${star} stelle`}
            className="p-0.5 transition-transform hover:scale-110 active:scale-95 shrink-0"
          >
            <Star
              className={`w-5 h-5 sm:w-6 sm:h-6 shrink-0 ${
                active >= star ? 'text-amber-400 fill-current' : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export const OrderReviewModal: React.FC<OrderReviewModalProps> = ({
  isOpen,
  onClose,
  order,
  onSubmit,
}) => {
  const [ratingDishes, setRatingDishes] = useState(5);
  const [ratingService, setRatingService] = useState(5);
  const [ratingPackaging, setRatingPackaging] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && order) {
      setRatingDishes(5);
      setRatingService(5);
      setRatingPackaging(5);
      setComment('');
      setIsSubmitting(false);
    }
  }, [isOpen, order?.id]);

  if (!isOpen || !order) return null;

  const overall = computeOverallRating(ratingDishes, ratingService, ratingPackaging);
  const dishSummary = order.items.map(i => i.name).filter(Boolean).join(', ');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        ratingDishes,
        ratingService,
        ratingPackaging,
        comment: sanitizeText(comment, MAX_REVIEW_COMMENT_LENGTH),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Valuta ordine"
    >
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up border-t-8 border-orange-500"
      >
        <div className="flex items-center justify-between gap-3 px-5 py-4 bg-gray-50 border-b border-gray-100">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-orange-600">
              Ordine #{order.id.split('-')[0]} • Verificato
            </p>
            <h2 className="text-lg font-black text-gray-900 leading-tight truncate">
              Valuta {order.chefName}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Chiudi valutazione"
            className="p-2 rounded-full bg-white hover:bg-gray-100 text-gray-500 border border-gray-200 shrink-0"
          >
            <X className="w-4 h-4 shrink-0" />
          </button>
        </div>

        <div className="p-5 sm:p-6 max-h-[78vh] overflow-y-auto space-y-4">
          {dishSummary && (
            <p className="text-xs font-semibold text-gray-600 bg-orange-50/70 border border-orange-100 px-3.5 py-2 rounded-xl line-clamp-2">
              Piatti: <span className="text-gray-900 font-bold">{dishSummary}</span>
            </p>
          )}

          <div className="space-y-2.5">
            <RatingCriterionRow
              label="Qualità piatti"
              icon={<Utensils className="w-4 h-4 text-orange-600 shrink-0" />}
              value={ratingDishes}
              onChange={setRatingDishes}
            />
            <RatingCriterionRow
              label="Servizio e puntualità"
              icon={<Clock className="w-4 h-4 text-orange-600 shrink-0" />}
              value={ratingService}
              onChange={setRatingService}
            />
            <RatingCriterionRow
              label="Packaging / cura"
              icon={<PackageCheck className="w-4 h-4 text-orange-600 shrink-0" />}
              value={ratingPackaging}
              onChange={setRatingPackaging}
            />
          </div>

          <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-black text-white">
            <span className="text-xs font-black uppercase tracking-wider text-gray-300">
              Valutazione complessiva
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm font-black text-amber-400">
              <Star className="w-4 h-4 fill-current shrink-0" />
              <span>{overall.toFixed(1)} / 5</span>
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                <MessageSquare className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>Commento breve (facoltativo)</span>
              </label>
              <span className="text-[10px] font-bold text-gray-400">
                {comment.length}/{MAX_REVIEW_COMMENT_LENGTH}
              </span>
            </div>
            <textarea
              value={comment}
              maxLength={MAX_REVIEW_COMMENT_LENGTH}
              onChange={(e) => setComment(sanitizeInputLive(e.target.value, MAX_REVIEW_COMMENT_LENGTH))}
              placeholder="Sapore, freschezza, imballaggio, puntualità..."
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none text-xs sm:text-sm resize-none"
              rows={3}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-lg transition-all active:scale-95 border-b-4 border-orange-800 disabled:opacity-60"
          >
            {isSubmitting ? 'Invio in corso...' : 'Invia recensione'}
          </button>
        </div>
      </form>
    </div>
  );
};
