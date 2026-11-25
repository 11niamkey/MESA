import React, { useState, useEffect } from 'react';
import { 
  User, MapPin, ShieldCheck, ShieldAlert, Trash2, 
  Plus, LogOut, ChefHat, Calendar, ClipboardList, 
  Clock, CheckCircle, Smartphone, Mail, Globe, Check, XCircle, Sparkles, AlertCircle, Volume2, VolumeX 
} from 'lucide-react';
import { AppUser, UserAddress, Order, OrderStatus, ViewState, Chef, Dish, ChefApplication, ORDER_STATUS_LABELS } from '../types';
import { CountryFlag } from './CountryFlag';
import { ImagePickerBox } from './ImagePickerBox';
import { AdminDishesPanel } from './AdminDishesPanel';
import { PORDENONE_COMUNI, findPordenoneComune, isPordenoneLocation, normalizeLocationToPordenone } from './italianTerritoryData';

interface PersonalAreaProps {
  currentUser: AppUser;
  onLogout: () => void;
  onUpdateUser: (updatedUser: AppUser) => void;
  orders: Order[];
  onNavigate: (view: ViewState) => void;
  onSelectOrder: (order: Order) => void;
  chefs: Chef[];
  onUpdateChef?: (updatedChef: Chef) => Promise<boolean> | void;
  onSaveChefDishes?: (chefId: string, dishes: Dish[]) => Promise<boolean>;
  onUpdateOrderStatus?: (orderId: string, status: OrderStatus) => Promise<void> | void;
  soundAlertsEnabled?: boolean;
  onToggleSoundAlerts?: () => void;
  registeredUsers?: AppUser[];
  chefApplications?: ChefApplication[];
  onOpenOnboarding?: () => void;
}

const DEFAULT_FOOD_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';

