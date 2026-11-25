import { Chef } from '../types';

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
