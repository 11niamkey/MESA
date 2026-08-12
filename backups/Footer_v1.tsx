import React, { useState } from 'react';
import { UtensilsCrossed, Facebook, Instagram, Twitter, Heart, Send } from 'lucide-react';
import { ViewState } from '../types';

interface FooterProps {
  onNavigate: (view: ViewState) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert(`Grazie! L'indirizzo ${email} è stato iscritto alla newsletter MESA.`);
      setEmail('');
    }
  };

  return (
    <footer className="bg-black text-white border-t border-orange-900/30 pt-16 pb-24 md:pb-8 animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-6 cursor-pointer group" onClick={() => onNavigate(ViewState.HOME)}>
              <div className="flex items-center gap-2 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white px-3.5 py-2 rounded-2xl shadow-lg shadow-orange-950/50 border border-orange-400/30 group-hover:scale-105 transition-all">
                <div className="w-7 h-7 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                  <UtensilsCrossed className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-black tracking-wider text-white font-sans leading-none">
                  MESA<span className="text-amber-200">.</span>
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              La piattaforma che connette cuochi casalinghi di talento con amanti del cibo autentico.
              <br/><br/>
              <span className="text-orange-500 font-bold">Autenticità certificata.</span>
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Links Column */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Scopri</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><button onClick={() => onNavigate(ViewState.ABOUT)} className="hover:text-orange-500 transition-colors">Chi Siamo</button></li>
              <li><button onClick={() => onNavigate(ViewState.CHEFS)} className="hover:text-orange-500 transition-colors">I Nostri Cuochi</button></li>
              <li><button onClick={() => onNavigate(ViewState.BECOME_CHEF)} className="hover:text-orange-500 transition-colors">Diventa Chef MESA</button></li>
              <li><button onClick={() => onNavigate(ViewState.SAFETY)} className="hover:text-orange-500 transition-colors">Sicurezza & HACCP</button></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Supporto</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><button onClick={() => onNavigate(ViewState.HELP)} className="hover:text-orange-500 transition-colors">Centro Assistenza</button></li>
              <li><button onClick={() => onNavigate(ViewState.SAFETY)} className="hover:text-orange-500 transition-colors">Termini di Servizio</button></li>
              <li><button onClick={() => onNavigate(ViewState.SAFETY)} className="hover:text-orange-500 transition-colors">Informativa Privacy</button></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Iscriviti alla Newsletter</h4>
            <p className="text-xs text-gray-400 mb-4">Ricevi in anteprima i piatti del giorno e le storie dei cuochi del tuo quartiere.</p>
            <form onSubmit={handleSubscribe} className="flex flex-col space-y-2">
              <input 
                type="email" 
                placeholder="La tua email..." 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-3 bg-neutral-900 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
              />
              <button type="submit" className="px-4 py-3 bg-orange-600 hover:bg-orange-500 text-black font-black uppercase tracking-wider text-xs rounded-xl transition-all flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Iscriviti
              </button>
            </form>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 text-center text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} MESA Inc. Tutti i diritti riservati.</p>
          <div className="flex items-center gap-1 text-gray-400">
            Fatto con <Heart className="w-3.5 h-3.5 text-red-500 fill-current mx-0.5" /> per la cucina di casa
          </div>
        </div>
      </div>
    </footer>
  );
};
