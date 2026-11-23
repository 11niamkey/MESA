
import React, { useState } from 'react';
import { ChevronRight, X, Sparkles, ShieldCheck, Heart } from 'lucide-react';

interface LaunchTourProps {
  onComplete: () => void;
}

export const LaunchTour: React.FC<LaunchTourProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Benvenuto su MESA",
      description: "La prima piattaforma che porta l'eccellenza delle cucine casalinghe direttamente sulla tua tavola.",
      icon: <Sparkles className="w-12 h-12 text-orange-500" />,
      color: "bg-orange-50"
    },
    {
      title: "Sicurezza Certificata",
      description: "Ogni cuoco è verificato e possiede certificazione HACCP. Mangia sano, mangia sicuro.",
      icon: <ShieldCheck className="w-12 h-12 text-green-500" />,
      color: "bg-green-50"
    },
    {
      title: "Supporta il Talento Locale",
      description: "Ordina piatti unici che non troveresti mai in un ristorante tradizionale. Sostieni i talenti culinari locali.",
      icon: <Heart className="w-12 h-12 text-red-500" />,
      color: "bg-red-50"
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Reduced opacity from 90% to 75% for better context and visibility */}
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm animate-fade-in" onClick={onComplete} />
      <div className="relative bg-white w-full max-w-lg rounded-[3.5rem] shadow-2xl overflow-hidden animate-fade-in-up">
        <button 
          onClick={onComplete}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-black z-10 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className={`p-12 ${steps[step].color} transition-colors duration-500 flex flex-col items-center text-center`}>
          <div className="mb-8 p-6 bg-white rounded-[2rem] shadow-xl">
            {steps[step].icon}
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4 italic tracking-tight">{steps[step].title}</h2>
          <p className="text-gray-600 font-medium leading-relaxed">{steps[step].description}</p>
        </div>
        
        <div className="p-8 bg-white flex items-center justify-between">
          <div className="flex gap-2">
            {steps.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${step === i ? 'w-8 bg-orange-600' : 'w-2 bg-gray-200'}`} />
            ))}
          </div>
          <button 
            onClick={() => step < steps.length - 1 ? setStep(step + 1) : onComplete()}
            className="flex items-center gap-2 px-8 py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-orange-600 transition-all active:scale-95"
          >
            {step === steps.length - 1 ? 'Inizia a Gustare' : 'Avanti'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
