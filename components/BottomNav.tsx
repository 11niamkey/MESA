import React from 'react';
import { Home, ChefHat, Heart, ClipboardList, Compass, ShoppingBag } from 'lucide-react';
import { ViewState } from '../types';

interface BottomNavProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  cartCount: number;
  orderCount?: number;
  hasUnreadOrders?: boolean;
  onCartClick: () => void;
  isCartOpen?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentView,
  onNavigate,
  cartCount,
  orderCount = 0,
  hasUnreadOrders = false,
  onCartClick,
  isCartOpen = false,
}) => {
  const navItems = [
    { view: ViewState.HOME, label: 'Home', icon: Home },
    { view: ViewState.CHEFS, label: 'Cuochi', icon: ChefHat },
    { view: ViewState.HERITAGE, label: 'Radici', icon: Compass },
    { view: ViewState.ORDERS, label: 'Ordini', icon: ClipboardList },
    { view: ViewState.FAVORITES, label: 'Preferiti', icon: Heart },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-white/10 px-1 pb-safe-area-inset-bottom md:hidden shadow-[0_-10px_30px_-5px_rgba(0,0,0,0.5)]">
      <div className="grid grid-cols-6 items-center h-16 w-full max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = !isCartOpen && currentView === item.view;
          const isOrdersItem = item.view === ViewState.ORDERS;
          const showOrdersBadge = isOrdersItem && orderCount > 0;

          return (
            <button
              key={item.view}
              type="button"
              onClick={() => onNavigate(item.view)}
              className={`min-w-0 flex flex-col items-center justify-center h-full px-0.5 transition-all duration-200 active:scale-90 select-none ${
                isActive ? 'text-orange-500' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <div className={`relative transition-transform duration-300 ${isActive ? '-translate-y-0.5' : ''}`}>
                <Icon className={`w-[18px] h-[18px] sm:w-5 sm:h-5 ${isActive ? 'fill-orange-500/10' : ''}`} />
                {showOrdersBadge ? (
                  <span
                    className={`absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 inline-flex items-center justify-center text-[9px] font-black leading-none text-white rounded-full border border-black shadow-md ${
                      hasUnreadOrders ? 'bg-red-600 animate-pulse' : 'bg-orange-600'
                    }`}
                  >
                    {orderCount}
                  </span>
                ) : (
                  isActive && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                  )
                )}
              </div>
              <span
                className={`text-[8.5px] min-[375px]:text-[9.5px] font-black uppercase tracking-tight leading-none mt-1.5 whitespace-nowrap transition-opacity ${
                  isActive || showOrdersBadge ? 'opacity-100' : 'opacity-75'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Carrello nella barra in basso su mobile */}
        <button
          type="button"
          onClick={onCartClick}
          className={`min-w-0 flex flex-col items-center justify-center h-full px-0.5 transition-all duration-200 active:scale-90 select-none ${
            isCartOpen || cartCount > 0 ? 'text-orange-500' : 'text-gray-400 hover:text-gray-200'
          }`}
          aria-label="Apri Carrello"
        >
          <div className={`relative transition-transform duration-300 ${isCartOpen ? '-translate-y-0.5' : ''}`}>
            <ShoppingBag className={`w-[18px] h-[18px] sm:w-5 sm:h-5 ${isCartOpen ? 'fill-orange-500/10' : ''}`} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 inline-flex items-center justify-center text-[9px] font-black leading-none text-white bg-orange-600 rounded-full border border-black shadow-md">
                {cartCount}
              </span>
            )}
          </div>
          <span
            className={`text-[8.5px] min-[375px]:text-[9.5px] font-black uppercase tracking-tight leading-none mt-1.5 whitespace-nowrap transition-opacity ${
              isCartOpen || cartCount > 0 ? 'opacity-100' : 'opacity-75'
            }`}
          >
            Carrello
          </span>
        </button>
      </div>
    </nav>
  );
};
