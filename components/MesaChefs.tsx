import React from 'react';
import { Chef, OrderReview } from '../types';
import { MapPin, ArrowRight, ShieldCheck, Award, Users, Star } from 'lucide-react';
import { CountryFlag } from './CountryFlag';
import { getChefRatingSummary } from '../utils/reviewUtils';
import { isChefBookable } from '../utils/chefUtils';

interface MesaChefsProps {
  chefs: Chef[];
  reviews?: OrderReview[];
  onViewProfile: (chef: Chef) => void;
}

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80';

export const MesaChefs: React.FC<MesaChefsProps> = ({ chefs, reviews = [], onViewProfile }) => {
  return (
    <div className="animate-fade-in pb-12">
      {/* Hero Section for Chefs */}
      <div className="relative bg-black rounded-3xl p-6 md:p-10 mb-8 overflow-hidden border border-orange-900 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600 rounded-full opacity-10 blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-500 rounded-full opacity-10 blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-4 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-bold uppercase tracking-widest">
            <ShieldCheck className="w-3 h-3 mr-2" />
            Verificati • Provincia di Pordenone (PN)
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight whitespace-nowrap truncate">
            I Nostri Cuochi <span className="text-orange-500">MESA</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed mb-2">
            Tutti i nostri cuochi operano nella Provincia di Pordenone (PN), selezionati dalla comunità,
            certificati per gli standard di sicurezza e celebrati per l'autenticità dei loro piatti.
          </p>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4 shrink-0">
            <Users className="w-6 h-6 text-orange-600 shrink-0" />
          </div>
          <h3 className="font-bold text-orange-600 mb-2">Scelti dalla Comunità</h3>
          <p className="text-sm text-black">Solo i cuochi con recensioni eccellenti e approvazione locale entrano in MESA.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4 shrink-0">
            <ShieldCheck className="w-6 h-6 text-orange-600 shrink-0" />
          </div>
          <h3 className="font-bold text-orange-600 mb-2">Sicurezza Certificata</h3>
          <p className="text-sm text-black">Ogni cucina è verificata e ogni cuoco possiede certificazioni HACCP aggiornate.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4 shrink-0">
            <Award className="w-6 h-6 text-orange-600 shrink-0" />
          </div>
          <h3 className="font-bold text-orange-600 mb-2">Autenticità Garantita</h3>
          <p className="text-sm text-black">Nessuna imitazione. Solo ricette originali tramandate e ingredienti verificati.</p>
        </div>
      </div>

      {/* Chefs Grid */}
      <h3 className="text-lg sm:text-2xl font-black text-orange-600 mb-5 border-l-4 border-orange-500 pl-4 whitespace-nowrap truncate">Esplora i Talenti</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {chefs.map((chef) => (
          <div 
            key={chef.id} 
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full"
          >
            {/* Image Header with Flag Overlay */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100 shrink-0">
              <img 
                src={chef.avatar || DEFAULT_AVATAR} 
                alt={chef.name} 
                onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_AVATAR; }}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <CountryFlag flag={chef.nationality} title={chef.countryName} size="md" />
                      {isChefBookable(chef) && !/in attesa di verifica/i.test(chef.bio || '') ? (
                        <span className="px-2 py-0.5 bg-orange-600 text-[10px] font-bold uppercase rounded text-white tracking-wider">Verificato</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-amber-600 text-[10px] font-bold uppercase rounded text-white tracking-wider">In arrivo</span>
                      )}
                    </div>
                    {(() => {
                      const summary = getChefRatingSummary(chef, reviews);
                      return (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-black/80 backdrop-blur-sm rounded-lg text-[10px] font-black text-amber-400 shrink-0">
                          <Star className="w-3 h-3 fill-current shrink-0" />
                          <span>{summary.average.toFixed(1)}</span>
                          <span className="text-white/80">({summary.count})</span>
                        </span>
                      );
                    })()}
                </div>
                <h3 className="text-2xl font-bold text-orange-400">{chef.name}</h3>
                <div className="flex items-center text-sm text-gray-300 mt-1">
                  <MapPin className="w-3 h-3 mr-1 shrink-0" />
                  {chef.location}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow bg-white">
              <div className="mb-4">
                <h4 className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2 flex items-center">
                    <Award className="w-3 h-3 mr-1" />
                    La sua storia
                </h4>
                <p className="text-black text-sm leading-relaxed">
                  {chef.fullBio || chef.bio}
                </p>
              </div>

              {/* Specialties */}
              <div className="flex flex-wrap gap-2 mb-6">
                {chef.specialties.slice(0, 3).map(spec => (
                  <span key={spec} className="px-2 py-1 bg-black text-white text-xs font-medium rounded-md">
                    {spec}
                  </span>
                ))}
              </div>

              {/* Action */}
              <button 
                onClick={() => onViewProfile(chef)}
                className="mt-auto w-full py-3 bg-black text-white font-bold rounded-xl flex items-center justify-center space-x-2 border-2 border-transparent hover:border-orange-500 hover:text-orange-500 transition-all"
              >
                <span>Scopri il Menu</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
