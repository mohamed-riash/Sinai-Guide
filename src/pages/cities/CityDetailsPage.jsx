import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Container } from '../../components/common/Container';
import { PlaceGrid } from '../../components/places/PlaceGrid';
import { MapSection } from '../../components/common/MapSection';
import { placeService } from '../../services/placeService';
import { CITIES } from '../../data/cities';
import { NotFoundPage } from '../NotFoundPage';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export const CityDetailsPage = () => {
  const { cityId } = useParams();
  const city = CITIES.find(c => c.id === cityId);

  if (!city) {
    return <NotFoundPage />;
  }

  const cityPlaces = placeService.getByCity(city.id);

  return (
    <div className="flex flex-col gap-12 py-6">
      {/* City Hero */}
      <section className="relative min-h-[45vh] flex items-center justify-center p-6">
        <div
          className="absolute inset-0 bg-cover bg-center filter brightness-[0.65] contrast-[1.15] rounded-3xl"
          style={{ backgroundImage: `url('${city.heroImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-slate-950/60 to-slate-950/80 rounded-3xl" />

        <Container className="relative z-10 text-center flex flex-col items-center gap-4 py-8">
          <Link to="/cities" className="self-start text-xs font-bold text-teal-300 hover:underline flex items-center gap-1 mb-2">
            <ArrowRight className="w-4 h-4" /> العودة لجميع المدن
          </Link>
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-[#A85F48] text-white shadow-md"
          >
            {city.population} نسمة
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black font-display text-white"
          >
            {city.nameAr} <span className="text-2xl sm:text-4xl font-normal opacity-80">({city.name})</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-200 max-w-2xl font-medium leading-relaxed drop-shadow"
          >
            {city.tagline}
          </motion.p>
        </Container>
      </section>

      <Container className="flex flex-col gap-10">
        {/* City Overview */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="glass-l2 p-6 sm:p-8 flex flex-col gap-4 rounded-3xl border border-white/20 dark:border-white/10">
          <h2 className="text-2xl font-black font-display text-[var(--color-text-primary)]">عن {city.nameAr}</h2>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            {city.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {city.highlights.map((h, i) => (
              <span key={i} className="px-3 py-1 rounded-xl text-xs font-bold bg-[#A85F48]/15 text-[#A85F48] border border-[#A85F48]/30">
                ✦ {h}
              </span>
            ))}
          </div>
        </motion.div>

        {/* City Places Grid */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black font-display text-[var(--color-text-primary)]">
              أماكن ومعالم في {city.nameAr} ({cityPlaces.length})
            </h2>
          </div>

          <PlaceGrid places={cityPlaces} emptyTitle={`لا توجد أماكن مُسجلة بعد في ${city.nameAr}`} />
        </motion.div>

        {/* Map Section */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="flex flex-col gap-4">
          <h2 className="text-xl font-bold font-display text-[var(--color-text-primary)]">موقع المدينة</h2>
          <MapSection locationName={city.nameAr} address={`${city.nameAr}، محافظة شمال سيناء، مصر`} coordinates={city.coordinates} />
        </motion.div>
      </Container>
    </div>
  );
};

