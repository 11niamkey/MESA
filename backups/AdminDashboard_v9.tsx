import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Users, ChefHat, ShoppingBag, 
  TrendingUp, AlertCircle, CheckCircle, 
  Search, ShieldCheck, MapPin, Smartphone, ArrowUpRight, 
  ArrowDownRight, Sparkles, Loader2, RefreshCw, Rocket, Globe, Activity,
  CheckCircle2, AlertTriangle, FileText, PieChart, ExternalLink, Share2, Globe2,
  Trash2, ShieldAlert, Check, Ban, KeyRound, Clock, Eye, X, MessageSquare, UserCheck, AlertOctagon,
  CalendarDays, UtensilsCrossed, Plus, Pencil
} from 'lucide-react';
import { Chef, Dish, Order, OrderStatus, ORDER_STATUS_LABELS, AppUser, ChefApplication, ChefDocument, Continent } from '../types';
import { ShareModal } from './ShareModal';
import { COUNTRY_FLAG_PRESETS, getCountryNameByFlag } from './FilterBar';
import { CountryFlag } from './CountryFlag';

interface AdminDashboardProps {
  chefs: Chef[];
  orders: Order[];
  registeredUsers: AppUser[];
  chefApplications?: ChefApplication[];
  onVerifyAddress: (userId: string, addressId: string, isVerified: boolean) => void;
  onDeleteUser?: (userId: string) => void;
  onUpdateChef?: (updatedChef: Chef) => void;
  onDeleteChef?: (chefId: string, deleteLinkedUser?: boolean) => Promise<void> | void;
  onApproveApplication?: (appId: string) => void;
  onRejectApplication?: (appId: string, notes?: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  chefs, 
  orders, 
  registeredUsers,
  chefApplications = [],
  onVerifyAddress,
  onDeleteUser,
  onUpdateChef,
  onDeleteChef,
  onApproveApplication,
  onRejectApplication
}) => {
  const [adminTab, setAdminTab] = useState<'orders' | 'dishes' | 'applications' | 'users' | 'chefs' | 'cockpit'>('orders');
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'client' | 'chef'>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | OrderStatus>('all');
  const [dishSearch, setDishSearch] = useState('');
  const [dishChefFilter, setDishChefFilter] = useState<string>('all');
  const [editingDishKey, setEditingDishKey] = useState<string | null>(null);
  const [dishFormName, setDishFormName] = useState('');
  const [dishFormDesc, setDishFormDesc] = useState('');
  const [dishFormPrice, setDishFormPrice] = useState('');
  const [dishFormImage, setDishFormImage] = useState('');
  const [dishFormTags, setDishFormTags] = useState('');
  const [dishFormIngredients, setDishFormIngredients] = useState('');
  const [dishFormPreparation, setDishFormPreparation] = useState('');
  const [isAddingNewDish, setIsAddingNewDish] = useState(false);
  const [newDishChefId, setNewDishChefId] = useState('');
  
  // Applications tab states
  const [appStatusFilter, setAppStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [appSearch, setAppSearch] = useState('');
  const [selectedDocPreview, setSelectedDocPreview] = useState<ChefDocument | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState<{ [appId: string]: string }>({});

  const [aiReport, setAiReport] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // States for interactive chef data management
  const [editingChefId, setEditingChefId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editNationality, setEditNationality] = useState('');
  const [editCountryName, setEditCountryName] = useState('');
  const [editContinent, setEditContinent] = useState<Continent>('Europa');
  const [chefSearch, setChefSearch] = useState('');
  const [chefToDelete, setChefToDelete] = useState<Chef | null>(null);
  const [deleteLinkedUser, setDeleteLinkedUser] = useState(false);
  const [isDeletingChef, setIsDeletingChef] = useState(false);

  const findLinkedChefUser = (chef: Chef) =>
    registeredUsers.find(
      u =>
        u.role === 'chef' &&
        (u.id === chef.id.replace('chef-', '') ||
          (chef.email && u.email.trim().toLowerCase() === chef.email.trim().toLowerCase()) ||
          `${u.name} ${u.lastName}`.trim().toLowerCase() === chef.name.trim().toLowerCase())
    );

  const handleConfirmDeleteChef = async () => {
    if (!chefToDelete || !onDeleteChef) return;
    setIsDeletingChef(true);
    try {
      await onDeleteChef(chefToDelete.id, deleteLinkedUser);
      if (editingChefId === chefToDelete.id) {
        setEditingChefId(null);
      }
      setChefToDelete(null);
      setDeleteLinkedUser(false);
    } finally {
      setIsDeletingChef(false);
    }
  };

  const pendingAppsCount = chefApplications.filter(a => a.status === 'pending').length;
  const pendingOrdersCount = orders.filter(o => o.status === 'PENDING_CONFIRMATION').length;
  const confirmedOrdersCount = orders.filter(o => o.status === 'CONFIRMED' || o.status === 'PLACED' || o.status === 'PREPARING' || o.status === 'READY' || o.status === 'DELIVERING' || o.status === 'COMPLETED').length;
  const rejectedOrdersCount = orders.filter(o => o.status === 'REJECTED').length;
  const allDishes = chefs.flatMap(chef => chef.dishes.map(dish => ({ dish, chef })));
  const filteredDishes = allDishes.filter(({ dish, chef }) => {
    const matchesChef = dishChefFilter === 'all' || chef.id === dishChefFilter;
    const q = dishSearch.trim().toLowerCase();
    const matchesQuery =
      !q ||
      dish.name.toLowerCase().includes(q) ||
      dish.description.toLowerCase().includes(q) ||
      chef.name.toLowerCase().includes(q) ||
      dish.tags.some(t => t.toLowerCase().includes(q)) ||
      (dish.ingredients || []).some(i => i.toLowerCase().includes(q));
    return matchesChef && matchesQuery;
  });

  const startEditingDish = (dish: Dish, chefId: string) => {
    setIsAddingNewDish(false);
    setEditingDishKey(`${chefId}::${dish.id}`);
    setDishFormName(dish.name);
    setDishFormDesc(dish.description);
    setDishFormPrice(dish.price.toFixed(2));
    setDishFormImage(dish.image || '');
    setDishFormTags((dish.tags || []).join(', '));
    setDishFormIngredients((dish.ingredients || []).join(', '));
    setDishFormPreparation(dish.preparation || '');
  };

  const handleSaveDishEdit = (chef: Chef, dishId: string) => {
    if (!onUpdateChef || !dishFormName.trim()) return;
    const parsedPrice = parseFloat(dishFormPrice.replace(',', '.'));
    const nextPrice = Number.isFinite(parsedPrice) && parsedPrice > 0 ? parsedPrice : 12;
    const tags = dishFormTags.split(',').map(t => t.trim()).filter(Boolean);
    const ingredients = dishFormIngredients.split(',').map(i => i.trim()).filter(Boolean);

    const updatedDishes = chef.dishes.map(d => {
      if (d.id !== dishId) return d;
      const updated: Dish = {
        ...d,
        name: dishFormName.trim(),
        description: dishFormDesc.trim(),
        price: nextPrice,
        image: dishFormImage.trim() || d.image,
        tags,
        ...(ingredients.length > 0 ? { ingredients } : {}),
        ...(dishFormPreparation.trim() ? { preparation: dishFormPreparation.trim() } : {})
      };
      if (ingredients.length === 0) delete updated.ingredients;
      if (!dishFormPreparation.trim()) delete updated.preparation;
      return updated;
    });

    onUpdateChef({ ...chef, dishes: updatedDishes });
    setEditingDishKey(null);
  };

  const handleDeleteDishFromChef = (chef: Chef, dishId: string) => {
    if (!onUpdateChef) return;
    onUpdateChef({
      ...chef,
      dishes: chef.dishes.filter(d => d.id !== dishId)
    });
    if (editingDishKey === `${chef.id}::${dishId}`) {
      setEditingDishKey(null);
    }
  };

  const handleCreateNewDish = () => {
    if (!onUpdateChef || !dishFormName.trim()) return;
    const targetChef = chefs.find(c => c.id === newDishChefId) || chefs[0];
    if (!targetChef) return;
    const parsedPrice = parseFloat(dishFormPrice.replace(',', '.'));
    const nextPrice = Number.isFinite(parsedPrice) && parsedPrice > 0 ? parsedPrice : 12;
    const tags = dishFormTags.split(',').map(t => t.trim()).filter(Boolean);
    const ingredients = dishFormIngredients.split(',').map(i => i.trim()).filter(Boolean);

    const newDish: Dish = {
      id: `dish-${Date.now().toString(36)}`,
      name: dishFormName.trim(),
      description: dishFormDesc.trim() || 'Piatto preparato al momento con ingredienti freschi.',
      price: nextPrice,
      image: dishFormImage.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      chefId: targetChef.id,
      tags: tags.length > 0 ? tags : ['Tradizionale'],
      ...(ingredients.length > 0 ? { ingredients } : {}),
      ...(dishFormPreparation.trim() ? { preparation: dishFormPreparation.trim() } : {})
    };

    onUpdateChef({
      ...targetChef,
      dishes: [newDish, ...targetChef.dishes]
    });
    setIsAddingNewDish(false);
    setDishFormName('');
    setDishFormDesc('');
    setDishFormPrice('');
    setDishFormImage('');
    setDishFormTags('');
    setDishFormIngredients('');
    setDishFormPreparation('');
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus =
      orderStatusFilter === 'all'
        ? true
        : orderStatusFilter === 'CONFIRMED'
          ? order.status === 'CONFIRMED' || order.status === 'PLACED'
          : order.status === orderStatusFilter;
    const q = orderSearch.trim().toLowerCase();
    const matchesQuery =
      !q ||
      order.id.toLowerCase().includes(q) ||
      order.chefName.toLowerCase().includes(q) ||
      (order.customerName || '').toLowerCase().includes(q) ||
      order.items.some(item => item.name.toLowerCase().includes(q));
    return matchesStatus && matchesQuery;
  });

  const marketChecklist = [
    { id: 1, task: "Validazione HACCP Cuochi", status: chefApplications.some(a => a.documents.length > 0) ? 'complete' : 'pending', priority: 'Alta' },
    { id: 2, task: "Integrazione Gateway Pagamenti", status: 'complete', priority: 'Critica' },
    { id: 3, task: "Ottimizzazione SEO & Meta Tags", status: 'complete', priority: 'Media' },
    { id: 4, task: "Logistica Consegne (Last Mile)", status: 'pending', priority: 'Alta' },
    { id: 5, task: "Policy Assicurativa Operativa", status: 'pending', priority: 'Critica' }
  ];

  // Dynamically integrate registered counts with default pre-registrations
  const totalRegisteredClients = registeredUsers.filter(u => u.role === 'client').length;
  const totalRegisteredChefs = registeredUsers.filter(u => u.role === 'chef').length;

  const stats = [
    { label: 'Candidature Ricevute', value: chefApplications.length.toString(), change: `${pendingAppsCount} da valutare`, up: true, icon: FileText },
    { label: 'Cuochi Attivi in Catalogo', value: chefs.length.toString(), change: `+${totalRegisteredChefs} registrati`, up: true, icon: ChefHat },
    { label: 'Indice di Prontezza', value: '88%', change: '+10%', up: true, icon: PieChart },
    { label: 'Pre-registrazioni Clienti', value: (1240 + totalRegisteredClients).toString(), change: `+${totalRegisteredClients} reali`, up: true, icon: Users },
  ];

  const generateAiReport = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/gemini/admin-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalApplications: chefApplications.length,
          pendingCount: pendingAppsCount,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      setAiReport(data.report || 'Analisi completata con successo.');
    } catch {
      setAiReport('Advisor AI momentaneamente offline. Riprova tra poco.');
    }
    setIsGenerating(false);
  };

  useEffect(() => {
    generateAiReport();
  }, []);

  // Filtered applications
  const filteredApplications = chefApplications.filter(app => {
    const matchesStatus = appStatusFilter === 'all' || app.status === appStatusFilter;
    const matchesQuery = 
      app.fullName.toLowerCase().includes(appSearch.toLowerCase()) ||
      app.brandName.toLowerCase().includes(appSearch.toLowerCase()) ||
      app.email.toLowerCase().includes(appSearch.toLowerCase()) ||
      app.location.toLowerCase().includes(appSearch.toLowerCase()) ||
      app.proposedDishName.toLowerCase().includes(appSearch.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  // Filtered registered users
  const filteredUsers = registeredUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.lastName.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="animate-fade-in space-y-10 pb-20 text-left">
      
      {/* Intestazione Controllo Lancio */}
      <div className="bg-black rounded-[3rem] sm:rounded-[3.5rem] p-8 sm:p-10 text-white relative overflow-hidden border-b-8 border-orange-600 shadow-2xl">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-[2rem] flex items-center justify-center shadow-2xl animate-pulse shrink-0">
                <Rocket className="w-10 h-10 text-black" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                   <span className="bg-orange-600/20 text-orange-400 text-[10px] font-black px-3 py-1 rounded-full border border-orange-500/30 uppercase tracking-[0.2em]">
                     Cockpit Amministratore MESA v6.0
                   </span>
                   {pendingAppsCount > 0 && (
                     <span className="bg-red-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full animate-bounce">
                       {pendingAppsCount} CANDIDATURE DA VALUTARE
                     </span>
                   )}
                </div>
                <h1 className="text-3xl sm:text-5xl font-black italic tracking-tighter leading-none">
                  Gestione & Valutazione Cuochi
                </h1>
              </div>
           </div>
           
            <div className="flex items-center gap-4">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-3xl text-center">
                 <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Ordini In Attesa</p>
                 <p className="text-2xl font-black text-orange-500 italic">{pendingOrdersCount}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-3xl text-center">
                 <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Candidature In Attesa</p>
                 <p className="text-2xl font-black text-orange-500 italic">{pendingAppsCount}</p>
              </div>
              <button 
                onClick={generateAiReport}
                className="bg-orange-600 p-4 rounded-3xl text-black hover:bg-white transition-all shadow-xl group flex items-center justify-center"
                title="Rigenera Advisor AI"
              >
                <RefreshCw className={`w-6 h-6 ${isGenerating ? 'animate-spin' : 'group-hover:rotate-180 transition-transform'}`} />
              </button>
           </div>
        </div>
      </div>

      {/* Tabs di Navigazione Amministratore */}
      <div className="flex border-b border-gray-100 overflow-x-auto pb-px gap-2">
        <button
          onClick={() => setAdminTab('orders')}
          className={`py-4 px-6 text-xs font-black uppercase tracking-widest flex items-center gap-2 border-b-4 transition-colors shrink-0 ${
            adminTab === 'orders' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <ShoppingBag className="w-4 h-4" /> Monitoraggio Ordini ({orders.length})
          {pendingOrdersCount > 0 && (
            <span className="ml-1 px-2 py-0.5 text-[10px] bg-orange-600 text-white rounded-full font-bold animate-pulse">
              {pendingOrdersCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminTab('dishes')}
          className={`py-4 px-6 text-xs font-black uppercase tracking-widest flex items-center gap-2 border-b-4 transition-colors shrink-0 ${
            adminTab === 'dishes' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" /> Piatti & Menu ({allDishes.length})
        </button>

        <button
          onClick={() => setAdminTab('applications')}
          className={`py-4 px-6 text-xs font-black uppercase tracking-widest flex items-center gap-2 border-b-4 transition-colors shrink-0 ${
            adminTab === 'applications' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <FileText className="w-4 h-4" /> Candidature & Verifiche Cuochi
          {pendingAppsCount > 0 && (
            <span className="ml-1.5 px-2 py-0.5 text-[10px] bg-red-600 text-white rounded-full font-bold animate-pulse">
              {pendingAppsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminTab('chefs')}
          className={`py-4 px-6 text-xs font-black uppercase tracking-widest flex items-center gap-2 border-b-4 transition-colors shrink-0 ${
            adminTab === 'chefs' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <ChefHat className="w-4 h-4" /> Cuochi Attivi nel Catalogo ({chefs.length})
        </button>

        <button
          onClick={() => setAdminTab('users')}
          className={`py-4 px-6 text-xs font-black uppercase tracking-widest flex items-center gap-2 border-b-4 transition-colors shrink-0 ${
            adminTab === 'users' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Users className="w-4 h-4" /> Utenti & Indirizzi Verificati ({registeredUsers.length})
        </button>

        <button
          onClick={() => setAdminTab('cockpit')}
          className={`py-4 px-6 text-xs font-black uppercase tracking-widest flex items-center gap-2 border-b-4 transition-colors shrink-0 ${
            adminTab === 'cockpit' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <BarChart3 className="w-4 h-4" /> Cockpit Strategico & AI
        </button>
      </div>

      {/* TAB 0: MONITORAGGIO ORDINI IN TEMPO REALE */}
      {adminTab === 'orders' && (
        <div className="animate-fade-in space-y-8 bg-white rounded-[3rem] p-6 sm:p-10 border border-gray-100 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black italic tracking-tight text-orange-600">
                Monitoraggio Ordini & Prenotazioni
              </h3>
              <p className="text-black text-sm mt-1 leading-relaxed font-medium">
                Tutte le prenotazioni dei clienti sincronizzate in tempo reale con cuoco, piatto, importo, data/orario e stato attuale.
              </p>
            </div>
            <span className="bg-orange-100 text-orange-800 text-xs font-black px-4 py-2 rounded-2xl border border-orange-200 uppercase tracking-wider w-fit">
              Live Sync Attivo
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Ordini Totali</p>
              <p className="text-2xl font-black text-gray-900 mt-1">{orders.length}</p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-800">In attesa di conferma</p>
              <p className="text-2xl font-black text-amber-900 mt-1">{pendingOrdersCount}</p>
            </div>
            <div className="p-4 rounded-2xl bg-green-50 border border-green-200">
              <p className="text-[10px] font-black uppercase tracking-widest text-green-800">Confermati / Attivi</p>
              <p className="text-2xl font-black text-green-900 mt-1">{confirmedOrdersCount}</p>
            </div>
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200">
              <p className="text-[10px] font-black uppercase tracking-widest text-red-800">Rifiutati</p>
              <p className="text-2xl font-black text-red-900 mt-1">{rejectedOrdersCount}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-gray-100 pb-6">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cerca per cuoco, piatto, codice ordine o cliente..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-2xl bg-gray-50 focus:ring-2 focus:ring-orange-500 outline-none text-xs font-bold"
              />
            </div>

            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
              {([
                { key: 'all', label: `Tutti (${orders.length})` },
                { key: 'PENDING_CONFIRMATION', label: `In attesa (${pendingOrdersCount})` },
                { key: 'CONFIRMED', label: 'Confermati' },
                { key: 'REJECTED', label: `Rifiutati (${rejectedOrdersCount})` },
                { key: 'COMPLETED', label: 'Completati' }
              ] as const).map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setOrderStatusFilter(tab.key)}
                  className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all shrink-0 ${
                    orderStatusFilter === tab.key
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="py-16 text-center text-gray-400 font-bold border-2 border-dashed border-gray-200 rounded-[2.5rem] bg-gray-50/50 space-y-2">
              <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-base font-black text-gray-700">Nessun ordine trovato.</p>
              <p className="text-xs text-gray-500">Le nuove prenotazioni dei clienti appariranno qui automaticamente.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-3xl border border-gray-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <th className="py-4 px-5">Ordine</th>
                    <th className="py-4 px-5">Cuoco</th>
                    <th className="py-4 px-5">Piatto</th>
                    <th className="py-4 px-5">Importo</th>
                    <th className="py-4 px-5">Data / Orario</th>
                    <th className="py-4 px-5">Stato Attuale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {filteredOrders.map(order => {
                    const firstItem = order.items[0];
                    const statusLabel = ORDER_STATUS_LABELS[order.status] || order.status;
                    const isConfirmed = order.status === 'CONFIRMED' || order.status === 'PLACED';
                    return (
                      <tr key={order.id} className="hover:bg-orange-50/20 transition-colors">
                        <td className="py-4 px-5 align-top">
                          <p className="font-mono font-black text-gray-900">#{order.id.split('-')[0]}</p>
                          <p className="text-[10px] font-semibold text-gray-500 mt-0.5">
                            {order.customerName || 'Cliente Ospite'}
                          </p>
                        </td>
                        <td className="py-4 px-5 align-top">
                          <p className="font-black text-orange-600">{order.chefName}</p>
                        </td>
                        <td className="py-4 px-5 align-top">
                          <div className="space-y-1">
                            {order.items.map((item, i) => (
                              <p key={i} className="font-bold text-black">
                                {item.name} <span className="text-orange-600 font-black">x{item.quantity}</span>
                              </p>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-5 align-top font-mono font-black text-gray-900 whitespace-nowrap">
                          € {order.total.toFixed(2)}
                        </td>
                        <td className="py-4 px-5 align-top">
                          <p className="font-bold text-black whitespace-nowrap">
                            {firstItem?.scheduledDate ? `${firstItem.scheduledDate} • ${firstItem.scheduledTime}` : order.estimatedTime}
                          </p>
                          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mt-0.5">
                            {order.deliveryMode === 'delivery' ? 'Consegna a domicilio' : 'Ritiro in sede'}
                          </p>
                        </td>
                        <td className="py-4 px-5 align-top whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
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
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 0B: GESTIONE PIATTI & DESCRIZIONI */}
      {adminTab === 'dishes' && (
        <div className="animate-fade-in space-y-8 bg-white rounded-[3rem] p-6 sm:p-10 border border-gray-100 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black italic tracking-tight text-orange-600">
                Gestione Piatti & Descrizioni
              </h3>
              <p className="text-black text-sm mt-1 leading-relaxed font-medium">
                Modifica nome, descrizione, prezzo, ingredienti e foto di ogni piatto in catalogo o aggiungine di nuovi per ciascun cuoco.
              </p>
            </div>
            {onUpdateChef && chefs.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setEditingDishKey(null);
                  setIsAddingNewDish(!isAddingNewDish);
                  setNewDishChefId(chefs[0].id);
                  setDishFormName('');
                  setDishFormDesc('');
                  setDishFormPrice('12.00');
                  setDishFormImage('');
                  setDishFormTags('');
                  setDishFormIngredients('');
                  setDishFormPreparation('');
                }}
                className="px-5 py-3 bg-orange-600 hover:bg-black text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all shrink-0 w-fit"
              >
                <Plus className="w-4 h-4" />
                <span>Nuovo Piatto</span>
              </button>
            )}
          </div>

          {isAddingNewDish && (
            <div className="bg-orange-50/40 border-2 border-orange-200 rounded-[2rem] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-base text-orange-600">Aggiungi Nuovo Piatto</h4>
                <button onClick={() => setIsAddingNewDish(false)} className="p-1.5 rounded-full hover:bg-white text-gray-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Cuoco</label>
                  <select
                    value={newDishChefId}
                    onChange={(e) => setNewDishChefId(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl bg-white text-xs font-bold"
                  >
                    {chefs.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Nome Piatto</label>
                  <input
                    type="text"
                    value={dishFormName}
                    onChange={(e) => setDishFormName(e.target.value)}
                    placeholder="es. Lasagna della Tradizione"
                    className="w-full p-3 border border-gray-200 rounded-xl bg-white text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Prezzo (€)</label>
                  <input
                    type="text"
                    value={dishFormPrice}
                    onChange={(e) => setDishFormPrice(e.target.value)}
                    placeholder="12.50"
                    className="w-full p-3 border border-gray-200 rounded-xl bg-white text-xs font-bold font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Descrizione</label>
                <textarea
                  rows={2}
                  value={dishFormDesc}
                  onChange={(e) => setDishFormDesc(e.target.value)}
                  placeholder="Descrizione dettagliata del piatto..."
                  className="w-full p-3 border border-gray-200 rounded-xl bg-white text-xs font-medium"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Ingredienti (virgola)</label>
                  <input
                    type="text"
                    value={dishFormIngredients}
                    onChange={(e) => setDishFormIngredients(e.target.value)}
                    placeholder="Pasta, Ragù, Besciamella"
                    className="w-full p-3 border border-gray-200 rounded-xl bg-white text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Tag (virgola)</label>
                  <input
                    type="text"
                    value={dishFormTags}
                    onChange={(e) => setDishFormTags(e.target.value)}
                    placeholder="Carne, Pasta"
                    className="w-full p-3 border border-gray-200 rounded-xl bg-white text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">URL Immagine</label>
                  <input
                    type="text"
                    value={dishFormImage}
                    onChange={(e) => setDishFormImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-3 border border-gray-200 rounded-xl bg-white text-xs font-bold"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNewDish(false)}
                  className="px-4 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-black uppercase tracking-wider"
                >
                  Annulla
                </button>
                <button
                  type="button"
                  onClick={handleCreateNewDish}
                  className="px-5 py-2.5 bg-black hover:bg-orange-600 text-white rounded-xl text-xs font-black uppercase tracking-wider"
                >
                  Salva Nuovo Piatto
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-gray-100 pb-6">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cerca piatto per nome, descrizione, ingrediente o cuoco..."
                value={dishSearch}
                onChange={(e) => setDishSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-2xl bg-gray-50 focus:ring-2 focus:ring-orange-500 outline-none text-xs font-bold"
              />
            </div>

            <select
              value={dishChefFilter}
              onChange={(e) => setDishChefFilter(e.target.value)}
              className="w-full sm:w-64 p-3.5 border border-gray-200 rounded-2xl bg-gray-50 text-xs font-bold outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Tutti i Cuochi ({allDishes.length} piatti)</option>
              {chefs.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.dishes.length})</option>
              ))}
            </select>
          </div>

          {filteredDishes.length === 0 ? (
            <div className="py-16 text-center text-gray-400 font-bold border-2 border-dashed border-gray-200 rounded-[2.5rem] bg-gray-50/50 space-y-2">
              <UtensilsCrossed className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-base font-black text-gray-700">Nessun piatto trovato.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredDishes.map(({ dish, chef }) => {
                const dishKey = `${chef.id}::${dish.id}`;
                const isEditingDish = editingDishKey === dishKey;

                return (
                  <div key={dishKey} className="bg-gray-50 rounded-[2rem] p-5 border border-gray-200 flex flex-col justify-between gap-4">
                    {isEditingDish ? (
                      <div className="bg-white p-4 rounded-2xl border border-orange-200 space-y-3 text-left">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">
                            Modifica Piatto — {chef.name}
                          </span>
                          <button onClick={() => setEditingDishKey(null)} className="text-gray-400 hover:text-gray-700">
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-3 gap-2.5">
                          <div className="col-span-2">
                            <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Nome Piatto</label>
                            <input
                              type="text"
                              value={dishFormName}
                              onChange={(e) => setDishFormName(e.target.value)}
                              className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50 text-xs font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Prezzo (€)</label>
                            <input
                              type="text"
                              value={dishFormPrice}
                              onChange={(e) => setDishFormPrice(e.target.value)}
                              className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50 text-xs font-bold font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Descrizione</label>
                          <textarea
                            rows={3}
                            value={dishFormDesc}
                            onChange={(e) => setDishFormDesc(e.target.value)}
                            className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50 text-xs font-medium resize-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Ingredienti</label>
                            <input
                              type="text"
                              value={dishFormIngredients}
                              onChange={(e) => setDishFormIngredients(e.target.value)}
                              className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50 text-xs font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Tag</label>
                            <input
                              type="text"
                              value={dishFormTags}
                              onChange={(e) => setDishFormTags(e.target.value)}
                              className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50 text-xs font-bold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Preparazione</label>
                          <textarea
                            rows={2}
                            value={dishFormPreparation}
                            onChange={(e) => setDishFormPreparation(e.target.value)}
                            className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50 text-xs font-medium resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">URL Immagine</label>
                          <input
                            type="text"
                            value={dishFormImage}
                            onChange={(e) => setDishFormImage(e.target.value)}
                            className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50 text-xs font-bold"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setEditingDishKey(null)}
                            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-wider"
                          >
                            Annulla
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveDishEdit(chef, dish.id)}
                            className="px-4 py-2 bg-black hover:bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider"
                          >
                            Salva Piatto
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex gap-4">
                          <img
                            src={dish.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'}
                            alt={dish.name}
                            referrerPolicy="no-referrer"
                            className="w-24 h-24 rounded-2xl object-cover shrink-0 border border-gray-200"
                          />
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-black text-base text-orange-600 leading-tight">{dish.name}</h4>
                              <span className="font-mono font-black text-sm text-gray-900 shrink-0">€ {dish.price.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                              <CountryFlag flag={chef.nationality} title={chef.countryName} size="xs" />
                              <span>{chef.name}</span>
                            </div>
                            <p className="text-xs text-black leading-relaxed line-clamp-3">
                              {dish.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-200/70">
                          <div className="flex flex-wrap gap-1">
                            {dish.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="px-2 py-0.5 bg-white border border-gray-200 rounded-lg text-[9px] font-black uppercase text-gray-600">
                                {tag}
                              </span>
                            ))}
                          </div>
                          {onUpdateChef && (
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => startEditingDish(dish, chef.id)}
                                className="px-3.5 py-2 bg-black hover:bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all"
                              >
                                <Pencil className="w-3 h-3" />
                                <span>Modifica</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteDishFromChef(chef, dish.id)}
                                className="p-2 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 rounded-xl transition-all"
                                title={`Elimina ${dish.name}`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 1: CANDIDATURE & VERIFICHE CUOCHI (MAIN FEATURE) */}
      {adminTab === 'applications' && (
        <div className="animate-fade-in space-y-8 bg-white rounded-[3rem] p-6 sm:p-10 border border-gray-100 shadow-sm">
          <div>
            <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
              <h3 className="text-xl sm:text-2xl font-black italic tracking-tight text-orange-600">
                Valutazione & Attivazione Candidature Cuochi
              </h3>
              <span className="bg-orange-100 text-orange-800 text-xs font-black px-4 py-2 rounded-2xl border border-orange-200 uppercase tracking-wider">
                Sincronizzato in Tempo Reale
              </span>
            </div>
            <p className="text-black text-sm leading-relaxed max-w-3xl font-medium">
              Esamina le registrazioni inviate dalla sezione <strong>"Diventa Chef"</strong>. Verifica i documenti igienico-sanitari (HACCP e Carta d'Identità) ed <strong>attiva il profilo</strong> per pubblicare il cuoco ed i suoi piatti direttamente nel catalogo pubblico MESA.
            </p>
          </div>

          {/* Filtri & Ricerca Candidature */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-gray-100 pb-6">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Cerca per nome, brand, città o piatto..." 
                value={appSearch}
                onChange={(e) => setAppSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-2xl bg-gray-50 focus:ring-2 focus:ring-orange-500 outline-none text-xs font-bold"
              />
            </div>

            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
              {(['all', 'pending', 'approved', 'rejected'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setAppStatusFilter(st)}
                  className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all shrink-0 flex items-center gap-1.5 ${
                    appStatusFilter === st 
                      ? 'bg-black text-white border-black' 
                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {st === 'all' && `Tutte (${chefApplications.length})`}
                  {st === 'pending' && (
                    <>
                      <span>Da Valutare ({pendingAppsCount})</span>
                      {pendingAppsCount > 0 && <span className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>}
                    </>
                  )}
                  {st === 'approved' && `Attivati (${chefApplications.filter(a => a.status === 'approved').length})`}
                  {st === 'rejected' && `Respinti (${chefApplications.filter(a => a.status === 'rejected').length})`}
                </button>
              ))}
            </div>
          </div>

          {/* Lista Candidature */}
          {filteredApplications.length === 0 ? (
            <div className="py-20 text-center text-gray-400 font-bold border-2 border-dashed border-gray-200 rounded-[2.5rem] bg-gray-50/50 space-y-3">
              <ChefHat className="w-12 h-12 text-gray-300 mx-auto" />
              <p className="text-base font-black text-gray-700">Nessuna candidatura presente con i filtri selezionati.</p>
              <p className="text-xs text-gray-400">Clicca su "Diventa Chef" o apri il modulo per inoltrare una nuova candidatura di prova!</p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredApplications.map(app => (
                <div 
                  key={app.id} 
                  className={`rounded-[2.5rem] p-6 sm:p-8 border-2 transition-all flex flex-col gap-6 relative shadow-sm hover:shadow-xl ${
                    app.status === 'pending' 
                      ? 'border-orange-500/40 bg-orange-50/20' 
                      : app.status === 'approved'
                      ? 'border-green-500/30 bg-green-50/10'
                      : 'border-gray-200 bg-gray-50/40'
                  }`}
                >
                  {/* Top Bar Candidate Summary */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200/60 pb-6">
                    <div className="flex items-center gap-5">
                      <img 
                        src={app.avatarUrl || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80'} 
                        alt={app.brandName} 
                        className="w-16 h-16 rounded-2xl object-cover shadow-md border-2 border-orange-500/30 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-black text-xl text-gray-900 leading-tight">
                            {app.brandName}
                          </h4>
                          <CountryFlag flag={app.nationality} title={app.countryName} size="md" />
                          <span className="text-[10px] font-mono bg-gray-200 text-gray-700 font-bold px-2 py-0.5 rounded-md">
                            ID: {app.id}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 font-bold mt-1">
                          Candidato: <span className="text-black font-extrabold">{app.fullName}</span> • {app.location}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                          Inviata il: {app.submittedAt}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-start md:self-auto">
                      <span className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider border flex items-center gap-1.5 ${
                        app.status === 'pending'
                          ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
                          : app.status === 'approved'
                          ? 'bg-green-100 text-green-800 border-green-300'
                          : 'bg-red-100 text-red-800 border-red-300'
                      }`}>
                        {app.status === 'pending' && <Clock className="w-3.5 h-3.5 text-amber-700" />}
                        {app.status === 'approved' && <ShieldCheck className="w-3.5 h-3.5 text-green-700" />}
                        {app.status === 'rejected' && <Ban className="w-3.5 h-3.5 text-red-700" />}
                        <span>
                          {app.status === 'pending' ? 'Da Valutare' : app.status === 'approved' ? 'Profilo Attivo' : 'Candidatura Respinta'}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Details Grid: Contacts, Documents, Proposed Menu */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Column 1: Info & Contatti & Disponibilità */}
                    <div className="bg-white p-5 rounded-3xl border border-gray-200/80 space-y-3">
                      <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 border-b pb-2">
                        <Smartphone className="w-3.5 h-3.5 text-orange-600" /> Contatti & Presentazione
                      </h5>
                      <div className="space-y-2 text-xs">
                        <p className="font-bold text-gray-800">
                          <span className="text-gray-400 font-normal">Email:</span> {app.email}
                        </p>
                        <p className="font-mono font-bold text-gray-800 flex items-center gap-2">
                          <span className="text-gray-400 font-sans font-normal">Tel / WhatsApp:</span> {app.phone}
                          <a 
                            href={`https://wa.me/${app.phone.replace(/[^0-9]/g, '')}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-[9px] font-black bg-green-500 text-white px-2 py-0.5 rounded-md hover:bg-green-600"
                          >
                            WhatsApp
                          </a>
                        </p>
                        <p className="font-bold text-gray-800">
                          <span className="text-gray-400 font-normal">Specialità:</span> {app.specialties.join(', ')}
                        </p>
                        
                        {/* Calendario Disponibilità Cuoco */}
                        <div className="pt-2 border-t border-gray-100 space-y-1">
                          <p className="font-extrabold text-[10px] uppercase text-orange-600 tracking-wider flex items-center gap-1">
                            <CalendarDays className="w-3.5 h-3.5" /> Calendario Operativo:
                          </p>
                          <p className="font-bold text-gray-900 bg-orange-50 p-2 rounded-xl border border-orange-100">
                            {app.availableDays && app.availableDays.length > 0
                              ? app.availableDays.map(d => ({ 1:'Lun', 2:'Mar', 3:'Mer', 4:'Gio', 5:'Ven', 6:'Sab', 0:'Dom' }[d] || d)).join(', ')
                              : 'Lun, Mar, Mer, Gio, Ven, Sab'}
                          </p>
                          <p className="font-mono text-[10px] font-bold text-gray-600 flex items-center gap-1 pt-0.5">
                            <Clock className="w-3 h-3 text-gray-400" />
                            {app.availabilitySlots && app.availabilitySlots.length > 0 
                              ? app.availabilitySlots.join(' | ') 
                              : '12:00 - 15:00, 19:00 - 22:00'}
                          </p>
                        </div>

                        <p className="text-gray-600 italic font-medium pt-1 line-clamp-3">
                          "{app.bio}"
                        </p>
                      </div>
                    </div>

                    {/* Column 2: Documenti Igienici & HACCP */}
                    <div className="bg-white p-5 rounded-3xl border border-gray-200/80 space-y-3">
                      <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 border-b pb-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-green-600" /> Documenti Allegati ({app.documents.length})
                      </h5>
                      
                      {app.documents.length === 0 ? (
                        <p className="text-xs text-amber-700 bg-amber-50 p-3 rounded-2xl border border-amber-200 font-bold">
                          Nessun documento allegato.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {app.documents.map(doc => (
                            <div key={doc.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between gap-2 text-xs">
                              <div className="flex items-center gap-2 min-w-0">
                                <FileText className="w-4 h-4 text-orange-600 shrink-0" />
                                <div className="min-w-0">
                                  <p className="font-extrabold text-gray-900 truncate">{doc.title}</p>
                                  <p className="text-[9px] font-mono text-gray-400 truncate">{doc.fileName} ({doc.fileSize || 'PDF'})</p>
                                </div>
                              </div>
                              <button 
                                onClick={() => setSelectedDocPreview(doc)}
                                className="px-2.5 py-1.5 bg-black hover:bg-orange-600 text-white rounded-xl text-[9px] font-black uppercase tracking-wider shrink-0 flex items-center gap-1"
                              >
                                <Eye className="w-3 h-3" /> Vedi
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Column 3: Proposta Primo Piatto */}
                    <div className="bg-white p-5 rounded-3xl border border-gray-200/80 space-y-3">
                      <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 border-b pb-2">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Proposta Primo Piatto
                      </h5>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h6 className="font-black text-sm text-gray-900">{app.proposedDishName}</h6>
                          <span className="font-mono font-black text-orange-600 text-sm">€ {app.proposedDishPrice.toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-gray-600 font-medium leading-relaxed line-clamp-3">
                          {app.proposedDishDesc}
                        </p>
                        {app.kitchenPhotos && app.kitchenPhotos.length > 0 && (
                          <div className="flex gap-2 pt-1">
                            {app.kitchenPhotos.slice(0, 2).map((img, i) => (
                              <img key={i} src={img} alt="Dish" className="w-12 h-12 rounded-xl object-cover border border-gray-200" />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Admin Notes & Decision Action Panel */}
                  <div className="bg-gray-900 text-white p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-800">
                    <div className="w-full md:w-1/2 space-y-2">
                      <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400">
                        Note Amministratore / Feedback Cuoco
                      </label>
                      <input 
                        type="text" 
                        value={adminNoteInput[app.id] || app.adminNotes || ''}
                        onChange={(e) => setAdminNoteInput({ ...adminNoteInput, [app.id]: e.target.value })}
                        placeholder="Inserisci note di verifica (es. Documenti igienici conformi. Profilo idoneo al lancio)..." 
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-xs font-bold text-white outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                      {app.status !== 'approved' && onApproveApplication && (
                        <button
                          onClick={() => onApproveApplication(app.id)}
                          className="px-6 py-4 bg-orange-600 hover:bg-orange-500 text-black rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-xl shadow-orange-600/30 transition-all active:scale-95"
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>Valuta & Attiva Profilo Cuoco</span>
                        </button>
                      )}

                      {app.status === 'approved' && (
                        <div className="flex items-center gap-2 px-5 py-3 bg-green-500/20 text-green-400 border border-green-500/30 rounded-2xl text-xs font-black uppercase tracking-wider">
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                          <span>Incluso nel Catalogo Pubblico MESA</span>
                        </div>
                      )}

                      {app.status !== 'rejected' && onRejectApplication && (
                        <button
                          onClick={() => onRejectApplication(app.id, adminNoteInput[app.id])}
                          className="px-4 py-4 bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all"
                        >
                          Rifiuta / Richiedi Info
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: GESTIONE ANAGRAFICA CUOCHI ATTIVI */}
      {adminTab === 'chefs' && (
        <div className="animate-fade-in space-y-8 bg-white rounded-[3rem] p-6 sm:p-10 border border-gray-100 shadow-sm">
          <div>
            <h3 className="text-xl sm:text-2xl font-black italic tracking-tight mb-2 text-orange-600">Cuochi Attivi nel Catalogo MESA</h3>
            <p className="text-black text-sm leading-relaxed max-w-3xl font-medium">
              Gestisci i profili dei cuochi attualmente pubblicati. Puoi modificarne indirizzo, recapiti telefonici, credenziali d'accesso oppure eliminarli dal catalogo.
            </p>
          </div>

          {/* Filtro di Ricerca Cuochi */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-gray-100 pb-6">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Cerca cuochi per nome, nazione, specialità..." 
                value={chefSearch}
                onChange={(e) => setChefSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-2xl bg-gray-50 focus:ring-2 focus:ring-orange-500 outline-none text-xs font-bold"
              />
            </div>
            
            <div className="bg-orange-50 text-orange-800 border border-orange-200 text-xs px-5 py-3 rounded-2xl font-black uppercase tracking-widest flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-orange-600" />
              <span>Totale Cuochi Attivi: {chefs.length}</span>
            </div>
          </div>

          {/* Grid di Cuochi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {chefs.filter(chef => {
              return (
                chef.name.toLowerCase().includes(chefSearch.toLowerCase()) ||
                chef.nationality.toLowerCase().includes(chefSearch.toLowerCase()) ||
                chef.continent.toLowerCase().includes(chefSearch.toLowerCase()) ||
                chef.location.toLowerCase().includes(chefSearch.toLowerCase()) ||
                chef.specialties.some(spec => spec.toLowerCase().includes(chefSearch.toLowerCase()))
              );
            }).map(chef => {
              const defaultNumbers: Record<string, string> = {
                'c1': '+393475552026',
                'c2': '+393485553012',
                'c3': '+393495551890',
              };
              const currentPhone = chef.phone || defaultNumbers[chef.id] || '+393475552026';
              const isEditing = editingChefId === chef.id;

              const handleSave = () => {
                const normalizedEmail = (editEmail || '').trim().toLowerCase();
                const trimmedFlag = editNationality.trim();
                const resolvedCountry = editCountryName.trim() || getCountryNameByFlag(trimmedFlag) || 'Italia';
                if (onUpdateChef) {
                  onUpdateChef({
                    ...chef,
                    name: editName.trim(),
                    phone: editPhone.trim(),
                    location: editLocation.trim(),
                    bio: editBio.trim(),
                    email: normalizedEmail,
                    password: editPassword.trim(),
                    nationality: trimmedFlag,
                    countryName: resolvedCountry,
                    continent: editContinent
                  });
                  setEditingChefId(null);
                }
              };

              return (
                <div key={chef.id} className="bg-gray-50 rounded-[2.5rem] p-6 border border-gray-200 hover:border-orange-500/20 transition-all flex flex-col justify-between relative">
                  <div>
                    {/* Avatar & Nome */}
                    <div className="flex items-center gap-4 mb-6 border-b border-gray-200/60 pb-4">
                      <img 
                        src={chef.avatar} 
                        alt={chef.name} 
                        className="w-14 h-14 rounded-2xl object-cover shadow-sm border-2 border-orange-600/20 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-extrabold text-base text-gray-900 truncate leading-none">{chef.name}</h4>
                          <CountryFlag flag={chef.nationality} title={chef.countryName || chef.nationality} size="md" />
                          {chef.countryName && (
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border border-gray-200 text-gray-600">
                              {chef.countryName}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1 font-bold uppercase tracking-wider">{chef.continent} • {chef.specialties.slice(0, 2).join(', ')}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-2.5 py-1 text-[8px] font-black bg-orange-600 text-black uppercase tracking-widest rounded-md">
                          ID: {chef.id}
                        </span>
                      </div>
                    </div>

                    {/* Campi Editabili / Visualizzabili */}
                    {isEditing ? (
                      <div className="space-y-4 bg-white p-5 rounded-2xl border border-orange-200 mb-6 text-left">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Nome d'Arte</label>
                            <input 
                              type="text" 
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50 text-xs font-black"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Telefono</label>
                            <input 
                              type="text" 
                              value={editPhone}
                              onChange={(e) => setEditPhone(e.target.value)}
                              className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50 text-xs font-black font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Assegna Paese Rapido</label>
                          <select
                            value={COUNTRY_FLAG_PRESETS.some(p => p.flag === editNationality && p.countryName === editCountryName) ? editNationality : ''}
                            onChange={(e) => {
                              const preset = COUNTRY_FLAG_PRESETS.find(p => p.flag === e.target.value);
                              if (preset) {
                                setEditNationality(preset.flag);
                                setEditCountryName(preset.countryName);
                                setEditContinent(preset.continent);
                              }
                            }}
                            className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50 text-xs font-bold mb-3"
                          >
                            <option value="">-- Seleziona paese e bandiera --</option>
                            {COUNTRY_FLAG_PRESETS.map(p => (
                              <option key={`${p.flag}-${p.countryName}`} value={p.flag}>
                                {p.flag} {p.countryName} ({p.continent})
                              </option>
                            ))}
                          </select>

                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Bandiera</label>
                              <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-xl bg-gray-50">
                                <CountryFlag flag={editNationality} title={editCountryName} size="sm" />
                                <input
                                  type="text"
                                  value={editNationality}
                                  onChange={(e) => {
                                    const nextFlag = e.target.value;
                                    setEditNationality(nextFlag);
                                    const matched = getCountryNameByFlag(nextFlag);
                                    if (matched) setEditCountryName(matched);
                                  }}
                                  className="w-full bg-transparent text-xs text-center font-bold outline-none"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Paese</label>
                              <input
                                type="text"
                                value={editCountryName}
                                onChange={(e) => setEditCountryName(e.target.value)}
                                className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50 text-xs font-black"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Continente</label>
                              <select
                                value={editContinent}
                                onChange={(e) => setEditContinent(e.target.value as Continent)}
                                className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50 text-xs font-bold"
                              >
                                <option value="Europa">Europa</option>
                                <option value="Africa">Africa</option>
                                <option value="Asia">Asia</option>
                                <option value="Americhe">Americhe</option>
                                <option value="Oceania">Oceania</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Indirizzo Sede Cucina</label>
                          <input 
                            type="text" 
                            value={editLocation}
                            onChange={(e) => setEditLocation(e.target.value)}
                            className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50 text-xs font-black"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Bio</label>
                          <textarea 
                            value={editBio}
                            onChange={(e) => setEditBio(e.target.value)}
                            rows={2}
                            className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50 text-xs font-bold resize-none"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-gray-100">
                          <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-[8px] text-gray-400 font-black uppercase tracking-wider leading-none mb-1">Sede Cucina</p>
                            <p className="text-xs font-bold text-gray-900 truncate">{chef.location}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-gray-100">
                          <Smartphone className="w-4 h-4 text-orange-600 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-[8px] text-gray-400 font-black uppercase tracking-wider leading-none mb-1">Telefono / WhatsApp</p>
                            <p className="text-xs font-mono font-black text-gray-900">{currentPhone}</p>
                          </div>
                        </div>

                        <p className="text-xs text-gray-600 font-medium leading-relaxed italic line-clamp-2 px-1">
                          "{chef.bio}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-gray-200/60 mt-auto">
                    {isEditing ? (
                      <div className="flex gap-2">
                        <button
                          onClick={handleSave}
                          className="px-4 py-2 bg-black text-white hover:bg-orange-600 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all"
                        >
                          Salva
                        </button>
                        <button
                          onClick={() => setEditingChefId(null)}
                          className="px-4 py-2 bg-white text-gray-500 border border-gray-200 text-[9px] font-black uppercase tracking-widest rounded-xl"
                        >
                          Annulla
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingChefId(chef.id);
                            setEditName(chef.name);
                            setEditPhone(currentPhone);
                            setEditLocation(chef.location);
                            setEditBio(chef.bio);
                            setEditEmail(chef.email || '');
                            setEditPassword(chef.password || 'demo123');
                            setEditNationality(chef.nationality || '🇮🇹');
                            setEditCountryName(chef.countryName || getCountryNameByFlag(chef.nationality) || 'Italia');
                            setEditContinent(chef.continent || 'Europa');
                          }}
                          className="px-4 py-2 bg-black text-white hover:bg-orange-600 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all"
                        >
                          Modifica Profilo
                        </button>

                        {onDeleteChef && (
                          <button
                            onClick={() => {
                              setDeleteLinkedUser(false);
                              setChefToDelete(chef);
                            }}
                            className="px-3.5 py-2 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-1.5"
                            title={`Elimina ${chef.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Elimina</span>
                          </button>
                        )}
                      </div>
                    )}

                    <span className="text-[9px] font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-md uppercase">
                      Piatto Forte: {chef.dishes[0]?.name || 'Specialità MESA'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: UTENTI & INDIRIZZI */}
      {adminTab === 'users' && (
        <div className="animate-fade-in space-y-8 bg-white rounded-[3rem] p-6 sm:p-10 border border-gray-100 shadow-sm">
          <div>
            <h3 className="text-xl sm:text-2xl font-black italic tracking-tight mb-2 text-orange-600">Utenti Registrati & Indirizzi Convalidati</h3>
            <p className="text-black text-sm leading-relaxed max-w-3xl font-medium">
              Convalida o revoca la copertura e l'idoneità degli indirizzi di consegna per ciascun utente.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {registeredUsers.map(user => (
              <div key={user.id} className="bg-gray-50 rounded-[2.5rem] p-6 border border-gray-200 space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h4 className="font-extrabold text-lg text-gray-900">{user.name} {user.lastName}</h4>
                    <p className="text-xs text-gray-500">{user.email} • Role: {user.role}</p>
                  </div>
                  {onDeleteUser && user.role !== 'admin' && (
                    <button 
                      onClick={() => onDeleteUser(user.id)}
                      className="p-2 text-gray-400 hover:text-red-600 rounded-xl"
                      title="Elimina Utente"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Indirizzi Registrati ({user.addresses.length})</p>
                  {user.addresses.map(addr => (
                    <div key={addr.id} className="p-3 bg-white rounded-2xl border border-gray-200 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-gray-900">{addr.street}, {addr.city}</p>
                        <span className={`text-[9px] font-black uppercase ${addr.isVerified ? 'text-green-600' : 'text-amber-600'}`}>
                          {addr.isVerified ? '✓ Verificato MESA' : '⚠ Da Convalidare'}
                        </span>
                      </div>
                      <button
                        onClick={() => onVerifyAddress(user.id, addr.id, !addr.isVerified)}
                        className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider ${
                          addr.isVerified ? 'bg-red-100 text-red-700' : 'bg-black text-white hover:bg-orange-600'
                        }`}
                      >
                        {addr.isVerified ? 'Revoca' : 'Convalida'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: COCKPIT STRATEGICO */}
      {adminTab === 'cockpit' && (
        <div className="space-y-10 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-4 bg-gray-50 rounded-2xl text-orange-600">
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="text-[10px] font-black px-3 py-1 bg-green-100 text-green-700 rounded-full">
                      {stat.change}
                    </div>
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <h3 className="text-4xl font-black italic tracking-tighter">{stat.value}</h3>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-[3.5rem] p-8 sm:p-10 border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-xl sm:text-2xl font-black italic tracking-tight text-orange-600">Checklist Operativa MESA</h3>
              <div className="space-y-3">
                {marketChecklist.map(item => (
                  <div key={item.id} className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between border border-gray-100 text-xs font-bold">
                    <div className="flex items-center gap-3">
                      {item.status === 'complete' ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <AlertTriangle className="w-5 h-5 text-orange-600" />}
                      <span>{item.task}</span>
                    </div>
                    <span className="text-[9px] font-black uppercase px-3 py-1 bg-white border rounded-xl">{item.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-black text-white rounded-[3.5rem] p-8 sm:p-10 border border-orange-600 space-y-6">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-orange-500" />
                <h3 className="text-xl font-black italic text-orange-500">AI Strategy Report</h3>
              </div>
              <p className="text-xs font-medium text-gray-300 leading-relaxed italic">
                {aiReport || "Generazione report in corso..."}
              </p>
              <button onClick={generateAiReport} className="w-full py-4 bg-orange-600 text-black font-black uppercase text-xs rounded-2xl hover:bg-orange-500">
                Aggiorna Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Preview Documento */}
      {selectedDocPreview && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" onClick={() => setSelectedDocPreview(null)}>
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 text-left border border-gray-100 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-orange-600" />
                <div>
                  <h4 className="font-black text-base text-gray-900">{selectedDocPreview.title}</h4>
                  <p className="text-[10px] font-mono text-gray-500">{selectedDocPreview.fileName}</p>
                </div>
              </div>
              <button onClick={() => setSelectedDocPreview(null)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 text-center space-y-3">
              <ShieldCheck className="w-12 h-12 text-green-600 mx-auto" />
              <p className="font-extrabold text-sm text-gray-900">Documento Inoltrato per la Verifica</p>
              <p className="text-xs text-gray-500">
                Data Caricamento: {selectedDocPreview.uploadedAt} • Dimensione: {selectedDocPreview.fileSize || 'Standard PDF/Img'}
              </p>
              {selectedDocPreview.fileData && selectedDocPreview.fileData.startsWith('data:image') && (
                <img src={selectedDocPreview.fileData} alt="Doc Preview" className="max-h-48 mx-auto rounded-xl object-contain border" />
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setSelectedDocPreview(null)} className="px-6 py-3 bg-black text-white font-black text-xs uppercase tracking-wider rounded-xl">
                Chiudi Anteprima
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Conferma Eliminazione Cuoco */}
      {chefToDelete && (() => {
        const linkedUser = findLinkedChefUser(chefToDelete);
        return (
          <div
            className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
            onClick={() => !isDeletingChef && setChefToDelete(null)}
          >
            <div
              className="bg-white rounded-[2.5rem] p-6 sm:p-8 max-w-md w-full space-y-6 text-left border border-gray-100 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <AlertOctagon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-lg text-gray-900 leading-tight">Elimina Cuoco</h4>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Azione irreversibile</p>
                  </div>
                </div>
                <button
                  onClick={() => !isDeletingChef && setChefToDelete(null)}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700"
                  disabled={isDeletingChef}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                <img
                  src={chefToDelete.avatar}
                  alt={chefToDelete.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-gray-200 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h5 className="font-black text-base text-gray-900 truncate">{chefToDelete.name}</h5>
                    <CountryFlag flag={chefToDelete.nationality} title={chefToDelete.countryName} size="sm" />
                  </div>
                  <p className="text-xs font-bold text-gray-500 truncate">{chefToDelete.location}</p>
                  <p className="text-[10px] font-black text-orange-600 uppercase tracking-wider mt-1">
                    {chefToDelete.dishes.length} {chefToDelete.dishes.length === 1 ? 'piatto in menu' : 'piatti in menu'} • ID: {chefToDelete.id}
                  </p>
                </div>
              </div>

              <p className="text-xs font-medium text-gray-600 leading-relaxed">
                Confermando, il profilo di <strong>{chefToDelete.name}</strong> e tutti i suoi piatti verranno rimossi definitivamente dal catalogo pubblico MESA e dal database.
              </p>

              {linkedUser && (
                <label className="flex items-start gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={deleteLinkedUser}
                    onChange={(e) => setDeleteLinkedUser(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-red-600 rounded"
                    disabled={isDeletingChef}
                  />
                  <span className="text-xs font-bold text-amber-900 leading-snug">
                    Elimina anche l&apos;account utente collegato (<span className="font-mono">{linkedUser.email}</span>)
                  </span>
                </label>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setChefToDelete(null)}
                  disabled={isDeletingChef}
                  className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-black text-xs uppercase tracking-wider rounded-2xl transition-all disabled:opacity-50"
                >
                  Annulla
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteChef}
                  disabled={isDeletingChef}
                  className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-red-600/25 transition-all flex items-center gap-2 disabled:opacity-60"
                >
                  {isDeletingChef ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  <span>{isDeletingChef ? 'Eliminazione...' : 'Conferma Eliminazione'}</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
    </div>
  );
};
