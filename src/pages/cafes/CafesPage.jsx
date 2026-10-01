import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '../../components/common/Container';
import { PlaceGrid } from '../../components/places/PlaceGrid';
import { placeService } from '../../services/placeService';

export const CafesPage = () => {
  const cafes = placeService.getByCategory('cafe');

  return (
    <div className="py-8 flex flex-col gap-8">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-8"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-[#A85F48]">كافيهات ولاونجات</span>
          <h1 className="text-3xl font-black font-display text-[var(--color-text-primary)] mt-1">
            كافيهات الشاطئ والقهوة المتخصصة
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-2 leading-relaxed">
            استمتع بقهوة متخصصة، شاي الحبق السيناوي البري، كنافة بالجبنة، ونسيم البحر على كورنيش العريش.
          </p>
        </motion.div>

        <PlaceGrid places={cafes} emptyTitle="لا توجد كافيهات مُسجلة بعد" />
      </Container>
    </div>
  );
};

