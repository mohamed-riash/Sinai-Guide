import React from 'react';
import { motion } from 'framer-motion';
import { PlaceCard } from './PlaceCard';
import { SkeletonCard } from '../common/SkeletonCard';
import { EmptyState } from '../common/EmptyState';
import { Compass } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
};

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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {places.map((place) => (
        <motion.div key={place.id} variants={itemVariants}>
          <PlaceCard place={place} />
        </motion.div>
      ))}
    </motion.div>
  );
};

