import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, Plus, X, ImagePlus, Trash2, Loader2, Link2, Pencil, UtensilsCrossed } from 'lucide-react';
import { Chef, Dish } from '../types';

const DEFAULT_FOOD_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';

// Photos are stored inline in the chef's Firestore document (free plan, no
// Cloud Storage), so each one is resized/compressed to stay small and the
// whole chef document is kept well under Firestore's 1 MB limit.
const MAX_IMAGE_CHARS = 200_000;
const MAX_CHEF_DOC_BYTES = 900_000;
const DESCRIPTION_MAX = 300;

const compressImage = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      let maxSide = 1200;
      let quality = 0.82;
      let output = '';
      for (let attempt = 0; attempt < 10; attempt++) {
        const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
        const width = Math.max(1, Math.round(img.naturalWidth * scale));
        const height = Math.max(1, Math.round(img.naturalHeight * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) break;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        output = canvas.toDataURL('image/jpeg', quality);
        if (output.length <= MAX_IMAGE_CHARS) break;
        if (quality > 0.6) quality -= 0.08;
        else maxSide = Math.round(maxSide * 0.8);
      }
      output ? resolve(output) : reject(new Error('compress-failed'));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('unreadable'));
    };
    img.src = url;
  });

const formatKb = (dataUrl: string) => `${Math.round((dataUrl.length * 0.75) / 1024)} KB`;

interface Draft {
  chefId: string;
  original: Dish | null;
  name: string;
  description: string;
  price: string;
  image: string;
  tags: string;
  ingredients: string;
  preparation: string;
}

interface AdminDishesPanelProps {
  chefs: Chef[];
  onSaveChefDishes: (chefId: string, dishes: Dish[]) => Promise<boolean>;
  chefFilter: string;
  onChefFilterChange: (chefId: string) => void;
  singleChefMode?: boolean;
  title?: string;
  subtitle?: string;
}

