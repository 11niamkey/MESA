import React, { useState } from 'react';
import { X, User, ChefHat, LogIn, ShieldCheck, MapPin, Eye, EyeOff } from 'lucide-react';
import { AppUser, UserAddress } from '../types';

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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Accesso Segreto Amministratore (solo con password segreta)
    if (role === 'admin' || email.toLowerCase() === 'admin@mesa.com' || email.toLowerCase() === '11niamkey@gmail.com') {
      if (password === 'mesa2026') {
        const adminUser = registeredUsers.find(u => u.role === 'admin' && (u.email.toLowerCase() === 'admin@mesa.com' || u.email.toLowerCase() === '11niamkey@gmail.com'));
        if (adminUser) {
          onLoginSuccess(adminUser);
        } else {
          const defaultAdmin: AppUser = {
            id: 'usr-admin',
            name: 'Admin',
            lastName: 'MESA',
            email: 'admin@mesa.com',
            role: 'admin',
            addresses: [],
            createdAt: new Date().toLocaleDateString('it-IT')
          };
          onRegisterUser(defaultAdmin);
          onLoginSuccess(defaultAdmin);
        }
        onClose();
        return;
      } else {
        setErrorMsg('Password amministratore non corretta.');
        return;
      }
    }

    if (mode === 'login') {
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
      } else {
        setErrorMsg(`Account ${role === 'chef' ? 'Cuoco' : 'Cliente'} non trovato con questa email. Registrati per iniziare!`);
      }
    } else {
      // Register logic
      const exists = registeredUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        setErrorMsg('Questa email è già registrata su MESA.');
        return;
      }

      const generatedId = `usr-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
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
        password: password
      };

      onRegisterUser(newUser);
      onLoginSuccess(newUser);
      
      alert(
        `Registrazione completata!\nBenvenuto ${newUser.name}.` + 
        (role === 'chef' && addresses.length > 0 ? `\nL'indirizzo inserito è stato registrato ed è in attesa di verifica nella dashboard dell'amministratore.` : '')
      );
      onClose();
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
          <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 z-10 transition-colors">
            <X className="w-6 h-6" />
          </button>

          {/* Switch dei Ruoli */}
          <div className="flex border-b border-gray-100 bg-gray-50">
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
                className={`w-full py-4.5 font-black uppercase tracking-widest rounded-2xl shadow-xl transition-all active:scale-95 text-xs ${role === 'admin' ? 'bg-orange-600 text-black' : 'bg-black text-white hover:bg-orange-600'}`}
              >
                {role === 'admin' ? 'Entra nella Dashboard' : mode === 'login' ? 'Accedi' : 'Registrati'}
              </button>
            </form>

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
