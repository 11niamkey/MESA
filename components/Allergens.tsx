import React, { useState } from 'react';
import { AlertTriangle, Check, Plus, X } from 'lucide-react';

export interface AllergenOption {
  id: string;
  label: string;
  emoji: string;
}

export const MAIN_ALLERGENS: AllergenOption[] = [
  { id: 'Glutine', label: 'Glutine', emoji: '🌾' },
  { id: 'Lattosio', label: 'Lattosio', emoji: '🥛' },
  { id: 'Uova', label: 'Uova', emoji: '🥚' },
  { id: 'Frutta a guscio', label: 'Frutta a guscio', emoji: '🌰' },
  { id: 'Crostacei', label: 'Crostacei', emoji: '🦐' },
  { id: 'Soia', label: 'Soia', emoji: '🫘' },
  { id: 'Sedano', label: 'Sedano', emoji: '🥬' },
  { id: 'Senape', label: 'Senape', emoji: '🟡' },
  { id: 'Arachidi', label: 'Arachidi', emoji: '🥜' },
  { id: 'Pesce', label: 'Pesce', emoji: '🐟' },
  { id: 'Sesamo', label: 'Sesamo', emoji: '🌱' },
  { id: 'Molluschi', label: 'Molluschi', emoji: '🐚' },
];

const ALLERGEN_MAP = new Map<string, AllergenOption>(
  MAIN_ALLERGENS.map((item) => [item.id.toLowerCase(), item])
);

export const getAllergenMeta = (name: string): AllergenOption | undefined =>
  ALLERGEN_MAP.get(name.trim().toLowerCase());

interface AllergensRowProps {
  allergens?: string[];
  className?: string;
}

export const AllergensRow: React.FC<AllergensRowProps> = ({ allergens, className = '' }) => {
  if (!allergens || allergens.length === 0) return null;

  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50/95 border border-amber-200/90 overflow-x-auto scrollbar-hide min-w-0 ${className}`}
      aria-label={`Allergeni presenti: ${allergens.join(', ')}`}
      onClick={(e) => e.stopPropagation()}
    >
      <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-amber-900 shrink-0">
        <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
        <span>Allergeni:</span>
      </span>
      <div className="flex items-center gap-1 shrink-0">
        {allergens.map((rawName) => {
          const cleanName = rawName.trim();
          if (!cleanName) return null;
          const meta = getAllergenMeta(cleanName);
          return (
            <span
              key={cleanName}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white border border-amber-200/80 text-[10px] font-extrabold text-amber-950 whitespace-nowrap leading-none"
            >
              {meta?.emoji && <span aria-hidden="true">{meta.emoji}</span>}
              <span>{meta?.label || cleanName}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
};

interface AllergensPickerProps {
  selected: string[];
  onChange: (next: string[]) => void;
  label?: string;
  helperText?: string;
  compact?: boolean;
}

export const AllergensPicker: React.FC<AllergensPickerProps> = ({
  selected,
  onChange,
  label = 'Allergeni presenti nel piatto',
  helperText = 'Selezione rapida dei principali allergeni. Tocca per attivare o disattivare.',
  compact = false,
}) => {
  const [customInput, setCustomInput] = useState('');

  const normalizedSet = new Set(selected.map((s) => s.trim().toLowerCase()));

  const toggleAllergen = (name: string) => {
    const key = name.trim().toLowerCase();
    if (normalizedSet.has(key)) {
      onChange(selected.filter((item) => item.trim().toLowerCase() !== key));
    } else {
      onChange([...selected, name.trim()]);
    }
  };

  const addCustom = () => {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    if (!normalizedSet.has(trimmed.toLowerCase())) {
      onChange([...selected, trimmed]);
    }
    setCustomInput('');
  };

  const customSelected = selected.filter(
    (item) => !ALLERGEN_MAP.has(item.trim().toLowerCase())
  );

  return (
    <div className={`rounded-2xl border border-amber-200/80 bg-amber-50/40 ${compact ? 'p-3 space-y-2' : 'p-4 space-y-3'}`}>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <span className="text-[9px] font-black text-amber-900 uppercase tracking-widest flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>{label}</span>
          </span>
          {helperText && !compact && (
            <p className="text-[11px] text-gray-500 font-medium mt-0.5">{helperText}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
            selected.length > 0
              ? 'bg-amber-500 text-black'
              : 'bg-gray-200 text-gray-600'
          }`}>
            {selected.length > 0 ? `${selected.length} selezionati` : 'Nessuno'}
          </span>
          {selected.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-[9px] font-black uppercase tracking-wider text-gray-500 hover:text-red-600"
            >
              Azzera
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {MAIN_ALLERGENS.map((allergen) => {
          const isActive = normalizedSet.has(allergen.id.toLowerCase());
          return (
            <button
              key={allergen.id}
              type="button"
              onClick={() => toggleAllergen(allergen.id)}
              aria-pressed={isActive}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] transition-all active:scale-95 ${
                isActive
                  ? 'bg-amber-500 text-black border-amber-600 font-black shadow-sm'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-amber-400 font-bold'
              }`}
            >
              <span aria-hidden="true">{allergen.emoji}</span>
              <span>{allergen.label}</span>
              {isActive && <Check className="w-3 h-3 stroke-[3]" />}
            </button>
          );
        })}

        {customSelected.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => toggleAllergen(name)}
            aria-pressed={true}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border bg-amber-500 text-black border-amber-600 text-[11px] font-black shadow-sm"
          >
            <span>{name}</span>
            <X className="w-3 h-3 stroke-[3]" />
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 pt-0.5">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addCustom();
            }
          }}
          placeholder="Altro allergene (es. Solfiti, Lupini)..."
          className="flex-1 min-w-0 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-amber-500 outline-none"
        />
        <button
          type="button"
          onClick={addCustom}
          disabled={!customInput.trim()}
          className="px-3 py-2 bg-black text-white hover:bg-orange-600 disabled:opacity-40 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shrink-0 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Aggiungi</span>
        </button>
      </div>
    </div>
  );
};
