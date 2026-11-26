
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
    <div className="min-h-screen font-sans selection:bg-orange-100 bg-black text-white flex flex-col items-center justify-center px-4 py-4 sm:px-6 sm:py-5 relative overflow-hidden">
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
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
          className="w-full h-full object-cover opacity-30 object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/30"></div>
      </motion.div>

      <div className="relative z-10 text-center max-w-4xl w-full flex flex-col items-center">
        {/* Logo MESA con fondo arancione e scritta bianca */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="mb-3 sm:mb-4"
        >
          <div className="w-[88px] h-[88px] sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 flex flex-col items-center justify-center shadow-2xl shadow-orange-600/50 border-2 border-orange-400/40 p-2.5 transition-transform hover:scale-105 mx-auto relative group">
            <div className="absolute -inset-2 bg-orange-600/30 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity -z-10"></div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-1 shadow-inner">
              <UtensilsCrossed className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-sm" />
            </div>
            <span className="text-lg sm:text-xl font-black tracking-widest text-white font-sans leading-none drop-shadow-md">
              MESA<span className="text-amber-200 font-extrabold">.</span>
            </span>
            <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-wider bg-white text-orange-600 px-1.5 py-0.5 rounded-full mt-1 shadow-sm whitespace-nowrap">
              Home Chefs
            </span>
          </div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.25 }}
          className="text-2xl sm:text-4xl md:text-5xl font-black italic tracking-tighter leading-tight mb-2 text-white drop-shadow-xl"
        >
          Sapori del mondo,<br />
          <span className="text-orange-500">a casa tua.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
          className="text-xs sm:text-sm md:text-base text-gray-300 font-medium max-w-xl mx-auto mb-5 sm:mb-6 drop-shadow-md"
        >
          Sfoglia i menu dei cuochi attorno a te, ordina piatti fatti in casa veri e riscopri i sapori autentici.
        </motion.p>

        {/* Due Card Compatte e Ben Distinte: Cliente (Arancione MESA) vs Cuoco (Verde Smeraldo) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.55 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-4xl"
        >
          {/* Card 1: Opzione Cliente (Arancione MESA) */}
          <button
            type="button"
            onClick={onEnterApp}
            className="group text-left px-4 py-3.5 sm:px-5 sm:py-4 rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 hover:from-orange-400 hover:to-amber-500 border-2 border-orange-300/60 shadow-[0_0_30px_rgba(234,88,12,0.32)] transition-all transform hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-black/20 backdrop-blur-sm border border-white/25 flex items-center justify-center gap-0.5 shrink-0 shadow-inner">
                <Utensils className="w-4 h-4 text-white" />
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-black text-orange-400 text-[9px] font-black uppercase tracking-widest">
                    Cliente
                  </span>
                </div>
                <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-white leading-tight">
                  VOGLIO ORDINARE (CLIENTE)
                </h2>
                <p className="text-[11px] sm:text-xs font-semibold text-orange-50/95 leading-snug mt-0.5">
                  Scopri i piatti casalinghi vicino a te e ordina
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-black group-hover:translate-x-1 transition-transform shrink-0" />
          </button>

          {/* Card 2: Opzione Cuoco (Verde Smeraldo ben contrastato) */}
          <button
            type="button"
            onClick={onNavigateToBecomeChef}
            className="group text-left px-4 py-3.5 sm:px-5 sm:py-4 rounded-2xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-950 hover:from-emerald-600 hover:to-emerald-900 border-2 border-emerald-400/60 shadow-[0_0_30px_rgba(16,185,129,0.25)] transition-all transform hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-400/20 backdrop-blur-sm border border-emerald-300/40 flex items-center justify-center shrink-0 shadow-inner">
                <ChefHat className="w-6 h-6 text-emerald-200" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-300 text-emerald-950 text-[9px] font-black uppercase tracking-widest">
                    Cuoco
                  </span>
                </div>
                <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-white leading-tight">
                  SONO UN CUOCO (CUCINA E VENDI)
                </h2>
                <p className="text-[11px] sm:text-xs font-semibold text-emerald-100/95 leading-snug mt-0.5">
                  Apri la tua cucina su MESA e ricevi ordini
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-emerald-200 group-hover:translate-x-1 transition-transform shrink-0" />
          </button>
        </motion.div>

        {/* Badge informativi */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.7 }}
          className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[10px] font-black uppercase tracking-widest text-gray-400 bg-black/40 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/10"
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
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.85 }}
            className="mt-3 sm:mt-4"
          >
            <button
              type="button"
              onClick={onAdminAccess}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-violet-950/90 border border-violet-500/30 hover:border-violet-400/60 text-violet-200 hover:text-white text-[11px] font-bold tracking-wide transition-all"
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


