
import React from 'react';
import { ShoppingBag, UtensilsCrossed, Home, User, ChefHat, Heart, ClipboardList, Share2, Compass, ShieldCheck, MapPin } from 'lucide-react';
import { ViewState, AppUser } from '../types';

interface HeaderProps {
  cartCount: number;
  orderCount: number;
  hasUnreadOrders?: boolean;
  chefAlertCount?: number;
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
  hasUnreadOrders = false,
  chefAlertCount = 0,
  onCartClick, 
  currentView, 
  onNavigate, 
  onAuthClick, 
  onShareClick,
  currentUser,
  activeAddress,
  onChangeAddress
}) => {
  const roleTheme = (() => {
    if (
      currentView === ViewState.ADMIN_DASHBOARD ||
      (currentUser?.role === 'admin' && currentView === ViewState.PROFILE)
    ) {
      return {
        label: 'ADMIN',
        pillClass:
          'bg-gradient-to-r from-[#312E81] via-[#4C1D95] to-slate-900 hover:from-[#4C1D95] hover:to-[#312E81] border-violet-400/50 shadow-violet-950/60',
        badgeClass: 'bg-violet-300 text-slate-950',
        headerBorderClass: 'border-violet-800/50',
        Icon: ShieldCheck,
      };
    }
    if (currentUser?.role === 'chef' || currentView === ViewState.BECOME_CHEF) {
      return {
        label: 'CUOCO',
        pillClass:
          'bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 hover:from-emerald-500 hover:to-teal-600 border-emerald-300/50 shadow-emerald-950/60',
        badgeClass: 'bg-emerald-200 text-emerald-950',
        headerBorderClass: 'border-emerald-700/50',
        Icon: ChefHat,
      };
    }
    return {
      label: currentUser?.role === 'client' ? 'CLIENTE' : 'OSPITE',
      pillClass:
        'bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-400 hover:to-amber-500 border-orange-300/50 shadow-orange-950/50',
      badgeClass: 'bg-black text-orange-400',
      headerBorderClass: 'border-orange-900/30',
      Icon: UtensilsCrossed,
    };
  })();

  const RoleIcon = roleTheme.Icon;

  return (
    <header className={`sticky top-0 z-50 bg-black text-white border-b shadow-lg transition-all duration-300 ${roleTheme.headerBorderClass}`}>
      <div className="max-w-6xl mx-auto px-3 sm:px-5 lg:px-8">
        <div className="flex justify-between items-center gap-2 sm:gap-3 lg:gap-4 h-16 md:h-20">
          
          {/* Left Group: Dynamic Role Brand Logo + Active Coverage Location */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink">
            <button
              type="button"
              className="flex items-center gap-2 cursor-pointer group py-1 shrink-0 focus:outline-none"
              onClick={() => onNavigate(ViewState.LANDING)}
              title="Torna alla schermata di benvenuto per cambiare ruolo"
              aria-label="Torna alla schermata di benvenuto MESA"
            >
              <div
                className={`flex items-center gap-1.5 sm:gap-2 text-white px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl sm:rounded-2xl shadow-lg border transition-all duration-300 group-hover:scale-105 shrink-0 ${roleTheme.pillClass}`}
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                  <RoleIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base sm:text-lg font-black tracking-wider text-white font-sans leading-none whitespace-nowrap drop-shadow-sm">
                    MESA<span className="text-amber-200 font-black">.</span>
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[8px] sm:text-[9px] font-black uppercase tracking-wider leading-none whitespace-nowrap shadow-sm ${roleTheme.badgeClass}`}
                  >
                    {roleTheme.label}
                  </span>
                </div>
              </div>
            </button>

            {activeAddress && (() => {
              const fullCity = activeAddress.replace('(Posizione GPS)', '').split(',')[0].trim() || activeAddress;
              const shortCity = fullCity.replace(/\s*\(PN\)\s*/i, '').trim() || fullCity;
              return (
                <button
                  type="button"
                  onClick={onChangeAddress}
                  className="flex flex-col justify-center text-left py-1.5 px-2.5 sm:px-3 bg-neutral-900 hover:bg-neutral-800 border border-white/10 hover:border-orange-500/40 rounded-xl cursor-pointer transition-all min-w-0 max-w-[135px] sm:max-w-[175px] overflow-hidden shrink"
                  title={`Zona attiva: ${fullCity} (tocca per cambiare)`}
                  aria-label={`Cambia località (${fullCity})`}
                >
                  <div className="hidden sm:flex items-center gap-1 min-w-0">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shrink-0"></span>
                    <span className="text-[8px] font-black uppercase tracking-widest text-green-400 whitespace-nowrap">Copertura</span>
                  </div>
                  <div className="flex items-center gap-1 min-w-0 w-full">
                    <span className="sm:hidden w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shrink-0"></span>
                    <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span className="sm:hidden text-[11px] font-black text-gray-100 font-sans truncate min-w-0">
                      {shortCity}
                    </span>
                    <span className="hidden sm:inline text-[11px] font-black text-gray-100 font-sans truncate min-w-0">
                      {fullCity}
                    </span>
                  </div>
                </button>
              );
            })()}
          </div>

          {/* Center Nav (Tablet & Desktop) */}
          <nav className="hidden md:flex items-center gap-3 lg:gap-5 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate(ViewState.HOME)}
              title="Home"
              className={`flex items-center gap-1.5 px-1.5 py-1 text-xs font-bold uppercase tracking-wide whitespace-nowrap shrink-0 transition-colors ${currentView === ViewState.HOME ? 'text-orange-500' : 'text-gray-400 hover:text-white'}`}
            >
              <Home className="w-4 h-4 shrink-0" />
              <span className="hidden lg:inline whitespace-nowrap">Home</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate(ViewState.CHEFS)}
              title="Cuochi"
              className={`flex items-center gap-1.5 px-1.5 py-1 text-xs font-bold uppercase tracking-wide whitespace-nowrap shrink-0 transition-colors ${currentView === ViewState.CHEFS ? 'text-orange-500' : 'text-gray-400 hover:text-white'}`}
            >
              <ChefHat className="w-4 h-4 shrink-0" />
              <span className="hidden lg:inline whitespace-nowrap">Cuochi</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate(ViewState.HERITAGE)}
              title="Radici"
              className={`flex items-center gap-1.5 px-1.5 py-1 text-xs font-bold uppercase tracking-wide whitespace-nowrap shrink-0 transition-colors ${currentView === ViewState.HERITAGE ? 'text-orange-500' : 'text-gray-400 hover:text-white'}`}
            >
              <Compass className={`w-4 h-4 shrink-0 ${currentView === ViewState.HERITAGE ? 'animate-spin-slow' : ''}`} />
              <span className="hidden lg:inline whitespace-nowrap">Radici</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate(ViewState.ORDERS)}
              title="Ordini"
              className={`flex items-center gap-1.5 px-1.5 py-1 text-xs font-bold uppercase tracking-wide whitespace-nowrap shrink-0 transition-colors ${currentView === ViewState.ORDERS ? 'text-orange-500' : 'text-gray-400 hover:text-white'}`}
            >
              <ClipboardList className="w-4 h-4 shrink-0" />
              <span className="hidden lg:inline whitespace-nowrap">Ordini</span>
              {orderCount > 0 && (
                <span className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[9px] font-black leading-none rounded-full shrink-0 ${
                  hasUnreadOrders ? 'bg-red-600 text-white animate-pulse' : 'bg-orange-500 text-black'
                }`}>
                  {orderCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2.5 shrink-0">
            {onShareClick && (
              <button
                type="button"
                onClick={onShareClick}
                className="hidden lg:flex items-center justify-center p-2.5 rounded-full bg-neutral-900 hover:bg-orange-600 border border-white/10 hover:border-orange-500 text-gray-300 hover:text-black transition-all active:scale-95 shrink-0"
                title="Condividi MESA"
                aria-label="Condividi MESA"
              >
                <Share2 className="w-4 h-4 shrink-0" />
              </button>
            )}

            <button
              type="button"
              onClick={() => onNavigate(ViewState.FAVORITES)}
              className={`hidden sm:flex items-center justify-center p-2.5 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shrink-0 ${currentView === ViewState.FAVORITES ? 'text-red-500 bg-white/10 shadow-sm ring-1 ring-white/10' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
              title="Preferiti"
              aria-label="Preferiti"
            >
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${currentView === ViewState.FAVORITES ? 'fill-current' : ''}`} />
            </button>

            {currentUser?.role === 'admin' && (
              <button
                type="button"
                onClick={() => onNavigate(ViewState.ADMIN_DASHBOARD)}
                className="flex px-2.5 py-1.5 sm:px-3 sm:py-2 border leading-none font-black uppercase tracking-wider rounded-xl transition-all shadow-md hover:scale-105 active:scale-95 items-center gap-1.5 bg-orange-500 hover:bg-orange-600 border-orange-600 text-black text-[9px] sm:text-[10px] whitespace-nowrap shrink-0"
                title="Vai alla Dashboard Amministratore"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-black shrink-0" />
                <span className="hidden xl:inline whitespace-nowrap">Area Admin</span>
                <span className="inline xl:hidden whitespace-nowrap">Admin</span>
              </button>
            )}

            <button
              type="button"
              onClick={currentUser ? () => onNavigate(ViewState.PROFILE) : onAuthClick}
              className={`relative rounded-full transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5 shrink-0 ${
                currentUser
                  ? 'text-orange-500 bg-white/5 border border-orange-500/20 hover:bg-white/10 px-2 py-1.5 sm:px-3 sm:py-1.5 max-w-[140px]'
                  : 'p-2 sm:p-2.5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
              title={currentUser ? "Area Personale MESA" : "Accedi o Registrati"}
              aria-label={currentUser ? "Area Personale MESA" : "Accedi o Registrati"}
            >
              {currentUser ? (
                <>
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 rounded-lg object-cover shadow-md shrink-0 border border-orange-500/40"
                    />
                  ) : (
                    <span className="w-6 h-6 rounded-lg bg-orange-600 text-black text-[10px] font-black flex items-center justify-center uppercase leading-none shadow-md shrink-0">
                      {currentUser.name?.[0] || 'U'}{currentUser.lastName?.[0] || ''}
                    </span>
                  )}
                  <span className="hidden sm:inline text-[10px] font-black uppercase tracking-wider text-white truncate max-w-[72px]">
                    {currentUser.name}
                  </span>
                  {currentUser.role === 'chef' && chefAlertCount > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[9px] font-black leading-none text-white bg-red-600 rounded-full border border-black animate-pulse shrink-0">
                      {chefAlertCount}
                    </span>
                  )}
                </>
              ) : (
                <User className="w-5 h-5 shrink-0" />
              )}
            </button>

            <button
              type="button"
              className="hidden md:flex items-center justify-center relative p-2.5 bg-white hover:bg-orange-50 rounded-full text-black transition-all duration-200 shadow-md hover:scale-105 active:scale-95 shrink-0"
              onClick={onCartClick}
              title="Carrello"
              aria-label="Carrello"
            >
              <ShoppingBag className="w-5 h-5 shrink-0" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[9px] font-black leading-none text-white bg-orange-600 rounded-full border-2 border-black">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
