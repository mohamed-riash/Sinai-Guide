import { storageService, KEYS } from './storageService';

export const favoritesService = {
  getFavorites: () => {
    return storageService.getItem(KEYS.FAVORITES, []);
  },

  isFavorite: (placeId) => {
    const favorites = storageService.getItem(KEYS.FAVORITES, []);
    return favorites.includes(placeId);
  },

  toggleFavorite: (placeId) => {
    let favorites = storageService.getItem(KEYS.FAVORITES, []);
    const exists = favorites.includes(placeId);
    
    if (exists) {
      favorites = favorites.filter(id => id !== placeId);
    } else {
      favorites.push(placeId);
    }
    
    storageService.setItem(KEYS.FAVORITES, favorites);
    return !exists; // returns true if added, false if removed
  }
};
