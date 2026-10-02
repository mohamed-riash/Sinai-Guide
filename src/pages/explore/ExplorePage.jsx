import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { Container } from '../../components/common/Container';
import { Button } from '../../components/common/Button';
import { PlaceGrid } from '../../components/places/PlaceGrid';
import { PlaceFilterDrawer } from '../../components/places/PlaceFilterDrawer';
import { placeService } from '../../services/placeService';
import { CITIES } from '../../data/cities';
import { CATEGORIES } from '../../data/categories';

const CATEGORY_NAMES_AR = {
  restaurant: 'مطاعم',
  cafe: 'كافيهات',
  hotel: 'فنادق ومنتجعات',
  attraction: 'معالم سياحية',
  activity: 'أنشطة',
  beach: 'شواطئ',
  shopping: 'تسوق',
  event: 'فعاليات',
};

export const ExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    cityId: searchParams.get('city') || 'all',
    categoryId: searchParams.get('category') || 'all',
    searchQuery: searchParams.get('q') || '',
    priceRange: 'all',
    isOpenNow: false,
    minRating: 0
  });

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const filtered = placeService.filterPlaces(filters);
    setPlaces(filtered);
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      cityId: 'all',
      categoryId: 'all',
      searchQuery: '',
      priceRange: 'all',
      isOpenNow: false,
      minRating: 0
    });
    setSearchParams({});
  };

  const activeFiltersCount = [
    filters.cityId !== 'all',
    filters.categoryId !== 'all',
    filters.searchQuery !== '',
    filters.priceRange !== 'all',
    filters.isOpenNow,
    filters.minRating > 0,
  ].filter(Boolean).length;

  return (
    <div className="py-8 flex flex-col gap-8">
      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-[var(--color-text-primary)]">
              استكشف أماكن شمال سيناء
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              اكتشف {places.length} وجهة سياحية — مطاعم أسماك طازجة، كافيهات شاطئية، منتجعات وواحات.
            </p>
          </div>

          <button
            onClick={() => setFilterDrawerOpen(true)}
            className="md:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl glass-input text-sm font-semibold text-[var(--color-text-primary)]"
          >
            <SlidersHorizontal className="w-4 h-4 text-[var(--color-digital-blue-500)]" />
            <span>الفلاتر {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
          </button>
        </motion.div>

        {/* Desktop Filter & Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="hidden md:flex flex-col gap-4 glass-l2 p-5 mb-8 rounded-2xl border border-white/20 dark:border-white/10"
        >
          <div className="grid grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="col-span-4 relative">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="ابحث بالاسم أو نوع الطعام..."
                value={filters.searchQuery}
                onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                className="w-full py-2.5 pr-10 pl-4 rounded-xl text-xs glass-input focus:outline-none focus:border-[var(--color-digital-blue-500)]"
              />
            </div>

            {/* City */}
            <div className="col-span-3">
              <select
                value={filters.cityId}
                onChange={(e) => setFilters(prev => ({ ...prev, cityId: e.target.value }))}
                className="w-full py-2.5 px-3 rounded-xl text-xs glass-input cursor-pointer"
              >
                <option value="all" className="bg-slate-900 text-white">جميع مدن سيناء</option>
                {CITIES.map(c => (
                  <option key={c.id} value={c.id} className="bg-slate-900 text-white">{c.nameAr || c.name}</option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div className="col-span-3">
              <select
                value={filters.categoryId}
                onChange={(e) => setFilters(prev => ({ ...prev, categoryId: e.target.value }))}
                className="w-full py-2.5 px-3 rounded-xl text-xs glass-input cursor-pointer"
              >
                <option value="all" className="bg-slate-900 text-white">جميع التصنيفات</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id} className="bg-slate-900 text-white">{CATEGORY_NAMES_AR[cat.id] || cat.name}</option>
                ))}
              </select>
            </div>

            {/* Reset */}
            <div className="col-span-2">
              <Button variant="ghost" size="sm" icon={RotateCcw} onClick={handleResetFilters} fullWidth>
                إعادة ضبط
              </Button>
            </div>
          </div>

          {/* Secondary Filter Row */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-200/40 dark:border-white/10 text-xs">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.isOpenNow}
                  onChange={(e) => setFilters(prev => ({ ...prev, isOpenNow: e.target.checked }))}
                  className="rounded text-[var(--color-digital-blue-500)]"
                />
                <span className="font-semibold text-[var(--color-text-primary)]">مفتوح الآن فقط</span>
              </label>

              <div className="flex items-center gap-2">
                <span className="text-[var(--color-text-muted)] font-medium">السعر:</span>
                <select
                  value={filters.priceRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                  className="py-1 px-2.5 rounded-lg glass-input text-xs"
                >
                  <option value="all" className="bg-slate-900 text-white">أي سعر</option>
                  <option value="$" className="bg-slate-900 text-white">$ اقتصادي</option>
                  <option value="$$" className="bg-slate-900 text-white">$$ متوسط</option>
                  <option value="$$$" className="bg-slate-900 text-white">$$$ فاخر</option>
                </select>
              </div>
            </div>

            <span className="text-[var(--color-text-muted)] font-medium">عرض {places.length} مكان</span>
          </div>
        </motion.div>

        {/* Places Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <PlaceGrid places={places} />
        </motion.div>
      </Container>

      {/* Mobile Filter Drawer */}
      <PlaceFilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filters={filters}
        setFilters={setFilters}
        onReset={handleResetFilters}
      />
    </div>
  );
};

