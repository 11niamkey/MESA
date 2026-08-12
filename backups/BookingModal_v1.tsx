import React, { useState } from 'react';
import { X, Calendar, Clock, ChefHat, Truck, ShoppingBag, Flame, Utensils, MessageSquare, Leaf, Info, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { Dish, Chef } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  dish: Dish;
  chef: Chef | undefined;
  onConfirm: (date: string, time: string, deliveryMode: 'delivery' | 'pickup', preferences: any) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, dish, chef, onConfirm }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [deliveryMode, setDeliveryMode] = useState<'delivery' | 'pickup'>('pickup');
  
  // Customization State
  const [spiceLevel, setSpiceLevel] = useState(1); // 0=None, 1=Low, 2=Med, 3=High
  const [saltLevel, setSaltLevel] = useState<'Low' | 'Normal' | 'High'>('Normal');
  const [notes, setNotes] = useState('');

  // Custom Calendar State
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
  const currentMonth = currentCalendarDate.getMonth();
  const currentYear = currentCalendarDate.getFullYear();

  const months = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ];
  const weekdays = ['Lu', 'Ma', 'Me', 'Gi', 'Ve', 'Sa', 'Do'];

  const handlePrevMonth = () => {
    const now = new Date();
    if (currentYear > now.getFullYear() || (currentYear === now.getFullYear() && currentMonth > now.getMonth())) {
      setCurrentCalendarDate(new Date(currentYear, currentMonth - 1, 1));
    }
  };

  const handleNextMonth = () => {
    setCurrentCalendarDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const isDayInPast = (dayNum: number) => {
    const targetDate = new Date(currentYear, currentMonth, dayNum);
    const today = new Date();
    targetDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return targetDate < today;
  };

  const isChefAvailableOnDay = (dayNum: number) => {
    if (!chef || !chef.availableDays) return true;
    const dateObj = new Date(currentYear, currentMonth, dayNum);
    const dayOfWeek = dateObj.getDay();
    return chef.availableDays.includes(dayOfWeek);
  };

  const formatDateStr = (y: number, m: number, d: number) => {
    const mm = String(m + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  };

  const handleSelectDay = (dayNum: number) => {
    setDate(formatDateStr(currentYear, currentMonth, dayNum));
  };

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
    if (!chef || !chef.availableDays) return '';
    const dayNames = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
    return chef.availableDays.map(d => dayNames[d]).join(', ');
  };

  const timeSlots = getChefTimeSlots();

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (date && time) {
      onConfirm(date, time, deliveryMode, { spiceLevel, saltLevel, notes });
      // Reset
      setSpiceLevel(1);
      setSaltLevel('Normal');
      setNotes('');
      setDeliveryMode('pickup');
      setDate('');
      setTime('');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={onClose} />

        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all w-full max-w-2xl border-t-8 border-orange-500 animate-fade-in-up">
          
          {/* Header */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
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
                <img src={dish.image} alt={dish.name} className="w-full md:w-32 md:h-32 rounded-xl object-cover shadow-md" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-900 text-xl mb-1">{dish.name}</h4>
                    <div className="text-orange-600 font-extrabold text-lg">€ {dish.price.toFixed(2)}</div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <ChefHat className="w-4 h-4 mr-1 text-orange-500" />
                    <span>Cucinato da <span className="font-semibold">{chef?.name}</span> {chef?.nationality}</span>
                  </div>
                  
                  {/* Full Description */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {dish.description}
                  </p>

                  {/* Ingredients & Preparation Details */}
                  {(dish.ingredients || dish.preparation) && (
                    <div className="bg-orange-50/50 rounded-lg p-3 border border-orange-100 text-sm space-y-2">
                      {dish.ingredients && (
                        <div>
                          <span className="font-bold text-orange-800 flex items-center text-xs uppercase tracking-wide mb-1">
                            <Leaf className="w-3 h-3 mr-1" /> Ingredienti
                          </span>
                          <p className="text-gray-700">{dish.ingredients.join(', ')}</p>
                        </div>
                      )}
                      {dish.preparation && (
                        <div className={dish.ingredients ? "pt-2 border-t border-orange-100" : ""}>
                          <span className="font-bold text-orange-800 flex items-center text-xs uppercase tracking-wide mb-1">
                            <Info className="w-3 h-3 mr-1" /> Preparazione
                          </span>
                          <p className="text-gray-700 italic">"{dish.preparation}"</p>
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
                <h4 className="font-bold text-gray-900 border-b pb-2 flex items-center">
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
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-gray-50 resize-none"
                    placeholder="Allergie, intolleranze o richieste speciali..."
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              {/* Right Col: Logistics */}
              <div className="space-y-6">
                <h4 className="font-bold text-gray-900 border-b pb-2 flex items-center">
                  <span className="bg-black text-white w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2">2</span>
                  Consegna e Data
                </h4>

                {/* Delivery Mode */}
                <div className="flex p-1 bg-gray-100 rounded-xl">
                  <button
                    onClick={() => setDeliveryMode('pickup')}
                    className={`flex-1 flex items-center justify-center py-2 text-sm font-bold rounded-lg transition-all ${
                      deliveryMode === 'pickup' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Ritiro
                  </button>
                  <button
                    onClick={() => setDeliveryMode('delivery')}
                    className={`flex-1 flex items-center justify-center py-2 text-sm font-bold rounded-lg transition-all ${
                      deliveryMode === 'delivery' ? (chef?.continent === 'Africa' ? 'bg-white text-[#2d5a27] shadow-sm' : 'bg-white text-orange-600 shadow-sm') : 'text-gray-400'
                    }`}
                  >
                    <Truck className="w-4 h-4 mr-2" />
                    Domicilio (+€2.50)
                  </button>
                </div>

                {/* Date Selection */}
                <div className="bg-gray-50 border border-gray-150 p-4 rounded-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                      <CalendarDays className={`w-4 h-4 ${chef?.continent === 'Africa' ? 'text-[#2d5a27]' : 'text-orange-500'}`} />
                      Scegli Data
                    </label>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handlePrevMonth}
                        type="button"
                        className="p-1.5 rounded-lg bg-white shadow-sm border border-gray-100 text-gray-650 hover:bg-gray-50 transition-colors disabled:opacity-45 disabled:cursor-not-allowed"
                        disabled={
                          currentYear <= new Date().getFullYear() &&
                          currentMonth <= new Date().getMonth()
                        }
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-black uppercase text-gray-700 select-none min-w-[95px] text-center">
                        {months[currentMonth]} {currentYear}
                      </span>
                      <button
                        onClick={handleNextMonth}
                        type="button"
                        className="p-1.5 rounded-lg bg-white shadow-sm border border-gray-100 text-gray-650 hover:bg-gray-50 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 text-center mb-3">
                    {weekdays.map(day => (
                      <span key={day} className="text-[10px] font-black uppercase text-gray-400">
                        {day}
                      </span>
                    ))}
                    {(() => {
                      const daysInMonthVal = new Date(currentYear, currentMonth + 1, 0).getDate();
                      const firstDayIndexVal = new Date(currentYear, currentMonth, 1).getDay(); // Sunday=0
                      const startOffsetVal = (firstDayIndexVal + 6) % 7; // Monday first
                      
                      const dayCells = [];
                      for (let i = 0; i < startOffsetVal; i++) {
                        dayCells.push(<div key={`empty-${i}`} className="h-8 w-8" />);
                      }

                      for (let d = 1; d <= daysInMonthVal; d++) {
                        const inPast = isDayInPast(d);
                        const isAvailable = isChefAvailableOnDay(d);
                        const dateStr = formatDateStr(currentYear, currentMonth, d);
                        const isSelected = date === dateStr;
                        const isAfricanChef = chef?.continent === 'Africa';

                        let btnClass = "h-8 w-8 text-xs font-bold rounded-lg flex items-center justify-center transition-all relative mx-auto ";
                        
                        if (inPast) {
                          btnClass += "text-gray-200 cursor-not-allowed line-through";
                        } else if (!isAvailable) {
                          btnClass += "text-gray-300 hover:bg-gray-100/50 cursor-not-allowed";
                        } else if (isSelected) {
                          btnClass += isAfricanChef
                            ? "bg-[#2d5a27] text-[#e5c158] shadow-md scale-105"
                            : "bg-orange-600 text-white shadow-md scale-105";
                        } else {
                          btnClass += isAfricanChef
                            ? "bg-[#2d5a27]/10 text-[#2d5a27] hover:bg-[#2d5a27]/25 cursor-pointer border border-[#2d5a27]/20"
                            : "bg-orange-50 text-orange-600 hover:bg-orange-100 cursor-pointer border border-orange-100";
                        }

                        dayCells.push(
                          <button
                            key={`day-${d}`}
                            onClick={() => !inPast && isAvailable && handleSelectDay(d)}
                            disabled={inPast || !isAvailable}
                            className={btnClass}
                            title={inPast ? 'Data passata' : !isAvailable ? 'Chef non disponibile' : 'Seleziona per ordinare'}
                            type="button"
                          >
                            <span>{d}</span>
                            {isAvailable && !inPast && !isSelected && (
                              <span className={`absolute bottom-0.5 w-1 h-1 rounded-full ${isAfricanChef ? 'bg-[#e5c158]' : 'bg-orange-600'}`} />
                            )}
                          </button>
                        );
                      }
                      return dayCells;
                    })()}
                  </div>

                  {/* Informational Footer in Italian */}
                  <div className="border-t border-gray-200/60 pt-2 flex flex-col gap-1">
                    {chef?.availableDays && (
                      <div className="flex items-center text-[10px] text-gray-500 font-bold gap-1 mt-1">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span>Disponibile: <span className="text-gray-700">{getItalianAvailableDays()}</span></span>
                      </div>
                    )}
                    {date && (
                      <div className={`text-xs font-extrabold flex items-center justify-between mt-1 rounded-xl p-2 ${chef?.continent === 'Africa' ? 'bg-[#2d5a27]/10 text-[#2d5a27]' : 'bg-orange-50 text-orange-700'}`}>
                        <span>Data Selezionata:</span>
                        <span className="uppercase tracking-wide font-black bg-white px-2 py-1 rounded-lg shadow-sm border border-gray-100">
                          {new Date(date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Time Selection */}
                <div>
                  <label className="block text-xs font-bold text-gray-550 uppercase mb-2">Orario di consegna/ritiro</label>
                  <div className="grid grid-cols-4 gap-2 max-h-[140px] overflow-y-auto custom-scrollbar pr-1">
                    {timeSlots.map(slot => (
                      <button
                        key={slot}
                        onClick={() => setTime(slot)}
                        className={`py-1.5 px-1 text-xs font-bold rounded-lg border transition-all ${
                          time === slot
                            ? (chef?.continent === 'Africa' ? 'bg-[#2d5a27] text-[#e5c158] border-[#2d5a27]' : 'bg-orange-600 text-white border-orange-600')
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-orange-50/50'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2 font-medium italic">
                    * Orari elaborati in base alla disponibilità indicata dello chef ({chef?.availability?.join(', ') || 'reali'})
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-200">
            <div className="text-sm text-gray-500 hidden sm:block">
              {deliveryMode === 'delivery' ? 'Consegna a Domicilio inclusa' : 'Ritiro presso Chef'}
            </div>
            <div className="flex space-x-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="flex-1 sm:flex-none px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-xl transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={handleConfirm}
                disabled={!date || !time}
                className="flex-1 sm:flex-none px-6 py-2.5 bg-black text-white font-bold rounded-xl shadow-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center"
              >
                Conferma
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
