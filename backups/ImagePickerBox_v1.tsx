import React, { useRef, useState } from 'react';
import { ImagePlus, Link2, Loader2, Trash2, Upload, User } from 'lucide-react';

export const MAX_INLINE_IMAGE_CHARS = 190_000;

export const compressImageToDataUrl = (
  file: File,
  maxSideStart = 900,
  maxChars = MAX_INLINE_IMAGE_CHARS
): Promise<string> =>
  new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let maxSide = maxSideStart;
      let quality = 0.82;
      let output = '';
      for (let attempt = 0; attempt < 10; attempt++) {
        const scale = Math.min(1, maxSide / Math.max(img.naturalWidth || 1, img.naturalHeight || 1));
        const width = Math.max(1, Math.round((img.naturalWidth || 1) * scale));
        const height = Math.max(1, Math.round((img.naturalHeight || 1) * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) break;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        output = canvas.toDataURL('image/jpeg', quality);
        if (output.length <= maxChars) break;
        if (quality > 0.56) quality -= 0.08;
        else maxSide = Math.round(maxSide * 0.78);
      }
      if (output && output.length <= maxChars + 40_000) {
        resolve(output);
      } else {
        reject(new Error('image-too-large'));
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('unreadable'));
    };
    img.src = objectUrl;
  });

export const formatDataUrlKb = (dataUrl: string) =>
  `${Math.max(1, Math.round((dataUrl.length * 0.75) / 1024))} KB`;

interface ImagePickerBoxProps {
  value: string;
  onChange: (nextUrl: string) => void;
  label?: string;
  helperText?: string;
  fallbackImage?: string;
  variant?: 'avatar' | 'card';
  maxSide?: number;
  maxChars?: number;
  allowRemove?: boolean;
  compact?: boolean;
}

