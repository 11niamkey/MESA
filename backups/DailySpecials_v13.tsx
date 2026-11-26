import React, { useMemo, useRef } from 'react';
import { Sparkles, Heart, Clock, Utensils, ShoppingBag, ChevronRight } from 'lucide-react';
import { Dish, Chef } from '../types';
import { isItemAvailableSoon } from '../utils/chefUtils';

interface DailySpecialsProps {
  chefs: Chef[];
  onAddDish: (dish: Dish) => void;
  favorites: string[];
  onToggleFavorite: (dishId: string) => void;
}

const MAX_DAILY_SPECIALS = 5;
const DEFAULT_FOOD_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';

const formatChefDisplayName = (name?: string) => {
  const trimmed = (name || 'MESA').trim();
  return /^chef\b/i.test(trimmed) ? trimmed : `Chef ${trimmed}`;
};

const isMarkedDailySpecial = (dish: Dish): boolean => {
  if (!Array.isArray(dish.tags)) return false;
  return dish.tags.some((tag) => {
    const t = tag.trim().toLowerCase();
    return (
      t === 'speciale' ||
      t === 'piatti del giorno' ||
      t === 'piatto del giorno' ||
      t === 'del giorno'
    );
  });
};

export const DailySpecials: React.FC<DailySpecialsProps> = ({
  chefs,
  onAddDish,
  favorites,
  onToggleFavorite,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const specials = useMemo(() => {
    type EnrichedSpecial = Dish & {
      chefName: string;
      canBook: boolean;
      isSpecialTagged: boolean;
    };

    const seenIds = new Set<string>();
    const perChefBuckets: EnrichedSpecial[][] = chefs.map((chef) => {
      const enriched = (chef.dishes || [])
        .filter((dish) => {
          if (!dish?.id || seenIds.has(dish.id)) return false;
          seenIds.add(dish.id);
          return true;
        })
        .map((dish) => ({
          ...dish,
          chefName: chef.name,
          canBook: !isItemAvailableSoon(dish, chefs),
          isSpecialTagged: isMarkedDailySpecial(dish),
        }))
        .sort((a, b) => {
          if (a.isSpecialTagged !== b.isSpecialTagged) return a.isSpecialTagged ? -1 : 1;
          if (a.canBook !== b.canBook) return a.canBook ? -1 : 1;
          return 0;
        });
      return enriched;
    });

    // Interleave across chefs round-robin first to avoid duplicating the catalog,
    // then sort globally by Speciale tag + bookable beta status, capped at 5 dishes.
    const interleaved: EnrichedSpecial[] = [];
    const maxLen = perChefBuckets.reduce((max, b) => Math.max(max, b.length), 0);
    for (let i = 0; i < maxLen; i++) {
      for (const bucket of perChefBuckets) {
        if (bucket[i]) interleaved.push(bucket[i]);
      }
    }

    interleaved.sort((a, b) => {
      if (a.isSpecialTagged !== b.isSpecialTagged) return a.isSpecialTagged ? -1 : 1;
      if (a.canBook !== b.canBook) return a.canBook ? -1 : 1;
      return 0;
    });

    return interleaved.slice(0, MAX_DAILY_SPECIALS);
  }, [chefs]);

  if (specials.length === 0) return null;

  const handleScrollNext = () => {
    scrollContainerRef.current?.scrollBy({ left: 260, behavior: 'smooth' });
  };

  return (
    <section aria-label="Piatti del Giorno" className="mb-5 sm:mb-7 animate-fade-in">
      <div className="flex items-center justify-between gap-2 mb-2.5 sm:mb-3 px-1">
        <div className="flex items-center gap-2 min-w-0">
          <div className="bg-orange-600 p-1.5 rounded-xl shadow-sm shadow-orange-200 shrink-0">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
          </div>
          <h2 className="text-base sm:text-xl font-black text-orange-600 tracking-tight whitespace-nowrap truncate">
            Piatti del Giorno
          </h2>
          <span className="hidden md:inline-block text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
            • {specials.length} proposte selezionate
          </span>
        </div>

        <button
          type="button"
          onClick={handleScrollNext}
          className="inline-flex items-center gap-0.5 text-[11px] font-black text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-2.5 py-1 rounded-full transition-colors shrink-0 whitespace-nowrap"
          aria-label="Scorri i Piatti del Giorno"
        >
          <span>Scorri</span>
          <span aria-hidden="true">→</span>
          <ChevronRight className="w-3.5 h-3.5 hidden sm:inline" />
        </button>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 pr-4 -mx-1 px-1"
      >
        {specials.map((dish) => (
          <div
            key={dish.id}
            onClick={() => onAddDish(dish)}
            className="w-[250px] sm:w-[270px] shrink-0 snap-start bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 overflow-hidden group transition-all duration-200 relative flex flex-col justify-between cursor-pointer"
          >
            {/* Compact Image Header */}
            <div className="relative aspect-[16/10] w-full overflow-hidden shrink-0">
              <img
                src={dish.image || DEFAULT_FOOD_IMAGE}
                alt={dish.name}
                onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_FOOD_IMAGE; }}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              <div className="absolute top-2 left-2">
                <span className="bg-orange-600 text-white text-[8.5px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider shadow-md inline-flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 shrink-0" />
                  Speciale
                </span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(dish.id);
                }}
                aria-label={`Aggiungi ${dish.name} ai preferiti`}
                className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur rounded-xl shadow-md hover:bg-white transition-transform hover:scale-110 active:scale-95 z-10 border border-gray-100"
              >
                <Heart className={`w-3.5 h-3.5 shrink-0 ${favorites.includes(dish.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
              </button>
            </div>

            {/* Compact Content Body */}
            <div className="p-3 flex-1 flex flex-col justify-between gap-2">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-black text-gray-900 text-xs sm:text-sm leading-snug group-hover:text-orange-600 transition-colors line-clamp-1">
                      {dish.name}
                    </h3>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider truncate mt-0.5">
                      {formatChefDisplayName(dish.chefName)}
                    </p>
                  </div>
                  <span className="text-xs sm:text-sm font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded-lg shrink-0">
                    €{dish.price.toFixed(2)}
                  </span>
                </div>
              </div>

              {dish.canBook ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddDish(dish);
                  }}
                  className="w-full py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-wider text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
                >
                  <Utensils className="w-3.5 h-3.5 shrink-0" />
                  <span>Prenota Ora</span>
                </button>
              ) : (
                <div className="space-y-1">
                  <div className="w-full py-0.5 px-2 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-black uppercase tracking-wider text-[9px] flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3 shrink-0" />
                    <span>Disponibile a breve</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddDish(dish);
                    }}
                    className="w-full py-1.5 rounded-xl bg-black hover:bg-orange-600 text-white font-black uppercase tracking-wider text-[10px] flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
                  >
                    <ShoppingBag className="w-3 h-3 shrink-0" />
                    <span>Aggiungi</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};