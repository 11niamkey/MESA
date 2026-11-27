
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { db, auth, isFirebaseConfigured, OperationType, handleFirestoreError } from './firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, getDocs, getDoc, arrayUnion, writeBatch } from 'firebase/firestore';
import { deleteUser, onAuthStateChanged, signOut } from 'firebase/auth';
import { Header } from './components/Header';
import { AddressGateModal } from './components/AddressGateModal';
import { ChefCard } from './components/ChefCard';
import { CartDrawer } from './components/CartDrawer';
import { FilterBar, nationalityNames } from './components/FilterBar';
import { ChefProfile } from './components/ChefProfile';
import { BookingModal } from './components/BookingModal';
import { DailySpecials } from './components/DailySpecials';
import { AuthModal } from './components/AuthModal';
import { MesaChefs } from './components/MesaChefs';
import { CultureSection } from './components/CultureSection';
import { ExperiencesSection } from './components/ExperiencesSection';
import { FavoritesSection } from './components/FavoritesSection';
import { Footer } from './components/Footer';
import { NotificationToast, ToastVariant } from './components/NotificationToast';
import { BottomNav } from './components/BottomNav';
import { InfoPage } from './components/InfoPage';
import { OrderTracking } from './components/OrderTracking';
import { OrderReviewModal, ReviewSubmissionPayload } from './components/OrderReviewModal';
import { ShareModal } from './components/ShareModal';
import { AdminDashboard } from './components/AdminDashboard';
import { LaunchTour } from './components/LaunchTour';
import { ChefOnboarding } from './components/ChefOnboarding';
import { ChefGroupSection } from './components/ChefGroupSection';
import { PublicStorefront } from './components/PublicStorefront';
import { HeritageMenu } from './components/HeritageMenu';
import { LandingPage } from './components/LandingPage';
import { PersonalArea } from './components/PersonalArea';
import { DishCatalogByOrigin } from './components/DishCatalogByOrigin';
import { PwaInstallModal, BeforeInstallPromptEvent } from './components/PwaInstallModal';
import { CountryFlag } from './components/CountryFlag';
import { AllergensRow } from './components/Allergens';
import { ConfirmDeleteOrdersModal } from './components/ConfirmDeleteOrdersModal';
import { isPordenoneLocation, normalizeLocationToPordenone, resolvePordenoneZip, findPordenoneComune } from './components/italianTerritoryData';
import { playNewOrderChime, unlockAudioContext } from './utils/soundAlert';
import {
  isConcludedOrder,
  canClientCancelOrder,
  formatOrderCode,
  formatOrderDeleteError,
  getBlockingOrdersForUser,
  matchesChefUser,
  OrderDeleteResult,
  ProfileDeleteResult,
} from './utils/orderUtils';
import { isChefBookable, validateBetaOrderSubmission, BetaOrderValidationResult } from './utils/chefUtils';
import { clampRating, computeOverallRating, getChefRatingSummary, isOrderEligibleForReview, MAX_REVIEW_COMMENT_LENGTH } from './utils/reviewUtils';
import { MOCK_CHEFS } from './constants';
import { CartItem, Dish, ViewState, FilterState, Chef, Message, Order, OrderReview, OrderStatus, OrderTimelineEntry, ORDER_STATUS_LABELS, Continent, AppUser, UserAddress, ChefApplication } from './types';
import { SearchX, ShoppingBag, X, Heart, Star, MapPin, Clock, Volume2, VolumeX, Trash2, BellRing, XCircle } from 'lucide-react';

const formatChefDisplayName = (name?: string) => {
  const trimmed = (name || 'MESA').trim();
  return /^chef\b/i.test(trimmed) ? trimmed : `Chef ${trimmed}`;
};

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
    location: 'Pordenone (PN), Torre',
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
    proposedDishAllergens: ['Pesce', 'Glutine'],
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
    location: 'Sacile (PN), Centro',
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
        title: 'Certificato HACCP Friuli-Venezia Giulia',
        fileName: 'haccp_valenti_2026.pdf',
        fileSize: '810 KB',
        uploadedAt: '11/08/2026',
        isVerified: true
      }
    ],
    proposedDishName: 'Tagliatelle d\'Anatra al Mattarello col Ragù di Mamma',
    proposedDishDesc: 'Uova di galline ruspanti e farina di grano tenero tipo 0, condite con ragù classico bolognese cotto 6 ore.',
    proposedDishPrice: 15.00,
    proposedDishAllergens: ['Glutine', 'Uova', 'Lattosio', 'Sedano'],
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
const MOCK_CHEF_BY_ID = new Map(MOCK_CHEFS.map(c => [c.id, c]));

const normalizeChef = (chef: Chef): Chef => {
  const cleanName = chef.name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const mappedCountry = nationalityNames[chef.nationality]?.[0];
  const resolvedCountry =
    chef.countryName && !(chef.countryName === 'Italia' && chef.nationality !== '🇮🇹')
      ? chef.countryName
      : mappedCountry || chef.countryName || 'Italia';
  const mockMatch = MOCK_CHEF_BY_ID.get(chef.id);
  const resolvedLocation = isPordenoneLocation(chef.location)
    ? chef.location
    : (mockMatch?.location || 'Pordenone (PN), Centro');

  const hadOldCityText = /\b(Milano|Napoli|Genova|Prato|Trastevere)\b/i.test(`${chef.bio || ''} ${chef.fullBio || ''}`);
  const normalizedDishes = Array.isArray(chef.dishes)
    ? chef.dishes.map(dish => {
        if (dish.allergens !== undefined) return dish;
        const mockDish = mockMatch?.dishes.find(md => md.id === dish.id);
        return mockDish?.allergens !== undefined ? { ...dish, allergens: mockDish.allergens } : dish;
      })
    : [];

  return {
    ...chef,
    dishes: normalizedDishes,
    email: chef.email || `chef.${cleanName}@mesa.com`,
    password: chef.password || 'demo123',
    countryName: resolvedCountry,
    location: resolvedLocation,
    ...(mockMatch && hadOldCityText ? { bio: mockMatch.bio, fullBio: mockMatch.fullBio } : {})
  };
};

const stripUndefinedDeep = (value: any): any => {
  if (value === undefined) return undefined;
  if (value === null || value instanceof Date || typeof value !== 'object') return value;
  if (Array.isArray(value)) {
    return value.map(stripUndefinedDeep).filter((v) => v !== undefined);
  }
  const clean: Record<string, any> = {};
  Object.entries(value).forEach(([k, v]) => {
    const cleaned = stripUndefinedDeep(v);
    if (cleaned !== undefined) {
      clean[k] = cleaned;
    }
  });
  return clean;
};

const firestoreWrite = async (collectionName: string, id: string, data: any, merge = false, rethrow = false) => {
  if (!isFirebaseConfigured) return;
  try {
    const payload = stripUndefinedDeep(data);
    if (merge) {
      await setDoc(doc(db, collectionName, id), payload, { merge: true });
    } else {
      await setDoc(doc(db, collectionName, id), payload);
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${collectionName}/${id}`, rethrow);
  }
};

const firestoreDelete = async (collectionName: string, id: string) => {
  if (!isFirebaseConfigured) return;
  try {
    await deleteDoc(doc(db, collectionName, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${collectionName}/${id}`);
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
    const catalogData = catalogSnap.exists() ? catalogSnap.data() : {};
    const deletedChefIds = new Set<string>(catalogData.deletedChefIds || []);
    const deletedUserIds = new Set<string>(catalogData.deletedUserIds || []);
    const deletedAppIds = new Set<string>(catalogData.deletedAppIds || []);

    const writes: Promise<void>[] = [];
    const existingChefIds = new Set(chefsSnap.docs.map(d => d.id));
    MOCK_CHEFS.map(normalizeChef).forEach(c => {
      if (!existingChefIds.has(c.id) && !deletedChefIds.has(c.id)) {
        writes.push(setDoc(doc(db, 'chefs', c.id), c));
      }
    });

    // Enforce Provincia di Pordenone competence area and backfill allergens on existing Firestore chef docs
    chefsSnap.docs.forEach(docSnap => {
      const data = docSnap.data() as Chef;
      const normalized = normalizeChef(data);
      const dishesChanged = JSON.stringify(normalized.dishes) !== JSON.stringify(data.dishes || []);
      if (
        normalized.location !== data.location ||
        normalized.bio !== data.bio ||
        normalized.fullBio !== data.fullBio ||
        dishesChanged
      ) {
        writes.push(
          setDoc(
            doc(db, 'chefs', docSnap.id),
            {
              location: normalized.location,
              ...(normalized.bio !== data.bio ? { bio: normalized.bio } : {}),
              ...(normalized.fullBio !== data.fullBio ? { fullBio: normalized.fullBio } : {}),
              ...(dishesChanged ? { dishes: normalized.dishes } : {})
            },
            { merge: true }
          )
        );
      }
    });

    const existingUserIds = new Set(usersSnap.docs.map(d => d.id));
    DEFAULT_USERS.forEach(u => {
      if (!existingUserIds.has(u.id) && (u.role === 'admin' || !deletedUserIds.has(u.id))) {
        writes.push(setDoc(doc(db, 'users', u.id), u));
      }
    });

    // Migrate existing chef user addresses outside Provincia di Pordenone
    usersSnap.docs.forEach(docSnap => {
      const u = docSnap.data() as AppUser;
      if (u.role === 'chef' && Array.isArray(u.addresses) && u.addresses.length > 0) {
        const hasOutOfProvince = u.addresses.some(a => !isPordenoneLocation(a.street || a.city, a.zip));
        if (hasOutOfProvince) {
          const nextAddresses = u.addresses.map(a =>
            isPordenoneLocation(a.street || a.city, a.zip)
              ? a
              : {
                  ...a,
                  street: 'Pordenone (PN), Centro',
                  city: 'Pordenone (PN)',
                  zip: '33170'
                }
          );
          writes.push(setDoc(doc(db, 'users', docSnap.id), { addresses: nextAddresses }, { merge: true }));
        }
      }
    });

    const existingAppIds = new Set(appsSnap.docs.map(d => d.id));
    const defaultAppById = new Map(DEFAULT_APPLICATIONS.map(a => [a.id, a]));
    DEFAULT_APPLICATIONS.forEach(a => {
      if (!existingAppIds.has(a.id) && !deletedAppIds.has(a.id)) {
        writes.push(setDoc(doc(db, 'chefApplications', a.id), a));
      }
    });

    // Migrate existing chef applications outside Provincia di Pordenone
    appsSnap.docs.forEach(docSnap => {
      const appData = docSnap.data() as ChefApplication;
      if (!isPordenoneLocation(appData.location)) {
        const defaultMatch = defaultAppById.get(docSnap.id);
        const resolvedLoc = defaultMatch?.location || 'Pordenone (PN), Centro';
        writes.push(setDoc(doc(db, 'chefApplications', docSnap.id), { location: resolvedLoc }, { merge: true }));
      }
    });

    if (writes.length > 0) {
      await Promise.all(writes);
    }
  } catch (err) {
    console.error('Seeding Firestore defaults failed', err);
  }
};

const normalizeOrderStatus = (rawStatus: unknown): OrderStatus => {
  const s = String(rawStatus || '').trim();
  const lower = s.toLowerCase();
  if (lower === 'pending' || lower === 'in_attesa' || lower === 'ricevuto') return 'PENDING_CONFIRMATION';
  if (lower === 'cancelled' || lower === 'canceled' || lower === 'annullato') return 'CANCELLED';
  if (
    s === 'PENDING_CONFIRMATION' ||
    s === 'CONFIRMED' ||
    s === 'REJECTED' ||
    s === 'CANCELLED' ||
    s === 'PLACED' ||
    s === 'PREPARING' ||
    s === 'READY' ||
    s === 'DELIVERING' ||
    s === 'COMPLETED'
  ) {
    return s;
  }
  return 'PENDING_CONFIRMATION';
};

const isPendingOrderStatus = (rawStatus: unknown): boolean => {
  const s = String(rawStatus || '').trim().toLowerCase();
  return s === 'pending' || s === 'pending_confirmation';
};

const isOrderForChefUser = (order: Order, user: AppUser | null, chefsList: Chef[]): boolean => {
  if (!user || user.role !== 'chef') return false;
  const matchedChef = chefsList.find(c =>
    (c.email && user.email && c.email.toLowerCase().trim() === user.email.toLowerCase().trim()) ||
    c.id === `chef-${user.id}` ||
    c.id === user.id ||
    `usr-${c.id}` === user.id ||
    `usr-${c.id.replace('chef-', '')}` === user.id
  );
  if (matchedChef) {
    if (order.chefId === matchedChef.id) return true;
    if (order.chefName?.trim().toLowerCase() === matchedChef.name.trim().toLowerCase()) return true;
  }
  const fullName = `${user.name} ${user.lastName}`.trim().toLowerCase();
  const brand = (user.brandName || '').trim().toLowerCase();
  const orderChefName = (order.chefName || '').trim().toLowerCase();
  return (
    order.chefId === user.id ||
    order.chefId === `chef-${user.id}` ||
    `usr-${order.chefId}` === user.id ||
    `usr-${String(order.chefId || '').replace('chef-', '')}` === user.id ||
    (Boolean(fullName) && orderChefName === fullName) ||
    (Boolean(brand) && orderChefName === brand)
  );
};

