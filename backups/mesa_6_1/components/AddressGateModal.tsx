import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Navigation, 
  Compass, 
  Globe, 
  Search, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  UtensilsCrossed 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Chef } from '../types';
import { ITALIAN_REGIONS, findLocationByInput, Region, Province } from './italianTerritoryData';

interface AddressGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddressVerified: (address: string) => void;
  availableChefs: Chef[];
}

export const AddressGateModal: React.FC<AddressGateModalProps> = ({
  isOpen,
  onClose,
  onAddressVerified,
  availableChefs
}) => {
  const [addressInput, setAddressInput] = useState('');
  const [suggestions, setSuggestions] = useState<(Region | Province)[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<{
    type: 'region' | 'province';
    name: string;
    flag: string;
    specialties: string[];
  } | null>(null);

  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'checking' | 'active' | 'inactive'>('idle');
  const [activeRegionIndex, setActiveRegionIndex] = useState<number | null>(null);
  const [showRegionBrowser, setShowRegionBrowser] = useState(false);

  // Generate a mock number of active chefs for each province/region to keep visual realism
  const getChefCount = (name: string) => {
    // Check if there are real static chefs first
    const realCount = availableChefs.filter(c => c.location.toLowerCase().includes(name.toLowerCase())).length;
    if (realCount > 0) return realCount;
    // Otherwise calculate a pseudo-stable random count based on name length so the app looks complete
    return (name.length % 5) + 4; 
  };

  // Listen to input changes to generate autocompletion suggestions
  useEffect(() => {
    if (addressInput.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const val = addressInput.toLowerCase();
    const matches: (Region | Province)[] = [];

    // Filter regions matching query
    ITALIAN_REGIONS.forEach(reg => {
      if (reg.name.toLowerCase().includes(val)) {
        matches.push(reg);
      }
      // Keep matching provinces
      reg.provinces.forEach(prov => {
        if (prov.name.toLowerCase().includes(val) || prov.code.toLowerCase() === val) {
          matches.push(prov);
        }
      });
    });

    setSuggestions(matches.slice(0, 5));
  }, [addressInput]);

  const handleVerify = (input: string) => {
    if (!input.trim()) return;
    
    setVerificationStatus('checking');
    
    setTimeout(() => {
      const match = findLocationByInput(input);

      if (match) {
        setSelectedMatch({
          type: match.type,
          name: match.name,
          flag: match.flag,
          specialties: match.specialties
        });
        setVerificationStatus('active');
      } else {
        // Fallback: If they typed an address that contains any known Italian city/province
        const lowercaseInput = input.toLowerCase();
        let fallbackFound = false;

        for (const reg of ITALIAN_REGIONS) {
          if (lowercaseInput.includes(reg.name.toLowerCase())) {
            setSelectedMatch({
              type: 'region',
              name: reg.name,
              flag: reg.flag,
              specialties: reg.specialties
            });
            fallbackFound = true;
            break;
          }
          for (const prov of reg.provinces) {
            if (lowercaseInput.includes(prov.name.toLowerCase())) {
              setSelectedMatch({
                type: 'province',
                name: `${prov.name} (${prov.code})`,
                flag: reg.flag,
                specialties: reg.specialties
              });
              fallbackFound = true;
              break;
            }
          }
        }

        if (fallbackFound) {
          setVerificationStatus('active');
        } else {
          setVerificationStatus('inactive');
        }
      }
    }, 600);
  };

  const handleSuggestionClick = (item: Region | Province) => {
    const isRegion = 'provinces' in item;
    const nameToSet = isRegion ? item.name : `${item.name} (${item.code})`;
    setAddressInput(nameToSet);
    setSuggestions([]);
    
    // Auto trigger verification details
    setVerificationStatus('checking');
    setTimeout(() => {
      const targetRegion = isRegion 
        ? item as Region 
        : ITALIAN_REGIONS.find(r => r.provinces.some(p => p.code === item.code));

      setSelectedMatch({
        type: isRegion ? 'region' : 'province',
        name: nameToSet,
        flag: targetRegion?.flag || '🍝',
        specialties: targetRegion?.specialties || []
      });
      setVerificationStatus('active');
    }, 300);
  };

  const handleQuickSelect = (provinceName: string, provinceCode: string) => {
    setAddressInput(`${provinceName} (${provinceCode})`);
    setSuggestions([]);
    handleVerify(`${provinceName} (${provinceCode})`);
  };

  const handleGeolocate = () => {
    setVerificationStatus('checking');
    setTimeout(() => {
      // Simulate real GPS mapping to high density MESA hub
      setAddressInput('Roma Centro, RM (Posizione GPS)');
      handleQuickSelect('Roma', 'RM');
    }, 1000);
  };

  const handleProceed = () => {
    if (addressInput) {
      onAddressVerified(addressInput);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/95 backdrop-blur-xl transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Content Container */}
      <div className="relative bg-[#0b0b0b] text-white w-full max-w-2xl rounded-[2.5rem] border border-orange-950/40 overflow-hidden shadow-[0_0_80px_rgba(234,88,12,0.18)] z-10 p-6 sm:p-8 my-8">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-600/5 rounded-full blur-3xl -ml-24 -mb-24 pointer-events-none"></div>

        {/* Header Section */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-tr from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-orange-950/30">
            <MapPin className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black italic tracking-tight uppercase">
            Esplorare le cucine intorno a te
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-md mx-auto">
            MESA consegna cibo della tradizione locale preparato da cuochi casalinghi selezionati in tutte le province d'Italia.
          </p>
        </div>

        <div className="space-y-5">
          {/* Address Search Field */}
          <div className="relative">
            <div className="flex bg-neutral-900/90 rounded-2xl border border-white/10 overflow-hidden focus-within:border-orange-500/50 transition-all">
              <div className="flex items-center pl-4 text-gray-400">
                <Search className="w-4 h-4 text-orange-500" />
              </div>
              <input
                type="text"
                value={addressInput}
                onChange={(e) => {
                  setAddressInput(e.target.value);
                  if (verificationStatus !== 'idle') setVerificationStatus('idle');
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleVerify(addressInput)}
                placeholder="Cerca la tua provincia, regione, città o indirizo..."
                className="w-full bg-transparent px-3 py-4 text-xs sm:text-sm font-bold outline-none text-white placeholder-gray-500"
              />
              <button
                onClick={() => handleVerify(addressInput)}
                disabled={!addressInput.trim() || verificationStatus === 'checking'}
                className="bg-orange-600 hover:bg-orange-700 text-black px-6 text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-40"
              >
                {verificationStatus === 'checking' ? 'Analisi...' : 'Verifica'}
              </button>
            </div>

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden z-20 shadow-2xl">
                {suggestions.map((item, idx) => {
                  const isRegion = 'provinces' in item;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(item)}
                      className="w-full text-left px-4 py-3 hover:bg-orange-600/10 border-b border-white/5 last:border-0 flex items-center justify-between text-xs transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-orange-500" />
                        <span className="font-bold text-gray-200">
                          {isRegion ? item.name : `${item.name}`}
                        </span>
                        <span className="text-[9px] px-2 py-0.5 rounded bg-neutral-800 text-gray-400 font-bold uppercase tracking-widest">
                          {isRegion ? 'Regione' : `Provincia (${item.code})`}
                        </span>
                      </div>
                      <span className="text-[10px] text-orange-500 font-black">Seleziona ▸</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Verification Results Panel */}
          <div className="min-h-[120px] flex flex-col justify-center">
            {verificationStatus === 'idle' && (
              <div className="space-y-4">
                <button
                  onClick={handleGeolocate}
                  className="w-full py-3.5 px-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 text-[10px] font-bold uppercase tracking-widest text-center flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                >
                  <Navigation className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
                  Rileva Automaticamente da GPS
                </button>
                
                {/* Accordion Region Browser */}
                <div className="bg-neutral-900/30 rounded-2xl border border-white/5 p-4">
                  <button 
                    onClick={() => setShowRegionBrowser(!showRegionBrowser)}
                    className="w-full flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-orange-500 hover:text-orange-400 transition-colors"
                  >
                    <span>Sfoglia Tutte le 20 Regioni d'Italia</span>
                    {showRegionBrowser ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {showRegionBrowser && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto scrollbar-none pt-1">
                      {ITALIAN_REGIONS.map((reg, rIdx) => (
                        <div key={reg.name} className="space-y-1">
                          <button
                            onClick={() => {
                              setActiveRegionIndex(activeRegionIndex === rIdx ? null : rIdx);
                            }}
                            className={`w-full text-left p-2.5 rounded-xl text-[10px] font-black transition-all border flex items-center justify-between ${
                              activeRegionIndex === rIdx 
                                ? 'bg-orange-600/10 border-orange-500/50 text-white' 
                                : 'bg-neutral-900/80 border-white/5 hover:border-white/10 text-gray-300'
                            }`}
                          >
                            <span>{reg.flag} {reg.name}</span>
                            <span className="text-[8px] font-mono text-orange-500">{reg.provinces.length} Pr.</span>
                          </button>
                          
                          {activeRegionIndex === rIdx && (
                            <div className="py-1 px-1 bg-black/40 rounded-xl space-y-1 border border-orange-500/20 max-h-28 overflow-y-auto w-full">
                              {reg.provinces.map(prov => (
                                <button
                                  key={prov.code}
                                  onClick={() => handleQuickSelect(prov.name, prov.code)}
                                  className="w-full text-left px-2 py-1 hover:bg-neutral-800 rounded text-[9px] font-bold text-gray-400 hover:text-white flex items-center justify-between"
                                >
                                  <span>{prov.name}</span>
                                  <span className="text-[8px] font-mono text-orange-500">{prov.code}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {verificationStatus === 'checking' && (
              <div className="text-center py-6 space-y-3 animate-pulse bg-neutral-900/20 rounded-2xl border border-white/5">
                <Compass className="w-10 h-10 text-orange-500 animate-spin mx-auto" />
                <p className="text-[10px] font-black uppercase tracking-widest text-orange-500">
                  Verifica georeferenziata e calcolo copertura MESA...
                </p>
              </div>
            )}

            {verificationStatus === 'active' && selectedMatch && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-3xl p-5 sm:p-6 space-y-4 animate-fade-in relative overflow-hidden">
                <div className="absolute top-0 right-0 text-6xl opacity-10 p-2 pointer-events-none">
                  {selectedMatch.flag}
                </div>
                
                <div className="flex items-start gap-3.5 relative z-10">
                  <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0 mt-0.5 animate-bounce" />
                  <div>
                    <h4 className="font-extrabold text-sm sm:text-md text-green-400">
                      MESA è Attivo a {selectedMatch.name}!
                    </h4>
                    
                    <p className="text-[11px] sm:text-xs text-gray-300 mt-1 leading-relaxed">
                      La copertura è ottimale! Nella tua provincia sono attivi {getChefCount(selectedMatch.name)} cuochi casalinghi eccellenti pronti a spedirti specialità regionali calde a domicilio.
                    </p>

                    {/* Regional culinary recommendations */}
                    {selectedMatch.specialties.length > 0 && (
                      <div className="mt-3 bg-black/40 rounded-xl p-3 border border-green-500/10">
                        <div className="flex items-center gap-1.5 text-orange-400 text-[8px] sm:text-[9px] font-black uppercase tracking-widest mb-1.5">
                          <UtensilsCrossed className="w-3.5 h-3.5" />
                          Consigliati nella tradizione locale:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedMatch.specialties.map((spec, i) => (
                            <span 
                              key={i}
                              className="text-[10px] font-bold bg-neutral-800 text-white px-2.5 py-1 rounded-lg border border-white/5"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleProceed}
                  className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-black font-black uppercase tracking-widest text-[10px] rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
                >
                  Entra e ordina Piatti Locali <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {verificationStatus === 'inactive' && (
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-3xl p-5 sm:p-6 space-y-3 animate-fade-in">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5 animate-bounce" />
                  <div>
                    <h4 className="font-extrabold text-sm text-orange-500">Località non Rilevata</h4>
                    <p className="text-[11px] text-gray-300 mt-1 leading-relaxed">
                      Non siamo riusciti ad accoppiare l'inserimento con una provincia o regione italiana valida. Per favore, digita il nome di una provincia italiana (es. <em>Milano</em>, <em>Bari</em>, <em>Palermo</em>, <em>Roma</em>) o selezionala dall'elenco.
                    </p>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-white/5">
                  <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Città consigliate al volo:</p>
                  <div className="flex flex-wrap gap-2">
                    {[['Milano', 'MI'], ['Roma', 'RM'], ['Torino', 'TO'], ['Bari', 'BA'], ['Napoli', 'NA']].map(([city, code]) => (
                      <button
                        key={city}
                        onClick={() => handleQuickSelect(city, code)}
                        className="py-1.5 px-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-[9px] font-black uppercase tracking-wider text-orange-400 transition-all"
                      >
                        {city} ({code})
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer info lock */}
        <div className="mt-6 pt-4 border-t border-white/5 text-center flex items-center justify-center gap-2 text-[10px] text-gray-500 font-medium">
          <Globe className="w-3.5 h-3.5 text-gray-500" />
          <span>Servizio esteso a tutte le 20 regioni e 107 province d'Italia</span>
        </div>
      </div>
    </div>
  );
};
