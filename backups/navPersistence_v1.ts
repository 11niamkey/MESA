import { AppUser, ViewState } from '../types';

export const MESA_NAV_STATE_KEY = 'mesa_nav_state_v1';

export type PersistedPersonalTab =
  | 'profile'
  | 'addresses'
  | 'orders'
  | 'kitchen'
  | 'chef-orders'
  | 'chef-menu'
  | 'chef-reviews'
  | 'chef-wallet'
  | 'client-payments';

export interface PersistedNavState {
  view: ViewState;
  activeRole: AppUser['role'] | 'guest';
  personalTab?: PersistedPersonalTab;
  selectedOrderId?: string | null;
  selectedChefId?: string | null;
}

const VALID_VIEWS = new Set<string>(Object.values(ViewState));

const PUBLIC_GUEST_VIEWS = new Set<ViewState>([
  ViewState.HOME,
  ViewState.CHEFS,
  ViewState.HERITAGE,
  ViewState.HERITAGE_JOURNEY,
  ViewState.CULTURE,
  ViewState.EXPERIENCES,
  ViewState.ABOUT,
  ViewState.SAFETY,
  ViewState.TERMS,
  ViewState.PRIVACY,
  ViewState.HELP,
  ViewState.CHEF_PROFILE,
  ViewState.PUBLIC_STOREFRONT,
]);

const CHEF_TABS = new Set<PersistedPersonalTab>([
  'profile',
  'addresses',
  'kitchen',
  'chef-orders',
  'chef-menu',
  'chef-reviews',
  'chef-wallet',
]);

const CLIENT_TABS = new Set<PersistedPersonalTab>([
  'profile',
  'addresses',
  'orders',
  'client-payments',
]);

const ADMIN_TABS = new Set<PersistedPersonalTab>(['profile', 'addresses']);

export const resolvePersonalTab = (
  role: AppUser['role'],
  candidate?: string | null
): PersistedPersonalTab => {
  const tab = candidate as PersistedPersonalTab;
  if (role === 'chef') {
    return CHEF_TABS.has(tab) ? tab : 'chef-orders';
  }
  if (role === 'admin') {
    return ADMIN_TABS.has(tab) ? tab : 'profile';
  }
  return CLIENT_TABS.has(tab) ? tab : 'profile';
};

export const resolveInitialNavState = (
  rawJson: string | null,
  savedUser: AppUser | null,
  isAdminPath = false
): PersistedNavState => {
  const fallbackRole: AppUser['role'] | 'guest' = savedUser?.role || 'guest';
  const fallbackState: PersistedNavState = {
    view: ViewState.LANDING,
    activeRole: fallbackRole,
    ...(savedUser ? { personalTab: resolvePersonalTab(savedUser.role) } : {}),
    selectedOrderId: null,
    selectedChefId: null,
  };

  if (isAdminPath || !rawJson) {
    return fallbackState;
  }

  try {
    const parsed = JSON.parse(rawJson) as Partial<PersistedNavState> | null;
    if (!parsed || typeof parsed !== 'object') {
      return fallbackState;
    }

    const rawView = typeof parsed.view === 'string' && VALID_VIEWS.has(parsed.view)
      ? (parsed.view as ViewState)
      : ViewState.LANDING;

    if (!savedUser) {
      const safeGuestView =
        rawView === ViewState.LANDING || PUBLIC_GUEST_VIEWS.has(rawView)
          ? rawView
          : ViewState.LANDING;
      return {
        view: safeGuestView,
        activeRole: 'guest',
        selectedOrderId: null,
        selectedChefId:
          safeGuestView === ViewState.CHEF_PROFILE || safeGuestView === ViewState.PUBLIC_STOREFRONT
            ? parsed.selectedChefId || null
            : null,
      };
    }

    let safeView = rawView;
    if (safeView === ViewState.ADMIN_DASHBOARD && savedUser.role !== 'admin') {
      safeView = savedUser.role === 'chef' ? ViewState.PROFILE : ViewState.HOME;
    }

    return {
      view: safeView,
      activeRole: savedUser.role,
      personalTab: resolvePersonalTab(savedUser.role, parsed.personalTab),
      selectedOrderId: safeView === ViewState.ORDERS ? parsed.selectedOrderId || null : null,
      selectedChefId:
        safeView === ViewState.CHEF_PROFILE || safeView === ViewState.PUBLIC_STOREFRONT
          ? parsed.selectedChefId || null
          : null,
    };
  } catch {
    return fallbackState;
  }
};

export const saveNavStateToStorage = (state: PersistedNavState): void => {
  try {
    localStorage.setItem(MESA_NAV_STATE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota / private-mode restrictions
  }
};