export const AdminDishesPanel: React.FC<AdminDishesPanelProps> = ({
  chefs,
  onSaveChefDishes,
  chefFilter,
  onChefFilterChange,
  singleChefMode = false,
  title = 'Piatti del Catalogo',
  subtitle = 'Tocca un piatto per cambiarne foto, nome, descrizione e prezzo. Le modifiche sono visibili subito a tutti.'
}) => {
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState<Draft | null>(null);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return chefs
      .filter(c => chefFilter === 'all' || c.id === chefFilter)
      .flatMap(chef => chef.dishes.map(dish => ({ chef, dish })))
      .filter(({ chef, dish }) =>
        !q ||
        dish.name.toLowerCase().includes(q) ||
        dish.description.toLowerCase().includes(q) ||
        chef.name.toLowerCase().includes(q)
      );
  }, [chefs, chefFilter, search]);

  const openExisting = (chef: Chef, dish: Dish) =>
    setDraft({
      chefId: chef.id,
      original: dish,
      name: dish.name,
      description: dish.description,
      price: dish.price.toFixed(2),
      image: dish.image,
      tags: (dish.tags || []).join(', '),
      ingredients: (dish.ingredients || []).join(', '),
      preparation: dish.preparation || '',
    });

  const openNew = () =>
    setDraft({
      chefId: chefFilter !== 'all' ? chefFilter : chefs[0]?.id || '',
      original: null,
      name: '',
      description: '',
      price: '',
      image: '',
      tags: '',
      ingredients: '',
      preparation: '',
    });

  return (
    <div className="animate-fade-in space-y-8 bg-white rounded-[3rem] p-6 sm:p-10 border border-gray-100 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h3 className="text-3xl font-black italic tracking-tight mb-2">{title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl font-medium">
            {subtitle}
          </p>
        </div>
        <button
          onClick={openNew}
          disabled={chefs.length === 0}
          className="self-start lg:self-auto px-6 py-3.5 bg-black text-white hover:bg-orange-600 disabled:opacity-40 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" /> Nuovo piatto
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 border-b border-gray-100 pb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cerca per piatto, descrizione o cuoco..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-2xl bg-gray-50 focus:ring-2 focus:ring-orange-500 outline-none text-xs font-bold"
          />
        </div>
        {!singleChefMode && (
          <select
            value={chefFilter}
            onChange={(e) => onChefFilterChange(e.target.value)}
            className="sm:w-72 px-4 py-3.5 border border-gray-200 rounded-2xl bg-gray-50 focus:ring-2 focus:ring-orange-500 outline-none text-xs font-bold"
          >
            <option value="all">Tutti i cuochi ({chefs.length})</option>
            {chefs.map(c => (
              <option key={c.id} value={c.id}>{c.nationality} {c.name} · {c.dishes.length} piatti</option>
            ))}
          </select>
        )}
      </div>

      {rows.length === 0 ? (
        <div className="py-16 bg-gray-50 rounded-[2.5rem] text-center border-2 border-dashed border-gray-200">
          <UtensilsCrossed className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="font-bold text-gray-400 text-sm">Nessun piatto trovato.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rows.map(({ chef, dish }) => (
            <button
              key={`${chef.id}-${dish.id}`}
              onClick={() => openExisting(chef, dish)}
              className="group text-left bg-gray-50 rounded-[2rem] border border-gray-200 hover:border-orange-500/40 hover:shadow-xl transition-all overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                  src={dish.image || DEFAULT_FOOD_IMAGE}
                  alt={dish.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_FOOD_IMAGE; }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl flex items-center gap-1.5">
                    <Pencil className="w-3.5 h-3.5" /> Modifica
                  </span>
                </div>
                <span className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-xl text-[11px] font-black text-white">
                  € {dish.price.toFixed(2)}
                </span>
              </div>
              <div className="p-5 space-y-2">
                <h4 className="font-extrabold text-base text-gray-900 leading-tight line-clamp-1">{dish.name}</h4>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 min-h-[2.5rem]">{dish.description}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-orange-600 pt-1">
                  {chef.nationality} {chef.name}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {draft && (
        <DishEditorModal
          draft={draft}
          chefs={chefs}
          singleChefMode={singleChefMode}
          onChange={setDraft}
          onClose={() => setDraft(null)}
          onSaveChefDishes={onSaveChefDishes}
        />
      )}
    </div>
  );
};

interface DishEditorModalProps {
  draft: Draft;
  chefs: Chef[];
  singleChefMode?: boolean;
  onChange: (draft: Draft) => void;
  onClose: () => void;
  onSaveChefDishes: (chefId: string, dishes: Dish[]) => Promise<boolean>;
}

const DishEditorModal: React.FC<DishEditorModalProps> = ({ draft, chefs, singleChefMode = false, onChange, onClose, onSaveChefDishes }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [error, setError] = useState('');

  const chef = chefs.find(c => c.id === draft.chefId);
  const isNew = !draft.original;
  const priceValue = Number(draft.price.replace(',', '.'));
  const canSave = !!chef && draft.name.trim().length > 0 && Number.isFinite(priceValue) && priceValue > 0 && !isProcessing && !isSaving;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !isSaving) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, isSaving]);

  const set = (patch: Partial<Draft>) => onChange({ ...draft, ...patch });

  const handleFile = async (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Il file scelto non è un\'immagine.');
      return;
    }
    setError('');
    setIsProcessing(true);
    try {
      set({ image: await compressImage(file) });
    } catch {
      setError('Impossibile leggere questa foto. Prova con un file JPG o PNG.');
    } finally {
      setIsProcessing(false);
    }
  };

  const persist = async (dishes: Dish[]) => {
    if (!chef) return;
    const docSize = new TextEncoder().encode(JSON.stringify({ ...chef, dishes })).length;
    if (docSize > MAX_CHEF_DOC_BYTES) {
      setError('Le foto di questo cuoco occupano troppo spazio. Usa una foto più piccola o rimuovine una da un altro piatto.');
      return;
    }
    setIsSaving(true);
    const ok = await onSaveChefDishes(chef.id, dishes);
    setIsSaving(false);
    if (ok) onClose();
    else setError('Salvataggio non riuscito. Controlla la connessione e riprova.');
  };

  const handleSave = () => {
    if (!chef || !canSave) return;
    const tags = draft.tags.split(',').map(t => t.trim()).filter(Boolean);
    const ingredients = draft.ingredients.split(',').map(i => i.trim()).filter(Boolean);
    const preparation = draft.preparation.trim();
    const dish: Dish = {
      ...(draft.original ?? { id: `d-${Date.now().toString(36)}`, chefId: chef.id }),
      chefId: chef.id,
      name: draft.name.trim(),
      description: draft.description.trim(),
      price: Math.round(priceValue * 100) / 100,
      image: draft.image.trim(),
      tags,
      ...(ingredients.length > 0 ? { ingredients } : {}),
      ...(preparation ? { preparation } : {}),
    } as Dish;
    if (ingredients.length === 0) delete dish.ingredients;
    if (!preparation) delete dish.preparation;
    const dishes = isNew
      ? [...chef.dishes, dish]
      : chef.dishes.map(d => (d.id === dish.id ? dish : d));
    persist(dishes);
  };

  const handleDelete = () => {
    if (!chef || !draft.original) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    persist(chef.dishes.filter(d => d.id !== draft.original!.id));
  };

  const isInlinePhoto = draft.image.startsWith('data:');

  return (
    <div className="fixed inset-0 z-[110] overflow-y-auto" role="dialog" aria-modal="true" aria-label={isNew ? 'Nuovo piatto' : `Modifica ${draft.original?.name}`}>
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => !isSaving && onClose()} />
        <div className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in-up">
          <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-gray-100">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-600">{isNew ? 'Nuovo piatto' : 'Modifica piatto'}</p>
              <h3 className="text-xl font-black italic tracking-tight text-gray-900">{draft.name.trim() || 'Senza nome'}</h3>
            </div>
            <button onClick={onClose} disabled={isSaving} className="p-2.5 rounded-2xl text-gray-400 hover:text-black hover:bg-gray-100 transition-colors" aria-label="Chiudi">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
            {/* Photo */}
            <div className="space-y-3">
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files?.[0]); }}
                onClick={() => fileInputRef.current?.click()}
                className={`relative aspect-square rounded-[2rem] overflow-hidden cursor-pointer border-2 border-dashed transition-all group ${
                  isDragging ? 'border-orange-500 bg-orange-50 scale-[1.01]' : 'border-gray-200 bg-gray-50 hover:border-orange-400'
                }`}
              >
                {draft.image ? (
                  <img
                    src={draft.image}
                    alt="Anteprima piatto"
                    referrerPolicy="no-referrer"
                    onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_FOOD_IMAGE; }}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-3 p-6 text-center">
                    <ImagePlus className="w-12 h-12" />
                    <p className="text-sm font-bold">Trascina qui una foto<br />o tocca per sceglierla</p>
                  </div>
                )}
                {draft.image && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl flex items-center gap-2">
                      <ImagePlus className="w-4 h-4" /> Cambia foto
                    </span>
                  </div>
                )}
                {isProcessing && (
                  <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center gap-2 text-orange-600">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Ottimizzo la foto…</span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = ''; }}
              />

              <div className="flex items-center justify-between gap-2 text-[10px] font-bold text-gray-400">
                <span>{isInlinePhoto ? `Foto caricata · ${formatKb(draft.image)}` : draft.image ? 'Foto da link' : 'Nessuna foto'}</span>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setShowUrlInput(v => !v)} className="flex items-center gap-1 hover:text-orange-600 uppercase tracking-widest font-black">
                    <Link2 className="w-3.5 h-3.5" /> Link
                  </button>
                  {draft.image && (
                    <button type="button" onClick={() => set({ image: '' })} className="hover:text-red-600 uppercase tracking-widest font-black">
                      Rimuovi
                    </button>
                  )}
                </div>
              </div>
              {showUrlInput && (
                <input
                  type="url"
                  placeholder="https://… incolla il link di un'immagine"
                  value={isInlinePhoto ? '' : draft.image}
                  onChange={(e) => set({ image: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-xs font-bold focus:ring-2 focus:ring-orange-500 outline-none"
                />
              )}
            </div>

            {/* Fields */}
            <div className="space-y-5">
              {isNew && !singleChefMode && (
                <Field label="Cuoco">
                  <select
                    value={draft.chefId}
                    onChange={(e) => set({ chefId: e.target.value })}
                    className="w-full p-3.5 border border-gray-200 rounded-2xl bg-gray-50 text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none"
                  >
                    {chefs.map(c => <option key={c.id} value={c.id}>{c.nationality} {c.name}</option>)}
                  </select>
                </Field>
              )}
              {(!isNew || singleChefMode) && chef && (
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Cuoco: <span className="text-orange-600">{chef.nationality} {chef.name}</span>
                </p>
              )}

              <Field label="Nome del piatto">
                <input
                  type="text"
                  value={draft.name}
                  onChange={(e) => set({ name: e.target.value })}
                  placeholder="Es. Jollof Rice della Nonna"
                  autoFocus={isNew}
                  className="w-full p-3.5 border border-gray-200 rounded-2xl bg-gray-50 text-sm font-extrabold focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </Field>

              <Field label="Descrizione" hint={`${draft.description.length}/${DESCRIPTION_MAX}`}>
                <textarea
                  value={draft.description}
                  onChange={(e) => set({ description: e.target.value.slice(0, DESCRIPTION_MAX) })}
                  rows={5}
                  placeholder="Ingredienti, storia, come viene preparato…"
                  className="w-full p-3.5 border border-gray-200 rounded-2xl bg-gray-50 text-sm font-medium leading-relaxed resize-none focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Prezzo (€)">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={draft.price}
                    onChange={(e) => set({ price: e.target.value.replace(/[^0-9.,]/g, '') })}
                    placeholder="12.50"
                    className="w-full p-3.5 border border-gray-200 rounded-2xl bg-gray-50 text-sm font-black font-mono focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </Field>
                <Field label="Tag" hint="separati da virgola">
                  <input
                    type="text"
                    value={draft.tags}
                    onChange={(e) => set({ tags: e.target.value })}
                    placeholder="Piccante, Vegano"
                    className="w-full p-3.5 border border-gray-200 rounded-2xl bg-gray-50 text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Ingredienti" hint="separati da virgola">
                  <input
                    type="text"
                    value={draft.ingredients}
                    onChange={(e) => set({ ingredients: e.target.value })}
                    placeholder="Pomodoro, Basilico, Olio EVO"
                    className="w-full p-3.5 border border-gray-200 rounded-2xl bg-gray-50 text-xs font-bold focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </Field>
                <Field label="Preparazione">
                  <input
                    type="text"
                    value={draft.preparation}
                    onChange={(e) => set({ preparation: e.target.value })}
                    placeholder="Cottura lenta per 3 ore..."
                    className="w-full p-3.5 border border-gray-200 rounded-2xl bg-gray-50 text-xs font-bold focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </Field>
              </div>

              {error && (
                <p className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 px-6 sm:px-8 py-5 bg-gray-50 border-t border-gray-100">
            {!isNew ? (
              <button
                onClick={handleDelete}
                disabled={isSaving}
                className={`px-5 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 ${
                  confirmDelete ? 'bg-red-600 text-white' : 'text-red-600 hover:bg-red-50'
                }`}
              >
                <Trash2 className="w-4 h-4" /> {confirmDelete ? 'Conferma eliminazione' : 'Elimina piatto'}
              </button>
            ) : <span />}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isSaving}
                className="flex-1 sm:flex-none px-6 py-3 bg-white border border-gray-200 text-gray-600 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-gray-100 transition-all"
              >
                Annulla
              </button>
              <button
                onClick={handleSave}
                disabled={!canSave}
                className="flex-1 sm:flex-none px-8 py-3 bg-orange-600 text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-black hover:text-white disabled:opacity-40 disabled:hover:bg-orange-600 disabled:hover:text-black transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                {isNew ? 'Aggiungi piatto' : 'Salva modifiche'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Field: React.FC<{ label: string; hint?: string; children: React.ReactNode }> = ({ label, hint, children }) => (
  <label className="block">
    <span className="flex items-baseline justify-between mb-1.5">
      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
      {hint && <span className="text-[9px] font-bold text-gray-300">{hint}</span>}
    </span>
    {children}
  </label>
);
