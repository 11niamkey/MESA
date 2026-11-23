
import React, { useState } from 'react';
import { Chef, Dish } from '../types';
import { Star, MapPin, Utensils, Share2, ShoppingBag, ShieldCheck, ArrowLeft, Heart, Compass } from 'lucide-react';
import { HeritageJourney } from './HeritageJourney';

interface PublicStorefrontProps {
  chef: Chef;
  onAddDish: (dish: Dish) => void;
  onExit: () => void;
}

const DEFAULT_FOOD_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';

export const PublicStorefront: React.FC<PublicStorefrontProps> = ({ chef, onAddDish, onExit }) => {
  const [heritageDish, setHeritageDish] = useState<Dish | null>(null);

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `MESA - La cucina di ${chef.name}`,
        text: `Scopri i piatti autentici di ${chef.name} su MESA!`,
        url: url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copiato negli appunti!");
    }
  };

  return (
    <div className="animate-fade-in bg-white min-h-screen pb-20">
      {/* Top Bar Minimalista */}
      <nav className="bg-black/95 backdrop-blur-md py-4 px-6 sticky top-0 z-50 flex justify-between items-center shadow-xl border-b border-white/10">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onExit}>
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
            <Utensils className="w-5 h-5 text-black" />
          </div>
          <span className="text-white font-black italic tracking-tighter text-xl">MESA</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleShare}
            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
            title="Condividi Vetrina"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button 
            onClick={onExit}
            className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-orange-500 hover:text-white px-4 py-2 bg-white/5 rounded-xl transition-colors"
          >
            Esplora altri chef
          </button>
        </div>
      </nav>

      {/* Hero Header Evoluto */}
      <div className="relative h-[45vh] md:h-[55vh] overflow-hidden">
        <img 
          src={chef.dishes[0]?.image || chef.avatar} 
          alt={chef.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-black/30"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-end gap-6 md:gap-10">
            <div className="relative shrink-0">
              <img 
                src={chef.avatar} 
                className="w-32 h-32 md:w-44 md:h-44 rounded-[3rem] border-8 border-white shadow-2xl object-cover -rotate-2" 
                alt={chef.name} 
              />
              <span className="absolute -bottom-2 -right-2 text-4xl bg-white rounded-2xl p-2 shadow-xl border border-gray-100">{chef.nationality}</span>
            </div>
            <div className="flex-1 mb-2">
              <div className="flex items-center gap-3 mb-3">
                 <span className="bg-black text-white text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border border-white/20">Chef Verificato</span>
                 <div className="flex items-center gap-1 bg-yellow-400 text-black px-2 py-0.5 rounded-lg text-[10px] font-black">
                    <Star className="w-3 h-3 fill-current" />
                    {chef.rating}
                 </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-black italic text-gray-900 tracking-tighter leading-[0.9] mb-4">
                La Cucina <br/>di {chef.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-500">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  {chef.location}
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  HACCP Certificato
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Menu Section */}
          <div className="lg:col-span-8 space-y-10">
            <div className="flex items-center justify-between mb-2">
               <h2 className="text-3xl font-black italic tracking-tight border-l-8 border-orange-600 pl-6">I Piatti dello Chef</h2>
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{chef.dishes.length} Proposte</span>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {chef.dishes.map(dish => (
                <div key={dish.id} className="group bg-gray-50 rounded-[3.5rem] border border-gray-100 overflow-hidden flex flex-col md:flex-row hover:shadow-2xl transition-all duration-500 border-b-8 border-b-orange-600/10">
                  <div className="w-full md:w-64 h-64 flex-shrink-0 relative overflow-hidden">
                    <img 
                      src={dish.image || DEFAULT_FOOD_IMAGE} 
                      alt={dish.name} 
                      onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_FOOD_IMAGE; }}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-xl text-[11px] font-black text-white uppercase tracking-widest">
                       € {dish.price.toFixed(2)}
                    </div>
                    <button 
                      onClick={() => setHeritageDish(dish)}
                      className="absolute bottom-4 right-4 p-3 bg-orange-600 text-white rounded-2xl shadow-xl hover:scale-110 transition-all flex items-center gap-2"
                    >
                      <Compass className="w-5 h-5" />
                      <span className="text-[10px] font-black uppercase">Scopri Eredità</span>
                    </button>
                  </div>
                  <div className="p-8 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="text-2xl font-black italic text-gray-900 group-hover:text-orange-600 transition-colors mb-3">{dish.name}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-6 italic font-medium">
                        "{dish.description}"
                      </p>
                      <div className="flex flex-wrap gap-2 mb-8">
                         {dish.tags.map(tag => (
                           <span key={tag} className="px-3 py-1 bg-white border border-gray-200 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-400">{tag}</span>
                         ))}
                      </div>
                    </div>
                    <button 
                      onClick={() => onAddDish(dish)}
                      className="w-full py-5 bg-orange-600 hover:bg-orange-700 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 shadow-orange-950/15 border-b-4 border-orange-850 hover:border-orange-950"
                    >
                      <ShoppingBag className="w-5 h-5" /> Prenota questo piatto
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Section */}
          <div className="lg:col-span-4 space-y-10">
            <div className="bg-orange-600 rounded-[3.5rem] p-10 text-black shadow-xl relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-black/5 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
              <h3 className="text-2xl font-black italic mb-6 flex items-center gap-3">
                <Utensils className="w-6 h-6" /> Lo Chef
              </h3>
              <p className="text-sm font-bold leading-relaxed italic mb-8 text-black/80">
                "{chef.fullBio || chef.bio}"
              </p>
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-2">Specialità</p>
                <div className="flex flex-wrap gap-2">
                  {chef.specialties.map(spec => (
                    <span key={spec} className="px-4 py-2 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-md">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-[3.5rem] p-10 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                  <ShieldCheck className="w-24 h-24" />
               </div>
               <h3 className="text-xl font-black italic mb-4">Garantito da MESA</h3>
               <p className="text-xs text-gray-400 font-medium leading-relaxed mb-8">
                 Ordina con fiducia. Ogni cuoco su MESA è certificato HACCP e la qualità dei piatti è verificata dalla community.
               </p>
               <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-orange-500">
                  <div className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></div>
                  Sicurezza Certificata
               </div>
            </div>
            
            <button 
              onClick={onExit}
              className="w-full py-6 bg-white border-2 border-gray-100 text-gray-400 rounded-[2.5rem] font-black uppercase tracking-widest text-[10px] hover:border-orange-500 hover:text-black transition-all flex items-center justify-center gap-3 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Torna al Marketplace
            </button>
          </div>

        </div>
      </div>

      {heritageDish && (
        <HeritageJourney 
          dish={heritageDish} 
          chef={chef} 
          onClose={() => setHeritageDish(null)} 
        />
      )}
    </div>
  );
};
