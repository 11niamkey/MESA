import React, { useEffect, useRef, useState } from 'react';
import {
  Bike,
  Calendar,
  Check,
  CheckCircle2,
  ChefHat,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Clock,
  MapPin,
  MessageSquare,
  PackageCheck,
  Send,
  Star,
  Store,
  User,
  Utensils,
  XCircle,
} from 'lucide-react';
import { AppUser, Chef, Message, ORDER_STATUS_LABELS, Order, OrderReview, OrderStatus } from '../types';
import { canClientCancelOrder, formatOrderCode } from '../utils/orderUtils';
import { isOrderEligibleForReview } from '../utils/reviewUtils';
import { sanitizeInputLive, sanitizeText, TEXT_LIMITS } from '../utils/sanitize';

const formatChefDisplayName = (name?: string) => {
  const trimmed = (name || 'MESA').trim();
  return /^chef\b/i.test(trimmed) ? trimmed : `Chef ${trimmed}`;
};

interface ChatMessage {
  id: string;
  sender: 'user' | 'chef';
  text: string;
  time: string;
}

interface OrderTrackingProps {
  order: Order;
  reviews?: OrderReview[];
  onRateOrder?: (order: Order) => void;
  onBack: () => void;
  chefs?: Chef[];
  userRole?: AppUser['role'];
  justPlaced?: boolean;
  onUpdateOrderStatus?: (orderId: string, status: OrderStatus) => void;
  onCancelOrder?: (orderId: string) => void;
  onSendMessage?: (orderId: string, message: Message) => void;
  deliveryAddress?: string;
}

