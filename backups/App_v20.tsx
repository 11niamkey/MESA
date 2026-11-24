
import React, { useState, useMemo, useEffect } from 'react';
import { db, auth, isFirebaseConfigured } from './firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, getDocs, getDoc, arrayUnion } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
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
import { CountryFlag } from './components/CountryFlag';
import { MOCK_CHEFS } from './constants';
import { CartItem, Dish, ViewState, FilterState, Chef, Order, OrderStatus, Continent, AppUser, UserAddress, ChefApplication } from './types';
import { SearchX, ShoppingBag, X, Heart, Star, MapPin, Clock } from 'lucide-react';

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

// ---------------------------------------------------------------------------
// Firestore helpers (gracefully no-op until Firebase is configured)
// ---------------------------------------------------------------------------
const normalizeChef = (chef: Chef): Chef => {
  const cleanName = chef.name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const mappedCountry = nationalityNames[chef.nationality]?.[0];
  const resolvedCountry =
    chef.countryName && !(chef.countryName === 'Italia' && chef.nationality !== '🇮🇹')
      ? chef.countryName
      : mappedCountry || chef.countryName || 'Italia';
  return {
    ...chef,
    email: chef.email || `chef.${cleanName}@mesa.com`,
    password: chef.password || 'demo123',
    countryName: resolvedCountry
  };
};

const firestoreWrite = async (collectionName: string, id: string, data: any, merge = false) => {
  if (!isFirebaseConfigured) return;
  try {
    if (merge) {
      await setDoc(doc(db, collectionName, id), data, { merge: true });
    } else {
      await setDoc(doc(db, collectionName, id), data);
    }
  } catch (err) {
    console.error(`Firestore write failed (${collectionName}/${id})`, err);
  }
};

const firestoreDelete = async (collectionName: string, id: string) => {
  if (!isFirebaseConfigured) return;
  try {
    await deleteDoc(doc(db, collectionName, id));
  } catch (err) {
    console.error(`Firestore delete failed (${collectionName}/${id})`, err);
  }
};

const seedFirestoreDefaults = async () => {
  if (!isFirebaseConfigured) return;
  try {
    const [chefsSnap, usersSnap, appsSnap, catalogSnap] = await Promise.all([
      getDocs(collection(db, 'chefs')),
      getDocs(collection(db, 'users')),
      getDocs(collection(db, 'chefApplications')),
      getDoc(doc(db, 'settings', 'catalog'))
    ]);
    const deletedChefIds = new Set<string>(
      catalogSnap.exists() ? (catalogSnap.data().deletedChefIds || []) : []
    );
    const writes: Promise<void>[] = [];
    const existingChefIds = new Set(chefsSnap.docs.map(d => d.id));
    MOCK_CHEFS.map(normalizeChef).forEach(c => {
      if (!existingChefIds.has(c.id) && !deletedChefIds.has(c.id)) {
        writes.push(setDoc(doc(db, 'chefs', c.id), c));
      }
    });
    if (usersSnap.empty) {
      DEFAULT_USERS.forEach(u => writes.push(setDoc(doc(db, 'users', u.id), u)));
    }
    if (appsSnap.empty) {
      DEFAULT_APPLICATIONS.forEach(a => writes.push(setDoc(doc(db, 'chefApplications', a.id), a)));
    }
    if (writes.length > 0) {
      await Promise.all(writes);
    }
  } catch (err) {
    console.error('Seeding Firestore defaults failed', err);
  }
};

