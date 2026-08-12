
import React, { useState } from 'react';
import { X, CreditCard, Banknote, CheckCircle, Smartphone } from 'lucide-react';
import { CartItem, Chef } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onSuccess: (channel: 'app' | 'whatsapp') => void;
  cart?: CartItem[];
  availableChefs?: Chef[];
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ 
  isOpen, 
  onClose, 
  total, 
  onSuccess,
  cart,
  availableChefs
}) => {
  const [method, setMethod] = useState<'card' | 'paypal' | 'cash' | 'whatsapp'>('whatsapp'); // Prefers WhatsApp as it's highly requested!
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [testPhone, setTestPhone] = useState(() => localStorage.getItem('mesa_test_phone') || '');

  if (!isOpen) return null;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      if (method !== 'whatsapp') {
        setTimeout(() => {
          setIsSuccess(false);
          onSuccess('app');
          onClose();
        }, 1500);
      }
    }, 1500);
  };

  const getWhatsAppUrl = () => {
    if (!cart || cart.length === 0) return '';
    
    const firstChefId = cart[0]?.chefId;
    const chef = availableChefs?.find(c => c.id === firstChefId);
    const chefName = chef?.name || 'Chef MESA';

    const numbers: Record<string, string> = {
      'c1': '+393471234567', // Priya Sharma
      'c2': '+393359876543', // Carlos Mendoza
      'c3': '+393291112233', // Chioma Adebayo
      'c4': '+393404445566', // Amadou Sow
      'c5': '+393287778899', // Koffi Kouamé
      'c6': '+393342223344', // Tarek Mansour
      'c7': '+393455556677', // Kwame Mensah
      'c8': '+393318889900', // Yasmine Laroui
      'c13': '+393396667788', // Semhar Tekle
      'c21': '+393463334455', // Jabari Mbeki
      'c22': '+393335556677',
      'c23': '+393345556677',
      'c24': '+393355556677',
      'c25': '+393365556677',
      'c26': '+393375556677',
      'c40': '+393385556677',
      'c41': '+393395556677'
    };
    
    const rawPhone = testPhone.trim() || chef?.phone || numbers[firstChefId || ''] || '+393475552026';
    const cleanPhone = rawPhone.replace(/[^0-9]/g, '');

    const itemsText = cart.map(item => {
      let specStr = '';
      if (item.preferences.spiceLevel > 0) {
        specStr += ` (🌶️ Piccantezza: ${item.preferences.spiceLevel}/3)`;
      }
      if (item.preferences.notes) {
        specStr += ` [Note: ${item.preferences.notes}]`;
      }
      return `- ${item.quantity}x ${item.name} (€${item.price.toFixed(2)})${specStr}`;
    }).join('\n');

    const text = `Ciao Chef ${chefName}! 🍳 
Ho appena inviato un ordine per te su *MESA*!

*Dettagli dell'Ordine*:
${itemsText}

*Totale da corrispondere*: €${total.toFixed(2)}
*Modalità*: ${cart[0]?.deliveryMode === 'delivery' ? 'Consegna a domicilio 🛵' : 'RITIRO IN SEDE (Pickup) 🛍️'}
*Giorno e Ora prenotati*: ${cart[0]?.scheduledDate || ''} ore ${cart[0]?.scheduledTime || ''}

Ci coordiniamo qui per la consegna o il ritiro! Grazie mille! 🙌`;

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
        
        <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-8 animate-fade-in-up border-t-8 border-orange-500">
          <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>

          {isSuccess ? (
            <div className="text-center py-10">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500 animate-bounce" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-2">
                {method === 'whatsapp' ? 'Pronto su WhatsApp!' : 'Pagamento Riuscito!'}
              </h3>
              <p className="text-gray-500 font-medium mb-6">
                {method === 'whatsapp' 
                  ? "Abbiamo registrato l'ordine. Clicca sotto per completarlo inviandolo su WhatsApp!" 
                  : "Stiamo notificando lo chef..."}
              </p>

              {method === 'whatsapp' ? (
                <div className="space-y-4">
                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      setTimeout(() => {
                        onSuccess('whatsapp');
                        onClose();
                        setIsSuccess(false);
                      }, 1000);
                    }}
                    className="w-full py-4 bg-[#25D366] text-white font-black uppercase tracking-widest rounded-2xl shadow-xl hover:bg-[#128C7E] transition-all flex justify-center items-center gap-2 active:scale-95 animate-pulse"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.733-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.023-5.11-2.884-6.978C16.592 1.9 14.121.875 11.487.875c-5.438 0-9.864 4.421-9.868 9.868-.001 1.714.461 3.39 1.337 4.887L1.93 21.09l5.631-1.477-1.45-.884-.334-.183zm10.748-4.996c-.3-.15-1.77-.875-2.043-.977-.275-.1-.475-.15-.675.15-.2.3-.775.976-.95 1.176-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.413-1.49-1.01-.9-1.693-2.013-1.893-2.313-.2-.3-.021-.462.129-.612.135-.135.3-.35.45-.525.15-.175.2-.3.3-.5s.05-.375-.025-.525C9.37 9.458 8.81 8.09 8.577 7.54c-.228-.547-.46-.473-.65-.482-.175-.01-.375-.012-.575-.012s-.525.075-.8.375c-.275.3-1.05 1.025-1.05 2.5s1.075 2.9 1.225 3.1c.15.2 2.11 3.22 5.115 4.52.715.31 1.273.496 1.708.635.717.228 1.37.196 1.885.119.575-.085 1.77-.723 2.022-1.42s.252-1.293.177-1.42c-.075-.125-.275-.2-.575-.35z"/>
                    </svg>
                    <span>Invia Ordine su WhatsApp</span>
                  </a>
                  <button
                    onClick={() => {
                      onSuccess('whatsapp');
                      onClose();
                      setIsSuccess(false);
                    }}
                    className="text-xs text-gray-400 hover:text-gray-600 font-bold underline"
                  >
                    Salta e continua nell'app
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight flex items-center gap-2">Pagamento</h2>
              <p className="text-gray-500 text-sm mb-6">Scegli come pagare il tuo ordine MESA.</p>
              
              <div className="bg-orange-50 border border-orange-100 rounded-2xl py-6 mb-6 text-center">
                <p className="text-xs font-black text-orange-600 uppercase tracking-widest mb-1">Totale da pagare</p>
                <div className="text-4xl font-black text-orange-700">
                  € {total.toFixed(2)}
                </div>
              </div>

              <div className="space-y-3 mb-6 max-h-[250px] overflow-y-auto pr-1">
                <button
                  onClick={() => setMethod('whatsapp')}
                  className={`w-full flex items-center p-4 rounded-2xl border-2 transition-all text-left ${
                    method === 'whatsapp' ? 'border-[#25D366] bg-green-50/50' : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className={`w-8 h-8 mr-4 flex items-center justify-center rounded-xl shrink-0 ${method === 'whatsapp' ? 'bg-[#25D366] text-white' : 'bg-green-100 text-green-600'}`}>
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.733-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.023-5.11-2.884-6.978C16.592 1.9 14.121.875 11.487.875c-5.438 0-9.864 4.421-9.868 9.868-.001 1.714.461 3.39 1.337 4.887L1.93 21.09l5.631-1.477-1.45-.884-.334-.183zm10.748-4.996c-.3-.15-1.77-.875-2.043-.977-.275-.1-.475-.15-.675.15-.2.3-.775.976-.95 1.176-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.413-1.49-1.01-.9-1.693-2.013-1.893-2.313-.2-.3-.021-.462.129-.612.135-.135.3-.35.45-.525.15-.175.2-.3.3-.5s.05-.375-.025-.525C9.37 9.458 8.81 8.09 8.577 7.54c-.228-.547-.46-.473-.65-.482-.175-.01-.375-.012-.575-.012s-.525.075-.8.375c-.275.3-1.05 1.025-1.05 2.5s1.075 2.9 1.225 3.1c.15.2 2.11 3.22 5.115 4.52.715.31 1.273.496 1.708.635.717.228 1.37.196 1.885.119.575-.085 1.77-.723 2.022-1.42s.252-1.293.177-1.42c-.075-.125-.275-.2-.575-.35z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-extrabold text-[#128C7E]">Rapido con WhatsApp</div>
                    <div className="text-[11px] text-gray-500">Invia l'ordine e coordina con lo Chef</div>
                  </div>
                </button>

                {method === 'whatsapp' && (
                  <div className="p-4 bg-green-50/50 rounded-2xl border border-green-200 mt-2">
                    <label className="block text-xs font-black text-green-800 uppercase tracking-wider mb-2">
                      📱 Numero Test Personale (Opzionale)
                    </label>
                    <input
                      type="tel"
                      placeholder="Esempio: +393471234567"
                      value={testPhone}
                      onChange={(e) => {
                        setTestPhone(e.target.value);
                        localStorage.setItem('mesa_test_phone', e.target.value);
                      }}
                      className="w-full px-4 py-2 bg-white border border-green-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] text-gray-800 font-medium"
                    />
                    <p className="text-[10px] text-green-700/80 mt-1.5 leading-relaxed font-medium">
                      Lascialo vuoto per usare il contatto simulato dello Chef. Inserisci il <strong>tuo numero vero</strong> per ricevere l'ordine direttamente sul tuo account WhatsApp!
                    </p>
                  </div>
                )}

                <button
                  onClick={() => setMethod('card')}
                  className={`w-full flex items-center p-4 rounded-2xl border-2 transition-all text-left ${
                    method === 'card' ? 'border-orange-500 bg-orange-50' : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <CreditCard className={`w-6 h-6 mr-4 shrink-0 ${method === 'card' ? 'text-orange-600' : 'text-gray-400'}`} />
                  <div>
                    <div className="font-bold text-gray-900">Carta di Credito</div>
                    <div className="text-xs text-gray-500">Paga subito in sicurezza</div>
                  </div>
                </button>

                <button
                  onClick={() => setMethod('paypal')}
                  className={`w-full flex items-center p-4 rounded-2xl border-2 transition-all text-left ${
                    method === 'paypal' ? 'border-orange-500 bg-orange-50' : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <Smartphone className={`w-6 h-6 mr-4 shrink-0 ${method === 'paypal' ? 'text-orange-600' : 'text-gray-400'}`} />
                  <div>
                    <div className="font-bold text-gray-900">PayPal</div>
                    <div className="text-xs text-gray-500">Un click e fatto</div>
                  </div>
                </button>

                <button
                  onClick={() => setMethod('cash')}
                  className={`w-full flex items-center p-4 rounded-2xl border-2 transition-all text-left ${
                    method === 'cash' ? 'border-orange-500 bg-orange-50' : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <Banknote className={`w-6 h-6 mr-4 shrink-0 ${method === 'cash' ? 'text-orange-600' : 'text-gray-400'}`} />
                  <div>
                    <div className="font-bold text-gray-900">Contanti</div>
                    <div className="text-xs text-gray-500">Al ritiro o alla consegna</div>
                  </div>
                </button>
              </div>

              <button
                onClick={handlePay}
                disabled={isProcessing}
                className={`w-full py-4 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl transition-all flex justify-center items-center active:scale-95 ${
                  method === 'whatsapp' ? 'bg-[#25D366] hover:bg-[#128C7E]' : 'bg-black hover:bg-gray-900'
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Elaborazione...</span>
                  </div>
                ) : method === 'whatsapp' ? 'Procedi con WhatsApp' : 'Conferma Ordine'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
