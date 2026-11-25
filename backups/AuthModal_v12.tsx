import React, { useState, useEffect } from 'react';
import { X, User, ChefHat, ShieldCheck, MapPin, Eye, EyeOff, Smartphone, Sparkles } from 'lucide-react';
import { AppUser, UserAddress, Chef } from '../types';
import { auth, isFirebaseConfigured } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { ImagePickerBox } from './ImagePickerBox';
import { PORDENONE_COMUNI, findPordenoneComune, isPordenoneLocation, resolvePordenoneZip } from './italianTerritoryData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  registeredUsers: AppUser[];
  chefs?: Chef[];
  initialRole?: 'client' | 'chef' | 'admin';
  onLoginSuccess: (user: AppUser, isNewRegistration?: boolean) => void;
  onRegisterUser: (user: AppUser) => Promise<void> | void;
  onOpenOnboarding?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  registeredUsers,
  chefs = [],
  initialRole,
  onLoginSuccess,
  onRegisterUser,
  onOpenOnboarding
}) => {
  const [role, setRole] = useState<'client' | 'chef' | 'admin'>(initialRole || 'client');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Basic Fields
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Address block for registration
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialRole) {
        setRole(initialRole);
        setMode('login');
        if (initialRole === 'admin') {
          setEmail('admin@mesa.com');
        } else {
          setEmail(prev => (prev === 'admin@mesa.com' ? '' : prev));
        }
      }
      setErrorMsg('');
      setIsSubmitting(false);
    }
  }, [isOpen, initialRole]);

  if (!isOpen) return null;

  // Map Firebase Auth error codes to friendly Italian messages
  const translateAuthError = (err: unknown): string => {
    const code = (err as { code?: string })?.code || '';
    switch (code) {
      case 'auth/user-not-found':
        return 'Nessun account trovato con questa email. Registrati per iniziare!';
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'La password inserita non è corretta. Riprova.';
      case 'auth/email-already-in-use':
        return 'Questa email è già registrata su MESA.';
      case 'auth/invalid-email':
        return 'Indirizzo email non valido. Controlla e riprova.';
      case 'auth/weak-password':
        return 'Password troppo debole: usa almeno 6 caratteri.';
      case 'auth/network-request-failed':
        return 'Errore di rete. Controlla la connessione e riprova.';
      case 'auth/popup-closed-by-user':
      case 'auth/cancelled-popup-request':
        return 'Accesso con Google annullato.';
      case 'auth/account-exists-with-different-credential':
        return 'Esiste già un account con questa email usando un altro metodo di accesso.';
      case 'auth/operation-not-allowed':
      case 'auth/admin-restricted-operation':
        return 'Accesso Email/Password gestito tramite profilo MESA.';
      default:
        return 'Si è verificato un errore. Riprova.';
    }
  };

  // Build an AppUser record from a Firebase Auth user
  const buildUserFromFirebase = (
    fbUser: { uid: string; email?: string | null; displayName?: string | null; photoURL?: string | null },
    targetRole: 'client' | 'chef' | 'admin'
  ): AppUser => {
    const displayName = fbUser.displayName || '';
    const [fbName, ...fbLastNameParts] = displayName.split(' ');
    return {
      id: `usr-${fbUser.uid.slice(0, 6).toUpperCase()}`,
      name: fbName.trim() || 'Utente',
      lastName: fbLastNameParts.join(' ').trim() || 'Mesa',
      email: (fbUser.email || email).trim().toLowerCase(),
      ...(fbUser.photoURL ? { avatarUrl: fbUser.photoURL } : {}),
      role: targetRole,
      addresses: [],
      createdAt: new Date().toLocaleDateString('it-IT'),
      password: password || undefined
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const normalizedInputEmail = email.trim().toLowerCase();

    try {
      if (mode === 'login') {
        // 1) Try Firebase Auth first if configured, falling back cleanly if Email/Password isn't enabled or user is in Firestore
        if (isFirebaseConfigured && auth) {
          try {
            const cred = await signInWithEmailAndPassword(auth, normalizedInputEmail, password);
            const existing = registeredUsers.find(
              u => u.email.trim().toLowerCase() === (cred.user.email || normalizedInputEmail).trim().toLowerCase()
            );
            if (existing) {
              onLoginSuccess(existing, false);
            } else {
              const newUser = buildUserFromFirebase(cred.user, role);
              await onRegisterUser(newUser);
              onLoginSuccess(newUser, false);
            }
            onClose();
            return;
          } catch (err) {
            const code = (err as { code?: string })?.code || '';
            const shouldFallbackToFirestore =
              code === 'auth/user-not-found' ||
              code === 'auth/wrong-password' ||
              code === 'auth/invalid-credential' ||
              code === 'auth/invalid-email' ||
              code === 'auth/operation-not-allowed' ||
              code === 'auth/admin-restricted-operation' ||
              code === 'auth/too-many-requests';
            if (!shouldFallbackToFirestore) {
              setErrorMsg(translateAuthError(err));
              return;
            }
          }
        }

        // 2) Firestore-backed MESA user / catalog chef account verification
        const match = registeredUsers.find(
          u => u.email.trim().toLowerCase() === normalizedInputEmail && u.role === role
        );
        if (match) {
          const expectedPassword = match.password || 'demo123';
          if (password !== expectedPassword) {
            setErrorMsg('La password inserita non è corretta. Riprova.');
            return;
          }
          onLoginSuccess(match, false);
          onClose();
          return;
        }

        // Check if registered under another role to give helpful message
        const otherRoleMatch = registeredUsers.find(
          u => u.email.trim().toLowerCase() === normalizedInputEmail
        );
        if (otherRoleMatch && role !== 'admin') {
          const roleLabel = otherRoleMatch.role === 'chef' ? 'Cuoco' : otherRoleMatch.role === 'admin' ? 'Admin' : 'Cliente';
          setErrorMsg(`Questa email è registrata come ${roleLabel}. Seleziona la scheda "${roleLabel}" in alto per accedere.`);
          return;
        }

        if (role === 'chef') {
          const chefMatch = chefs.find(
            c => (c.email || '').trim().toLowerCase() === normalizedInputEmail
          );
          if (chefMatch) {
            const expectedPassword = chefMatch.password || 'demo123';
            if (password !== expectedPassword) {
              setErrorMsg('La password inserita non è corretta. Riprova.');
              return;
            }
            const nameParts = chefMatch.name.trim().split(' ');
            const linkedChefUser: AppUser = {
              id: chefMatch.id.startsWith('chef-') ? chefMatch.id.replace('chef-', '') : `usr-${chefMatch.id}`,
              name: nameParts[0] || chefMatch.name,
              lastName: nameParts.slice(1).join(' ') || 'Chef',
              email: (chefMatch.email || normalizedInputEmail).trim().toLowerCase(),
              phone: chefMatch.phone,
              brandName: chefMatch.name,
              role: 'chef',
              addresses: chefMatch.location
                ? [{
                    id: `addr-${chefMatch.id}`,
                    street: chefMatch.location,
                    city: `${findPordenoneComune(chefMatch.location)?.name || 'Pordenone'} (PN)`,
                    zip: resolvePordenoneZip(chefMatch.location),
                    isVerified: true
                  }]
                : [],
              createdAt: new Date().toLocaleDateString('it-IT'),
              password: expectedPassword
            };
            await onRegisterUser(linkedChefUser);
            onLoginSuccess(linkedChefUser, false);
            onClose();
            return;
          }
        }
        setErrorMsg(`Account ${role === 'chef' ? 'Cuoco' : role === 'admin' ? 'Admin' : 'Cliente'} non trovato con questa email. Registrati per iniziare!`);
      } else {
        // Registration logic
        if (!normalizedInputEmail || !normalizedInputEmail.includes('@')) {
          setErrorMsg('Inserisci un indirizzo email valido.');
          return;
        }
        if (password.length < 4) {
          setErrorMsg('La password deve contenere almeno 4 caratteri.');
          return;
        }
        if (role === 'chef' && !phone.trim()) {
          setErrorMsg('Inserisci un numero di telefono / WhatsApp per le verifiche cuoco.');
          return;
        }
        if (role === 'chef' && (!isPordenoneLocation(city) || (zip.trim() !== '' && !isPordenoneLocation('', zip)))) {
          setErrorMsg('I cuochi MESA operano esclusivamente nella Provincia di Pordenone (PN). Seleziona un comune della Provincia di Pordenone.');
          return;
        }

        const existsInUsers = registeredUsers.some(u => u.email.trim().toLowerCase() === normalizedInputEmail);
        const existsInChefs = chefs.some(c => (c.email || '').trim().toLowerCase() === normalizedInputEmail);
        if (existsInUsers || existsInChefs) {
          setErrorMsg('Questa email è già registrata su MESA.');
          return;
        }

        let firebaseUid = '';
        if (isFirebaseConfigured && auth) {
          try {
            const cred = await createUserWithEmailAndPassword(auth, normalizedInputEmail, password);
            firebaseUid = cred.user.uid;
          } catch (err) {
            const code = (err as { code?: string })?.code || '';
            // If Firebase Email/Password provider isn't enabled in Console, proceed with Firestore MESA persistence
            if (code !== 'auth/operation-not-allowed' && code !== 'auth/admin-restricted-operation') {
              setErrorMsg(translateAuthError(err));
              return;
            }
          }
        }

        const generatedId = firebaseUid
          ? `usr-${firebaseUid.slice(0, 6).toUpperCase()}`
          : `usr-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

        const addresses: UserAddress[] = [];
        if (street.trim() && city.trim() && zip.trim()) {
          addresses.push({
            id: `addr-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
            street: street.trim(),
            city: city.trim(),
            zip: zip.trim(),
            isVerified: false // Admin must verify it
          });
        }

        const newUser: AppUser = {
          id: generatedId,
          name: name.trim() || 'Utente',
          lastName: lastName.trim() || 'Mesa',
          email: normalizedInputEmail,
          ...(phone.trim() ? { phone: phone.trim() } : {}),
          ...(role === 'chef' && brandName.trim() ? { brandName: brandName.trim() } : {}),
          ...(avatarUrl.trim() ? { avatarUrl: avatarUrl.trim() } : {}),
          role: role,
          addresses: addresses,
          createdAt: new Date().toLocaleDateString('it-IT'),
          password: password
        };

        await onRegisterUser(newUser);
        setAvatarUrl('');
        onLoginSuccess(newUser, true);
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    if (!isFirebaseConfigured || !auth) {
      setErrorMsg('Accesso con Google non disponibile in questa configurazione.');
      return;
    }
    setIsSubmitting(true);
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const fbEmail = (cred.user.email || '').trim().toLowerCase();
      let user = registeredUsers.find(u => u.email.trim().toLowerCase() === fbEmail);
      let isNew = false;
      if (!user) {
        const targetRole = role === 'admin' ? 'client' : role;
        user = buildUserFromFirebase(cred.user, targetRole);
        isNew = true;
        await onRegisterUser(user);
      }
      onLoginSuccess(user, isNew);
      onClose();
    } catch (err) {
      const code = (err as { code?: string })?.code || '';
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        return;
      }
      setErrorMsg(translateAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        
        <div className="relative bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
          <button 
            onClick={onClose} 
            className={`absolute top-3 right-3 sm:top-3.5 sm:right-3.5 p-2 rounded-full z-30 transition-all shadow-md active:scale-95 flex items-center justify-center border ${
              role === 'admin'
                ? 'bg-neutral-900/90 hover:bg-neutral-800 text-gray-300 hover:text-white border-white/20'
                : 'bg-white/90 hover:bg-gray-100 text-gray-500 hover:text-gray-900 border-gray-200'
            }`}
            title="Chiudi"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Switch dei Ruoli */}
          <div className="flex border-b border-gray-100 bg-gray-50 pr-14 sm:pr-16 relative">
            <button
              type="button"
              onClick={() => {
                if (role === 'admin') { setEmail(''); setPassword(''); }
                setRole('client');
                setErrorMsg('');
              }}
              className={`flex-1 py-5 text-[10px] font-black uppercase tracking-widest flex flex-col items-center justify-center gap-1 transition-colors ${
                role === 'client' ? 'bg-white text-orange-600 border-b-4 border-orange-600' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
               }`}
            >
              <User className="w-4 h-4" />
              <span>Cliente</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (role === 'admin') { setEmail(''); setPassword(''); }
                setRole('chef');
                setErrorMsg('');
              }}
              className={`flex-1 py-5 text-[10px] font-black uppercase tracking-widest flex flex-col items-center justify-center gap-1 transition-colors ${
                role === 'chef' ? 'bg-white text-orange-600 border-b-4 border-orange-600' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
              }`}
            >
              <ChefHat className="w-4 h-4" />
              <span>Cuoco</span>
            </button>
            <button
              type="button"
              onClick={() => { 
                setRole('admin'); 
                setMode('login'); 
                setEmail('admin@mesa.com');
                setPassword('');
                setErrorMsg(''); 
              }}
              className={`flex-1 py-5 text-[10px] font-black uppercase tracking-widest flex flex-col items-center justify-center gap-1 transition-colors ${
                role === 'admin' ? 'bg-black text-orange-500 border-b-4 border-orange-500' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-500'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin</span>
            </button>
          </div>

          <div className="p-6 sm:p-8 max-h-[82vh] overflow-y-auto">
            <h2 className="text-3xl font-black text-gray-900 italic tracking-tight mb-2">
              {role === 'admin' ? 'Pannello di Controllo' : mode === 'login' ? 'Bentornato!' : role === 'client' ? 'Unisciti' : 'Registrati come Cuoco'}
            </h2>
            <p className="text-gray-500 text-sm font-medium mb-5 leading-relaxed">
              {role === 'admin' 
                ? 'Accedi alla visione a 360° per approvare e convalidare utenti, candidature cuochi e indirizzi.'
                : mode === 'login' 
                  ? (role === 'chef'
                      ? 'Accedi per gestire i tuoi piatti e le tue prenotazioni'
                      : 'Accedi per gestire il tuo profilo, i tuoi indirizzi e i tuoi ordini.')
                  : role === 'client' 
                    ? 'Registrati per ordinare piatti fatti in casa dalle cucine verificate. Il tuo profilo sarà subito visibile nell\'Area Admin.' 
                    : 'Crea il tuo account Cuoco: verrai sincronizzato con l\'Area Admin per la verifica e l\'attivazione nel catalogo MESA.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'register' && role !== 'admin' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input 
                        type="text" 
                        placeholder="Nome" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        className="w-full p-4 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-gray-50 text-sm font-bold placeholder-gray-400" 
                        required 
                      />
                    </div>
                    <div>
                      <input 
                        type="text" 
                        placeholder="Cognome" 
                        value={lastName} 
                        onChange={e => setLastName(e.target.value)} 
                        className="w-full p-4 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-gray-50 text-sm font-bold placeholder-gray-400" 
                        required 
                      />
                    </div>
                  </div>

                  {role === 'chef' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input 
                        type="text" 
                        placeholder="Nome Cucina / Brand (opzionale)" 
                        value={brandName} 
                        onChange={e => setBrandName(e.target.value)} 
                        className="w-full p-4 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-gray-50 text-sm font-bold placeholder-gray-400" 
                      />
                      <div className="relative">
                        <Smartphone className="w-4 h-4 text-orange-600 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input 
                          type="tel" 
                          placeholder="Telefono / WhatsApp *" 
                          value={phone} 
                          onChange={e => setPhone(e.target.value)} 
                          className="w-full pl-11 pr-4 py-4 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-gray-50 text-sm font-bold placeholder-gray-400" 
                          required 
                        />
                      </div>
                    </div>
                  )}

                  <ImagePickerBox
                    variant="avatar"
                    compact
                    value={avatarUrl}
                    onChange={setAvatarUrl}
                    label={role === 'chef' ? 'Foto Profilo Cuoco (consigliata)' : 'Foto Profilo (opzionale)'}
                    helperText={
                      role === 'chef'
                        ? 'Carica una tua foto dal dispositivo o incolla un link per il tuo profilo cuoco.'
                        : 'Personalizza il tuo account caricando una foto profilo.'
                    }
                  />
                </>
              )}
              <input 
                type="email" 
                autoComplete="email"
                placeholder={role === 'chef' && mode === 'login' ? 'Email privata del Cuoco' : 'Indirizzo Email'} 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="w-full p-4 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-gray-50 text-sm font-bold placeholder-gray-400" 
                required 
              />
              
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  placeholder="Password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className="w-full p-4 pr-12 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-gray-50 text-sm font-bold placeholder-gray-400" 
                  required 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Campi Indirizzo durante la registrazione */}
              {mode === 'register' && role !== 'admin' && (
                <div className="space-y-3 bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100 mt-4 pt-5">
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-orange-600" />
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {role === 'chef' ? 'Sede della tua Cucina (Provincia di Pordenone)' : 'Sede del tuo Indirizzo'}
                      </span>
                    </div>
                    {role === 'chef' && (
                      <span className="text-[9px] font-black uppercase tracking-wider bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded-full border border-orange-200">
                        Competenza: Provincia di Pordenone (PN)
                      </span>
                    )}
                  </div>

                  {role === 'chef' && (
                    <div>
                      <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">
                        Comune della Provincia di Pordenone *
                      </label>
                      <select
                        value={findPordenoneComune(city)?.name || ''}
                        onChange={(e) => {
                          const chosen = PORDENONE_COMUNI.find(c => c.name === e.target.value);
                          if (chosen) {
                            setCity(`${chosen.name} (PN)`);
                            setZip(chosen.zip);
                            setErrorMsg('');
                          }
                        }}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-white text-xs font-bold text-gray-900"
                      >
                        <option value="">-- Seleziona un comune della Provincia di Pordenone --</option>
                        {PORDENONE_COMUNI.map(c => (
                          <option key={c.name} value={c.name}>
                            {c.name} (PN) • CAP {c.zip}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  <input 
                    type="text" 
                    placeholder="Via e Numero Civico" 
                    value={street}
                    onChange={e => setStreet(e.target.value)}
                    className="w-full p-3 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-white text-xs font-bold"
                    required
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <input 
                      type="text" 
                      placeholder={role === 'chef' ? 'Comune es. Pordenone (PN)' : 'Città (es. Pordenone)'} 
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full p-3 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-white text-xs font-bold"
                      required
                    />
                    <input 
                      type="text" 
                      placeholder="CAP es. 33170" 
                      value={zip}
                      onChange={e => setZip(e.target.value)}
                      className="w-full p-3 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-white text-xs font-bold"
                      maxLength={5}
                      required
                    />
                  </div>
                  <p className="text-[9px] text-gray-400 font-bold italic leading-tight mt-1">
                    {role === 'chef'
                      ? 'Tutti i cuochi MESA operano nella Provincia di Pordenone (PN). La registrazione sarà subito visibile nell\'Area Admin per la convalida.'
                      : 'L\'indirizzo inserito verrà registrato nell\'Area Admin per la verifica prima degli ordini a domicilio.'}
                  </p>
                </div>
              )}

              {errorMsg && (
                <div className={`p-4 rounded-xl text-xs font-bold border ${errorMsg.includes('Compilato') ? 'bg-orange-50 border-orange-200 text-orange-850' : 'bg-red-50 border-red-200 text-red-500'}`}>
                  {errorMsg}
                </div>
              )}
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full py-4 font-black uppercase tracking-widest rounded-2xl shadow-xl transition-all active:scale-95 text-xs ${role === 'admin' ? 'bg-orange-600 text-black' : 'bg-black text-white hover:bg-orange-600'} disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? 'Salvataggio in corso...' : role === 'admin' ? 'Entra nella Dashboard' : mode === 'login' ? 'Accedi' : role === 'chef' ? 'Registrati & Invia ad Admin' : 'Registrati'}
              </button>
            </form>

            {role === 'chef' && mode === 'register' && onOpenOnboarding && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenOnboarding();
                }}
                className="mt-3 w-full py-3.5 px-4 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-800 rounded-2xl text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4 text-orange-600" />
                <span>Oppure compila Candidatura Completa (HACCP & Menu)</span>
              </button>
            )}

            {role !== 'admin' && (
              <div className="mt-5">
                <div className="flex items-center gap-3 mb-3.5">
                  <div className="h-px flex-1 bg-gray-200" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">oppure</span>
                  <div className="h-px flex-1 bg-gray-200" />
                </div>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isSubmitting}
                  className="w-full py-3.5 font-black uppercase tracking-widest rounded-2xl border-2 border-gray-200 text-gray-700 hover:border-orange-500 hover:text-orange-600 transition-all active:scale-95 text-xs flex items-center justify-center gap-2 bg-white disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
                    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
                  </svg>
                  Accedi con Google
                </button>
              </div>
            )}

            {role !== 'admin' && (
              <div className="mt-5 text-center text-sm font-medium text-gray-500">
                {mode === 'login' ? (
                  role === 'chef' ? (
                    <button
                      type="button"
                      onClick={() => { setMode('register'); setErrorMsg(''); }}
                      className="w-full py-3.5 px-4 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-800 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                    >
                      <ChefHat className="w-4 h-4 text-orange-600 shrink-0" />
                      <span>Registrati / Candidati come nuovo Cuoco</span>
                    </button>
                  ) : (
                    <>
                      Non hai un account?{' '}
                      <button 
                        type="button"
                        onClick={() => { setMode('register'); setErrorMsg(''); }}
                        className="font-black text-orange-600 hover:underline"
                      >
                        Registrati
                      </button>
                    </>
                  )
                ) : (
                  <>
                    Hai già un account?{' '}
                    <button 
                      type="button"
                      onClick={() => { setMode('login'); setErrorMsg(''); }}
                      className="font-black text-orange-600 hover:underline"
                    >
                      Accedi
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
