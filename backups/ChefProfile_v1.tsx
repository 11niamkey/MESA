import React, { useState } from 'react';
import { 
  ArrowLeft, MapPin, Clock, Award, Star, Share2, 
  Heart, ChefHat, Info, ChevronDown, ChevronUp, 
  Leaf, Utensils, Globe, Compass, BookOpen, 
  History, Sparkles, Music, Wind
} from 'lucide-react';
import { Chef, Dish, ViewState } from '../types';
import { ReviewList } from './ReviewList';
import { StarRating } from './StarRating';
import { ChefAvailabilityCalendar } from './ChefAvailabilityCalendar';
import { HeritageJourney } from './HeritageJourney';

interface ChefProfileProps {
  chef: Chef;
  onBack: () => void;
  onAddDish: (dish: Dish) => void;
  favorites: string[];
  onToggleFavorite: (dishId: string) => void;
  onNavigateToCulture?: () => void;
}

export const ChefProfile: React.FC<ChefProfileProps> = ({ chef, onBack, onAddDish, favorites, onToggleFavorite, onNavigateToCulture }) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'heritage' | 'reviews'>('menu');
  const [expandedDishId, setExpandedDishId] = useState<string | null>(null);
  const [heritageDish, setHeritageDish] = useState<Dish | null>(null);

  const handleShare = () => {
    alert(`Link copiato negli appunti: https://mesa.app/chef/${chef.id}\nCondividi questo chef con i tuoi amici!`);
  };

  const toggleDishDetails = (id: string) => {
    setExpandedDishId(prev => prev === id ? null : id);
  };

  return (
    <div className="animate-fade-in pb-12">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={onBack}
          className="flex items-center text-gray-500 hover:text-orange-600 transition-colors font-bold text-sm"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Torna alla ricerca
        </button>
        
        <button 
          onClick={handleShare}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-full text-gray-700 hover:bg-orange-100 hover:text-orange-700 transition-colors text-xs font-black uppercase tracking-widest"
        >
          <Share2 className="w-4 h-4" />
          <span>Condividi</span>
        </button>
      </div>

      {/* Header Profile */}
      <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-orange-100 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full -mr-32 -mt-32 opacity-50"></div>
        
        <div className="flex flex-col md:flex-row gap-10 relative z-10">
          <div className="relative mx-auto md:mx-0">
            <img 
              src={chef.avatar} 
              alt={chef.name} 
              className="w-40 h-40 md:w-56 md:h-56 rounded-[3rem] object-cover border-8 border-white shadow-2xl rotate-3 group-hover:rotate-0 transition-transform"
            />
            <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-2xl shadow-xl text-3xl group-hover:scale-110 transition-transform" title={chef.countryName}>
              {chef.nationality}
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter italic">{chef.name}</h1>
                {chef.countryName && <span className="hidden md:inline-block text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-lg font-bold tracking-widest uppercase mt-2">{chef.countryName}</span>}
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-4 md:mt-0 bg-black text-white px-4 py-2 rounded-2xl shadow-lg">
                <Star className="w-4 h-4 text-orange-500 fill-current" />
                <span className="font-black">{chef.rating}</span>
                <span className="text-xs text-gray-400 font-bold uppercase">({chef.reviews.length} feedback)</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center md:justify-start text-gray-400 font-bold text-sm uppercase tracking-widest mb-6">
              <MapPin className="w-4 h-4 mr-2 text-orange-500" />
              {chef.location} • {chef.distance} km
            </div>

            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl italic font-medium">
              "{chef.fullBio || chef.bio}"
            </p>

            <div className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start">
              {chef.specialties.map(spec => (
                <span key={spec} className="px-4 py-2 bg-orange-50 text-orange-700 text-xs font-black uppercase tracking-widest rounded-xl border border-orange-100">
                  {spec}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Tabs - Expanded with Heritage */}
      <div className="flex bg-gray-50 p-2 rounded-[2rem] mb-8 space-x-1">
        <button
          className={`flex-1 py-4 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 ${activeTab === 'menu' ? 'bg-black text-white shadow-xl' : 'text-gray-400 hover:bg-white hover:text-black'}`}
          onClick={() => setActiveTab('menu')}
        >
          <Utensils className="w-4 h-4" /> Menu Classico
        </button>
        <button
          className={`flex-1 py-4 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 ${activeTab === 'heritage' ? 'bg-orange-600 text-black shadow-xl' : 'text-gray-400 hover:bg-white hover:text-black'}`}
          onClick={() => setActiveTab('heritage')}
        >
          <History className="w-4 h-4" /> Storie e Radici
        </button>
        <button
          className={`flex-1 py-4 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 ${activeTab === 'reviews' ? 'bg-black text-white shadow-xl' : 'text-gray-400 hover:bg-white hover:text-black'}`}
          onClick={() => setActiveTab('reviews')}
        >
          <Star className="w-4 h-4" /> Recensioni
        </button>
      </div>

      {/* Render Area */}
      <div className="relative min-h-[400px]">
        
        {/* Tab 1: Menu Classico */}
        {activeTab === 'menu' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
            {chef.dishes.map((dish) => (
              <div 
                key={dish.id} 
                className="group bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500 flex flex-col md:flex-row h-full"
              >
                <div className="w-full md:w-2/5 h-48 md:h-auto relative overflow-hidden">
                  <img src={dish.image} alt={dish.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] font-black text-white">€ {dish.price.toFixed(2)}</div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-black text-gray-900">{dish.name}</h4>
                      <button
                        onClick={() => toggleDishDetails(dish.id)}
                        className="p-1 min-w-8 h-8 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors flex-shrink-0"
                        title="Info e Preparazione"
                      >
                        {expandedDishId === dish.id ? <ChevronUp className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 italic">{dish.description}</p>
                    
                    {expandedDishId === dish.id && (
                      <div className="mt-4 p-4 bg-orange-50/50 rounded-2xl border border-orange-100 space-y-3 animate-fade-in text-sm">
                        {dish.ingredients && dish.ingredients.length > 0 && (
                          <div>
                            <span className="block text-[10px] font-black uppercase tracking-widest text-orange-800 mb-1">Ingredienti Chiave</span>
                            <p className="text-gray-700 italic font-medium text-xs">{dish.ingredients.join(', ')}</p>
                          </div>
                        )}
                        {dish.preparation && (
                          <div>
                            <span className="block text-[10px] font-black uppercase tracking-widest text-orange-800 mb-1">Preparazione</span>
                            <p className="text-gray-700 italic font-medium text-xs">{dish.preparation}</p>
                          </div>
                        )}
                        {(!dish.ingredients || dish.ingredients.length === 0) && !dish.preparation && (
                          <p className="text-gray-500 italic text-xs">Ulteriori dettagli in arrivo...</p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="mt-6 space-y-3">
                    <button 
                      onClick={() => onAddDish(dish)}
                      className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-black uppercase tracking-widest text-[10px] transition-all font-bold border-b-2 border-orange-800"
                    >
                      Prenota
                    </button>
                    <button 
                      onClick={() => setHeritageDish(dish)}
                      className="w-full py-2 flex items-center justify-center gap-2 text-orange-600 text-[10px] font-black uppercase tracking-widest hover:underline"
                    >
                      <History className="w-3 h-3" /> Vedi Storia
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Storie e Radici (Area Dedicata richiesta) */}
        {activeTab === 'heritage' && (
          <div className="space-y-12 animate-fade-in">
             <div className="bg-orange-50 border border-orange-100 p-8 rounded-[3rem] text-center mb-10">
                <Compass className="w-10 h-10 text-orange-600 mx-auto mb-4" />
                <h3 className="text-2xl font-black italic tracking-tight text-orange-900">Il Viaggio nel Gusto</h3>
                <p className="text-sm text-orange-800 font-medium max-w-xl mx-auto italic">
                  "Ogni piatto è un capitolo di una storia millenaria. In questa sezione, esploriamo le radici delle ricette di {chef.name}."
                </p>
             </div>

             {chef.dishes.map((dish, idx) => (
               <div key={dish.id} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center border-b border-gray-100 pb-12 last:border-0">
                  <div className={`lg:col-span-5 ${idx % 2 !== 0 ? 'lg:order-2' : ''}`}>
                    <div className="relative">
                      <div className="absolute -inset-4 bg-orange-600/10 rounded-[4rem] -rotate-2"></div>
                      <img src={dish.image} alt={dish.name} className="relative z-10 w-full aspect-square object-cover rounded-[3.5rem] shadow-2xl grayscale-[0.2] hover:grayscale-0 transition-all duration-700" />
                      <div className="absolute -bottom-6 -right-6 z-20 bg-white rounded-full flex flex-col items-center justify-center p-4 shadow-xl border border-gray-50 min-w-24 min-h-24" title={chef.countryName}>
                         <span className="text-4xl leading-none">{chef.nationality}</span>
                         {chef.countryName && <span className="text-[8px] font-black uppercase tracking-widest text-gray-500 mt-1">{chef.countryName}</span>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center gap-3">
                       <span className="px-3 py-1 bg-orange-100 text-orange-700 text-[9px] font-black uppercase tracking-widest rounded-lg">Ricetta Antica</span>
                       <div className="h-px flex-1 bg-orange-100"></div>
                    </div>
                    <h4 className="text-4xl font-black italic text-gray-900 tracking-tighter">{dish.name}</h4>
                    
                    <div className="bg-white border-l-4 border-orange-600 pl-6 py-2">
                       <p className="text-xl font-serif text-gray-700 leading-relaxed italic">
                          {/* Qui verrebbe caricato o generato lo storytelling specifico del piatto */}
                          Questa ricetta è stata tramandata nella famiglia di {chef.name} per generazioni. 
                          Utilizza tecniche di cottura lente che permettono agli ingredienti di sprigionare l'essenza della loro terra d'origine.
                       </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-4">
                       <div className="space-y-2">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                             <Wind className="w-3 h-3 text-orange-500" /> Atmosfera
                          </p>
                          <p className="text-sm font-medium text-gray-600 italic">Luci soffuse e un calice di vino rosso locale.</p>
                       </div>
                       <div className="space-y-2">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                             <Music className="w-3 h-3 text-orange-500" /> Musica
                          </p>
                          <p className="text-sm font-medium text-gray-600 italic">Melodie popolari della regione {chef.nationality}.</p>
                       </div>
                    </div>

                    <button 
                      onClick={() => onAddDish(dish)}
                      className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-orange-600 hover:text-black transition-colors pt-4 group"
                    >
                      <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" /> 
                      Voglio assaggiare questa storia →
                    </button>
                  </div>
               </div>
             ))}
          </div>
        )}

        {/* Tab 3: Recensioni */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-[3rem] p-8 border border-gray-100 shadow-sm animate-fade-in">
            <ReviewList reviews={chef.reviews} />
          </div>
        )}
      </div>

      {/* Heritage Journey Modal Integration */}
      {heritageDish && (
        <HeritageJourney 
          dish={heritageDish} 
          chef={chef} 
          onClose={() => setHeritageDish(null)} 
        />
      )}

      {/* Footer del profilo */}
      <div className="mt-16 bg-black rounded-[4rem] p-12 text-white relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
            <BookOpen className="w-64 h-64" />
         </div>
         <div className="relative z-10 max-w-2xl">
            <h3 className="text-3xl font-black italic mb-6">MESA Cultural Project</h3>
            <p className="text-gray-400 text-lg leading-relaxed mb-10 italic">
               "Ogni piatto ordinato è un voto per la conservazione delle culture locali. Insieme, proteggiamo il patrimonio invisibile dei cuochi locali."
            </p>
            <div className="flex flex-wrap gap-6">
               <button className="px-8 py-4 bg-orange-600 text-black font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-white transition-all shadow-xl">
                  Sostieni questo Chef
               </button>
               <button onClick={onNavigateToCulture} className="px-8 py-4 border-2 border-white/20 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-white hover:text-black transition-all">
                  Scopri il Magazine
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};
