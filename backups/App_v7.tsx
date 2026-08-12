
import React, { useState, useMemo, useEffect } from 'react';
import { db } from './firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
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
import { CartItem, Dish, ViewState, FilterState, Chef, Order, OrderStatus, Continent, AppUser, UserAddress, ChefApplication } from './types';
import { SearchX, ShoppingBag, X } from 'lucide-react';

const DEFAULT_APPLICATIONS: ChefApplication[] = [
  {
    id: 'APP-CHEF-IV102',
    fullName: 'Amara Koffi',
    brandName: 'Amara - Cucina Ivoriana d\'Autore',
    email: 'amara.koffi@mesa.com',
    phone: '+39 347 889 0011',
    nationality: '🇨🇮',
    countryName: 'Costa d\'Avorio',
    continent: 'Africa',
    location: 'Milano, Porta Venezia',
    bio: 'Cucino con orgoglio ricette tradizionali abidjanesi tramandatemi da mia nonna, specializzata in Garba (Attiéké con pesce fritto) e Alloco.',
    specialties: ['Attiéké', 'Pesce Fritto', 'Platani Fritti'],
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    kitchenPhotos: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80'
    ],
    documents: [
      {
        id: 'doc-1',
        type: 'id_card',
        title: 'Carta d\'Identità / Permesso di Soggiorno',
        fileName: 'amara_koffi_documento.pdf',
        fileSize: '1.4 MB',
        uploadedAt: '12/08/2026',
        isVerified: true
      },
      {
        id: 'doc-2',
        type: 'haccp_certificate',
        title: 'Attestato Igienico HACCP Valido',
        fileName: 'certificato_haccp_amara.pdf',
        fileSize: '920 KB',
        uploadedAt: '12/08/2026',
        isVerified: true
      }
    ],
    proposedDishName: 'Attiéké con Pesce Fritto Croccante (Garba)',
    proposedDishDesc: 'Semola di manioca fermentata (Attiéké) soffice e acidula, servita con trancio di tonno fritto, cipolle rosse e peperoncino ivoriano.',
    proposedDishPrice: 13.50,
    status: 'pending',
    submittedAt: '12/08/2026 09:30'
  },
  {
    id: 'APP-CHEF-IT204',
    fullName: 'Marco Valenti',
    brandName: 'Nonna Rosa - Pasta Fresca Bolognese',
    email: 'marco.valenti@mesa.com',
    phone: '+39 335 123 4567',
    nationality: '🇮🇹',
    countryName: 'Italia',
    continent: 'Europa',
    location: 'Milano, Città Studi',
    bio: 'Pasta tirata al mattarello secondo la secolare tradizione bolognese con ragù cotto a fuoco lento per 6 ore.',
    specialties: ['Tagliatelle al Ragù', 'Tortellini', 'Lasagne'],
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    kitchenPhotos: [
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80'
    ],
    documents: [
      {
        id: 'doc-3',
        type: 'id_card',
        title: 'Carta d\'Identità Italiana',
        fileName: 'marco_valenti_id.pdf',
        fileSize: '1.1 MB',
        uploadedAt: '11/08/2026',
        isVerified: true
      },
      {
        id: 'doc-4',
        type: 'haccp_certificate',
        title: 'Certificato HACCP Regione Lombardia',
        fileName: 'haccp_valenti_2026.pdf',
        fileSize: '810 KB',
        uploadedAt: '11/08/2026',
        isVerified: true
      }
    ],
    proposedDishName: 'Tagliatelle d\'Anatra al Mattarello col Ragù di Mamma',
    proposedDishDesc: 'Uova di galline ruspanti e farina di grano tenero tipo 0, condite con ragù classico bolognese cotto 6 ore.',
    proposedDishPrice: 15.00,
    status: 'pending',
    submittedAt: '11/08/2026 18:45'
  }
];

const DEFAULT_USERS: AppUser[] = [
  {
    id: 'usr-1',
    name: 'Luca',
    lastName: 'Rossi',
    email: 'luca@mesa.com',
    role: 'client',
    createdAt: '15/05/2026',
    addresses: []
  },
  {
    id: 'usr-2',
    name: 'Francesco',
    lastName: 'Neri',
    email: 'chef.francesco@mesa.com',
    role: 'chef',
    createdAt: '18/05/2026',
    addresses: []
  },
  {
    id: 'usr-3',
    name: 'Maria',
    lastName: 'Verdi',
    email: 'chef.maria@mesa.com',
    role: 'chef',
    createdAt: '22/05/2026',
    addresses: []
  },
  {
    id: 'usr-admin',
    name: 'Admin',
    lastName: 'MESA',
    email: 'admin@mesa.com',
    role: 'admin',
    createdAt: '10/05/2026',
    addresses: []
  }
];

