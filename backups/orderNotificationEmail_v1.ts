import { AppUser, Chef, Order } from '../types';
import { formatOrderCode } from './orderUtils';
import { sanitizeText, TEXT_LIMITS } from './sanitize';

export interface ChefOrderEmailPayload {
  orderId: string;
  customerId?: string;
  orderCode: string;
  recipientEmail: string;
  chefName: string;
  customerName: string;
  itemsSummary: string;
  deliveryModeLabel: string;
  estimatedTime: string;
  deliveryAddress?: string;
  total: number;
  subject: string;
  textBody: string;
}

export const resolveChefNotificationEmail = (
  chef?: Pick<Chef, 'id' | 'email' | 'notificationEmail' | 'name'> | null,
  usersList: Array<Pick<AppUser, 'id' | 'email' | 'notificationEmail' | 'role'>> = []
): string => {
  const fromChef = sanitizeText(chef?.notificationEmail || chef?.email || '', 120).toLowerCase();
  if (fromChef && fromChef.includes('@')) return fromChef;

  if (chef) {
    const cleanChefId = chef.id.replace(/^chef-/, '');
    const matchedUser = usersList.find(
      (u) =>
        u.role === 'chef' &&
        (u.id === cleanChefId ||
          u.id === chef.id ||
          (chef.email && u.email.trim().toLowerCase() === chef.email.trim().toLowerCase()))
    );
    const fromUser = sanitizeText(matchedUser?.notificationEmail || matchedUser?.email || '', 120).toLowerCase();
    if (fromUser && fromUser.includes('@')) return fromUser;
  }

  return '';
};

export const buildChefOrderEmailPayload = (
  order: Order,
  recipientEmail: string
): ChefOrderEmailPayload => {
  const orderCode = formatOrderCode(order.id);
  const deliveryModeLabel =
    order.deliveryMode === 'delivery'
      ? 'Consegna a domicilio (pagamento contanti alla consegna)'
      : 'Ritiro in sede (pagamento contanti al ritiro)';

  const itemsLines = (order.items || []).map(
    (item) =>
      `- ${item.quantity}x ${item.name} (€${(item.price * item.quantity).toFixed(2)})${
        item.preferences?.notes ? ` [Note: ${item.preferences.notes}]` : ''
      }`
  );
  const itemsSummary = itemsLines.join('\n') || 'Piatti vari MESA';
  const scheduleItem = (order.items || []).find((i) => i.scheduledDate || i.scheduledTime);
  const estimatedTime =
    sanitizeText(
      [scheduleItem?.scheduledDate, scheduleItem?.scheduledTime || order.estimatedTime]
        .filter(Boolean)
        .join(' ore '),
      80
    ) || 'Da confermare';

  const subject = `[MESA] Nuovo ordine ${orderCode} da confermare (€${order.total.toFixed(2)})`;
  const textBody = [
    `Ciao ${order.chefName || 'Chef'}, hai ricevuto un nuovo ordine su MESA!`,
    ``,
    `Numero ordine: ${orderCode}`,
    `Cliente: ${order.customerName || 'Cliente MESA'}`,
    `Modalità: ${deliveryModeLabel}`,
    ...(order.deliveryMode === 'delivery' && order.deliveryAddress
      ? [`Indirizzo consegna: ${order.deliveryAddress}`]
      : []),
    `Data e orario: ${estimatedTime}`,
    ``,
    `Riepilogo piatti:`,
    itemsSummary,
    ``,
    `Totale da incassare in contanti: €${order.total.toFixed(2)}`,
    ``,
    `Apri MESA per confermare l'ordine.`,
  ].join('\n');

  return {
    orderId: order.id,
    ...(order.customerId ? { customerId: order.customerId } : {}),
    orderCode,
    recipientEmail,
    chefName: sanitizeText(order.chefName, TEXT_LIMITS.BRAND_NAME) || 'Chef MESA',
    customerName: sanitizeText(order.customerName, TEXT_LIMITS.USER_NAME * 2) || 'Cliente MESA',
    itemsSummary: sanitizeText(itemsSummary, 1000),
    deliveryModeLabel,
    estimatedTime,
    ...(order.deliveryAddress ? { deliveryAddress: sanitizeText(order.deliveryAddress, 200) } : {}),
    total: Number(order.total) || 0,
    subject,
    textBody,
  };
};

export interface EmailDispatchResult {
  ok: boolean;
  recipientEmail?: string;
  channel?: string;
}

export const dispatchChefOrderEmail = async (
  order: Order,
  chef: Pick<Chef, 'id' | 'email' | 'notificationEmail' | 'name'> | undefined,
  usersList: Array<Pick<AppUser, 'id' | 'email' | 'notificationEmail' | 'role'>>,
  queueFirestoreEmail?: (docId: string, payload: Record<string, unknown>) => Promise<void>
): Promise<EmailDispatchResult> => {
  const recipientEmail = resolveChefNotificationEmail(chef, usersList);
  if (!recipientEmail) {
    return { ok: false };
  }

  const payload = buildChefOrderEmailPayload(order, recipientEmail);

  try {
    if (queueFirestoreEmail) {
      await queueFirestoreEmail(`mail-${order.id}`, {
        to: recipientEmail,
        orderId: order.id,
        customerId: payload.customerId || order.userId || '',
        createdAt: new Date().toISOString(),
        message: {
          subject: payload.subject,
          text: payload.textBody,
        },
      }).catch(() => {});
    }

    const response = await fetch('/api/orders/notify-chef-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return { ok: false, recipientEmail };
    }
    const result = (await response.json().catch(() => ({}))) as { channel?: string };
    return {
      ok: true,
      recipientEmail,
      channel: result.channel || 'server_log',
    };
  } catch {
    return { ok: false, recipientEmail };
  }
};
