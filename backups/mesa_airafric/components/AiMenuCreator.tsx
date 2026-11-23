import React, { useState } from 'react';
import { Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { generateMenuFromIngredients } from '../services/geminiService';
import { AiMenuResponse } from '../types';

export const AiMenuCreator: React.FC = () => {
  const [ingredients, setIngredients] = useState('');
  const [style, setStyle] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiMenuResponse | null>(null);

  const handleGenerate = async () => {
    if (!ingredients.trim()) return;
    
    setLoading(true);
    setResult(null);
    
    // Simulate delay if API is super fast, for UX
    const response = await generateMenuFromIngredients(ingredients, style || 'Tradizionale Casalingo');
    
    setResult(response);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-gradient-to-br from-purple-700 to-indigo-800 rounded-3xl p-8 text-white shadow-2xl mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-white/20 rounded-lg">
            <Sparkles className="w-6 h-6 text-yellow-300" />
          </div>
          <h2 className="text-2xl font-bold">Assistente Menu AI</h2>
        </div>
        <p className="text-indigo-100 mb-6">
          Sei un cuoco? Non sai come presentare il tuo piatto? Inserisci gli ingredienti che hai in frigo 
          e lascia che Gemini crei per te un nome gourmet, una descrizione invitante e un prezzo consigliato.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-indigo-200 mb-1">Ingredienti disponibili</label>
            <input
              type="text"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="es. Zucchine, uova, pecorino, menta"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-indigo-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-indigo-200 mb-1">Stile cucina (opzionale)</label>
            <input
              type="text"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              placeholder="es. Rustico, Moderno, Vegano"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-indigo-300"
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !ingredients}
          className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 text-indigo-900 font-bold rounded-xl transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>L'AI sta cucinando le idee...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Genera Piatto</span>
            </>
          )}
        </button>
      </div>

      {result && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in-up">
          <div className="p-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-600 font-semibold mb-2">Risultato Suggerito</div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">{result.dishName}</h3>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {result.tags.map((tag, idx) => (
                <span key={idx} className="px-3 py-1 bg-purple-50 text-purple-700 text-sm font-medium rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-6">
              <p className="text-gray-700 italic text-lg leading-relaxed">"{result.description}"</p>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-6">
              <div>
                <span className="text-sm text-gray-500">Prezzo Consigliato</span>
                <div className="text-2xl font-bold text-green-600">€ {result.suggestedPrice.toFixed(2)}</div>
              </div>
              <button className="flex items-center space-x-2 text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">
                <span>Usa questo menu</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