interface StepItem {
  status: OrderStatus;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PICKUP_STEPS: StepItem[] = [
  { status: 'PENDING_CONFIRMATION', label: 'Inviato', icon: Clock },
  { status: 'CONFIRMED', label: 'Confermato', icon: Check },
  { status: 'PREPARING', label: 'In cucina', icon: Utensils },
  { status: 'READY', label: 'Pronto', icon: PackageCheck },
  { status: 'COMPLETED', label: 'Completato', icon: CheckCircle2 },
];

const DELIVERY_STEPS: StepItem[] = [
  { status: 'PENDING_CONFIRMATION', label: 'Inviato', icon: Clock },
  { status: 'CONFIRMED', label: 'Confermato', icon: Check },
  { status: 'PREPARING', label: 'In cucina', icon: Utensils },
  { status: 'READY', label: 'Pronto', icon: PackageCheck },
  { status: 'DELIVERING', label: 'Consegna', icon: Bike },
  { status: 'COMPLETED', label: 'Completato', icon: CheckCircle2 },
];

const getStatusSummary = (
  status: OrderStatus,
  isDelivery: boolean
): { title: string; subtitle: string; badgeClass: string } => {
  switch (status) {
    case 'PENDING_CONFIRMATION':
      return {
        title: 'In attesa di conferma',
        subtitle: 'Lo chef ha ricevuto la richiesta e confermerà a breve.',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
      };
    case 'CONFIRMED':
    case 'PLACED':
      return {
        title: 'Ordine confermato',
        subtitle: 'Prenotazione accettata dallo chef per l’orario concordato.',
        badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
      };
    case 'PREPARING':
      return {
        title: 'In cucina',
        subtitle: 'I piatti sono in preparazione con ingredienti freschi.',
        badgeClass: 'bg-orange-50 text-orange-800 border-orange-200',
      };
    case 'READY':
      return {
        title: isDelivery ? 'Pronto per la consegna' : 'Pronto per il ritiro',
        subtitle: isDelivery
          ? 'Il pacco è pronto e partirà verso il tuo indirizzo.'
          : 'Puoi passare al punto di ritiro indicato dallo chef.',
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      };
    case 'DELIVERING':
      return {
        title: 'In consegna',
        subtitle: 'L’ordine è in viaggio verso l’indirizzo di consegna.',
        badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      };
    case 'COMPLETED':
      return {
        title: isDelivery ? 'Ordine consegnato' : 'Ordine ritirato',
        subtitle: 'Ordine completato con successo. Buon appetito!',
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      };
    case 'REJECTED':
      return {
        title: 'Ordine rifiutato',
        subtitle: 'Lo chef non ha potuto accettare questo ordine.',
        badgeClass: 'bg-red-50 text-red-700 border-red-200',
      };
    case 'CANCELLED':
      return {
        title: 'Ordine annullato',
        subtitle: 'Questo ordine è stato annullato e non verrà preparato.',
        badgeClass: 'bg-red-50 text-red-700 border-red-200',
      };
    default:
      return {
        title: ORDER_STATUS_LABELS[status] || 'Aggiornamento ordine',
        subtitle: '',
        badgeClass: 'bg-stone-100 text-stone-700 border-stone-200',
      };
  }
};

const formatOrderMessageTime = (ts?: Date | string) => {
  if (!ts) return '';
  const parsed = ts instanceof Date ? ts : new Date(ts);
  return Number.isNaN(parsed.getTime())
    ? ''
    : parsed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const buildMessagesState = (order: Order): ChatMessage[] => {
  const orderCode = formatOrderCode(order.id);
  const welcomeMessage: ChatMessage = {
    id: 'welcome-msg',
    sender: 'chef',
    text: `Ciao ${order.customerName?.split(' ')[0] || ''}! Ho ricevuto il tuo ordine ${orderCode}. Scrivimi pure qui se hai bisogno.`,
    time: formatOrderMessageTime(order.timestamp || new Date()),
  };
  if (order.messages && order.messages.length > 0) {
    const persisted = order.messages.map((m, idx) => ({
      id: m.id || `msg-${idx}`,
      sender: (m.sender === 'chef' ? 'chef' : 'user') as 'user' | 'chef',
      text: m.text,
      time: formatOrderMessageTime(m.timestamp),
    }));
    return [welcomeMessage, ...persisted];
  }
  return [welcomeMessage];
};

export const OrderTracking: React.FC<OrderTrackingProps> = ({
  order,
  reviews = [],
  onRateOrder,
  onBack,
  chefs = [],
  userRole = 'client',
  justPlaced = false,
  onUpdateOrderStatus,
  onCancelOrder,
  onSendMessage,
  deliveryAddress,
}) => {
  const isChefView = userRole === 'chef' || userRole === 'admin';
  const isDelivery = order.deliveryMode === 'delivery';
  const isTerminalCancelled = order.status === 'CANCELLED' || order.status === 'REJECTED';
  const orderCode = formatOrderCode(order.id);
  const matchingChef = chefs.find(
    (c) => c.id === order.chefId || c.name.toLowerCase() === order.chefName.toLowerCase()
  );

  const steps = isDelivery ? DELIVERY_STEPS : PICKUP_STEPS;
  const normalizedStatus: OrderStatus = order.status === 'PLACED' ? 'CONFIRMED' : order.status;
  const activeStepIndex = steps.findIndex((step) => step.status === normalizedStatus);
  const statusSummary = getStatusSummary(order.status, isDelivery);

  const firstScheduledItem = order.items.find((item) => item.scheduledDate || item.scheduledTime);
  const scheduleLabel = [
    firstScheduledItem?.scheduledDate,
    firstScheduledItem?.scheduledTime || order.estimatedTime,
  ]
    .filter(Boolean)
    .join(' · ');

  const existingReview = reviews.find((r) => r.orderId === order.id);
  const alreadyReviewed = Boolean(existingReview || order.hasReview || order.isReviewed);
  const reviewedScore = existingReview?.ratingOverall ?? order.reviewRating;
  const canRate = !isChefView && isOrderEligibleForReview(order, reviews) && Boolean(onRateOrder);
  const canCancel = !isChefView && Boolean(onCancelOrder) && canClientCancelOrder(order);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => buildMessagesState(order));

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(buildMessagesState(order));
  }, [order.id, order.messages]);

  useEffect(() => {
    if (isChatOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatOpen]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = sanitizeText(messageInput, TEXT_LIMITS.CHAT_MESSAGE);
    if (!trimmed) return;

    const timestamp = new Date();
    const sender: 'user' | 'chef' = isChefView ? 'chef' : 'user';
    const messageId = `msg-${Date.now()}`;
    const persistedMessage: Message = {
      id: messageId,
      sender,
      text: trimmed,
      timestamp,
    };

    setMessages((prev) => [
      ...prev,
      {
        id: messageId,
        sender,
        text: trimmed,
        time: formatOrderMessageTime(timestamp),
      },
    ]);
    onSendMessage?.(order.id, persistedMessage);
    setMessageInput('');
  };

  const pickupLocationText = matchingChef?.location || 'Cucina dello Chef (indirizzo comunicato in chat)';
  const deliveryAddressText = deliveryAddress || 'Indirizzo registrato dal cliente';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4">
      {/* Header compatto */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-600 hover:text-stone-900 bg-white border border-stone-200 rounded-xl px-3 py-2 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 shrink-0" />
          <span>{isChefView ? 'Torna alla Dashboard' : 'I miei ordini'}</span>
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-2.5 py-1.5 rounded-lg">
            Ordine {orderCode}
          </span>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-lg">
            Contanti {isDelivery ? 'alla consegna' : 'al ritiro'}
          </span>
        </div>
      </div>

      {justPlaced && !isChefView && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-sm text-emerald-900">
            <p className="font-semibold">Ordine inviato allo chef!</p>
            <p className="text-emerald-700 text-xs mt-0.5">
              Pagherai €{order.total.toFixed(2)} in contanti al momento {isDelivery ? 'della consegna' : 'del ritiro'}.
            </p>
          </div>
        </div>
      )}

      {/* 1. Card Stato Ordine + Barra compatta */}
      <section className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${statusSummary.badgeClass}`}
            >
              {ORDER_STATUS_LABELS[order.status]}
            </span>
            <h1 className="text-lg sm:text-xl font-bold text-stone-900 mt-2">
              {statusSummary.title}
            </h1>
            {statusSummary.subtitle && (
              <p className="text-sm text-stone-600 mt-0.5">{statusSummary.subtitle}</p>
            )}
          </div>
        </div>

        {/* Barra progressiva orizzontale compatta */}
        {!isTerminalCancelled ? (
          <div className="pt-1">
            <div className={`grid ${isDelivery ? 'grid-cols-6 gap-1 sm:gap-2' : 'grid-cols-5 gap-1 sm:gap-2'}`}>
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isDone = activeStepIndex > index || order.status === 'COMPLETED';
                const isCurrent = activeStepIndex === index && order.status !== 'COMPLETED';

                return (
                  <div
                    key={step.status}
                    className="flex flex-col items-center text-center gap-1.5 min-w-0 px-0.5"
                  >
                    <div
                      className={`w-full h-1.5 rounded-full transition-colors ${
                        isDone
                          ? 'bg-emerald-500'
                          : isCurrent
                          ? isChefView
                            ? 'bg-emerald-600 animate-pulse'
                            : 'bg-orange-500 animate-pulse'
                          : 'bg-stone-200'
                      }`}
                    />
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center border transition-colors shrink-0 ${
                        isDone
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-600'
                          : isCurrent
                          ? isChefView
                            ? 'bg-emerald-50 border-emerald-600 text-emerald-700'
                            : 'bg-orange-50 border-orange-500 text-orange-600'
                          : 'bg-stone-50 border-stone-200 text-stone-400'
                      }`}
                    >
                      <StepIcon className="w-3.5 h-3.5 shrink-0" />
                    </div>
                    <span
                      className={`text-[9px] min-[390px]:text-[10px] sm:text-xs font-semibold leading-tight tracking-tight w-full text-center ${
                        isDone
                          ? 'text-emerald-700'
                          : isCurrent
                          ? isChefView
                            ? 'text-emerald-700'
                            : 'text-orange-700'
                          : 'text-stone-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 flex items-center gap-2 text-xs sm:text-sm text-red-700">
            <XCircle className="w-4 h-4 shrink-0" />
            <span>
              {order.status === 'REJECTED'
                ? 'Ordine rifiutato dallo chef. Puoi scegliere un altro piatto dallo storefront.'
                : 'Ordine annullato. Puoi effettuare un nuovo ordine dallo storefront.'}
            </span>
          </div>
        )}

        {/* Info essenziali modalità e orario */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-stone-100 text-xs sm:text-sm">
          <div className="flex items-start gap-2.5 bg-stone-50 rounded-xl p-3">
            {isDelivery ? (
              <Bike className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
            ) : (
              <Store className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            )}
            <div className="min-w-0">
              <p className="font-semibold text-stone-800">
                {isDelivery ? 'Consegna a domicilio' : 'Ritiro in sede'}
              </p>
              <p className="text-stone-600 text-xs mt-0.5 break-words flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-stone-400" />
                <span>{isDelivery ? deliveryAddressText : pickupLocationText}</span>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 bg-stone-50 rounded-xl p-3">
            <Calendar className="w-4 h-4 text-stone-600 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="font-semibold text-stone-800">Data e fascia oraria</p>
              <p className="text-stone-600 text-xs mt-0.5">
                {scheduleLabel || 'Appena pronto / da concordare'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Controlli rapidi CUOCO (solo cambio stato essenziale) */}
      {isChefView && onUpdateOrderStatus && !isTerminalCancelled && (
        <section className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-emerald-900 font-semibold text-sm">
            <ChefHat className="w-4 h-4 shrink-0 text-emerald-700" />
            <span>Gestione stato ordine</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {order.status === 'PENDING_CONFIRMATION' && (
              <>
                <button
                  type="button"
                  onClick={() => onUpdateOrderStatus(order.id, 'CONFIRMED')}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors"
                >
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Conferma ordine</span>
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateOrderStatus(order.id, 'CANCELLED')}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold transition-colors"
                >
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>Rifiuta</span>
                </button>
              </>
            )}

            {(order.status === 'CONFIRMED' || order.status === 'PLACED') && (
              <button
                type="button"
                onClick={() => onUpdateOrderStatus(order.id, 'PREPARING')}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors"
              >
                <Utensils className="w-4 h-4 shrink-0" />
                <span>Inizia a preparare</span>
              </button>
            )}

            {order.status === 'PREPARING' && (
              <button
                type="button"
                onClick={() => onUpdateOrderStatus(order.id, 'READY')}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors"
              >
                <PackageCheck className="w-4 h-4 shrink-0" />
                <span>Segna come pronto</span>
              </button>
            )}

            {order.status === 'READY' && isDelivery && (
              <button
                type="button"
                onClick={() => onUpdateOrderStatus(order.id, 'DELIVERING')}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors"
              >
                <Bike className="w-4 h-4 shrink-0" />
                <span>In consegna</span>
              </button>
            )}

            {(order.status === 'DELIVERING' || (order.status === 'READY' && !isDelivery)) && (
              <button
                type="button"
                onClick={() => onUpdateOrderStatus(order.id, 'COMPLETED')}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{isDelivery ? 'Segna consegnato' : 'Segna ritirato / completato'}</span>
              </button>
            )}

            {order.status === 'COMPLETED' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Ordine completato</span>
              </span>
            )}
          </div>
        </section>
      )}

      {/* Card Valutazione Cliente per Ordine Completato */}
      {!isChefView && order.status === 'COMPLETED' && (canRate || alreadyReviewed) && (
        <section
          className={`rounded-2xl p-4 border ${
            alreadyReviewed
              ? 'bg-amber-50/70 border-amber-200'
              : 'bg-orange-50 border-orange-200'
          }`}
        >
          {alreadyReviewed ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 fill-amber-500 text-amber-500 shrink-0" />
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-900">Recensione inviata</p>
                  {existingReview?.comment ? (
                    <p className="text-xs text-stone-600 italic mt-0.5">“{existingReview.comment}”</p>
                  ) : (
                    <p className="text-xs text-stone-600">
                      Grazie per aver valutato {formatChefDisplayName(order.chefName)}.
                    </p>
                  )}
                </div>
              </div>
              {typeof reviewedScore === 'number' && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-amber-200 text-amber-700 text-sm font-bold">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500 shrink-0" />
                  <span>{reviewedScore.toFixed(1)}</span>
                </span>
              )}
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 shrink-0" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-stone-900">
                    Valuta Cuoco e Piatti
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600">
                    Racconta com’è andata con {formatChefDisplayName(order.chefName)} (piatti, servizio e packaging).
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onRateOrder?.(order)}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold shrink-0 transition-colors"
              >
                <Star className="w-4 h-4 shrink-0" />
                <span>Valuta Cuoco e Piatti</span>
              </button>
            </div>
          )}
        </section>
      )}

      {/* 2. Riepilogo Ordine Essenziale */}
      <section className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <ChefHat className={`w-4 h-4 shrink-0 ${isChefView ? 'text-emerald-600' : 'text-orange-500'}`} />
            <span className="font-bold text-stone-900 text-sm sm:text-base">
              {formatChefDisplayName(order.chefName)}
            </span>
          </div>

          {isChefView && order.customerName && (
            <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-stone-600 bg-stone-50 px-2.5 py-1 rounded-lg">
              <User className="w-3.5 h-3.5 shrink-0 text-stone-400" />
              <span>Cliente: {order.customerName}</span>
            </div>
          )}
        </div>

        <ul className="divide-y divide-stone-100">
          {order.items.map((item, idx) => (
            <li
              key={`${item.id}-${idx}`}
              className="py-2.5 first:pt-0 last:pb-0 flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <span className="inline-flex items-center justify-center min-w-[1.75rem] h-6 px-1.5 rounded-md bg-stone-100 text-stone-800 text-xs font-bold shrink-0">
                  {item.quantity}x
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-stone-900 break-words">
                    {item.name}
                  </p>
                  {item.preferences?.notes && (
                    <p className="text-xs text-stone-500 mt-0.5 break-words">
                      Note: {item.preferences.notes}
                    </p>
                  )}
                </div>
              </div>
              <span className="text-sm font-semibold text-stone-800 shrink-0">
                €{(item.price * item.quantity).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>

        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <span className="text-xs sm:text-sm text-stone-600">
            Totale da pagare in contanti {isDelivery ? 'alla consegna' : 'al ritiro'}
          </span>
          <span className="text-lg sm:text-xl font-bold text-stone-900">
            €{order.total.toFixed(2)}
          </span>
        </div>

        {canCancel && (
          <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-end gap-2">
            {confirmCancel ? (
              <>
                <span className="text-xs text-stone-600 mr-auto">Annullare questo ordine?</span>
                <button
                  type="button"
                  onClick={() => setConfirmCancel(false)}
                  className="px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50"
                >
                  Indietro
                </button>
                <button
                  type="button"
                  onClick={() => onCancelOrder?.(order.id)}
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-semibold text-white"
                >
                  Conferma annullamento
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmCancel(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
              >
                <XCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Annulla ordine</span>
              </button>
            )}
          </div>
        )}
      </section>

      {/* 3. Chat rapida compatta e richiudibile */}
      <section className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
        <button
          type="button"
          onClick={() => setIsChatOpen((prev) => !prev)}
          className="w-full px-4 py-3.5 flex items-center justify-between gap-3 text-left hover:bg-stone-50 transition-colors"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4 shrink-0" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-stone-900">
                {isChefView ? 'Chat con il Cliente' : 'Chat con il Cuoco'}
              </p>
              <p className="text-xs text-stone-500 truncate">
                {messages.length} {messages.length === 1 ? 'messaggio' : 'messaggi'} · Tocca per{' '}
                {isChatOpen ? 'chiudere' : 'aprire'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 text-stone-500">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
              {messages.length}
            </span>
            {isChatOpen ? (
              <ChevronUp className="w-4 h-4 shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 shrink-0" />
            )}
          </div>
        </button>

        {isChatOpen && (
          <div className="border-t border-stone-100 flex flex-col">
            <div className="max-h-64 overflow-y-auto p-4 space-y-2.5 bg-stone-50/60">
              {messages.map((msg) => {
                const isOwn = isChefView ? msg.sender === 'chef' : msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs sm:text-sm ${
                        isOwn
                          ? isChefView
                            ? 'bg-emerald-600 text-white rounded-br-sm'
                            : 'bg-orange-500 text-white rounded-br-sm'
                          : 'bg-white border border-stone-200 text-stone-800 rounded-bl-sm'
                      }`}
                    >
                      <p className="break-words">{msg.text}</p>
                    </div>
                    {msg.time && (
                      <span className="text-[10px] text-stone-400 mt-1 px-1">{msg.time}</span>
                    )}
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            <form
              onSubmit={handleSendMessage}
              className="p-3 bg-white border-t border-stone-100 flex items-center gap-2"
            >
              <input
                type="text"
                maxLength={TEXT_LIMITS.CHAT_MESSAGE}
                value={messageInput}
                onChange={(e) => setMessageInput(sanitizeInputLive(e.target.value, TEXT_LIMITS.CHAT_MESSAGE))}
                placeholder={
                  isChefView ? 'Scrivi un messaggio al cliente...' : 'Scrivi un messaggio allo chef...'
                }
                className="flex-1 min-w-0 text-sm px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
              />
              <button
                type="submit"
                disabled={!messageInput.trim()}
                aria-label="Invia messaggio"
                className={`inline-flex items-center justify-center w-9 h-9 rounded-xl disabled:bg-stone-200 disabled:text-stone-400 text-white shrink-0 transition-colors ${
                  isChefView ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-orange-500 hover:bg-orange-600'
                }`}
              >
                <Send className="w-4 h-4 shrink-0" />
              </button>
            </form>
          </div>
        )}
      </section>
    </div>
  );
};
