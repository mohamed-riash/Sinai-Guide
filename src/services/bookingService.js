import { storageService, KEYS } from './storageService';

export const bookingService = {
  getBookings: () => {
    return storageService.getItem(KEYS.BOOKINGS, []);
  },

  getBookingsByPlaceId: (placeId) => {
    const bookings = storageService.getItem(KEYS.BOOKINGS, []);
    return bookings.filter(b => b.placeId === placeId);
  },

  createBooking: (bookingData) => {
    const bookings = storageService.getItem(KEYS.BOOKINGS, []);
    const newBooking = {
      ...bookingData,
      id: `bk-${Date.now().toString().slice(-6)}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    bookings.unshift(newBooking);
    storageService.setItem(KEYS.BOOKINGS, bookings);
    return newBooking;
  },

  updateBookingStatus: (bookingId, status) => {
    const bookings = storageService.getItem(KEYS.BOOKINGS, []);
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index === -1) throw new Error('Booking not found.');

    bookings[index].status = status;
    storageService.setItem(KEYS.BOOKINGS, bookings);
    return bookings[index];
  }
};