function App() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.LANDING);
  const [verifiedAddress, setVerifiedAddress] = useState<string>(() => localStorage.getItem('mesa_verified_address') || '');
  const [isAddressGateOpen, setIsAddressGateOpen] = useState(false);
  const [selectedChef, setSelectedChef] = useState<Chef | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCartBarDismissed, setIsCartBarDismissed] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Stateful copy of chefs that is fully manageable and editable
  const [chefs, setChefs] = useState<Chef[]>(() => {
    const saved = localStorage.getItem('mesa_chefs');
    let existing = saved ? JSON.parse(saved) : MOCK_CHEFS;
    
    // Sync updated visuals from MOCK_CHEFS
    existing = existing.map((existingChef: Chef) => {
      const mockMatch = MOCK_CHEFS.find(m => m.id === existingChef.id);
      if (mockMatch && mockMatch.avatar !== existingChef.avatar) {
         return { ...existingChef, avatar: mockMatch.avatar };
      }
      return existingChef;
    });

    return existing.map((chef: Chef) => {
      const cleanName = chef.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      return {
        ...chef,
        email: chef.email || `chef.${cleanName}@mesa.com`,
        password: chef.password || 'demo123',
        countryName: chef.countryName || 'Italia'
      };
    });
  });

  // Synchronized registered users & current user session
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    const saved = localStorage.getItem('mesa_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [registeredUsers, setRegisteredUsers] = useState<AppUser[]>(DEFAULT_USERS);

  const [chefApplications, setChefApplications] = useState<ChefApplication[]>(DEFAULT_APPLICATIONS);

  useEffect(() => {
    // Listen to Firebase users
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const users: AppUser[] = snapshot.docs.map(doc => doc.data() as AppUser);
      setRegisteredUsers(users);
    });
    // Listen to Firebase orders
    const unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const ordersData: Order[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : new Date(data.timestamp)
        } as Order;
      });
      // Sort orders by timestamp descending
      ordersData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      setOrders(ordersData);
    });
    
    // Listen to Firebase chefApplications
    const unsubApps = onSnapshot(collection(db, 'chefApplications'), (snapshot) => {
      const apps: ChefApplication[] = snapshot.docs.map(doc => doc.data() as ChefApplication);
      if (apps.length > 0) {
        setChefApplications(apps);
      }
    });
    
    return () => {
      unsubUsers();
      unsubOrders();
      unsubApps();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('mesa_chefs', JSON.stringify(chefs));
  }, [chefs]);

  useEffect(() => {
    localStorage.setItem('mesa_chef_applications', JSON.stringify(chefApplications));
  }, [chefApplications]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('mesa_current_user', JSON.stringify(currentUser));
      // Auto-migrate current user to Firebase if they only exist locally
      setDoc(doc(db, 'users', currentUser.id), currentUser, { merge: true }).catch(err => {
        console.error("Migration error:", err);
      });
    } else {
      localStorage.removeItem('mesa_current_user');
    }
  }, [currentUser]);

  const handleAddressVerified = (addressString: string) => {
    localStorage.setItem('mesa_verified_address', addressString);
    setVerifiedAddress(addressString);
    
    if (currentUser) {
      const parts = addressString.split(',');
      const street = parts[0]?.trim() || addressString;
      const city = parts[1]?.trim() || 'Milano';
      const zip = parts[2]?.trim() || '20100';
      
      const newAddr: UserAddress = {
        id: 'addr-' + Date.now(),
        street,
        city,
        zip,
        isVerified: true
      };
      
      const updatedUser: AppUser = {
        ...currentUser,
        addresses: [newAddr, ...currentUser.addresses.filter(a => a.street !== street)]
      };
      
      setCurrentUser(updatedUser);
      setRegisteredUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    }
    
    navigateTo(ViewState.HOME);
    showNotification("Copertura MESA verificata con successo! 🍕");
  };

  const handleUpdateChef = (updatedChef: Chef) => {
    setChefs(prev => prev.map(c => c.id === updatedChef.id ? updatedChef : c));
    
    // Auto-propagate changes to registeredUsers list
    setRegisteredUsers(prev => prev.map(u => {
      const isMatch = u.id === updatedChef.id.replace('chef-', '') || 
                      u.email.trim().toLowerCase() === (updatedChef.email || '').trim().toLowerCase() ||
                      u.name.trim().toLowerCase() === updatedChef.name.trim().toLowerCase() ||
                      `${u.name} ${u.lastName}`.trim().toLowerCase() === updatedChef.name.trim().toLowerCase();
      if (isMatch && u.role === 'chef') {
        const nameParts = updatedChef.name.trim().split(' ');
        const first = nameParts[0] || u.name;
        const last = nameParts.slice(1).join(' ') || '';
        
        const updatedUser: AppUser = {
          ...u,
          name: first,
          lastName: last,
          email: updatedChef.email || u.email,
          password: updatedChef.password || u.password
        };

        if (updatedChef.location) {
          updatedUser.addresses = [
            { id: `addr-${updatedChef.id}`, street: updatedChef.location, city: 'Milano', zip: '20121', isVerified: true }
          ];
        }

        if (currentUser && currentUser.id === u.id) {
          setCurrentUser(updatedUser);
        }
        return updatedUser;
      }
      return u;
    }));

    showNotification(`Profilo di Chef ${updatedChef.name} aggiornato e sincronizzato! 🧑‍🍳`);
  };

  const handleAddChef = (newChef: Chef) => {
    setChefs(prev => {
      if (prev.some(c => c.id === newChef.id)) {
        return prev.map(c => c.id === newChef.id ? newChef : c);
      }
      return [newChef, ...prev];
    });
    showNotification(`Chef ${newChef.name} registrato con successo nel database partner MESA! 🎉`);
  };

  const handleChefSubmitApplication = async (newApp: ChefApplication) => {
    try {
      await setDoc(doc(db, 'chefApplications', newApp.id), newApp);
    } catch (err) {
      console.error("Firebase submit error:", err);
    }
    showNotification(`Candidatura Cuoco inviata con successo! In attesa di valutazione dall'Amministratore. 🧑‍🍳`);
  };

  const handleApproveApplication = async (appId: string) => {
    const app = chefApplications.find(a => a.id === appId);
    if (app) {
      try {
        await setDoc(doc(db, 'chefApplications', appId), { status: 'approved', reviewedAt: new Date().toLocaleString('it-IT') }, { merge: true });
      } catch (err) {
        console.error("Firebase update failed", err);
      }
      const newChef: Chef = {
        id: `chef-${app.id.toLowerCase()}`,
        name: app.brandName || app.fullName,
        nationality: app.nationality,
        countryName: app.countryName,
        continent: app.continent,
        avatar: app.avatarUrl,
        rating: 5.0,
        location: app.location,
        phone: app.phone,
        email: app.email,
        password: 'demo123',
        specialties: app.specialties,
        bio: app.bio,
        availability: app.availabilitySlots && app.availabilitySlots.length > 0 ? app.availabilitySlots : ['12:00 - 15:00', '19:00 - 22:00'],
        availableDays: app.availableDays && app.availableDays.length > 0 ? app.availableDays : [1, 2, 3, 4, 5, 6],
        reviews: [],
        dishes: [
          {
            id: `dish-${app.id.toLowerCase()}-1`,
            name: app.proposedDishName,
            description: app.proposedDishDesc,
            price: app.proposedDishPrice,
            image: app.kitchenPhotos[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
            chefId: `chef-${app.id.toLowerCase()}`,
            tags: app.specialties
          }
        ],
        distance: 1.1,
        verificationStatus: 'approved',
        documents: app.documents
      };

      setChefs(prev => [newChef, ...prev.filter(c => c.id !== newChef.id)]);

      const existingUser = registeredUsers.find(u => u.email.toLowerCase() === app.email.toLowerCase());
      if (existingUser) {
        handleUpdateUser({ ...existingUser, role: 'chef' });
      } else {
        const nameParts = app.fullName.split(' ');
        const newUser: AppUser = {
          id: `usr-${app.id.toLowerCase()}`,
          name: nameParts[0] || 'Chef',
          lastName: nameParts.slice(1).join(' ') || 'MESA',
          email: app.email,
          role: 'chef',
          createdAt: new Date().toLocaleDateString('it-IT'),
          addresses: [
            { id: `addr-${app.id}`, street: app.location, city: 'Milano', zip: '20100', isVerified: true }
          ],
          password: 'demo123'
        };
        handleRegisterUser(newUser); // Saves to Firebase!
      }
      
      showNotification(`Profilo di ${app.brandName} valutato ed attivato nel catalogo MESA! 🎉`);
    }
  };

  const handleRejectApplication = async (appId: string, notes?: string) => {
    try {
      await setDoc(doc(db, 'chefApplications', appId), { status: 'rejected', adminNotes: notes || 'Documenti incompleti', reviewedAt: new Date().toLocaleString('it-IT') }, { merge: true });
    } catch (err) {
      console.error("Firebase update failed", err);
    }
    showNotification(`Candidatura #${appId} aggiornata in sospeso.`);
  };

  const handleRegisterUser = async (newUser: AppUser) => {
    try {
      await setDoc(doc(db, 'users', newUser.id), newUser);
    } catch (err) {
      console.error("Error saving user to Firebase", err);
    }

    if (newUser.role === 'chef') {
      const newChef: Chef = {
        id: `chef-${newUser.id}`,
        name: `${newUser.name} ${newUser.lastName}`,
        email: newUser.email,
        password: newUser.password || 'demo123',
        nationality: '🇮🇹',
        countryName: 'Italia',
        continent: 'Europa',
        bio: 'Passione per la cucina casalinga preparata con ingredienti freschi.',
        location: newUser.addresses[0]?.street || 'Milano, Centro',
        phone: '',
        dishes: [],
        specialties: ['Cucina Tradizionale'],
        avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80',
        rating: 4.8,
        distance: 1.2,
        availability: ['19:00 - 22:00'],
        availableDays: [1, 2, 3, 4, 5, 6],
        reviews: []
      };
      handleAddChef(newChef);
    }
  };

  const handleUpdateUser = async (updatedUser: AppUser) => {
    try {
      await setDoc(doc(db, 'users', updatedUser.id), updatedUser, { merge: true });
    } catch (err) {
      console.error("Error updating user in Firebase", err);
    }
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }

    if (updatedUser.role === 'chef') {
      setChefs(prev => prev.map(c => {
        const isMatch = c.id === `chef-${updatedUser.id}` || 
                        c.id === updatedUser.id ||
                        c.email.trim().toLowerCase() === updatedUser.email.trim().toLowerCase() ||
                        c.name.trim().toLowerCase() === `${updatedUser.name} ${updatedUser.lastName}`.trim().toLowerCase() ||
                        c.name.trim().toLowerCase() === updatedUser.name.trim().toLowerCase();
        if (isMatch) {
          return {
            ...c,
            name: `${updatedUser.name} ${updatedUser.lastName}`.trim(),
            email: updatedUser.email,
            password: updatedUser.password || c.password,
            location: updatedUser.addresses[0]?.street || c.location
          };
        }
        return c;
      }));
    }
  };

  const handleVerifyAddress = async (userId: string, addressId: string, isVerified: boolean) => {
    // Aggiorna lo stato localmente per la UI immediata
    setRegisteredUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          addresses: u.addresses.map(addr => addr.id === addressId ? { ...addr, isVerified } : addr)
        };
      }
      return u;
    }));

    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          addresses: prev.addresses.map(addr => addr.id === addressId ? { ...addr, isVerified } : addr)
        };
      });
    }

    // Aggiorna Firebase
    try {
      const userToUpdate = registeredUsers.find(u => u.id === userId);
      if (userToUpdate) {
        const updatedUser = {
          ...userToUpdate,
          addresses: userToUpdate.addresses.map(addr => addr.id === addressId ? { ...addr, isVerified } : addr)
        };
        await setDoc(doc(db, 'users', userId), updatedUser, { merge: true });
      }
    } catch (err) {
      console.error("Firebase update failed for handleVerifyAddress", err);
    }

    showNotification(isVerified ? "Indirizzo CONVALIDATO con successo! ✅" : "Convalida indirizzo revocata.");
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
    } catch (err) {
      console.error("Error deleting user from Firebase", err);
    }
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(null);
      setCurrentView(ViewState.LANDING);
    }
    showNotification("Account rimosso definitivamente.");
  };
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);

  const [bookingDish, setBookingDish] = useState<Dish | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [checkoutTotal, setCheckoutTotal] = useState(0);

  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    maxPrice: 50,
    dietary: [],
    categories: [],
    countries: []
  });

  // Gestione parametri URL per link pubblici
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const chefId = params.get('chef');
    if (chefId) {
      const chef = chefs.find(c => c.id === chefId);
      if (chef) {
        setSelectedChef(chef);
        setCurrentView(ViewState.PUBLIC_STOREFRONT);
      }
    }

    const hasSeenLanding = localStorage.getItem('mesa_landing_seen');
    if (hasSeenLanding && !chefId) {
       // Se ha già visto la landing, carichiamo la home (opzionale, per ora lasciamo landing come default)
       // setCurrentView(ViewState.HOME);
    }
  }, []);

  useEffect(() => {
    const activeOrders = orders.filter(o => o.status !== 'COMPLETED');
    if (activeOrders.length === 0) return;

    const timer = setInterval(() => {
      orders.forEach(async order => {
        if (order.status === 'COMPLETED') return;
        
        // Solo l'utente che ha fatto l'ordine (o l'admin come fallback) esegue l'aggiornamento
        if (currentUser?.id === order.userId || currentUser?.role === 'admin') {
          const statusFlow: OrderStatus[] = order.deliveryMode === 'pickup' 
            ? ['PLACED', 'PREPARING', 'READY', 'COMPLETED']
            : ['PLACED', 'PREPARING', 'READY', 'DELIVERING', 'COMPLETED'];
          
          const currentIndex = statusFlow.indexOf(order.status);
          if (currentIndex < statusFlow.length - 1) {
            const nextStatus = statusFlow[currentIndex + 1];
            if (currentUser?.id === order.userId && order.id === orders[0]?.id) {
              const messages = {
                'PREPARING': `👨‍🍳 ${order.chefName} ha iniziato a cucinare!`,
                'READY': `✅ Il tuo piatto è pronto per il ritiro!`,
                'DELIVERING': `🛵 Il rider è partito con il tuo ordine!`,
                'COMPLETED': `🎉 Buon appetito! L'ordine è stato consegnato.`
              };
              showNotification(messages[nextStatus as keyof typeof messages] || "Stato ordine aggiornato");
              if (nextStatus === 'COMPLETED') {
                setTimeout(() => setReviewOrder(order), 2500);
              }
            }
            try {
              await setDoc(doc(db, 'orders', order.id), { ...order, status: nextStatus }, { merge: true });
            } catch (err) {
              console.error("Firebase update failed", err);
            }
          }
        }
      });
    }, 10000);
    return () => clearInterval(timer);
  }, [orders, currentUser]);

  const navigateTo = (view: ViewState) => {
    if ([ViewState.ORDERS, ViewState.PROFILE].includes(view) && !currentUser) {
      showNotification("Sblocca la tua area! Accedi o registrati come Cliente o Cuoco.");
      setIsAuthOpen(true);
      return;
    }

    if (view === ViewState.ADMIN_DASHBOARD && currentUser?.role !== 'admin') {
      showNotification("Accesso riservato. Inserisci la password amministratore per accedere.");
      setIsAuthOpen(true);
      return;
    }

    setCurrentView(view);
    setIsCartOpen(false); // Ensure cart drawer is closed when navigating between views
    if (view !== ViewState.CHEF_PROFILE && view !== ViewState.PUBLIC_STOREFRONT) setSelectedChef(null);
    if (view !== ViewState.ORDERS) setSelectedOrder(null);
    
    // Pulisci l'URL se si torna alla navigazione standard per evitare loop al refresh
    if (view === ViewState.HOME && window.location.search.includes('chef=')) {
      window.history.replaceState({}, '', window.location.pathname);
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickAdminAccess = () => {
    if (currentUser?.role === 'admin') {
      setCurrentView(ViewState.ADMIN_DASHBOARD);
    } else {
      showNotification("Area riservata. Inserisci la password per accedere all'area amministratore.");
      setIsAuthOpen(true);
    }
  };

  const showNotification = (message: string) => {
    setToastMessage(message);
    setIsToastVisible(true);
  };

  const handleToggleFavorite = (dishId: string) => {
    setFavorites(prev => {
      if (prev.includes(dishId)) {
        showNotification("Rimosso dai preferiti");
        return prev.filter(id => id !== dishId);
      } else {
        showNotification("Aggiunto ai preferiti ❤️");
        return [...prev, dishId];
      }
    });
  };

  const handleInitiateBooking = (dish: Dish) => setBookingDish(dish);

  const handleConfirmBooking = (date: string, time: string, deliveryMode: 'delivery' | 'pickup', preferences: any) => {
    if (!bookingDish) return;
    setCart(prev => [...prev, { ...bookingDish, quantity: 1, scheduledDate: date, scheduledTime: time, deliveryMode, preferences }]);
    setBookingDish(null);
    setIsCartBarDismissed(false);
    setIsCartOpen(true);
    showNotification("Aggiunto al carrello!");
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item).filter(i => i.quantity > 0));
  };

  const handleCheckout = (total: number) => {
    if (!currentUser) {
      showNotification("Sblocca la tua area! Accedi per ordinare.");
      setIsCartOpen(false);
      setIsAuthOpen(true);
      return;
    }

    const deliveryMode = cart[0]?.deliveryMode || 'pickup';
    if (deliveryMode === 'delivery') {
      const hasVerifiedAddress = currentUser.addresses.some(addr => addr.isVerified);
      if (!hasVerifiedAddress) {
        showNotification("Sicurezza MESA: Richiesto un indirizzo verificato dall'Admin per la consegna!");
        setIsCartOpen(false);
        navigateTo(ViewState.PROFILE);
        return;
      }
    }

    setCheckoutTotal(total);
    setIsCartOpen(false);
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = async (notificationChannel?: 'app' | 'whatsapp') => {
    const firstChefId = cart[0]?.chefId || 'c1';
    const chefName = chefs.find(c => c.id === firstChefId)?.name || 'Chef MESA';
    const newOrder: Order = {
      id: `MESA-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      userId: currentUser?.id,
      items: [...cart],
      total: checkoutTotal,
      status: 'PLACED',
      timestamp: new Date(),
      chefId: firstChefId,
      chefName: chefName,
      deliveryMode: cart[0]?.deliveryMode || 'pickup',
      estimatedTime: 'In arrivo...',
      notificationChannel: notificationChannel || 'app'
    };
    try {
      await setDoc(doc(db, 'orders', newOrder.id), newOrder);
    } catch (err) {
      console.error("Error saving order to Firebase", err);
    }
    setCart([]);
    setSelectedOrder(newOrder);
    setCurrentView(ViewState.ORDERS);
    showNotification(`Ordine inviato con successo via ${notificationChannel === 'whatsapp' ? 'WhatsApp' : 'sistema MESA'}! 🚀`);
  };

  const handleReviewSubmit = (rating: number, comment: string) => {
    if (!reviewOrder) return;
    setOrders(prev => prev.map(o => o.id === reviewOrder.id ? { ...o, isReviewed: true } : o));
    setReviewOrder(null);
    showNotification("Grazie per la tua recensione! ⭐");
  };

  const handleViewProfile = (chef: Chef) => {
    setSelectedChef(chef);
    setCurrentView(ViewState.CHEF_PROFILE);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const baseChefs = chefs;

  const filteredChefs = useMemo(() => {
    const query = filters.search.toLowerCase().trim();
    return baseChefs.filter(chef => {
      const matchesCountry = filters.countries.length === 0 || filters.countries.includes(chef.nationality);
      if (!matchesCountry) return false;
      if (!query) return true;
      
      const countryKeywords = nationalityNames[chef.nationality] || [];
      const matchesCountryName = countryKeywords.some(keyword => keyword.toLowerCase().includes(query)) ||
                                (chef.countryName && chef.countryName.toLowerCase().includes(query));
      const matchesChefName = chef.name.toLowerCase().includes(query);
      const matchesBio = chef.bio.toLowerCase().includes(query);
      const matchesSpecialties = chef.specialties.some(s => s.toLowerCase().includes(query));
      
      const hasMatchingDish = chef.dishes.some(dish => {
        const matchesDishName = dish.name.toLowerCase().includes(query);
        const matchesDishDesc = dish.description.toLowerCase().includes(query);
        const matchesDishTags = dish.tags.some(tag => tag.toLowerCase().includes(query));
        return matchesDishName || matchesDishDesc || matchesDishTags;
      });
      
      return matchesCountryName || matchesChefName || matchesBio || matchesSpecialties || hasMatchingDish;
    });
  }, [filters, baseChefs]);

  const chefsByContinent = useMemo(() => {
    const groups: Record<Continent, Chef[]> = {
      'Europa': [],
      'Asia': [],
      'Africa': [],
      'Americhe': [],
      'Oceania': []
    };
    filteredChefs.forEach(chef => {
      groups[chef.continent].push(chef);
    });
    return groups;
  }, [filteredChefs]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const activeOrdersCount = orders.filter(o => o.status !== 'COMPLETED').length;

  // View dedicata per Landing Page (Sito Web)
  if (currentView === ViewState.LANDING) {
    return (
      <>
        <LandingPage 
          onEnterApp={() => {
            if (verifiedAddress) {
              navigateTo(ViewState.HOME);
            } else {
              setIsAddressGateOpen(true);
            }
          }} 
          onNavigateToBecomeChef={() => { navigateTo(ViewState.BECOME_CHEF); }} 
          onShareClick={() => setIsShareOpen(true)}
        />
        <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
        <NotificationToast message={toastMessage} isVisible={isToastVisible} onClose={() => setIsToastVisible(false)} />
        <AddressGateModal 
          isOpen={isAddressGateOpen} 
          onClose={() => setIsAddressGateOpen(false)} 
          onAddressVerified={handleAddressVerified} 
          availableChefs={chefs}
        />
      </>
    );
  }

  if (currentView === ViewState.PUBLIC_STOREFRONT && selectedChef) {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900">
        <PublicStorefront 
          chef={selectedChef} 
          onAddDish={handleInitiateBooking} 
          onExit={() => navigateTo(ViewState.HOME)} 
        />
        {bookingDish && (
          <BookingModal 
            isOpen={true} 
            onClose={() => setBookingDish(null)} 
            dish={bookingDish} 
            chef={selectedChef} 
            onConfirm={handleConfirmBooking} 
          />
        )}
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} onUpdateQuantity={handleUpdateQuantity} onCheckout={handleCheckout} onAddDish={handleInitiateBooking} availableChefs={chefs} />
        <PaymentModal isOpen={isPaymentOpen} onClose={() => setIsPaymentOpen(false)} total={checkoutTotal} onSuccess={handlePaymentSuccess} cart={cart} availableChefs={chefs} />
        <NotificationToast message={toastMessage} isVisible={isToastVisible} onClose={() => setIsToastVisible(false)} />
        {cartCount > 0 && !isCartOpen && (
          <button 
            onClick={() => setIsCartOpen(true)}
            className="fixed bottom-6 right-6 z-50 bg-black text-white p-6 rounded-full shadow-2xl animate-bounce flex items-center gap-3"
          >
            <ShoppingBag className="w-6 h-6" />
            <span className="font-black">{cartCount}</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-white text-gray-900 font-sans flex flex-col transition-all duration-300 ${
      cartCount > 0 && !isCartBarDismissed && !isCartOpen ? 'pb-40 md:pb-24' : 'pb-20 md:pb-8'
    }`}>
      <Header 
        cartCount={cartCount} 
        orderCount={activeOrdersCount} 
        onCartClick={() => setIsCartOpen(true)} 
        currentView={currentView} 
        onNavigate={navigateTo} 
        onAuthClick={() => setIsAuthOpen(true)}
        onShareClick={() => setIsShareOpen(true)}
        onOnboardingClick={() => setIsOnboardingOpen(true)}
        currentUser={currentUser}
        onQuickAdminAccess={handleQuickAdminAccess}
        activeAddress={verifiedAddress}
        onChangeAddress={() => setIsAddressGateOpen(true)}
      />
      
      {currentView === ViewState.HOME && <FilterBar filters={filters} onFilterChange={setFilters} />}

      <main className="max-w-6xl mx-auto px-4 py-6 flex-grow w-full mb-8">
        {currentView === ViewState.HOME && (
          <div className="animate-fade-in">
            {!filters.search ? (
              <>
                <DailySpecials chefs={filteredChefs.length === chefs.length ? chefs : filteredChefs} onAddDish={handleInitiateBooking} favorites={favorites} onToggleFavorite={handleToggleFavorite} />
                
                {/* Active Interactive Dish Catalog Subdivided By Provenance */}
                <DishCatalogByOrigin 
                  chefs={filteredChefs} 
                  onAddDish={handleInitiateBooking} 
                  favorites={favorites} 
                  onToggleFavorite={handleToggleFavorite} 
                  onViewProfile={handleViewProfile}
                />

                <ChefGroupSection title="Eccellenze Europee" chefs={chefsByContinent['Europa']} onAddDish={handleInitiateBooking} onViewProfile={handleViewProfile} favorites={favorites} onToggleFavorite={handleToggleFavorite} />
                <ChefGroupSection title="Sapori dall'Africa" chefs={chefsByContinent['Africa']} onAddDish={handleInitiateBooking} onViewProfile={handleViewProfile} favorites={favorites} onToggleFavorite={handleToggleFavorite} />
                <ChefGroupSection title="Tradizioni Asiatiche" chefs={chefsByContinent['Asia']} onAddDish={handleInitiateBooking} onViewProfile={handleViewProfile} favorites={favorites} onToggleFavorite={handleToggleFavorite} />
                <ChefGroupSection title="Dalle Americhe" chefs={chefsByContinent['Americhe']} onAddDish={handleInitiateBooking} onViewProfile={handleViewProfile} favorites={favorites} onToggleFavorite={handleToggleFavorite} />
              </>
            ) : (
              <div className="space-y-10">
                <div className="flex items-center justify-between border-b pb-6">
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Risultati per "{filters.search}"</h2>
                    <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-1">{filteredChefs.length} cuochi trovati</p>
                  </div>
                  <button onClick={() => setFilters({ ...filters, search: '' })} className="text-xs font-black text-orange-600 uppercase">Torna alla Home</button>
                </div>

                {filteredChefs.length > 0 ? (
                  <div className="grid grid-cols-1 gap-12">
                    {filteredChefs.map(chef => (
                      <ChefCard key={chef.id} chef={chef} onAddDish={handleInitiateBooking} onViewProfile={handleViewProfile} favorites={favorites} onToggleFavorite={handleToggleFavorite} />
                    ))}
                  </div>
                ) : (
                  <div className="py-24 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <SearchX className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-400 mb-2">Nessun cuoco trovato</h3>
                    <p className="text-gray-500 font-medium">Prova a cercare termini diversi o esplora le categorie.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {currentView === ViewState.CHEFS && <MesaChefs chefs={filteredChefs} onViewProfile={handleViewProfile} />}
        {currentView === ViewState.HERITAGE && <HeritageMenu chefs={baseChefs} onAddDish={handleInitiateBooking} onViewProfile={handleViewProfile} favorites={favorites} onToggleFavorite={handleToggleFavorite} />}
        {currentView === ViewState.CULTURE && <CultureSection />}
        {currentView === ViewState.EXPERIENCES && <ExperiencesSection />}
        {currentView === ViewState.FAVORITES && <FavoritesSection favorites={favorites} chefs={baseChefs} onAddDish={handleInitiateBooking} onToggleFavorite={handleToggleFavorite} />}
        {currentView === ViewState.ORDERS && (
          selectedOrder 
            ? <OrderTracking 
                order={orders.find(o => o.id === selectedOrder.id) || selectedOrder} 
                onBack={() => setSelectedOrder(null)} 
                chefs={chefs} 
                onUpdateOrderStatus={async (orderId, status) => {
                  try {
                    await setDoc(doc(db, 'orders', orderId), { status }, { merge: true });
                  } catch (err) {
                    console.error("Firebase update failed", err);
                  }
                }}
              />
            : (
              <div className="animate-fade-in space-y-6">
                <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">I Miei Ordini</h2>
                {orders.length === 0 ? <p className="text-gray-400 font-bold py-20 text-center bg-gray-50 rounded-[3rem]">Nessun ordine attivo.</p> : orders.map(order => (
                  <div key={order.id} onClick={() => setSelectedOrder(order)} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer flex justify-between items-center group">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">#{order.id.split('-')[0]}</p>
                      <h4 className="font-bold text-xl text-gray-900">{order.chefName}</h4>
                      <p className="text-xs text-gray-500">{order.items.length} {order.items.length === 1 ? 'piatto' : 'piatti'} • €{order.total.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700 animate-pulse'}`}>{order.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )
        )}
        {currentView === ViewState.CHEF_PROFILE && selectedChef && (
          <ChefProfile chef={selectedChef} onBack={() => navigateTo(ViewState.HOME)} onAddDish={handleInitiateBooking} favorites={favorites} onToggleFavorite={handleToggleFavorite} onNavigateToCulture={() => navigateTo(ViewState.CULTURE)} />
        )}
        {currentView === ViewState.AI_MENU_CREATOR && <AiMenuCreator />}
        
        {currentView === ViewState.PROFILE && currentUser && (
          <PersonalArea 
            currentUser={currentUser}
            onLogout={() => {
              setCurrentUser(null);
              navigateTo(ViewState.LANDING);
              showNotification("Sconnesso dall'Area Personale MESA. A presto! 👋");
            }}
            onUpdateUser={handleUpdateUser}
            orders={orders}
            onNavigate={navigateTo}
            onSelectOrder={setSelectedOrder}
            chefs={chefs}
            onUpdateChef={handleUpdateChef}
            registeredUsers={registeredUsers}
          />
        )}

        {currentView === ViewState.ADMIN_DASHBOARD && (
          <AdminDashboard 
            chefs={chefs} 
            onUpdateChef={handleUpdateChef}
            orders={orders} 
            registeredUsers={registeredUsers}
            chefApplications={chefApplications}
            onVerifyAddress={handleVerifyAddress}
            onDeleteUser={handleDeleteUser}
            onApproveApplication={handleApproveApplication}
            onRejectApplication={handleRejectApplication}
          />
        )}

        {[ViewState.ABOUT, ViewState.SAFETY, ViewState.BECOME_CHEF, ViewState.HELP, ViewState.TERMS, ViewState.PRIVACY].includes(currentView) && (
          <InfoPage view={currentView} onBack={() => navigateTo(ViewState.HOME)} onOpenOnboarding={() => setIsOnboardingOpen(true)} />
        )}
      </main>

      <Footer onNavigate={navigateTo} />
      <BottomNav currentView={currentView} onNavigate={navigateTo} />

      {/* Glovo-style Sticky Floating Cart Bar - Non-intrusive, dismissible & non-blocking */}
      {cartCount > 0 && !isCartOpen && !isCartBarDismissed && (
        <div 
          className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-lg bg-orange-600 hover:bg-orange-700 text-white p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl shadow-2xl shadow-orange-950/30 border border-orange-500 flex items-center justify-between cursor-pointer transition-all transform hover:scale-[1.01] active:scale-95 animate-fade-in-up group" 
          onClick={() => setIsCartOpen(true)}
        >
          <div className="flex items-center space-x-3 min-w-0">
            <div className="bg-white/20 p-2.5 rounded-xl flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="bg-white text-orange-600 text-xs font-black px-2 py-0.5 rounded-full shrink-0">{cartCount}</span>
                <span className="font-extrabold text-sm truncate">{cartCount === 1 ? 'Piatto nel carrello' : 'Piatti nel carrello'}</span>
              </div>
              <span className="text-[11px] text-orange-100 font-bold hidden xs:inline">Consegna diretta o Ritiro</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0 ml-2">
            <span className="text-base sm:text-lg font-black font-mono">€ {cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
            <span className="bg-white/20 group-hover:bg-white/30 text-white px-2.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider hidden sm:inline">Vedi →</span>
            
            {/* Dismiss/Minimize button so cart bar does not interfere with browsing */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsCartBarDismissed(true);
              }}
              className="p-1.5 bg-black/20 hover:bg-black/40 text-white/80 hover:text-white rounded-lg transition-colors ml-1"
              title="Riduci barra carrello"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      
      {bookingDish && (
        <BookingModal 
          isOpen={true} 
          onClose={() => setBookingDish(null)} 
          dish={bookingDish} 
          chef={chefs.find(c => c.id === bookingDish.chefId)} 
          onConfirm={handleConfirmBooking} 
        />
      )}
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} onUpdateQuantity={handleUpdateQuantity} onCheckout={handleCheckout} onAddDish={handleInitiateBooking} availableChefs={chefs} />
      <PaymentModal isOpen={isPaymentOpen} onClose={() => setIsPaymentOpen(false)} total={checkoutTotal} onSuccess={handlePaymentSuccess} cart={cart} availableChefs={chefs} />
      
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        registeredUsers={registeredUsers}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          if (user.role === 'admin') {
            navigateTo(ViewState.ADMIN_DASHBOARD);
          } else {
            navigateTo(ViewState.PROFILE);
          }
        }}
        onRegisterUser={handleRegisterUser}
      />

      <OrderReviewModal isOpen={!!reviewOrder} onClose={() => setReviewOrder(null)} order={reviewOrder!} onSubmit={handleReviewSubmit} />
      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} contextChefId={selectedChef?.id} />
      <ChefOnboarding 
        isOpen={isOnboardingOpen} 
        onClose={() => setIsOnboardingOpen(false)} 
        onChefCreate={handleAddChef} 
        onSubmitApplication={handleChefSubmitApplication}
        currentUser={currentUser} 
      />
      <NotificationToast message={toastMessage} isVisible={isToastVisible} onClose={() => setIsToastVisible(false)} />

      <AddressGateModal 
        isOpen={isAddressGateOpen} 
        onClose={() => setIsAddressGateOpen(false)} 
        onAddressVerified={handleAddressVerified} 
        availableChefs={chefs}
      />
      
      {showTour && (
        <LaunchTour onComplete={() => { 
          setShowTour(false); 
          localStorage.setItem('mesa_launch_tour_v60', 'true'); 
        }} />
      )}
      <AiConcierge />
    </div>
  );
}

export default App;
