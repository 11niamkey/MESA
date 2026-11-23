import React, { useState } from 'react';
import { 
  User, MapPin, ShieldCheck, ShieldAlert, Trash2, 
  Plus, LogOut, ChefHat, Calendar, ClipboardList, 
  Clock, CheckCircle, Smartphone, Mail, Globe, Check 
} from 'lucide-react';
import { AppUser, UserAddress, Order, ViewState, Chef } from '../types';

interface PersonalAreaProps {
  currentUser: AppUser;
  onLogout: () => void;
  onUpdateUser: (updatedUser: AppUser) => void;
  orders: Order[];
  onNavigate: (view: ViewState) => void;
  onSelectOrder: (order: Order) => void;
  chefs: Chef[];
  onUpdateChef?: (updatedChef: Chef) => void;
  registeredUsers?: AppUser[];
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
  registeredUsers = []
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders' | 'kitchen' | 'chef-orders' | 'chef-menu' | 'chef-wallet' | 'client-payments'>('profile');
  
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

  // Chef-specific settings state (loaded if user is a chef)
  const matchingChef = chefs.find(c => {
    const chefEmailMatch = c.email && currentUser.email && c.email.toLowerCase().trim() === currentUser.email.toLowerCase().trim();
    const chefIdMatch = c.id === `chef-${currentUser.id}` || c.id === currentUser.id;
    const fullNameString = `${currentUser.name} ${currentUser.lastName}`.trim().toLowerCase();
    const chefNameMatch = c.name.trim().toLowerCase() === fullNameString ||
                          c.name.trim().toLowerCase() === currentUser.name.trim().toLowerCase();
    return chefEmailMatch || chefIdMatch || chefNameMatch;
  });
  
  const [chefName, setChefName] = useState(matchingChef?.name || `${currentUser.name} ${currentUser.lastName}`);
  const [chefNationality, setChefNationality] = useState(matchingChef?.nationality || '🇮🇹');
  const [chefCountryName, setChefCountryName] = useState(matchingChef?.countryName || 'Italia');
  const [chefEmail, setChefEmail] = useState(matchingChef?.email || currentUser.email);
  const [chefPassword, setChefPassword] = useState(matchingChef?.password || currentUser.password || 'demo123');
  const [chefSpecialties, setChefSpecialties] = useState(matchingChef?.specialties.join(', ') || 'Cucina Tradizionale');
  const [chefBio, setChefBio] = useState(matchingChef?.bio || 'Passione per la cucina casalinga preparata con ingredienti freschi.');
  
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

  const [chefPhone, setChefPhone] = useState(matchingChef?.phone || (matchingChef ? defaultNumbers[matchingChef.id] : '') || '+393475552026');
  const [chefLocation, setChefLocation] = useState(matchingChef?.location || 'Milano, Centro');
  const [haccpStatus, setHaccpStatus] = useState(true);

