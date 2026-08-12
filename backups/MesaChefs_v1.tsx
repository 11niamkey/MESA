import React from 'react';
import { Chef } from '../types';
import { MapPin, ArrowRight, ShieldCheck, Award, Users } from 'lucide-react';

interface MesaChefsProps {
  chefs: Chef[];
  onViewProfile: (chef: Chef) => void;
}

export const MesaChefs: React.FC<MesaChefsProps> = ({ chefs, onViewProfile }) => {
  return (
    <div className="animate-fade-in pb-12">
      {/* Hero Section for Chefs */}
      <div className="relative bg-black rounded-3xl p-8 md:p-12 mb-12 overflow-hidden border border-orange-900 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600 rounded-full opacity-10 blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-500 rounded-full opacity-10 blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-bold uppercase tracking-widest">
            <ShieldCheck className="w-3 h-3 mr-2" />
            Verificati & Approvati
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            I Nostri Cuochi <span className="text-orange-500">MESA</span>
          </h2>
          <p className="text-lg text-gray-400 leading-relaxed mb-8">
            Non semplici appassionati, ma professionisti del gusto. Ogni cuoco MESA è selezionato dalla nostra comunità,
            certificato per gli standard di sicurezza e celebrato per l'autenticità dei suoi piatti.
          </p>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Scelti dalla Comunità</h3>
          <p className="text-sm text-gray-500">Solo i cuochi con recensioni eccellenti e approvazione locale entrano in MESA.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Sicurezza Certificata</h3>
          <p className="text-sm text-gray-500">Ogni cucina è verificata e ogni cuoco possiede certificazioni HACCP aggiornate.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <Award className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Autenticità Garantita</h3>
          <p className="text-sm text-gray-500">Nessuna imitazione. Solo ricette originali tramandate e ingredienti verificati.</p>
        </div>
      </div>

      {/* Chefs Grid */}
      <h3 className="text-2xl font-bold text-gray-900 mb-8 border-l-4 border-orange-500 pl-4">Esplora i Talenti</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {chefs.map((chef) => (
          <div 
            key={chef.id} 
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full"
          >
            {/* Image Header with Flag Overlay */}
            <div className="relative h-72 overflow-hidden bg-gray-100">
              <img 
                src={chef.avatar} 
                alt={chef.name} 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-3xl shadow-sm">{chef.nationality}</span>
                    <span className="px-2 py-0.5 bg-orange-600 text-[10px] font-bold uppercase rounded text-white tracking-wider">Verificato</span>
                </div>
                <h3 className="text-2xl font-bold">{chef.name}</h3>
                <div className="flex items-center text-sm text-gray-300 mt-1">
                  <MapPin className="w-3 h-3 mr-1" />
                  {chef.location}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow bg-white">
              <div className="mb-4">
                <h4 className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2 flex items-center">
                    <Award className="w-3 h-3 mr-1" />
                    La sua storia
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {chef.fullBio || chef.bio}
                </p>
              </div>

              {/* Specialties */}
              <div className="flex flex-wrap gap-2 mb-6">
                {chef.specialties.slice(0, 3).map(spec => (
                  <span key={spec} className="px-2 py-1 bg-black text-white text-xs font-medium rounded-md">
                    {spec}
                  </span>
                ))}
              </div>

              {/* Action */}
              <button 
                onClick={() => onViewProfile(chef)}
                className="mt-auto w-full py-3 bg-black text-white font-bold rounded-xl flex items-center justify-center space-x-2 border-2 border-transparent hover:border-orange-500 hover:text-orange-500 transition-all"
              >
                <span>Scopri il Menu</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
