import React, { useState } from 'react';
import { 
  X, ChefHat, ShieldCheck, Camera, FileText, Check, ArrowRight, 
  Sparkles, MapPin, Smartphone, Loader2, Upload, Trash2, Eye, 
  FileCheck, AlertCircle, Building2, User, Mail, Globe, Lock,
  Calendar, Clock, Sun, Moon, Sunset, CalendarDays, Plus, CheckSquare
} from 'lucide-react';
import { Chef, AppUser, ChefApplication, ChefDocument, Continent } from '../types';

interface ChefOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  onChefCreate?: (chef: Chef) => void;
  onSubmitApplication?: (application: ChefApplication) => void;
  currentUser?: AppUser | null;
}

const WEEKDAYS = [
  { id: 1, label: 'Lunedì', short: 'Lun', flag: 'L' },
  { id: 2, label: 'Martedì', short: 'Mar', flag: 'M' },
  { id: 3, label: 'Mercoledì', short: 'Mer', flag: 'M' },
  { id: 4, label: 'Giovedì', short: 'Gio', flag: 'G' },
  { id: 5, label: 'Venerdì', short: 'Ven', flag: 'V' },
  { id: 6, label: 'Sabato', short: 'Sab', flag: 'S' },
  { id: 0, label: 'Domenica', short: 'Dom', flag: 'D' },
];

const PRESET_TIME_SLOTS = [
  { id: 'pranzo', label: 'Pranzo Caldo', slot: '12:00 - 15:00', icon: Sun, desc: 'Pausa pranzo da asporto o consegna espressa' },
  { id: 'pomeriggio', label: 'Merenda & Dolci', slot: '15:00 - 18:00', icon: Sunset, desc: 'Snack tradizionali e pasticceria casalinga' },
  { id: 'cena', label: 'Cena Familiare', slot: '19:00 - 22:00', icon: Moon, desc: 'La fascia di punta per le cene serali' },
  { id: 'cena_tarda', label: 'Cena Serale Tarda', slot: '21:00 - 23:30', icon: Clock, desc: 'Per ordini serali e dopocena' },
];

