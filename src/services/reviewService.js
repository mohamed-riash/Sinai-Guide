import { storageService, KEYS } from './storageService';
import { placeService } from './placeService';

export const reviewService = {
  getReviewsByPlaceId: (placeId) => {
    const reviews = storageService.getItem(KEYS.REVIEWS, []);
    return reviews.filter(r => r.placeId === placeId);
  },

  getAllReviews: () => {
    return storageService.getItem(KEYS.REVIEWS, []);
  },

  addReview: ({ placeId, userName, userAvatar, rating, comment }) => {
    if (!comment || !comment.trim()) throw new Error('Review comment is required.');

    const reviews = storageService.getItem(KEYS.REVIEWS, []);
    const newReview = {
      id: `rev-${Date.now()}`,
      placeId,
      userName: userName || 'Anonymous Explorer',
      userAvatar: userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      rating: Number(rating),
      comment: comment.trim(),
      createdAt: new Date().toISOString()
    };

    reviews.unshift(newReview);
    storageService.setItem(KEYS.REVIEWS, reviews);

    // Recalculate rating on place
    const placeReviews = reviews.filter(r => r.placeId === placeId);
    const avgRating = (placeReviews.reduce((sum, r) => sum + r.rating, 0) / placeReviews.length).toFixed(1);
    placeService.update(placeId, {
      rating: parseFloat(avgRating),
      reviewCount: placeReviews.length
    });

    return newReview;
  }
};
