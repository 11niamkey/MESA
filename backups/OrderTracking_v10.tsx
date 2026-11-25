import React, { useState, useEffect } from 'react';
import { 
  PackageCheck, 
  Utensils, 
  Bike, 
  CheckCircle, 
  Clock, 
  MapPin, 
  MessageSquare, 
  ChevronRight, 
  Heart, 
  Send, 
  User, 
  Navigation, 
  Wifi, 
  BellRing, 
  DollarSign, 
  Smartphone, 
  Activity, 
  Smartphone as PhoneIcon, 
  Share2, 
  AlertCircle 
} from 'lucide-react';
import { Order, OrderStatus, OrderTimelineEntry, ORDER_STATUS_LABELS, Chef, AppUser } from '../types';

const formatChefDisplayName = (name?: string) => {
  const trimmed = (name || 'MESA').trim();
  return /^chef\b/i.test(trimmed) ? trimmed : `Chef ${trimmed}`;
};

interface OrderTrackingProps {
  order: Order;
  onBack: () => void;
  chefs?: Chef[];
  userRole?: AppUser['role'];
  justPlaced?: boolean;
  onUpdateOrderStatus?: (orderId: string, status: OrderStatus) => void;
}

const STATUS_CHAT_UPDATES: Partial<Record<OrderStatus, string>> = {
  CONFIRMED: '✅ Ho confermato il tuo ordine! Lo stiamo inserendo subito in preparazione.',
  PLACED: '✅ Ordine confermato e preso in carico!',
  PREPARING: '🍳 Sto preparando il tuo piatto con ingredienti freschi!',
  READY: '🍱 Il tuo ordine è pronto per il ritiro o la consegna!',
  DELIVERING: '🛵 Il rider è partito con il tuo ordine!',
  COMPLETED: '🎉 Ordine completato! Buon appetito da Chef e da MESA!',
  REJECTED: '❌ Mi dispiace, non posso accettare questa prenotazione per la data richiesta.',
};

