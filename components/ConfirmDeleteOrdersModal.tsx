import React from 'react';
import { AlertCircle, AlertOctagon, Loader2, Trash2, X } from 'lucide-react';
import { Order, ORDER_STATUS_LABELS } from '../types';
import { isConcludedOrder } from '../utils/orderUtils';

interface ConfirmDeleteOrdersModalProps {
  isOpen: boolean;
  mode: 'single' | 'bulk';
  order?: Order | null;
  ordersCount?: number;
  isDeleting: boolean;
  errorMessage?: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ConfirmDeleteOrdersModal: React.FC<ConfirmDeleteOrdersModalProps> = ({
  isOpen,
  mode,
  order,
  ordersCount = 0,
  isDeleting,
  errorMessage,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const isActiveOrderDelete = mode === 'single' && order ? !isConcludedOrder(order) : false;
  const firstDishName = order?.items?.[0]?.name || order?.chefName || 'Ordine MESA';
  const orderCode = order ? `#${order.id.split('-')[0]}` : '';
  const statusLabel = order ? ORDER_STATUS_LABELS[order.status] || order.status : '';

  return (
    <div
      className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={() => {
        if (!isDeleting) onCancel();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-order-title"
    >
      <div
        className="bg-white rounded-[2.5rem] p-6 sm:p-8 max-w-md w-full space-y-5 text-left border border-gray-100 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <h4 id="confirm-delete-order-title" className="font-black text-lg text-gray-900 leading-tight">
                {mode === 'bulk' ? 'Pulisci ordini conclusi' : 'Elimina Ordine'}
              </h4>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Eliminazione definitiva su Firestore
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            aria-label="Chiudi conferma"
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700 disabled:opacity-40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {mode === 'single' && order ? (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-black text-gray-900">{orderCode}</span>
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white border border-gray-200 text-gray-700">
                  {statusLabel}
                </span>
              </div>
              <p className="font-black text-sm text-orange-600 truncate">{firstDishName}</p>
              <p className="text-xs font-semibold text-gray-600">
                {order.chefName} • {order.items.length} {order.items.length === 1 ? 'piatto' : 'piatti'} • € {order.total.toFixed(2)}
              </p>
            </div>

            {isActiveOrderDelete ? (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold leading-relaxed">
                Questo ordine non risulta ancora completato o rifiutato. Conferma solo se si tratta di un ordine di prova o da rimuovere definitivamente.
              </div>
            ) : (
              <p className="text-xs font-medium text-gray-600 leading-relaxed">
                Confermando, questo ordine concluso verrà rimosso definitivamente dal database e non sarà più visibile nello storico.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-red-50/70 p-4 rounded-2xl border border-red-200">
              <p className="text-sm font-black text-red-900">
                {ordersCount} {ordersCount === 1 ? 'ordine concluso selezionato' : 'ordini conclusi selezionati'}
              </p>
              <p className="text-xs font-semibold text-red-700 mt-1">
                Include ordini completati, rifiutati, annullati o con data già trascorsa.
              </p>
            </div>
            <p className="text-xs font-medium text-gray-600 leading-relaxed">
              Tutti gli ordini ancora attivi o in attesa di conferma rimarranno intatti. L&apos;eliminazione in blocco è definitiva.
            </p>
          </div>
        )}

        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-black text-xs uppercase tracking-wider rounded-2xl transition-all disabled:opacity-50"
          >
            Annulla
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting || (mode === 'bulk' && ordersCount === 0)}
            className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-red-600/25 transition-all flex items-center gap-2 disabled:opacity-60"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            <span>
              {isDeleting
                ? 'Eliminazione...'
                : mode === 'bulk'
                  ? `Pulisci (${ordersCount})`
                  : 'Elimina definitivamente'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
