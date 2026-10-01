import React from 'react';

export const SkeletonCard = ({ count = 3 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card p-4 flex flex-col gap-3">
          <div className="w-full h-48 rounded-2xl skeleton-shimmer"></div>
          <div className="flex justify-between items-center mt-2">
            <div className="h-4 rounded-md w-1/3 skeleton-shimmer"></div>
            <div className="h-4 rounded-md w-1/4 skeleton-shimmer"></div>
          </div>
          <div className="h-6 rounded-md w-3/4 skeleton-shimmer"></div>
          <div className="h-4 rounded-md w-full skeleton-shimmer"></div>
          <div className="h-10 rounded-xl mt-2 skeleton-shimmer"></div>
        </div>
      ))}
    </>
  );
};

