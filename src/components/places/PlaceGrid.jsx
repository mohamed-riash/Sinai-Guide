import React from 'react';
import { PlaceCard } from './PlaceCard';
import { SkeletonCard } from '../common/SkeletonCard';
import { EmptyState } from '../common/EmptyState';
import { Compass } from 'lucide-react';

export const PlaceGrid = ({ places, loading = false, emptyTitle = 'لا توجد أماكن', emptyDesc = 'جرّب تعديل البحث أو تغيير فلاتر المدينة.' }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SkeletonCard count={6} />
      </div>
    );
  }

  if (!places || places.length === 0) {
    return (
      <EmptyState
        icon={Compass}
        title={emptyTitle}
        description={emptyDesc}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {places.map((place) => (
        <PlaceCard key={place.id} place={place} />
      ))}
    </div>
  );
};
