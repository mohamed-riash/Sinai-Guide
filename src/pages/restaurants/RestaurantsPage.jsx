import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '../../components/common/Container';
import { PlaceGrid } from '../../components/places/PlaceGrid';
import { placeService } from '../../services/placeService';

export const RestaurantsPage = () => {
  const restaurants = placeService.getByCategory('restaurant');

  return (
    <div className="py-8 flex flex-col gap-8">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-8"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-[#A85F48]">مطاعم شمال سيناء</span>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-[var(--color-text-primary)] mt-1">
            مطاعم الأسماك والمأكولات البدوية
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-2 leading-relaxed">
            اكتشف أشهى أسماك البحر المتوسط الطازجة يومياً في العريش، جمبري مشوي على الفحم، ولحم بدوي مطبوخ ببطء. اطلب مباشرة لبابك أو طاولتك عبر واتساب.
          </p>
        </motion.div>

        <PlaceGrid places={restaurants} emptyTitle="لا توجد مطاعم مُسجلة بعد" />
      </Container>
    </div>
  );
};

