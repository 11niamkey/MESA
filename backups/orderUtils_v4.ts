import { AppUser, Chef, Order } from '../types';

export interface OrderDeleteResult {
  ok: boolean;
  deletedCount?: number;
  error?: string;
}

export interface ProfileDeleteResult {
  ok: boolean;
  blockingCount?: number;
  error?: string;
}

const CONCLUDED_STATUSES = new Set([
  'COMPLETED',
  'REJECTED',
  'CANCELLED',
  'CANCELED',
  'ANNULLATO',
]);

export const isActiveBlockingOrderStatus = (rawStatus: unknown): boolean => {
  const normalizedStatus = String(rawStatus || '').trim().toUpperCase();
  return !CONCLUDED_STATUSES.has(normalizedStatus);
};

export const matchesChefUser = (chef: Pick<Chef, 'id' | 'email' | 'name'>, user: Pick<AppUser, 'id' | 'email' | 'name' | 'lastName' | 'brandName'>): boolean => {
  const normalizedUserEmail = (user.email || '').trim().toLowerCase();
  const normalizedChefEmail = (chef.email || '').trim().toLowerCase();
  if (normalizedUserEmail && normalizedChefEmail && normalizedChefEmail === normalizedUserEmail) {
    return true;
  }
  return (
    chef.id === `chef-${user.id}` ||
    chef.id === user.id ||
    `usr-${chef.id}` === user.id ||
    `usr-${chef.id.replace('chef-', '')}` === user.id
  );
};

export const getBlockingOrdersForUser = (
  user: Pick<AppUser, 'id' | 'role' | 'email' | 'name' | 'lastName' | 'brandName'> | null | undefined,
  orders: Order[],
  chefs: Array<Pick<Chef, 'id' | 'email' | 'name'>> = []
): Order[] => {
  if (!user || user.role === 'admin' || !Array.isArray(orders)) {
    return [];
  }

  const normalizedUserEmail = (user.email || '').trim().toLowerCase();

  if (user.role === 'chef') {
    const matchedChefs = chefs.filter(c => matchesChefUser(c, user));
    const matchedChefIds = new Set(matchedChefs.map(c => c.id));
    const matchedChefNames = new Set(matchedChefs.map(c => c.name.trim().toLowerCase()).filter(Boolean));
    const fullName = `${user.name} ${user.lastName}`.trim().toLowerCase();
    const brandName = (user.brandName || '').trim().toLowerCase();

    return orders.filter((order) => {
      if (!isActiveBlockingOrderStatus(order.status)) return false;
      const orderChefName = (order.chefName || '').trim().toLowerCase();
      const belongsToChef =
        order.userId === user.id ||
        matchedChefIds.has(order.chefId) ||
        order.chefId === user.id ||
        order.chefId === `chef-${user.id}` ||
        `usr-${order.chefId}` === user.id ||
        `usr-${String(order.chefId || '').replace('chef-', '')}` === user.id ||
        (orderChefName ? matchedChefNames.has(orderChefName) : false) ||
        (Boolean(fullName) && orderChefName === fullName) ||
        (Boolean(brandName) && orderChefName === brandName);
      return belongsToChef;
    });
  }

  return orders.filter((order) => {
    if (!isActiveBlockingOrderStatus(order.status)) return false;
    const orderEmail = (order.customerEmail || '').trim().toLowerCase();
    return (
      order.userId === user.id ||
      (Boolean(normalizedUserEmail) && orderEmail === normalizedUserEmail)
    );
  });
};

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