export const ImagePickerBox: React.FC<ImagePickerBoxProps> = ({
  value,
  onChange,
  label,
  helperText,
  fallbackImage,
  variant = 'avatar',
  maxSide = variant === 'avatar' ? 560 : 1100,
  maxChars = variant === 'avatar' ? 140_000 : MAX_INLINE_IMAGE_CHARS,
  allowRemove = true,
  compact = false
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isInline = value.startsWith('data:');

  const handleFile = async (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMsg("Seleziona un file immagine valido (JPG, PNG, WEBP).");
      return;
    }
    setErrorMsg('');
    setIsProcessing(true);
    try {
      const compressed = await compressImageToDataUrl(file, maxSide, maxChars);
      onChange(compressed);
      setShowUrlInput(false);
    } catch {
      setErrorMsg("Impossibile elaborare questa foto. Prova un altro file JPG o PNG.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (variant === 'avatar') {
    return (
      <div className="space-y-2.5 text-left">
        {label && (
          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest">
            {label}
          </label>
        )}

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          className={`flex flex-col sm:flex-row items-center gap-4 ${
            compact ? 'p-3.5 rounded-2xl' : 'p-4 rounded-3xl'
          } border-2 border-dashed transition-all ${
            isDragging
              ? 'border-orange-500 bg-orange-50'
              : 'border-gray-200 bg-gray-50/80 hover:border-orange-400'
          }`}
        >
          <div
            onClick={() => inputRef.current?.click()}
            className={`relative ${
              compact ? 'w-14 h-14 rounded-2xl' : 'w-20 h-20 rounded-2xl'
            } overflow-hidden bg-white border-2 border-orange-500/30 shadow-sm shrink-0 cursor-pointer flex items-center justify-center group`}
          >
            {value ? (
              <img
                src={value}
                alt="Anteprima profilo"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  if (fallbackImage) {
                    (e.target as HTMLImageElement).src = fallbackImage;
                  }
                }}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-7 h-7 text-gray-300" />
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-colors flex items-center justify-center">
              <ImagePlus className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {isProcessing && (
              <div className="absolute inset-0 bg-white/85 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-orange-600 animate-spin" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 space-y-2 text-center sm:text-left">
            {helperText && (
              <p className="text-xs font-bold text-gray-700 leading-snug">{helperText}</p>
            )}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => inputRef.current?.click()}
                className="px-3.5 py-2 bg-orange-600 hover:bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{value ? 'Cambia Foto' : 'Carica Foto'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowUrlInput((prev) => !prev)}
                className="px-3 py-2 bg-white border border-gray-200 hover:border-orange-500 text-gray-700 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all"
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>Link URL</span>
              </button>

              {allowRemove && value && (
                <button
                  type="button"
                  onClick={() => {
                    onChange('');
                    setErrorMsg('');
                  }}
                  className="px-2.5 py-2 text-red-600 hover:bg-red-50 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Rimuovi</span>
                </button>
              )}
            </div>

            {isInline && (
              <p className="text-[10px] font-bold text-green-700">
                Foto ottimizzata · {formatDataUrlKb(value)}
              </p>
            )}
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            handleFile(e.target.files?.[0]);
            e.target.value = '';
          }}
        />

        {showUrlInput && (
          <input
            type="url"
            placeholder="https://... incolla il link diretto di una foto"
            value={isInline ? '' : value}
            onChange={(e) => {
              setErrorMsg('');
              onChange(e.target.value);
            }}
            className="w-full p-3 border border-gray-200 rounded-xl bg-white text-xs font-bold focus:ring-2 focus:ring-orange-500 outline-none"
          />
        )}

        {errorMsg && (
          <p className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
            {errorMsg}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2.5 text-left">
      {label && (
        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest">
          {label}
        </label>
      )}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        onClick={() => inputRef.current?.click()}
        className={`relative aspect-[16/9] rounded-3xl overflow-hidden cursor-pointer border-2 border-dashed transition-all group ${
          isDragging
            ? 'border-orange-500 bg-orange-50'
            : 'border-gray-200 bg-gray-50 hover:border-orange-400'
        }`}
      >
        {value ? (
          <img
            src={value}
            alt="Anteprima"
            referrerPolicy="no-referrer"
            onError={(e) => {
              if (fallbackImage) {
                (e.target as HTMLImageElement).src = fallbackImage;
              }
            }}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-2 p-4 text-center">
            <ImagePlus className="w-9 h-9" />
            <p className="text-xs font-bold">
              {helperText || 'Trascina qui la foto o tocca per caricarla dal dispositivo'}
            </p>
          </div>
        )}
        {value && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl flex items-center gap-1.5">
              <ImagePlus className="w-4 h-4" /> Cambia foto
            </span>
          </div>
        )}
        {isProcessing && (
          <div className="absolute inset-0 bg-white/85 flex flex-col items-center justify-center gap-2 text-orange-600">
            <Loader2 className="w-7 h-7 animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-widest">Ottimizzo la foto…</span>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = '';
        }}
      />

      <div className="flex items-center justify-between gap-2 text-[10px] font-bold text-gray-400">
        <span>
          {isInline ? `Foto caricata · ${formatDataUrlKb(value)}` : value ? 'Foto da link' : 'Nessuna foto'}
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowUrlInput((prev) => !prev)}
            className="flex items-center gap-1 hover:text-orange-600 uppercase tracking-widest font-black"
          >
            <Link2 className="w-3.5 h-3.5" /> Link URL
          </button>
          {allowRemove && value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="hover:text-red-600 uppercase tracking-widest font-black"
            >
              Rimuovi
            </button>
          )}
        </div>
      </div>

      {showUrlInput && (
        <input
          type="url"
          placeholder="https://... incolla il link diretto di una foto"
          value={isInline ? '' : value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-xl bg-white text-xs font-bold focus:ring-2 focus:ring-orange-500 outline-none"
        />
      )}

      {errorMsg && (
        <p className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
          {errorMsg}
        </p>
      )}
    </div>
  );
};