export const PersonalArea: React.FC<PersonalAreaProps> = ({ 
  currentUser, 
  onLogout, 
  onUpdateUser, 
  orders,
  onNavigate,
  onSelectOrder,
  chefs,
  onUpdateChef,
  onSaveChefDishes,
  onUpdateOrderStatus,
  soundAlertsEnabled = true,
  onToggleSoundAlerts,
  registeredUsers = [],
  chefApplications = [],
  onOpenOnboarding
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders' | 'kitchen' | 'chef-orders' | 'chef-menu' | 'chef-wallet' | 'client-payments'>(
    currentUser.role === 'chef' ? 'chef-orders' : 'profile'
  );
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (currentUser.role === 'chef') {
      setActiveTab('chef-orders');
    } else if (activeTab === 'chef-orders' || activeTab === 'kitchen' || activeTab === 'chef-menu' || activeTab === 'chef-wallet') {
      setActiveTab('profile');
    }
  }, [currentUser.id, currentUser.role]);
  
  // States for adding address
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [addressError, setAddressError] = useState('');

  // General Profile Edit States
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profileLastName, setProfileLastName] = useState(currentUser.lastName);
  const [profileEmail, setProfileEmail] = useState(currentUser.email);
  const [profilePassword, setProfilePassword] = useState(currentUser.password || 'demo123');
  const [profileAvatar, setProfileAvatar] = useState(currentUser.avatarUrl || '');

  // Chef-specific settings state (loaded if user is a chef)
  const matchingChef = chefs.find(c => {
    const chefEmailMatch = c.email && currentUser.email && c.email.toLowerCase().trim() === currentUser.email.toLowerCase().trim();
    const chefIdMatch =
      c.id === `chef-${currentUser.id}` ||
      c.id === currentUser.id ||
      `usr-${c.id}` === currentUser.id ||
      `usr-${c.id.replace('chef-', '')}` === currentUser.id;
    const fullNameString = `${currentUser.name} ${currentUser.lastName}`.trim().toLowerCase();
    const chefNameMatch = c.name.trim().toLowerCase() === fullNameString ||
                          c.name.trim().toLowerCase() === currentUser.name.trim().toLowerCase();
    return chefEmailMatch || chefIdMatch || chefNameMatch;
  });

  const matchingApplication = chefApplications.find(
    a =>
      (a.userId && a.userId === currentUser.id) ||
      a.email.trim().toLowerCase() === currentUser.email.trim().toLowerCase()
  );
  
  const [chefName, setChefName] = useState(matchingChef?.name || matchingApplication?.brandName || currentUser.brandName || `${currentUser.name} ${currentUser.lastName}`);
  const [chefAvatar, setChefAvatar] = useState(matchingChef?.avatar || matchingApplication?.avatarUrl || currentUser.avatarUrl || '');
  const [chefNationality, setChefNationality] = useState(matchingChef?.nationality || matchingApplication?.nationality || '🇮🇹');
  const [chefCountryName, setChefCountryName] = useState(matchingChef?.countryName || matchingApplication?.countryName || 'Italia');
  const [chefEmail, setChefEmail] = useState(matchingChef?.email || currentUser.email);
  const [chefPassword, setChefPassword] = useState(matchingChef?.password || currentUser.password || 'demo123');
  const [chefSpecialties, setChefSpecialties] = useState(matchingChef?.specialties.join(', ') || matchingApplication?.specialties?.join(', ') || 'Cucina Tradizionale');
  const [chefBio, setChefBio] = useState(matchingChef?.bio || matchingApplication?.bio || 'Passione per la cucina casalinga preparata con ingredienti freschi.');
  
  const defaultNumbers: Record<string, string> = {
    'c1': '+393475552026',
    'c2': '+393485553012',
    'c3': '+393495551890',
    'c401': '+393335554433',
    'c402': '+393345558877',
    'c403': '+393355551234',
    'c301': '+393405559988',
    'c302': '+393415557766',
    'c201': '+393385551122',
    'c41': '+393395556677'
  };

  const [chefPhone, setChefPhone] = useState(
    matchingChef?.phone || matchingApplication?.phone || currentUser.phone || (matchingChef ? defaultNumbers[matchingChef.id] : '') || '+393475552026'
  );
  const [chefLocation, setChefLocation] = useState(
    normalizeLocationToPordenone(matchingChef?.location || matchingApplication?.location || currentUser.addresses?.[0]?.street)
  );
  const [haccpStatus, setHaccpStatus] = useState(true);

  useEffect(() => {
    setProfileName(currentUser.name);
    setProfileLastName(currentUser.lastName);
    setProfileEmail(currentUser.email);
    setProfilePassword(currentUser.password || 'demo123');
    setProfileAvatar(currentUser.avatarUrl || matchingChef?.avatar || matchingApplication?.avatarUrl || '');
  }, [currentUser.id, currentUser.name, currentUser.lastName, currentUser.email, currentUser.password, currentUser.avatarUrl, matchingChef?.avatar, matchingApplication?.avatarUrl]);

  useEffect(() => {
    if (matchingChef) {
      setChefName(matchingChef.name);
      setChefAvatar(matchingChef.avatar || currentUser.avatarUrl || '');
      setChefNationality(matchingChef.nationality || '🇮🇹');
      setChefCountryName(matchingChef.countryName || 'Italia');
      setChefEmail(matchingChef.email || currentUser.email);
      setChefPassword(matchingChef.password || currentUser.password || 'demo123');
      setChefSpecialties(matchingChef.specialties.join(', '));
      setChefBio(matchingChef.bio);
      if (matchingChef.phone) setChefPhone(matchingChef.phone);
      setChefLocation(normalizeLocationToPordenone(matchingChef.location));
    } else if (matchingApplication) {
      setChefName(matchingApplication.brandName || matchingApplication.fullName);
      setChefAvatar(matchingApplication.avatarUrl || currentUser.avatarUrl || '');
      setChefNationality(matchingApplication.nationality || '🇮🇹');
      setChefCountryName(matchingApplication.countryName || 'Italia');
      setChefEmail(matchingApplication.email);
      setChefPhone(matchingApplication.phone || currentUser.phone || '+393475552026');
      setChefLocation(normalizeLocationToPordenone(matchingApplication.location));
      setChefSpecialties(matchingApplication.specialties.join(', '));
      setChefBio(matchingApplication.bio);
    }
  }, [matchingChef?.id, matchingChef?.name, matchingChef?.avatar, matchingChef?.location, matchingChef?.phone, matchingApplication?.id, matchingApplication?.avatarUrl, currentUser.id]);

  const clientOrders = orders.filter(
    o => o.userId === currentUser.id
  );

  const chefOrders = orders.filter(o => {
    if (matchingChef) {
      return (
        o.chefId === matchingChef.id ||
        o.chefName?.trim().toLowerCase() === matchingChef.name.trim().toLowerCase()
      );
    }
    const fullName = `${currentUser.name} ${currentUser.lastName}`.trim().toLowerCase();
    return (
      o.chefId === currentUser.id ||
      o.chefId === `chef-${currentUser.id}` ||
      o.chefName?.trim().toLowerCase() === fullName
    );
  });

  const pendingChefOrdersCount = chefOrders.filter(o => o.status === 'PENDING_CONFIRMATION').length;
  const userOrders = currentUser.role === 'chef' ? chefOrders : clientOrders;

  const handleChefStatusChange = async (orderId: string, nextStatus: OrderStatus) => {
    if (!onUpdateOrderStatus) return;
    setUpdatingOrderId(orderId);
    try {
      await onUpdateOrderStatus(orderId, nextStatus);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!street.trim() || !city.trim() || !zip.trim()) {
      setAddressError('Tutti i campi sono obbligatori.');
      return;
    }

    const newAddress: UserAddress = {
      id: `addr-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      street: street.trim(),
      city: city.trim(),
      zip: zip.trim(),
      isVerified: false // Admin must verify it
    };

    const updatedUser: AppUser = {
      ...currentUser,
      addresses: [...currentUser.addresses, newAddress]
    };

    onUpdateUser(updatedUser);
    setStreet('');
    setCity('');
    setZip('');
    setAddressError('');
  };

  const handleDeleteAddress = (addressId: string) => {
    const updatedUser: AppUser = {
      ...currentUser,
      addresses: currentUser.addresses.filter(addr => addr.id !== addressId)
    };
    onUpdateUser(updatedUser);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim() || !profileLastName.trim() || !profileEmail.trim() || !profilePassword.trim()) {
      setFeedbackMsg({ type: 'error', text: 'Tutti i campi sono obbligatori.' });
      return;
    }

    // Email uniqueness check
    const isEmailTaken = registeredUsers.some(
      u => u.id !== currentUser.id && u.email.toLowerCase() === profileEmail.trim().toLowerCase()
    );
    if (isEmailTaken) {
      setFeedbackMsg({ type: 'error', text: 'Questa email è già registrata da un altro utente della piattaforma.' });
      return;
    }

    const updatedUser: AppUser = {
      ...currentUser,
      name: profileName.trim(),
      lastName: profileLastName.trim(),
      email: profileEmail.trim().toLowerCase(),
      password: profilePassword.trim(),
      avatarUrl: profileAvatar.trim() || undefined
    };

    onUpdateUser(updatedUser);
    setFeedbackMsg({ type: 'success', text: 'Profilo personale e foto aggiornati e sincronizzati con successo!' });
  };

  const handleSaveChefSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chefName.trim() || !chefPhone.trim() || !chefLocation.trim() || !chefEmail.trim() || !chefPassword.trim()) {
      setFeedbackMsg({ type: 'error', text: 'I campi principali sono obbligatori.' });
      return;
    }
    if (!isPordenoneLocation(chefLocation)) {
      setFeedbackMsg({ type: 'error', text: 'La sede della cucina deve trovarsi nella Provincia di Pordenone (PN).' });
      return;
    }

    // Email uniqueness check
    const isEmailTaken = registeredUsers.some(
      u => u.id !== currentUser.id && u.email.toLowerCase() === chefEmail.trim().toLowerCase()
    );
    if (isEmailTaken) {
      setFeedbackMsg({ type: 'error', text: 'Questa email è già registrata da un altro utente della piattaforma.' });
      return;
    }

    const activeChefId = matchingChef?.id || `chef-${currentUser.id}`;
    const nameParts = chefName.trim().split(' ');
    const first = nameParts[0] || currentUser.name;
    const last = nameParts.slice(1).join(' ');
    const resolvedAvatar = chefAvatar.trim() || matchingChef?.avatar || currentUser.avatarUrl;

    const updatedUser: AppUser = {
      ...currentUser,
      name: first,
      lastName: last,
      phone: chefPhone.trim(),
      brandName: chefName.trim(),
      email: chefEmail.trim().toLowerCase(),
      password: chefPassword.trim(),
      ...(resolvedAvatar ? { avatarUrl: resolvedAvatar } : { avatarUrl: undefined })
    };
    onUpdateUser(updatedUser);

    if (onUpdateChef && matchingChef) {
      onUpdateChef({
        ...matchingChef,
        id: activeChefId,
        name: chefName.trim(),
        avatar: resolvedAvatar || matchingChef.avatar,
        nationality: chefNationality.trim(),
        countryName: chefCountryName.trim(),
        email: chefEmail.trim().toLowerCase(),
        password: chefPassword.trim(),
        location: chefLocation.trim(),
        phone: chefPhone.trim(),
        specialties: chefSpecialties.split(',').map(s => s.trim()).filter(Boolean),
        bio: chefBio.trim(),
      });
    }
    setFeedbackMsg({ type: 'success', text: 'Tutte le informazioni, la foto e le credenziali sono state salvate e sincronizzate!' });
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto space-y-10 pb-16">
      
      {/* Profilo Header Card */}
      <div className="bg-black text-white rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden border-b-8 border-orange-600">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            {(matchingChef?.avatar || matchingApplication?.avatarUrl || currentUser.avatarUrl) ? (
              <img
                src={matchingChef?.avatar || matchingApplication?.avatarUrl || currentUser.avatarUrl}
                alt={`${currentUser.name} ${currentUser.lastName}`}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-3xl object-cover shadow-xl border-2 border-orange-500 shrink-0"
              />
            ) : (
              <div className="w-20 h-20 bg-orange-600 text-black rounded-3xl flex items-center justify-center shadow-xl shrink-0">
                {currentUser.role === 'chef' ? (
                  <ChefHat className="w-10 h-10 stroke-2" />
                ) : currentUser.role === 'admin' ? (
                  <ShieldCheck className="w-10 h-10 stroke-2" />
                ) : (
                  <User className="w-10 h-10 stroke-2" />
                )}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border ${
                  currentUser.role === 'chef' 
                    ? matchingChef
                      ? 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                      : 'bg-amber-500/15 text-amber-300 border-amber-400/30'
                    : currentUser.role === 'admin'
                      ? 'bg-red-500/10 text-red-500 border-red-500/20'
                      : 'bg-green-500/10 text-green-500 border-green-500/20'
                }`}>
                  {currentUser.role === 'chef'
                    ? matchingChef ? 'Cuoco Partner Attivo' : 'Cuoco in Verifica Admin'
                    : currentUser.role === 'admin'
                      ? 'Amministratore'
                      : 'Cliente MESA'}
                </span>
                <span className="text-[10px] text-gray-400 font-bold">Registrato il {currentUser.createdAt}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black italic tracking-tight">{currentUser.name} {currentUser.lastName}</h1>
              <p className="text-gray-400 text-sm font-medium mt-1">{currentUser.email}</p>
            </div>
          </div>

          <button 
            onClick={onLogout}
            className="self-start md:self-auto px-6 py-3.5 bg-white/5 hover:bg-red-600/20 hover:text-red-400 hover:border-red-600/30 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2.5 transition-all active:scale-95"
          >
            <LogOut className="w-4 h-4" /> Scollegati
          </button>
        </div>
      </div>

      {/* Live Sync Banner for Chef Approval / Onboarding */}
      {(currentUser.role === 'chef' && !matchingChef) && (
        <div className={`p-5 rounded-3xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left ${
          matchingApplication?.status === 'rejected'
            ? 'bg-red-50 border-red-200 text-red-900'
            : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}>
          <div className="flex items-start gap-3">
            {matchingApplication?.status === 'rejected' ? (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            ) : (
              <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-black text-xs uppercase tracking-wider">
                {matchingApplication?.status === 'rejected'
                  ? 'Candidatura Cuoco da Completare / Respinta'
                  : 'Profilo Cuoco in Attesa di Approvazione Admin'}
              </p>
              <p className="text-xs font-medium mt-0.5">
                {matchingApplication?.adminNotes
                  ? `Note Admin: ${matchingApplication.adminNotes}`
                  : 'Il tuo account è già sincronizzato nell\'Area Admin. Non appena l\'Amministratore attiverà il tuo profilo, comparirai nel catalogo pubblico MESA.'}
              </p>
            </div>
          </div>
          {onOpenOnboarding && (
            <button
              type="button"
              onClick={onOpenOnboarding}
              className="px-4 py-2.5 bg-black hover:bg-orange-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-wider shrink-0 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{matchingApplication ? 'Completa / Aggiorna Candidatura' : 'Compila Candidatura & HACCP'}</span>
            </button>
          )}
        </div>
      )}

      {currentUser.role === 'client' && onOpenOnboarding && (
        <div className={`p-5 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left ${
          matchingApplication
            ? 'bg-orange-50 border-orange-200 text-orange-950'
            : 'bg-gray-50 border-gray-200 text-gray-900'
        }`}>
          <div className="flex items-start gap-3">
            <ChefHat className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-black text-xs uppercase tracking-wider">
                {matchingApplication
                  ? `Candidatura Diventa Chef (${matchingApplication.id}): ${
                      matchingApplication.status === 'approved'
                        ? 'Approvata'
                        : matchingApplication.status === 'rejected'
                          ? 'Respinta'
                          : 'In attesa di verifica Admin'
                    }`
                  : 'Vuoi cucinare su MESA?'}
              </p>
              <p className="text-xs text-gray-600 font-medium mt-0.5">
                {matchingApplication
                  ? 'La tua richiesta è sincronizzata in tempo reale con l\'Area Amministratore.'
                  : 'Invia la tua candidatura da Chef MESA con documenti HACCP e il tuo primo piatto.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenOnboarding}
            className="px-4 py-2.5 bg-orange-600 hover:bg-black text-black hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-wider shrink-0 transition-colors"
          >
            {matchingApplication ? 'Apri Modulo Chef' : 'Diventa Chef MESA'}
          </button>
        </div>
      )}

      {feedbackMsg && (
        <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between gap-3 ${
          feedbackMsg.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <span>{feedbackMsg.text}</span>
          <button type="button" onClick={() => setFeedbackMsg(null)} className="text-[10px] font-black uppercase underline">
            Chiudi
          </button>
        </div>
      )}

      {/* Tabs di Navigazione Area Personale */}
      <div className="flex border-b border-gray-100 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('profile')}
          className={`py-4 px-6 text-xs font-black uppercase tracking-widest flex items-center gap-2 border-b-4 transition-colors shrink-0 ${
            activeTab === 'profile' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <User className="w-4 h-4" /> Info Personali
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`py-4 px-6 text-xs font-black uppercase tracking-widest flex items-center gap-2 border-b-4 transition-colors shrink-0 relative ${
            activeTab === 'addresses' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <MapPin className="w-4 h-4" /> Indirizzi Verificati
          {currentUser.addresses.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-[9px] bg-orange-100 text-orange-700 rounded-full">
              {currentUser.addresses.length}
            </span>
          )}
        </button>

        {currentUser.role === 'client' && (
          <>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 px-6 text-xs font-black uppercase tracking-widest flex items-center gap-2 border-b-4 transition-colors shrink-0 ${
                activeTab === 'orders' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <ClipboardList className="w-4 h-4" /> Storia Ordini
            </button>
            <button
              onClick={() => setActiveTab('client-payments')}
              className={`py-4 px-6 text-xs font-black uppercase tracking-widest flex items-center gap-2 border-b-4 transition-colors shrink-0 ${
                activeTab === 'client-payments' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <Globe className="w-4 h-4" /> Metodi di Pagamento
            </button>
          </>
        )}

        {currentUser.role === 'chef' && (
          <>
            <button
              onClick={() => setActiveTab('kitchen')}
              className={`py-4 px-6 text-xs font-black uppercase tracking-widest flex items-center gap-2 border-b-4 transition-colors shrink-0 ${
                activeTab === 'kitchen' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <ChefHat className="w-4 h-4" /> La Mia Cucina
            </button>
            <button
              onClick={() => setActiveTab('chef-orders')}
              className={`py-4 px-6 text-xs font-black uppercase tracking-widest flex items-center gap-2 border-b-4 transition-colors shrink-0 ${
                activeTab === 'chef-orders' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <ClipboardList className="w-4 h-4" /> Gestione Ordini
              {pendingChefOrdersCount > 0 && (
                <span className="ml-1 px-2 py-0.5 text-[10px] bg-red-600 text-white rounded-full font-black animate-pulse">
                  {pendingChefOrdersCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('chef-menu')}
              className={`py-4 px-6 text-xs font-black uppercase tracking-widest flex items-center gap-2 border-b-4 transition-colors shrink-0 ${
                activeTab === 'chef-menu' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <ClipboardList className="w-4 h-4" /> Il Mio Menu
            </button>
            <button
              onClick={() => setActiveTab('chef-wallet')}
              className={`py-4 px-6 text-xs font-black uppercase tracking-widest flex items-center gap-2 border-b-4 transition-colors shrink-0 ${
                activeTab === 'chef-wallet' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <User className="w-4 h-4" /> Guadagni & Wallet
            </button>
          </>
        )}
      </div>

      {/* Contenuti dei Tab */}
      <div className="bg-white rounded-[2.5rem] p-6 md:p-10 border border-gray-100 shadow-sm min-h-[400px]">
        
        {/* TAB 1: INFO PERSONALI */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-8 animate-fade-in text-left">
            <div>
              <h3 className="text-xl sm:text-2xl font-black italic tracking-tight mb-2 text-orange-600">Modifica Profilo e Credenziali</h3>
              <p className="text-black text-sm leading-relaxed">Ottimizza le tue informazioni di anagrafica personali, la foto profilo e le credenziali di accesso. Modifica i dettagli e salva per aggiornarli su tutta la piattaforma.</p>
            </div>

            <ImagePickerBox
              variant="avatar"
              value={profileAvatar}
              onChange={setProfileAvatar}
              label="Foto Profilo"
              helperText="Carica una foto dal tuo dispositivo oppure incolla un link URL."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Nome</label>
                <input 
                  type="text" 
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full p-4 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-gray-50 text-sm font-bold"
                  placeholder="Nome..."
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Cognome</label>
                <input 
                  type="text" 
                  value={profileLastName}
                  onChange={(e) => setProfileLastName(e.target.value)}
                  className="w-full p-4 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-gray-50 text-sm font-bold"
                  placeholder="Cognome..."
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Email di Accesso (Unica)</label>
                <input 
                  type="email" 
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full p-4 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-gray-50 text-sm font-bold"
                  placeholder="Email..."
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Password di Accesso (Unica)</label>
                <input 
                  type="text" 
                  value={profilePassword}
                  onChange={(e) => setProfilePassword(e.target.value)}
                  className="w-full p-4 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-gray-50 text-sm font-bold"
                  placeholder="Password..."
                  required
                />
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-100 p-6 rounded-3xl flex items-center gap-4">
              <ShieldCheck className="w-5 h-5 text-orange-600 shrink-0" />
              <div>
                <p className="text-xs font-black text-orange-850 uppercase tracking-widest mb-0.5">Stato & Sicurezza</p>
                <p className="text-[11px] text-gray-600 font-bold">Queste credenziali sono riservate ed uniche. Se sei anche un Cuoco Partner MESA, aggiornando qui si sincronizzeranno istantaneamente nell'accesso del tuo pannello partner.</p>
              </div>
            </div>

            <button 
              type="submit" 
              className="px-8 py-4 bg-black text-white hover:bg-orange-600 font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl transition-all active:scale-95 flex items-center gap-2"
            >
              <Check className="w-4 h-4" strokeWidth={3} /> Salva Dati Profilo
            </button>
          </form>
        )}

        {/* TAB 2: GESTIONE INDIRIZZI VERIFICATI */}
        {activeTab === 'addresses' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-black italic tracking-tight mb-2 text-orange-600">I Miei Indirizzi</h3>
                <p className="text-black text-sm leading-relaxed">
                  {currentUser.role === 'chef' 
                    ? 'Indica l\'indirizzo della cucina di casa in cui prepari i tuoi capolavori.' 
                    : 'Aggiungi o rimuovi gli indirizzi per la consegna a domicilio dei tuoi ordini casalinghi.'}
                </p>
              </div>
              <div className="bg-orange-50 border border-orange-100 text-orange-800 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest self-start md:self-auto flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-orange-600" />
                Tutti gli indirizzi richiedono convalida dell'Admin
              </div>
            </div>

            {/* List of Addresses */}
            {currentUser.addresses.length === 0 ? (
              <div className="py-12 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="font-bold text-gray-400 text-sm">Nessun indirizzo registrato al momento.</p>
                <p className="text-xs text-gray-500 mt-1">Aggiungine uno qui sotto per abilitare gli ordini su MESA.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {currentUser.addresses.map((address) => (
                  <div key={address.id} className="bg-white border border-gray-100 hover:border-orange-500/20 rounded-3xl p-6 shadow-sm relative group transition-all">
                    
                    <button 
                      onClick={() => handleDeleteAddress(address.id)}
                      className="absolute top-6 right-6 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                      title="Elimina Indirizzo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-start gap-4 pr-8">
                      <div className={`p-3 rounded-2xl ${address.isVerified ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700 animate-pulse'}`}>
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-black text-gray-950 text-base">{address.street}</p>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{address.city}, {address.zip}</p>
                        
                        {address.isVerified ? (
                          <div className="inline-flex items-center gap-1.5 mt-4 text-[10px] font-black text-green-700 uppercase tracking-widest bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Indirizzo Verificato
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 mt-4 text-[10px] font-black text-amber-700 uppercase tracking-widest bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                            <ShieldAlert className="w-3.5 h-3.5" />
                            In attesa di convalida Admin
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Address Form */}
            <div className="border-t border-gray-100 pt-8">
              <h4 className="text-lg font-black italic mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-orange-600" /> Aggiungi Nuovo Indirizzo
              </h4>

              <form onSubmit={handleAddAddress} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Via e Numero Civico</label>
                    <input 
                      type="text" 
                      placeholder="es. Via dei Prati, 12"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full p-4 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-gray-50 text-sm font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">CAP</label>
                    <input 
                      type="text" 
                      placeholder="es. 33170"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      className="w-full p-4 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-gray-50 text-sm font-bold"
                      maxLength={5}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Città</label>
                  <input 
                    type="text" 
                    placeholder="es. Pordenone (PN)"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-4 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-gray-50 text-sm font-bold"
                    required
                  />
                </div>

                {addressError && (
                  <p className="text-red-500 text-xs font-bold uppercase tracking-widest">{addressError}</p>
                )}

                <button 
                  type="submit" 
                  className="px-8 py-4.5 bg-black text-white hover:bg-orange-600 font-black uppercase tracking-widest text-xs rounded-2xl shadow-lg transition-all active:scale-95 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Registra Indirizzo per Verifica
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: STORIA ORDINI (FOR CLIENTS) */}
        {activeTab === 'orders' && currentUser.role === 'client' && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl sm:text-2xl font-black italic tracking-tight mb-2 text-orange-600">Storia dei tuoi Ordini</h3>
            <p className="text-black text-sm mb-6 leading-relaxed">Ecco gli ordini che hai prenotato dai nostri cuochi locali MESA.</p>
            
            {userOrders.length === 0 ? (
              <div className="py-12 bg-gray-50 rounded-3xl text-center border-2 border-dashed border-gray-200">
                <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="font-bold text-gray-400 text-sm">Non hai ancora effettuato ordini.</p>
                <p className="text-xs text-gray-500 mt-1">Esplora la Home e scopri i piatti speciali preparati oggi.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userOrders.map((order) => (
                  <div 
                    key={order.id} 
                    onClick={() => {
                      onSelectOrder(order);
                      onNavigate(ViewState.ORDERS);
                    }}
                    className="p-6 bg-white border border-gray-100 hover:border-orange-500/20 rounded-[2rem] shadow-sm hover:shadow-md transition-all cursor-pointer flex justify-between items-center group"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Codice: #{order.id}</span>
                        <span className="text-xs font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">{order.deliveryMode === 'delivery' ? 'Consegna' : 'Ritiro'}</span>
                      </div>
                      <h4 className="font-bold text-xl text-gray-900 mt-1 group-hover:text-orange-600 transition-colors uppercase italic">{order.chefName}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{order.items.length} piatti ordinati • € {order.total.toFixed(2)}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] text-gray-400 font-bold">Stato Attuale</p>
                        <p className="text-xs font-black text-gray-900 tracking-wider uppercase">{ORDER_STATUS_LABELS[order.status] || order.status}</p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        order.status === 'COMPLETED' || order.status === 'CONFIRMED' || order.status === 'PLACED'
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : order.status === 'REJECTED'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : order.status === 'PENDING_CONFIRMATION'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-orange-50 text-orange-700 border-orange-200 animate-pulse'
                      }`}>
                        {ORDER_STATUS_LABELS[order.status] || order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB CLIENT PAYMENTS */}
        {activeTab === 'client-payments' && currentUser.role === 'client' && (
          <div className="space-y-6 animate-fade-in relative text-left">
            <h3 className="text-xl sm:text-2xl font-black italic tracking-tight mb-2 text-orange-600">Metodi di Pagamento</h3>
            <p className="text-black text-sm mb-6 leading-relaxed">Gestisci le tue carte e metodi di pagamento per ordini veloci.</p>
            
            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                 <div className="w-16 h-12 bg-white rounded-xl border border-gray-200 shadow-sm flex items-center justify-center font-bold text-gray-800 text-sm">
                    VISA
                 </div>
                 <div>
                    <h4 className="font-bold text-gray-900">•••• •••• •••• 4242</h4>
                    <p className="text-xs text-gray-500">Scadenza: 12/28</p>
                 </div>
              </div>
              <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-red-500 hover:text-red-500 transition-colors">
                 Rimuovi
              </button>
            </div>

            <div className="border-t border-gray-100 pt-8 mt-4">
              <button className="px-6 py-4 bg-black text-white hover:bg-orange-600 font-black uppercase tracking-widest text-xs rounded-2xl shadow-lg transition-all flex items-center gap-2">
                <Plus className="w-4 h-4" /> Aggiungi Nuova Carta
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: KITCHEN MANAGE (FOR CHEFS) */}
        {activeTab === 'kitchen' && currentUser.role === 'chef' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h3 className="text-xl sm:text-2xl font-black italic tracking-tight mb-2 text-orange-600">Pannello Direzionale Cuoco</h3>
              <p className="text-black text-sm leading-relaxed">Gestisci le informazioni sul tuo profilo pubblico di Chef partner MESA, visualizza recensioni o modifica le tue impostazioni casalinghe.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6">
              <div className="p-6 bg-green-50 rounded-3xl border border-green-100 flex items-center gap-4">
                <div className="p-3 bg-green-100 text-green-700 rounded-2xl">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-green-700 font-black uppercase tracking-widest">HACCP Certificato</p>
                  <p className="font-bold text-gray-900">Documento Verificato</p>
                </div>
              </div>

              <div className="p-6 bg-orange-50 rounded-3xl border border-orange-100 flex items-center gap-4">
                <div className="p-3 bg-orange-100 text-orange-700 rounded-2xl">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-orange-700 font-black uppercase tracking-widest">Vetrina Condivisa</p>
                  <p className="font-bold text-gray-900">Vetrina Pubblica Attiva</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveChefSettings} className="space-y-6 border-t border-gray-100 pt-8 text-left">
              <h4 className="text-sm font-black text-gray-800 uppercase tracking-wider mb-2 italic">1. Dati Pubblici dello Chef</h4>
              <ImagePickerBox
                variant="avatar"
                value={chefAvatar}
                onChange={setChefAvatar}
                fallbackImage={matchingChef?.avatar}
                label="Foto Profilo Pubblica dello Chef"
                helperText="Questa foto appare sulla tua scheda cuoco nel catalogo pubblico MESA."
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Nome d'Arte o Nome Cuoco</label>
                  <input 
                    type="text" 
                    value={chefName}
                    onChange={(e) => {
                      const val = e.target.value;
                      const capitalized = val.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                      setChefName(capitalized);
                    }}
                    className="w-full p-4 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-gray-50 text-sm font-bold"
                    placeholder="es. Nonna Maria"
                    required
                  />
                  {chefName && currentUser.name && !chefName.toLowerCase().includes(currentUser.name.trim().toLowerCase()) && (
                    <div className="mt-2.5 p-3.5 bg-amber-50 rounded-2xl border border-amber-100 text-amber-800 text-[11px] font-medium leading-relaxed">
                      <div className="flex gap-2 items-start">
                        <span className="text-sm">⚠️</span>
                        <div>
                          <p className="font-extrabold text-amber-900 mb-0.5">Controllo Coerenza Nome</p>
                          <p className="text-amber-800 font-semibold mb-1">Il nome pubblico di presentazione ("{chefName}") non corrisponde al tuo nome utente di accesso ("{currentUser.name}").</p>
                          <button 
                            type="button"
                            onClick={() => setChefName(currentUser.name)}
                            className="mt-1 px-3 py-1 bg-amber-600 text-white font-extrabold rounded-lg text-[10px] uppercase tracking-wider hover:bg-black transition-colors"
                          >
                            Allinea e Correggi Ora
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Bandiera</label>
                    <div className="flex items-center gap-2 p-3 border border-gray-100 rounded-2xl bg-gray-50 focus-within:ring-2 focus-within:ring-orange-500">
                      <CountryFlag flag={chefNationality} title={chefCountryName} size="sm" />
                      <input 
                        type="text" 
                        value={chefNationality}
                        onChange={(e) => setChefNationality(e.target.value)}
                        className="w-full bg-transparent outline-none text-sm font-bold text-center"
                        placeholder="es. 🇮🇹"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Paese di Origine</label>
                    <input 
                      type="text" 
                      value={chefCountryName}
                      onChange={(e) => setChefCountryName(e.target.value)}
                      className="w-full p-4 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-gray-50 text-sm font-bold"
                      placeholder="es. Italia"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Numero Contatto Telefonico (WhatsApp)</label>
                  <input 
                    type="text" 
                    value={chefPhone}
                    onChange={(e) => setChefPhone(e.target.value)}
                    className="w-full p-4 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-gray-50 text-sm font-bold font-mono"
                    placeholder="es. +393475552026"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Sede Cucina — Provincia di Pordenone (PN)
                    </label>
                    <span className="text-[9px] font-black uppercase bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">
                      Solo PN
                    </span>
                  </div>
                  <select
                    value={findPordenoneComune(chefLocation)?.name || ''}
                    onChange={(e) => {
                      const chosen = PORDENONE_COMUNI.find(c => c.name === e.target.value);
                      if (chosen) {
                        setChefLocation(`${chosen.name} (PN), Centro`);
                      }
                    }}
                    className="w-full p-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none bg-gray-50 text-xs font-bold text-gray-900"
                  >
                    <option value="">-- Seleziona Comune (Provincia di Pordenone) --</option>
                    {PORDENONE_COMUNI.map(c => (
                      <option key={c.name} value={c.name}>
                        {c.name} (PN) • CAP {c.zip}
                      </option>
                    ))}
                  </select>
                  <input 
                    type="text" 
                    value={chefLocation}
                    onChange={(e) => setChefLocation(e.target.value)}
                    className="w-full p-4 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-gray-50 text-sm font-bold"
                    placeholder="es. Pordenone (PN), Centro"
                    required
                  />
                </div>
              </div>

              <h4 className="text-sm font-black text-gray-800 uppercase tracking-wider mt-6 mb-2 italic">2. Credenziali di Accesso e Sicurezza</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Email di Accesso (Unica)</label>
                  <input 
                    type="email" 
                    value={chefEmail}
                    onChange={(e) => setChefEmail(e.target.value)}
                    className="w-full p-4 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-gray-50 text-sm font-bold"
                    placeholder="Email..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Password di Accesso (Unica)</label>
                  <input 
                    type="text" 
                    value={chefPassword}
                    onChange={(e) => setChefPassword(e.target.value)}
                    className="w-full p-4 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-gray-50 text-sm font-bold"
                    placeholder="Password..."
                    required
                  />
                </div>
              </div>

              <h4 className="text-sm font-black text-gray-800 uppercase tracking-wider mt-6 mb-2 italic">3. Informazioni Culinarie</h4>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Specialità Culinarie (separate da virgola)</label>
                  <input 
                    type="text" 
                    value={chefSpecialties}
                    onChange={(e) => setChefSpecialties(e.target.value)}
                    className="w-full p-4 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-gray-50 text-sm font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Bio dello Chef (storia della tua cucina)</label>
                  <textarea 
                    value={chefBio}
                    onChange={(e) => setChefBio(e.target.value)}
                    rows={4}
                    className="w-full p-4 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-gray-50 text-sm font-bold resize-none"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="haccp" 
                  checked={haccpStatus}
                  onChange={(e) => setHaccpStatus(e.target.checked)}
                  className="w-5 h-5 accent-orange-600 rounded cursor-pointer"
                />
                <label htmlFor="haccp" className="text-xs uppercase font-black text-gray-600 cursor-pointer select-none">Consenti disponibilità sul mercato per oggi</label>
              </div>

              <button 
                type="submit" 
                className="px-8 py-4.5 bg-black text-white hover:bg-orange-600 font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl transition-all active:scale-95 flex items-center gap-2"
              >
                <Check className="w-4 h-4" strokeWidth={3} /> Salva Configurazione Cucina
              </button>
            </form>

            {/* Sezione Esempi di Cuochi (Spunti per Registrazione) */}
            <div className="border-t border-gray-100 pt-10 mt-10">
              <div className="flex items-center gap-3 mb-4 justify-start">
                <ChefHat className="w-6 h-6 text-orange-600" />
                <h4 className="text-xl font-black italic tracking-tight">Modelli di Spunto per la Registrazione</h4>
              </div>
              <p className="text-xs font-medium text-gray-500 mb-6 leading-relaxed text-left">
                Usa i profili dei cuochi esperti di MESA come ispirazione ("spunto"). Puoi copiare direttamente i loro dettagli o caricarli come base per completare rapidamente la tua registrazione o configurare la tua cucina.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                {chefs.filter(c => c.id !== matchingChef?.id).map(sampleChef => {
                  const samplePhone = sampleChef.phone || defaultNumbers[sampleChef.id] || '+393475552026';
                  return (
                    <div key={sampleChef.id} className="bg-gray-50 border border-gray-100/55 rounded-2xl p-5 flex flex-col justify-between hover:border-orange-500/10 transition-all text-left">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <CountryFlag flag={sampleChef.nationality} title={sampleChef.countryName} size="sm" />
                          <p className="text-xs font-black text-gray-900">{sampleChef.name}</p>
                          <span className="text-[9px] text-gray-400 capitalize ml-auto font-black">{sampleChef.continent}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 line-clamp-2 italic mb-3">"{sampleChef.bio}"</p>
                        <div className="space-y-1 text-[10px] text-gray-400 font-bold">
                          <p><strong>Specialità:</strong> {sampleChef.specialties.join(', ')}</p>
                          <p><strong>Indirizzo:</strong> {sampleChef.location}</p>
                          <p><strong>Telefono:</strong> {samplePhone}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100/30">
                        <button
                          type="button"
                          onClick={() => {
                            setChefSpecialties(sampleChef.specialties.join(', '));
                            setChefBio(sampleChef.bio);
                            setChefLocation(sampleChef.location);
                            setChefPhone(samplePhone);
                            setFeedbackMsg({ type: 'success', text: 'Modello di spunto caricato! Modifica i campi e salva la configurazione.' });
                          }}
                          className="px-3 py-1.5 bg-black text-white hover:text-black hover:bg-orange-600 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-1"
                        >
                          Carica Base
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const templateText = `Nome d'Arte: ${sampleChef.name}\nSpecialità: ${sampleChef.specialties.join(', ')}\nBio: ${sampleChef.bio}\nIndirizzo: ${sampleChef.location}\nTelefono: ${samplePhone}`;
                            navigator.clipboard?.writeText(templateText).catch(() => {});
                            setFeedbackMsg({ type: 'success', text: `Dati modello di ${sampleChef.name} copiati negli appunti.` });
                          }}
                          className="px-3 py-1.5 bg-white text-gray-600 border border-gray-150 text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-gray-50 transition-all"
                        >
                          Copia Spunto
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CHEF ORDERS */}
        {activeTab === 'chef-orders' && currentUser.role === 'chef' && (
          <div className="space-y-6 animate-fade-in relative text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xl sm:text-2xl font-black italic tracking-tight text-orange-600">
                  Ordini in Arrivo {matchingChef ? `— ${matchingChef.name}` : ''}
                </h3>
                <p className="text-black text-sm mt-1 leading-relaxed">
                  Conferma o rifiuta le prenotazioni ricevute in tempo reale. Lo stato si aggiorna subito anche per il cliente e nell'Area Admin.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {onToggleSoundAlerts && (
                  <button
                    type="button"
                    onClick={onToggleSoundAlerts}
                    className={`px-3.5 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all ${
                      soundAlertsEnabled
                        ? 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100'
                        : 'bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-200'
                    }`}
                    title="Attiva o disattiva il segnale acustico per i nuovi ordini"
                  >
                    {soundAlertsEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                    <span>{soundAlertsEnabled ? 'Suono Attivo' : 'Suono Disattivo'}</span>
                  </button>
                )}
                <span className="px-3.5 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-black uppercase tracking-widest">
                  In attesa: {pendingChefOrdersCount}
                </span>
                <span className="px-3.5 py-2 rounded-2xl bg-gray-100 border border-gray-200 text-gray-800 text-[10px] font-black uppercase tracking-widest">
                  Totali: {chefOrders.length}
                </span>
              </div>
            </div>

            {chefOrders.length === 0 ? (
              <div className="py-12 bg-gray-50 rounded-3xl text-center border-2 border-dashed border-gray-200">
                <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="font-bold text-gray-400 text-sm">Nessun ordine ricevuto al momento.</p>
                <p className="text-xs text-gray-500 mt-1">Quando un cliente prenota un tuo piatto apparirà qui in tempo reale.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {chefOrders.map((order) => {
                  const firstItem = order.items[0];
                  const statusLabel = ORDER_STATUS_LABELS[order.status] || order.status;
                  const isBusy = updatingOrderId === order.id;
                  const isConfirmed = order.status === 'CONFIRMED' || order.status === 'PLACED';

                  return (
                    <div
                      key={order.id}
                      className={`p-6 bg-white border-2 rounded-[2rem] shadow-sm transition-all space-y-4 ${
                        order.status === 'PENDING_CONFIRMATION'
                          ? 'border-amber-300 bg-amber-50/20'
                          : order.status === 'REJECTED'
                            ? 'border-red-200 bg-red-50/15'
                            : isConfirmed || order.status === 'COMPLETED'
                              ? 'border-green-200'
                              : 'border-gray-100'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest font-mono">
                              #{order.id.split('-')[0]}
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-orange-50 text-orange-700 border border-orange-200">
                              {order.deliveryMode === 'delivery' ? 'Consegna a domicilio' : 'Ritiro in sede'}
                            </span>
                            {order.customerName && (
                              <span className="text-[10px] font-bold text-gray-700">
                                Cliente: <strong>{order.customerName}</strong>
                              </span>
                            )}
                          </div>

                          <div className="space-y-1 pt-1">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="text-sm font-black text-gray-900">
                                {item.name} <span className="text-orange-600">x{item.quantity}</span>
                                <span className="text-xs font-mono text-gray-500 ml-2">€ {(item.price * item.quantity).toFixed(2)}</span>
                                {item.preferences?.notes && (
                                  <p className="text-xs font-medium text-black/75 mt-0.5">Note: "{item.preferences.notes}"</p>
                                )}
                              </div>
                            ))}
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-black pt-1">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-orange-600" />
                              {firstItem?.scheduledDate ? `${firstItem.scheduledDate} ore ${firstItem.scheduledTime}` : order.estimatedTime}
                            </span>
                            <span className="font-mono font-black text-orange-600">
                              Totale: € {order.total.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-start sm:items-end gap-3 shrink-0">
                          <span className={`px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                            order.status === 'PENDING_CONFIRMATION'
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : isConfirmed || order.status === 'COMPLETED'
                                ? 'bg-green-100 text-green-800 border-green-300'
                                : order.status === 'REJECTED'
                                  ? 'bg-red-100 text-red-800 border-red-300'
                                  : 'bg-orange-100 text-orange-800 border-orange-300'
                          }`}>
                            {statusLabel}
                          </span>

                          {order.status === 'PENDING_CONFIRMATION' && onUpdateOrderStatus && (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() => handleChefStatusChange(order.id, 'CONFIRMED')}
                                className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-md transition-all active:scale-95 disabled:opacity-50"
                              >
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                <span>Conferma</span>
                              </button>
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() => handleChefStatusChange(order.id, 'REJECTED')}
                                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-md transition-all active:scale-95 disabled:opacity-50"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Rifiuta</span>
                              </button>
                            </div>
                          )}

                          {isConfirmed && onUpdateOrderStatus && (
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleChefStatusChange(order.id, 'PREPARING')}
                              className="px-4 py-2 bg-orange-600 hover:bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                            >
                              Passa In Cucina
                            </button>
                          )}

                          {order.status === 'PREPARING' && onUpdateOrderStatus && (
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleChefStatusChange(order.id, 'READY')}
                              className="px-4 py-2 bg-orange-600 hover:bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                            >
                              Segna Pronto
                            </button>
                          )}

                          {order.status === 'READY' && onUpdateOrderStatus && (
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleChefStatusChange(order.id, order.deliveryMode === 'delivery' ? 'DELIVERING' : 'COMPLETED')}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                            >
                              {order.deliveryMode === 'delivery' ? 'Avvia Consegna' : 'Segna Completato'}
                            </button>
                          )}

                          {order.status === 'DELIVERING' && onUpdateOrderStatus && (
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleChefStatusChange(order.id, 'COMPLETED')}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                            >
                              Segna Consegnato
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              onSelectOrder(order);
                              onNavigate(ViewState.ORDERS);
                            }}
                            className="px-3.5 py-1.5 bg-gray-100 hover:bg-black hover:text-white text-gray-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                          >
                            Apri Timeline & Chat
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: CHEF MENU */}
        {activeTab === 'chef-menu' && currentUser.role === 'chef' && (
          <div className="space-y-6 animate-fade-in relative text-left">
            {!matchingChef ? (
              <div className="py-12 bg-gray-50 rounded-3xl text-center border-2 border-dashed border-gray-200 px-6">
                <ChefHat className="w-12 h-12 text-orange-400 mx-auto mb-3" />
                <p className="font-bold text-gray-700 text-sm">Il menu sarà modificabile non appena l'Admin approverà la tua candidatura cuoco.</p>
                <p className="text-xs text-gray-500 mt-1">Puoi già aggiornare la tua candidatura e le foto dal banner qui sopra.</p>
              </div>
            ) : (
              <AdminDishesPanel
                chefs={[matchingChef]}
                singleChefMode
                chefFilter={matchingChef.id}
                onChefFilterChange={() => {}}
                onSaveChefDishes={async (chefId, dishes) => {
                  if (onSaveChefDishes) {
                    return await onSaveChefDishes(chefId, dishes);
                  }
                  if (onUpdateChef) {
                    const res = await onUpdateChef({ ...matchingChef, dishes });
                    return res !== false;
                  }
                  return false;
                }}
                title="Il Mio Menu"
                subtitle="Tocca qualsiasi piatto per cambiarne foto, nome, descrizione, ingredienti e prezzo in tempo reale."
              />
            )}
          </div>
        )}

        {/* TAB 7: CHEF WALLET */}
        {activeTab === 'chef-wallet' && currentUser.role === 'chef' && (
          <div className="space-y-6 animate-fade-in relative text-left">
            <h3 className="text-2xl font-black italic tracking-tight mb-2">Guadagni e Statistiche</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               <div className="p-6 bg-gradient-to-br from-gray-900 to-black text-white rounded-[2rem] border border-gray-800">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Saldo Corrente</p>
                  <p className="text-3xl font-black">€ {userOrders.reduce((acc, o) => acc + (o.status === 'COMPLETED' ? o.total : 0), 0).toFixed(2)}</p>
               </div>
               <div className="p-6 bg-orange-50 rounded-[2rem] border border-orange-100 text-orange-900">
                  <p className="text-[10px] text-orange-600/80 font-black uppercase tracking-widest mb-1">Ordini Completati</p>
                  <p className="text-3xl font-black">{userOrders.filter(o => o.status === 'COMPLETED').length}</p>
               </div>
               <div className="p-6 bg-green-50 rounded-[2rem] border border-green-100 text-green-900">
                  <p className="text-[10px] text-green-600/80 font-black uppercase tracking-widest mb-1">Totale Incassato (All-time)</p>
                  <p className="text-3xl font-black">€ {(userOrders.reduce((acc, o) => acc + o.total, 0) + 124.50).toFixed(2)}</p>
               </div>
            </div>
            
            <div className="mt-8 bg-gray-50 border border-gray-100 rounded-3xl p-6 text-center">
              <ShieldCheck className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-gray-900">Il tuo conto è verificato.</p>
              <p className="text-xs text-gray-500 mt-1">I bonifici vengono emessi ogni lunedì automaticamente sul tuo IBAN IT99...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
