import { storageService, KEYS } from './storageService';

export const authService = {
  getCurrentUser: () => {
    return storageService.getItem(KEYS.CURRENT_USER, null);
  },

  login: (email, password) => {
    const users = storageService.getItem(KEYS.USERS, []);
    const cleanEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password. Please check your credentials.');
    }

    const { password: _, ...userWithoutPassword } = user;
    storageService.setItem(KEYS.CURRENT_USER, userWithoutPassword);
    return userWithoutPassword;
  },

  register: (userData) => {
    const { name, email, phone, password, confirmPassword, role = 'customer', businessName, businessCategory, businessCity } = userData;

    // JavaScript Validation (Section 22)
    if (!name || !name.trim()) throw new Error('Full name is required.');
    if (!email || !email.trim()) throw new Error('Email address is required.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) throw new Error('Please enter a valid email address.');
    if (!phone || !phone.trim()) throw new Error('Phone number is required.');
    if (!password) throw new Error('Password is required.');
    if (password.length < 6) throw new Error('Password must be at least 6 characters long.');
    if (password !== confirmPassword) throw new Error('Passwords do not match.');

    const users = storageService.getItem(KEYS.USERS, []);
    const existing = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password: password,
      role: role,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80`,
      createdAt: new Date().toISOString()
    };

    let createdPlaceId = null;

    // If business owner registration, create a basic place record for them
    if (role === 'business_owner') {
      if (!businessName || !businessName.trim()) throw new Error('Business name is required.');
      const places = storageService.getItem(KEYS.PLACES, []);
      createdPlaceId = `place-${Date.now()}`;
      const newPlace = {
        id: createdPlaceId,
        name: businessName.trim(),
        nameAr: businessName.trim(),
        cityId: businessCity || 'arish',
        categoryId: businessCategory || 'restaurant',
        rating: 5.0,
        reviewCount: 0,
        priceRange: '$$',
        featured: false,
        isOpenNow: true,
        whatsapp: phone.replace(/[^0-9]/g, ''),
        phone: phone,
        address: `${businessCity || 'Al-Arish'}, North Sinai`,
        description: `${businessName} welcomes you to enjoy fine dining and warm Sinai hospitality.`,
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
        gallery: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'],
        openingHours: '10:00 AM - 11:00 PM',
        amenities: ['Wi-Fi', 'Outdoor Seating'],
        coordinates: { lat: 31.1316, lng: 33.7984 },
        hasOrdering: businessCategory === 'restaurant' || businessCategory === 'cafe',
        hasBooking: true,
        ownerId: newUser.id,
        menu: []
      };
      places.push(newPlace);
      storageService.setItem(KEYS.PLACES, places);
      newUser.businessId = createdPlaceId;
    }

    users.push(newUser);
    storageService.setItem(KEYS.USERS, users);

    const { password: _, ...userWithoutPassword } = newUser;
    storageService.setItem(KEYS.CURRENT_USER, userWithoutPassword);
    return userWithoutPassword;
  },

  updateProfile: (updatedData) => {
    const currentUser = storageService.getItem(KEYS.CURRENT_USER, null);
    if (!currentUser) throw new Error('User not logged in.');

    const users = storageService.getItem(KEYS.USERS, []);
    const index = users.findIndex(u => u.id === currentUser.id);

    if (index === -1) throw new Error('User record not found.');

    const updatedUser = {
      ...users[index],
      ...updatedData
    };

    users[index] = updatedUser;
    storageService.setItem(KEYS.USERS, users);

    const { password: _, ...userWithoutPassword } = updatedUser;
    storageService.setItem(KEYS.CURRENT_USER, userWithoutPassword);
    return userWithoutPassword;
  },

  logout: () => {
    storageService.removeItem(KEYS.CURRENT_USER);
  }
};
