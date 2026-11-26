import React, { useState, useEffect, useMemo } from 'react';
import { X, Clock, ChefHat, Truck, ShoppingBag, Flame, Utensils, MessageSquare, Leaf, Info, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { Dish, Chef } from '../types';
import { CountryFlag } from './CountryFlag';
import { AllergensRow } from './Allergens';
import { isChefBookable } from '../utils/chefUtils';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  dish: Dish;
  chef: Chef | undefined;
  onConfirm: (date: string, time: string, deliveryMode: 'delivery' | 'pickup', preferences: any) => void;
  onAddToCart?: (date: string, time: string, deliveryMode: 'delivery' | 'pickup', preferences: any) => void;
}

const DEFAULT_FOOD_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
const MONDAY_FIRST_ORDER = [1, 2, 3, 4, 5, 6, 0] as const;
const ITALIAN_DAY_NAMES = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'] as const;

const parseLocalDate = (dateStr: string): Date | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const parsed = new Date(year, month, day);
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month ||
    parsed.getDate() !== day
  ) {
    return null;
  }
  parsed.setHours(0, 0, 0, 0);
  return parsed;
};

const getTodayStart = (): Date => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
};

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, dish, chef, onConfirm, onAddToCart }) => {
  const canBook = isChefBookable(chef) && !dish.isAvailableSoon;
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [deliveryMode, setDeliveryMode] = useState<'delivery' | 'pickup'>('pickup');
  
  // Customization State
  const [spiceLevel, setSpiceLevel] = useState(1); // 0=None, 1=Low, 2=Med, 3=High
  const [saltLevel, setSaltLevel] = useState<'Low' | 'Normal' | 'High'>('Normal');
  const [notes, setNotes] = useState('');

  // Custom Calendar State
  const [currentCalendarDate, setCurrentCalendarDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const currentMonth = currentCalendarDate.getMonth();
  const currentYear = currentCalendarDate.getFullYear();

  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      setDate('');
      setTime('');
      setDeliveryMode('pickup');
      setSpiceLevel(1);
      setSaltLevel('Normal');
      setNotes('');
      setCurrentCalendarDate(new Date(now.getFullYear(), now.getMonth(), 1));
    }
  }, [isOpen, dish?.id, chef?.id]);

  const months = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ];
  const weekdays = ['Lu', 'Ma', 'Me', 'Gi', 'Ve', 'Sa', 'Do'];

  const normalizedAvailableDays = useMemo<number[]>(() => {
    if (!chef || !Array.isArray(chef.availableDays) || chef.availableDays.length === 0) {
      return [...MONDAY_FIRST_ORDER];
    }
    const validSet = new Set(
      chef.availableDays
        .map((d) => Number(d))
        .filter((d) => Number.isInteger(d) && d >= 0 && d <= 6)
    );
    return validSet.size > 0 ? MONDAY_FIRST_ORDER.filter((d) => validSet.has(d)) : [...MONDAY_FIRST_ORDER];
  }, [chef]);

  const todayNow = new Date();
  const isAtOrBeforeCurrentMonth =
    currentYear < todayNow.getFullYear() ||
    (currentYear === todayNow.getFullYear() && currentMonth <= todayNow.getMonth());

  const handlePrevMonth = () => {
    if (!isAtOrBeforeCurrentMonth) {
      setCurrentCalendarDate(new Date(currentYear, currentMonth - 1, 1));
    }
  };

  const handleNextMonth = () => {
    setCurrentCalendarDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const isDayInPast = (dayNum: number) => {
    const targetDate = new Date(currentYear, currentMonth, dayNum);
    targetDate.setHours(0, 0, 0, 0);
    return targetDate < getTodayStart();
  };

  const isToday = (dayNum: number) => {
    const targetDate = new Date(currentYear, currentMonth, dayNum);
    targetDate.setHours(0, 0, 0, 0);
    return targetDate.getTime() === getTodayStart().getTime();
  };

  const isChefAvailableOnDay = (dayNum: number) => {
    const dayOfWeek = new Date(currentYear, currentMonth, dayNum).getDay();
    return normalizedAvailableDays.includes(dayOfWeek);
  };

  const formatDateStr = (y: number, m: number, d: number) => {
    const mm = String(m + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  };

  const handleSelectDay = (dayNum: number) => {
    if (isDayInPast(dayNum) || !isChefAvailableOnDay(dayNum)) return;
    const nextDate = formatDateStr(currentYear, currentMonth, dayNum);
    if (nextDate !== date) {
      setDate(nextDate);
      setTime('');
    }
  };

  const selectedDateObj = useMemo(() => parseLocalDate(date), [date]);

  const isSelectedDateValid = useMemo(() => {
    if (!selectedDateObj) return false;
    if (selectedDateObj < getTodayStart()) return false;
    return normalizedAvailableDays.includes(selectedDateObj.getDay());
  }, [selectedDateObj, normalizedAvailableDays]);

  const getChefTimeSlots = () => {
    const defaultSlots = [
      '12:00', '12:30', '13:00', '13:30', '14:00',
      '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'
    ];
    if (!chef || !chef.availability || chef.availability.length === 0) {
      return defaultSlots;
    }
    
    try {
      const slots: string[] = [];
      chef.availability.forEach(range => {
        const parts = range.split('-');
        if (parts.length === 2) {
          const start = parts[0].trim();
          const end = parts[1].trim();
          
          const [startH, startM] = start.split(':').map(Number);
          const [endH, endM] = end.split(':').map(Number);
          
          let currentH = startH;
          let currentM = startM;
          let limit = 0;
          
          while (limit < 48) {
            const hh = String(currentH % 24).padStart(2, '0');
            const mm = String(currentM).padStart(2, '0');
            slots.push(`${hh}:${mm}`);
            
            if (currentH % 24 === endH && currentM === endM) {
              break;
            }
            
            currentM += 30;
            if (currentM >= 60) {
              currentH += 1;
              currentM -= 60;
            }
            limit++;
          }
        }
      });
      return slots.length > 0 ? slots : defaultSlots;
    } catch (err) {
      return defaultSlots;
    }
  };

  const getItalianAvailableDays = () => {
    if (normalizedAvailableDays.length === 0) return 'Nessun giorno disponibile';
    return normalizedAvailableDays.map(d => ITALIAN_DAY_NAMES[d]).join(', ');
  };

  const timeSlots = getChefTimeSlots();

  if (!isOpen) return null;

  const resetBookingFields = () => {
    setSpiceLevel(1);
    setSaltLevel('Normal');
    setNotes('');
    setDeliveryMode('pickup');
    setDate('');
    setTime('');
  };

  const handleConfirm = () => {
    if (isSelectedDateValid && time) {
      onConfirm(date, time, deliveryMode, { spiceLevel, saltLevel, notes });
      resetBookingFields();
    }
  };

  const handleAddToCartClick = () => {
    if (isSelectedDateValid && time && onAddToCart) {
      onAddToCart(date, time, deliveryMode, { spiceLevel, saltLevel, notes });
      resetBookingFields();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={onClose} />

        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all w-full max-w-2xl border-t-8 border-orange-500 animate-fade-in-up">
          
          {/* Header */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-b border-gray-100">
            <h3 className="text-xl font-bold text-orange-600 flex items-center">
              <Utensils className="w-5 h-5 mr-2 text-orange-600" />
              Dettagli & Prenotazione
            </h3>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 bg-white rounded-full shadow-sm hover:shadow-md transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {/* Dish Info Expanded */}
            <div className="mb-8 bg-white rounded-xl">
              <div className="flex flex-col md:flex-row md:items-start gap-5">
                <img 
                  src={dish.image || DEFAULT_FOOD_IMAGE} 
                  alt={dish.name} 
                  onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_FOOD_IMAGE; }}
                  className="w-full md:w-32 md:h-32 rounded-xl object-cover shadow-md" 
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-orange-600 text-xl mb-1">{dish.name}</h4>
                    <div className="text-orange-600 font-extrabold text-lg">€ {dish.price.toFixed(2)}</div>
                  </div>
                  
                  <div className="flex items-center text-sm text-black mb-3 gap-1.5">
                    <ChefHat className="w-4 h-4 text-orange-500 shrink-0" />
                    <span>Cucinato da <span className="font-semibold">{chef?.name}</span></span>
                    {chef?.nationality && <CountryFlag flag={chef.nationality} title={chef.countryName} size="sm" />}
                  </div>
                  
                  {/* Full Description */}
                  <p className="text-black text-sm leading-relaxed mb-3">
                    {dish.description}
                  </p>

                  {/* Badges: Prep time, Portion, Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {!canBook && (
                      <span className="px-2.5 py-1 bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-700" /> Disponibile a breve
                      </span>
                    )}
                    <span className="px-2.5 py-1 bg-orange-50 text-orange-800 rounded-lg text-[10px] font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-orange-600" /> Preavviso: 25-35 min
                    </span>
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-[10px] font-bold flex items-center gap-1">
                      <Utensils className="w-3 h-3 text-gray-600" /> Porzione: ~350g
                    </span>
                    {dish.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-[10px] font-semibold text-gray-500">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Allergens Row */}
                  <AllergensRow allergens={dish.allergens} className="mb-3" />

                  {/* Ingredients & Preparation Details */}
                  {(dish.ingredients || dish.preparation) && (
                    <div className="bg-orange-50/50 rounded-lg p-3 border border-orange-100 text-sm space-y-2">
                      {dish.ingredients && (
                        <div>
                          <span className="font-bold text-orange-800 flex items-center text-xs uppercase tracking-wide mb-1">
                            <Leaf className="w-3 h-3 mr-1" /> Ingredienti
                          </span>
                          <p className="text-black">{dish.ingredients.join(', ')}</p>
                        </div>
                      )}
                      {dish.preparation && (
                        <div className={dish.ingredients ? "pt-2 border-t border-orange-100" : ""}>
                          <span className="font-bold text-orange-800 flex items-center text-xs uppercase tracking-wide mb-1">
                            <Info className="w-3 h-3 mr-1" /> Preparazione
                          </span>
                          <p className="text-black italic">"{dish.preparation}"</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
              
              {/* Left Col: Customization */}
              <div className="space-y-6">
                <h4 className="font-bold text-orange-600 border-b pb-2 flex items-center">
                  <span className="bg-black text-white w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2">1</span>
                  Personalizza il Piatto
                </h4>
                
                {/* Spice Level */}
                <div>
                   <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                     <Flame className="w-4 h-4 mr-1 text-red-500" />
                     Livello Piccantezza
                   </label>
                   <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
                      {[0, 1, 2, 3].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setSpiceLevel(level)}
                          className={`flex-1 py-1 text-xs font-bold rounded-md transition-colors ${
                            spiceLevel === level ? 'bg-white text-red-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                          }`}
                        >
                          {level === 0 ? 'Zero' : level === 1 ? 'Poco' : level === 2 ? 'Medio' : 'Fuoco'}
                        </button>
                      ))}
                   </div>
                </div>

                {/* Salt Level */}
                <div>
                   <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                     Sale
                   </label>
                   <div className="flex items-center space-x-2">
                      {(['Low', 'Normal', 'High'] as const).map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setSaltLevel(level)}
                          className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                            saltLevel === level 
                              ? 'bg-blue-50 border-blue-200 text-blue-700' 
                              : 'bg-white border-gray-200 text-gray-500 hover:border-blue-200'
                          }`}
                        >
                          {level === 'Low' ? 'Poco' : level === 'Normal' ? 'Giusto' : 'Saporito'}
                        </button>
                      ))}
                   </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <MessageSquare className="w-4 h-4 mr-1 text-gray-400" />
                    Note per lo Chef
                  </label>
                  <textarea 
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-gray-50 resize-none text-black"
                    placeholder="Allergie, intolleranze o richieste speciali..."
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              {/* Right Col: Logistics */}
              <div className="space-y-6">
                <h4 className="font-bold text-orange-600 border-b pb-2 flex items-center">
                  <span className="bg-black text-white w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2">2</span>
                  Consegna e Data
                </h4>

                {/* Delivery Mode */}
                <div className="flex p-1 bg-gray-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setDeliveryMode('pickup')}
                    className={`flex-1 flex items-center justify-center py-2 text-sm font-bold rounded-lg transition-all ${
                      deliveryMode === 'pickup' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Ritiro
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryMode('delivery')}
                    className={`flex-1 flex items-center justify-center py-2 text-sm font-bold rounded-lg transition-all ${
                      deliveryMode === 'delivery' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400'
                    }`}
                  >
                    <Truck className="w-4 h-4 mr-2" />
                    Domicilio (+€2.50)
                  </button>
                </div>

                {/* Single Date Selector */}
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-bold text-orange-600 flex items-center gap-1.5">
                      <CalendarDays className="w-4 h-4 text-orange-600" />
                      Scegli Data
                    </label>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handlePrevMonth}
                        type="button"
                        className="p-1.5 rounded-lg bg-white shadow-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        disabled={isAtOrBeforeCurrentMonth}
                        aria-label="Mese precedente"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-black uppercase text-gray-800 select-none min-w-[100px] text-center">
                        {months[currentMonth]} {currentYear}
                      </span>
                      <button
                        onClick={handleNextMonth}
                        type="button"
                        className="p-1.5 rounded-lg bg-white shadow-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                        aria-label="Mese successivo"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Calendar Grid: Monday (LU) to Sunday (DO) */}
                  <div className="grid grid-cols-7 gap-1 text-center mb-3">
                    {weekdays.map(day => (
                      <span key={day} className="text-[10px] font-black uppercase text-gray-400 pb-1">
                        {day}
                      </span>
                    ))}
                    {(() => {
                      const daysInMonthVal = new Date(currentYear, currentMonth + 1, 0).getDate();
                      const firstDayIndexVal = new Date(currentYear, currentMonth, 1).getDay(); // 0=Dom..6=Sab
                      const startOffsetVal = (firstDayIndexVal + 6) % 7; // 0=Lu..6=Do
                      
                      const dayCells = [];
                      for (let i = 0; i < startOffsetVal; i++) {
                        dayCells.push(<div key={`empty-${i}`} className="h-8 w-8 mx-auto" />);
                      }

                      for (let d = 1; d <= daysInMonthVal; d++) {
                        const inPast = isDayInPast(d);
                        const todayCell = isToday(d);
                        const isAvailable = isChefAvailableOnDay(d);
                        const isClickable = !inPast && isAvailable;
                        const dateStr = formatDateStr(currentYear, currentMonth, d);
                        const isSelected = isSelectedDateValid && date === dateStr;

                        let btnClass = "h-8 w-8 text-xs font-bold rounded-lg flex items-center justify-center transition-all relative mx-auto ";
                        
                        if (inPast) {
                          btnClass += "text-gray-300 bg-gray-100/70 cursor-not-allowed line-through opacity-50";
                        } else if (!isAvailable) {
                          btnClass += `text-gray-300 cursor-not-allowed ${todayCell ? 'ring-1 ring-gray-300' : ''}`;
                        } else if (isSelected) {
                          btnClass += "bg-orange-600 text-white border border-orange-600 shadow-md scale-105 cursor-pointer";
                        } else {
                          btnClass += `bg-orange-50 text-orange-600 hover:bg-orange-100 cursor-pointer border border-orange-200 ${todayCell ? 'ring-2 ring-orange-300' : ''}`;
                        }

                        dayCells.push(
                          <button
                            key={`day-${d}`}
                            onClick={() => isClickable && handleSelectDay(d)}
                            disabled={!isClickable}
                            className={btnClass}
                            title={inPast ? 'Data passata non selezionabile' : !isAvailable ? 'Chef non disponibile in questo giorno' : 'Seleziona data'}
                            type="button"
                          >
                            <span>{d}</span>
                            {isClickable && !isSelected && (
                              <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-orange-600" />
                            )}
                          </button>
                        );
                      }
                      return dayCells;
                    })()}
                  </div>

                  {/* Informational Footer in Italian */}
                  <div className="border-t border-gray-200/70 pt-2.5 flex flex-col gap-1.5">
                    <div className="flex items-center text-[11px] text-black font-semibold gap-1.5">
                      <span className="inline-block w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                      <span>
                        Disponibile: <span className="font-bold text-orange-600">{getItalianAvailableDays()}</span>
                      </span>
                    </div>
                    {isSelectedDateValid && selectedDateObj && (
                      <div className="text-xs font-extrabold flex items-center justify-between mt-1 rounded-xl p-2 bg-orange-50 text-orange-700 border border-orange-100">
                        <span>Data Selezionata:</span>
                        <span className="capitalize tracking-wide font-black bg-white px-2.5 py-1 rounded-lg shadow-sm border border-orange-100 text-orange-600">
                          {selectedDateObj.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Time Selection: shown ONLY after user selects a valid date */}
                {isSelectedDateValid ? (
                  <div className="animate-fade-in">
                    <label className="block text-xs font-bold text-orange-600 uppercase mb-2">
                      Orario di consegna/ritiro
                    </label>
                    <div className="grid grid-cols-4 gap-2 max-h-[140px] overflow-y-auto custom-scrollbar pr-1">
                      {timeSlots.map(slot => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setTime(slot)}
                          className={`py-1.5 px-1 text-xs font-bold rounded-lg border transition-all ${
                            time === slot
                              ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-orange-50 hover:border-orange-200'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-black/70 mt-2 font-medium italic">
                      * Orari elaborati in base alla disponibilità indicata dello chef ({chef?.availability?.join(', ') || 'standard'})
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-orange-200 bg-orange-50/40 p-4 text-center">
                    <Clock className="w-5 h-5 text-orange-500 mx-auto mb-1.5" />
                    <p className="text-xs font-semibold text-black">
                      Seleziona prima una data valida dal calendario per visualizzare gli orari di consegna/ritiro.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 space-y-3">
            <div className="bg-orange-50 border border-orange-200 rounded-xl px-3.5 py-2.5 flex items-start gap-2.5 text-left">
              <Info className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <p className="text-xs font-semibold text-black leading-snug">
                {canBook
                  ? "Nessun addebito online ora: il pagamento avviene al ritiro o alla consegna secondo le indicazioni dell'ordine."
                  : "Profilo in attivazione per la beta: puoi aggiungere liberamente il piatto al carrello, ma l'invio definitivo dell'ordine sarà attivo a breve."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
              <div className="text-sm text-black font-medium hidden sm:block">
                {deliveryMode === 'delivery' ? 'Consegna a Domicilio (+€2.50)' : 'Ritiro presso Chef'}
              </div>
              <div className="flex flex-wrap sm:flex-nowrap gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-4 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Annulla
                </button>
                {onAddToCart && (
                  <button
                    type="button"
                    onClick={handleAddToCartClick}
                    disabled={!isSelectedDateValid || !time}
                    className="flex-1 sm:flex-none px-5 py-2.5 bg-black hover:bg-gray-800 text-white font-bold rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Aggiungi al carrello</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={!isSelectedDateValid || !time}
                  className="flex-1 sm:flex-none px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center"
                >
                  Invia Prenotazione
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};