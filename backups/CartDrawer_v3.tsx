import React, { useMemo, useEffect } from 'react';
import { X, Minus, Plus, ShoppingBag, CalendarClock, Truck, Store, Info, Sparkles, ArrowLeft, UtensilsCrossed } from 'lucide-react';
import { CartItem, Dish, Chef } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onCheckout: (total: number) => void;
  onAddDish: (dish: Dish) => void;
  availableChefs: Chef[];
}

const DEFAULT_FOOD_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';

export const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  cart, 
  onUpdateQuantity, 
  onCheckout,
  onAddDish,
  availableChefs 
}) => {
  const deliveryFeeBase = 2.50;
  
  const deliveryTotal = cart.reduce((acc, item) => item.deliveryMode === 'delivery' ? acc + deliveryFeeBase : acc, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + deliveryTotal;

  // Lock body scroll and listen for Escape key when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'auto';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  const suggestedDishes = useMemo(() => {
    const activeChefIds = Array.from(new Set(cart.map(item => item.chefId)));
    
    let candidates: Dish[] = [];
    
    if (activeChefIds.length > 0) {
      activeChefIds.forEach(id => {
        const chef = availableChefs.find(c => c.id === id);
        if (chef) {
           candidates.push(...chef.dishes);
        }
      });
    } else {
       candidates = availableChefs.flatMap(c => c.dishes);
    }

    const cartDishIds = new Set(cart.map(i => i.id));
    const filtered = candidates.filter(d => !cartDishIds.has(d.id));

    return filtered.sort(() => 0.5 - Math.random()).slice(0, 3);
  }, [cart, availableChefs]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
        aria-label="Chiudi carrello"
      />
      
      <div className="absolute inset-y-0 right-0 max-w-md w-full flex">
        <div className="w-full h-full flex flex-col bg-white shadow-2xl animate-slide-in-right">
          
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100 bg-white shadow-sm">
            <div className="flex items-center space-x-3">
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-gray-100 rounded-xl text-gray-600 transition-colors flex items-center gap-1.5 text-xs font-black uppercase tracking-wider"
                title="Torna alla navigazione"
              >
                <ArrowLeft className="w-4 h-4 text-orange-600" />
                <span className="hidden xs:inline">Menu</span>
              </button>
              <h2 className="text-lg sm:text-xl font-black text-gray-900 flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2 text-orange-600" />
                Prenotazioni
              </h2>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-orange-50 rounded-full text-gray-400 hover:text-orange-600 transition-colors"
              title="Chiudi"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-gray-50/50">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-5 py-12">
                <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center shadow-inner">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-black text-gray-800">Carrello MESA Vuoto</h3>
                  <p className="text-xs text-gray-500 font-medium max-w-xs">Non hai ancora aggiunto piatti. Esplora le specialità dei nostri cuochi autentici!</p>
                </div>
                <button
                  onClick={onClose}
                  className="mt-2 px-6 py-3.5 bg-orange-600 hover:bg-black text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-orange-200 transition-all transform active:scale-95 flex items-center gap-2"
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  Sfoglia il Menu Ora
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-black text-gray-400 uppercase tracking-widest px-1">
                  <span>Piatti Selezionati ({cart.reduce((a, c) => a + c.quantity, 0)})</span>
                  <button onClick={onClose} className="text-orange-600 hover:underline">Aggiungi altri piatti +</button>
                </div>
                
                {cart.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="flex flex-col bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-start space-x-4">
                      <img 
                        src={item.image || DEFAULT_FOOD_IMAGE} 
                        alt={item.name} 
                        onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_FOOD_IMAGE; }}
                        className="w-16 h-16 rounded-xl object-cover" 
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                           <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</h3>
                           {item.deliveryMode === 'delivery' ? (
                             <Truck className="w-4 h-4 text-orange-500" />
                           ) : (
                             <Store className="w-4 h-4 text-gray-400" />
                           )}
                        </div>
                        <p className="text-sm font-medium text-orange-600 mb-1">€ {item.price.toFixed(2)}</p>
                        
                        <div className="flex items-center text-xs text-gray-500 mb-2 bg-gray-50 px-2 py-1 rounded-md w-fit">
                          <CalendarClock className="w-3 h-3 mr-1.5" />
                          <span>{item.scheduledDate} - {item.scheduledTime}</span>
                        </div>
                        
                        {/* Customizations display */}
                        {(item.preferences.spiceLevel > 0 || item.preferences.notes) && (
                          <div className="text-[10px] text-gray-400 bg-gray-50 p-2 rounded mb-2 space-y-1">
                            {item.preferences.spiceLevel > 0 && <div>🌶️ Piccantezza: {item.preferences.spiceLevel}/3</div>}
                            {item.preferences.notes && <div className="italic">"{item.preferences.notes}"</div>}
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-1">
                            <button 
                              onClick={() => onUpdateQuantity(item.id, -1)}
                              className="w-6 h-6 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-orange-600 shadow-sm"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => onUpdateQuantity(item.id, 1)}
                              className="w-6 h-6 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-orange-600 shadow-sm"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="font-bold text-gray-900 text-sm">
                            € {(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Suggested Dishes Section */}
            {suggestedDishes.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
                  Completa il tuo ordine
                </h3>
                <div className="space-y-3">
                  {suggestedDishes.map((dish) => (
                    <div key={dish.id} className="flex items-center bg-white p-2 rounded-xl border border-gray-100 hover:border-orange-200 transition-colors">
                      <img 
                        src={dish.image || DEFAULT_FOOD_IMAGE} 
                        alt={dish.name} 
                        onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_FOOD_IMAGE; }}
                        className="w-12 h-12 rounded-lg object-cover mr-3" 
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-gray-900 truncate">{dish.name}</h4>
                        <p className="text-xs text-orange-600 font-medium">€ {dish.price.toFixed(2)}</p>
                      </div>
                      <button 
                        onClick={() => onAddDish(dish)}
                        className="p-2 bg-gray-100 hover:bg-orange-600 hover:text-white rounded-lg text-gray-600 transition-colors ml-2"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t border-gray-100 p-5 sm:p-6 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm text-gray-600 font-medium">
                  <span>Subtotale</span>
                  <span>€ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 font-medium">
                  <span className="flex items-center">
                    Costi di Consegna
                    <Info className="w-3 h-3 ml-1 text-gray-400" />
                  </span>
                  <span>€ {deliveryTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-extrabold text-gray-900 pt-3 border-t border-dashed border-gray-200">
                  <span>Totale</span>
                  <span className="text-orange-600">€ {total.toFixed(2)}</span>
                </div>
              </div>
              <button 
                onClick={() => onCheckout(total)}
                className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-black text-base uppercase tracking-wider rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center space-x-2 border-b-4 border-orange-800"
              >
                <span>Vai al Pagamento</span>
              </button>
              
              <button
                onClick={onClose}
                className="w-full mt-3 py-2.5 text-center text-xs font-bold text-gray-500 hover:text-orange-600 transition-colors"
              >
                ← Continua a sfogliare il menu
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