function App() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [verifiedAddress, setVerifiedAddress] = useState<string>('Milano (MI), Centro');
  const [isAddressGateOpen, setIsAddressGateOpen] = useState(false);
  const [selectedChef, setSelectedChef] = useState<Chef | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCartBarDismissed, setIsCartBarDismissed] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Stateful copy of chefs (seeded from MOCK_CHEFS, then synced from Firestore)
  const [chefs, setChefs] = useState<Chef[]>(() => MOCK_CHEFS.map(normalizeChef));

  // Synchronized registered users & current user session
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    const saved = localStorage.getItem('mesa_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [registeredUsers, setRegisteredUsers] = useState<AppUser[]>(DEFAULT_USERS);

  const [chefApplications, setChefApplications] = useState<ChefApplication[]>(DEFAULT_APPLICATIONS);

  useEffect(() => {
    if (!isFirebaseConfigured) return;

    let unsubUsers: (() => void) | undefined;
    let unsubOrders: (() => void) | undefined;
    let unsubApps: (() => void) | undefined;
    let unsubChefs: (() => void) | undefined;

    (async () => {
      // Seed demo data once, then attach realtime listeners
      await seedFirestoreDefaults();

      // Listen to Firebase users
      unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
        const users: AppUser[] = snapshot.docs.map(d => d.data() as AppUser);
        setRegisteredUsers(users);
      });

      // Listen to Firebase chefs (catalogo)
      unsubChefs = onSnapshot(collection(db, 'chefs'), (snapshot) => {
        const chefsData: Chef[] = snapshot.docs.map(d => normalizeChef(d.data() as Chef));
        setChefs(chefsData);
      });

      // Listen to Firebase orders
      unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
        const ordersData: Order[] = snapshot.docs.map(d => {
          const data = d.data();
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
      unsubApps = onSnapshot(collection(db, 'chefApplications'), (snapshot) => {
        const apps: ChefApplication[] = snapshot.docs.map(d => d.data() as ChefApplication);
        if (apps.length > 0) {
          setChefApplications(apps);
        }
      });
    })();

    return () => {
      unsubUsers?.();
      unsubOrders?.();
      unsubApps?.();
      unsubChefs?.();
    };
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('mesa_current_user', JSON.stringify(currentUser));
      // Auto-migrate current user to Firebase if they only exist locally
      firestoreWrite('users', currentUser.id, currentUser, true);
    } else {
      localStorage.removeItem('mesa_current_user');
    }
  }, [currentUser]);

  // Derive the verified address from the (Firestore-backed) user record
  useEffect(() => {
    if (currentUser) {
      const verified = currentUser.addresses.find(a => a.isVerified);
      if (verified) {
        setVerifiedAddress(`${verified.street}, ${verified.city}, ${verified.zip}`);
      }
    }
  }, [currentUser]);

  // Load favorites from the signed-in user's profile
  useEffect(() => {
    setFavorites(currentUser?.favoriteDishIds || []);
  }, [currentUser?.id]);

  const handleAddressVerified = (addressString: string) => {
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
    firestoreWrite('chefs', updatedChef.id, updatedChef, true);
    
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
    firestoreWrite('chefs', newChef.id, newChef);
    showNotification(`Chef ${newChef.name} registrato con successo nel database partner MESA! 🎉`);
  };

  const handleDeleteChef = async (chefId: string, deleteLinkedUser = false) => {
    const targetChef = chefs.find(c => c.id === chefId);
    const chefName = targetChef?.name || chefId;

    await firestoreDelete('chefs', chefId);
    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, 'settings', 'catalog'), { deletedChefIds: arrayUnion(chefId) }, { merge: true });
      } catch (err) {
        console.error('Failed to record deleted chef id', err);
      }
    }

    setChefs(prev => prev.filter(c => c.id !== chefId));
    setCart(prev => prev.filter(item => item.chefId !== chefId));
    if (selectedChef && selectedChef.id === chefId) {
      setSelectedChef(null);
      if (currentView === ViewState.CHEF_PROFILE || currentView === ViewState.PUBLIC_STOREFRONT) {
        setCurrentView(ViewState.HOME);
      }
    }

    if (deleteLinkedUser && targetChef) {
      const linkedUser = registeredUsers.find(u =>
        u.role === 'chef' && (
          u.id === chefId.replace('chef-', '') ||
          (targetChef.email && u.email.trim().toLowerCase() === targetChef.email.trim().toLowerCase()) ||
          `${u.name} ${u.lastName}`.trim().toLowerCase() === targetChef.name.trim().toLowerCase()
        )
      );
      if (linkedUser) {
        await firestoreDelete('users', linkedUser.id);
        setRegisteredUsers(prev => prev.filter(u => u.id !== linkedUser.id));
        if (currentUser && currentUser.id === linkedUser.id) {
          setCurrentUser(null);
        }
      }
    }

    showNotification(`Cuoco "${chefName}" eliminato definitivamente dal catalogo.`);
  };

  const handleChefSubmitApplication = async (newApp: ChefApplication) => {
    await firestoreWrite('chefApplications', newApp.id, newApp);
    showNotification(`Candidatura Cuoco inviata con successo! In attesa di valutazione dall'Amministratore. 🧑‍🍳`);
  };

  const handleApproveApplication = async (appId: string) => {
    const app = chefApplications.find(a => a.id === appId);
    if (app) {
      await firestoreWrite('chefApplications', appId, { status: 'approved', reviewedAt: new Date().toLocaleString('it-IT') }, true);
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
      firestoreWrite('chefs', newChef.id, newChef);

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
    await firestoreWrite('chefApplications', appId, { status: 'rejected', adminNotes: notes || 'Documenti incompleti', reviewedAt: new Date().toLocaleString('it-IT') }, true);
    showNotification(`Candidatura #${appId} aggiornata in sospeso.`);
  };

  const handleRegisterUser = async (newUser: AppUser) => {
    await firestoreWrite('users', newUser.id, newUser);
    setRegisteredUsers(prev => prev.some(u => u.id === newUser.id)
      ? prev.map(u => u.id === newUser.id ? newUser : u)
      : [newUser, ...prev]);

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
    await firestoreWrite('users', updatedUser.id, updatedUser, true);
    setRegisteredUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }

    if (updatedUser.role === 'chef') {
      const nextChefs = chefs.map(c => {
        const isMatch = c.id === `chef-${updatedUser.id}` || 
                        c.id === updatedUser.id ||
                        c.email.trim().toLowerCase() === updatedUser.email.trim().toLowerCase() ||
                        c.name.trim().toLowerCase() === `${updatedUser.name} ${updatedUser.lastName}`.trim().toLowerCase() ||
                        c.name.trim().toLowerCase() === updatedUser.name.trim().toLowerCase();
        if (isMatch) {
          const updatedChef = {
            ...c,
            name: `${updatedUser.name} ${updatedUser.lastName}`.trim(),
            email: updatedUser.email,
            password: updatedUser.password || c.password,
            location: updatedUser.addresses[0]?.street || c.location
          };
          firestoreWrite('chefs', updatedChef.id, updatedChef, true);
          return updatedChef;
        }
        return c;
      });
      setChefs(nextChefs);
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
    const userToUpdate = registeredUsers.find(u => u.id === userId);
    if (userToUpdate) {
      const updatedUser = {
        ...userToUpdate,
        addresses: userToUpdate.addresses.map(addr => addr.id === addressId ? { ...addr, isVerified } : addr)
      };
      await firestoreWrite('users', userId, updatedUser, true);
    }

    showNotification(isVerified ? "Indirizzo CONVALIDATO con successo! ✅" : "Convalida indirizzo revocata.");
  };

  const handleDeleteUser = async (userId: string) => {
    await firestoreDelete('users', userId);
    setRegisteredUsers(prev => prev.filter(u => u.id !== userId));
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
            await firestoreWrite('orders', order.id, { ...order, status: nextStatus }, true);
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
    const isFav = favorites.includes(dishId);
    const next = isFav ? favorites.filter(id => id !== dishId) : [...favorites, dishId];
    setFavorites(next);
    if (currentUser) {
      setCurrentUser({ ...currentUser, favoriteDishIds: next });
    }
    showNotification(isFav ? "Rimosso dai preferiti" : "Aggiunto ai preferiti ❤️");
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
    await firestoreWrite('orders', newOrder.id, newOrder);
    setCart([]);
    setSelectedOrder(newOrder);
    setCurrentView(ViewState.ORDERS);
    showNotification(`Ordine inviato con successo via ${notificationChannel === 'whatsapp' ? 'WhatsApp' : 'sistema MESA'}! 🚀`);
  };

  const handleReviewSubmit = (rating: number, comment: string) => {
    if (!reviewOrder) return;
    setOrders(prev => prev.map(o => o.id === reviewOrder.id ? { ...o, isReviewed: true } : o));
    firestoreWrite('orders', reviewOrder.id, { isReviewed: true }, true);
    setReviewOrder(null);
    showNotification("Grazie per la tua recensione! ⭐");
  };

  const handleViewProfile = (chef: Chef) => {
    setSelectedChef(chef);
    setCurrentView(ViewState.CHEF_PROFILE);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const baseChefs = chefs;

  const normalizeSearchText = (value?: string) =>
    (value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();

  const dishMatchesCategories = (dish: Dish, categories: string[]): boolean => {
    if (!categories || categories.length === 0) return true;
    const tags = dish.tags.map(t => normalizeSearchText(t));
    const text = normalizeSearchText(`${dish.name} ${dish.description} ${(dish.ingredients || []).join(' ')}`);
    return categories.every(cat => {
      const c = normalizeSearchText(cat);
      if (c === 'carne') {
        return tags.includes('carne') || tags.includes('pollo') ||
          /\b(carne|manzo|pollo|agnello|maiale|anatra|vitello|salsiccia|ragu|kebab|bratwurst|pulled pork|asado|burger|meatballs|bolognese|carbonara|amatriciana)\b/.test(text);
      }
      if (c === 'pesce') {
        return tags.includes('pesce') || tags.includes('sushi') ||
          /\b(pesce|gamber|salmone|merluzzo|tonno|baccala|calamar|cozze|vongole|marisco|sushi|ceviche|gravlax|poisson|orata|branzino)\b/.test(text);
      }
      if (c === 'piccante') {
        return tags.includes('piccante') || tags.includes('spicy') ||
          /\b(piccante|peperoncino|spicy|curry|berbere|harissa|chili|jalapeno|nduja|zighini)\b/.test(text);
      }
      if (c === 'vegetariano') {
        return tags.includes('vegetariano') || tags.includes('vegano') || tags.includes('veg') || tags.includes('vegetariana');
      }
      return tags.includes(c) || text.includes(c);
    });
  };

  const hasActiveFilters = Boolean(
    filters.search.trim() ||
    filters.countries.length > 0 ||
    filters.categories.length > 0 ||
    filters.maxPrice < 50
  );

  const { filteredChefs, matchingDishes } = useMemo(() => {
    const tokens = normalizeSearchText(filters.search).split(/\s+/).filter(Boolean);
    const matchedChefs: Chef[] = [];
    const matchedDishes: { dish: Dish; chef: Chef; score: number }[] = [];

    baseChefs.forEach(chef => {
      const matchesCountry = filters.countries.length === 0 || filters.countries.includes(chef.nationality);
      if (!matchesCountry) return;

      const countryKeywords = nationalityNames[chef.nationality] || [];
      const chefText = normalizeSearchText([
        chef.name,
        chef.bio,
        chef.location,
        chef.continent,
        chef.countryName,
        ...countryKeywords,
        ...chef.specialties
      ].join(' '));

      const chefMatchingDishes: Dish[] = [];

      chef.dishes.forEach(dish => {
        if (dish.price > filters.maxPrice) return;
        if (!dishMatchesCategories(dish, filters.categories)) return;

        const dishNameNorm = normalizeSearchText(dish.name);
        const dishText = normalizeSearchText([
          dish.name,
          dish.description,
          ...(dish.ingredients || []),
          ...dish.tags,
          dish.preparation || ''
        ].join(' '));
        const combinedText = `${dishText} ${chefText}`;

        const matchesTokens = tokens.length === 0 || tokens.every(token => combinedText.includes(token));
        if (!matchesTokens) return;

        let score = 0;
        if (tokens.length > 0) {
          tokens.forEach(token => {
            if (dishNameNorm.includes(token)) score += 10;
            else if (dishText.includes(token)) score += 5;
            else score += 1;
          });
        }

        chefMatchingDishes.push(dish);
        matchedDishes.push({ dish, chef, score });
      });

      if (chefMatchingDishes.length > 0) {
        matchedChefs.push({
          ...chef,
          dishes: chefMatchingDishes
        });
      }
    });

    if (tokens.length > 0) {
      matchedDishes.sort((a, b) => b.score - a.score || a.dish.price - b.dish.price);
    }

    return { filteredChefs: matchedChefs, matchingDishes: matchedDishes };
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
      
      {currentView === ViewState.HOME && <FilterBar filters={filters} onFilterChange={setFilters} chefs={chefs} />}

      <main className="max-w-6xl mx-auto px-4 py-6 flex-grow w-full mb-8">
        {currentView === ViewState.HOME && (
          <div className="animate-fade-in">
            {!hasActiveFilters ? (
              <>
                <DailySpecials chefs={chefs} onAddDish={handleInitiateBooking} favorites={favorites} onToggleFavorite={handleToggleFavorite} />
                
                {/* Active Interactive Dish Catalog Subdivided By Provenance */}
                <DishCatalogByOrigin 
                  chefs={chefs} 
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
              <div className="space-y-6">
                <div className="border-b border-gray-100 pb-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <h2 className="text-lg sm:text-2xl font-black text-orange-600 tracking-tight whitespace-nowrap truncate">
                        {filters.search.trim() ? `Risultati per "${filters.search.trim()}"` : 'Piatti Filtrati'}
                      </h2>
                      <span className="hidden sm:inline-block text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap shrink-0">
                        {matchingDishes.length} {matchingDishes.length === 1 ? 'piatto' : 'piatti'} • {filteredChefs.length} {filteredChefs.length === 1 ? 'cuoco' : 'cuochi'}
                      </span>
                    </div>
                    <button
                      onClick={() => setFilters({ search: '', maxPrice: 50, dietary: [], categories: [], countries: [] })}
                      className="px-4 py-2 bg-black hover:bg-orange-600 text-white rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all shrink-0 whitespace-nowrap"
                    >
                      Azzera Filtri
                    </button>
                  </div>
                  <p className="sm:hidden text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-1">
                    {matchingDishes.length} {matchingDishes.length === 1 ? 'piatto trovato' : 'piatti trovati'} • {filteredChefs.length} {filteredChefs.length === 1 ? 'cuoco' : 'cuochi'}
                  </p>
                  {(filters.countries.length > 0 || filters.categories.length > 0 || filters.maxPrice < 50) && (
                    <div className="flex flex-wrap gap-2 mt-2.5">
                      {filters.countries.map(flag => (
                        <button
                          key={flag}
                          onClick={() => setFilters({ ...filters, countries: filters.countries.filter(c => c !== flag) })}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-orange-900 hover:bg-orange-100"
                        >
                          <CountryFlag flag={flag} title={nationalityNames[flag]?.[0] || 'Paese'} size="sm" />
                          <span>{nationalityNames[flag]?.[0] || 'Paese'}</span>
                          <X className="w-3 h-3" />
                        </button>
                      ))}
                      {filters.categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setFilters({ ...filters, categories: filters.categories.filter(c => c !== cat) })}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-bold text-gray-800 hover:bg-gray-200"
                        >
                          <span>{cat}</span>
                          <X className="w-3 h-3" />
                        </button>
                      ))}
                      {filters.maxPrice < 50 && (
                        <button
                          onClick={() => setFilters({ ...filters, maxPrice: 50 })}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-xs font-bold text-green-900 hover:bg-green-100"
                        >
                          <span>Max € {filters.maxPrice}</span>
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {matchingDishes.length > 0 ? (
                  <>
                    {/* Risultati Diretti per Piatto */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {matchingDishes.map(({ dish, chef }) => {
                        const isFav = favorites.includes(dish.id);
                        return (
                          <div
                            key={`${chef.id}-${dish.id}`}
                            onClick={() => handleInitiateBooking(dish)}
                            className="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden flex flex-col justify-between hover:shadow-2xl transition-all duration-300 hover:border-orange-200 cursor-pointer"
                          >
                            <div className="relative h-56 overflow-hidden">
                              <img
                                src={dish.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
                                alt={dish.name}
                                referrerPolicy="no-referrer"
                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'; }}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60"></div>

                              <div className="absolute top-4 left-4 bg-black/85 backdrop-blur-md text-white text-[11px] font-black px-3.5 py-1.5 rounded-2xl uppercase tracking-widest shadow-xl">
                                € {dish.price.toFixed(2)}
                              </div>

                              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm text-black text-[10px] font-black px-3 py-1.5 rounded-2xl uppercase tracking-wider shadow-md flex items-center gap-1.5">
                                <CountryFlag flag={chef.nationality} title={chef.countryName} size="sm" />
                                <span className="text-gray-800 tracking-tight">{chef.countryName}</span>
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleFavorite(dish.id);
                                }}
                                className="absolute top-4 right-4 p-2.5 bg-white/95 backdrop-blur rounded-2xl shadow-xl hover:bg-white transition-all z-10"
                              >
                                <Heart className={`w-5 h-5 ${isFav ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                              </button>
                            </div>

                            <div className="p-6 flex-1 flex flex-col justify-between">
                              <div>
                                <h3 className="font-black italic text-orange-600 text-base sm:text-lg leading-tight group-hover:text-orange-700 transition-colors mb-2 truncate">
                                  {dish.name}
                                </h3>
                                <p className="text-black text-xs leading-relaxed mb-3 line-clamp-2 italic font-medium">
                                  "{dish.description}"
                                </p>
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                  <span className="px-2.5 py-1 bg-orange-50 text-orange-800 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-orange-600" /> 25-35 min
                                  </span>
                                  {dish.tags.map(tag => (
                                    <span key={tag} className="px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-500">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="space-y-3">
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewProfile(chef);
                                  }}
                                  className="flex items-center justify-between p-2.5 bg-gray-50 hover:bg-orange-50/60 rounded-2xl border border-gray-100 transition-colors"
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <img src={chef.avatar} alt={chef.name} className="w-8 h-8 rounded-xl object-cover shrink-0" />
                                    <div className="min-w-0">
                                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Chef</p>
                                      <span className="text-xs font-bold text-gray-800 truncate block">{chef.name}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <span className="flex items-center gap-0.5 bg-amber-400/15 text-amber-800 px-2 py-0.5 rounded-lg text-[9px] font-black">
                                      <Star className="w-2.5 h-2.5 fill-current text-amber-500" />
                                      {chef.rating}
                                    </span>
                                    <span className="flex items-center gap-0.5 text-gray-500 text-[9px] font-bold">
                                      <MapPin className="w-2.5 h-2.5 text-orange-600" />
                                      {chef.distance} km
                                    </span>
                                  </div>
                                </div>

                                <button className="w-full py-3 rounded-2xl bg-orange-600 hover:bg-black text-white font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all shadow-md active:scale-95">
                                  <ShoppingBag className="w-4 h-4" />
                                  <span>Scegli e Prenota</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Cuochi corrispondenti */}
                    <div className="pt-8 border-t border-gray-100 space-y-6">
                      <h3 className="text-xl font-black text-gray-900 tracking-tight">
                        Cuochi Corrispondenti ({filteredChefs.length})
                      </h3>
                      <div className="grid grid-cols-1 gap-8">
                        {filteredChefs.map(chef => (
                          <ChefCard key={chef.id} chef={chef} onAddDish={handleInitiateBooking} onViewProfile={handleViewProfile} favorites={favorites} onToggleFavorite={handleToggleFavorite} />
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 px-6">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <SearchX className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-700 mb-2">Nessun piatto trovato</h3>
                    <p className="text-gray-500 font-medium mb-6">Prova a cercare un altro ingrediente, paese o riduci i filtri attivi.</p>
                    <button
                      onClick={() => setFilters({ search: '', maxPrice: 50, dietary: [], categories: [], countries: [] })}
                      className="px-6 py-3 bg-orange-600 hover:bg-black text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all"
                    >
                      Mostra Tutti i Piatti
                    </button>
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
                  await firestoreWrite('orders', orderId, { status }, true);
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
              if (auth) signOut(auth).catch(() => {});
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
            onDeleteChef={handleDeleteChef}
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
