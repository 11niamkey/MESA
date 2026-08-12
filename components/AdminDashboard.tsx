import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Users, ChefHat, ShoppingBag, 
  TrendingUp, AlertCircle, CheckCircle, 
  Search, ShieldCheck, MapPin, Smartphone, ArrowUpRight, 
  ArrowDownRight, Sparkles, Loader2, RefreshCw, Rocket, Globe, Activity,
  CheckCircle2, AlertTriangle, FileText, PieChart, ExternalLink, Share2, Globe2,
  Trash2, ShieldAlert, Check, Ban, KeyRound, Clock, Eye, X, MessageSquare, UserCheck, AlertOctagon,
  CalendarDays
} from 'lucide-react';
import { Chef, Order, AppUser, ChefApplication, ChefDocument } from '../types';
import { GoogleGenAI } from "@google/genai";
import { ShareModal } from './ShareModal';

interface AdminDashboardProps {
  chefs: Chef[];
  orders: Order[];
  registeredUsers: AppUser[];
  chefApplications?: ChefApplication[];
  onVerifyAddress: (userId: string, addressId: string, isVerified: boolean) => void;
  onDeleteUser?: (userId: string) => void;
  onUpdateChef?: (updatedChef: Chef) => void;
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
  onApproveApplication,
  onRejectApplication
}) => {
  const [adminTab, setAdminTab] = useState<'cockpit' | 'applications' | 'users' | 'chefs'>('applications');
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'client' | 'chef'>('all');
  
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
  const [chefSearch, setChefSearch] = useState('');

  const pendingAppsCount = chefApplications.filter(a => a.status === 'pending').length;

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
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const prompt = `Agisci come un consulente strategico per MESA. 
      Analizza le candidature cuochi: ${chefApplications.length} totali, ${pendingAppsCount} in attesa di verifica HACCP e documenti. 
      Fornisci 3 consigli pratici all'amministratore per valutare e attivare i profili cuoco in modo sicuro e rapido.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt
      });
      setAiReport(response.text || 'Analisi completata con successo.');
    } catch (e) {
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

      {/* TAB 1: CANDIDATURE & VERIFICHE CUOCHI (MAIN FEATURE) */}
      {adminTab === 'applications' && (
        <div className="animate-fade-in space-y-8 bg-white rounded-[3rem] p-6 sm:p-10 border border-gray-100 shadow-sm">
          <div>
            <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
              <h3 className="text-2xl sm:text-3xl font-black italic tracking-tight text-gray-900">
                Valutazione & Attivazione Candidature Cuochi
              </h3>
              <span className="bg-orange-100 text-orange-800 text-xs font-black px-4 py-2 rounded-2xl border border-orange-200 uppercase tracking-wider">
                Sincronizzato in Tempo Reale
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-3xl font-medium">
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
                          <span className="text-lg" title={app.countryName}>{app.nationality}</span>
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
            <h3 className="text-3xl font-black italic tracking-tight mb-2">Cuochi Attivi nel Catalogo MESA</h3>
            <p className="text-gray-500 text-sm leading-relaxed max-w-3xl font-medium">
              Gestisci i profili dei cuochi attualmente pubblicati. Puoi modificarne indirizzo, recapiti telefonici, credenziali d'accesso o disattivarli se necessario.
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
                if (onUpdateChef) {
                  onUpdateChef({
                    ...chef,
                    name: editName.trim(),
                    phone: editPhone.trim(),
                    location: editLocation.trim(),
                    bio: editBio.trim(),
                    email: normalizedEmail,
                    password: editPassword.trim(),
                    nationality: editNationality.trim(),
                    countryName: editCountryName.trim()
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
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-base text-gray-900 truncate leading-none">{chef.name}</h4>
                          <span className="text-lg" title={chef.nationality}>{chef.nationality}</span>
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
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200/60 mt-auto">
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
                          setEditCountryName(chef.countryName || 'Italia');
                        }}
                        className="px-4 py-2 bg-black text-white hover:bg-orange-600 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all"
                      >
                        Modifica Profilo
                      </button>
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
            <h3 className="text-3xl font-black italic tracking-tight mb-2">Utenti Registrati & Indirizzi Convalidati</h3>
            <p className="text-gray-500 text-sm leading-relaxed max-w-3xl font-medium">
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
              <h3 className="text-2xl font-black italic tracking-tight">Checklist Operativa MESA</h3>
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
                <h3 className="text-xl font-black italic">AI Strategy Report</h3>
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

      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
    </div>
  );
};
