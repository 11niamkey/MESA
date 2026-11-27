import { Chef, Order, OrderReview, Review } from '../types';

export const MAX_REVIEW_COMMENT_LENGTH = 250;

export const clampRating = (value: number): number => {
  const num = Number(value);
  if (!Number.isFinite(num)) return 5;
  return Math.min(5, Math.max(1, Math.round(num)));
};

export const computeOverallRating = (
  ratingDishes: number,
  ratingService: number,
  ratingPackaging: number
): number => {
  const avg = (clampRating(ratingDishes) + clampRating(ratingService) + clampRating(ratingPackaging)) / 3;
  return Math.round(avg * 10) / 10;
};

export const isOrderEligibleForReview = (
  order?: Order | null,
  existingReviews: OrderReview[] = []
): boolean => {
  if (!order) return false;
  if (order.status !== 'COMPLETED') return false;
  if (order.hasReview || order.isReviewed) return false;
  return !existingReviews.some(r => r.orderId === order.id);
};

export interface RatingSummary {
  average: number;
  count: number;
}

export const getChefRatingSummary = (
  chef: Pick<Chef, 'id' | 'rating' | 'reviews'>,
  reviews: OrderReview[] = []
): RatingSummary => {
  const visibleFirestore = reviews.filter(r => !r.isHidden && r.chefId === chef.id);
  const legacyReviews = Array.isArray(chef.reviews) ? chef.reviews : [];

  const totalCount = visibleFirestore.length + legacyReviews.length;
  if (totalCount === 0) {
    return {
      average: Number.isFinite(Number(chef.rating)) && Number(chef.rating) > 0 ? Math.round(Number(chef.rating) * 10) / 10 : 5,
      count: 0,
    };
  }

  const sum =
    visibleFirestore.reduce((acc, r) => acc + Number(r.ratingOverall || 0), 0) +
    legacyReviews.reduce((acc, r) => acc + Number(r.rating || 0), 0);

  return {
    average: Math.round((sum / totalCount) * 10) / 10,
    count: totalCount,
  };
};

export const getDishRatingSummary = (
  dishId: string,
  reviews: OrderReview[] = []
): { average: number | null; count: number } => {
  const matching = reviews.filter(
    r => !r.isHidden && Array.isArray(r.dishIds) && r.dishIds.includes(dishId)
  );
  if (matching.length === 0) {
    return { average: null, count: 0 };
  }
  const sum = matching.reduce((acc, r) => acc + Number(r.ratingDishes || r.ratingOverall || 0), 0);
  return {
    average: Math.round((sum / matching.length) * 10) / 10,
    count: matching.length,
  };
};

export interface ExtendedDisplayReview extends Review {
  ratingDishes?: number;
  ratingService?: number;
  ratingPackaging?: number;
  isVerifiedOrder?: boolean;
}

export const formatChefDisplayReviews = (
  chef: Pick<Chef, 'id' | 'reviews'>,
  reviews: OrderReview[] = []
): ExtendedDisplayReview[] => {
  const visibleFirestore = reviews
    .filter(r => !r.isHidden && r.chefId === chef.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map<ExtendedDisplayReview>(r => ({
      id: r.id,
      author: r.customerName || 'Cliente MESA',
      rating: Number(r.ratingOverall || 5),
      comment: r.comment || '',
      date: new Date(r.createdAt).toLocaleDateString('it-IT'),
      ratingDishes: r.ratingDishes,
      ratingService: r.ratingService,
      ratingPackaging: r.ratingPackaging,
      isVerifiedOrder: true,
    }));

  const legacy: ExtendedDisplayReview[] = Array.isArray(chef.reviews)
    ? chef.reviews.map(r => ({ ...r }))
    : [];

  return [...visibleFirestore, ...legacy];
};
