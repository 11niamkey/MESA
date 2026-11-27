import React, { useEffect } from 'react';
import { CheckCircle, BellRing, AlertCircle, Info, X, ChevronRight } from 'lucide-react';

export type ToastVariant = 'success' | 'info' | 'warning' | 'error' | 'chef';

interface NotificationToastProps {
  message: string;
  title?: string;
  variant?: ToastVariant;
  actionLabel?: string;
  onAction?: () => void;
  isVisible: boolean;
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  message,
  title,
  variant = 'success',
  actionLabel,
  onAction,
  isVisible,
  onClose,
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, message, title, variant, onClose]);

  if (!isVisible) return null;

  const variantStyles: Record<ToastVariant, { container: string; iconBg: string; icon: React.ReactNode; labelColor: string }> = {
    success: {
      container: 'bg-gray-950/95 text-white border-emerald-500/70 shadow-emerald-950/30',
      iconBg: 'bg-emerald-500 text-black',
      icon: <CheckCircle className="w-4 h-4" />,
      labelColor: 'text-emerald-400',
    },
    chef: {
      container: 'bg-black/95 text-white border-orange-500 shadow-orange-950/40',
      iconBg: 'bg-orange-500 text-black animate-pulse',
      icon: <BellRing className="w-4 h-4" />,
      labelColor: 'text-orange-400',
    },
    warning: {
      container: 'bg-amber-950/95 text-white border-amber-400 shadow-amber-950/30',
      iconBg: 'bg-amber-400 text-black',
      icon: <AlertCircle className="w-4 h-4" />,
      labelColor: 'text-amber-300',
    },
    error: {
      container: 'bg-red-950/95 text-white border-red-500 shadow-red-950/30',
      iconBg: 'bg-red-500 text-white',
      icon: <AlertCircle className="w-4 h-4" />,
      labelColor: 'text-red-300',
    },
    info: {
      container: 'bg-gray-950/95 text-white border-orange-500/60 shadow-black/30',
      iconBg: 'bg-orange-500 text-black',
      icon: <Info className="w-4 h-4" />,
      labelColor: 'text-orange-400',
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 sm:left-6 sm:translate-x-0 z-[130] w-[94%] max-w-md animate-fade-in-up pointer-events-none"
    >
      <div
        className={`pointer-events-auto px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl shadow-2xl border-2 backdrop-blur-md flex items-center justify-between gap-3 ${style.container}`}
      >
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${style.iconBg}`}>
            {style.icon}
          </div>
          <div className="min-w-0">
            {title && (
              <p className={`text-[10px] font-black uppercase tracking-widest leading-none mb-1 ${style.labelColor}`}>
                {title}
              </p>
            )}
            <p className="font-bold text-xs sm:text-sm leading-snug text-white break-words">
              {message}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {actionLabel && onAction && (
            <button
              type="button"
              onClick={() => {
                onAction();
                onClose();
              }}
              className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all active:scale-95"
            >
              <span>{actionLabel}</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Chiudi avviso"
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
