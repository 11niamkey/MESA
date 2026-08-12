import React, { useMemo } from 'react';
import { X, Minus, Plus, ShoppingBag, CalendarClock, Truck, Store, Info, Sparkles } from 'lucide-react';
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

  // Logic to find suggested items: 
  // 1. Identify chefs currently in the cart.
  // 2. Suggest other dishes from these chefs that are NOT in the cart (or just popular ones).
  // 3. If cart is empty, suggest random specials.
  const suggestedDishes = useMemo(() => {
    const activeChefIds = Array.from(new Set(cart.map(item => item.chefId)));
    
    let candidates: Dish[] = [];
    
    if (activeChefIds.length > 0) {
      // Suggest dishes from the same chefs
      activeChefIds.forEach(id => {
        const chef = availableChefs.find(c => c.id === id);
        if (chef) {
           candidates.push(...chef.dishes);
        }
      });
    } else {
      // Suggest random dishes if cart is empty
       candidates = availableChefs.flatMap(c => c.dishes);
    }

    // Filter out dishes that are already in the cart (by ID) to encourage variety,
    // or keep them to allow easy re-add with different specs. 
    // Let's filter out exact ID matches to show *new* options.
    const cartDishIds = new Set(cart.map(i => i.id));
    const filtered = candidates.filter(d => !cartDishIds.has(d.id));

    // Shuffle and take 3
    return filtered.sort(() => 0.5 - Math.random()).slice(0, 3);
  }, [cart, availableChefs]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 max-w-md w-full flex">
        <div className="w-full h-full flex flex-col bg-white shadow-2xl animate-slide-in-right">
          
          <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white">
            <h2 className="text-xl font-extrabold text-black flex items-center">
              <ShoppingBag className="w-6 h-6 mr-2 text-orange-600" />
              Le tue Prenotazioni
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 bg-gray-50/50">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-10 h-10 text-gray-300" />
                </div>
                <p className="text-center font-medium">Il tuo carrello MESA è vuoto.<br/>Prenota il tuo primo piatto!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="flex flex-col bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-start space-x-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
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
                      <img src={dish.image} alt={dish.name} className="w-12 h-12 rounded-lg object-cover mr-3" />
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
            <div className="border-t border-gray-100 p-6 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              <div className="space-y-3 mb-6">
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
                className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center space-x-2 border-b-4 border-orange-850 hover:border-orange-950"
              >
                <span>Vai al Pagamento</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
