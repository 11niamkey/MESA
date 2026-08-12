import React from 'react';
import { 
  ShieldCheck, 
  ChefHat, Utensils, 
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
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="mb-8"
        >
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] overflow-hidden bg-black shadow-2xl transition-transform hover:scale-105 outline outline-2 outline-white/10 mx-auto">
            <img src="/images/mesa_logo_type.png" alt="MESA Logo" className="w-full h-full object-cover" />
          </div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          className="text-5xl md:text-8xl font-black italic tracking-tighter leading-none mb-6 text-white drop-shadow-xl"
        >
          Sapori del mondo,<br />
          <span className="text-orange-500">a casa tua.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
          className="text-lg md:text-2xl text-gray-300 font-medium max-w-2xl mx-auto mb-12 drop-shadow-md"
        >
          Sfoglia i menu dei cuochi attorno a te, ordina piatti fatti in casa veri e riscopri i sapori autentici.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-xl"
        >
          <button 
            onClick={onEnterApp}
            className="w-full sm:w-auto px-10 py-6 text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-105 active:scale-95 transition-all bg-orange-600 shadow-[0_0_40px_rgba(234,88,12,0.4)] flex items-center justify-center gap-3"
          >
            <ShoppingBag className="w-5 h-5" /> Entra in Mesa
          </button>
          
          <button 
            onClick={onNavigateToBecomeChef}
            className="w-full sm:w-auto px-10 py-6 bg-white/10 backdrop-blur-md border border-white/20 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-white hover:text-black active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <ChefHat className="w-5 h-5" /> Diventa Cuoco
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 1.2 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[10px] font-black uppercase tracking-widest text-gray-400 bg-black/40 backdrop-blur-sm px-8 py-4 rounded-full border border-white/10"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-orange-500" />
            <span className="hidden sm:inline">Cucine</span> Certificate
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-500" />
            <span className="hidden sm:inline">Solo Cuochi</span> Locali
          </div>
          <button onClick={onShareClick} className="flex items-center gap-2 hover:text-orange-500 transition-colors">
            <Share2 className="w-4 h-4" /> Scopri di più
          </button>
        </motion.div>
      </div>
    </div>
  );
};
