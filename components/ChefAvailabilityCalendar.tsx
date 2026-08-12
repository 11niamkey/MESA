import React from 'react';
import { Calendar as CalendarIcon, Check, X } from 'lucide-react';

interface ChefAvailabilityCalendarProps {
  availableDays: number[]; // 0 = Sun, 1 = Mon, ...
}

export const ChefAvailabilityCalendar: React.FC<ChefAvailabilityCalendarProps> = ({ availableDays }) => {
  const days = ['DOM', 'LUN', 'MAR', 'MER', 'GIO', 'VEN', 'SAB'];
  const today = new Date().getDay();

  // Reorder days so today is first or standard week view? Let's do Standard Week View starting Today
  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      date: d.getDate(),
      dayIndex: d.getDay(),
      dayName: days[d.getDay()],
    };
  });

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 mt-4">
      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center">
        <CalendarIcon className="w-4 h-4 mr-2 text-orange-600" />
        Calendario Disponibilità (Prossimi 7 giorni)
      </h3>
      
      <div className="grid grid-cols-7 gap-2">
        {next7Days.map((day, idx) => {
          const isAvailable = availableDays.includes(day.dayIndex);
          return (
            <div key={idx} className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-gray-400 mb-1">{day.dayName}</span>
              <div 
                className={`w-10 h-12 rounded-lg flex flex-col items-center justify-center border transition-all ${
                  isAvailable 
                    ? 'bg-green-50 border-green-200 text-green-700' 
                    : 'bg-gray-50 border-gray-100 text-gray-300'
                }`}
              >
                <span className="text-sm font-bold">{day.date}</span>
                {isAvailable ? <Check className="w-3 h-3 mt-1" /> : <X className="w-3 h-3 mt-1" />}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-gray-400 mt-3 text-center">
        * Gli orari specifici sono visibili in fase di prenotazione
      </p>
    </div>
  );
};
