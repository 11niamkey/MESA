
import React, { useState, useEffect } from 'react';
import { Chef, Dish, HeritageStoryResponse } from '../types';
import { X, Sparkles, Music, Wind, Coffee, Heart, Loader2, Quote, Compass } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

interface HeritageJourneyProps {
  chef: Chef;
  dish: Dish;
  onClose: () => void;
}

const DEFAULT_FOOD_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';

export const HeritageJourney: React.FC<HeritageJourneyProps> = ({ chef, dish, onClose }) => {
  const [data, setData] = useState<HeritageStoryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateStory = async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      try {
        const prompt = `
          Agisci come un antropologo del gusto e un poeta gastronomico.
          Racconta la "storia dell'anima" di questo piatto: "${dish.name}" cucinato da "${chef.name}" (${chef.nationality}).
          Lo chef dice di sé: "${chef.fullBio || chef.bio}".
          Ingredienti chiave: "${dish.ingredients?.join(', ') || 'Tradizionali'}".

          Genera un oggetto JSON con:
          1. "story": Un breve paragrafo evocativo che parla delle radici culturali e familiari del piatto.
          2. "sensoryDetails": Una descrizione di ciò che l'utente sentirà al primo morso (profumi, consistenze).
          3. "ritual": Un consiglio su come consumare il piatto (es. "Spegni le luci, accendi una candela...").
          4. "pairing": Una raccomandazione di sottofondo musicale o bevanda.
          
          Usa un tono caloroso, solenne e artigianale. Rispondi SOLO in formato JSON.
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                story: { type: Type.STRING },
                sensoryDetails: { type: Type.STRING },
                ritual: { type: Type.STRING },
                pairing: { type: Type.STRING }
              },
              required: ["story", "sensoryDetails", "ritual", "pairing"]
            }
          }
        });

        const result = JSON.parse(response.text);
        setData(result);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };

    generateStory();
  }, [chef, dish]);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-0 md:p-10 animate-fade-in">
      <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl" onClick={onClose}></div>
      
      <div className="relative w-full max-w-4xl h-full md:h-auto md:max-h-[90vh] bg-white/5 border border-white/10 md:rounded-[4rem] overflow-hidden shadow-[0_0_100px_rgba(234,88,12,0.2)] flex flex-col md:flex-row">
        
        {/* Immagine Piatto laterale */}
        <div className="w-full md:w-2/5 h-64 md:h-auto relative">
          <img 
            src={dish.image || DEFAULT_FOOD_IMAGE} 
            alt={dish.name} 
            onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_FOOD_IMAGE; }}
            className="w-full h-full object-cover grayscale-[0.3] hover:grayscale-0 transition-all duration-1000" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
          <button 
            onClick={onClose}
            className="absolute top-6 left-6 p-4 bg-white/10 hover:bg-orange-600 backdrop-blur-md rounded-2xl text-white transition-all z-20 md:hidden"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="absolute bottom-10 left-10 text-white">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 mb-2">Eredità di</p>
            <h2 className="text-4xl font-black italic tracking-tighter leading-none">{chef.name}</h2>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-3xl">{chef.nationality}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-lg">Piatto del Cuore</span>
            </div>
          </div>
        </div>

        {/* Contenuto Narrativo */}
        <div className="flex-1 p-8 md:p-16 overflow-y-auto custom-scrollbar bg-black/40 backdrop-blur-3xl text-white">
          <button 
            onClick={onClose}
            className="absolute top-10 right-10 p-4 bg-white/5 hover:bg-orange-600 rounded-2xl text-white transition-all hidden md:block"
          >
            <X className="w-6 h-6" />
          </button>

          {loading ? (
            <div className="h-full flex flex-col items-center justify-center gap-6 py-20">
               <div className="relative">
                  <div className="absolute inset-0 bg-orange-600/20 rounded-full blur-2xl animate-pulse"></div>
                  <Loader2 className="w-16 h-16 text-orange-600 animate-spin relative z-10" />
               </div>
               <p className="text-sm font-black uppercase tracking-[0.3em] text-gray-500 animate-pulse text-center">
                  L'AI sta tessendo la storia <br/>delle tradizioni di {chef.name}...
               </p>
            </div>
          ) : data && (
            <div className="space-y-12 animate-fade-in-up">
              <div className="flex items-center gap-3 text-orange-500">
                <Compass className="w-6 h-6" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em]">Viaggio nel Tempo</span>
              </div>

              <section>
                <div className="mb-6 opacity-30">
                  <Quote className="w-12 h-12 rotate-180" />
                </div>
                <p className="text-2xl md:text-3xl font-bold italic leading-relaxed text-gray-200">
                  {data.story}
                </p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-white/10">
                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-orange-500">
                    <Wind className="w-4 h-4" /> Risveglio dei Sensi
                  </h4>
                  <p className="text-sm text-gray-400 leading-relaxed italic">
                    "{data.sensoryDetails}"
                  </p>
                </div>
                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-orange-500">
                    <Music className="w-4 h-4" /> L'Atmosfera
                  </h4>
                  <p className="text-sm text-gray-400 leading-relaxed italic">
                    "{data.pairing}"
                  </p>
                </div>
              </div>

              <div className="bg-orange-600/10 border border-orange-600/30 p-10 rounded-[3rem] relative overflow-hidden group">
                 <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-150 transition-transform duration-700">
                    <Heart className="w-48 h-48" />
                 </div>
                 <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-orange-500 mb-4">
                    <Coffee className="w-4 h-4" /> Il Tuo Rituale MESA
                 </h4>
                 <p className="text-lg font-bold italic text-orange-100 leading-relaxed relative z-10">
                   {data.ritual}
                 </p>
              </div>

              <button 
                onClick={onClose}
                className="w-full py-6 bg-white text-black rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-orange-600 hover:text-white transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3"
              >
                Ho compreso lo spirito. Prenoto.
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
