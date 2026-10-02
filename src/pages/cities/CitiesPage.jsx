import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Container } from '../../components/common/Container';
import { GlassCard } from '../../components/common/GlassCard';
import { Button } from '../../components/common/Button';
import { CITIES } from '../../data/cities';
import { placeService } from '../../services/placeService';

const fadeInUp = {
  hidden: { opacity: 0, y: 25 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }
  })
};

export const CitiesPage = () => {
  return (
    <div className="py-8 flex flex-col gap-10">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-8"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-digital-blue-500)]">مدن شمال سيناء</span>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-[var(--color-text-primary)] mt-1">
            اكتشف مدن شمال سيناء
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-2 leading-relaxed">
            من عاصمة البحر المتوسط النابضة العريش إلى محميات الزرانيق الهادئة في بئر العبد، بساتين زيتون الشيخ زويد، ورمال رفح الساحلية التاريخية.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CITIES.map((city, index) => (
            <motion.div key={city.id} variants={fadeInUp} custom={index} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <GlassCard className="p-0 overflow-hidden group flex flex-col justify-between h-full">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={city.heroImage}
                    alt={city.nameAr}
                    className="w-full h-full object-cover group-hover:scale-108 transition duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
                  <div className="absolute top-4 right-4">
                    <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-[var(--color-digital-blue-500)] text-white shadow-lg">
                      {placeService.getByCity(city.id).length} مكان مسجل
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 left-4 text-white">
                    <span className="text-xs uppercase font-extrabold tracking-widest text-digital-blue-300">
                      دليل {city.nameAr}
                    </span>
                    <h2 className="text-2xl font-black font-display">{city.nameAr} ({city.name})</h2>
                  </div>
                </div>

                <div className="p-6 flex flex-col gap-4 flex-1 justify-between">
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed font-normal">
                    {city.description}
                  </p>

                  {/* Highlights Pills */}
                  <div className="flex flex-wrap gap-2">
                    {city.highlights.map((h, i) => (
                      <span key={i} className="px-3 py-1 rounded-xl text-[11px] font-bold bg-white/20 dark:bg-black/30 border border-white/20 dark:border-white/10 text-[var(--color-text-primary)]">
                        {h}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-start">
                    <Link to={`/cities/${city.id}`}>
                      <Button variant="primary" size="sm" icon={ChevronLeft}>
                        استكشف {city.nameAr}
                      </Button>
                    </Link>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </Container>
    </div>
  );
};
