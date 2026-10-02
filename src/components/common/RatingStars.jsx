import React from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({ rating = 0, max = 5, size = 'sm', showNumber = true, interactive = false, onChange }) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: max }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= rating;
          const isHalf = starValue - 0.5 <= rating && starValue > rating;

          return (
            <button
              key={index}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onChange && onChange(starValue)}
              className={`${interactive ? 'cursor-pointer hover:scale-110 transition' : 'cursor-default'} p-0.5`}
            >
              <Star
                className={`${sizeClasses[size]} ${
                  isFilled
                    ? 'fill-[var(--color-digital-blue-500)] text-[var(--color-digital-blue-500)]'
                    : isHalf
                    ? 'fill-[var(--color-digital-blue-500)]/50 text-[var(--color-digital-blue-500)]'
                    : 'text-slate-300 dark:text-slate-600'
                }`}
              />
            </button>
          );
        })}
      </div>
      {showNumber && (
        <span className="text-xs font-bold text-[var(--color-digital-blue-500)] ml-1">
          {Number(rating).toFixed(1)}
        </span>
      )}
    </div>
  );
};
