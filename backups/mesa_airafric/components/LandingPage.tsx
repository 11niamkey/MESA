
import React from 'react';
import { 
  ShieldCheck, 
  ChefHat, Utensils, UtensilsCrossed,
  MapPin, ShoppingBag, Share2 
} from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps {
  onEnterApp: () => void;
  onNavigateToBecomeChef: () => void;
  onShareClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onNavigateToBecomeChef, onShareClick }) => {
  return (
    <div className="min-h-screen font-sans selection:bg-orange-100 bg-black text-white flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
      {/* Sfondo */}
      <motion.div 
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <img 
          src="https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&w=1920&q=80" 
          alt="Cucina Autentica" 
          className="w-full h-full object-cover opacity-30 object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/30"></div>
      </motion.div>

      <div className="relative z-10 text-center max-w-4xl w-full flex flex-col items-center">
        {/* Logo MESA con fondo arancione e scritta bianca */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="mb-8"
        >
          <div className="w-36 h-36 md:w-44 md:h-44 rounded-[2.5rem] bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 flex flex-col items-center justify-center shadow-2xl shadow-orange-600/50 border-2 border-orange-400/40 p-4 transition-transform hover:scale-105 mx-auto relative group">
            <div className="absolute -inset-2 bg-orange-600/30 rounded-[3rem] blur-xl opacity-60 group-hover:opacity-100 transition-opacity -z-10"></div>
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-1.5 shadow-inner">
              <UtensilsCrossed className="w-7 h-7 md:w-9 md:h-9 text-white drop-shadow-sm" />
            </div>
            <span className="text-3xl md:text-4xl font-black tracking-widest text-white font-sans leading-none drop-shadow-md flex items-center justify-center gap-1">
              MESA<span className="text-amber-200 font-black text-sm uppercase tracking-widest bg-black/40 px-2 py-0.5 rounded-lg border border-white/20">AirAFRIC</span>
            </span>
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest bg-amber-400 text-black px-2.5 py-0.5 rounded-full mt-2 shadow-sm flex items-center gap-1">
              <span>🌍</span> Chefs & Gastronomia Africana
            </span>
          </div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          className="text-4xl md:text-7xl lg:text-8xl font-black italic tracking-tighter leading-none mb-6 text-white drop-shadow-xl"
        >
          L'Anima dell'Africa,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500">a casa tua.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
          className="text-base md:text-2xl text-gray-300 font-medium max-w-2xl mx-auto mb-12 drop-shadow-md leading-relaxed"
        >
          Dall'Attiéké ivoriano al Thieboudienne, dal Jollof al Doro Wat. Scopri i migliori cuochi e chef della tradizione africana nel tuo quartiere.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-xl"
        >
          <button 
            onClick={onEnterApp}
            className="w-full sm:w-auto px-10 py-6 text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-105 active:scale-95 transition-all bg-gradient-to-r from-amber-400 to-orange-500 shadow-[0_0_40px_rgba(234,88,12,0.4)] flex items-center justify-center gap-3"
          >
            <ShoppingBag className="w-5 h-5" /> Entra in MESA AirAFRIC
          </button>
          
          <button 
            onClick={onNavigateToBecomeChef}
            className="w-full sm:w-auto px-10 py-6 bg-white/10 backdrop-blur-md border border-white/20 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-white hover:text-black active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <ChefHat className="w-5 h-5" /> Proponiti come Cuoco / Chef
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 1.2 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[10px] font-black uppercase tracking-widest text-gray-400 bg-black/40 backdrop-blur-sm px-8 py-4 rounded-full border border-white/10"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">Cotture</span> Autentiche & Slow Cook
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-500" />
            <span className="hidden sm:inline">West Africa, Corno & Maghreb</span>
          </div>
          <button onClick={onShareClick} className="flex items-center gap-2 hover:text-orange-500 transition-colors">
            <Share2 className="w-4 h-4" /> Condividi MESA AirAFRIC
          </button>
        </motion.div>
      </div>
    </div>
  );
};


