import React, { useState } from 'react';
import { X, Star, MessageSquare, Heart } from 'lucide-react';
import { Order } from '../types';

interface OrderReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  onSubmit: (rating: number, comment: string) => void;
}

export const OrderReviewModal: React.FC<OrderReviewModalProps> = ({ isOpen, onClose, order, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
        
        <div className="relative bg-white rounded-[3rem] shadow-2xl w-full max-w-md p-8 animate-fade-in-up border-t-8 border-orange-500">
          <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>

          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-orange-600 fill-current animate-pulse" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Com'era il piatto?</h2>
            <p className="text-gray-500 text-sm">Il tuo feedback aiuta <span className="font-bold text-black">{order.chefName}</span> a crescere e aiuta la community MESA.</p>
          </div>

          <div className="flex justify-center space-x-2 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="p-1 transition-transform transform hover:scale-125"
              >
                <Star 
                  className={`w-10 h-10 ${
                    (hoverRating || rating) >= star ? 'text-yellow-400 fill-current' : 'text-gray-200'
                  }`} 
                />
              </button>
            ))}
          </div>

          <div className="space-y-4 mb-8">
            <label className="flex items-center text-sm font-bold text-gray-700">
              <MessageSquare className="w-4 h-4 mr-2 text-gray-400" />
              Raccontaci di più (opzionale)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Sapore, presentazione, puntualità..."
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none text-sm resize-none"
              rows={4}
            />
          </div>

          <button
            onClick={() => onSubmit(rating, comment)}
            className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl transition-all active:scale-95 border-b-4 border-orange-850 hover:border-orange-950"
          >
            Invia Recensione
          </button>
        </div>
      </div>
    </div>
  );
};