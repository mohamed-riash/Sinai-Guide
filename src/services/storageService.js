import { CITIES } from '../data/cities';
import { CATEGORIES } from '../data/categories';
import { PLACES } from '../data/places';
import { BLOG_POSTS } from '../data/blogPosts';
import { INITIAL_USERS } from '../data/users';

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

// Safe JSON LocalStorage Wrapper
export const storageService = {
  getItem: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading ${key} from LocalStorage`, error);
      return defaultValue;
    }
  },

  setItem: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting ${key} in LocalStorage`, error);
    }
  },

  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from LocalStorage`, error);
    }
  },

  // Initialize dataset if empty
  initSeedData: () => {
    if (!localStorage.getItem(KEYS.USERS)) {
      localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(KEYS.PLACES)) {
      localStorage.setItem(KEYS.PLACES, JSON.stringify(PLACES));
    }
    if (!localStorage.getItem(KEYS.ORDERS)) {
      const initialOrders = [
        {
          id: 'ord-1001',
          placeId: 'place-1',
          placeName: 'Al-Nakhil Beach Resort & Restaurant',
          customerName: 'Ahmed Hassan',
          customerPhone: '+20 10 1111 2222',
          address: 'Corniche El-Arish, Section 4',
          items: [
            { name: 'Red Sea Jumbo Shrimp Platter', quantity: 2, price: 420 },
            { name: 'Sinai Habaq Mint Tea', quantity: 2, price: 45 }
          ],
          subtotal: 930,
          deliveryFee: 30,
          total: 960,
          status: 'confirmed',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
        }
      ];
      localStorage.setItem(KEYS.ORDERS, JSON.stringify(initialOrders));
    }
    if (!localStorage.getItem(KEYS.BOOKINGS)) {
      const initialBookings = [
        {
          id: 'bk-2001',
          placeId: 'place-1',
          placeName: 'Al-Nakhil Beach Resort & Restaurant',
          customerName: 'Ahmed Hassan',
          customerPhone: '+20 10 1111 2222',
          date: '2026-10-05',
          time: '19:30',
          guests: 4,
          notes: 'Sea view table requested',
          status: 'confirmed',
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
        }
      ];
      localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(initialBookings));
    }
    if (!localStorage.getItem(KEYS.REVIEWS)) {
      const initialReviews = [
        {
          id: 'rev-3001',
          placeId: 'place-1',
          userName: 'Ahmed Hassan',
          userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
          rating: 5,
          comment: 'Spectacular seafood fresh from the Mediterranean! The Habaq mint tea under the palms at sunset was unforgettable.',
          createdAt: '2026-09-22T14:30:00.000Z'
        },
        {
          id: 'rev-3002',
          placeId: 'place-2',
          userName: 'Fatima Al-Zahra',
          userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
          rating: 5,
          comment: 'Best Spanish latte in Al-Arish with stunning seafront glass views. Excellent service!',
          createdAt: '2026-09-24T18:15:00.000Z'
        }
      ];
      localStorage.setItem(KEYS.REVIEWS, JSON.stringify(initialReviews));
    }
    if (!localStorage.getItem(KEYS.FAVORITES)) {
      localStorage.setItem(KEYS.FAVORITES, JSON.stringify(['place-1', 'place-3']));
    }
    if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
      const initialNotifs = [
        {
          id: 'n-1',
          title: 'Welcome to Sinai Guide!',
          message: 'Discover North Sinai places, restaurants, cafes, hotels and book experiences directly.',
          read: false,
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(initialNotifs));
    }
  }
};