  const userOrders = orders.filter(o => o.chefId === `chef-${currentUser.id}` || o.id.includes(currentUser.id.slice(0, 4)));

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
      alert('Tutti i campi sono obbligatori.');
      return;
    }

    // Email uniqueness check
    const isEmailTaken = registeredUsers.some(
      u => u.id !== currentUser.id && u.email.toLowerCase() === profileEmail.trim().toLowerCase()
    );
    if (isEmailTaken) {
      alert('Questa email è già registrata da un altro utente della piattaforma.');
      return;
    }

    const updatedUser: AppUser = {
      ...currentUser,
      name: profileName.trim(),
      lastName: profileLastName.trim(),
      email: profileEmail.trim().toLowerCase(),
      password: profilePassword.trim()
    };

    onUpdateUser(updatedUser);
    alert('Profilo personale aggiornato con successo!');
  };

  const handleSaveChefSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chefName.trim() || !chefPhone.trim() || !chefLocation.trim() || !chefEmail.trim() || !chefPassword.trim()) {
      alert('I campi principali sono obbligatori.');
      return;
    }

    // Email uniqueness check
    const isEmailTaken = registeredUsers.some(
      u => u.id !== currentUser.id && u.email.toLowerCase() === chefEmail.trim().toLowerCase()
    );
    if (isEmailTaken) {
      alert('Questa email è già registrata da un altro utente della piattaforma.');
      return;
    }

    if (onUpdateChef) {
      const activeChefId = matchingChef?.id || `chef-${currentUser.id}`;
      const nameParts = chefName.trim().split(' ');
      const first = nameParts[0] || currentUser.name;
      const last = nameParts.slice(1).join(' ');

      const updatedUser: AppUser = {
        ...currentUser,
        name: first,
        lastName: last,
        email: chefEmail.trim().toLowerCase(),
        password: chefPassword.trim()
      };
      
      onUpdateUser(updatedUser);

      onUpdateChef({
        id: activeChefId,
        name: chefName.trim(),
        nationality: chefNationality.trim(),
        countryName: chefCountryName.trim(),
        email: chefEmail.trim().toLowerCase(),
        password: chefPassword.trim(),
        continent: matchingChef?.continent || 'Europa',
        avatar: matchingChef?.avatar || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80',
        rating: matchingChef?.rating || 4.8,
        location: chefLocation.trim(),
        phone: chefPhone.trim(),
        specialties: chefSpecialties.split(',').map(s => s.trim()),
        bio: chefBio.trim(),
        availability: matchingChef?.availability || ['19:00 - 22:00'],
        availableDays: matchingChef?.availableDays || [1, 2, 3, 4, 5, 6],
        reviews: matchingChef?.reviews || [],
        dishes: matchingChef?.dishes || [],
        distance: matchingChef?.distance || 1.0
      });
      alert('Tutte le informazioni e le credenziali di accesso sono state salvate e sincronizzate con successo!');
    } else {
      alert('Informazioni della cucina aggiornate con successo!');
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto space-y-10 pb-16">
      
      {/* Profilo Header Card */}
      <div className="bg-black text-white rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden border-b-8 border-orange-600">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-orange-600 text-black rounded-3xl flex items-center justify-center shadow-xl">
              {currentUser.role === 'chef' ? (
                <ChefHat className="w-10 h-10 stroke-2" />
              ) : currentUser.role === 'admin' ? (
                <ShieldCheck className="w-10 h-10 stroke-2" />
              ) : (
                <User className="w-10 h-10 stroke-2" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border ${
                  currentUser.role === 'chef' 
                    ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' 
                    : currentUser.role === 'admin'
                      ? 'bg-red-500/10 text-red-500 border-red-500/20'
                      : 'bg-green-500/10 text-green-500 border-green-500/20'
                }`}>
                  {currentUser.role === 'chef' ? 'Cuoco Partner' : currentUser.role === 'admin' ? 'Amministratore' : 'Cliente Verificato'}
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
              <h3 className="text-2xl font-black italic tracking-tight mb-2">Modifica Profilo e Credenziali</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Ottimizza le tue informazioni di anagrafica personali e le credenziali di accesso. Modifica i dettagli e salva per aggiornarli su tutta la piattaforma.</p>
            </div>

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
                <h3 className="text-2xl font-black italic tracking-tight mb-2">I Miei Indirizzi</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
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
                      placeholder="es. 00185"
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
                    placeholder="es. Roma (RM)"
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
            <h3 className="text-2xl font-black italic tracking-tight mb-2">Storia dei tuoi Ordini</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">Ecco gli ordini che hai prenotato dai nostri cuochi locali MESA.</p>
            
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
                        <p className="text-xs font-black text-gray-900 tracking-wider uppercase">{order.status}</p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        order.status === 'COMPLETED' 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : 'bg-orange-50 text-orange-700 border-orange-200 animate-pulse'
                      }`}>
                        {order.status === 'COMPLETED' ? 'Completato' : 'In Consegna'}
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
            <h3 className="text-2xl font-black italic tracking-tight mb-2">Metodi di Pagamento</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">Gestisci le tue carte e metodi di pagamento per ordini veloci.</p>
            
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
              <h3 className="text-2xl font-black italic tracking-tight mb-2">Pannello Direzionale Cuoco</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Gestisci le informazioni sul tuo profilo pubblico di Chef partner MESA, visualizza recensioni o modifica le tue impostazioni casalinghe.</p>
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
                    <input 
                      type="text" 
                      value={chefNationality}
                      onChange={(e) => setChefNationality(e.target.value)}
                      className="w-full p-4 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-gray-50 text-sm font-bold text-center"
                      placeholder="es. 🇮🇹"
                      required
                    />
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

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Indirizzo Fisico (Città, Zona)</label>
                  <input 
                    type="text" 
                    value={chefLocation}
                    onChange={(e) => setChefLocation(e.target.value)}
                    className="w-full p-4 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-gray-50 text-sm font-bold"
                    placeholder="es. Roma, Trastevere"
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
                          <span className="text-lg">{sampleChef.nationality}</span>
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
                            alert(`Modello di spunto caricato! Adesso modifica i campi indirizzo e telefono qui sopra con i tuoi veri dati e clicca "Salva Configurazione Cucina" per salvare.`);
                          }}
                          className="px-3 py-1.5 bg-black text-white hover:text-black hover:bg-orange-600 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-1"
                        >
                          Carica Base
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const templateText = `Nome d'Arte: ${sampleChef.name}\nSpecialità: ${sampleChef.specialties.join(', ')}\nBio: ${sampleChef.bio}\nIndirizzo: ${sampleChef.location}\nTelefono: ${samplePhone}`;
                            navigator.clipboard.writeText(templateText);
                            alert(`DATI MODELLO COPIATI!\n\nPuoi incollarli dove preferisci per usarli come spunto per la tua registrazione.\n\nNome d'Arte: ${sampleChef.name}\nTelefono: ${samplePhone}\nIndirizzo: ${sampleChef.location}`);
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
            <h3 className="text-2xl font-black italic tracking-tight mb-2">Ordini in Arrivo</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">Gestisci gli ordini dei tuoi clienti in tempo reale.</p>
            {userOrders.length === 0 ? (
               <div className="py-12 bg-gray-50 rounded-3xl text-center border-2 border-dashed border-gray-200">
                <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="font-bold text-gray-400 text-sm">Nessun ordine ricevuto al momento.</p>
              </div>
            ) : (
               <div className="space-y-4">
                {userOrders.map((order) => (
                  <div key={order.id} className="p-6 bg-white border border-gray-100 hover:border-orange-500/20 rounded-[2rem] shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                     <div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">#{order.id}</span>
                        <h4 className="font-bold text-lg text-gray-900 mt-1">{order.items.length} Piatti da preparare</h4>
                        <p className="text-xs text-gray-500">Stimato per: {order.estimatedTime}</p>
                     </div>
                     <div className="flex gap-2">
                         <span className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-xl text-[10px] font-black uppercase border border-orange-100">{order.status}</span>
                     </div>
                  </div>
                ))}
               </div>
            )}
          </div>
        )}

        {/* TAB 6: CHEF MENU (MOCK/VIEW) */}
        {activeTab === 'chef-menu' && currentUser.role === 'chef' && (
          <div className="space-y-6 animate-fade-in relative text-left">
            <h3 className="text-2xl font-black italic tracking-tight mb-2">Il Mio Menu</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">I piatti che stai offrendo attualmente ai tuoi clienti.</p>
            {(!matchingChef || matchingChef.dishes.length === 0) ? (
              <div className="py-12 bg-gray-50 rounded-3xl text-center border-2 border-dashed border-gray-200">
                <Plus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="font-bold text-gray-400 text-sm">Nessun piatto attivo.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {matchingChef.dishes.map((dish) => (
                  <div key={dish.id} className="p-4 bg-white border border-gray-100 rounded-3xl flex flex-col gap-3">
                     <img 
                       src={dish.image || DEFAULT_FOOD_IMAGE} 
                       alt={dish.name} 
                       onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_FOOD_IMAGE; }}
                       className="w-full h-32 object-cover rounded-2xl" 
                     />
                     <h4 className="font-bold text-sm">{dish.name}</h4>
                     <p className="font-black text-orange-600">€ {dish.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
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
