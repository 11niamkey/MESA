import React from 'react';
import { ShoppingBag, UtensilsCrossed, Home, PlusCircle, User, ChefHat, Globe, Heart, ClipboardList, Share2, Layout, PlayCircle, Compass, Globe2, ShieldCheck } from 'lucide-react';
import { ViewState, AppUser } from '../types';

interface HeaderProps {
  cartCount: number;
  orderCount: number;
  onCartClick: () => void;
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onAuthClick: () => void;
  onShareClick?: () => void;
  onOnboardingClick?: () => void;
  currentUser?: AppUser | null;
  onQuickAdminAccess?: () => void;
  activeAddress?: string;
  onChangeAddress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  cartCount, 
  orderCount, 
  onCartClick, 
  currentView, 
  onNavigate, 
  onAuthClick, 
  onShareClick,
  onOnboardingClick,
  currentUser,
  onQuickAdminAccess,
  activeAddress,
  onChangeAddress
}) => {
  const hideAdmin = typeof window !== 'undefined' && window.location.search.includes('hide_admin=true');

  return (
    <header className="sticky top-0 z-50 bg-black text-white border-b border-orange-900/30 shadow-lg transition-all duration-500">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          
          <div className="flex items-center gap-2 sm:gap-4">
            <div 
              className="flex items-center gap-2 sm:gap-3 cursor-pointer group py-1" 
              onClick={() => onNavigate(ViewState.HOME)}
            >
              {/* Clean Vector Icon Badge */}
              <div className="relative shrink-0">
                <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-orange-600 group-hover:bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-950/40 transition-all transform group-hover:scale-105">
                  <UtensilsCrossed className="w-5 h-5 md:w-6 md:h-6" />
                </div>
              </div>

              {/* Brand Name Typography & Subtitle */}
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl md:text-2xl font-black tracking-wider text-white group-hover:text-orange-400 transition-colors font-sans leading-none">
                    MESA<span className="text-orange-500 font-extrabold">.</span>
                  </span>
                  <span className="hidden xs:inline-block text-[8px] md:text-[9px] bg-gradient-to-r from-orange-500 to-amber-500 text-black px-1.5 py-0.5 rounded-md font-black uppercase tracking-wider leading-none shadow-sm shrink-0">
                    Home Chefs
                  </span>
                </div>
                <span className="text-[8px] sm:text-[9px] md:text-[10px] text-orange-400/90 font-bold tracking-widest uppercase leading-tight mt-0.5 group-hover:text-orange-300 transition-colors truncate">
                  Cucina Autentica
                </span>
              </div>
            </div>

            {/* Area Di Copertura Attiva Badge */}
            {activeAddress && (
              <button 
                onClick={onChangeAddress}
                className="flex flex-col text-left ml-1 sm:ml-3 py-0.5 md:py-1 px-2.5 sm:px-3 bg-neutral-900 hover:bg-neutral-800 border border-white/5 hover:border-orange-500/40 rounded-xl cursor-pointer transition-all shrink text-ellipsis whitespace-nowrap overflow-hidden max-w-[85px] xs:max-w-[130px] sm:max-w-[210px]"
                title="Cambia indirizzo di consegna"
              >
                <div className="flex items-center gap-1 text-orange-500">
                  <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-[6px] sm:text-[8px] font-black uppercase tracking-widest text-green-400">Copertura</span>
                </div>
                <span className="text-[9px] sm:text-[11px] font-black text-gray-200 font-sans truncate">
                  📍 {activeAddress.replace('(Posizione GPS)', '').split(',')[0] || activeAddress}
                </span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 mr-2 lg:mr-4">
              <button 
                onClick={() => onNavigate(ViewState.HOME)}
                className={`flex items-center space-x-1 text-[11px] lg:text-sm font-bold uppercase tracking-wide transition-colors ${currentView === ViewState.HOME ? 'text-orange-500' : 'text-gray-400 hover:text-white'}`}
              >
                <Home className="w-4 h-4" />
                <span className="hidden lg:inline">Home</span>
              </button>

              <button 
                onClick={() => onNavigate(ViewState.CHEFS)}
                className={`flex items-center space-x-1 text-[11px] lg:text-sm font-bold uppercase tracking-wide transition-colors ${currentView === ViewState.CHEFS ? 'text-orange-500' : 'text-gray-400 hover:text-white'}`}
              >
                <ChefHat className="w-4 h-4" />
                <span className="hidden lg:inline">Cuochi</span>
              </button>

              <button 
                onClick={() => onNavigate(ViewState.HERITAGE)}
                className={`flex items-center space-x-1 text-[11px] lg:text-sm font-bold uppercase tracking-wide transition-all relative group/btn ${currentView === ViewState.HERITAGE ? 'text-orange-500' : 'text-gray-400 hover:text-white'}`}
              >
                <div className={`absolute -inset-2 bg-orange-600/20 rounded-xl blur-md opacity-0 transition-opacity ${currentView === ViewState.HERITAGE ? 'opacity-100' : 'group-hover/btn:opacity-50'}`}></div>
                <Compass className={`w-4 h-4 relative z-10 ${currentView === ViewState.HERITAGE ? 'animate-spin-slow' : ''}`} />
                <span className="hidden lg:inline relative z-10">Radici</span>
              </button>
              
              <button 
                onClick={() => onNavigate(ViewState.ORDERS)}
                className={`flex items-center space-x-1 text-[11px] lg:text-sm font-bold uppercase tracking-wide transition-colors relative ${currentView === ViewState.ORDERS ? 'text-orange-500' : 'text-gray-400 hover:text-white'}`}
              >
                <ClipboardList className="w-4 h-4" />
                <span className="hidden lg:inline">Ordini</span>
                {orderCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-black leading-none text-black bg-orange-500 rounded-full border border-black animate-pulse">
                    {orderCount}
                  </span>
                )}
              </button>
            </nav>

            <div className="flex items-center space-x-1 md:space-x-2">
              {onShareClick && (
                <button 
                  onClick={onShareClick}
                  className="flex items-center gap-1 px-2.5 py-1.5 sm:px-4 sm:py-2.5 bg-neutral-900 sm:bg-orange-600 border border-white/10 sm:border-transparent text-white sm:text-black rounded-full sm:rounded-xl transition-all shadow hover:bg-neutral-800 sm:hover:bg-white active:scale-95"
                  title="Condividi MESA"
                >
                  <Share2 className="w-4 h-4 text-orange-400 sm:text-black" />
                  <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest">Condividi</span>
                </button>
              )}

              <button 
                onClick={() => onNavigate(ViewState.FAVORITES)}
                className={`hidden sm:block p-2 rounded-full transition-colors ${currentView === ViewState.FAVORITES ? 'text-red-500 bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                title="Preferiti"
              >
                <Heart className={`w-5 h-5 ${currentView === ViewState.FAVORITES ? 'fill-current' : ''}`} />
              </button>

              {onQuickAdminAccess && !hideAdmin && (
                <button
                  onClick={currentUser?.role === 'admin' ? () => onNavigate(ViewState.ADMIN_DASHBOARD) : onQuickAdminAccess}
                  className={`flex px-2 py-1.5 sm:px-3 sm:py-2 border leading-none font-black uppercase tracking-widest rounded-xl transition-all shadow-md hover:scale-105 active:scale-95 items-center gap-1 ${
                    currentUser?.role === 'admin'
                      ? 'bg-orange-500 hover:bg-orange-600 border-orange-600 text-black text-[9px] sm:text-[10px]' 
                      : 'bg-neutral-900 border-orange-500/25 hover:border-orange-500/50 text-white text-[8px] sm:text-[9px] animate-pulse'
                  }`}
                  title={currentUser?.role === 'admin' ? "Vai alla Dashboard Admin" : "Accedi come Amministratore"}
                >
                  <ShieldCheck className={`w-3.5 h-3.5 ${currentUser?.role === 'admin' ? 'text-black' : 'text-orange-500'}`} />
                  <span className="hidden sm:inline leading-none">{currentUser?.role === 'admin' ? 'Area Admin' : 'Admin'}</span>
                  <span className="inline sm:hidden leading-none">Admin</span>
                </button>
              )}

              <button 
                onClick={currentUser ? () => onNavigate(ViewState.PROFILE) : onAuthClick}
                className={`p-1.5 rounded-full transition-all flex items-center justify-center gap-2 ${
                  currentUser 
                    ? 'text-orange-500 bg-white/5 border border-orange-500/20 hover:bg-white/10 px-3 py-1.5' 
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
                title={currentUser ? "Area Personale MESA" : "Accedi o Registrati"}
              >
                {currentUser ? (
                  <>
                    <span className="w-6 h-6 rounded-lg bg-orange-600 text-black text-[10px] font-black flex items-center justify-center uppercase leading-none shadow-md">
                      {currentUser.name[0]}{currentUser.lastName[0]}
                    </span>
                    <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest text-[#FFF]">
                      {currentUser.name}
                    </span>
                  </>
                ) : (
                  <User className="w-5 h-5" />
                )}
              </button>

              <button 
                className="relative p-2.5 bg-white hover:bg-orange-50 rounded-full text-black transition-all shadow-md transform active:scale-95"
                onClick={onCartClick}
                title="Carrello"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-[10px] font-black leading-none text-white bg-orange-600 rounded-full border-2 border-black">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
