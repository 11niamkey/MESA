
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Sparkles, Loader2, ChefHat, Info } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

export const AiConcierge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: "Ciao! Sono il Concierge di MESA. Posso aiutarti a scegliere un piatto o darti informazioni sui nostri cuochi?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: "Sei l'AI Concierge di MESA, un'app premium di food delivery da cuochi casalinghi. Sei raffinato, amichevole e molto esperto di tradizioni culinarie. Rispondi in modo conciso e invoglia l'utente a ordinare piatti autentici.",
        }
      });
      setMessages(prev => [...prev, { role: 'ai', text: response.text || "Scusa, ho avuto un piccolo intoppo in cucina. Puoi ripetere?" }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: "Al momento sono un po' occupato ai fornelli. Riprova tra poco!" }]);
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[90]">
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-black text-white p-5 rounded-full shadow-2xl hover:bg-orange-600 transition-all active:scale-90 group relative"
        >
          <div className="absolute -top-2 -right-2 bg-orange-600 text-black px-2 py-0.5 rounded-full text-[9px] font-black border-2 border-white animate-bounce">
            AI
          </div>
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="bg-white w-[350px] sm:w-[400px] h-[500px] rounded-[3rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-fade-in-up">
          <div className="bg-black p-6 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="bg-orange-600 p-2 rounded-xl">
                <Sparkles className="w-4 h-4 text-black" />
              </div>
              <div>
                <h4 className="font-black italic tracking-tight">Concierge MESA</h4>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-orange-500">Online Support</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50 custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium shadow-sm ${
                  m.role === 'user' ? 'bg-orange-600 text-black rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-orange-600 animate-spin" />
                  <span className="text-xs font-bold text-gray-400">Sta pensando...</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50 rounded-2xl p-2 border border-gray-100 focus-within:border-orange-500 transition-all">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Chiedi al Concierge..." 
                className="flex-1 bg-transparent px-3 py-2 text-sm font-medium outline-none"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className="bg-black text-white p-2.5 rounded-xl hover:bg-orange-600 transition-all active:scale-90 disabled:opacity-30"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[9px] text-center text-gray-400 font-bold uppercase tracking-widest mt-3">
              Alimentato da MESA Intelligent Core v4.7
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
