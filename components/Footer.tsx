
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
                  MESA<span className="text-amber-200 font-extrabold">.</span>
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
              <li><button onClick={() => onNavigate(ViewState.TERMS)} className="hover:text-orange-500 transition-colors">Termini & Condizioni</button></li>
              <li><button onClick={() => onNavigate(ViewState.PRIVACY)} className="hover:text-orange-500 transition-colors">Privacy Policy</button></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Resta Aggiornato</h4>
            <p className="text-gray-400 text-sm mb-4">Ricevi le offerte speciali e i nuovi menu settimanali.</p>
            <form onSubmit={handleSubscribe} className="flex">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="La tua email" 
                className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-l-lg w-full focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm"
                required
              />
              <button type="submit" className="bg-orange-600 text-black font-bold px-4 py-2 rounded-r-lg hover:bg-orange-500 transition-colors text-sm flex items-center">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-xs mb-4 md:mb-0 flex items-center">
            © 2024 MESA Inc. Fatto con <Heart className="w-3 h-3 mx-1 text-red-500 fill-current" /> per il buon cibo.
          </p>
          <div className="flex items-center text-xs text-gray-600 bg-gray-900 px-3 py-1.5 rounded-full border border-gray-800">
            <span>Versione Beta 1.0.5 • <span className="text-orange-500 font-bold">In Produzione</span></span>
          </div>
        </div>
      </div>
    </footer>
  );
};
