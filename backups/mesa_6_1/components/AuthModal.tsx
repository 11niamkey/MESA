import React, { useState } from 'react';
import { X, User, ChefHat, LogIn, ShieldCheck, MapPin, Eye, EyeOff } from 'lucide-react';
import { AppUser, UserAddress } from '../types';
import { auth, isFirebaseConfigured } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  registeredUsers: AppUser[];
  onLoginSuccess: (user: AppUser) => void;
  onRegisterUser: (user: AppUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  registeredUsers,
  onLoginSuccess,
  onRegisterUser
}) => {
  const [role, setRole] = useState<'client' | 'chef' | 'admin'>('client');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Basic Fields
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Optional Address block for registration
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        return 'Accesso con Google annullato.';
      case 'auth/account-exists-with-different-credential':
        return 'Esiste già un account con questa email usando un altro metodo di accesso.';
      default:
        return 'Si è verificato un errore. Riprova.';
    }
  };

  // Build an AppUser record from a Firebase Auth user
  const buildUserFromFirebase = (
    fbUser: { uid: string; email?: string | null; displayName?: string | null },
    role: 'client' | 'chef' | 'admin'
  ): AppUser => {
    const displayName = fbUser.displayName || '';
    const [fbName, ...fbLastNameParts] = displayName.split(' ');
    return {
      id: `usr-${fbUser.uid.slice(0, 6).toUpperCase()}`,
      name: fbName.trim() || 'Utente',
      lastName: fbLastNameParts.join(' ').trim() || 'Mesa',
      email: (fbUser.email || email).trim(),
      role,
      addresses: [],
      createdAt: new Date().toLocaleDateString('it-IT'),
      password: undefined
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        // 1) Try Firebase Auth first (real accounts)
        if (isFirebaseConfigured) {
          try {
            const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
            const existing = registeredUsers.find(
              u => u.email.toLowerCase() === (cred.user.email || email).toLowerCase()
            );
            if (existing) {
              onLoginSuccess(existing);
            } else {
              const newUser = buildUserFromFirebase(cred.user, role);
              onRegisterUser(newUser);
              onLoginSuccess(newUser);
            }
            onClose();
            return;
          } catch (err) {
            const code = (err as { code?: string })?.code || '';
            const isDemoFallback =
              code === 'auth/user-not-found' ||
              code === 'auth/wrong-password' ||
              code === 'auth/invalid-credential' ||
              code === 'auth/invalid-email';
            if (!isDemoFallback) {
              setErrorMsg(translateAuthError(err));
              return;
            }
            // fall through to demo/local account check
          }
        }

        // 2) Demo / local account fallback (pre-seeded users)
        const match = registeredUsers.find(
          u => u.email.toLowerCase() === email.toLowerCase() && u.role === role
        );
        if (match) {
          const expectedPassword = match.password || 'demo123';
          if (password !== expectedPassword) {
            setErrorMsg('La password inserita non è corretta. Riprova.');
            return;
          }
          onLoginSuccess(match);
          alert(`Accesso effettuato con successo!\nBenvenuto, ${match.name}!`);
          onClose();
          return;
        }
        setErrorMsg(`Account ${role === 'chef' ? 'Cuoco' : 'Cliente'} non trovato con questa email. Registrati per iniziare!`);
      } else {
        // Register logic
        const exists = registeredUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (exists) {
          setErrorMsg('Questa email è già registrata su MESA.');
          return;
        }

        let firebaseUid = '';
        if (isFirebaseConfigured) {
          try {
            const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
            firebaseUid = cred.user.uid;
          } catch (err) {
            setErrorMsg(translateAuthError(err));
            return;
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
          email: email.trim(),
          role: role,
          addresses: addresses,
          createdAt: new Date().toLocaleDateString('it-IT'),
          password: firebaseUid ? undefined : password
        };

        onRegisterUser(newUser);
        onLoginSuccess(newUser);

        alert(
          `Registrazione completata!\nBenvenuto ${newUser.name}.` +
          (role === 'chef' && addresses.length > 0 ? `\nL'indirizzo inserito è stato registrato ed è in attesa di verifica nella dashboard dell'amministratore.` : '')
        );
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    if (!isFirebaseConfigured) {
      setErrorMsg('Accesso con Google non disponibile in questa configurazione.');
      return;
    }
    setIsSubmitting(true);
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const fbEmail = cred.user.email || '';
      let user = registeredUsers.find(u => u.email.toLowerCase() === fbEmail.toLowerCase());
      if (!user) {
        const targetRole = role === 'admin' ? 'client' : role;
        user = buildUserFromFirebase(cred.user, targetRole);
        onRegisterUser(user);
      }
      onLoginSuccess(user);
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

  const handleDemoLogin = (selectedRole: 'client' | 'chef' | 'admin') => {
    let defaultEmail = 'luca@mesa.com';
    if (selectedRole === 'chef') defaultEmail = 'chef.francesco@mesa.com';
    if (selectedRole === 'admin') defaultEmail = 'admin@mesa.com';

    setRole(selectedRole);
    setEmail(defaultEmail);
    setPassword('demo123');
    setMode('login');
    setErrorMsg(`Compilato con i dati del profilo Demo (${selectedRole === 'chef' ? 'Cuoco' : selectedRole === 'admin' ? 'Amministratore' : 'Cliente'}). Clicca per accedere!`);
  };

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto">
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
              onClick={() => { setRole('client'); setMode('login'); setErrorMsg(''); }}
              className={`flex-1 py-5 text-[10px] font-black uppercase tracking-widest flex flex-col items-center justify-center gap-1 transition-colors ${
                role === 'client' ? 'bg-white text-orange-600 border-b-4 border-orange-600' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
               }`}
            >
              <User className="w-4 h-4" />
              <span>Cliente</span>
            </button>
            <button
              type="button"
              onClick={() => { setRole('chef'); setMode('login'); setErrorMsg(''); }}
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

          <div className="p-10 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-black shadow-lg outline outline-1 outline-white/10">
                <img src="/images/mesa_logo_type.png" alt="MESA" className="w-full h-full object-cover" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 italic tracking-tight m-0">
                {role === 'admin' ? 'Pannello di Controllo' : mode === 'login' ? 'Bentornato!' : role === 'client' ? 'Unisciti' : 'Diventa un Cuoco'}
              </h2>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-8 leading-relaxed">
              {role === 'admin' 
                ? 'Accedi alla visione a 360° per approvare e convalidare utenti e indirizzi.'
                : mode === 'login' 
                  ? 'Accedi per gestire il tuo profilo, i tuoi indirizzi e i tuoi ordini.' 
                  : role === 'client' 
                    ? 'Registrati per ordinare piatti fatti in casa dalle cucine verificate.' 
                    : 'Condividi la tua passione e vendi i tuoi piatti tipici certificati.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && role !== 'admin' && (
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
              )}
              
              <input 
                type="email" 
                placeholder="Indirizzo Email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="w-full p-4 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-gray-50 text-sm font-bold placeholder-gray-400" 
                required 
              />
              
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
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
                <div className="space-y-3 bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100 mt-6 pt-5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <MapPin className="w-4 h-4 text-orange-600" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sede del tuo Indirizzo</span>
                  </div>
                  
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
                      placeholder="Città" 
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full p-3 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-white text-xs font-bold"
                      required
                    />
                    <input 
                      type="text" 
                      placeholder="CAP es. 00185" 
                      value={zip}
                      onChange={e => setZip(e.target.value)}
                      className="w-full p-3 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-white text-xs font-bold"
                      maxLength={5}
                      required
                    />
                  </div>
                  <p className="text-[9px] text-gray-400 font-bold italic leading-tight mt-1">
                    Nota: L'indirizzo inserito verrà registrato e sarà sottoposto a verifica nell'area dell'amministratore prima di autorizzare gli ordini.
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
                className={`w-full py-4.5 font-black uppercase tracking-widest rounded-2xl shadow-xl transition-all active:scale-95 text-xs ${role === 'admin' ? 'bg-orange-600 text-black' : 'bg-black text-white hover:bg-orange-600'} disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? 'Attendere...' : role === 'admin' ? 'Entra nella Dashboard' : mode === 'login' ? 'Accedi' : 'Registrati'}
              </button>
            </form>

            {role !== 'admin' && (
              <div className="mt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 bg-gray-200" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">oppure</span>
                  <div className="h-px flex-1 bg-gray-200" />
                </div>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isSubmitting}
                  className="w-full py-4 font-black uppercase tracking-widest rounded-2xl border-2 border-gray-200 text-gray-700 hover:border-orange-500 hover:text-orange-600 transition-all active:scale-95 text-xs flex items-center justify-center gap-2 bg-white disabled:opacity-60 disabled:cursor-not-allowed"
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
              <div className="mt-8 text-center text-sm font-medium text-gray-500">
                {mode === 'login' ? 'Non hai un account? ' : 'Hai già un account? '}
                <button 
                  type="button"
                  onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErrorMsg(''); }}
                  className="font-black text-orange-600 hover:underline"
                >
                  {mode === 'login' ? 'Registrati' : 'Accedi'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
