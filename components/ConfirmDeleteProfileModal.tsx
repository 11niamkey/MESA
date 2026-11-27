import React from 'react';
import { AlertCircle, AlertOctagon, ClipboardList, Loader2, Trash2, X } from 'lucide-react';
import { AppUser } from '../types';

interface ConfirmDeleteProfileModalProps {
  isOpen: boolean;
  userRole: AppUser['role'];
  userName: string;
  userEmail: string;
  blockingOrdersCount: number;
  isDeleting: boolean;
  errorMessage?: string | null;
  onCancel: () => void;
  onConfirm: () => void;
  onGoToOrders?: () => void;
}

export const ConfirmDeleteProfileModal: React.FC<ConfirmDeleteProfileModalProps> = ({
  isOpen,
  userRole,
  userName,
  userEmail,
  blockingOrdersCount,
  isDeleting,
  errorMessage,
  onCancel,
  onConfirm,
  onGoToOrders,
}) => {
  if (!isOpen) return null;

  const isChef = userRole === 'chef';
  const hasBlockingOrders = blockingOrdersCount > 0;

  return (
    <div
      className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={() => {
        if (!isDeleting) onCancel();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-profile-title"
    >
      <div
        className="bg-white rounded-[2.5rem] p-6 sm:p-8 max-w-md w-full space-y-5 text-left border border-gray-100 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <AlertOctagon className="w-6 h-6 shrink-0" />
            </div>
            <div className="min-w-0">
              <h4 id="confirm-delete-profile-title" className="font-black text-lg text-gray-900 leading-tight">
                Elimina profilo
              </h4>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider truncate">
                Azione permanente e irreversibile
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            aria-label="Chiudi conferma eliminazione profilo"
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700 disabled:opacity-40 shrink-0"
          >
            <X className="w-5 h-5 shrink-0" />
          </button>
        </div>

        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-1">
          <p className="text-xs font-black uppercase tracking-wider text-gray-500">
            {isChef ? 'Account Cuoco' : 'Account Cliente'}
          </p>
          <p className="font-bold text-sm text-gray-900 truncate">{userName}</p>
          <p className="text-xs text-gray-600 truncate">{userEmail}</p>
        </div>

        {hasBlockingOrders ? (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-2">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-black uppercase tracking-wider text-amber-900">
                  {blockingOrdersCount === 1
                    ? 'Hai 1 ordine ancora attivo'
                    : `Hai ${blockingOrdersCount} ordini ancora attivi`}
                </p>
                <p className="text-xs font-medium text-amber-900 leading-relaxed">
                  Non puoi eliminare il profilo mentre ci sono ordini in corso (in attesa, confermati, in preparazione, pronti o in consegna). Completa o annulla prima gli ordini aperti.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-red-50/80 border border-red-200 text-red-900 space-y-1.5">
              <p className="text-xs font-black uppercase tracking-wider">
                Cosa verrà eliminato definitivamente:
              </p>
              <ul className="text-xs font-medium space-y-1 list-disc list-inside text-red-800">
                <li>Dati personali, credenziali e preferenze account</li>
                <li>Tutti gli indirizzi salvati</li>
                {isChef && (
                  <>
                    <li>Profilo Cuoco, vetrina pubblica e tutti i piatti del menu</li>
                    <li>Eventuale candidatura e documenti caricati</li>
                  </>
                )}
              </ul>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Confermando, verrai disconnesso subito e tornerai alla schermata iniziale di MESA. Questa operazione non può essere annullata.
            </p>
          </div>
        )}

        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-black text-xs uppercase tracking-wider rounded-2xl transition-all disabled:opacity-50"
          >
            Annulla
          </button>

          {hasBlockingOrders ? (
            onGoToOrders && (
              <button
                type="button"
                onClick={onGoToOrders}
                className="px-5 py-3 bg-black hover:bg-gray-800 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all flex items-center gap-2"
              >
                <ClipboardList className="w-4 h-4 shrink-0" />
                <span>Vai agli ordini</span>
              </button>
            )
          ) : (
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-red-600/25 transition-all flex items-center gap-2 disabled:opacity-60"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              ) : (
                <Trash2 className="w-4 h-4 shrink-0" />
              )}
              <span>{isDeleting ? 'Eliminazione...' : 'Elimina definitivamente'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
