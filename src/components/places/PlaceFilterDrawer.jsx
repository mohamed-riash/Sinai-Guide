import React from 'react';
import { X, Filter, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../common/Button';
import { Select } from '../common/Select';
import { CITIES } from '../../data/cities';
import { CATEGORIES } from '../../data/categories';

export const PlaceFilterDrawer = ({
  isOpen,
  onClose,
  filters,
  setFilters,
  onReset
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-start">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/65 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="relative z-10 w-full max-w-sm glass-l3 h-full p-6 overflow-y-auto flex flex-col justify-between border-r border-white/20 dark:border-white/10 text-right shadow-2xl"
          >
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-[#A85F48]" />
                  <h3 className="text-lg font-bold font-display text-[var(--color-text-primary)]">تصفية الأماكن</h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg text-slate-400 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* City Filter */}
              <Select
                label="المدينة"
                value={filters.cityId}
                onChange={(e) => setFilters(prev => ({ ...prev, cityId: e.target.value }))}
                options={[
                  { value: 'all', label: 'جميع المدن' },
                  ...CITIES.map(c => ({ value: c.id, label: c.nameAr || c.name }))
                ]}
              />

              {/* Category Filter */}
              <Select
                label="التصنيف"
                value={filters.categoryId}
                onChange={(e) => setFilters(prev => ({ ...prev, categoryId: e.target.value }))}
                options={[
                  { value: 'all', label: 'جميع التصنيفات' },
                  ...CATEGORIES.map(cat => ({ value: cat.id, label: cat.name }))
                ]}
              />

              {/* Price Range Filter */}
              <Select
                label="نطاق السعر"
                value={filters.priceRange}
                onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                options={[
                  { value: 'all', label: 'أي سعر' },
                  { value: '$', label: '$ (اقتصادي)' },
                  { value: '$$', label: '$$ (متوسط)' },
                  { value: '$$$', label: '$$$ (فاخر)' },
                  { value: '$$$$', label: '$$$$ (فخم جداً)' }
                ]}
              />

              {/* Rating Filter */}
              <Select
                label="أقل تقييم"
                value={filters.minRating}
                onChange={(e) => setFilters(prev => ({ ...prev, minRating: Number(e.target.value) }))}
                options={[
                  { value: 0, label: 'جميع التقييمات' },
                  { value: 4.5, label: '★ 4.5 وأعلى' },
                  { value: 4.0, label: '★ 4.0 وأعلى' },
                  { value: 3.5, label: '★ 3.5 وأعلى' }
                ]}
              />

              {/* Open Now Toggle */}
              <label className="flex items-center gap-3 p-3 rounded-xl glass-input cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.isOpenNow}
                  onChange={(e) => setFilters(prev => ({ ...prev, isOpenNow: e.target.checked }))}
                  className="w-4 h-4 rounded text-[#A85F48] focus:ring-[#A85F48]"
                />
                <span className="text-sm font-semibold text-[var(--color-text-primary)]">مفتوح الآن فقط</span>
              </label>
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center gap-3">
              <Button variant="ghost" icon={RotateCcw} onClick={onReset} fullWidth>
                إعادة ضبط
              </Button>
              <Button variant="primary" onClick={onClose} fullWidth>
                تطبيق الفلاتر
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