export const ChefOnboarding: React.FC<ChefOnboardingProps> = ({ 
  isOpen, 
  onClose, 
  onChefCreate,
  onSubmitApplication,
  currentUser 
}) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedAppId, setSubmittedAppId] = useState('');

  // Form State
  const [fullName, setFullName] = useState(currentUser ? `${currentUser.name} ${currentUser.lastName}`.trim() : '');
  const [brandName, setBrandName] = useState(currentUser ? `${currentUser.name} Home Chef` : '');
  const [email, setEmail] = useState(currentUser ? currentUser.email : '');
  const [phone, setPhone] = useState('+39 ');
  const [nationality, setNationality] = useState('🇮🇹');
  const [countryName, setCountryName] = useState('Italia');
  const [continent, setContinent] = useState<Continent>('Europa');
  const [location, setLocation] = useState('Milano, Centro');
  const [bio, setBio] = useState('');
  const [specialties, setSpecialties] = useState<string[]>(['Cucina Casalinga', 'Ricette di Famiglia']);
  const [newSpecialty, setNewSpecialty] = useState('');

  // Availability & Calendar Schedule State
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5, 6]); // Lun-Sab default
  const [selectedSlots, setSelectedSlots] = useState<string[]>(['12:00 - 15:00', '19:00 - 22:00']);
  const [customSlotStart, setCustomSlotStart] = useState('11:30');
  const [customSlotEnd, setCustomSlotEnd] = useState('14:30');

  // Media & Documents
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80');
  const [kitchenPhotos, setKitchenPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80'
  ]);

  // Documents
  const [documents, setDocuments] = useState<ChefDocument[]>([
    {
      id: 'doc-id-default',
      type: 'id_card',
      title: 'Carta d\'Identità / Passaporto',
      fileName: 'documento_identita_fronte_retro.pdf',
      fileSize: '1.2 MB',
      uploadedAt: new Date().toLocaleDateString('it-IT'),
      isVerified: true
    },
    {
      id: 'doc-haccp-default',
      type: 'haccp_certificate',
      title: 'Attestato Igienico HACCP',
      fileName: 'attestato_haccp_corrente.pdf',
      fileSize: '850 KB',
      uploadedAt: new Date().toLocaleDateString('it-IT'),
      isVerified: true
    }
  ]);

  // Proposed Dish
  const [proposedDishName, setProposedDishName] = useState('Specialità Tradizionale della Casa');
  const [proposedDishDesc, setProposedDishDesc] = useState('Piatto preparato fresco su ordinazione con ingredienti selezionati.');
  const [proposedDishPrice, setProposedDishPrice] = useState<number>(14.50);

  if (!isOpen) return null;

  // Day toggle
  const toggleDay = (dayId: number) => {
    setSelectedDays(prev => 
      prev.includes(dayId) ? prev.filter(d => d !== dayId) : [...prev, dayId].sort((a,b) => (a === 0 ? 7 : a) - (b === 0 ? 7 : b))
    );
  };

  const setPresetDays = (mode: 'all' | 'weekdays' | 'weekend') => {
    if (mode === 'all') setSelectedDays([1, 2, 3, 4, 5, 6, 0]);
    if (mode === 'weekdays') setSelectedDays([1, 2, 3, 4, 5]);
    if (mode === 'weekend') setSelectedDays([6, 0]);
  };

  // Time slot toggle
  const toggleSlot = (slotStr: string) => {
    setSelectedSlots(prev => 
      prev.includes(slotStr) ? prev.filter(s => s !== slotStr) : [...prev, slotStr]
    );
  };

  const handleAddCustomSlot = () => {
    if (customSlotStart && customSlotEnd) {
      const formatted = `${customSlotStart} - ${customSlotEnd}`;
      if (!selectedSlots.includes(formatted)) {
        setSelectedSlots(prev => [...prev, formatted]);
      }
    }
  };

  const handleRemoveSlot = (slotStr: string) => {
    setSelectedSlots(prev => prev.filter(s => s !== slotStr));
  };

  // File upload handlers
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKitchenPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setKitchenPhotos(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentFileUpload = (type: 'id_card' | 'haccp_certificate' | 'kitchen_hygiene' | 'other', title: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newDoc: ChefDocument = {
          id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          type,
          title,
          fileName: file.name,
          fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          fileData: typeof reader.result === 'string' ? reader.result : undefined,
          uploadedAt: new Date().toLocaleDateString('it-IT'),
          isVerified: false
        };
        setDocuments(prev => [...prev.filter(d => d.type !== type), newDoc]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveDoc = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const handleAddSpecialty = () => {
    if (newSpecialty.trim() && !specialties.includes(newSpecialty.trim())) {
      setSpecialties(prev => [...prev, newSpecialty.trim()]);
      setNewSpecialty('');
    }
  };

  const handleRemoveSpecialty = (spec: string) => {
    setSpecialties(prev => prev.filter(s => s !== spec));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const appId = `APP-CHEF-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    const newApplication: ChefApplication = {
      id: appId,
      userId: currentUser?.id,
      fullName: fullName || 'Nuovo Cuoco MESA',
      brandName: brandName || fullName || 'Chef Casalingo MESA',
      email: email || `chef.${Date.now()}@mesa.com`,
      phone: phone || '+393475552026',
      nationality: nationality || '🇮🇹',
      countryName: countryName || 'Italia',
      continent: continent || 'Europa',
      location: location || 'Milano, Centro',
      bio: bio || 'Appassionato/a di cucina autentica casalinga.',
      specialties: specialties.length > 0 ? specialties : ['Cucina Casalinga'],
      avatarUrl: avatarUrl,
      kitchenPhotos: kitchenPhotos,
      documents: documents,
      proposedDishName: proposedDishName,
      proposedDishDesc: proposedDishDesc,
      proposedDishPrice: proposedDishPrice || 14.50,
      availableDays: selectedDays.length > 0 ? selectedDays : [1, 2, 3, 4, 5, 6],
      availabilitySlots: selectedSlots.length > 0 ? selectedSlots : ['12:00 - 15:00', '19:00 - 22:00'],
      status: 'pending',
      submittedAt: new Date().toLocaleString('it-IT')
    };

    // Also build chef profile
    const newChef: Chef = {
      id: `chef-${appId.toLowerCase()}`,
      name: brandName || fullName || 'Nuovo Cuoco MESA',
      nationality: nationality || '🇮🇹',
      countryName: countryName || 'Italia',
      continent: continent || 'Europa',
      avatar: avatarUrl,
      rating: 5.0,
      location: location || 'Milano, Centro',
      phone: phone || '+393475552026',
      email: email || `chef.${Date.now()}@mesa.com`,
      password: 'demo123',
      specialties: specialties,
      bio: bio || 'Ricette artigianali e sapori autentici di casa.',
      availability: selectedSlots.length > 0 ? selectedSlots : ['19:00 - 22:00'],
      availableDays: selectedDays.length > 0 ? selectedDays : [1, 2, 3, 4, 5, 6],
      reviews: [],
      dishes: [
        {
          id: `dish-${Date.now()}`,
          name: proposedDishName,
          description: proposedDishDesc,
          price: proposedDishPrice || 14.50,
          image: kitchenPhotos[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
          chefId: `chef-${appId.toLowerCase()}`,
          tags: specialties
        }
      ],
      distance: 1.2,
      verificationStatus: 'pending',
      documents: documents
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setSubmittedAppId(appId);

      if (onSubmitApplication) {
        onSubmitApplication(newApplication);
      }
      if (onChefCreate) {
        onChefCreate(newChef);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-black/90 backdrop-blur-xl animate-fade-in" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-3xl rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl overflow-hidden my-auto border border-gray-100 z-10">
        
        {/* Header Branding */}
        <div className="bg-black p-6 sm:p-8 text-white flex items-center justify-between border-b-8 border-orange-600">
           <div className="flex items-center gap-4 sm:gap-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl sm:rounded-[1.5rem] flex items-center justify-center shadow-xl shrink-0">
                 <ChefHat className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                 <div className="flex items-center gap-2 mb-1">
                   <span className="text-[9px] font-black bg-orange-600 text-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                     MESA Partner Program
                   </span>
                 </div>
                 <h2 className="text-2xl sm:text-3xl font-black italic tracking-tighter leading-none text-white">
                   Candidatura & Verifica Cuoco
                 </h2>
              </div>
           </div>
           <button onClick={onClose} className="p-2.5 sm:p-3 hover:bg-white/10 rounded-full transition-colors text-gray-400">
             <X className="w-6 h-6" />
           </button>
        </div>

        <div className="p-6 sm:p-10 max-h-[80vh] overflow-y-auto">
          {isSuccess ? (
            <div className="text-center py-10 sm:py-16 animate-fade-in space-y-6">
               <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <Check className="w-10 h-10 sm:w-12 sm:h-12 stroke-[3]" />
               </div>
               
               <div>
                 <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                   ID Candidatura: {submittedAppId}
                 </span>
                 <h3 className="text-3xl sm:text-4xl font-black italic text-gray-900 mt-3 mb-2">
                   Candidatura Inviata con Successo!
                 </h3>
                 <p className="text-gray-600 font-medium max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
                   La tua documentazione (HACCP e Documento d'Identità) è stata inoltrata all'<strong>Amministratore MESA</strong>. Valuteremo la tua cucina entro 24 ore lavorative per attivarne la pubblicazione ufficiale nel catalogo.
                 </p>
               </div>

               <div className="p-6 bg-orange-50 border border-orange-200 rounded-3xl text-left max-w-md mx-auto space-y-3">
                 <div className="flex items-center gap-2 text-orange-800 font-black text-xs uppercase tracking-wider">
                   <ShieldCheck className="w-4 h-4 text-orange-600" />
                   Stato: In Fase di Valutazione
                 </div>
                 <p className="text-xs text-orange-950 font-medium leading-relaxed">
                   Puoi accedere al Cockpit Admin MESA tramite il tasto <span className="font-bold">"Admin"</span> nella barra di navigazione per simulare la verifica, convalidare i documenti e attivare immediatamente il tuo profilo!
                 </p>
               </div>

               <button 
                 onClick={onClose}
                 className="px-8 py-4 bg-black text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-orange-600 transition-all shadow-xl"
               >
                 Chiudi e Monitora Candidatura
               </button>
            </div>
          ) : (
            <>
              {/* Step Progress Bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 overflow-x-auto gap-1">
                  <span className={step >= 1 ? 'text-orange-600 font-extrabold whitespace-nowrap' : 'whitespace-nowrap'}>1. Profilo</span>
                  <span className={step >= 2 ? 'text-orange-600 font-extrabold whitespace-nowrap' : 'whitespace-nowrap'}>2. Foto</span>
                  <span className={step >= 3 ? 'text-orange-600 font-extrabold whitespace-nowrap' : 'whitespace-nowrap'}>3. HACCP</span>
                  <span className={step >= 4 ? 'text-orange-600 font-extrabold whitespace-nowrap' : 'whitespace-nowrap'}>4. Calendario & Orari</span>
                  <span className={step >= 5 ? 'text-orange-600 font-extrabold whitespace-nowrap' : 'whitespace-nowrap'}>5. Primo Piatto</span>
                </div>
                <div className="flex gap-1.5">
                   {[1, 2, 3, 4, 5].map(i => (
                     <div key={i} className={`h-2 flex-1 rounded-full transition-all duration-300 ${step >= i ? 'bg-orange-600' : 'bg-gray-100'}`} />
                   ))}
                </div>
              </div>

              {/* STEP 1: Dati Identità & Contatto */}
              {step === 1 && (
                <div className="animate-fade-in text-left space-y-6">
                   <div className="border-b border-gray-100 pb-4">
                     <h3 className="text-xl sm:text-2xl font-black italic tracking-tight text-gray-900 flex items-center gap-2.5">
                        <User className="w-6 h-6 text-orange-600" /> Dati Anagrafici & Contatto
                     </h3>
                     <p className="text-xs text-gray-500 font-medium mt-1">Inserisci i tuoi dati personali per la registrazione ufficiale MESA.</p>
                   </div>

                   <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Nome e Cognome Completo *</label>
                          <input 
                            type="text" 
                            value={fullName} 
                            onChange={(e) => setFullName(e.target.value)} 
                            placeholder="es. Noel Niamkey" 
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 font-bold text-sm" 
                            required 
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Nome d'Arte / Brand della Cucina *</label>
                          <input 
                            type="text" 
                            value={brandName} 
                            onChange={(e) => setBrandName(e.target.value)} 
                            placeholder="es. Chef Noel - Cucina Ivoriana" 
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 font-bold text-sm" 
                            required 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Email di Contatto / Accesso *</label>
                          <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="es. chef.noel@gmail.com" 
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 font-bold text-sm" 
                            required 
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Telefono / WhatsApp (per gli Ordini) *</label>
                          <input 
                            type="text" 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)} 
                            placeholder="es. +39 347 555 2026" 
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 font-mono font-bold text-sm" 
                            required 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Bandiera Paese</label>
                          <input 
                            type="text" 
                            value={nationality} 
                            onChange={(e) => setNationality(e.target.value)} 
                            placeholder="es. 🇨🇮" 
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 font-bold text-sm text-center" 
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Nome Paese</label>
                          <input 
                            type="text" 
                            value={countryName} 
                            onChange={(e) => setCountryName(e.target.value)} 
                            placeholder="es. Costa d'Avorio" 
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 font-bold text-sm" 
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Continente</label>
                          <select
                            value={continent}
                            onChange={(e) => setContinent(e.target.value as Continent)}
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 font-bold text-xs"
                          >
                            <option value="Europa">Europa</option>
                            <option value="Africa">Africa</option>
                            <option value="Asia">Asia</option>
                            <option value="Americhe">Americhe</option>
                            <option value="Oceania">Oceania</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Indirizzo Sede Cucina (Città & Quartiere) *</label>
                        <input 
                          type="text" 
                          value={location} 
                          onChange={(e) => setLocation(e.target.value)} 
                          placeholder="es. Milano, Zona Certosa / Porta Venezia" 
                          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 font-bold text-sm" 
                          required 
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Presentazione & Storia del Cuoco</label>
                        <textarea 
                          value={bio} 
                          onChange={(e) => setBio(e.target.value)} 
                          placeholder="Racconta brevemente la tua passione, le ricette di famiglia che proponi e la tua filosofia culinaria..." 
                          rows={3} 
                          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 font-medium text-sm resize-none" 
                        />
                      </div>
                   </div>
                </div>
              )}

              {/* STEP 2: Foto Profilo & Foto Spazio Cottura */}
              {step === 2 && (
                <div className="animate-fade-in text-left space-y-6">
                   <div className="border-b border-gray-100 pb-4">
                     <h3 className="text-xl sm:text-2xl font-black italic tracking-tight text-gray-900 flex items-center gap-2.5">
                        <Camera className="w-6 h-6 text-orange-600" /> Foto Profilo & Spazio Cottura
                     </h3>
                     <p className="text-xs text-gray-500 font-medium mt-1">Carica o seleziona le immagini della tua cucina e della tua figura da Cuoco MESA.</p>
                   </div>

                   <div className="space-y-6">
                      {/* Avatar Upload */}
                      <div>
                        <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">Foto Profilo dello Chef *</label>
                        <div className="flex flex-col sm:flex-row items-center gap-4 p-5 bg-gray-50 border border-gray-200 rounded-3xl">
                          <img 
                            src={avatarUrl} 
                            alt="Avatar Preview" 
                            className="w-20 h-20 rounded-2xl object-cover shadow-md border-2 border-orange-500/30 shrink-0" 
                          />
                          <div className="flex-1 space-y-2 text-center sm:text-left">
                            <p className="text-xs font-bold text-gray-900">Seleziona o carica una foto del tuo volto o abito da cucina</p>
                            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                              <label className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer shadow transition-all flex items-center gap-1.5">
                                <Upload className="w-3.5 h-3.5" /> Carica dal dispositivo
                                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Kitchen Photos */}
                      <div>
                        <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">Foto della Cucina / Spazio Cottura</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {kitchenPhotos.map((photo, idx) => (
                            <div key={idx} className="relative group rounded-2xl overflow-hidden border border-gray-200 h-28 bg-gray-100">
                              <img src={photo} alt={`Kitchen ${idx}`} className="w-full h-full object-cover" />
                              <button 
                                onClick={() => setKitchenPhotos(prev => prev.filter((_, i) => i !== idx))}
                                className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                          <label className="border-2 border-dashed border-gray-300 hover:border-orange-500 rounded-2xl h-28 flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-colors bg-gray-50 hover:bg-orange-50/30">
                            <Upload className="w-6 h-6 text-gray-400 mb-1" />
                            <span className="text-[10px] font-black text-gray-600 uppercase">Aggiungi Foto</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleKitchenPhotoUpload} />
                          </label>
                        </div>
                      </div>

                      {/* Tag Specialità */}
                      <div>
                        <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">Tag Specialità Culinarie</label>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {specialties.map((spec, i) => (
                            <span key={i} className="px-3 py-1.5 bg-orange-100 text-orange-800 border border-orange-200 rounded-xl text-xs font-black flex items-center gap-1.5">
                              {spec}
                              <button onClick={() => handleRemoveSpecialty(spec)} className="text-orange-600 hover:text-red-600">
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={newSpecialty} 
                            onChange={(e) => setNewSpecialty(e.target.value)} 
                            placeholder="Aggiungi specialità (es. Garba, Couscous, Lasagne...)" 
                            className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold" 
                          />
                          <button 
                            type="button" 
                            onClick={handleAddSpecialty}
                            className="px-4 py-3 bg-black text-white font-black text-xs uppercase tracking-wider rounded-xl hover:bg-orange-600"
                          >
                            Aggiungi
                          </button>
                        </div>
                      </div>
                   </div>
                </div>
              )}

              {/* STEP 3: Documenti Ufficiali & Verifiche Igieniche */}
              {step === 3 && (
                <div className="animate-fade-in text-left space-y-6">
                   <div className="border-b border-gray-100 pb-4">
                     <h3 className="text-xl sm:text-2xl font-black italic tracking-tight text-gray-900 flex items-center gap-2.5">
                        <ShieldCheck className="w-6 h-6 text-green-600" /> Verifica Documenti & HACCP
                     </h3>
                     <p className="text-xs text-gray-500 font-medium mt-1">
                       Per la conformità igienico-sanitaria MESA, carica i documenti richiesti per la valutazione da parte dell'Amministratore.
                     </p>
                   </div>

                   <div className="space-y-4">
                      {/* Documento D'Identità */}
                      <div className="p-5 border border-gray-200 rounded-3xl bg-gray-50 hover:border-orange-500/50 transition-all">
                        <div className="flex items-center justify-between gap-4 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center font-bold">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-extrabold text-sm text-gray-900">1. Documento d'Identità / Passaporto</h4>
                              <p className="text-[10px] text-gray-500 font-bold uppercase">Copia fronte/retro in corso di validità</p>
                            </div>
                          </div>
                          
                          <label className="px-3.5 py-2 bg-black hover:bg-orange-600 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer transition-all shrink-0">
                            Carica File
                            <input type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden" onChange={handleDocumentFileUpload('id_card', 'Documento d\'Identità')} />
                          </label>
                        </div>

                        {documents.find(d => d.type === 'id_card') ? (
                          <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-gray-200 text-xs">
                            <div className="flex items-center gap-2 truncate">
                              <FileCheck className="w-4 h-4 text-green-600 shrink-0" />
                              <span className="font-mono font-bold text-gray-800 truncate">{documents.find(d => d.type === 'id_card')?.fileName}</span>
                              <span className="text-[9px] text-gray-400">({documents.find(d => d.type === 'id_card')?.fileSize})</span>
                            </div>
                            <span className="text-[9px] font-black uppercase bg-green-100 text-green-700 px-2 py-0.5 rounded-md shrink-0">
                              Pronto
                            </span>
                          </div>
                        ) : (
                          <p className="text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-center gap-1.5 font-bold">
                            <AlertCircle className="w-4 h-4 shrink-0" /> Documento d'identità in attesa di caricamento
                          </p>
                        )}
                      </div>

                      {/* Attestato HACCP */}
                      <div className="p-5 border border-gray-200 rounded-3xl bg-gray-50 hover:border-orange-500/50 transition-all">
                        <div className="flex items-center justify-between gap-4 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 text-green-700 rounded-xl flex items-center justify-center font-bold">
                              <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-extrabold text-sm text-gray-900">2. Attestato Igienico-Sanitario HACCP</h4>
                              <p className="text-[10px] text-gray-500 font-bold uppercase">Obbligatorio per la vendita di cibo preparato in casa</p>
                            </div>
                          </div>

                          <label className="px-3.5 py-2 bg-black hover:bg-orange-600 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer transition-all shrink-0">
                            Carica HACCP
                            <input type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden" onChange={handleDocumentFileUpload('haccp_certificate', 'Certificato HACCP')} />
                          </label>
                        </div>

                        {documents.find(d => d.type === 'haccp_certificate') ? (
                          <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-gray-200 text-xs">
                            <div className="flex items-center gap-2 truncate">
                              <FileCheck className="w-4 h-4 text-green-600 shrink-0" />
                              <span className="font-mono font-bold text-gray-800 truncate">{documents.find(d => d.type === 'haccp_certificate')?.fileName}</span>
                              <span className="text-[9px] text-gray-400">({documents.find(d => d.type === 'haccp_certificate')?.fileSize})</span>
                            </div>
                            <span className="text-[9px] font-black uppercase bg-green-100 text-green-700 px-2 py-0.5 rounded-md shrink-0">
                              Pronto
                            </span>
                          </div>
                        ) : (
                          <p className="text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-center gap-1.5 font-bold">
                            <AlertCircle className="w-4 h-4 shrink-0" /> Attestato HACCP in attesa di caricamento
                          </p>
                        )}
                      </div>

                      {/* Lista Tutti Documenti Caricati */}
                      {documents.length > 0 && (
                        <div className="p-4 bg-white border border-gray-200 rounded-3xl space-y-2">
                          <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Riepilogo File Inoltrati ({documents.length})</h5>
                          {documents.map(doc => (
                            <div key={doc.id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl text-xs border border-gray-100">
                              <div className="flex items-center gap-2 min-w-0">
                                <FileText className="w-4 h-4 text-orange-600 shrink-0" />
                                <span className="font-bold text-gray-900 truncate">{doc.title}</span>
                                <span className="text-[10px] font-mono text-gray-400 hidden sm:inline">({doc.fileName})</span>
                              </div>
                              <button onClick={() => handleRemoveDoc(doc.id)} className="p-1 text-gray-400 hover:text-red-600">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-center gap-3">
                         <input type="checkbox" id="terms-check" defaultChecked={true} className="w-5 h-5 accent-orange-600 rounded-md" />
                         <label htmlFor="terms-check" className="text-xs font-bold text-gray-800 leading-tight">
                           Dichiaro che le informazioni fornite sono veritiere e che autorizzo l'Amministratore MESA alla verifica della conformità igienica.
                         </label>
                      </div>
                   </div>
                </div>
              )}

              {/* STEP 4: Calendario Disponibilità & Orari */}
              {step === 4 && (
                <div className="animate-fade-in text-left space-y-6">
                   <div className="border-b border-gray-100 pb-4">
                     <h3 className="text-xl sm:text-2xl font-black italic tracking-tight text-gray-900 flex items-center gap-2.5">
                        <CalendarDays className="w-6 h-6 text-orange-600" /> Calendario Disponibilità & Orari
                     </h3>
                     <p className="text-xs text-gray-500 font-medium mt-1">
                       Seleziona i giorni della settimana in cui sei pronto a cucinare e imposta le tue fasce orarie per gli ordini.
                     </p>
                   </div>

                   {/* Quick Presets for Days */}
                   <div className="space-y-3">
                     <div className="flex items-center justify-between flex-wrap gap-2">
                       <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest">
                         1. Seleziona i Giorni di Attività ({selectedDays.length}/7 Attivi) *
                       </label>
                       <div className="flex gap-1.5">
                         <button 
                           type="button" 
                           onClick={() => setPresetDays('all')}
                           className="text-[9px] font-black uppercase px-2.5 py-1 bg-gray-100 hover:bg-orange-100 hover:text-orange-800 text-gray-700 rounded-lg transition-colors"
                         >
                           Tutti (7/7)
                         </button>
                         <button 
                           type="button" 
                           onClick={() => setPresetDays('weekdays')}
                           className="text-[9px] font-black uppercase px-2.5 py-1 bg-gray-100 hover:bg-orange-100 hover:text-orange-800 text-gray-700 rounded-lg transition-colors"
                         >
                           Lun-Ven
                         </button>
                         <button 
                           type="button" 
                           onClick={() => setPresetDays('weekend')}
                           className="text-[9px] font-black uppercase px-2.5 py-1 bg-gray-100 hover:bg-orange-100 hover:text-orange-800 text-gray-700 rounded-lg transition-colors"
                         >
                           Sab-Dom
                         </button>
                       </div>
                     </div>

                     {/* Weekdays Interactive Buttons */}
                     <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                       {WEEKDAYS.map(day => {
                         const isSelected = selectedDays.includes(day.id);
                         return (
                           <button
                             key={day.id}
                             type="button"
                             onClick={() => toggleDay(day.id)}
                             className={`p-2 sm:p-3 rounded-2xl flex flex-col items-center justify-center border transition-all text-center ${
                               isSelected 
                                 ? 'bg-black text-white border-black shadow-md scale-[1.02]' 
                                 : 'bg-gray-50 text-gray-400 border-gray-200 hover:border-gray-300'
                             }`}
                           >
                             <span className="text-[10px] font-black uppercase tracking-wider hidden sm:inline">{day.short}</span>
                             <span className="text-xs font-black uppercase sm:hidden">{day.flag}</span>
                             <div className={`w-2 h-2 rounded-full mt-1.5 ${isSelected ? 'bg-orange-500' : 'bg-gray-300'}`} />
                           </button>
                         );
                       })}
                     </div>
                     {selectedDays.length === 0 && (
                       <p className="text-[11px] text-amber-700 font-bold bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-center gap-1.5">
                         <AlertCircle className="w-4 h-4" /> Seleziona almeno un giorno di operatività per il tuo profilo cuoco.
                       </p>
                     )}
                   </div>

                   {/* Time Slots Selector */}
                   <div className="space-y-3 pt-2">
                     <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest">
                       2. Fasce Orarie Preferite per la Preparazione & Consegna
                     </label>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                       {PRESET_TIME_SLOTS.map(slotItem => {
                         const isSlotActive = selectedSlots.includes(slotItem.slot);
                         const IconComponent = slotItem.icon;
                         return (
                           <div
                             key={slotItem.id}
                             onClick={() => toggleSlot(slotItem.slot)}
                             className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                               isSlotActive 
                                 ? 'border-orange-500 bg-orange-50/50 shadow-sm' 
                                 : 'border-gray-200 bg-gray-50/60 hover:border-gray-300'
                             }`}
                           >
                             <div className={`p-2.5 rounded-xl shrink-0 ${isSlotActive ? 'bg-orange-600 text-black' : 'bg-gray-200 text-gray-600'}`}>
                               <IconComponent className="w-5 h-5" />
                             </div>
                             <div className="flex-1 min-w-0">
                               <div className="flex items-center justify-between">
                                 <h5 className="font-extrabold text-xs text-gray-900">{slotItem.label}</h5>
                                 <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${isSlotActive ? 'bg-orange-200 text-orange-900' : 'bg-gray-200 text-gray-600'}`}>
                                   {slotItem.slot}
                                 </span>
                               </div>
                               <p className="text-[10px] text-gray-500 font-medium mt-1 leading-snug">{slotItem.desc}</p>
                             </div>
                           </div>
                         );
                       })}
                     </div>

                     {/* Custom Time Range Picker */}
                     <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-3">
                       <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest">
                         Oppure Aggiungi un Orario Personalizzato
                       </label>
                       <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                         <div className="flex items-center gap-1.5 bg-white px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-800">
                           <span>Dalle</span>
                           <input 
                             type="time" 
                             value={customSlotStart} 
                             onChange={(e) => setCustomSlotStart(e.target.value)} 
                             className="bg-transparent font-mono outline-none cursor-pointer"
                           />
                         </div>
                         <div className="flex items-center gap-1.5 bg-white px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-800">
                           <span>Alle</span>
                           <input 
                             type="time" 
                             value={customSlotEnd} 
                             onChange={(e) => setCustomSlotEnd(e.target.value)} 
                             className="bg-transparent font-mono outline-none cursor-pointer"
                           />
                         </div>
                         <button
                           type="button"
                           onClick={handleAddCustomSlot}
                           className="px-4 py-2.5 bg-black hover:bg-orange-600 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all"
                         >
                           <Plus className="w-3.5 h-3.5" /> Aggiungi
                         </button>
                       </div>
                     </div>

                     {/* Active Slots Tags */}
                     {selectedSlots.length > 0 && (
                       <div className="flex flex-wrap gap-2 pt-1">
                         <span className="text-[10px] font-bold text-gray-400 uppercase py-1">Fasce Attive:</span>
                         {selectedSlots.map(slotStr => (
                           <span key={slotStr} className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-white rounded-xl text-xs font-mono font-bold">
                             <Clock className="w-3 h-3 text-orange-400" /> {slotStr}
                             <button type="button" onClick={() => handleRemoveSlot(slotStr)} className="text-gray-400 hover:text-red-400 ml-1">
                               <X className="w-3 h-3" />
                             </button>
                           </span>
                         ))}
                       </div>
                     )}
                   </div>

                   {/* Weekly Schedule Visual Matrix */}
                   <div className="p-5 bg-gray-900 text-white rounded-3xl space-y-3">
                     <div className="flex items-center justify-between border-b border-white/10 pb-2">
                       <span className="text-xs font-black uppercase tracking-wider text-orange-400 flex items-center gap-2">
                         <Calendar className="w-4 h-4" /> Anteprima Calendario Settimanale
                       </span>
                       <span className="text-[10px] font-mono text-gray-400">
                         {selectedDays.length} Giorni Attivi • {selectedSlots.length} Fasce
                       </span>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                       {WEEKDAYS.map(day => {
                         const isActive = selectedDays.includes(day.id);
                         return (
                           <div key={day.id} className={`p-2.5 rounded-xl border flex items-center justify-between ${
                             isActive ? 'bg-white/5 border-orange-500/30 text-white' : 'bg-transparent border-white/5 text-gray-600'
                           }`}>
                             <div className="flex items-center gap-2 font-bold">
                               <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400' : 'bg-gray-600'}`} />
                               <span>{day.label}</span>
                             </div>
                             <span className={`text-[10px] font-mono ${isActive ? 'text-orange-300 font-bold' : 'text-gray-600'}`}>
                               {isActive ? (selectedSlots.join(' | ') || 'Aperto') : 'Chiuso'}
                             </span>
                           </div>
                         );
                       })}
                     </div>
                   </div>
                </div>
              )}

              {/* STEP 5: Proposta Primo Piatto & Invio */}
              {step === 5 && (
                <div className="animate-fade-in text-left space-y-6">
                   <div className="border-b border-gray-100 pb-4">
                     <h3 className="text-xl sm:text-2xl font-black italic tracking-tight text-gray-900 flex items-center gap-2.5">
                        <Sparkles className="w-6 h-6 text-purple-600" /> Il Tuo Primo Piatto da Pubblicare
                     </h3>
                     <p className="text-xs text-gray-500 font-medium mt-1">Inserisci la tua specialità principale per il debutto nel catalogo MESA.</p>
                   </div>

                   <div className="space-y-4">
                      <div>
                        <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Nome del Piatto Forte *</label>
                        <input 
                          type="text" 
                          value={proposedDishName} 
                          onChange={(e) => setProposedDishName(e.target.value)} 
                          placeholder="es. Attiéké con Pesce Fritto (Garba Ivoriano)" 
                          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 font-bold text-sm" 
                          required 
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Prezzo Proposto (€) *</label>
                          <input 
                            type="number" 
                            step="0.50"
                            value={proposedDishPrice} 
                            onChange={(e) => setProposedDishPrice(parseFloat(e.target.value) || 0)} 
                            placeholder="14.50" 
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 font-mono font-bold text-sm" 
                            required 
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Disponibilità Selezionata</label>
                          <div className="p-3.5 bg-orange-50 border border-orange-200 rounded-2xl text-xs font-bold text-orange-950 flex items-center gap-2">
                            <CalendarDays className="w-4 h-4 text-orange-600 shrink-0" />
                            <span>{selectedDays.length} giorni/sett. ({selectedSlots.join(', ') || 'Fasce aperte'})</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Descrizione & Ingredienti Chiave *</label>
                        <textarea 
                          value={proposedDishDesc} 
                          onChange={(e) => setProposedDishDesc(e.target.value)} 
                          placeholder="Descrivi la preparazione, la provenienza degli ingredienti e le particolarità del gusto..." 
                          rows={3} 
                          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 font-medium text-sm resize-none" 
                          required 
                        />
                      </div>

                      {/* Summary Box */}
                      <div className="p-5 bg-gray-900 text-white rounded-3xl space-y-3">
                        <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                          <span className="text-gray-400 font-bold uppercase text-[9px]">Cuoco Candidato</span>
                          <span className="font-bold text-orange-400">{fullName} ({brandName})</span>
                        </div>
                        <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                          <span className="text-gray-400 font-bold uppercase text-[9px]">Sede & Contatto</span>
                          <span className="font-bold text-white">{location} • {phone}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                          <span className="text-gray-400 font-bold uppercase text-[9px]">Calendario Attivo</span>
                          <span className="font-bold text-amber-300">{selectedDays.length} giorni/sett. ({selectedSlots.length} fasce orarie)</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400 font-bold uppercase text-[9px]">Documenti Allegati</span>
                          <span className="font-bold text-green-400">{documents.length} File Pronti per la Revisione</span>
                        </div>
                      </div>
                   </div>
                </div>
              )}

              {/* Action Navigation Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                 <button 
                  onClick={() => step > 1 ? setStep(step - 1) : onClose()}
                  className="px-6 py-4 text-gray-500 font-black uppercase tracking-widest text-xs hover:text-black transition-colors"
                 >
                   {step === 1 ? 'Annulla' : 'Indietro'}
                 </button>
                 
                 {step < 5 ? (
                   <button 
                    onClick={() => setStep(step + 1)}
                    className="px-8 py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-orange-600 transition-all shadow-xl active:scale-95"
                   >
                     <span>Continua</span>
                     <ArrowRight className="w-4 h-4" />
                   </button>
                 ) : (
                   <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-10 py-4.5 bg-orange-600 hover:bg-orange-500 text-black rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all shadow-xl shadow-orange-600/30 active:scale-95 disabled:opacity-50"
                   >
                     {isSubmitting ? (
                       <>
                         <Loader2 className="w-4 h-4 animate-spin" />
                         <span>Inoltro Candidatura...</span>
                       </>
                     ) : (
                       <>
                         <Check className="w-4 h-4 stroke-[3]" />
                         <span>Invia Candidatura Finale</span>
                       </>
                     )}
                   </button>
                 )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
