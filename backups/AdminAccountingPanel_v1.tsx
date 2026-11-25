import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CalendarDays,
  ChefHat,
  Download,
  Euro,
  Landmark,
  Loader2,
  Percent,
  RefreshCw,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, isFirebaseConfigured, OperationType } from '../firebase';
import { Chef, Order } from '../types';
import { CountryFlag } from './CountryFlag';

interface AdminAccountingPanelProps {
  chefs: Chef[];
  fallbackOrders: Order[];
}

type AccountingPeriod = 'all' | 'month' | '7d';

interface ChefAccountingRow {
  chefKey: string;
  chefName: string;
  matchedChef?: Chef;
  confirmedOrdersCount: number;
  grossSold: number;
  mesaFee: number;
  chefNet: number;
}

const CONFIRMED_REVENUE_STATUSES = new Set([
  'CONFIRMED',
  'PLACED',
  'PREPARING',
  'READY',
  'DELIVERING',
  'COMPLETED',
]);

const parseOrderDate = (order: Order): Date | null => {
  const rawTs = (order as unknown as { timestamp?: unknown }).timestamp;
  if (rawTs instanceof Date && !Number.isNaN(rawTs.getTime())) {
    return rawTs;
  }
  if (rawTs && typeof (rawTs as { toDate?: () => Date }).toDate === 'function') {
    const d = (rawTs as { toDate: () => Date }).toDate();
    if (!Number.isNaN(d.getTime())) return d;
  }
  if (typeof rawTs === 'string' || typeof rawTs === 'number') {
    const d = new Date(rawTs);
    if (!Number.isNaN(d.getTime())) return d;
  }
  const scheduled = order.items?.[0]?.scheduledDate;
  if (scheduled && /^\d{4}-\d{2}-\d{2}$/.test(scheduled)) {
    const [y, m, d] = scheduled.split('-').map(Number);
    const parsed = new Date(y, m - 1, d);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return null;
};

const formatCurrency = (amount: number): string =>
  amount.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const escapeCsvField = (value: string | number): string => {
  const str = String(value);
  if (/[",\n\r;]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export const AdminAccountingPanel: React.FC<AdminAccountingPanelProps> = ({
  chefs,
  fallbackOrders,
}) => {
  const [liveOrders, setLiveOrders] = useState<Order[] | null>(null);
  const [isLoadingFirestore, setIsLoadingFirestore] = useState<boolean>(Boolean(isFirebaseConfigured && db));
  const [firestoreError, setFirestoreError] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  const [period, setPeriod] = useState<AccountingPeriod>('all');
  const [commissionInput, setCommissionInput] = useState<string>('10');
  const [fixedFeeInput, setFixedFeeInput] = useState<string>('0');

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      setIsLoadingFirestore(false);
      setLiveOrders(null);
      return;
    }

    setIsLoadingFirestore(true);
    const unsub = onSnapshot(
      collection(db, 'orders'),
      (snapshot) => {
        const parsedOrders: Order[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as Record<string, any>;
          const rawTimestamp = data.timestamp;
          const resolvedDate =
            rawTimestamp?.toDate
              ? rawTimestamp.toDate()
              : rawTimestamp
                ? new Date(rawTimestamp)
                : new Date();

          return {
            ...data,
            id: data.id || docSnap.id,
            status: String(data.status || 'PENDING_CONFIRMATION').trim().toUpperCase(),
            total: Number(data.total) || 0,
            items: Array.isArray(data.items) ? data.items : [],
            timestamp: Number.isNaN(resolvedDate.getTime()) ? new Date() : resolvedDate,
          } as Order;
        });

        setLiveOrders(parsedOrders);
        setFirestoreError(null);
        setLastSyncedAt(new Date());
        setIsLoadingFirestore(false);
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, 'orders', false);
        setFirestoreError('Impossibile leggere in tempo reale la collezione ordini da Firestore. Verifica connessione o permessi.');
        setIsLoadingFirestore(false);
      }
    );

    return () => unsub();
  }, []);

  const sourceOrders = liveOrders ?? fallbackOrders;

  const commissionPct = useMemo(() => {
    const normalized = Number(commissionInput.replace(',', '.'));
    if (!Number.isFinite(normalized)) return 0;
    return Math.min(100, Math.max(0, normalized));
  }, [commissionInput]);

  const fixedClientFee = useMemo(() => {
    const normalized = Number(fixedFeeInput.replace(',', '.'));
    if (!Number.isFinite(normalized)) return 0;
    return Math.max(0, normalized);
  }, [fixedFeeInput]);

  const eligibleOrders = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6, 0, 0, 0, 0);

    return sourceOrders.filter((order) => {
      const normalizedStatus = String(order.status || '').trim().toUpperCase();
      if (!CONFIRMED_REVENUE_STATUSES.has(normalizedStatus)) {
        return false;
      }

      if (period === 'all') return true;

      const orderDate = parseOrderDate(order);
      if (!orderDate) return false;

      if (period === 'month') {
        return orderDate.getTime() >= startOfMonth.getTime();
      }
      if (period === '7d') {
        return orderDate.getTime() >= sevenDaysAgo.getTime();
      }
      return true;
    });
  }, [sourceOrders, period]);

  const { chefRows, totalGross, totalMesaEarnings, totalChefNet } = useMemo(() => {
    const map = new Map<string, ChefAccountingRow>();
    const rate = commissionPct / 100;

    eligibleOrders.forEach((order) => {
      const baseTotal = Math.max(0, Number(order.total) || 0);
      const matchedChef = chefs.find(
        (c) =>
          c.id === order.chefId ||
          (order.chefName && c.name.trim().toLowerCase() === order.chefName.trim().toLowerCase())
      );

      const canonicalName = matchedChef?.name || order.chefName || 'Chef MESA';
      const chefKey = matchedChef?.id || order.chefId || canonicalName.toLowerCase();

      const orderMesaFee = baseTotal * rate + fixedClientFee;
      const orderChefNet = baseTotal * (1 - rate);
      const orderGross = baseTotal + fixedClientFee;

      const existing = map.get(chefKey);
      if (existing) {
        existing.confirmedOrdersCount += 1;
        existing.grossSold += orderGross;
        existing.mesaFee += orderMesaFee;
        existing.chefNet += orderChefNet;
      } else {
        map.set(chefKey, {
          chefKey,
          chefName: canonicalName,
          matchedChef,
          confirmedOrdersCount: 1,
          grossSold: orderGross,
          mesaFee: orderMesaFee,
          chefNet: orderChefNet,
        });
      }
    });

    const rows = Array.from(map.values()).sort((a, b) => b.grossSold - a.grossSold);
    const totals = rows.reduce(
      (acc, row) => ({
        gross: acc.gross + row.grossSold,
        mesa: acc.mesa + row.mesaFee,
        net: acc.net + row.chefNet,
      }),
      { gross: 0, mesa: 0, net: 0 }
    );

    return {
      chefRows: rows,
      totalGross: totals.gross,
      totalMesaEarnings: totals.mesa,
      totalChefNet: totals.net,
    };
  }, [eligibleOrders, chefs, commissionPct, fixedClientFee]);

  const handleExportCsv = () => {
    const headers = [
      'Nome Cuoco',
      'N° Ordini Confermati',
      'Totale Venduto (€)',
      'Quota MESA (€)',
      'Netto Cuoco (€)',
    ];

    const lines = [
      headers.map(escapeCsvField).join(','),
      ...chefRows.map((row) =>
        [
          row.chefName,
          row.confirmedOrdersCount,
          row.grossSold.toFixed(2),
          row.mesaFee.toFixed(2),
          row.chefNet.toFixed(2),
        ]
          .map(escapeCsvField)
          .join(',')
      ),
      [
        'TOTALE GENERALE',
        eligibleOrders.length,
        totalGross.toFixed(2),
        totalMesaEarnings.toFixed(2),
        totalChefNet.toFixed(2),
      ]
        .map(escapeCsvField)
        .join(','),
    ];

    const csvContent = `\uFEFF${lines.join('\r\n')}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `mesa-contabilita-commissioni-${period}-${dateStamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const periodOptions: { key: AccountingPeriod; label: string }[] = [
    { key: 'all', label: 'Tutto' },
    { key: 'month', label: 'Questo mese' },
    { key: '7d', label: 'Ultimi 7 giorni' },
  ];

  return (
    <div className="animate-fade-in space-y-8 bg-white rounded-[3rem] p-6 sm:p-10 border border-gray-100 shadow-sm text-left">
      {/* Header sezione Contabilità */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap mb-1">
            <h3 className="text-xl sm:text-2xl font-black italic tracking-tight text-orange-600 flex items-center gap-2">
              <Landmark className="w-6 h-6 shrink-0" />
              <span>Contabilità & Commissioni</span>
            </h3>
            <span className="bg-orange-100 text-orange-800 text-[10px] font-black px-3 py-1 rounded-full border border-orange-200 uppercase tracking-wider inline-flex items-center gap-1.5">
              {isLoadingFirestore ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Caricamento Firestore...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3 h-3" />
                  <span>
                    {isFirebaseConfigured ? 'Firestore Live' : 'Modalità Locale'}
                    {lastSyncedAt ? ` • ${lastSyncedAt.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}` : ''}
                  </span>
                </>
              )}
            </span>
          </div>
          <p className="text-black text-sm leading-relaxed font-medium">
            Monitoraggio in tempo reale di incassi lordi, commissioni trattenute da MESA e netto spettante ai cuochi sui soli ordini confermati o completati.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          disabled={chefRows.length === 0}
          className="px-5 py-3.5 bg-black hover:bg-orange-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 self-start lg:self-auto"
        >
          <Download className="w-4 h-4 shrink-0" />
          <span>Esporta CSV</span>
        </button>
      </div>

      {firestoreError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{firestoreError}</span>
        </div>
      )}

      {/* Barra Controlli: Periodo + Percentuale Commissione + Fee Fissa */}
      <div className="bg-gray-50 rounded-3xl p-5 sm:p-6 border border-gray-200/80 grid grid-cols-1 lg:grid-cols-12 gap-5 items-end">
        <div className="lg:col-span-5 space-y-2">
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5 text-orange-600" />
            <span>Periodo di Analisi</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {periodOptions.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setPeriod(opt.key)}
                className={`px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider border transition-all ${
                  period === opt.key
                    ? 'bg-black text-white border-black shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-600'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 sm:col-span-1 space-y-2">
          <label
            htmlFor="mesa-commission-pct"
            className="block text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-1.5"
          >
            <Percent className="w-3.5 h-3.5 text-orange-600" />
            <span>Commissione MESA (%)</span>
          </label>
          <div className="relative">
            <input
              id="mesa-commission-pct"
              type="number"
              min={0}
              max={100}
              step={0.5}
              value={commissionInput}
              onChange={(e) => setCommissionInput(e.target.value)}
              className="w-full pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-black text-gray-900 focus:ring-2 focus:ring-orange-500 outline-none"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400">
              %
            </span>
          </div>
        </div>

        <div className="lg:col-span-4 sm:col-span-1 space-y-2">
          <label
            htmlFor="mesa-fixed-fee"
            className="block text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-1.5"
          >
            <Euro className="w-3.5 h-3.5 text-orange-600" />
            <span>Fee Fissa al Cliente (€ / ordine)</span>
          </label>
          <div className="relative">
            <input
              id="mesa-fixed-fee"
              type="number"
              min={0}
              step={0.5}
              value={fixedFeeInput}
              onChange={(e) => setFixedFeeInput(e.target.value)}
              className="w-full pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-black text-gray-900 focus:ring-2 focus:ring-orange-500 outline-none"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400">
              €
            </span>
          </div>
        </div>
      </div>

      {/* 3 Card Riassuntive */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-[2rem] bg-gray-50 border border-gray-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
              Totale Ordini Lordo (€)
            </span>
            <div className="w-10 h-10 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-gray-800">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black tracking-tight text-gray-950 font-mono">
            € {formatCurrency(totalGross)}
          </p>
          <p className="text-[11px] font-bold text-gray-500">
            Su {eligibleOrders.length} {eligibleOrders.length === 1 ? 'ordine confermato' : 'ordini confermati'}
            {fixedClientFee > 0 ? ` (incl. € ${formatCurrency(fixedClientFee)} fee/ordine)` : ''}
          </p>
        </div>

        <div className="p-6 rounded-[2rem] bg-gradient-to-br from-gray-950 to-black text-white border border-orange-500/40 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">
              Guadagno MESA (€)
            </span>
            <div className="w-10 h-10 rounded-2xl bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <Landmark className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black tracking-tight text-orange-400 font-mono">
            € {formatCurrency(totalMesaEarnings)}
          </p>
          <p className="text-[11px] font-bold text-gray-300">
            Commissione {commissionPct}%
            {fixedClientFee > 0 ? ` + € ${formatCurrency(fixedClientFee)} × ${eligibleOrders.length} ord.` : ' applicata al venduto'}
          </p>
        </div>

        <div className="p-6 rounded-[2rem] bg-green-50/70 border border-green-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-green-800">
              Netto spettante ai Cuochi (€)
            </span>
            <div className="w-10 h-10 rounded-2xl bg-green-100 border border-green-200 flex items-center justify-center text-green-700">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black tracking-tight text-green-900 font-mono">
            € {formatCurrency(totalChefNet)}
          </p>
          <p className="text-[11px] font-bold text-green-700">
            Ripartito su {chefRows.length} {chefRows.length === 1 ? 'cuoco attivo' : 'cuochi attivi'} nel periodo
          </p>
        </div>
      </div>

      {/* Tabella Riepilogativa per Cuoco */}
      {chefRows.length === 0 ? (
        <div className="py-16 text-center text-gray-400 font-bold border-2 border-dashed border-gray-200 rounded-[2.5rem] bg-gray-50/50 space-y-2 px-4">
          <ChefHat className="w-10 h-10 text-gray-300 mx-auto" />
          <p className="text-base font-black text-gray-700">
            Nessun ordine confermato o completato nel periodo selezionato.
          </p>
          <p className="text-xs text-gray-500">
            Gli ordini in attesa di conferma, rifiutati o annullati sono automaticamente esclusi dal calcolo contabile.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-black uppercase tracking-widest text-gray-500">
                <th className="py-4 px-5">Nome Cuoco</th>
                <th className="py-4 px-5 text-center">N° Ordini Confermati</th>
                <th className="py-4 px-5 text-right">Totale Venduto (€)</th>
                <th className="py-4 px-5 text-right">Quota MESA (€)</th>
                <th className="py-4 px-5 text-right">Netto Cuoco (€)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {chefRows.map((row) => (
                <tr key={row.chefKey} className="hover:bg-orange-50/20 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      {row.matchedChef?.avatar ? (
                        <img
                          src={row.matchedChef.avatar}
                          alt={row.chefName}
                          className="w-9 h-9 rounded-xl object-cover border border-gray-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                          <ChefHat className="w-4 h-4" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-gray-900 truncate">{row.chefName}</span>
                          {row.matchedChef?.nationality && (
                            <CountryFlag
                              flag={row.matchedChef.nationality}
                              title={row.matchedChef.countryName}
                              size="sm"
                            />
                          )}
                        </div>
                        {row.matchedChef?.location && (
                          <p className="text-[10px] font-semibold text-gray-500 truncate">
                            {row.matchedChef.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-center">
                    <span className="inline-flex items-center justify-center min-w-[2.25rem] px-3 py-1 rounded-full bg-gray-100 text-gray-900 font-black text-xs">
                      {row.confirmedOrdersCount}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right font-mono font-black text-gray-900 whitespace-nowrap">
                    € {formatCurrency(row.grossSold)}
                  </td>
                  <td className="py-4 px-5 text-right font-mono font-black text-orange-600 whitespace-nowrap">
                    € {formatCurrency(row.mesaFee)}
                  </td>
                  <td className="py-4 px-5 text-right font-mono font-black text-green-700 whitespace-nowrap">
                    € {formatCurrency(row.chefNet)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-950 text-white text-xs font-black">
                <td className="py-4 px-5 uppercase tracking-wider">Totale Generale</td>
                <td className="py-4 px-5 text-center font-mono">{eligibleOrders.length}</td>
                <td className="py-4 px-5 text-right font-mono whitespace-nowrap">
                  € {formatCurrency(totalGross)}
                </td>
                <td className="py-4 px-5 text-right font-mono text-orange-400 whitespace-nowrap">
                  € {formatCurrency(totalMesaEarnings)}
                </td>
                <td className="py-4 px-5 text-right font-mono text-green-400 whitespace-nowrap">
                  € {formatCurrency(totalChefNet)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};
