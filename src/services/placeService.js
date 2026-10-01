import { storageService, KEYS } from './storageService';

const isApproved = (p) => {
  if (!p) return false;
  // If status is not set (legacy place) or explicitly 'approved', return true
  return !p.status || p.status === 'approved';
};

export const placeService = {
  // Get all places (for admin)
  getAll: () => {
    return storageService.getItem(KEYS.PLACES, []);
  },

  // Get only approved places (for public discovery)
  getAllPublic: () => {
    const places = storageService.getItem(KEYS.PLACES, []);
    return places.filter(isApproved);
  },

  // Get pending places for Admin review
  getPending: () => {
    const places = storageService.getItem(KEYS.PLACES, []);
    return places.filter(p => p.status === 'pending');
  },

  getById: (id) => {
    const places = storageService.getItem(KEYS.PLACES, []);
    return places.find(p => p.id === id) || null;
  },

  getByOwnerId: (ownerId, businessId = null) => {
    const places = storageService.getItem(KEYS.PLACES, []);
    if (!places || places.length === 0) return null;
    if (businessId) {
      const found = places.find(p => p && p.id === businessId);
      if (found) return found;
    }
    if (ownerId) {
      const found = places.find(p => p && (p.ownerId === ownerId || p.id === ownerId));
      if (found) return found;
    }
    return places.find(p => p && p.id === 'place-1') || places[0] || null;
  },

  getByCity: (cityId) => {
    const places = storageService.getItem(KEYS.PLACES, []);
    const approvedPlaces = places.filter(isApproved);
    if (!cityId || cityId === 'all') return approvedPlaces;
    return approvedPlaces.filter(p => p.cityId === cityId);
  },

  getByCategory: (categoryId) => {
    const places = storageService.getItem(KEYS.PLACES, []);
    const approvedPlaces = places.filter(isApproved);
    if (!categoryId || categoryId === 'all') return approvedPlaces;
    return approvedPlaces.filter(p => p.categoryId === categoryId);
  },

  filterPlaces: ({ cityId, categoryId, searchQuery, priceRange, isOpenNow, minRating }) => {
    let places = storageService.getItem(KEYS.PLACES, []).filter(isApproved);

    if (cityId && cityId !== 'all') {
      places = places.filter(p => p.cityId === cityId);
    }

    if (categoryId && categoryId !== 'all') {
      places = places.filter(p => p.categoryId === categoryId);
    }

    if (priceRange && priceRange !== 'all') {
      places = places.filter(p => {
        if (p.minPrice !== undefined) {
          if (priceRange === '$') return p.minPrice <= 150;
          if (priceRange === '$$') return p.minPrice > 150 && p.minPrice <= 350;
          if (priceRange === '$$$') return p.minPrice > 350;
        }
        return p.priceRange === priceRange;
      });
    }

    if (isOpenNow) {
      places = places.filter(p => p.isOpenNow);
    }

    if (minRating) {
      places = places.filter(p => p.rating >= minRating);
    }

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      places = places.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.nameAr && p.nameAr.includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.address && p.address.toLowerCase().includes(q))
      );
    }

    return places;
  },

  create: (placeData) => {
    const places = storageService.getItem(KEYS.PLACES, []);
    const newPlace = {
      ...placeData,
      id: `place-${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
      status: 'pending', // Default status: pending admin approval
      createdAt: new Date().toISOString(),
      menu: placeData.menu || []
    };
    places.push(newPlace);
    storageService.setItem(KEYS.PLACES, places);
    return newPlace;
  },

  updateStatus: (id, status) => {
    const places = storageService.getItem(KEYS.PLACES, []);
    const index = places.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Place not found.');

    places[index] = { ...places[index], status };
    storageService.setItem(KEYS.PLACES, places);
    return places[index];
  },

  update: (id, updatedFields) => {
    const places = storageService.getItem(KEYS.PLACES, []);
    const index = places.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Place not found.');

    places[index] = { ...places[index], ...updatedFields };
    storageService.setItem(KEYS.PLACES, places);
    return places[index];
  },

  delete: (id) => {
    let places = storageService.getItem(KEYS.PLACES, []);
    places = places.filter(p => p.id !== id);
    storageService.setItem(KEYS.PLACES, places);
  }
};
