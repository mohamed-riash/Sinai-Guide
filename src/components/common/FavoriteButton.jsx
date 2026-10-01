import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { favoritesService } from '../../services/favoritesService';
import { useToast } from '../../hooks/useToast';

export const FavoriteButton = ({ placeId, className = '' }) => {
  const [isFav, setIsFav] = useState(false);
  const { toastSuccess, toastInfo } = useToast();

  useEffect(() => {
    setIsFav(favoritesService.isFavorite(placeId));
  }, [placeId]);

  const handleToggle = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const added = favoritesService.toggleFavorite(placeId);
    setIsFav(added);
    if (added) {
      toastSuccess('Saved to your favorites!');
    } else {
      toastInfo('Removed from your favorites.');
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label="Save to favorites"
      className={`p-2.5 rounded-full backdrop-blur-md bg-black/40 hover:bg-black/60 border border-white/20 text-white transition-all duration-200 active:scale-90 ${className}`}
    >
      <Heart className={`w-5 h-5 transition-colors ${isFav ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
    </button>
  );
};
