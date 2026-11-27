import React, { useMemo, useState } from 'react';
import { X, Download, Share, MoreVertical, PlusSquare, Smartphone, CheckCircle2, Info } from 'lucide-react';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: BeforeInstallPromptEvent | null;
  onClearDeferredPrompt: () => void;
  isStandaloneInstalled?: boolean;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onClearDeferredPrompt,
  isStandaloneInstalled = false,
}) => {
  const [isPrompting, setIsPrompting] = useState(false);
  const [promptOutcome, setPromptOutcome] = useState<'accepted' | 'dismissed' | null>(null);

  const detectedPlatform = useMemo<'ios' | 'android' | 'desktop'>(() => {
    if (typeof navigator === 'undefined') return 'android';
    const ua = navigator.userAgent || '';
    if (/iPad|iPhone|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
      return 'ios';
    }
    if (/Android/i.test(ua)) return 'android';
    return 'desktop';
  }, []);

  if (!isOpen) return null;

  const handleDirectInstall = async () => {
    if (!deferredPrompt) return;
    setIsPrompting(true);
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      setPromptOutcome(choice.outcome);
      if (choice.outcome === 'accepted') {
        onClearDeferredPrompt();
      }
    } catch {
      // Fallback safely to manual steps shown below
    } finally {
      setIsPrompting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Salva MESA sulla schermata Home"
    >
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-fade-in-up border-t-8 border-orange-500">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="/icons/icon-192.png"
              alt="Logo MESA"
              className="w-11 h-11 rounded-2xl shadow-md border border-orange-200 shrink-0 object-cover"
            />
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-orange-600">App MESA (PWA)</p>
              <h3 className="text-base sm:text-lg font-black text-gray-900 leading-tight truncate">
                Salva MESA su Home
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Chiudi guida installazione"
            className="p-2 rounded-full bg-white hover:bg-gray-100 text-gray-500 hover:text-gray-900 border border-gray-200 shadow-sm shrink-0 transition-colors"
          >
            <X className="w-5 h-5 shrink-0" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 max-h-[78vh] overflow-y-auto space-y-4 text-left">
          {isStandaloneInstalled || promptOutcome === 'accepted' ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <p className="text-sm font-black text-emerald-950">MESA è già salvata come App!</p>
                <p className="text-xs font-medium text-emerald-800 mt-0.5">
                  Puoi aprirla direttamente dall&apos;icona MESA sulla schermata Home senza barra del browser.
                </p>
              </div>
            </div>
          ) : (
            deferredPrompt && (
              <button
                type="button"
                disabled={isPrompting}
                onClick={() => void handleDirectInstall()}
                className="w-full py-3.5 px-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 disabled:opacity-60"
              >
                <Download className="w-4 h-4 shrink-0" />
                <span>{isPrompting ? 'Conferma in corso...' : 'Installa MESA Direttamente'}</span>
              </button>
            )
          )}

          {/* Browser security explanation */}
          <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
            <p className="text-xs font-semibold text-orange-950 leading-relaxed">
              Per sicurezza del browser, i siti web non possono aggiungersi alla schermata Home con un singolo clic automatico: è sempre necessario confermare dal menu del telefono seguendo i 3 passaggi qui sotto.
            </p>
          </div>

          {/* Android / Chrome Guide */}
          <div
            className={`p-4 rounded-2xl border-2 space-y-2.5 ${
              detectedPlatform === 'android'
                ? 'bg-emerald-50/60 border-emerald-400'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Smartphone className="w-4 h-4 shrink-0" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-gray-900 leading-tight">Android / Chrome</h4>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Google Chrome</p>
                </div>
              </div>
              {detectedPlatform === 'android' && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider shrink-0">
                  Il tuo telefono
                </span>
              )}
            </div>

            <ol className="space-y-1.5 text-xs font-medium text-gray-800 pl-1">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">1</span>
                <span>
                  Tocca i <strong className="inline-flex items-center gap-0.5 font-black text-gray-900">tre puntini <MoreVertical className="w-3.5 h-3.5 inline shrink-0" /></strong> in alto a destra su Chrome.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">2</span>
                <span>Seleziona <strong>&quot;Aggiungi a schermata Home&quot;</strong> o <strong>&quot;Installa app&quot;</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">3</span>
                <span>Conferma su <strong>&quot;Installa&quot;</strong> o <strong>&quot;Aggiungi&quot;</strong>: vedrai l&apos;icona MESA tra le tue app.</span>
              </li>
            </ol>
          </div>

          {/* iPhone / Safari Guide */}
          <div
            className={`p-4 rounded-2xl border-2 space-y-2.5 ${
              detectedPlatform === 'ios'
                ? 'bg-orange-50/70 border-orange-400'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
                  <Share className="w-4 h-4 shrink-0" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-gray-900 leading-tight">iPhone / iPad (Safari)</h4>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Apple Safari</p>
                </div>
              </div>
              {detectedPlatform === 'ios' && (
                <span className="px-2 py-0.5 rounded-full bg-orange-600 text-white text-[9px] font-black uppercase tracking-wider shrink-0">
                  Il tuo iPhone
                </span>
              )}
            </div>

            <ol className="space-y-1.5 text-xs font-medium text-gray-800 pl-1">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">1</span>
                <span>
                  Apri MESA in <strong>Safari</strong> e tocca il tasto <strong className="inline-flex items-center gap-1 font-black text-gray-900">Condividi <Share className="w-3.5 h-3.5 inline shrink-0" /></strong> nella barra in basso.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">2</span>
                <span>
                  Scorri l&apos;elenco e tocca <strong className="inline-flex items-center gap-1 font-black text-gray-900">&quot;Aggiungi alla schermata Home&quot; <PlusSquare className="w-3.5 h-3.5 inline shrink-0" /></strong>.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">3</span>
                <span>Tocca <strong>&quot;Aggiungi&quot;</strong> in alto a destra: MESA si aprirà a schermo intero senza barra del browser.</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
