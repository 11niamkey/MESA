
import React, { useState, useRef } from 'react';
import { MOCK_CULTURE_STORIES } from '../constants';
import { CultureStory } from '../types';
import { Globe, BookOpen, Lightbulb, ArrowRight, Bookmark, Share2, Compass, X, Utensils, Quote } from 'lucide-react';

const DEFAULT_FOOD_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';

export const CultureSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('Tutte');
  const [selectedStory, setSelectedStory] = useState<CultureStory | null>(null);
  const articlesRef = useRef<HTMLDivElement>(null);

  const categories = ['Tutte', 'Europa', 'Asia', 'Americhe', 'Africa'];

  const scrollToArticles = () => {
    articlesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleShare = (title: string) => {
    if (navigator.share) {
      navigator.share({ title, text: `Scopri questa storia su MESA: ${title}`, url: window.location.href });
    } else {
      alert("Link della storia copiato negli appunti!");
    }
  };

  const continentMapping: Record<string, string[]> = {
    'Europa': ['Italia', 'Francia', 'Spagna', 'Grecia', 'Germania', 'Portogallo', 'Svezia', 'Regno Unito'],
    'Asia': ['Giappone', 'Cina', 'India', 'Thailandia', 'Corea del Sud', 'Vietnam', 'Libano', 'Turchia'],
    'Americhe': ['Messico', 'Brasile', 'Perù', 'Argentina', 'USA', 'Colombia'],
    'Africa': ['Etiopia', 'Nigeria', 'Ghana', 'Senegal', 'Costa d\'Avorio', 'Egitto', 'Marocco', 'Kenya', 'Sudafrica', 'Camerun', 'Congo', 'Mali', 'Tunisia', 'Algeria']
  };

  const filteredStories = activeCategory === 'Tutte' 
    ? MOCK_CULTURE_STORIES 
    : MOCK_CULTURE_STORIES.filter(story => {
        const validCountries = continentMapping[activeCategory] || [];
        return validCountries.includes(story.country);
      });

  return (
    <div className="animate-fade-in pb-20">
      {/* Editorial Hero */}
      <div className="relative h-[60vh] md:h-[70vh] rounded-[3rem] overflow-hidden mb-12 shadow-2xl group">
        <div className="absolute inset-0 bg-black">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80" 
            alt="Food Culture" 
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 text-white">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-600 text-black text-[10px] font-black uppercase tracking-widest mb-6 shadow-xl">
              <Compass className="w-3 h-3" />
              Speciale Magazine
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-none italic">
              Il Gusto <br/>ha una <span className="text-orange-500 underline decoration-4 underline-offset-8">Storia.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 font-medium leading-relaxed mb-8 max-w-xl">
              Viaggia attraverso le cucine del mondo. Scopri le leggende, le tecniche secolari e il cuore dei nostri chef.
            </p>
            <div className="flex items-center gap-6">
              <button 
                onClick={scrollToArticles}
                className="px-8 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all transform active:scale-95 shadow-2xl"
              >
                Inizia il viaggio
              </button>
              <div className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-400">
                <BookOpen className="w-5 h-5" />
                <span>{filteredStories.length} Storie disponibili</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div ref={articlesRef} className="flex items-center justify-center space-x-2 md:space-x-4 mb-16 overflow-x-auto py-4 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border-2 flex-shrink-0 ${
              activeCategory === cat 
                ? 'bg-black text-white border-black shadow-lg scale-105' 
                : 'bg-white text-gray-500 border-gray-100 hover:border-orange-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Magazine Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* Main Article (Large) */}
        <div className="md:col-span-8 space-y-12">
          {filteredStories.map((story) => (
            <div 
              key={story.id} 
              className="group cursor-pointer"
              onClick={() => setSelectedStory(story)}
            >
              <div className="relative rounded-[2.5rem] overflow-hidden mb-6 shadow-xl aspect-video">
                <img 
                  src={story.image || DEFAULT_FOOD_IMAGE} 
                  alt={story.title} 
                  onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_FOOD_IMAGE; }}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-6 left-6 bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-2xl text-xs font-black flex items-center border border-white/20">
                  <span className="text-2xl mr-2">{story.flag}</span>
                  {story.country}
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); alert("Storia salvata!"); }}
                  className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur rounded-2xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Bookmark className="w-5 h-5 text-black" />
                </button>
              </div>
              <div className="px-2">
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight group-hover:text-orange-600 transition-colors">
                  {story.title}
                </h2>
                <p className="text-gray-500 text-lg leading-relaxed mb-6 line-clamp-3">
                  {story.content}
                </p>
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <Utensils className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Origine</p>
                        <p className="text-sm font-bold text-gray-900">{story.country}</p>
                      </div>
                   </div>
                   <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-orange-600 hover:translate-x-2 transition-transform">
                     Leggi tutto <ArrowRight className="w-4 h-4" />
                   </button>
                </div>
              </div>
            </div>
          ))}
          {filteredStories.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-gray-400 font-bold">Nessuna storia trovata per questo continente. Esplora le altre sezioni!</p>
            </div>
          )}
        </div>

        {/* Sidebar Articles (Small) */}
        <div className="md:col-span-4 space-y-12">
          <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100 sticky top-32">
            <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-orange-600" />
              Lo sapevi che?
            </h3>
            <div className="space-y-8">
              {filteredStories.slice(0, 5).map(story => (
                <div 
                  key={story.id} 
                  className="relative pl-6 border-l-2 border-orange-200 cursor-help group"
                  onClick={() => setSelectedStory(story)}
                >
                  <span className="absolute -left-[5px] top-0 w-2 h-2 bg-orange-600 rounded-full"></span>
                  <p className="text-xs font-black text-orange-700 uppercase tracking-widest mb-1">{story.country}</p>
                  <p className="text-sm text-gray-600 font-medium italic leading-relaxed group-hover:text-black transition-colors">
                    "{story.funFact}"
                  </p>
                </div>
              ))}
            </div>
            
            <div className="mt-12 pt-8 border-t border-gray-200">
               <div className="bg-black rounded-3xl p-6 text-white relative overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 opacity-10">
                    <Globe className="w-24 h-24" />
                  </div>
                  <h4 className="text-lg font-black mb-2 leading-tight">MESA <br/>Sustainability</h4>
                  <p className="text-[10px] text-gray-400 font-medium leading-relaxed mb-4">
                    Supportiamo l'economia locale e le tradizioni autentiche. Ogni ordine preserva una ricetta.
                  </p>
                  <button className="text-[10px] font-black uppercase tracking-widest text-orange-500 hover:text-white transition-colors">
                    Scopri di più →
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Story Modal */}
      {selectedStory && (
        <div className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setSelectedStory(null)}></div>
          
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl animate-fade-in-up">
            <button 
              onClick={() => setSelectedStory(null)}
              className="absolute top-8 right-8 p-3 bg-gray-100 rounded-full hover:bg-orange-600 hover:text-white transition-all z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative h-64 md:h-96">
              <img 
                src={selectedStory.image || DEFAULT_FOOD_IMAGE} 
                alt={selectedStory.title} 
                onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_FOOD_IMAGE; }}
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 flex items-center gap-4">
                <span className="text-5xl drop-shadow-lg">{selectedStory.flag}</span>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-orange-600 drop-shadow-sm">{selectedStory.country}</p>
                  <h3 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter">{selectedStory.title}</h3>
                </div>
              </div>
            </div>

            <div className="p-8 md:p-16">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                <div className="md:col-span-8">
                  <p className="text-xl md:text-2xl text-gray-800 font-medium leading-relaxed mb-8 first-letter:text-7xl first-letter:font-black first-letter:text-orange-600 first-letter:mr-3 first-letter:float-left">
                    {selectedStory.content}
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-8">
                    Ogni piatto preparato dai nostri chef in questa tradizione segue passaggi che sono stati perfezionati nel corso di decenni. Su MESA, la qualità non è una scelta, ma un'eredità che proteggiamo insieme a voi.
                  </p>
                </div>
                
                <div className="md:col-span-4 space-y-8">
                  <div className="bg-orange-50 rounded-3xl p-6 border border-orange-100">
                    <h4 className="flex items-center text-sm font-black text-orange-900 uppercase tracking-widest mb-4">
                      <Lightbulb className="w-4 h-4 mr-2" /> Curiosità
                    </h4>
                    <p className="text-sm text-orange-800 italic leading-relaxed">
                      {selectedStory.funFact}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => handleShare(selectedStory.title)}
                      className="w-full py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors"
                    >
                      <Share2 className="w-4 h-4" /> Condividi Storia
                    </button>
                    <button className="w-full py-4 border-2 border-gray-100 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:border-orange-500 transition-colors">
                      <Bookmark className="w-4 h-4" /> Salva nel profilo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Featured Quotes */}
      <div className="mt-24 py-20 px-8 bg-orange-50 rounded-[4rem] text-center border border-orange-100 relative overflow-hidden">
        <div className="absolute top-10 left-10 opacity-5">
           <Quote className="w-32 h-32 text-orange-600" />
        </div>
        <div className="max-w-3xl mx-auto relative z-10">
          <p className="text-3xl md:text-4xl font-black text-orange-900 leading-tight italic mb-10">
            "Il cibo è l'unico linguaggio universale che non ha bisogno di traduzioni, ma solo di un cuore che ascolta."
          </p>
          <div className="flex items-center justify-center gap-3">
             <div className="w-12 h-12 bg-white rounded-full border-4 border-white shadow-lg overflow-hidden">
               <img 
                 src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80" 
                 alt="Nonna Maria" 
                 onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_FOOD_IMAGE; }}
                 className="object-cover w-full h-full" 
               />
             </div>
             <div className="text-left">
               <p className="text-sm font-black text-gray-900">Nonna Maria</p>
               <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">Chef MESA dal 2021</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
