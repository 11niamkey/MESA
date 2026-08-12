import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { AddressGateModal } from './components/AddressGateModal';
import { ChefCard } from './components/ChefCard';
import { CartDrawer } from './components/CartDrawer';
import { AiMenuCreator } from './components/AiMenuCreator';
import { FilterBar, nationalityNames } from './components/FilterBar';
import { ChefProfile } from './components/ChefProfile';
import { BookingModal } from './components/BookingModal';
import { DailySpecials } from './components/DailySpecials';
import { PaymentModal } from './components/PaymentModal';
import { AuthModal } from './components/AuthModal';
import { MesaChefs } from './components/MesaChefs';
import { CultureSection } from './components/CultureSection';
import { ExperiencesSection } from './components/ExperiencesSection';
import { FavoritesSection } from './components/FavoritesSection';
import { Footer } from './components/Footer';
import { NotificationToast } from './components/NotificationToast';
import { BottomNav } from './components/BottomNav';
import { InfoPage } from './components/InfoPage';
import { OrderTracking } from './components/OrderTracking';
import { OrderReviewModal } from './components/OrderReviewModal';
import { ShareModal } from './components/ShareModal';
import { AdminDashboard } from './components/AdminDashboard';
import { LaunchTour } from './components/LaunchTour';
import { AiConcierge } from './components/AiConcierge';
import { ChefOnboarding } from './components/ChefOnboarding';
import { ChefGroupSection } from './components/ChefGroupSection';
import { PublicStorefront } from './components/PublicStorefront';
import { HeritageMenu } from './components/HeritageMenu';
import { LandingPage } from './components/LandingPage';
import { PersonalArea } from './components/PersonalArea';
import { DishCatalogByOrigin } from './components/DishCatalogByOrigin';
import { MOCK_CHEFS } from './constants';
import { CartItem, Dish, ViewState, FilterState, Chef, Order, OrderStatus, Continent, AppUser, UserAddress } from './types';
import { SearchX, ShoppingBag } from 'lucide-react';

const DEFAULT_USERS: AppUser[] = [
  { id: 'usr-1', name: 'Luca', lastName: 'Rossi', email: 'luca@mesa.com', role: 'client', createdAt: '15/05/2026', addresses: [] },
  { id: 'usr-2', name: 'Francesco', lastName: 'Neri', email: 'chef.francesco@mesa.com', role: 'chef', createdAt: '18/05/2026', addresses: [] },
  { id: 'usr-3', name: 'Maria', lastName: 'Verdi', email: 'chef.maria@mesa.com', role: 'chef', createdAt: '22/05/2026', addresses: [] },
  { id: 'usr-admin', name: 'Admin', lastName: 'MESA', email: 'admin@mesa.com', role: 'admin', createdAt: '10/05/2026', addresses: [] }
];

function App() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.LANDING);
  const [verifiedAddress, setVerifiedAddress] = useState<string>(() => localStorage.getItem('mesa_verified_address') || '');
  const [isAddressGateOpen, setIsAddressGateOpen] = useState(false);
  const [selectedChef, setSelectedChef] = useState<Chef | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  return null;
}
export default App;
