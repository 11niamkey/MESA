
import React from 'react';
import { 
  ShieldCheck, 
  ChefHat, Utensils, UtensilsCrossed,
  MapPin, ShoppingBag, Share2, Lock, ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps {
  onEnterApp: () => void;
  onNavigateToBecomeChef: () => void;
  onShareClick: () => void;
  onAdminAccess?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  onNavigateToBecomeChef,
  onShareClick,
  onAdminAccess
}) => {
  return (
    <div className="min-h-screen font-sans selection:bg-orange-100 bg-black text-white flex flex-col items-center justify-center p-6 sm:p-10 relative overflow-hidden">
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
          className="mb-7"
        >
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 flex flex-col items-center justify-center shadow-2xl shadow-orange-600/50 border-2 border-orange-400/40 p-4 transition-transform hover:scale-105 mx-auto relative group">
            <div className="absolute -inset-2 bg-orange-600/30 rounded-[3rem] blur-xl opacity-60 group-hover:opacity-100 transition-opacity -z-10"></div>
            <div className="w-11 h-11 md:w-14 md:h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-1.5 shadow-inner">
              <UtensilsCrossed className="w-6 h-6 md:w-8 md:h-8 text-white drop-shadow-sm" />
            </div>
            <span className="text-3xl md:text-4xl font-black tracking-widest text-white font-sans leading-none drop-shadow-md">
              MESA<span className="text-amber-200 font-extrabold">.</span>
            </span>
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest bg-white text-orange-600 px-2.5 py-0.5 rounded-full mt-2 shadow-sm">
              Home Chefs
            </span>
          </div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          className="text-4xl sm:text-5xl md:text-7xl font-black italic tracking-tighter leading-none mb-5 text-white drop-shadow-xl"
        >
          Sapori del mondo,<br />
          <span className="text-orange-500">a casa tua.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
          className="text-base sm:text-lg md:text-xl text-gray-300 font-medium max-w-2xl mx-auto mb-10 drop-shadow-md"
        >
          Sfoglia i menu dei cuochi attorno a te, ordina piatti fatti in casa veri e riscopri i sapori autentici.
        </motion.p>

        {/* Due Card Principali Ben Distinte: Cliente (Arancione MESA) vs Cuoco (Verde Smeraldo) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-3xl"
        >
          {/* Card 1: Opzione Cliente (Arancione MESA) */}
          <button
            type="button"
            onClick={onEnterApp}
            className="group text-left p-6 sm:p-7 rounded-[2rem] bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 hover:from-orange-400 hover:to-amber-500 border-2 border-orange-300/60 shadow-[0_0_45px_rgba(234,88,12,0.38)] transition-all transform hover:-translate-y-1 active:scale-[0.98] flex flex-col justify-between gap-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="w-14 h-14 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/25 flex items-center justify-center gap-1 shrink-0 shadow-inner">
                <Utensils className="w-5 h-5 text-white" />
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span className="px-3 py-1 rounded-full bg-black text-orange-400 text-[10px] font-black uppercase tracking-widest shadow-sm">
                Cliente
              </span>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white leading-snug mb-1.5">
                VOGLIO ORDINARE (CLIENTE)
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-orange-50/95 leading-relaxed">
                Scopri i piatti casalinghi vicino a te e ordina
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-white/20 text-xs font-black uppercase tracking-widest text-black">
              <span>Entra in MESA</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 2: Opzione Cuoco (Verde Smeraldo ben contrastato) */}
          <button
            type="button"
            onClick={onNavigateToBecomeChef}
            className="group text-left p-6 sm:p-7 rounded-[2rem] bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-950 hover:from-emerald-600 hover:to-emerald-900 border-2 border-emerald-400/60 shadow-[0_0_45px_rgba(16,185,129,0.28)] transition-all transform hover:-translate-y-1 active:scale-[0.98] flex flex-col justify-between gap-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-400/20 backdrop-blur-sm border border-emerald-300/40 flex items-center justify-center shrink-0 shadow-inner">
                <ChefHat className="w-8 h-8 text-emerald-200" />
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-300 text-emerald-950 text-[10px] font-black uppercase tracking-widest shadow-sm">
                Cuoco
              </span>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white leading-snug mb-1.5">
                SONO UN CUOCO (CUCINA E VENDI)
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-emerald-100/95 leading-relaxed">
                Apri la tua cucina su MESA e ricevi ordini
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-emerald-400/25 text-xs font-black uppercase tracking-widest text-emerald-200">
              <span>Diventa Cuoco</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </motion.div>

        {/* Badge informativi */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 1.1 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[10px] font-black uppercase tracking-widest text-gray-400 bg-black/40 backdrop-blur-sm px-8 py-4 rounded-full border border-white/10"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-orange-500" />
            <span className="hidden sm:inline">Cucine</span> Certificate
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-500" />
            <span className="hidden sm:inline">Solo Cuochi</span> Locali
          </div>
          <button type="button" onClick={onShareClick} className="flex items-center gap-2 hover:text-orange-500 transition-colors">
            <Share2 className="w-4 h-4" /> Scopri di più
          </button>
        </motion.div>

        {/* Accesso Admin discreto e separato in fondo */}
        {onAdminAccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 1.25 }}
            className="mt-6"
          >
            <button
              type="button"
              onClick={onAdminAccess}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-violet-950/90 border border-violet-500/30 hover:border-violet-400/60 text-violet-200 hover:text-white text-[11px] font-bold tracking-wide transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-violet-400 shrink-0" />
              <Lock className="w-3 h-3 text-violet-300 shrink-0" />
              <span>Area Admin (Solo Staff)</span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};


