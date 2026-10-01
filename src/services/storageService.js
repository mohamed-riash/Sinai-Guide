
export const KEYS = {
  USERS: 'sinai_users',
  CURRENT_USER: 'sinai_current_user',
  PLACES: 'sinai_places',
  CITIES: 'sinai_selected_city',
  THEME: 'sinai_theme',
  FAVORITES: 'sinai_favorites',
  ORDERS: 'sinai_orders',
  BOOKINGS: 'sinai_bookings',
  REVIEWS: 'sinai_reviews',
  NOTIFICATIONS: 'sinai_notifications',
  CART: 'sinai_cart',
};

const itemCache = new Map();

if (typeof window !== 'undefined') {
  window.addEventListener('storage', ({ key }) => {
    if (key) itemCache.delete(key);
    else itemCache.clear();
  });
}

// Safe JSON LocalStorage Wrapper
export const storageService = {
  getItem: (key, defaultValue = null) => {
    if (itemCache.has(key)) return itemCache.get(key);
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      const value = JSON.parse(item);
      itemCache.set(key, value);
      return value;
    } catch (error) {
      console.error(`Error reading ${key} from LocalStorage`, error);
      return defaultValue;
    }
  },

  setItem: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      itemCache.set(key, value);
    } catch (error) {
      console.error(`Error setting ${key} in LocalStorage`, error);
    }
  },

  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
      itemCache.delete(key);
    } catch (error) {
      console.error(`Error removing ${key} from LocalStorage`, error);
    }
  },

  // Remove only records with identifiers reserved by the old shipped demo dataset.
  migrateLegacyDemoData: () => {
    const marker = 'sinai_data_cleanup_v2';
    if (localStorage.getItem(marker)) return;
    const removeIds = (key, ids) => {
      const records = storageService.getItem(key, []);
      if (Array.isArray(records)) storageService.setItem(key, records.filter((item) => !ids.has(item?.id)));
    };
    const demoUserIds = new Set(['user-customer-1', 'user-business-1', 'user-business-2', 'user-admin-1']);
    removeIds(KEYS.USERS, demoUserIds);
    const currentUser = storageService.getItem(KEYS.CURRENT_USER, null);
    if (currentUser && demoUserIds.has(currentUser.id)) storageService.removeItem(KEYS.CURRENT_USER);
    const demoPlaceIds = new Set(['place-1', 'place-2', 'place-3', 'place-4', 'place-5', 'place-6']);
    removeIds(KEYS.PLACES, demoPlaceIds);
    removeIds(KEYS.ORDERS, new Set(['ord-1001']));
    removeIds(KEYS.BOOKINGS, new Set(['bk-2001']));
    removeIds(KEYS.REVIEWS, new Set(['rev-3001', 'rev-3002']));
    removeIds(KEYS.NOTIFICATIONS, new Set(['n-1']));
    const favorites = storageService.getItem(KEYS.FAVORITES, []);
    if (Array.isArray(favorites)) storageService.setItem(KEYS.FAVORITES, favorites.filter((id) => !demoPlaceIds.has(id)));
    localStorage.setItem(marker, 'done');
  }
};
