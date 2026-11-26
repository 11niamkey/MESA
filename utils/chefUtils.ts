import { Chef, CartItem, Dish } from '../types';

const MOCK_CHEF_ID_PATTERN = /^c\d+$/i;

/**
 * Restituisce true esclusivamente per i cuochi reali attivi e approvati,
 * distinguendoli dai profili dimostrativi/fittizi del catalogo (MOCK_CHEFS).
 */
export const isChefBookable = (chef?: Chef | null): boolean => {
  if (!chef) return false;
  if (MOCK_CHEF_ID_PATTERN.test(chef.id.trim())) return false;
  return (
    chef.verificationStatus === 'approved' &&
    Array.isArray(chef.dishes) &&
    chef.dishes.length > 0
  );
};

/**
 * Restituisce true se un piatto o elemento del carrello è contrassegnato
 * come "Disponibile a breve" o appartiene a un cuoco non ancora attivo nella beta.
 */
export const isItemAvailableSoon = (
  item: Pick<Dish, 'chefId' | 'tags' | 'isAvailableSoon'>,
  chefs: Chef[]
): boolean => {
  if (item.isAvailableSoon) return true;
  if (
    Array.isArray(item.tags) &&
    item.tags.some(tag => tag.trim().toLowerCase() === 'disponibile a breve')
  ) {
    return true;
  }
  const chef = chefs.find(c => c.id === item.chefId);
  return !isChefBookable(chef);
};

export interface BetaOrderValidationResult {
  ok: boolean;
  reason?: 'EMPTY_CART' | 'AVAILABLE_SOON_IN_CART' | 'BETA_CHEF_NOT_ACTIVE';
  title?: string;
  message?: string;
  blockedItemNames?: string[];
}

/**
 * Verifica pre-invio su Firestore per la public beta:
 * 1) Blocca se nel carrello è presente almeno un piatto contrassegnato "Disponibile a breve".
 * 2) Consente la creazione dell'ordine solo per i cuochi verificati e attivi nella beta.
 */
export const validateBetaOrderSubmission = (
  items: Array<Pick<CartItem, 'id' | 'name' | 'chefId' | 'tags' | 'isAvailableSoon'>>,
  chefs: Chef[],
  source: 'cart' | 'direct' = 'cart'
): BetaOrderValidationResult => {
  if (!Array.isArray(items) || items.length === 0) {
    return {
      ok: false,
      reason: 'EMPTY_CART',
      title: 'Carrello vuoto',
      message: 'Aggiungi almeno un piatto prima di procedere con l\'invio dell\'ordine.',
    };
  }

  const flaggedSoonItems = items.filter(item => {
    if (item.isAvailableSoon) return true;
    return (
      Array.isArray(item.tags) &&
      item.tags.some(tag => tag.trim().toLowerCase() === 'disponibile a breve')
    );
  });

  if (flaggedSoonItems.length > 0 && source === 'cart') {
    const names = Array.from(new Set(flaggedSoonItems.map(i => i.name).filter(Boolean)));
    const preview = names.slice(0, 2).join(', ') + (names.length > 2 ? ` (+${names.length - 2})` : '');
    return {
      ok: false,
      reason: 'AVAILABLE_SOON_IN_CART',
      title: 'Ordine bloccato: piatto "Disponibile a breve"',
      message: preview
        ? `Nel carrello è presente almeno un piatto contrassegnato come "Disponibile a breve" (${preview}). Rimuovilo per inviare l'ordine.`
        : 'Nel carrello è presente almeno un piatto contrassegnato come "Disponibile a breve". Rimuovilo per inviare l\'ordine.',
      blockedItemNames: names,
    };
  }

  const nonBetaItems = items.filter(item => {
    const chef = chefs.find(c => c.id === item.chefId);
    return !isChefBookable(chef);
  });

  if (nonBetaItems.length > 0 || flaggedSoonItems.length > 0) {
    const firstChefId = (nonBetaItems[0] || flaggedSoonItems[0])?.chefId;
    const chefName = chefs.find(c => c.id === firstChefId)?.name;
    return {
      ok: false,
      reason: 'BETA_CHEF_NOT_ACTIVE',
      title: 'Ordini attivi a breve',
      message: chefName
        ? `Grazie per l'interesse! Gli ordini per il profilo di ${chefName} saranno attivi a breve. Durante la public beta puoi inviare ordini solo per i 3 cuochi verificati e attivi.`
        : 'Grazie per l\'interesse! Gli ordini per questo profilo saranno attivi a breve. Durante la public beta puoi inviare ordini solo per i 3 cuochi verificati e attivi.',
    };
  }

  return { ok: true };
};
