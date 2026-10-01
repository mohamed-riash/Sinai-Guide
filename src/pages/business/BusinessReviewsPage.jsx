import React from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { GlassCard } from '../../components/common/GlassCard';
import { ReviewList } from '../../components/reviews/ReviewList';
import { useAuth } from '../../hooks/useAuth';
import { placeService } from '../../services/placeService';
import { reviewService } from '../../services/reviewService';

export const BusinessReviewsPage = () => {
  const { user } = useAuth();
  const place = placeService.getByOwnerId(user?.id, user?.businessId) || placeService.getById('place-1');
  const reviews = place ? reviewService.getReviewsByPlaceId(place.id) : [];

  return (
    <DashboardLayout title="تقييمات وآراء العملاء">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-6 max-w-3xl"
      >
        <GlassCard hover={false} className="flex items-center justify-between p-6 border border-white/20 dark:border-white/10 shadow-xl">
          <div>
            <h2 className="text-xl font-black font-display text-[var(--color-text-primary)]">ملاحظات وتقييمات للنشاط</h2>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1 font-medium">{reviews.length} تقييم وتعليق من زوار الدليل</p>
          </div>
          <div className="text-left">
            <span className="text-3xl font-black font-display text-[var(--color-gold)]">★ {place?.rating || '5.0'}</span>
            <span className="text-xs text-[var(--color-text-muted)] block font-bold mt-0.5">متوسط التقييم العام</span>
          </div>
        </GlassCard>

        <ReviewList reviews={reviews} />
      </motion.div>
    </DashboardLayout>
  );
};

