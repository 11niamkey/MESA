
import React, { useState, useEffect } from 'react';
import { X, Banknote, CheckCircle, AlertCircle, ShoppingBag, Truck, Store } from 'lucide-react';
import { CartItem, Chef } from '../types';
import { BetaOrderValidationResult, validateBetaOrderSubmission } from '../utils/chefUtils';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onSuccess: () => void;
  cart?: CartItem[];
  availableChefs?: Chef[];
  onValidateOrder?: () => BetaOrderValidationResult;
  onValidationError?: (result: BetaOrderValidationResult) => void;
  onBackToCart?: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ 
  isOpen, 
  onClose, 
  total, 
  onSuccess,
  cart,
  availableChefs,
  onValidateOrder,
  onValidationError,
  onBackToCart
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [validationError, setValidationError] = useState<BetaOrderValidationResult | null>(null);

  useEffect(() => {
    if (isOpen) {
      setValidationError(null);
      setIsProcessing(false);
      setIsSuccess(false);
    }
  }, [isOpen, cart]);

  if (!isOpen) return null;

  const isDelivery = cart?.[0]?.deliveryMode === 'delivery';
  const itemsCount = cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const handlePay = () => {
    const validation = onValidateOrder
      ? onValidateOrder()
      : validateBetaOrderSubmission(cart || [], availableChefs || [], 'cart');

    if (!validation.ok) {
      setValidationError(validation);
      onValidationError?.(validation);
      return;
    }

    setValidationError(null);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onSuccess();
        onClose();
      }, 1200);
    }, 800);
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
                Ordine Confermato!
              </h3>
              <p className="text-gray-500 font-medium mb-6">
                Stiamo notificando lo chef... Pagherai direttamente {isDelivery ? 'alla consegna' : 'al ritiro'}.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight flex items-center gap-2">
                Conferma & Pagamento
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Nessun pagamento online richiesto: saldi direttamente al ritiro o alla consegna.
              </p>
              
              <div className="bg-orange-50 border border-orange-100 rounded-2xl py-6 px-4 mb-6 text-center">
                <p className="text-xs font-black text-orange-600 uppercase tracking-widest mb-1">Totale da pagare</p>
                <div className="text-4xl font-black text-orange-700">
                  € {total.toFixed(2)}
                </div>
                {itemsCount > 0 && (
                  <p className="text-xs font-semibold text-orange-800/80 mt-2 flex items-center justify-center gap-1.5">
                    {isDelivery ? <Truck className="w-3.5 h-3.5" /> : <Store className="w-3.5 h-3.5" />}
                    <span>
                      {itemsCount} {itemsCount === 1 ? 'piatto' : 'piatti'} • {isDelivery ? 'Consegna a domicilio' : 'Ritiro presso il cuoco'}
                    </span>
                  </p>
                )}
              </div>

              <div className="space-y-3 mb-6">
                <div className="w-full flex items-start p-4 rounded-2xl border-2 border-orange-500 bg-orange-50/70 text-left">
                  <Banknote className="w-6 h-6 mr-4 shrink-0 text-orange-600 mt-0.5" />
                  <div>
                    <div className="font-bold text-gray-900">Pagamento al ritiro o alla consegna</div>
                    <div className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                      Unica modalità attiva: paghi direttamente al ritiro presso il cuoco oppure alla consegna a domicilio.
                    </div>
                  </div>
                </div>
              </div>

              {validationError && !validationError.ok && (
                <div className="mb-4 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-left space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      {validationError.title && (
                        <p className="text-xs font-black uppercase tracking-wider text-amber-900">
                          {validationError.title}
                        </p>
                      )}
                      <p className="text-xs font-semibold text-amber-950 leading-relaxed">
                        {validationError.message}
                      </p>
                    </div>
                  </div>
                  {onBackToCart && (
                    <button
                      type="button"
                      onClick={onBackToCart}
                      className="w-full py-2.5 px-3 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Torna al Carrello</span>
                    </button>
                  )}
                </div>
              )}

              <button
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full py-4 bg-black hover:bg-gray-900 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl transition-all flex justify-center items-center active:scale-95 disabled:opacity-60"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Elaborazione...</span>
                  </div>
                ) : 'Conferma Ordine'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
