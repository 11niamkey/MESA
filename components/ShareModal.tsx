
import React, { useState, useEffect } from 'react';
import { 
  X, Copy, Check, Share2, Mail, 
  MessageCircle, Send, Edit2, Rocket, Briefcase, 
  UserPlus, Link, AlertCircle, ShieldCheck, 
  ExternalLink, ShoppingCart, Loader2, MessageSquare 
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTemplate?: 'tester' | 'partner' | 'storefront';
  contextChefId?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, initialTemplate = 'storefront', contextChefId }) => {
  const [copied, setCopied] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<'tester' | 'partner' | 'storefront'>(initialTemplate);
  const [isEditingLink, setIsEditingLink] = useState(false);
  const [qrLoaded, setQrLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && isOpen) {
      // Cattura il dominio reale o l'URL di anteprima corrente
      const baseUrl = window.location.origin + window.location.pathname;
      const url = contextChefId 
        ? `${baseUrl}?chef=${contextChefId}&hide_admin=true` 
        : `${baseUrl}?hide_admin=true`;
      setCustomUrl(url);
      setQrLoaded(false);
    }
  }, [isOpen, contextChefId]);

  const templates = {
    storefront: {
      label: "Vetrina",
      icon: <ShoppingCart className="w-4 h-4" />,
      text: (url: string) => contextChefId 
        ? `Fame di qualcosa di autentico? Scopri la mia vetrina su MESA! Piatti fatti in casa pronti per te. Ordina qui: ${url}`
        : `Scopri MESA: il nuovo modo di ordinare piatti fatti in casa dai migliori talenti locali! ${url}`
    },
    tester: {
      label: "Tester",
      icon: <UserPlus className="w-4 h-4" />,
      text: (url: string) => `Ciao! Sto testando MESA, una nuova app per ordinare piatti fatti in casa da cuochi fantastici. Ti andrebbe di provarla? Link: ${url}`
    },
    partner: {
      label: "Partner",
      icon: <Rocket className="w-4 h-4" />,
      text: (url: string) => `Ehi, guarda questa nuova piattaforma per cuochi casalinghi. Penso che potresti guadagnare bene condividendo i tuoi piatti! Link: ${url}`
    }
  };

  if (!isOpen) return null;

  const fullMessage = templates[selectedTemplate].text(customUrl);
  const isLocalhost = customUrl.includes('localhost') || customUrl.includes('127.0.0.1');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copia fallita", err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'MESA - Vetrina Pubblica',
          text: fullMessage,
          url: customUrl,
        });
      } catch (err) {
        console.log("Condivisione annullata");
      }
    } else {
      handleCopy();
    }
  };

  const handleSocialShare = (platform: 'whatsapp' | 'telegram' | 'email') => {
    const text = encodeURIComponent(fullMessage);
    const links = {
      whatsapp: `https://wa.me/?text=${text}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(customUrl)}&text=${text}`,
      email: `mailto:?subject=Invito Progetto MESA&body=${text}`
    };
    window.open(links[platform], '_blank');
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(customUrl)}&bgcolor=ffffff&color=000000&margin=1`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/95 backdrop-blur-xl animate-fade-in" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-2xl rounded-[4rem] shadow-2xl overflow-hidden animate-fade-in-up border border-gray-100 flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Lato Sinistro: QR Code & Diagnostica */}
        <div className="bg-black p-8 text-white flex flex-col items-center justify-center text-center md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-white/10">
          <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-orange-900/20 overflow-hidden p-0.5">
             <img src="/images/mesa_app_icon.jpg" alt="MESA Logo" className="w-full h-full object-cover rounded-xl" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-6">MESA Access</p>
          <div className="relative bg-white p-4 rounded-[2.5rem] shadow-[0_0_50px_rgba(249,115,22,0.4)] group aspect-square flex items-center justify-center w-full max-w-[180px]">
             {!qrLoaded && <div className="absolute inset-0 flex items-center justify-center bg-white rounded-[2.5rem]"><Loader2 className="w-6 h-6 text-orange-500 animate-spin" /></div>}
             <img 
               src={qrCodeUrl} 
               alt="QR Code" 
               className={`w-full h-full transition-opacity duration-500 ${qrLoaded ? 'opacity-100' : 'opacity-0'}`} 
               onLoad={() => setQrLoaded(true)}
             />
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div className="w-8 h-8 bg-white p-1 rounded-xl shadow-md border border-orange-100 flex items-center justify-center">
                 <img src="/images/mesa_app_icon.jpg" alt="MESA" className="w-full h-full object-cover rounded-lg" />
               </div>
             </div>
          </div>
          <div className="mt-8 space-y-3">
             <div className={`flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest ${isLocalhost ? 'text-red-500' : 'text-green-500'}`}>
                {isLocalhost ? <AlertCircle className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                {isLocalhost ? 'Ambiente Locale' : 'Link Pubblico'}
             </div>
             <p className="text-[9px] text-gray-500 leading-relaxed font-bold uppercase tracking-tight">
                {isLocalhost ? 'Attenzione: condividi questo link solo se sei in produzione.' : 'Il link è pronto per essere distribuito globalmente.'}
             </p>
          </div>
        </div>

        {/* Lato Destro: Configurazione Condivisione */}
        <div className="p-8 md:p-12 flex-1 overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
               <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic leading-none">Condividi</h2>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">MESA Share v2.7</p>
            </div>
            <button onClick={onClose} className="p-3 text-gray-300 hover:text-black transition-colors rounded-full hover:bg-gray-50">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3 px-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">URL Pubblico</p>
              <button 
                onClick={() => setIsEditingLink(!isEditingLink)}
                className="text-[10px] font-black text-orange-600 uppercase flex items-center gap-1.5 hover:underline"
              >
                <Edit2 className="w-3 h-3" /> {isEditingLink ? 'Salva' : 'Modifica'}
              </button>
            </div>
            <div className={`p-5 rounded-3xl border-2 flex items-center gap-4 transition-all ${isEditingLink ? 'border-orange-500 bg-white shadow-xl shadow-orange-50' : 'border-gray-50 bg-gray-50'}`}>
              <div className={`p-2 rounded-xl ${isEditingLink ? 'bg-orange-100 text-orange-600' : 'bg-gray-200 text-gray-400'}`}>
                <Link className="w-4 h-4" />
              </div>
              <input 
                type="text"
                value={customUrl}
                readOnly={!isEditingLink}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="bg-transparent flex-1 text-sm font-bold text-gray-700 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-8">
            {(Object.keys(templates) as Array<keyof typeof templates>).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTemplate(t)}
                className={`py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest flex flex-col items-center justify-center gap-2 transition-all border-2 ${
                  selectedTemplate === t ? 'bg-black text-white border-black shadow-lg scale-105' : 'bg-white border-gray-100 text-gray-400 hover:border-orange-200'
                }`}
              >
                {templates[t].icon}
                {templates[t].label}
              </button>
            ))}
          </div>

          <div className="bg-gray-50 p-6 rounded-[2.5rem] border border-gray-100 mb-8 relative">
            <div className="absolute -top-2 -left-2 bg-orange-600 text-black p-1.5 rounded-xl shadow-lg">
               <MessageSquare className="w-3 h-3" />
            </div>
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3">Anteprima Messaggio</p>
            <p className="text-[11px] font-bold text-gray-600 leading-relaxed italic">"{fullMessage}"</p>
          </div>

          <div className="space-y-4">
             <button 
                onClick={handleNativeShare}
                className="w-full flex items-center justify-center gap-4 py-5 bg-orange-600 text-black rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-all shadow-xl active:scale-95 group"
              >
                <Share2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Condividi Ora</span>
              </button>

              <div className="flex gap-3">
                <button 
                  onClick={handleCopy}
                  className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] border-2 transition-all ${copied ? 'bg-green-500 text-white border-green-500 shadow-lg' : 'bg-white border-gray-200 text-gray-900 hover:border-orange-200'}`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copiato' : 'Copia Testo'}
                </button>
                <button 
                  onClick={() => handleSocialShare('whatsapp')}
                  className="px-8 py-5 bg-green-50 text-green-600 rounded-[2rem] flex items-center justify-center hover:bg-green-600 hover:text-white transition-all border border-green-100 shadow-sm"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};
