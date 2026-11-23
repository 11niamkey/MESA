
import React from 'react';
import { Home, ChefHat, Heart, Globe, ClipboardList, PlayCircle, Compass } from 'lucide-react';
import { ViewState } from '../types';

interface BottomNavProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { view: ViewState.HOME, label: 'Home', icon: Home },
    { view: ViewState.CHEFS, label: 'Cuochi', icon: ChefHat },
    { view: ViewState.HERITAGE, label: 'Radici', icon: Compass },
    { view: ViewState.ORDERS, label: 'Ordini', icon: ClipboardList },
    { view: ViewState.FAVORITES, label: 'Preferiti', icon: Heart },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-white/10 px-1 pb-safe-area-inset-bottom md:hidden shadow-[0_-10px_30px_-5px_rgba(0,0,0,0.5)]">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.view;
          
          return (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 active:scale-90 select-none ${
                isActive ? 'text-orange-500' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <div className={`relative transition-transform duration-300 ${isActive ? '-translate-y-1' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'fill-orange-500/10' : ''}`} />
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                )}
              </div>
              <span className={`text-[8px] font-black uppercase tracking-tighter mt-1 transition-all ${isActive ? 'opacity-100 scale-100' : 'opacity-60 scale-90'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
