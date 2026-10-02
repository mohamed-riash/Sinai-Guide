import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Container } from '../../components/common/Container';
import { PlaceGrid } from '../../components/places/PlaceGrid';
import { favoritesService } from '../../services/favoritesService';
import { placeService } from '../../services/placeService';

export const SavedPage = () => {
  const [savedPlaces, setSavedPlaces] = useState([]);

  useEffect(() => {
    const favIds = favoritesService.getFavorites();
    const all = placeService.getAll();
    const filtered = all.filter(p => favIds.includes(p.id));
    setSavedPlaces(filtered);
  }, []);

  return (
    <div className="py-8 flex flex-col gap-8">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-8"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-digital-blue-500)]">مجموعتك الشخصية</span>
          <h1 className="text-3xl font-extrabold font-display text-[var(--color-text-primary)] mt-1">
            الأماكن المحفوظة ({savedPlaces.length})
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-2">
            أماكن شمال سيناء المفضلة لديك — مطاعم الأسماك، الكافيهات البحرية، وشواطئ النخيل.
          </p>
        </motion.div>

        <PlaceGrid places={savedPlaces} emptyTitle="لا توجد أماكن محفوظة بعد" emptyDesc="اضغط على أيقونة القلب على أي مكان لإضافته لمفضلتك الشخصية." />
      </Container>
    </div>
  );
};

