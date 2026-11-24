import React, { useState, useEffect } from 'react';
import {
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Navigation,
  Compass,
  Search,
  ChevronDown,
  ChevronUp,
  UtensilsCrossed,
  ShieldCheck
} from 'lucide-react';
import { Chef } from '../types';
import {
  PORDENONE_COMUNI,
  PordenoneComune,
  findPordenoneComune,
  isPordenoneLocation
} from './italianTerritoryData';

interface AddressGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddressVerified: (address: string) => void;
  availableChefs: Chef[];
}

const FEATURED_PN_COMUNI = [
  'Pordenone',
  'Sacile',
  'Cordenons',
  'Porcia',
  'San Vito al Tagliamento',
  'Spilimbergo',
  'Maniago',
  'Azzano Decimo'
];

export const AddressGateModal: React.FC<AddressGateModalProps> = ({
  isOpen,
  onClose,
  onAddressVerified,
  availableChefs
}) => {
  const [addressInput, setAddressInput] = useState('');
  const [suggestions, setSuggestions] = useState<PordenoneComune[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<{
    name: string;
    zip: string;
    zoneExample?: string;
    localChefCount: number;
  } | null>(null);

  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'checking' | 'active' | 'inactive'>('idle');
  const [showComuniBrowser, setShowComuniBrowser] = useState(false);

  const getChefCountForComune = (comuneName: string) => {
    const normalized = comuneName.toLowerCase();
    return availableChefs.filter(c => c.location.toLowerCase().includes(normalized)).length;
  };

  useEffect(() => {
    const query = addressInput.trim().toLowerCase();
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const matches = PORDENONE_COMUNI.filter(
      comune =>
        comune.name.toLowerCase().includes(query) ||
        comune.zip.includes(query) ||
        (comune.zoneExample || '').toLowerCase().includes(query)
    );
    setSuggestions(matches.slice(0, 6));
  }, [addressInput]);

  const activateComune = (comune: PordenoneComune, displayLabel?: string) => {
    const label = displayLabel || `${comune.name} (PN)`;
    setAddressInput(label);
    setSuggestions([]);
    setSelectedMatch({
      name: label,
      zip: comune.zip,
      zoneExample: comune.zoneExample,
      localChefCount: getChefCountForComune(comune.name)
    });
    setVerificationStatus('active');
  };

  const handleVerify = (input: string) => {
    if (!input.trim()) return;

    setVerificationStatus('checking');
    setSuggestions([]);

    setTimeout(() => {
      const matchedComune = findPordenoneComune(input);
      if (matchedComune) {
        activateComune(matchedComune, input.includes('(PN)') ? input.trim() : `${matchedComune.name} (PN)`);
        return;
      }

      const zipMatch = PORDENONE_COMUNI.find(c => input.trim().includes(c.zip));
      if (zipMatch) {
        activateComune(zipMatch, `${zipMatch.name} (PN) • CAP ${zipMatch.zip}`);
        return;
      }

      if (isPordenoneLocation(input)) {
        setSelectedMatch({
          name: input.trim(),
          zip: '33170',
          zoneExample: 'Provincia di Pordenone',
          localChefCount: availableChefs.length
        });
        setVerificationStatus('active');
        return;
      }

      setSelectedMatch(null);
      setVerificationStatus('inactive');
    }, 450);
  };

  const handleQuickSelect = (comuneName: string) => {
    const comune = PORDENONE_COMUNI.find(c => c.name === comuneName);
    if (!comune) return;
    setVerificationStatus('checking');
    setTimeout(() => {
      activateComune(comune);
    }, 250);
  };

  const handleGeolocate = () => {
    setVerificationStatus('checking');
    setTimeout(() => {
      const pordenone = PORDENONE_COMUNI[0];
      activateComune(pordenone, 'Pordenone (PN), Centro');
    }, 600);
  };

  const handleProceed = () => {
    const finalAddress = selectedMatch?.name || addressInput.trim();
    if (finalAddress) {
      onAddressVerified(finalAddress);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/95 backdrop-blur-xl transition-opacity animate-fade-in"
        onClick={onClose}
      />

      <div className="relative bg-[#0b0b0b] text-white w-full max-w-2xl rounded-[2.5rem] border border-orange-950/40 overflow-hidden shadow-[0_0_80px_rgba(234,88,12,0.18)] z-10 p-6 sm:p-8 my-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-600/5 rounded-full blur-3xl -ml-24 -mb-24 pointer-events-none"></div>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-tr from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-orange-950/30">
            <MapPin className="w-8 h-8 text-black" />
          </div>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-orange-600/15 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full mb-3">
            <ShieldCheck className="w-3.5 h-3.5" /> Zona Operativa: Provincia di Pordenone (PN)
          </span>
          <h2 className="text-2xl sm:text-3xl font-black italic tracking-tight uppercase">
            Cucine Attive in Provincia di Pordenone
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-md mx-auto">
            Tutti i {availableChefs.length} cuochi MESA operano esclusivamente nella Provincia di Pordenone (PN). Scegli il tuo comune per esplorare i piatti disponibili.
          </p>
        </div>

        <div className="space-y-5">
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
                placeholder="Cerca un comune o CAP in Provincia di Pordenone (es. Pordenone, Sacile, 33170)..."
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

            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden z-20 shadow-2xl">
                {suggestions.map((comune) => (
                  <button
                    key={comune.name}
                    onClick={() => activateComune(comune)}
                    className="w-full text-left px-4 py-3 hover:bg-orange-600/10 border-b border-white/5 last:border-0 flex items-center justify-between text-xs transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-orange-500" />
                      <span className="font-bold text-gray-200">{comune.name} (PN)</span>
                      <span className="text-[9px] px-2 py-0.5 rounded bg-neutral-800 text-gray-400 font-bold uppercase tracking-widest">
                        CAP {comune.zip}
                      </span>
                    </div>
                    <span className="text-[10px] text-orange-500 font-black">Seleziona ▸</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="min-h-[120px] flex flex-col justify-center">
            {verificationStatus === 'idle' && (
              <div className="space-y-4">
                <button
                  onClick={handleGeolocate}
                  className="w-full py-3.5 px-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 text-[10px] font-bold uppercase tracking-widest text-center flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                >
                  <Navigation className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
                  Imposta Pordenone (PN) da Posizione Attuale
                </button>

                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">
                    Comuni principali in Provincia di Pordenone:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {FEATURED_PN_COMUNI.map((comuneName) => (
                      <button
                        key={comuneName}
                        onClick={() => handleQuickSelect(comuneName)}
                        className="py-1.5 px-3 bg-neutral-900 hover:bg-orange-600/20 border border-white/10 hover:border-orange-500/40 rounded-xl text-[10px] font-bold text-gray-200 hover:text-orange-400 transition-all"
                      >
                        {comuneName}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-neutral-900/30 rounded-2xl border border-white/5 p-4">
                  <button
                    onClick={() => setShowComuniBrowser(!showComuniBrowser)}
                    className="w-full flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-orange-500 hover:text-orange-400 transition-colors"
                  >
                    <span>Sfoglia Tutti i {PORDENONE_COMUNI.length} Comuni della Provincia di Pordenone</span>
                    {showComuniBrowser ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {showComuniBrowser && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto scrollbar-none pt-1">
                      {PORDENONE_COMUNI.map((comune) => {
                        const localChefs = getChefCountForComune(comune.name);
                        return (
                          <button
                            key={comune.name}
                            onClick={() => handleQuickSelect(comune.name)}
                            className="w-full text-left p-2.5 rounded-xl text-[10px] font-black transition-all border bg-neutral-900/80 border-white/5 hover:border-orange-500/40 text-gray-300 hover:text-white flex items-center justify-between gap-1"
                          >
                            <span className="truncate">{comune.name}</span>
                            <span className="text-[8px] font-mono text-orange-500 shrink-0">
                              {localChefs > 0 ? `${localChefs} ch.` : comune.zip}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {verificationStatus === 'checking' && (
              <div className="text-center py-6 space-y-3 animate-pulse bg-neutral-900/20 rounded-2xl border border-white/5">
                <Compass className="w-10 h-10 text-orange-500 animate-spin mx-auto" />
                <p className="text-[10px] font-black uppercase tracking-widest text-orange-500">
                  Verifica copertura nella Provincia di Pordenone...
                </p>
              </div>
            )}

            {verificationStatus === 'active' && selectedMatch && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-3xl p-5 sm:p-6 space-y-4 animate-fade-in relative overflow-hidden">
                <div className="flex items-start gap-3.5 relative z-10">
                  <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0 mt-0.5 animate-bounce" />
                  <div>
                    <h4 className="font-extrabold text-sm sm:text-md text-green-400">
                      MESA è Attivo a {selectedMatch.name}!
                    </h4>

                    <p className="text-[11px] sm:text-xs text-gray-300 mt-1 leading-relaxed">
                      {selectedMatch.localChefCount > 0
                        ? `Copertura confermata! A ${selectedMatch.name} ci sono ${selectedMatch.localChefCount} cuochi attivi direttamente in zona e tutti i ${availableChefs.length} cuochi della Provincia di Pordenone (PN) sono disponibili per consegna o ritiro.`
                        : `Copertura attiva in tutta la Provincia di Pordenone! Tutti i ${availableChefs.length} cuochi casalinghi della provincia di Pordenone possono servire ${selectedMatch.name} (CAP ${selectedMatch.zip}).`}
                    </p>

                    <div className="mt-3 bg-black/40 rounded-xl p-3 border border-green-500/10">
                      <div className="flex items-center gap-1.5 text-orange-400 text-[8px] sm:text-[9px] font-black uppercase tracking-widest mb-1.5">
                        <UtensilsCrossed className="w-3.5 h-3.5" />
                        Zone e Specialità in Provincia di Pordenone:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {(selectedMatch.zoneExample ? [selectedMatch.zoneExample, 'Frico Friulano', 'Cucine dal Mondo'] : ['Provincia di Pordenone (PN)', 'Consegna a Domicilio', 'Ritiro in Cucina']).map((tag, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-bold bg-neutral-800 text-white px-2.5 py-1 rounded-lg border border-white/5"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleProceed}
                  className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-black font-black uppercase tracking-widest text-[10px] rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
                >
                  Entra e Ordina in Provincia di Pordenone <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {verificationStatus === 'inactive' && (
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-3xl p-5 sm:p-6 space-y-3 animate-fade-in">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5 animate-bounce" />
                  <div>
                    <h4 className="font-extrabold text-sm text-orange-500">Area fuori dalla Provincia di Pordenone (PN)</h4>
                    <p className="text-[11px] text-gray-300 mt-1 leading-relaxed">
                      Al momento tutti i cuochi MESA sono attivi esclusivamente nella <strong>Provincia di Pordenone (PN)</strong>. Seleziona un comune pordenonese qui sotto per esplorare i menu.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5">
                  <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Comuni in Provincia di Pordenone:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Pordenone', 'Sacile', 'Cordenons', 'Porcia', 'San Vito al Tagliamento', 'Spilimbergo'].map((city) => (
                      <button
                        key={city}
                        onClick={() => handleQuickSelect(city)}
                        className="py-1.5 px-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-[9px] font-black uppercase tracking-wider text-orange-400 transition-all"
                      >
                        {city} (PN)
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/5 text-center flex items-center justify-center gap-2 text-[10px] text-gray-500 font-medium">
          <MapPin className="w-3.5 h-3.5 text-orange-500" />
          <span>Competenza cuochi attiva su tutti i {PORDENONE_COMUNI.length} comuni della Provincia di Pordenone (PN)</span>
        </div>
      </div>
    </div>
  );
};