export const OrderTracking: React.FC<OrderTrackingProps> = ({ 
  order, 
  onBack, 
  chefs,
  userRole,
  justPlaced = false,
  onUpdateOrderStatus 
}) => {
  const isChefView = userRole === 'chef';
  const [activeTab, setActiveTab] = useState<'chat' | 'chef-sim'>(isChefView ? 'chef-sim' : 'chat');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState(order.messages || [
    {
      id: '1',
      sender: 'chef',
      text: order.status === 'PENDING_CONFIRMATION'
        ? `Ciao! Ho ricevuto la tua prenotazione su MESA ed è in attesa di conferma. Ti aggiorno subito! 🍳`
        : `Ciao! Ho visto il tuo ordine su MESA. Sto curando ogni dettaglio! 🍳`,
      timestamp: new Date()
    }
  ]);
  const [statusLogs, setStatusLogs] = useState<string[]>([
    order.status === 'PENDING_CONFIRMATION'
      ? `Prenotazione registrata: pagamento al ritiro o alla consegna.`
      : `Ordine confermato.`,
    `Ordine contrassegnato con ID #${order.id.split('-')[0]}.`,
    order.notificationChannel === 'whatsapp' 
      ? `Canale selezionato: WHATSAPP. Inviato messaggio precompilato allo Chef.`
      : `Canale selezionato: APP MESA. Inviata notifica automatica al terminale.`
  ]);

  const steps: { status: OrderStatus; label: string; icon: any; description: string }[] = [
    { status: 'PENDING_CONFIRMATION', label: 'In attesa di conferma', icon: Clock, description: 'Prenotazione inviata, in attesa di conferma dallo chef' },
    { status: 'CONFIRMED', label: 'Confermato', icon: PackageCheck, description: 'Lo chef ha confermato la tua prenotazione' },
    { status: 'PREPARING', label: 'In Cucina', icon: Utensils, description: 'Ingredienti freschi in preparazione' },
    { status: 'READY', label: 'Pronto', icon: CheckCircle, description: 'Il tuo piatto è pronto!' },
    { status: 'DELIVERING', label: 'In Consegna', icon: Bike, description: 'Il rider è per strada' },
    { status: 'COMPLETED', label: 'Consegnato', icon: Heart, description: 'Buon appetito!' }
  ];

  const activeSteps = order.deliveryMode === 'pickup' 
    ? steps.filter(s => s.status !== 'DELIVERING')
    : steps;

  const normalizedStepStatus: OrderStatus = order.status === 'PLACED' ? 'CONFIRMED' : order.status;
  const rawStepIndex = activeSteps.findIndex(s => s.status === normalizedStepStatus);
  const currentStepIndex = rawStepIndex >= 0 ? rawStepIndex : 0;
  const isRejected = order.status === 'REJECTED';
  const lastTrackedStatusRef = React.useRef<OrderStatus>(order.status);

  // Sync messages from Firestore
  useEffect(() => {
    if (order.messages && order.messages.length > 0) {
      setMessages(order.messages);
    }
  }, [order.messages]);

  // Append live timeline status update message in ORDINI chat when Firestore updates order status
  useEffect(() => {
    if (lastTrackedStatusRef.current !== order.status) {
      lastTrackedStatusRef.current = order.status;
      const updateText = STATUS_CHAT_UPDATES[order.status];
      if (updateText) {
        setMessages(prev => {
          if (prev.some(m => m.text === updateText)) return prev;
          return [
            ...prev,
            {
              id: `status-${order.id}-${order.status}`,
              sender: 'chef',
              text: updateText,
              timestamp: new Date(),
            },
          ];
        });
      }
      const timeNow = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
      const statusLabel = ORDER_STATUS_LABELS[order.status] || order.status;
      setStatusLogs(prev => [`[${timeNow}] Stato aggiornato: ${statusLabel}`, ...prev]);
    }
  }, [order.id, order.status]);

  // Enforce separation: clients must never enter chef-sim tab
  useEffect(() => {
    setActiveTab(isChefView ? 'chef-sim' : 'chat');
  }, [isChefView]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const newMsg = { id: Date.now().toString(), sender: 'user' as const, text: chatInput, timestamp: new Date() };
    setMessages(prev => [...prev, newMsg]);
    setChatInput('');
    
    // Simulate chef auto reply
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        sender: 'chef', 
        text: "Ricevuto! Me ne occupo subito. Ci aggiorniamo a breve! 😊🍳", 
        timestamp: new Date() 
      }]);
    }, 2000);
  };

  const updateStatusFromChefTerminal = (nextStatus: OrderStatus, automatedReplyText?: string) => {
    if (onUpdateOrderStatus) {
      onUpdateOrderStatus(order.id, nextStatus);
    }
    
    // Add custom log to simulator console
    const timeNow = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setStatusLogs(prev => [
      `[${timeNow}] Stato ordine cambiato in: ${nextStatus}`, 
      ...prev
    ]);

    // Append automated chef chat message to user
    if (automatedReplyText) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          sender: 'chef',
          text: automatedReplyText,
          timestamp: new Date()
        }]);
      }, 800);
    }
  };

  const timelineEntries: OrderTimelineEntry[] = React.useMemo(() => {
    if (order.timeline && order.timeline.length > 0) {
      return order.timeline.map((entry) => ({
        ...entry,
        timestamp: entry.timestamp instanceof Date ? entry.timestamp : new Date(entry.timestamp),
      }));
    }
    const baseTime = order.timestamp instanceof Date ? order.timestamp : new Date(order.timestamp);
    const entries: OrderTimelineEntry[] = [
      {
        id: `tl-created-${order.id}`,
        status: 'PENDING_CONFIRMATION',
        title: 'Ordine inviato',
        description: 'Ordine inviato! In attesa di conferma dallo chef.',
        timestamp: baseTime,
      },
    ];
    if (order.status !== 'PENDING_CONFIRMATION') {
      entries.push({
        id: `tl-current-${order.id}-${order.status}`,
        status: order.status,
        title: ORDER_STATUS_LABELS[order.status] || order.status,
        description: STATUS_CHAT_UPDATES[order.status] || 'Aggiornamento stato in tempo reale.',
        timestamp: new Date(),
      });
    }
    return entries;
  }, [order.id, order.status, order.timeline, order.timestamp]);

  return (
    <div className="animate-fade-in space-y-6 max-w-5xl mx-auto px-2 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <button onClick={onBack} className="text-gray-400 hover:text-black flex items-center text-sm font-bold w-fit">
          <ChevronRight className="w-4 h-4 rotate-180 mr-1" /> Torna alla dashboard
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100 uppercase tracking-widest">
            {order.status === 'PENDING_CONFIRMATION' ? 'PAGAMENTO AL RITIRO / CONSEGNA' : 'STATO PRENOTAZIONE LIVE'}
          </span>
          <span className="text-[10px] font-black text-gray-500 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest font-mono">
            ID #{order.id.split('-')[0]}
          </span>
        </div>
      </div>

      {!isChefView && (justPlaced || order.status === 'PENDING_CONFIRMATION') && (
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-4 sm:p-5 flex items-start sm:items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-black text-emerald-950">
              Ordine inviato! In attesa di conferma dallo chef
            </p>
            <p className="text-[11px] sm:text-xs font-medium text-emerald-800 mt-0.5">
              Riceverai un avviso in tempo reale nella barra in alto e in questa timeline appena {formatChefDisplayName(order.chefName)} aggiornerà lo stato.
            </p>
          </div>
        </div>
      )}

      <div className={`rounded-[2.5rem] p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl ${
        isRejected
          ? 'bg-gradient-to-r from-red-600 to-rose-700'
          : order.status === 'CONFIRMED' || order.status === 'COMPLETED'
            ? 'bg-gradient-to-r from-emerald-600 to-green-600'
            : 'bg-gradient-to-r from-orange-500 to-amber-600'
      }`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full opacity-10 blur-3xl -mr-24 -mt-24"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-white/80">
                {isChefView ? 'Stato Ordine (Vista Cuoco)' : 'Stato Ordine (Vista Cliente)'}
              </p>
            </div>
            <h3 className="text-3xl sm:text-4xl font-black tracking-tight">
              {isRejected ? 'Rifiutato' : activeSteps[currentStepIndex]?.label}
            </h3>
            <p className="text-xs sm:text-sm text-white/95 mt-1 font-medium">
              {isRejected
                ? 'Lo chef non ha potuto accettare questa prenotazione. Nessun addebito è stato effettuato.'
                : activeSteps[currentStepIndex]?.description}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/25 text-right w-full md:w-auto">
            <p className="text-[9px] font-black uppercase tracking-widest text-white/80 mb-0.5">
              {order.deliveryMode === 'delivery' ? 'Consegna Prenotata' : 'Ritiro Prenotato'}
            </p>
            <p className="text-xl sm:text-2xl font-black font-mono text-white">{order.estimatedTime === 'In arrivo...' ? '35-45 Minuti' : order.estimatedTime}</p>
          </div>
        </div>

        {/* Progress Bar steps */}
        {!isRejected && (
          <div className="relative mt-8 px-2 sm:px-6">
            <div className="absolute top-5 left-8 right-8 h-1 bg-white/20"></div>
            <div 
              className="absolute top-5 left-8 h-1 bg-white transition-all duration-1000 shadow-lg"
              style={{ width: `calc(${(currentStepIndex / (activeSteps.length - 1)) * 100}% - 4px)` }}
            ></div>
            
            <div className="flex justify-between relative z-10">
              {activeSteps.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = idx < currentStepIndex;
                const isActive = idx === currentStepIndex;

                return (
                  <div key={step.status} className="flex flex-col items-center">
                    <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all ${
                      isCompleted ? 'bg-green-500 text-white shadow-lg border-2 border-white' : 
                      isActive ? 'bg-white text-orange-600 shadow-2xl scale-125 ring-4 ring-white/30' : 
                      'bg-white/15 border border-white/20 text-white/50'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest mt-2 hidden sm:block ${
                      isActive ? 'text-white' : 'text-white/60'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Tracking & Map */}
        <div className="lg:col-span-7 space-y-6">
          {/* Simulated Live Map */}
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-black py-4 px-6 text-white text-sm font-bold flex justify-between items-center">
              <span className="flex items-center gap-1.5 font-black text-[10px] uppercase tracking-widest">
                <Activity className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
                Dettagli Consegna & GPS MESA
              </span>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[9px] font-black uppercase tracking-widest text-green-400">Canale GPS Attivo</span>
              </div>
            </div>
            
            <div className="h-64 bg-gray-50 relative overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] opacity-10"></div>
               {/* Map Grid Animation */}
               <div className="absolute inset-0 grid grid-cols-12 grid-rows-8 gap-4 p-4 opacity-20">
                  {Array.from({length: 96}).map((_, i) => <div key={i} className="border border-black/10 rounded-sm"></div>)}
               </div>
               
               {/* Pulsing Rider Location */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-orange-500/20 rounded-full animate-ping"></div>
                    <div className="relative w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-2xl border-2 border-orange-500">
                       <Navigation className="w-4 h-4 text-orange-500 fill-current rotate-45" />
                    </div>
                  </div>
               </div>

               <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-orange-100 flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-800">🛵 Consegna: {order.deliveryMode === 'delivery' ? 'Domicilio' : 'Ritiro in Sede'}</span>
               </div>
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <div>
                  <h4 className="font-black italic text-gray-900 text-lg">Piatto ordinato da {formatChefDisplayName(order.chefName)}</h4>
                  <p className="text-gray-500 text-xs mt-0.5">Grazie per aver sostenuto la vera cucina fatta in casa locale.</p>
                </div>
                <div className="bg-orange-50 text-orange-700 font-mono font-black text-xs px-3 py-1.5 rounded-xl border border-orange-100">
                  € {order.total.toFixed(2)}
                </div>
              </div>

              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    <div>
                      <h5 className="font-bold text-xs text-gray-800">{item.name} <span className="text-orange-500 ml-1">x{item.quantity}</span></h5>
                      <p className="text-[10px] text-gray-500 mt-0.5">{item.preferences.notes ? `Note: "${item.preferences.notes}"` : 'Senza preferenze particolari'}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-gray-700">€ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Real-time Order Timeline inside ORDINI */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-600" />
                <h4 className="font-black text-gray-900 text-sm uppercase tracking-wider">Timeline Ordine & Aggiornamenti</h4>
              </div>
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 uppercase tracking-widest">
                Live
              </span>
            </div>
            <div className="space-y-4">
              {timelineEntries.map((entry, idx) => {
                const isLast = idx === timelineEntries.length - 1;
                const isEntryRejected = entry.status === 'REJECTED';
                return (
                  <div key={entry.id} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={`w-3 h-3 rounded-full mt-1 ${
                          isEntryRejected
                            ? 'bg-red-500'
                            : isLast
                              ? 'bg-orange-600 ring-4 ring-orange-100'
                              : 'bg-emerald-500'
                        }`}
                      />
                      {!isLast && <span className="w-0.5 h-7 bg-gray-200 mt-1" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-black text-gray-900">{entry.title}</p>
                        <span className="text-[10px] font-mono text-gray-400 shrink-0">
                          {entry.timestamp.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {entry.description && (
                        <p className="text-[11px] text-gray-600 font-medium mt-0.5">{entry.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* WhatsApp Direct Coordination Card */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50/50 rounded-[2rem] border border-green-200/50 p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl -mr-12 -mt-12"></div>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-md shadow-green-500/20 shrink-0">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.733-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.023-5.11-2.884-6.978C16.592 1.9 14.121.875 11.487.875c-5.438 0-9.864 4.421-9.868 9.868-.001 1.714.461 3.39 1.337 4.887L1.93 21.09l5.631-1.477-1.45-.884-.334-.183zm10.748-4.996c-.3-.15-1.77-.875-2.043-.977-.275-.1-.475-.15-.675.15-.2.3-.775.976-.95 1.176-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.413-1.49-1.01-.9-1.693-2.013-1.893-2.313-.2-.3-.021-.462.129-.612.135-.135.3-.35.45-.525.15-.175.2-.3.3-.5s.05-.375-.025-.525C9.37 9.458 8.81 8.09 8.577 7.54c-.228-.547-.46-.473-.65-.482-.175-.01-.375-.012-.575-.012s-.525.075-.8.375c-.275.3-1.05 1.025-1.05 2.5s1.075 2.9 1.225 3.1c.15.2 2.11 3.22 5.115 4.52.715.31 1.273.496 1.708.635.717.228 1.37.196 1.885.119.575-.085 1.77-.723 2.022-1.42s.252-1.293.177-1.42c-.075-.125-.275-.2-.575-.35z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-extrabold text-green-900 text-sm leading-tight">Canale WhatsApp Gestione Ordini MESA</h4>
                  <p className="text-[11px] text-green-700/80 mt-1 font-medium leading-normal">
                    Condividi subito i dettagli della prenotazione e accordati per il ritiro/consegna su WhatsApp con un click.
                  </p>
                </div>
              </div>
              <a
                href={(() => {
                  const rawManagementNumber = String(
                    (import.meta as any).env?.VITE_WHATSAPP_MANAGEMENT_NUMBER || '393713179098'
                  ).replace(/\D/g, '');
                  const managementNumber =
                    rawManagementNumber.length === 10 && rawManagementNumber.startsWith('3')
                      ? `39${rawManagementNumber}`
                      : rawManagementNumber;

                  const chef = chefs?.find(c => c.id === order.chefId);
                  const chefName = chef?.name || order.chefName || 'Chef MESA';
                  const firstItem = order.items[0];
                  const scheduledDate = firstItem?.scheduledDate || 'Da definire';
                  const scheduledTime = firstItem?.scheduledTime || 'Da definire';
                  const deliveryLabel = order.deliveryMode === 'delivery' ? 'Consegna a domicilio' : 'Ritiro in sede';

                  const itemsText = order.items.map(item => {
                    let specStr = '';
                    if (item.preferences.spiceLevel > 0) {
                      specStr += ` (Piccantezza: ${item.preferences.spiceLevel}/3)`;
                    }
                    if (item.preferences.notes) {
                      specStr += ` [Note: ${item.preferences.notes}]`;
                    }
                    return `- ${item.name} | Quantità: ${item.quantity} (€${(item.price * item.quantity).toFixed(2)})${specStr}`;
                  }).join('\n');

                  const text = `Ciao MESA! 🍳
Vorrei inviare i dettagli della prenotazione *#${order.id.split('-')[0]}*:

*Chef*: ${chefName}
*Piatti*:
${itemsText}

*Totale*: €${order.total.toFixed(2)}
*Modalità*: ${deliveryLabel}
*Data*: ${scheduledDate}
*Fascia oraria*: ${scheduledTime}

Attendo conferma, grazie!`;

                  return managementNumber
                    ? `https://wa.me/${managementNumber}?text=${encodeURIComponent(text)}`
                    : `https://wa.me/?text=${encodeURIComponent(text)}`;
                })()}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#128C7E] text-white px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest text-center shadow-lg hover:shadow-xl active:scale-95 transition-all shrink-0 flex items-center justify-center gap-1.5"
              >
                Invia Dettagli su WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Chat for Client; Terminale Cuoco + Chat for Chef */}
        <div className="lg:col-span-5 space-y-6">
          {isChefView && (
            <div className="bg-gray-100 p-1.5 rounded-2xl flex gap-2">
              <button
                onClick={() => setActiveTab('chef-sim')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === 'chef-sim' 
                    ? 'bg-black text-white shadow-md' 
                    : 'text-gray-500 hover:text-black hover:bg-gray-200/50'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>📱 Terminale Cuoco</span>
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === 'chat' 
                    ? 'bg-black text-white shadow-md' 
                    : 'text-gray-500 hover:text-black hover:bg-gray-200/50'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat Utente</span>
              </button>
            </div>
          )}

          {isChefView && activeTab === 'chef-sim' ? (
            /* Chef Console (only visible when logged in as 'chef') */
            <div className="bg-black text-white rounded-[2.5rem] p-6 shadow-2xl relative border-4 border-gray-800 flex flex-col min-h-[500px] overflow-hidden">
              {/* Phone Status Bar Accent */}
              <div className="flex justify-between items-center text-[9px] font-mono text-gray-500 border-b border-white/10 pb-3 mb-4">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
                  <span className="text-gray-400">CUOCO LIVE</span>
                </div>
                <div className="bg-white/5 px-2 py-0.5 rounded text-white text-[8px] uppercase tracking-wider font-sans font-black">
                  {order.notificationChannel === 'whatsapp' ? 'WhatsApp Bridge' : 'MESA WebSocket'}
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <Wifi className="w-3 h-3 text-green-500" />
                  <span>5G</span>
                </div>
              </div>

              {/* Title & Status */}
              <div className="flex items-start justify-between gap-2 mb-4">
                <div>
                  <h4 className="font-black italic text-md leading-tight text-white mb-0.5">Console {formatChefDisplayName(order.chefName)}</h4>
                  <p className="text-[10px] text-gray-400">Simulatore della ricezione ed evasione dell'ordine</p>
                </div>
                <div className={`px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider border ${
                  order.status === 'PENDING_CONFIRMATION'
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                    : order.status === 'REJECTED'
                      ? 'bg-red-500/15 border-red-500/30 text-red-300'
                      : 'bg-green-500/15 border-green-500/20 text-green-400'
                }`}>
                  {order.status === 'PENDING_CONFIRMATION' ? 'In attesa' : order.status === 'REJECTED' ? 'Rifiutato' : 'Confermato'} €{order.total.toFixed(2)}
                </div>
              </div>

              {/* Notification Banner */}
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl mb-4 relative">
                <div className="flex items-start gap-3">
                  <div className="bg-orange-500/20 p-2.5 rounded-xl text-orange-400 shrink-0">
                    <BellRing className="w-4 h-4 animate-bounce" />
                  </div>
                  <div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-[#ea580c]">NOTIFICA PRENOTAZIONE</span>
                    <h5 className="font-bold text-xs text-white mt-0.5">
                      {order.notificationChannel === 'whatsapp' 
                        ? 'Notificato tramite WhatsApp!' 
                        : order.status === 'PENDING_CONFIRMATION'
                          ? 'Prenotazione ricevuta (pagamento al ritiro/consegna)'
                          : order.status === 'REJECTED'
                            ? 'Prenotazione rifiutata dallo chef'
                            : 'Prenotazione confermata dallo chef'}
                    </h5>
                    <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                      L'ordine si è agganciato automaticamente. {order.notificationChannel === 'whatsapp' 
                        ? 'Puoi simulare le fasi direttamente da questa console del Cuoco!' 
                        : 'Il sistema in tempo reale aggiorna istantaneamente Cliente, Cuoco e Admin.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Console Logs */}
              <div className="flex-1 overflow-y-auto mb-4 p-3 bg-white/5 rounded-xl space-y-1.5 h-32 text-[10px] font-mono scrollbar-none">
                <p className="text-gray-500 text-[9px] uppercase font-black font-sans tracking-wider sticky top-0 bg-black/60 backdrop-blur-md pb-0.5 z-10 border-b border-white/5">NOTIFICHE CENTRALIZZATE</p>
                {statusLogs.map((log, idx) => (
                  <div key={idx} className="flex gap-2 text-gray-300">
                    <span className="text-orange-500 shrink-0">▸</span>
                    <span className="leading-snug">{log}</span>
                  </div>
                ))}
              </div>

              {/* Action Board (Chef Side control) */}
              <div className="border-t border-white/10 pt-4 mt-auto">
                <span className="text-[8px] font-black uppercase tracking-widest text-gray-505 block mb-2 text-center text-gray-400">Azioni Disponibili per lo Chef</span>
                
                {order.status === 'PENDING_CONFIRMATION' && (
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => updateStatusFromChefTerminal(
                        'CONFIRMED', 
                        `✅ Ho confermato la tua prenotazione! Il pagamento avverrà al ritiro o alla consegna secondo le indicazioni dell'ordine.`
                      )}
                      className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-black uppercase tracking-wider text-xs rounded-2xl shadow-lg transition-all active:scale-95"
                    >
                      Conferma
                    </button>
                    <button
                      onClick={() => updateStatusFromChefTerminal(
                        'REJECTED', 
                        `Mi dispiace, non posso accettare questa prenotazione per la data richiesta.`
                      )}
                      className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider text-xs rounded-2xl shadow-lg transition-all active:scale-95"
                    >
                      Rifiuta
                    </button>
                  </div>
                )}

                {order.status === 'REJECTED' && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-4 rounded-2xl text-center">
                    <AlertCircle className="w-7 h-7 text-red-400 mx-auto mb-1.5" />
                    <p className="font-black uppercase tracking-wider text-[11px]">Prenotazione Rifiutata</p>
                    <p className="text-[10px] text-gray-400 mt-1">Stato sincronizzato con Cliente e Admin.</p>
                  </div>
                )}

                {(order.status === 'PLACED' || order.status === 'CONFIRMED') && (
                  <button
                    onClick={() => updateStatusFromChefTerminal(
                      'PREPARING', 
                      `🍳 Sto accendendo i fornelli e preparando gli ingredienti per il tuo piatto! Sarà servito caldissimo.`
                    )}
                    className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-wider text-xs rounded-2xl shadow-lg transition-all animate-pulse active:scale-95"
                  >
                    👨‍🍳 Inizia a Preparare
                  </button>
                )}

                {order.status === 'PREPARING' && (
                  <button
                    onClick={() => updateStatusFromChefTerminal(
                      'READY', 
                      `✅ Ottime notizie! Ho preparato e confezionato con la massima cura il tuo ordine. È ora pronto!`
                    )}
                    className="w-full py-3 bg-[#ea580c] hover:bg-orange-600 text-white font-black uppercase tracking-wider text-xs rounded-2xl shadow-lg transition-all active:scale-95"
                  >
                    🍱 Impacchetta e Segna come Pronto
                  </button>
                )}

                {order.status === 'READY' && order.deliveryMode === 'delivery' && (
                  <button
                    onClick={() => updateStatusFromChefTerminal(
                      'DELIVERING', 
                      `🛵 Il rider di fiducia ha ritirato il piatto ed è appena partito per la consegna!`
                    )}
                    className="w-full py-3 bg-[#ea580c] hover:bg-orange-600 text-white font-black uppercase tracking-wider text-xs rounded-2xl shadow-lg transition-all active:scale-95"
                  >
                    🛵 Affida al Rider MESA Delivery
                  </button>
                )}

                {order.status === 'READY' && order.deliveryMode === 'pickup' && (
                  <button
                    onClick={() => updateStatusFromChefTerminal(
                      'COMPLETED', 
                      `🎉 Ti ringrazio tantissimo! La consegna del piatto caldo si è conclusa con successo.`
                    )}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-black uppercase tracking-wider text-xs rounded-2xl shadow-lg transition-all active:scale-95"
                  >
                    🛍️ Consegnato al Cliente (Pickup)
                  </button>
                )}

                {order.status === 'DELIVERING' && (
                  <button
                    onClick={() => updateStatusFromChefTerminal(
                      'COMPLETED', 
                      `🎉 Buon appetito! Il Rider conferma l'avvenuta consegna del pacco. Facci sapere se ti è piaciuto!`
                    )}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-black uppercase tracking-wider text-xs rounded-2xl shadow-lg transition-all active:scale-95"
                  >
                    🏁 Segna come Consegnato con Successo
                  </button>
                )}

                {order.status === 'COMPLETED' && (
                  <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-2xl text-center">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="font-black uppercase tracking-wider text-[11px]">Evasione Completata</p>
                    <p className="text-[10px] text-gray-400 mt-1 leading-normal">
                      Grazie! I fondi dell'ordine di <strong>€{order.total.toFixed(2)}</strong> sono stati trasferiti con successo sul portafoglio virtuale dello Chef e l'utente è stato notificato.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* MESA Connect - Chat System */
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col h-[500px]">
               <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                        <MessageSquare className="w-5 h-5" />
                     </div>
                     <div>
                        <h4 className="font-black italic text-gray-900 leading-none">MESA Connect</h4>
                        <p className="text-[9px] font-black text-green-500 uppercase tracking-widest mt-1">{formatChefDisplayName(order.chefName)} online</p>
                     </div>
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30 custom-scrollbar">
                  {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-4 rounded-3xl text-sm font-medium shadow-sm leading-relaxed ${
                        m.sender === 'user' 
                          ? 'bg-orange-600 text-white rounded-tr-none font-bold' 
                          : 'bg-white text-gray-800 rounded-tl-none border border-gray-100 font-medium'
                      }`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
               </div>

               <div className="p-4 bg-white border-t border-gray-50">
                  <div className="flex items-center gap-2 bg-gray-50 rounded-2xl p-2 border border-gray-100 focus-within:border-orange-500">
                     <input 
                      type="text" 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Scrivi allo chef..." 
                      className="flex-1 bg-transparent px-3 py-2 text-xs font-bold outline-none text-gray-800"
                     />
                     <button 
                      onClick={handleSendMessage}
                      disabled={!chatInput.trim()}
                      className="bg-black text-white p-2.5 rounded-xl hover:bg-orange-600 transition-all disabled:opacity-30"
                     >
                       <Send className="w-4 h-4" />
                     </button>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
