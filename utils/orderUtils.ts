import { Order } from '../types';

export interface OrderDeleteResult {
  ok: boolean;
  deletedCount?: number;
  error?: string;
}

const CONCLUDED_STATUSES = new Set([
  'COMPLETED',
  'REJECTED',
  'CANCELLED',
  'CANCELED',
  'ANNULLATO',
]);

export const parseScheduledDate = (dateStr?: string): Date | null => {
  if (!dateStr) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr.trim());
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

export const isPastScheduledOrder = (order: Order): boolean => {
  const datedItems = (order.items || [])
    .map(item => parseScheduledDate(item.scheduledDate))
    .filter((d): d is Date => d !== null);

  if (datedItems.length === 0) {
    return false;
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  return datedItems.every(d => d.getTime() < todayStart.getTime());
};

export const canClientCancelOrder = (order?: Pick<Order, 'status'> | null): boolean => {
  if (!order) return false;
  const normalizedStatus = String(order.status || '').trim().toUpperCase();
  return normalizedStatus === 'PENDING_CONFIRMATION' || normalizedStatus === 'PENDING';
};

export const isConcludedOrder = (order: Order): boolean => {
  const normalizedStatus = String(order.status || '').trim().toUpperCase();
  if (CONCLUDED_STATUSES.has(normalizedStatus)) {
    return true;
  }
  return isPastScheduledOrder(order);
};

export const formatOrderCode = (orderId?: string): string => {
  const trimmed = (orderId || '').trim();
  if (!trimmed) return '#MESA';
  if (/^MESA-/i.test(trimmed) || trimmed.length <= 12) {
    return `#${trimmed.toUpperCase()}`;
  }
  return `#${trimmed.slice(-6).toUpperCase()}`;
};

export const formatOrderDeleteError = (err: unknown): string => {
  const raw = err instanceof Error ? err.message : String(err);
  if (/permission|insufficient|denied/i.test(raw)) {
    return 'Permessi Firestore insufficienti per eliminare gli ordini. Verifica le regole in firestore.rules.';
  }
  if (/offline|network|unavailable/i.test(raw)) {
    return 'Connessione assente o Firestore non raggiungibile. Riprova tra poco.';
  }
  return `Impossibile eliminare l'ordine su Firestore: ${raw}`;
};