function App() {
  // Always start on the welcome/landing screen on every open or page refresh (in-memory session state only)
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.LANDING);
  const [verifiedAddress, setVerifiedAddress] = useState<string>(() => {
    const saved = localStorage.getItem('mesa_verified_address');
    if (saved && isPordenoneLocation(saved)) return saved;
    const fallback = 'Pordenone (PN), Centro';
    localStorage.setItem('mesa_verified_address', fallback);
    return fallback;
  });
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

  const [guestOrderIds, setGuestOrderIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mesa_guest_order_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [unreadOrderAlertIds, setUnreadOrderAlertIds] = useState<string[]>([]);
  const [recentlyPlacedOrderId, setRecentlyPlacedOrderId] = useState<string | null>(null);
  const [ordersViewDeleteConfirm, setOrdersViewDeleteConfirm] = useState<{ mode: 'single' | 'bulk'; order?: Order } | null>(null);
  const [isDeletingOrdersView, setIsDeletingOrdersView] = useState(false);
  const [ordersViewDeleteError, setOrdersViewDeleteError] = useState<string | null>(null);
  const [chefSoundEnabled, setChefSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('mesa_chef_sound_alerts');
    return saved === null ? true : saved === 'true';
  });
  const [audioAutoplayBlocked, setAudioAutoplayBlocked] = useState(false);

  const prevOrderStatusesRef = useRef<Record<string, OrderStatus>>({});
  const knownOrderIdsRef = useRef<Set<string>>(new Set());
  const hasLoadedInitialOrdersRef = useRef(false);
  const currentUserRef = useRef<AppUser | null>(currentUser);
  const chefsRef = useRef<Chef[]>(chefs);
  const registeredUsersRef = useRef<AppUser[]>(registeredUsers);
  const chefSoundEnabledRef = useRef<boolean>(chefSoundEnabled);
  const announcedChefSessionRef = useRef<string | null>(null);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  useEffect(() => {
    registeredUsersRef.current = registeredUsers;
  }, [registeredUsers]);

  // Restore MESA user profile if Firebase Auth already has an active session
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) return;
    const unsubAuth = onAuthStateChanged(auth, (fbUser) => {
      if (!fbUser?.email || currentUserRef.current) return;
      const normalized = fbUser.email.trim().toLowerCase();
      const matched = registeredUsersRef.current.find(
        u => u.email.trim().toLowerCase() === normalized
      );
      if (matched) {
        setCurrentUser(matched);
      }
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    chefsRef.current = chefs;
  }, [chefs]);

  useEffect(() => {
    chefSoundEnabledRef.current = chefSoundEnabled;
    localStorage.setItem('mesa_chef_sound_alerts', String(chefSoundEnabled));
    if (!chefSoundEnabled) {
      setAudioAutoplayBlocked(false);
    }
  }, [chefSoundEnabled]);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'chef' || !chefSoundEnabled) return;
    const handleUserGesture = () => {
      void unlockAudioContext().then((unlocked) => {
        if (unlocked) {
          setAudioAutoplayBlocked(false);
        }
      });
    };
    window.addEventListener('pointerdown', handleUserGesture, { passive: true });
    window.addEventListener('keydown', handleUserGesture, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', handleUserGesture);
      window.removeEventListener('keydown', handleUserGesture);
    };
  }, [currentUser?.id, currentUser?.role, chefSoundEnabled]);

  useEffect(() => {
    if (!isFirebaseConfigured) return;

    let unsubUsers: (() => void) | undefined;
    let unsubOrders: (() => void) | undefined;
    let unsubApps: (() => void) | undefined;
    let unsubChefs: (() => void) | undefined;
    let unsubReviews: (() => void) | undefined;

    (async () => {
      // Seed demo data once, then attach realtime listeners
      await seedFirestoreDefaults();

      // Listen to Firebase users
      unsubUsers = onSnapshot(
        collection(db, 'users'),
        (snapshot) => {
          const users: AppUser[] = snapshot.docs.map(d => d.data() as AppUser);
          setRegisteredUsers(users);
        },
        (error) => handleFirestoreError(error, OperationType.GET, 'users')
      );

      // Listen to Firebase chefs (catalogo)
      unsubChefs = onSnapshot(
        collection(db, 'chefs'),
        (snapshot) => {
          const chefsData: Chef[] = snapshot.docs.map(d => normalizeChef(d.data() as Chef));
          setChefs(chefsData);
        },
        (error) => handleFirestoreError(error, OperationType.GET, 'chefs')
      );

      // Listen to Firebase orders in real time across Client, Chef, and Admin
      unsubOrders = onSnapshot(
        collection(db, 'orders'),
        (snapshot) => {
          const ordersData: Order[] = snapshot.docs.map(d => {
            const data = d.data();
            const parsedTimeline = Array.isArray(data.timeline)
              ? data.timeline.map((entry: any) => ({
                  ...entry,
                  status: normalizeOrderStatus(entry.status),
                  timestamp: entry.timestamp?.toDate ? entry.timestamp.toDate() : new Date(entry.timestamp),
                }))
              : undefined;
            return {
              ...data,
              id: data.id || d.id,
              items: Array.isArray(data.items) ? data.items : [],
              total: Number(data.total) || 0,
              status: normalizeOrderStatus(data.status),
              timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : new Date(data.timestamp),
              ...(parsedTimeline ? { timeline: parsedTimeline } : {}),
            } as Order;
          });
          ordersData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

          const activeUser = currentUserRef.current;
          const activeChefs = chefsRef.current;
          const prevMap = prevOrderStatusesRef.current;
          const knownIds = knownOrderIdsRef.current;

          if (hasLoadedInitialOrdersRef.current && activeUser) {
            // 1. Chef Real-Time Alert: new pending orders targeting logged-in chef
            if (activeUser.role === 'chef') {
              const incomingChefOrders = ordersData.filter(
                order =>
                  !knownIds.has(order.id) &&
                  isPendingOrderStatus(order.status) &&
                  isOrderForChefUser(order, activeUser, activeChefs)
              );
              if (incomingChefOrders.length > 0) {
                const newest = incomingChefOrders[0];
                const dishTitle = newest.items[0]?.name || 'Nuovo piatto';
                setUnreadOrderAlertIds(prev =>
                  Array.from(new Set([...prev, ...incomingChefOrders.map(o => o.id)]))
                );
                if (chefSoundEnabledRef.current) {
                  void playNewOrderChime().then((played) => {
                    setAudioAutoplayBlocked(!played);
                  });
                }
                showNotification(
                  incomingChefOrders.length === 1
                    ? `#${newest.id.split('-')[0]} • ${dishTitle} (€${newest.total.toFixed(2)})`
                    : `${incomingChefOrders.length} nuovi ordini in attesa di conferma!`,
                  {
                    title: 'Nuovo ordine ricevuto!',
                    variant: 'chef',
                    actionLabel: 'Vedi Ordini',
                    onAction: () => {
                      setSelectedOrder(newest);
                      setCurrentView(ViewState.ORDERS);
                    },
                  }
                );
              }

              // Also notify chef in real time if a client cancels a pending order
              const cancelledChefOrders = ordersData.filter(order => {
                const prevStatus = prevMap[order.id];
                return (
                  Boolean(prevStatus && prevStatus !== order.status) &&
                  order.status === 'CANCELLED' &&
                  isOrderForChefUser(order, activeUser, activeChefs)
                );
              });
              if (cancelledChefOrders.length > 0) {
                const cancelledOrder = cancelledChefOrders[0];
                setUnreadOrderAlertIds(prev => prev.filter(id => !cancelledChefOrders.some(c => c.id === id)));
                showNotification(
                  `Ordine ${formatOrderCode(cancelledOrder.id)} annullato dal cliente.`,
                  {
                    title: 'Ordine Annullato',
                    variant: 'warning',
                    actionLabel: 'Dettagli',
                    onAction: () => {
                      setSelectedOrder(cancelledOrder);
                      setCurrentView(ViewState.ORDERS);
                    },
                  }
                );
              }
            }

            // 2. Client Real-Time Alert: order status updates for logged-in client
            const updatedClientOrders = ordersData.filter(order => {
              const prevStatus = prevMap[order.id];
              return (
                Boolean(prevStatus && prevStatus !== order.status && order.userId === activeUser.id) &&
                order.status !== 'CANCELLED'
              );
            });

            if (updatedClientOrders.length > 0) {
              setUnreadOrderAlertIds(prev =>
                Array.from(new Set([...prev, ...updatedClientOrders.map(o => o.id)]))
              );
              const latestUpdated = updatedClientOrders[0];
              const label = ORDER_STATUS_LABELS[latestUpdated.status] || latestUpdated.status;
              const code = `#${latestUpdated.id.split('-')[0]}`;
              let variant: ToastVariant = 'info';
              let title = 'Aggiornamento Ordine';
              let msg = `Ordine ${code}: ${label}`;

              if (latestUpdated.status === 'CONFIRMED' || latestUpdated.status === 'PLACED') {
                variant = 'success';
                title = 'Ordine Confermato';
                msg = `Ordine ${code} confermato da ${formatChefDisplayName(latestUpdated.chefName)}!`;
              } else if (latestUpdated.status === 'REJECTED') {
                variant = 'error';
                title = 'Ordine Rifiutato';
                msg = `Ordine ${code} rifiutato da ${formatChefDisplayName(latestUpdated.chefName)}.`;
              } else if (latestUpdated.status === 'PREPARING') {
                variant = 'info';
                title = 'In Cucina';
                msg = `${formatChefDisplayName(latestUpdated.chefName)} sta preparando l'ordine ${code}!`;
              } else if (latestUpdated.status === 'READY') {
                variant = 'success';
                title = 'Ordine Pronto!';
                msg = `Ordine ${code} pronto per ${latestUpdated.deliveryMode === 'delivery' ? 'la consegna' : 'il ritiro'}!`;
              } else if (latestUpdated.status === 'DELIVERING') {
                variant = 'info';
                title = 'In Consegna';
                msg = `Il rider sta arrivando con il tuo ordine ${code}!`;
              } else if (latestUpdated.status === 'COMPLETED') {
                variant = 'success';
                title = 'Ordine Completato';
                msg = `Ordine ${code} completato! Buon appetito.`;
              }

              showNotification(msg, {
                title,
                variant,
                actionLabel: 'Vedi Ordine',
                onAction: () => {
                  setSelectedOrder(latestUpdated);
                  setCurrentView(ViewState.ORDERS);
                },
              });
            }
          }

          hasLoadedInitialOrdersRef.current = true;
          const nextMap: Record<string, OrderStatus> = {};
          const nextIds = new Set<string>();
          ordersData.forEach(o => {
            nextMap[o.id] = o.status;
            nextIds.add(o.id);
          });
          prevOrderStatusesRef.current = nextMap;
          knownOrderIdsRef.current = nextIds;

          setOrders(ordersData);
        },
        (error) => handleFirestoreError(error, OperationType.GET, 'orders')
      );

      // Listen to Firebase chefApplications in real time
      unsubApps = onSnapshot(
        collection(db, 'chefApplications'),
        (snapshot) => {
          const apps: ChefApplication[] = snapshot.docs.map(d => d.data() as ChefApplication);
          setChefApplications(apps);
        },
        (error) => handleFirestoreError(error, OperationType.GET, 'chefApplications')
      );

      // Listen to verified OrderReviews in real time
      unsubReviews = onSnapshot(
        collection(db, 'reviews'),
        (snapshot) => {
          const revs: OrderReview[] = snapshot.docs.map(d => {
            const data = d.data() as OrderReview;
            return {
              ...data,
              id: data.id || d.id,
              orderId: data.orderId || d.id,
              dishIds: Array.isArray(data.dishIds) ? data.dishIds : [],
            };
          });
          setReviews(revs);
        },
        (error) => handleFirestoreError(error, OperationType.GET, 'reviews')
      );
    })();

    return () => {
      unsubUsers?.();
      unsubOrders?.();
      unsubApps?.();
      unsubChefs?.();
      unsubReviews?.();
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

  // Keep active verifiedAddress synced with the user's verified addresses (reset/fallback on deletion)
  useEffect(() => {
    if (!currentUser) return;
    const formattedList = currentUser.addresses
      .filter(a => a.isVerified)
      .map(a => `${a.street}, ${a.city}, ${a.zip}`);

    setVerifiedAddress(prev => {
      if (prev && formattedList.includes(prev)) {
        return prev;
      }
      const nextAddr = formattedList[0] || '';
      if (nextAddr) {
        localStorage.setItem('mesa_verified_address', nextAddr);
      } else {
        localStorage.removeItem('mesa_verified_address');
      }
      return nextAddr;
    });
  }, [currentUser]);

  // Load favorites from the signed-in user's profile (preserving guest selections on login)
  useEffect(() => {
    if (currentUser) {
      setFavorites(prev => Array.from(new Set([...(currentUser.favoriteDishIds || []), ...prev])));
    } else {
      setFavorites([]);
    }
  }, [currentUser?.id]);

  const handleAddressVerified = (addressString: string) => {
    setVerifiedAddress(addressString);
    localStorage.setItem('mesa_verified_address', addressString);
    
    if (currentUser) {
      const parts = addressString.split(',');
      const street = parts[0]?.trim() || addressString;
      const city = parts[1]?.trim() || 'Pordenone';
      const zip = parts[2]?.trim() || '33170';
      
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

  const handleSaveChefDishes = async (chefId: string, dishes: Dish[]): Promise<boolean> => {
    try {
      await firestoreWrite('chefs', chefId, { dishes }, true, true);
      setChefs(prev => prev.map(c => (c.id === chefId ? { ...c, dishes } : c)));
      if (selectedChef && selectedChef.id === chefId) {
        setSelectedChef(prev => (prev ? { ...prev, dishes } : prev));
      }
      showNotification('Piatto e foto salvati e sincronizzati con il catalogo MESA! 🍽️');
      return true;
    } catch (err) {
      console.error('Errore salvataggio piatti:', err);
      showNotification('Errore durante il salvataggio del piatto. Verifica le dimensioni della foto.');
      return false;
    }
  };

  const handleUpdateChef = async (updatedChef: Chef): Promise<boolean> => {
    if (!isPordenoneLocation(updatedChef.location)) {
      showNotification('Area di competenza limitata: l\'indirizzo del cuoco deve trovarsi nella Provincia di Pordenone (PN).');
      return false;
    }

    try {
      const normalizedLocation = normalizeLocationToPordenone(updatedChef.location);
      const chefToSave: Chef = { ...updatedChef, location: normalizedLocation };
      await firestoreWrite('chefs', chefToSave.id, chefToSave, true, true);
      setChefs(prev => prev.map(c => c.id === chefToSave.id ? chefToSave : c));
      if (selectedChef && selectedChef.id === chefToSave.id) {
        setSelectedChef(chefToSave);
      }

      const matchedComune = findPordenoneComune(normalizedLocation);
      const resolvedCity = matchedComune ? `${matchedComune.name} (PN)` : 'Pordenone (PN)';
      const resolvedZip = resolvePordenoneZip(normalizedLocation);

      // Auto-propagate changes to registeredUsers list & Firestore
      const nextUsers = registeredUsers.map(u => {
        const isMatch = u.id === chefToSave.id.replace('chef-', '') ||
                        u.email.trim().toLowerCase() === (chefToSave.email || '').trim().toLowerCase() ||
                        u.name.trim().toLowerCase() === chefToSave.name.trim().toLowerCase() ||
                        `${u.name} ${u.lastName}`.trim().toLowerCase() === chefToSave.name.trim().toLowerCase();
        if (isMatch && u.role === 'chef') {
          const nameParts = chefToSave.name.trim().split(' ');
          const first = nameParts[0] || u.name;
          const last = nameParts.slice(1).join(' ') || '';

          const updatedUser: AppUser = {
            ...u,
            name: first,
            lastName: last,
            email: chefToSave.email || u.email,
            password: chefToSave.password || u.password,
            ...(chefToSave.avatar ? { avatarUrl: chefToSave.avatar } : {})
          };

          if (chefToSave.location) {
            updatedUser.addresses = [
              { id: `addr-${chefToSave.id}`, street: chefToSave.location, city: resolvedCity, zip: resolvedZip, isVerified: true }
            ];
          }

          firestoreWrite('users', updatedUser.id, updatedUser, true);
          if (currentUser && currentUser.id === u.id) {
            setCurrentUser(updatedUser);
          }
          return updatedUser;
        }
        return u;
      });
      setRegisteredUsers(nextUsers);

      // Sync avatar to matching chefApplications if any
      if (updatedChef.avatar && updatedChef.email) {
        const chefEmail = updatedChef.email.trim().toLowerCase();
        setChefApplications(prev =>
          prev.map(a => {
            if (a.email.trim().toLowerCase() === chefEmail) {
              firestoreWrite('chefApplications', a.id, { avatarUrl: updatedChef.avatar }, true);
              return { ...a, avatarUrl: updatedChef.avatar };
            }
            return a;
          })
        );
      }

      showNotification(`Profilo di ${formatChefDisplayName(updatedChef.name)} aggiornato e sincronizzato! 🧑‍🍳`);
      return true;
    } catch (err) {
      console.error('Errore aggiornamento profilo chef:', err);
      showNotification('Errore durante il salvataggio del profilo chef.');
      return false;
    }
  };

  const handleUpdateApplication = async (appId: string, patch: Partial<ChefApplication>) => {
    const targetApp = chefApplications.find(a => a.id === appId);
    await firestoreWrite('chefApplications', appId, patch, true, true);
    setChefApplications(prev =>
      prev.map(a => (a.id === appId ? { ...a, ...patch } : a))
    );

    if (patch.avatarUrl && targetApp) {
      const appEmail = (targetApp.email || '').trim().toLowerCase();
      const matchedUsers = registeredUsers.filter(
        u => (targetApp.userId && u.id === targetApp.userId) || u.email.trim().toLowerCase() === appEmail
      );
      matchedUsers.forEach(u => {
        const updatedUser: AppUser = { ...u, avatarUrl: patch.avatarUrl };
        firestoreWrite('users', updatedUser.id, { avatarUrl: patch.avatarUrl }, true);
        if (currentUser && currentUser.id === updatedUser.id) {
          setCurrentUser(updatedUser);
        }
      });
      if (matchedUsers.length > 0) {
        setRegisteredUsers(prev =>
          prev.map(u =>
            matchedUsers.some(m => m.id === u.id) ? { ...u, avatarUrl: patch.avatarUrl } : u
          )
        );
      }

      const matchedChef = chefs.find(
        c =>
          (targetApp.userId && c.id === `chef-${targetApp.userId}`) ||
          c.id === `chef-${appId.toLowerCase()}` ||
          (c.email && c.email.trim().toLowerCase() === appEmail)
      );
      if (matchedChef) {
        firestoreWrite('chefs', matchedChef.id, { avatar: patch.avatarUrl }, true);
        setChefs(prev =>
          prev.map(c => (c.id === matchedChef.id ? { ...c, avatar: patch.avatarUrl! } : c))
        );
      }
    }
    showNotification('Foto candidatura aggiornata e sincronizzata! 📸');
  };

  const handleAddChef = (newChef: Chef) => {
    setChefs(prev => {
      if (prev.some(c => c.id === newChef.id)) {
        return prev.map(c => c.id === newChef.id ? newChef : c);
      }
      return [newChef, ...prev];
    });
    firestoreWrite('chefs', newChef.id, newChef);
    showNotification(`${formatChefDisplayName(newChef.name)} registrato con successo nel database partner MESA! 🎉`);
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

  const handleChefSubmitApplication = async (newApp: ChefApplication, chosenPassword?: string) => {
    const normalizedEmail = newApp.email.trim().toLowerCase();
    const existingUser = registeredUsers.find(
      u =>
        (newApp.userId && u.id === newApp.userId) ||
        u.email.trim().toLowerCase() === normalizedEmail
    );

    const safeLocation = normalizeLocationToPordenone(newApp.location);
    const matchedComune = findPordenoneComune(safeLocation);
    const locParts = safeLocation.split(',');
    const parsedStreet = locParts[0]?.trim() || safeLocation;
    const parsedCity = matchedComune ? `${matchedComune.name} (PN)` : 'Pordenone (PN)';
    const parsedZip = resolvePordenoneZip(safeLocation);

    let syncedUserId = existingUser?.id || newApp.userId;

    if (existingUser) {
      const hasAddress = existingUser.addresses.some(
        a => a.street.trim().toLowerCase() === parsedStreet.toLowerCase()
      );
      const updatedUser: AppUser = {
        ...existingUser,
        phone: newApp.phone || existingUser.phone,
        brandName: newApp.brandName || existingUser.brandName,
        ...(newApp.avatarUrl ? { avatarUrl: newApp.avatarUrl } : {}),
        ...(chosenPassword && !existingUser.password ? { password: chosenPassword } : {}),
        addresses: hasAddress
          ? existingUser.addresses
          : [
              {
                id: `addr-${newApp.id}`,
                street: parsedStreet,
                city: parsedCity,
                zip: parsedZip,
                isVerified: false
              },
              ...existingUser.addresses
            ]
      };
      await firestoreWrite('users', updatedUser.id, updatedUser, true);
      setRegisteredUsers(prev => prev.map(u => (u.id === updatedUser.id ? updatedUser : u)));
      if (currentUser && currentUser.id === updatedUser.id) {
        setCurrentUser(updatedUser);
      }
    } else {
      const nameParts = (newApp.fullName || 'Chef MESA').trim().split(' ');
      const createdUser: AppUser = {
        id: `usr-${newApp.id.toLowerCase()}`,
        name: nameParts[0] || 'Chef',
        lastName: nameParts.slice(1).join(' ') || 'MESA',
        email: normalizedEmail,
        phone: newApp.phone,
        brandName: newApp.brandName,
        ...(newApp.avatarUrl ? { avatarUrl: newApp.avatarUrl } : {}),
        role: 'chef',
        createdAt: new Date().toLocaleDateString('it-IT'),
        addresses: [
          {
            id: `addr-${newApp.id}`,
            street: parsedStreet,
            city: parsedCity,
            zip: parsedZip,
            isVerified: false
          }
        ],
        password: chosenPassword || 'demo123'
      };
      syncedUserId = createdUser.id;
      await firestoreWrite('users', createdUser.id, createdUser);
      setRegisteredUsers(prev => [createdUser, ...prev.filter(u => u.id !== createdUser.id)]);
    }

    const syncedApp: ChefApplication = {
      ...newApp,
      location: safeLocation,
      email: normalizedEmail,
      ...(syncedUserId ? { userId: syncedUserId } : {})
    };

    setChefApplications(prev => [syncedApp, ...prev.filter(a => a.id !== syncedApp.id)]);
    await firestoreWrite('chefApplications', syncedApp.id, syncedApp, false, true);
    showNotification(`Candidatura "${syncedApp.brandName}" inviata all'Area Admin per la valutazione!`);
  };

  const handleApproveApplication = async (appId: string) => {
    const app = chefApplications.find(a => a.id === appId);
    if (!app) return;

    const normalizedEmail = app.email.trim().toLowerCase();
    const reviewedAt = new Date().toLocaleString('it-IT');

    setChefApplications(prev =>
      prev.map(a => (a.id === appId ? { ...a, status: 'approved', reviewedAt } : a))
    );
    await firestoreWrite('chefApplications', appId, { status: 'approved', reviewedAt }, true);

    const existingUser = registeredUsers.find(
      u =>
        (app.userId && u.id === app.userId) ||
        u.email.trim().toLowerCase() === normalizedEmail
    );

    const resolvedPassword = existingUser?.password || 'demo123';
    const chefId = existingUser
      ? `chef-${existingUser.id}`
      : `chef-${app.id.toLowerCase()}`;

    const existingChef = chefs.find(
      c => c.id === chefId || (c.email && c.email.trim().toLowerCase() === normalizedEmail)
    );

    const safeAppLocation = normalizeLocationToPordenone(app.location);
    const matchedAppComune = findPordenoneComune(safeAppLocation);
    const resolvedAppCity = matchedAppComune ? `${matchedAppComune.name} (PN)` : 'Pordenone (PN)';
    const resolvedAppZip = resolvePordenoneZip(safeAppLocation);

    const newChef: Chef = {
      id: existingChef?.id || chefId,
      name: app.brandName || app.fullName,
      nationality: app.nationality || '🇮🇹',
      countryName: app.countryName || 'Italia',
      continent: app.continent || 'Europa',
      avatar: app.avatarUrl || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80',
      rating: existingChef?.rating || 5.0,
      location: safeAppLocation,
      phone: app.phone || existingUser?.phone || '',
      email: normalizedEmail,
      password: resolvedPassword,
      specialties: app.specialties && app.specialties.length > 0 ? app.specialties : ['Cucina Casalinga'],
      bio: app.bio || 'Ricette artigianali e sapori autentici di casa.',
      availability: app.availabilitySlots && app.availabilitySlots.length > 0 ? app.availabilitySlots : ['12:00 - 15:00', '19:00 - 22:00'],
      availableDays: app.availableDays && app.availableDays.length > 0 ? app.availableDays : [1, 2, 3, 4, 5, 6],
      reviews: existingChef?.reviews || [],
      dishes: existingChef?.dishes && existingChef.dishes.length > 0
        ? existingChef.dishes
        : [
            {
              id: `dish-${app.id.toLowerCase()}-1`,
              name: app.proposedDishName || 'Specialità Tradizionale della Casa',
              description: app.proposedDishDesc || 'Piatto preparato fresco su ordinazione.',
              price: app.proposedDishPrice || 14.5,
              image: app.proposedDishImage || app.kitchenPhotos?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
              chefId: existingChef?.id || chefId,
              tags: app.specialties || ['Tradizionale'],
              allergens: app.proposedDishAllergens || []
            }
          ],
      distance: existingChef?.distance || 1.1,
      verificationStatus: 'approved',
      documents: app.documents || []
    };

    setChefs(prev => [newChef, ...prev.filter(c => c.id !== newChef.id)]);
    await firestoreWrite('chefs', newChef.id, newChef, true);

    if (existingUser) {
      const updatedAddresses =
        existingUser.addresses.length > 0
          ? existingUser.addresses.map(addr => ({ ...addr, isVerified: true }))
          : [{ id: `addr-${app.id}`, street: safeAppLocation, city: resolvedAppCity, zip: resolvedAppZip, isVerified: true }];

      const updatedUser: AppUser = {
        ...existingUser,
        role: existingUser.role === 'admin' ? 'admin' : 'chef',
        phone: app.phone || existingUser.phone,
        brandName: app.brandName || existingUser.brandName,
        ...(app.avatarUrl ? { avatarUrl: app.avatarUrl } : existingUser.avatarUrl ? { avatarUrl: existingUser.avatarUrl } : {}),
        addresses: updatedAddresses
      };
      await firestoreWrite('users', updatedUser.id, updatedUser, true);
      setRegisteredUsers(prev => prev.map(u => (u.id === updatedUser.id ? updatedUser : u)));
      if (currentUser && currentUser.id === updatedUser.id) {
        setCurrentUser(updatedUser);
      }
    } else {
      const nameParts = app.fullName.split(' ');
      const newUser: AppUser = {
        id: `usr-${app.id.toLowerCase()}`,
        name: nameParts[0] || 'Chef',
        lastName: nameParts.slice(1).join(' ') || 'MESA',
        email: normalizedEmail,
        phone: app.phone,
        brandName: app.brandName,
        ...(app.avatarUrl ? { avatarUrl: app.avatarUrl } : {}),
        role: 'chef',
        createdAt: new Date().toLocaleDateString('it-IT'),
        addresses: [
          { id: `addr-${app.id}`, street: safeAppLocation, city: resolvedAppCity, zip: resolvedAppZip, isVerified: true }
        ],
        password: resolvedPassword
      };
      await firestoreWrite('users', newUser.id, newUser, true);
      setRegisteredUsers(prev => [newUser, ...prev.filter(u => u.id !== newUser.id)]);
    }

    showNotification(`Profilo di ${app.brandName} attivato e pubblicato nel catalogo MESA!`);
  };

  const handleRejectApplication = async (appId: string, notes?: string) => {
    const adminNotes = notes?.trim() || 'Documenti o dati da completare';
    const reviewedAt = new Date().toLocaleString('it-IT');
    setChefApplications(prev =>
      prev.map(a => (a.id === appId ? { ...a, status: 'rejected', adminNotes, reviewedAt } : a))
    );
    await firestoreWrite('chefApplications', appId, { status: 'rejected', adminNotes, reviewedAt }, true);
    showNotification(`Candidatura #${appId} aggiornata come respinta / da completare.`);
  };

  const handleDeleteApplication = async (appId: string) => {
    await firestoreDelete('chefApplications', appId);
    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, 'settings', 'catalog'), { deletedAppIds: arrayUnion(appId) }, { merge: true });
      } catch (err) {
        console.error('Failed to record deleted application id', err);
      }
    }
    setChefApplications(prev => prev.filter(a => a.id !== appId));
    showNotification(`Candidatura #${appId} eliminata.`);
  };

  const handleRegisterUser = async (newUser: AppUser, skipChefCreation = false) => {
    const normalizedUser: AppUser = {
      ...newUser,
      email: newUser.email.trim().toLowerCase()
    };

    setRegisteredUsers(prev =>
      prev.some(u => u.id === normalizedUser.id)
        ? prev.map(u => (u.id === normalizedUser.id ? normalizedUser : u))
        : [normalizedUser, ...prev]
    );
    await firestoreWrite('users', normalizedUser.id, normalizedUser, true);

    if (normalizedUser.role === 'chef' && !skipChefCreation) {
      const alreadyHasChefProfile = chefs.some(c =>
        (c.email && c.email.trim().toLowerCase() === normalizedUser.email) ||
        c.id === `chef-${normalizedUser.id}` ||
        `usr-${c.id}` === normalizedUser.id ||
        `usr-${c.id.replace('chef-', '')}` === normalizedUser.id
      );
      const alreadyHasApplication = chefApplications.some(
        a =>
          a.userId === normalizedUser.id ||
          a.email.trim().toLowerCase() === normalizedUser.email
      );

      if (!alreadyHasChefProfile && !alreadyHasApplication) {
        const addr = normalizedUser.addresses[0];
        const rawLocationLabel = addr
          ? `${addr.street}, ${addr.city}${addr.zip ? ` (${addr.zip})` : ''}`
          : 'Pordenone (PN), Centro';
        const locationLabel = normalizeLocationToPordenone(rawLocationLabel);
        const fullName = `${normalizedUser.name} ${normalizedUser.lastName}`.trim();
        const pendingApp: ChefApplication = {
          id: `APP-REG-${normalizedUser.id.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 8)}`,
          userId: normalizedUser.id,
          fullName,
          brandName: normalizedUser.brandName || fullName,
          email: normalizedUser.email,
          phone: normalizedUser.phone || '+39 ',
          nationality: '🇮🇹',
          countryName: 'Italia',
          continent: 'Europa',
          location: locationLabel,
          bio: 'Nuovo cuoco registrato dalla schermata di accesso MESA, in attesa di verifica e attivazione.',
          specialties: ['Cucina Casalinga'],
          avatarUrl: normalizedUser.avatarUrl || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80',
          kitchenPhotos: ['https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80'],
          documents: [],
          proposedDishName: 'Specialità della Casa',
          proposedDishDesc: 'Piatto preparato fresco su ordinazione (da completare in Area Cuoco o Admin).',
          proposedDishPrice: 14.0,
          availableDays: [1, 2, 3, 4, 5, 6],
          availabilitySlots: ['12:00 - 15:00', '19:00 - 22:00'],
          status: 'pending',
          submittedAt: new Date().toLocaleString('it-IT')
        };

        setChefApplications(prev => [pendingApp, ...prev.filter(a => a.id !== pendingApp.id)]);
        await firestoreWrite('chefApplications', pendingApp.id, pendingApp, true);
      }
    }
  };

  const handleUpdateUser = async (updatedUser: AppUser) => {
    const normalizedUser: AppUser = {
      ...updatedUser,
      email: updatedUser.email.trim().toLowerCase()
    };
    await firestoreWrite('users', normalizedUser.id, normalizedUser, true);
    setRegisteredUsers(prev => prev.map(u => u.id === normalizedUser.id ? normalizedUser : u));
    if (currentUser && currentUser.id === normalizedUser.id) {
      setCurrentUser(normalizedUser);
    }

    if (normalizedUser.role === 'chef') {
      const nextChefs = chefs.map(c => {
        const isMatch = c.id === `chef-${normalizedUser.id}` || 
                        c.id === normalizedUser.id ||
                        c.email.trim().toLowerCase() === normalizedUser.email ||
                        c.name.trim().toLowerCase() === `${normalizedUser.name} ${normalizedUser.lastName}`.trim().toLowerCase() ||
                        c.name.trim().toLowerCase() === normalizedUser.name.trim().toLowerCase();
        if (isMatch) {
          const updatedChef = {
            ...c,
            name: normalizedUser.brandName || `${normalizedUser.name} ${normalizedUser.lastName}`.trim(),
            email: normalizedUser.email,
            phone: normalizedUser.phone || c.phone,
            password: normalizedUser.password || c.password,
            location: normalizedUser.addresses[0]?.street || c.location,
            ...(normalizedUser.avatarUrl ? { avatar: normalizedUser.avatarUrl } : {})
          };
          firestoreWrite('chefs', updatedChef.id, updatedChef, true);
          return updatedChef;
        }
        return c;
      });
      setChefs(nextChefs);
    }

    if (normalizedUser.avatarUrl) {
      setChefApplications(prev =>
        prev.map(a => {
          if (a.userId === normalizedUser.id || a.email.trim().toLowerCase() === normalizedUser.email) {
            firestoreWrite('chefApplications', a.id, { avatarUrl: normalizedUser.avatarUrl }, true);
            return { ...a, avatarUrl: normalizedUser.avatarUrl };
          }
          return a;
        })
      );
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
    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, 'settings', 'catalog'), { deletedUserIds: arrayUnion(userId) }, { merge: true });
      } catch (err) {
        console.error('Failed to record deleted user id', err);
      }
    }
    setRegisteredUsers(prev => prev.filter(u => u.id !== userId));
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(null);
      setSelectedOrder(null);
      setBookingDish(null);
      setPendingBookingDish(null);
      setPendingBookingPayload(null);
      setPendingPostAuthView(null);
      setPendingCheckoutTotal(null);
      setCurrentView(ViewState.LANDING);
    }
    showNotification("Account rimosso definitivamente.");
  };

  const handleDeleteOwnProfile = async (): Promise<ProfileDeleteResult> => {
    if (!currentUser) {
      return { ok: false, error: 'Nessun profilo autenticato da eliminare.' };
    }
    if (currentUser.role === 'admin') {
      return { ok: false, error: 'Gli account Staff/Admin non possono essere eliminati da questa schermata.' };
    }

    const blockingOrders = getBlockingOrdersForUser(currentUser, orders, chefs);
    if (blockingOrders.length > 0) {
      return {
        ok: false,
        blockingCount: blockingOrders.length,
        error:
          blockingOrders.length === 1
            ? 'Hai 1 ordine ancora in corso. Completalo o annullalo prima di eliminare il profilo.'
            : `Hai ${blockingOrders.length} ordini ancora in corso. Completa o annulla prima gli ordini aperti.`,
      };
    }

    const targetUser = currentUser;
    const normalizedEmail = (targetUser.email || '').trim().toLowerCase();
    const matchingUserIds = Array.from(
      new Set([
        targetUser.id,
        ...registeredUsers
          .filter((u) => u.email.trim().toLowerCase() === normalizedEmail)
          .map((u) => u.id),
      ])
    );
    const matchingApps = chefApplications.filter(
      (a) =>
        a.userId === targetUser.id ||
        (Boolean(normalizedEmail) && a.email.trim().toLowerCase() === normalizedEmail)
    );
    const matchingChefs =
      targetUser.role === 'chef' ? chefs.filter((c) => matchesChefUser(c, targetUser)) : [];

    // Stop auto-migration effects and clear session before Firestore/Auth teardown
    currentUserRef.current = null;
    setCurrentUser(null);
    localStorage.removeItem('mesa_current_user');
    localStorage.removeItem('mesa_verified_address');
    localStorage.removeItem('mesa_guest_order_ids');

    try {
      for (const app of matchingApps) {
        await firestoreDelete('chefApplications', app.id);
      }

      for (const chef of matchingChefs) {
        await firestoreDelete('chefs', chef.id);
        if (isFirebaseConfigured && db) {
          try {
            await setDoc(doc(db, 'settings', 'catalog'), { deletedChefIds: arrayUnion(chef.id) }, { merge: true });
          } catch (err) {
            console.error('Failed to record self-deleted chef id', err);
          }
        }
      }

      for (const uid of matchingUserIds) {
        await firestoreDelete('users', uid);
        if (isFirebaseConfigured && db) {
          try {
            await setDoc(doc(db, 'settings', 'catalog'), { deletedUserIds: arrayUnion(uid) }, { merge: true });
          } catch (err) {
            console.error('Failed to record self-deleted user id', err);
          }
        }
      }
    } catch (err) {
      currentUserRef.current = targetUser;
      setCurrentUser(targetUser);
      const raw = err instanceof Error ? err.message : String(err);
      return { ok: false, error: `Impossibile completare la rimozione dei dati: ${raw}` };
    }

    if (auth?.currentUser) {
      try {
        await deleteUser(auth.currentUser);
      } catch {
        // Fallback to sign-out cleanly if Firebase Auth requires recent re-authentication
      }
    }
    if (auth) {
      await signOut(auth).catch(() => {});
    }

    const deletedAppIdSet = new Set(matchingApps.map((a) => a.id));
    const deletedChefIdSet = new Set(matchingChefs.map((c) => c.id));
    const deletedUserIdSet = new Set(matchingUserIds);

    setRegisteredUsers((prev) => prev.filter((u) => !deletedUserIdSet.has(u.id)));
    if (deletedAppIdSet.size > 0) {
      setChefApplications((prev) => prev.filter((a) => !deletedAppIdSet.has(a.id)));
    }
    if (deletedChefIdSet.size > 0) {
      setChefs((prev) => prev.filter((c) => !deletedChefIdSet.has(c.id)));
    }

    setVerifiedAddress('Pordenone (PN), Centro');
    setGuestOrderIds([]);
    setCart([]);
    setFavorites([]);
    setSelectedChef(null);
    setSelectedOrder(null);
    setReviewOrder(null);
    setBookingDish(null);
    setUnreadOrderAlertIds([]);
    setRecentlyPlacedOrderId(null);
    setPendingBookingDish(null);
    setPendingBookingPayload(null);
    setPendingPostAuthView(null);
    setPendingCheckoutTotal(null);
    navigateTo(ViewState.LANDING);
    showNotification('Profilo eliminato definitivamente. I tuoi dati sono stati rimossi da MESA.', {
      title: 'Profilo Eliminato',
      variant: 'info',
    });

    return { ok: true };
  };
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<OrderReview[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);

  const [bookingDish, setBookingDish] = useState<Dish | null>(null);
  const [pendingBookingDish, setPendingBookingDish] = useState<Dish | null>(null);
  const [pendingBookingPayload, setPendingBookingPayload] = useState<{
    dish: Dish;
    date: string;
    time: string;
    deliveryMode: 'delivery' | 'pickup';
    preferences: any;
  } | null>(null);
  const [pendingPostAuthView, setPendingPostAuthView] = useState<ViewState | null>(null);
  const [pendingCheckoutTotal, setPendingCheckoutTotal] = useState<number | null>(null);
  const [authInitialRole, setAuthInitialRole] = useState<'client' | 'chef' | 'admin'>('client');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);
  const [deferredPwaPrompt, setDeferredPwaPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isPwaStandalone, setIsPwaStandalone] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [showTour, setShowTour] = useState(false);

  // Capture PWA beforeinstallprompt and standalone state cleanly across the session
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const standaloneCheck =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as { standalone?: boolean }).standalone === true;
    setIsPwaStandalone(standaloneCheck);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPwaPrompt(e as BeforeInstallPromptEvent);
    };
    const handleAppInstalled = () => {
      setDeferredPwaPrompt(null);
      setIsPwaStandalone(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const [toastMessage, setToastMessage] = useState('');
  const [toastTitle, setToastTitle] = useState<string | undefined>(undefined);
  const [toastVariant, setToastVariant] = useState<ToastVariant>('success');
  const [toastAction, setToastAction] = useState<{ label: string; onAction: () => void } | null>(null);
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
    try {
      localStorage.removeItem('mesa_landing_seen');
    } catch {}

    const params = new URLSearchParams(window.location.search);
    const chefId = params.get('chef');
    if (chefId) {
      const chef = chefs.find(c => c.id === chefId);
      if (chef) {
        setSelectedChef(chef);
        setCurrentView(ViewState.PUBLIC_STOREFRONT);
      }
    }
  }, []);

  const landingAuthOriginRef = useRef(false);

  const getAuthenticatedUserForRole = (targetRole: 'client' | 'chef'): AppUser | null => {
    const fbEmail = auth?.currentUser?.email?.trim().toLowerCase();
    if (currentUser && currentUser.role === targetRole) {
      if (!fbEmail || currentUser.email.trim().toLowerCase() === fbEmail) {
        return currentUser;
      }
    }
    if (fbEmail) {
      const matchedUser = registeredUsers.find(
        u => u.role === targetRole && u.email.trim().toLowerCase() === fbEmail
      );
      if (matchedUser) return matchedUser;
      if (targetRole === 'chef') {
        const matchedChef = chefs.find(c => (c.email || '').trim().toLowerCase() === fbEmail);
        if (matchedChef) {
          const nameParts = matchedChef.name.trim().split(' ');
          return {
            id: matchedChef.id.startsWith('chef-') ? matchedChef.id.replace('chef-', '') : `usr-${matchedChef.id}`,
            name: nameParts[0] || matchedChef.name,
            lastName: nameParts.slice(1).join(' ') || 'Chef',
            email: fbEmail,
            phone: matchedChef.phone,
            brandName: matchedChef.name,
            role: 'chef',
            addresses: [],
            createdAt: new Date().toLocaleDateString('it-IT'),
          };
        }
      }
    }
    return null;
  };

  const handleLandingRoleEnter = (targetRole: 'client' | 'chef') => {
    if (targetRole === 'client') {
      landingAuthOriginRef.current = false;
      setPendingPostAuthView(null);
      setCurrentView(ViewState.HOME);
      setIsCartOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const authenticatedUser = getAuthenticatedUserForRole('chef');
    if (authenticatedUser) {
      if (!currentUser || currentUser.id !== authenticatedUser.id) {
        setCurrentUser(authenticatedUser);
      }
      navigateTo(ViewState.PROFILE);
      return;
    }
    landingAuthOriginRef.current = true;
    setPendingPostAuthView(ViewState.PROFILE);
    setAuthInitialRole('chef');
    setIsAuthOpen(true);
  };

  const promptClientAuth = (message: string) => {
    landingAuthOriginRef.current = false;
    setAuthInitialRole('client');
    setIsCartOpen(false);
    showNotification(message);
    setIsAuthOpen(true);
  };

  const handleAuthModalClose = () => {
    setIsAuthOpen(false);
    landingAuthOriginRef.current = false;
    setPendingBookingDish(null);
    setPendingBookingPayload(null);
    setPendingPostAuthView(null);
    setPendingCheckoutTotal(null);
  };

  const navigateTo = (view: ViewState) => {
    if (view === ViewState.PROFILE && !currentUser) {
      setPendingPostAuthView(ViewState.PROFILE);
      promptClientAuth("Sblocca la tua area! Accedi o registrati come Cliente o Cuoco.");
      return;
    }

    if (view === ViewState.ORDERS && !currentUser) {
      setPendingPostAuthView(ViewState.ORDERS);
      promptClientAuth("Accedi o registrati come Cliente per visualizzare o gestire gli ordini.");
      return;
    }

    if (view === ViewState.FAVORITES && !currentUser) {
      setPendingPostAuthView(ViewState.FAVORITES);
      promptClientAuth("Accedi o registrati come Cliente per visualizzare i tuoi Preferiti.");
      return;
    }

    if (view === ViewState.ADMIN_DASHBOARD && currentUser?.role !== 'admin') {
      setAuthInitialRole('admin');
      showNotification("Accesso riservato. Inserisci la password amministratore per accedere.");
      setIsAuthOpen(true);
      return;
    }

    if (view === ViewState.ORDERS) {
      setUnreadOrderAlertIds([]);
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
      setAuthInitialRole('admin');
      showNotification("Area riservata. Inserisci la password per accedere all'area amministratore.");
      setIsAuthOpen(true);
    }
  };

  const showNotification = (
    message: string,
    options?: {
      title?: string;
      variant?: ToastVariant;
      actionLabel?: string;
      onAction?: () => void;
    }
  ) => {
    setToastMessage(message);
    setToastTitle(options?.title);
    setToastVariant(options?.variant || 'success');
    setToastAction(
      options?.actionLabel && options?.onAction
        ? { label: options.actionLabel, onAction: options.onAction }
        : null
    );
    setIsToastVisible(true);
  };

  // Notify logged-in chef immediately if pending orders are already waiting in Firestore
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'chef') {
      announcedChefSessionRef.current = null;
      return;
    }
    const pendingForChef = orders.filter(
      o => isPendingOrderStatus(o.status) && isOrderForChefUser(o, currentUser, chefs)
    );
    if (pendingForChef.length > 0 && announcedChefSessionRef.current !== currentUser.id) {
      announcedChefSessionRef.current = currentUser.id;
      const latestPending = pendingForChef[0];
      setUnreadOrderAlertIds(prev => Array.from(new Set([...prev, ...pendingForChef.map(o => o.id)])));
      if (chefSoundEnabledRef.current) {
        void playNewOrderChime().then((played) => {
          setAudioAutoplayBlocked(!played);
        });
      }
      showNotification(
        pendingForChef.length === 1
          ? `Ordine #${latestPending.id.split('-')[0]} in attesa di conferma.`
          : `Hai ${pendingForChef.length} nuovi ordini in attesa di conferma!`,
        {
          title: 'Nuovo ordine ricevuto!',
          variant: 'chef',
          actionLabel: 'Apri Ordini',
          onAction: () => {
            setSelectedOrder(latestPending);
            setCurrentView(ViewState.ORDERS);
          },
        }
      );
    }
  }, [currentUser?.id, currentUser?.role, orders, chefs]);

  const handleToggleChefSoundAlerts = () => {
    setChefSoundEnabled(prev => {
      const next = !prev;
      if (next) {
        void unlockAudioContext().then(async (unlocked) => {
          setAudioAutoplayBlocked(!unlocked);
          if (unlocked) {
            await playNewOrderChime();
          }
        });
      } else {
        setAudioAutoplayBlocked(false);
      }
      return next;
    });
  };

  const handleUnlockChefAudio = async (): Promise<boolean> => {
    const unlocked = await unlockAudioContext();
    setAudioAutoplayBlocked(!unlocked);
    if (unlocked) {
      await playNewOrderChime();
      showNotification('Avvisi sonori attivi per i nuovi ordini!', {
        title: 'Audio Attivato',
        variant: 'success',
      });
    }
    return unlocked;
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

  const handleInitiateBooking = (dish: Dish) => {
    setBookingDish(dish);
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const targetOrder = orders.find(o => o.id === orderId);
    const statusLabel = ORDER_STATUS_LABELS[status] || status;
    const timelineNoteMap: Partial<Record<OrderStatus, string>> = {
      CONFIRMED: 'Prenotazione confermata dallo chef.',
      REJECTED: 'Prenotazione rifiutata dallo chef.',
      CANCELLED: 'Ordine annullato dal cliente prima della conferma.',
      PREPARING: 'Lo chef ha iniziato la preparazione.',
      READY: 'Ordine pronto per ritiro o consegna.',
      DELIVERING: 'Ordine affidato al rider per la consegna.',
      COMPLETED: 'Ordine consegnato e completato.',
    };
    const nextEntry: OrderTimelineEntry = {
      id: `tl-${Date.now()}-${status}`,
      status,
      title: statusLabel,
      description: timelineNoteMap[status] || `Stato aggiornato a ${statusLabel}.`,
      timestamp: new Date(),
    };
    const nextTimeline = [...(targetOrder?.timeline || []), nextEntry];

    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status, timeline: nextTimeline } : o))
    );
    setUnreadOrderAlertIds(prev => prev.filter(id => id !== orderId));
    prevOrderStatusesRef.current[orderId] = status;
    await firestoreWrite('orders', orderId, { status, timeline: nextTimeline }, true);
    showNotification(`Ordine ${formatOrderCode(orderId)} aggiornato: ${statusLabel}`, {
      title: 'Stato Aggiornato',
      variant: status === 'REJECTED' || status === 'CANCELLED' ? 'warning' : 'success',
    });
  };

  const handleSendOrderMessage = async (orderId: string, message: Message) => {
    const targetOrder = orders.find(o => o.id === orderId);
    const nextMessages = [...(targetOrder?.messages || []), message];
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, messages: nextMessages } : o))
    );
    setSelectedOrder(prev =>
      prev && prev.id === orderId ? { ...prev, messages: nextMessages } : prev
    );
    await firestoreWrite('orders', orderId, { messages: nextMessages }, true);
  };

  const handleCancelOrderByClient = async (orderId: string) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!canClientCancelOrder(targetOrder)) {
      showNotification('Questo ordine è già stato preso in carico e non può più essere annullato.', {
        title: 'Annullamento non disponibile',
        variant: 'warning',
      });
      return;
    }
    await handleUpdateOrderStatus(orderId, 'CANCELLED');
  };

  const handleDeleteOrder = async (orderId: string): Promise<OrderDeleteResult> => {
    if (!orderId) return { ok: false, error: 'ID ordine non valido.' };
    try {
      if (isFirebaseConfigured && db) {
        await deleteDoc(doc(db, 'orders', orderId));
      }
      setOrders(prev => prev.filter(o => o.id !== orderId));
      setUnreadOrderAlertIds(prev => prev.filter(id => id !== orderId));
      setGuestOrderIds(prev => {
        const next = prev.filter(id => id !== orderId);
        try {
          localStorage.setItem('mesa_guest_order_ids', JSON.stringify(next));
        } catch {}
        return next;
      });
      setSelectedOrder(prev => (prev?.id === orderId ? null : prev));
      setRecentlyPlacedOrderId(prev => (prev === orderId ? null : prev));
      delete prevOrderStatusesRef.current[orderId];
      knownOrderIdsRef.current.delete(orderId);

      showNotification(`Ordine #${orderId.split('-')[0]} eliminato definitivamente.`, {
        title: 'Ordine Eliminato',
        variant: 'success',
      });
      return { ok: true, deletedCount: 1 };
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `orders/${orderId}`, false);
      const friendlyError = formatOrderDeleteError(err);
      showNotification(friendlyError, {
        title: 'Errore Eliminazione',
        variant: 'error',
      });
      return { ok: false, deletedCount: 0, error: friendlyError };
    }
  };

  const handleDeleteConcludedOrders = async (orderIds: string[]): Promise<OrderDeleteResult> => {
    const uniqueIds = Array.from(new Set(orderIds.filter(Boolean)));
    if (uniqueIds.length === 0) {
      return { ok: true, deletedCount: 0 };
    }

    try {
      if (isFirebaseConfigured && db) {
        for (let i = 0; i < uniqueIds.length; i += 450) {
          const chunk = uniqueIds.slice(i, i + 450);
          const batch = writeBatch(db);
          chunk.forEach(id => {
            batch.delete(doc(db, 'orders', id));
          });
          await batch.commit();
        }
      }

      const deletedSet = new Set(uniqueIds);
      setOrders(prev => prev.filter(o => !deletedSet.has(o.id)));
      setUnreadOrderAlertIds(prev => prev.filter(id => !deletedSet.has(id)));
      setGuestOrderIds(prev => {
        const next = prev.filter(id => !deletedSet.has(id));
        try {
          localStorage.setItem('mesa_guest_order_ids', JSON.stringify(next));
        } catch {}
        return next;
      });
      setSelectedOrder(prev => (prev && deletedSet.has(prev.id) ? null : prev));
      setRecentlyPlacedOrderId(prev => (prev && deletedSet.has(prev) ? null : prev));
      uniqueIds.forEach(id => {
        delete prevOrderStatusesRef.current[id];
        knownOrderIdsRef.current.delete(id);
      });

      showNotification(
        `${uniqueIds.length} ${uniqueIds.length === 1 ? 'ordine concluso eliminato' : 'ordini conclusi eliminati'} definitivamente.`,
        {
          title: 'Storico Pulito',
          variant: 'success',
        }
      );
      return { ok: true, deletedCount: uniqueIds.length };
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'orders (batch)', false);
      const friendlyError = formatOrderDeleteError(err);
      showNotification(friendlyError, {
        title: 'Errore Pulizia Ordini',
        variant: 'error',
      });
      return { ok: false, deletedCount: 0, error: friendlyError };
    }
  };

  const notifyBetaOrderBlocked = (validation: BetaOrderValidationResult) => {
    showNotification(
      validation.message || 'Gli ordini per questo profilo saranno attivi a breve.',
      {
        title: validation.title || 'Ordini attivi a breve',
        variant: validation.reason === 'AVAILABLE_SOON_IN_CART' ? 'warning' : 'info',
      }
    );
  };

  const createAndSaveOrder = async (
    authenticatedUser: AppUser,
    dishToBook: Dish,
    date: string,
    time: string,
    deliveryMode: 'delivery' | 'pickup',
    preferences: any
  ) => {
    const deliveryFee = deliveryMode === 'delivery' ? 2.50 : 0;
    const bookedItem: CartItem = {
      ...dishToBook,
      quantity: 1,
      scheduledDate: date,
      scheduledTime: time,
      deliveryMode,
      preferences
    };
    const validation = validateBetaOrderSubmission([bookedItem], chefs, 'direct');
    if (!validation.ok) {
      notifyBetaOrderBlocked(validation);
      setBookingDish(null);
      return;
    }
    const chefName = chefs.find(c => c.id === dishToBook.chefId)?.name || 'Chef MESA';
    const customerName = `${authenticatedUser.name} ${authenticatedUser.lastName}`.trim() || authenticatedUser.email;
    const now = new Date();
    const orderId = `MESA-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const newOrder: Order = {
      id: orderId,
      userId: authenticatedUser.id,
      customerName,
      ...(authenticatedUser.email ? { customerEmail: authenticatedUser.email } : {}),
      items: [bookedItem],
      total: dishToBook.price + deliveryFee,
      status: 'PENDING_CONFIRMATION',
      timestamp: now,
      chefId: dishToBook.chefId,
      chefName,
      deliveryMode,
      estimatedTime: `${date} ore ${time}`,
      notificationChannel: 'app',
      timeline: [
        {
          id: `tl-init-${orderId}`,
          status: 'PENDING_CONFIRMATION',
          title: 'Ordine inviato',
          description: 'Ordine inviato! In attesa di conferma dallo chef.',
          timestamp: now,
        },
      ],
    };

    prevOrderStatusesRef.current[newOrder.id] = newOrder.status;
    knownOrderIdsRef.current.add(newOrder.id);
    setOrders(prev => [newOrder, ...prev.filter(o => o.id !== newOrder.id)]);
    await firestoreWrite('orders', newOrder.id, newOrder);

    setBookingDish(null);
    setRecentlyPlacedOrderId(newOrder.id);
    setSelectedOrder(newOrder);
    setSelectedChef(null);
    setCurrentView(ViewState.ORDERS);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showNotification('Ordine inviato! In attesa di conferma dallo chef', {
      title: 'Ordine Confermato',
      variant: 'success',
    });
  };

  const handleAddToCart = (date: string, time: string, deliveryMode: 'delivery' | 'pickup', preferences: any) => {
    if (!bookingDish) return;
    const dishChef = chefs.find(c => c.id === bookingDish.chefId);
    const isAvailableSoon =
      Boolean(bookingDish.isAvailableSoon) ||
      Boolean(bookingDish.tags?.some(t => t.trim().toLowerCase() === 'disponibile a breve')) ||
      !isChefBookable(dishChef);

    const newItem: CartItem = {
      ...bookingDish,
      quantity: 1,
      scheduledDate: date,
      scheduledTime: time,
      deliveryMode,
      preferences,
      ...(isAvailableSoon ? { isAvailableSoon: true } : {}),
    };

    setCart(prev => [...prev, newItem]);
    setBookingDish(null);
    setIsCartBarDismissed(false);
    setIsCartOpen(true);
    showNotification(
      isAvailableSoon
        ? `"${bookingDish.name}" aggiunto al carrello (contrassegnato "Disponibile a breve").`
        : `"${bookingDish.name}" aggiunto al carrello!`,
      {
        title: 'Carrello Aggiornato',
        variant: isAvailableSoon ? 'info' : 'success',
      }
    );
  };

  const handleConfirmBooking = async (date: string, time: string, deliveryMode: 'delivery' | 'pickup', preferences: any) => {
    if (!bookingDish) return;
    const validation = validateBetaOrderSubmission([bookingDish], chefs, 'direct');
    if (!validation.ok) {
      notifyBetaOrderBlocked(validation);
      setBookingDish(null);
      return;
    }
    if (!currentUser) {
      setPendingBookingPayload({ dish: bookingDish, date, time, deliveryMode, preferences });
      promptClientAuth("Accedi o registrati come Cliente per completare la prenotazione.");
      return;
    }
    await createAndSaveOrder(currentUser, bookingDish, date, time, deliveryMode, preferences);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item).filter(i => i.quantity > 0));
  };

  const submitCartOrder = async (authenticatedUser: AppUser, totalAmount: number) => {
    const validation = validateBetaOrderSubmission(cart, chefs, 'cart');
    if (!validation.ok) {
      notifyBetaOrderBlocked(validation);
      setIsCartOpen(true);
      return;
    }
    const firstChefId = cart[0]?.chefId || 'c1';
    const chefName = chefs.find(c => c.id === firstChefId)?.name || 'Chef MESA';
    const customerName = `${authenticatedUser.name} ${authenticatedUser.lastName}`.trim() || authenticatedUser.email;
    const now = new Date();
    const orderId = `MESA-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const newOrder: Order = {
      id: orderId,
      userId: authenticatedUser.id,
      customerName,
      ...(authenticatedUser.email ? { customerEmail: authenticatedUser.email } : {}),
      items: [...cart],
      total: totalAmount,
      status: 'PENDING_CONFIRMATION',
      timestamp: now,
      chefId: firstChefId,
      chefName: chefName,
      deliveryMode: cart[0]?.deliveryMode || 'pickup',
      estimatedTime: 'In arrivo...',
      notificationChannel: 'app',
      timeline: [
        {
          id: `tl-init-${orderId}`,
          status: 'PENDING_CONFIRMATION',
          title: 'Ordine inviato',
          description: 'Ordine inviato! Pagamento diretto al ritiro o alla consegna.',
          timestamp: now,
        },
      ],
    };
    prevOrderStatusesRef.current[newOrder.id] = newOrder.status;
    knownOrderIdsRef.current.add(newOrder.id);
    setOrders(prev => [newOrder, ...prev.filter(o => o.id !== newOrder.id)]);
    await firestoreWrite('orders', newOrder.id, newOrder);
    setCart([]);
    setIsCartOpen(false);
    setRecentlyPlacedOrderId(newOrder.id);
    setSelectedOrder(newOrder);
    setCurrentView(ViewState.ORDERS);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showNotification('Ordine inviato! In attesa di conferma dallo chef', {
      title: 'Ordine Confermato',
      variant: 'success',
    });
  };

  const handleCheckout = async (total: number) => {
    const validation = validateBetaOrderSubmission(cart, chefs, 'cart');
    if (!validation.ok) {
      notifyBetaOrderBlocked(validation);
      return;
    }

    if (!currentUser) {
      setPendingCheckoutTotal(total);
      promptClientAuth("Accedi o registrati come Cliente per confermare l'ordine.");
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

    await submitCartOrder(currentUser, total);
  };

  const handleAuthSuccess = async (user: AppUser, isNewRegistration?: boolean) => {
    setCurrentUser(user);

    if (isNewRegistration) {
      showNotification(
        user.role === 'chef'
          ? `Benvenuto ${formatChefDisplayName(user.name)}! Registrazione inviata all'Area Admin per la verifica.`
          : `Benvenuto ${user.name}! Account registrato e sincronizzato.`
      );
    }

    if (pendingBookingPayload) {
      const payload = pendingBookingPayload;
      setPendingBookingPayload(null);
      await createAndSaveOrder(
        user,
        payload.dish,
        payload.date,
        payload.time,
        payload.deliveryMode,
        payload.preferences
      );
      return;
    }

    if (pendingBookingDish) {
      const dishToBook = pendingBookingDish;
      setPendingBookingDish(null);
      setBookingDish(dishToBook);
      return;
    }

    if (pendingCheckoutTotal !== null) {
      const amt = pendingCheckoutTotal;
      setPendingCheckoutTotal(null);
      const deliveryMode = cart[0]?.deliveryMode || 'pickup';
      if (deliveryMode === 'delivery' && !user.addresses.some(addr => addr.isVerified)) {
        showNotification("Sicurezza MESA: Richiesto un indirizzo verificato dall'Admin per la consegna!");
        setCurrentView(ViewState.PROFILE);
        setIsCartOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      await submitCartOrder(user, amt);
      return;
    }

    if (pendingPostAuthView) {
      const targetView =
        user.role === 'admin'
          ? ViewState.ADMIN_DASHBOARD
          : user.role === 'chef' && pendingPostAuthView === ViewState.HOME
            ? ViewState.PROFILE
            : user.role === 'client' && pendingPostAuthView === ViewState.PROFILE && landingAuthOriginRef.current
              ? ViewState.HOME
              : pendingPostAuthView;
      landingAuthOriginRef.current = false;
      setPendingPostAuthView(null);
      setSelectedOrder(null);
      setCurrentView(targetView);
      setIsCartOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    landingAuthOriginRef.current = false;

    if (user.role === 'admin') {
      navigateTo(ViewState.ADMIN_DASHBOARD);
    } else if (user.role === 'client' && cart.length > 0) {
      setCurrentView(ViewState.HOME);
      setIsCartOpen(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigateTo(ViewState.PROFILE);
    }
  };

  const syncChefRatingInCatalog = async (chefId: string, nextReviews: OrderReview[]) => {
    const targetChef = chefs.find(c => c.id === chefId);
    if (!targetChef) return;
    const summary = getChefRatingSummary(targetChef, nextReviews);
    const updatedChef = { ...targetChef, rating: summary.average };
    setChefs(prev => prev.map(c => (c.id === chefId ? updatedChef : c)));
    await firestoreWrite('chefs', chefId, { rating: summary.average }, true);
  };

  const handleReviewSubmit = async (payload: ReviewSubmissionPayload) => {
    if (!reviewOrder || !currentUser || currentUser.role !== 'client') return;
    if (!isOrderEligibleForReview(reviewOrder, reviews)) {
      showNotification('Questo ordine non è idoneo o è già stato recensito.', {
        title: 'Recensione non consentita',
        variant: 'warning',
      });
      setReviewOrder(null);
      return;
    }

    const ratingDishes = clampRating(payload.ratingDishes);
    const ratingService = clampRating(payload.ratingService);
    const ratingPackaging = clampRating(payload.ratingPackaging);
    const ratingOverall = computeOverallRating(ratingDishes, ratingService, ratingPackaging);
    const cleanComment = (payload.comment || '').trim().slice(0, MAX_REVIEW_COMMENT_LENGTH);
    const customerName = `${currentUser.name} ${currentUser.lastName}`.trim() || currentUser.email;
    const dishIds = Array.from(new Set(reviewOrder.items.map(i => i.id).filter(Boolean)));

    const newReview: OrderReview = {
      id: reviewOrder.id,
      orderId: reviewOrder.id,
      customerId: currentUser.id,
      customerName,
      chefId: reviewOrder.chefId,
      dishIds,
      ratingDishes,
      ratingService,
      ratingPackaging,
      ratingOverall,
      comment: cleanComment,
      createdAt: new Date().toISOString(),
      isHidden: false,
    };

    const nextReviews = [newReview, ...reviews.filter(r => r.orderId !== reviewOrder.id)];
    setReviews(nextReviews);
    setOrders(prev =>
      prev.map(o =>
        o.id === reviewOrder.id
          ? { ...o, hasReview: true, isReviewed: true, reviewRating: ratingOverall }
          : o
      )
    );
    if (selectedOrder?.id === reviewOrder.id) {
      setSelectedOrder(prev =>
        prev ? { ...prev, hasReview: true, isReviewed: true, reviewRating: ratingOverall } : prev
      );
    }

    await firestoreWrite('reviews', newReview.id, newReview);
    await firestoreWrite(
      'orders',
      reviewOrder.id,
      { hasReview: true, isReviewed: true, reviewRating: ratingOverall },
      true
    );
    await syncChefRatingInCatalog(reviewOrder.chefId, nextReviews);

    setReviewOrder(null);
    showNotification(`Grazie! Hai assegnato ★ ${ratingOverall.toFixed(1)} a ${formatChefDisplayName(reviewOrder.chefName)}.`, {
      title: 'Recensione Verificata Pubblicata',
      variant: 'success',
    });
  };

  const handleToggleReviewVisibility = async (reviewId: string, hide: boolean) => {
    const target = reviews.find(r => r.id === reviewId);
    if (!target) return;
    const nextReviews = reviews.map(r => (r.id === reviewId ? { ...r, isHidden: hide } : r));
    setReviews(nextReviews);
    await firestoreWrite('reviews', reviewId, { isHidden: hide }, true);
    await syncChefRatingInCatalog(target.chefId, nextReviews);
    showNotification(hide ? 'Recensione nascosta dalla vetrina pubblica.' : 'Recensione ripristinata in vetrina.', {
      title: 'Moderazione Recensioni',
      variant: hide ? 'warning' : 'success',
    });
  };

  const handleDeleteReview = async (reviewId: string) => {
    const target = reviews.find(r => r.id === reviewId);
    if (!target) return;
    const nextReviews = reviews.filter(r => r.id !== reviewId);
    setReviews(nextReviews);
    setOrders(prev =>
      prev.map(o =>
        o.id === target.orderId
          ? { ...o, hasReview: false, isReviewed: false, reviewRating: undefined }
          : o
      )
    );
    await firestoreDelete('reviews', reviewId);
    await firestoreWrite('orders', target.orderId, { hasReview: false, isReviewed: false }, true);
    await syncChefRatingInCatalog(target.chefId, nextReviews);
    showNotification('Recensione rimossa definitivamente.', {
      title: 'Recensione Rimossa',
      variant: 'info',
    });
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

  const visibleClientOrders = useMemo(() => {
    if (!currentUser) {
      return [];
    }
    if (currentUser.role === 'admin') {
      return orders;
    }
    if (currentUser.role === 'chef') {
      return orders.filter(o => o.userId === currentUser.id || isOrderForChefUser(o, currentUser, chefs));
    }
    return orders.filter(o => o.userId === currentUser.id || guestOrderIds.includes(o.id));
  }, [orders, currentUser, guestOrderIds, chefs]);

  const concludedVisibleOrders = useMemo(
    () => visibleClientOrders.filter(isConcludedOrder),
    [visibleClientOrders]
  );

  const handleConfirmOrdersViewDelete = async () => {
    if (!ordersViewDeleteConfirm) return;
    setIsDeletingOrdersView(true);
    setOrdersViewDeleteError(null);
    try {
      if (ordersViewDeleteConfirm.mode === 'single' && ordersViewDeleteConfirm.order) {
        const res = await handleDeleteOrder(ordersViewDeleteConfirm.order.id);
        if (!res.ok) {
          setOrdersViewDeleteError(res.error || 'Impossibile eliminare questo ordine.');
          return;
        }
      } else if (ordersViewDeleteConfirm.mode === 'bulk') {
        const res = await handleDeleteConcludedOrders(concludedVisibleOrders.map(o => o.id));
        if (!res.ok) {
          setOrdersViewDeleteError(res.error || 'Impossibile completare la pulizia degli ordini conclusi.');
          return;
        }
      }
      setOrdersViewDeleteConfirm(null);
    } finally {
      setIsDeletingOrdersView(false);
    }
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const activeOrdersCount = useMemo(() => {
    if (!currentUser) return 0;
    if (currentUser.role === 'chef') {
      const pendingOrUnreadIds = new Set<string>([
        ...visibleClientOrders.filter(o => isPendingOrderStatus(o.status)).map(o => o.id),
        ...unreadOrderAlertIds,
      ]);
      return pendingOrUnreadIds.size;
    }
    const activeIds = new Set<string>([
      ...visibleClientOrders.filter(o => o.status !== 'COMPLETED' && o.status !== 'REJECTED' && o.status !== 'CANCELLED').map(o => o.id),
      ...unreadOrderAlertIds,
    ]);
    return activeIds.size;
  }, [currentUser, visibleClientOrders, unreadOrderAlertIds]);

  const chefPendingBadgeCount = useMemo(() => {
    if (!currentUser || currentUser.role !== 'chef') return 0;
    return visibleClientOrders.filter(o => isPendingOrderStatus(o.status)).length;
  }, [currentUser, visibleClientOrders]);

  const hasUnreadOrderAlerts = unreadOrderAlertIds.length > 0;

  // View dedicata per Landing Page (Sito Web)
  if (currentView === ViewState.LANDING) {
    return (
      <>
        <LandingPage 
          onEnterApp={() => handleLandingRoleEnter('client')} 
          onNavigateToBecomeChef={() => handleLandingRoleEnter('chef')} 
          onShareClick={() => setIsShareOpen(true)}
          onAdminAccess={handleQuickAdminAccess}
          onPwaInstallClick={() => setIsPwaModalOpen(true)}
        />
        <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
        <PwaInstallModal
          isOpen={isPwaModalOpen}
          onClose={() => setIsPwaModalOpen(false)}
          deferredPrompt={deferredPwaPrompt}
          onClearDeferredPrompt={() => setDeferredPwaPrompt(null)}
          isStandaloneInstalled={isPwaStandalone}
        />
        <AuthModal 
          isOpen={isAuthOpen} 
          onClose={handleAuthModalClose} 
          registeredUsers={registeredUsers}
          chefs={chefs}
          initialRole={authInitialRole}
          onLoginSuccess={handleAuthSuccess}
          onRegisterUser={handleRegisterUser}
          onOpenOnboarding={() => setIsOnboardingOpen(true)}
        />
        <NotificationToast
          message={toastMessage}
          title={toastTitle}
          variant={toastVariant}
          actionLabel={toastAction?.label}
          onAction={toastAction?.onAction}
          isVisible={isToastVisible}
          onClose={() => setIsToastVisible(false)}
        />
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
          reviews={reviews}
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
            onAddToCart={handleAddToCart}
          />
        )}
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} onUpdateQuantity={handleUpdateQuantity} onCheckout={handleCheckout} onAddDish={handleInitiateBooking} availableChefs={chefs} />
        <AuthModal 
          isOpen={isAuthOpen} 
          onClose={handleAuthModalClose} 
          registeredUsers={registeredUsers}
          chefs={chefs}
          initialRole={authInitialRole}
          onLoginSuccess={handleAuthSuccess}
          onRegisterUser={handleRegisterUser}
          onOpenOnboarding={() => setIsOnboardingOpen(true)}
        />
        <ChefOnboarding 
          isOpen={isOnboardingOpen} 
          onClose={() => setIsOnboardingOpen(false)} 
          onSubmitApplication={handleChefSubmitApplication}
          currentUser={currentUser} 
        />
        <NotificationToast
          message={toastMessage}
          title={toastTitle}
          variant={toastVariant}
          actionLabel={toastAction?.label}
          onAction={toastAction?.onAction}
          isVisible={isToastVisible}
          onClose={() => setIsToastVisible(false)}
        />
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
      cartCount > 0 && !isCartBarDismissed && !isCartOpen ? 'pb-44 md:pb-24' : 'pb-24 md:pb-8'
    }`}>
      <Header 
        cartCount={cartCount} 
        orderCount={activeOrdersCount} 
        hasUnreadOrders={hasUnreadOrderAlerts}
        chefAlertCount={chefPendingBadgeCount}
        onCartClick={() => setIsCartOpen(true)} 
        currentView={currentView} 
        onNavigate={navigateTo} 
        onAuthClick={() => { setAuthInitialRole('client'); setIsAuthOpen(true); }}
        onShareClick={() => setIsShareOpen(true)}
        onPwaInstallClick={() => setIsPwaModalOpen(true)}
        onOnboardingClick={() => setIsOnboardingOpen(true)}
        currentUser={currentUser}
        onQuickAdminAccess={handleQuickAdminAccess}
        activeAddress={verifiedAddress}
        onChangeAddress={() => setIsAddressGateOpen(true)}
      />
      
      {currentView === ViewState.HOME && <FilterBar filters={filters} onFilterChange={setFilters} chefs={chefs} />}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex-grow w-full mb-10 pb-4">
        {currentView === ViewState.HOME && (
          <div className="animate-fade-in">
            {!hasActiveFilters ? (
              <>
                <DailySpecials chefs={chefs} onAddDish={handleInitiateBooking} favorites={favorites} onToggleFavorite={handleToggleFavorite} />
                
                {/* Active Interactive Dish Catalog Subdivided By Provenance */}
                <DishCatalogByOrigin 
                  chefs={chefs} 
                  reviews={reviews}
                  onAddDish={handleInitiateBooking} 
                  favorites={favorites} 
                  onToggleFavorite={handleToggleFavorite} 
                  onViewProfile={handleViewProfile}
                />

                <ChefGroupSection title="Eccellenze Europee" chefs={chefsByContinent['Europa']} reviews={reviews} onAddDish={handleInitiateBooking} onViewProfile={handleViewProfile} favorites={favorites} onToggleFavorite={handleToggleFavorite} />
                <ChefGroupSection title="Sapori dall'Africa" chefs={chefsByContinent['Africa']} reviews={reviews} onAddDish={handleInitiateBooking} onViewProfile={handleViewProfile} favorites={favorites} onToggleFavorite={handleToggleFavorite} />
                <ChefGroupSection title="Tradizioni Asiatiche" chefs={chefsByContinent['Asia']} reviews={reviews} onAddDish={handleInitiateBooking} onViewProfile={handleViewProfile} favorites={favorites} onToggleFavorite={handleToggleFavorite} />
                <ChefGroupSection title="Dalle Americhe" chefs={chefsByContinent['Americhe']} reviews={reviews} onAddDish={handleInitiateBooking} onViewProfile={handleViewProfile} favorites={favorites} onToggleFavorite={handleToggleFavorite} />
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {matchingDishes.map(({ dish, chef }) => {
                        const isFav = favorites.includes(dish.id);
                        const canBook = isChefBookable(chef);
                        return (
                          <div
                            key={`${chef.id}-${dish.id}`}
                            onClick={() => handleInitiateBooking(dish)}
                            className="group bg-white rounded-[2rem] border border-gray-100 overflow-hidden flex flex-col justify-between h-full hover:shadow-2xl transition-all duration-300 hover:border-orange-200 shadow-sm cursor-pointer"
                          >
                            <div className="relative aspect-[16/10] w-full overflow-hidden shrink-0">
                              <img
                                src={dish.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
                                alt={dish.name}
                                referrerPolicy="no-referrer"
                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'; }}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60"></div>

                              <div className="absolute top-3 left-3 bg-black/85 backdrop-blur-md text-white text-[11px] font-black px-3 py-1 rounded-xl uppercase tracking-widest shadow-xl">
                                € {dish.price.toFixed(2)}
                              </div>

                              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm text-black text-[10px] font-black px-2.5 py-1 rounded-xl uppercase tracking-wider shadow-md flex items-center gap-1.5">
                                <CountryFlag flag={chef.nationality} title={chef.countryName} size="sm" />
                                <span className="text-gray-800 tracking-tight">{chef.countryName}</span>
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleFavorite(dish.id);
                                }}
                                className="absolute top-3 right-3 p-2 bg-white/95 backdrop-blur rounded-2xl shadow-xl hover:bg-white transition-all z-10"
                              >
                                <Heart className={`w-4 h-4 shrink-0 ${isFav ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                              </button>
                            </div>

                            <div className="p-4 flex-1 flex flex-col justify-between gap-2.5">
                              <div>
                                <h3 className="font-black italic text-orange-600 text-[15px] leading-snug group-hover:text-orange-700 transition-colors mb-1 line-clamp-2">
                                  {dish.name}
                                </h3>
                                <p className="text-black text-xs leading-snug mb-2 line-clamp-2 italic font-medium">
                                  "{dish.description}"
                                </p>
                                <AllergensRow allergens={dish.allergens} className="mb-2" />
                                <div className="flex flex-wrap gap-1.5">
                                  <span className="px-2 py-0.5 bg-orange-50 text-orange-800 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-orange-600 shrink-0" /> 25-35 min
                                  </span>
                                  {dish.tags.slice(0, 2).map(tag => (
                                    <span key={tag} className="px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-500">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="space-y-2.5">
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewProfile(chef);
                                  }}
                                  className="flex items-center justify-between p-2.5 bg-gray-50 hover:bg-orange-50/60 rounded-2xl border border-gray-100 transition-colors"
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <img src={chef.avatar} alt={chef.name} className="w-7 h-7 rounded-xl object-cover shrink-0" />
                                    <div className="min-w-0">
                                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Chef Locale</p>
                                      <span className="text-xs font-bold text-gray-800 truncate block">{chef.name}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <span className="flex items-center gap-0.5 bg-amber-400/15 text-amber-800 px-2 py-0.5 rounded-lg text-[9px] font-black">
                                      <Star className="w-2.5 h-2.5 fill-current text-amber-500 shrink-0" />
                                      {chef.rating}
                                    </span>
                                    <span className="flex items-center gap-0.5 text-gray-500 text-[9px] font-bold">
                                      <MapPin className="w-2.5 h-2.5 text-orange-600 shrink-0" />
                                      {chef.distance} km
                                    </span>
                                  </div>
                                </div>

                                {canBook ? (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleInitiateBooking(dish);
                                    }}
                                    className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-black text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                                  >
                                    <ShoppingBag className="w-4 h-4 shrink-0" />
                                    <span>Scegli e Prenota</span>
                                  </button>
                                ) : (
                                  <div className="space-y-1.5">
                                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-black uppercase tracking-wider w-full justify-center">
                                      <Clock className="w-3.5 h-3.5 shrink-0" />
                                      <span>Disponibile a breve</span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleInitiateBooking(dish);
                                      }}
                                      className="w-full py-2.5 rounded-xl bg-black hover:bg-orange-600 text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                                    >
                                      <ShoppingBag className="w-4 h-4 shrink-0" />
                                      <span>Aggiungi al carrello</span>
                                    </button>
                                  </div>
                                )}
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
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        {filteredChefs.map(chef => (
                          <ChefCard key={chef.id} chef={chef} reviews={reviews} onAddDish={handleInitiateBooking} onViewProfile={handleViewProfile} favorites={favorites} onToggleFavorite={handleToggleFavorite} />
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

        {currentView === ViewState.CHEFS && <MesaChefs chefs={filteredChefs} reviews={reviews} onViewProfile={handleViewProfile} />}
        {currentView === ViewState.HERITAGE && <HeritageMenu chefs={baseChefs} onAddDish={handleInitiateBooking} onViewProfile={handleViewProfile} favorites={favorites} onToggleFavorite={handleToggleFavorite} />}
        {currentView === ViewState.CULTURE && <CultureSection />}
        {currentView === ViewState.EXPERIENCES && <ExperiencesSection />}
        {currentView === ViewState.FAVORITES && <FavoritesSection favorites={favorites} chefs={baseChefs} onAddDish={handleInitiateBooking} onToggleFavorite={handleToggleFavorite} />}
        {currentView === ViewState.ORDERS && (
          !currentUser ? (
            <div className="animate-fade-in py-16 px-6 bg-gray-50 rounded-[2.5rem] border border-gray-200 text-center max-w-xl mx-auto space-y-4">
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Accesso richiesto per gli Ordini</h2>
              <p className="text-sm text-gray-600 font-medium leading-relaxed">
                Accedi o registrati come Cliente per visualizzare le tue prenotazioni e seguirne lo stato in tempo reale.
              </p>
              <button
                type="button"
                onClick={() => {
                  setPendingPostAuthView(ViewState.ORDERS);
                  promptClientAuth("Accedi o registrati come Cliente per visualizzare i tuoi ordini.");
                }}
                className="px-7 py-3.5 bg-orange-600 hover:bg-black text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg transition-all active:scale-95"
              >
                Accedi o Registrati
              </button>
            </div>
          ) : selectedOrder ? (() => {
            const activeOrder = orders.find(o => o.id === selectedOrder.id) || selectedOrder;
            const orderCustomer = registeredUsers.find(u => u.id === activeOrder.userId);
            const customerAddr = orderCustomer?.addresses.find(a => a.isVerified) || orderCustomer?.addresses[0];
            const resolvedDeliveryAddress =
              (customerAddr ? `${customerAddr.street}, ${customerAddr.zip} ${customerAddr.city}` : '') ||
              (activeOrder.userId === currentUser.id ? verifiedAddress : '') ||
              undefined;
            return (
              <OrderTracking 
                order={activeOrder} 
                reviews={reviews}
                onRateOrder={currentUser.role === 'client' ? setReviewOrder : undefined}
                onBack={() => {
                  setSelectedOrder(null);
                  setRecentlyPlacedOrderId(null);
                }} 
                chefs={chefs} 
                userRole={currentUser.role}
                justPlaced={selectedOrder.id === recentlyPlacedOrderId}
                onUpdateOrderStatus={currentUser.role === 'chef' || currentUser.role === 'admin' ? handleUpdateOrderStatus : undefined}
                onCancelOrder={currentUser.role === 'client' ? handleCancelOrderByClient : undefined}
                onSendMessage={handleSendOrderMessage}
                deliveryAddress={resolvedDeliveryAddress}
              />
            );
          })() : (
            <div className="animate-fade-in space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <h2 className={`text-3xl font-black tracking-tight ${currentUser.role === 'chef' ? 'text-emerald-600' : 'text-orange-600'}`}>
                  {currentUser.role === 'chef' ? 'Ordini Ricevuti' : 'I Miei Ordini'}
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  {concludedVisibleOrders.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setOrdersViewDeleteError(null);
                        setOrdersViewDeleteConfirm({ mode: 'bulk' });
                      }}
                      className="px-3.5 py-2 rounded-2xl bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border border-red-200 hover:border-red-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Pulisci ordini conclusi ({concludedVisibleOrders.length})</span>
                    </button>
                  )}
                  {currentUser.role === 'chef' && (
                    <>
                      <button
                        type="button"
                        onClick={handleToggleChefSoundAlerts}
                        className={`px-3.5 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all ${
                          chefSoundEnabled
                            ? 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100'
                            : 'bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {chefSoundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                        <span>{chefSoundEnabled ? 'Avviso Sonoro ON' : 'Avviso Sonoro OFF'}</span>
                      </button>
                      {chefPendingBadgeCount > 0 && (
                        <span className="px-3.5 py-2 rounded-2xl bg-red-600 text-white text-[10px] font-black uppercase tracking-widest animate-pulse">
                          {chefPendingBadgeCount} in attesa
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
              {currentUser.role === 'chef' && chefPendingBadgeCount > 0 && (
                <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-xl border-2 border-orange-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-black/20 flex items-center justify-center shrink-0">
                      <BellRing className="w-6 h-6 text-white animate-bounce" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-orange-100">
                        Firestore Live Sync
                      </p>
                      <p className="text-sm sm:text-base font-black">
                        {chefPendingBadgeCount === 1
                          ? '1 nuovo ordine in attesa di conferma'
                          : `${chefPendingBadgeCount} nuovi ordini in attesa di conferma`}
                      </p>
                    </div>
                  </div>
                  {chefSoundEnabled && audioAutoplayBlocked && (
                    <button
                      type="button"
                      onClick={() => void handleUnlockChefAudio()}
                      className="px-4 py-2.5 bg-black hover:bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shrink-0 shadow-md"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Attiva Audio</span>
                    </button>
                  )}
                </div>
              )}
              {visibleClientOrders.length === 0 ? <p className="text-gray-400 font-bold py-20 text-center bg-gray-50 rounded-[3rem]">Nessun ordine attivo.</p> : visibleClientOrders.map(order => {
                const firstItem = order.items[0];
                const statusLabel = ORDER_STATUS_LABELS[order.status] || order.status;
                const isConfirmed = order.status === 'CONFIRMED' || order.status === 'PLACED';
                const canDeleteOrder = isConcludedOrder(order) || currentUser.role === 'admin';
                const allowCancel = currentUser.role === 'client' && canClientCancelOrder(order);
                return (
                  <div
                    key={order.id}
                    onClick={() => {
                      setUnreadOrderAlertIds(prev => prev.filter(id => id !== order.id));
                      setSelectedOrder(order);
                    }}
                    className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col sm:flex-row justify-between sm:items-center gap-4 group"
                  >
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest font-mono">{formatOrderCode(order.id)}</p>
                      <h4 className={`font-bold text-xl ${currentUser.role === 'chef' ? 'text-emerald-700' : 'text-orange-600'}`}>{firstItem?.name || order.chefName}</h4>
                      <p className="text-xs text-black font-medium mt-0.5">
                        {currentUser.role === 'chef' ? `Cliente ${order.customerName}` : formatChefDisplayName(order.chefName)} • {order.items.length} {order.items.length === 1 ? 'piatto' : 'piatti'} • €{order.total.toFixed(2)}
                      </p>
                      {firstItem?.scheduledDate && (
                        <p className="text-[11px] text-black/75 font-semibold mt-1">
                          {order.deliveryMode === 'delivery' ? 'Consegna a domicilio' : 'Ritiro'} • {firstItem.scheduledDate} ore {firstItem.scheduledTime}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3 self-end sm:self-auto">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        order.status === 'COMPLETED' || isConfirmed
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : order.status === 'REJECTED' || order.status === 'CANCELLED'
                            ? 'bg-red-100 text-red-700 border-red-200'
                            : order.status === 'PENDING_CONFIRMATION'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-orange-100 text-orange-700 border-orange-200 animate-pulse'
                      }`}>
                        {statusLabel}
                      </span>
                      {currentUser.role === 'client' && order.status === 'COMPLETED' && (() => {
                        const submittedReview = reviews.find(r => r.orderId === order.id);
                        const eligible = isOrderEligibleForReview(order, reviews);
                        if (eligible) {
                          return (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setReviewOrder(order);
                              }}
                              className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm active:scale-95 transition-all shrink-0"
                            >
                              <Star className="w-3.5 h-3.5 fill-current shrink-0" />
                              <span>Valuta ordine</span>
                            </button>
                          );
                        }
                        if (order.hasReview || order.isReviewed || submittedReview) {
                          const score = submittedReview?.ratingOverall ?? order.reviewRating ?? 5;
                          return (
                            <span
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black shrink-0"
                            >
                              <Star className="w-3.5 h-3.5 fill-current text-amber-500 shrink-0" />
                              <span>{score.toFixed(1)}</span>
                            </span>
                          );
                        }
                        return null;
                      })()}
                      {allowCancel && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            void handleCancelOrderByClient(order.id);
                          }}
                          className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border border-red-200 hover:border-red-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 transition-all shrink-0"
                        >
                          <XCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>Annulla</span>
                        </button>
                      )}
                      {canDeleteOrder && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOrdersViewDeleteError(null);
                            setOrdersViewDeleteConfirm({ mode: 'single', order });
                          }}
                          title={isConcludedOrder(order) ? 'Elimina ordine concluso' : 'Elimina ordine (anche di prova)'}
                          aria-label={`Elimina ordine ${formatOrderCode(order.id)}`}
                          className="p-2.5 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 hover:border-red-600 transition-all shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
        {currentView === ViewState.CHEF_PROFILE && selectedChef && (
          <ChefProfile chef={selectedChef} reviews={reviews} onBack={() => navigateTo(ViewState.HOME)} onAddDish={handleInitiateBooking} favorites={favorites} onToggleFavorite={handleToggleFavorite} onNavigateToCulture={() => navigateTo(ViewState.CULTURE)} />
        )}
        
        {currentView === ViewState.PROFILE && currentUser && (
          <PersonalArea 
            currentUser={currentUser}
            onLogout={() => {
              if (auth) signOut(auth).catch(() => {});
              setCurrentUser(null);
              setSelectedOrder(null);
              setBookingDish(null);
              setUnreadOrderAlertIds([]);
              setRecentlyPlacedOrderId(null);
              setPendingBookingDish(null);
              setPendingBookingPayload(null);
              setPendingPostAuthView(null);
              setPendingCheckoutTotal(null);
              navigateTo(ViewState.LANDING);
              showNotification("Sconnesso dall'Area Personale MESA. A presto! 👋");
            }}
            onUpdateUser={handleUpdateUser}
            orders={orders}
            activeAddress={verifiedAddress}
            reviews={reviews}
            onRateOrder={currentUser.role === 'client' ? setReviewOrder : undefined}
            onNavigate={navigateTo}
            onSelectOrder={setSelectedOrder}
            chefs={chefs}
            onUpdateChef={handleUpdateChef}
            onSaveChefDishes={handleSaveChefDishes}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onCancelOrder={currentUser.role === 'client' ? handleCancelOrderByClient : undefined}
            onDeleteOrder={handleDeleteOrder}
            onDeleteConcludedOrders={handleDeleteConcludedOrders}
            soundAlertsEnabled={chefSoundEnabled}
            onToggleSoundAlerts={handleToggleChefSoundAlerts}
            audioAutoplayBlocked={audioAutoplayBlocked}
            onUnlockAudio={handleUnlockChefAudio}
            registeredUsers={registeredUsers}
            chefApplications={chefApplications}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
            onDeleteOwnProfile={currentUser.role !== 'admin' ? handleDeleteOwnProfile : undefined}
          />
        )}

        {currentView === ViewState.ADMIN_DASHBOARD && (
          <AdminDashboard 
            chefs={chefs} 
            reviews={reviews}
            onToggleReviewVisibility={handleToggleReviewVisibility}
            onDeleteReview={handleDeleteReview}
            onUpdateChef={handleUpdateChef}
            onSaveChefDishes={handleSaveChefDishes}
            onDeleteChef={handleDeleteChef}
            onDeleteOrder={handleDeleteOrder}
            onDeleteConcludedOrders={handleDeleteConcludedOrders}
            orders={orders} 
            registeredUsers={registeredUsers}
            chefApplications={chefApplications}
            onVerifyAddress={handleVerifyAddress}
            onDeleteUser={handleDeleteUser}
            onUpdateUser={handleUpdateUser}
            onApproveApplication={handleApproveApplication}
            onRejectApplication={handleRejectApplication}
            onDeleteApplication={handleDeleteApplication}
            onUpdateApplication={handleUpdateApplication}
          />
        )}

        {[ViewState.ABOUT, ViewState.SAFETY, ViewState.BECOME_CHEF, ViewState.HELP, ViewState.TERMS, ViewState.PRIVACY].includes(currentView) && (
          <InfoPage
            view={currentView}
            onBack={() => navigateTo(ViewState.HOME)}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
            currentUser={currentUser}
            chefApplications={chefApplications}
          />
        )}
      </main>

      <Footer onNavigate={navigateTo} />
      <BottomNav
        currentView={currentView}
        onNavigate={navigateTo}
        cartCount={cartCount}
        orderCount={activeOrdersCount}
        hasUnreadOrders={hasUnreadOrderAlerts}
        onCartClick={() => setIsCartOpen(true)}
        isCartOpen={isCartOpen}
        userRole={currentUser?.role}
      />

      {/* Glovo-style Sticky Floating Cart Bar - Non-intrusive, dismissible & non-blocking */}
      {cartCount > 0 && !isCartOpen && !isCartBarDismissed && (
        <div 
          className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-lg bg-orange-600 hover:bg-orange-700 text-white p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl shadow-2xl shadow-orange-950/30 border border-orange-500 flex items-center justify-between cursor-pointer transition-all transform hover:scale-[1.01] active:scale-95 animate-fade-in-up group" 
          onClick={() => setIsCartOpen(true)}
        >
          <div className="flex items-center space-x-3 min-w-0">
            <div className="bg-white/20 p-2.5 rounded-xl flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5 text-white shrink-0" />
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
          onAddToCart={handleAddToCart}
        />
      )}
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} onUpdateQuantity={handleUpdateQuantity} onCheckout={handleCheckout} onAddDish={handleInitiateBooking} availableChefs={chefs} />
      
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={handleAuthModalClose} 
        registeredUsers={registeredUsers}
        chefs={chefs}
        initialRole={authInitialRole}
        onLoginSuccess={handleAuthSuccess}
        onRegisterUser={handleRegisterUser}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
      />

      <OrderReviewModal isOpen={!!reviewOrder} onClose={() => setReviewOrder(null)} order={reviewOrder!} onSubmit={handleReviewSubmit} />
      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} contextChefId={selectedChef?.id} />
      <PwaInstallModal
        isOpen={isPwaModalOpen}
        onClose={() => setIsPwaModalOpen(false)}
        deferredPrompt={deferredPwaPrompt}
        onClearDeferredPrompt={() => setDeferredPwaPrompt(null)}
        isStandaloneInstalled={isPwaStandalone}
      />
      <ChefOnboarding 
        isOpen={isOnboardingOpen} 
        onClose={() => setIsOnboardingOpen(false)} 
        onSubmitApplication={handleChefSubmitApplication}
        currentUser={currentUser} 
      />
      <NotificationToast
        message={toastMessage}
        title={toastTitle}
        variant={toastVariant}
        actionLabel={toastAction?.label}
        onAction={toastAction?.onAction}
        isVisible={isToastVisible}
        onClose={() => setIsToastVisible(false)}
      />

      <AddressGateModal 
        isOpen={isAddressGateOpen} 
        onClose={() => setIsAddressGateOpen(false)} 
        onAddressVerified={handleAddressVerified} 
        availableChefs={chefs}
      />
      
      <ConfirmDeleteOrdersModal
        isOpen={Boolean(ordersViewDeleteConfirm)}
        mode={ordersViewDeleteConfirm?.mode || 'single'}
        order={ordersViewDeleteConfirm?.order}
        ordersCount={concludedVisibleOrders.length}
        isDeleting={isDeletingOrdersView}
        errorMessage={ordersViewDeleteError}
        onCancel={() => {
          if (!isDeletingOrdersView) {
            setOrdersViewDeleteConfirm(null);
            setOrdersViewDeleteError(null);
          }
        }}
        onConfirm={handleConfirmOrdersViewDelete}
      />

      {showTour && (
        <LaunchTour onComplete={() => { 
          setShowTour(false); 
          localStorage.setItem('mesa_launch_tour_v60', 'true'); 
        }} />
      )}
    </div>
  );
}

export default App;
