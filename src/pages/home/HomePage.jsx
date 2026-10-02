import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Compass, Utensils, Coffee, Hotel, Landmark, Calendar, ShieldCheck, Waves, ChevronLeft, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Container } from '../../components/common/Container';
import { Button } from '../../components/common/Button';
import { PlaceCard } from '../../components/places/PlaceCard';
import { EmptyState } from '../../components/common/EmptyState';
import { placeService } from '../../services/placeService';
import { blogService } from '../../services/blogService';
import { CITIES } from '../../data/cities';
import { CATEGORIES } from '../../data/categories';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }
  })
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
};

const CATEGORY_ICONS = {
  restaurant: Utensils,
  cafe: Coffee,
  hotel: Hotel,
  attraction: Landmark,
  activity: Compass,
  beach: Waves,
  shopping: ShieldCheck,
  event: Calendar,
};

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

export const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const featuredPlaces = placeService.getAllPublic().filter(p => p.featured).slice(0, 6);
  const blogPosts = blogService.getAllPosts();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCity !== 'all') params.set('city', selectedCity);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    navigate(`/explore?${params.toString()}`);
  };

  return (
    <div className="relative flex flex-col gap-0">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-clip">
        <div className="ambient-glow-1 top-20 right-10" />
        <div className="ambient-glow-2 top-96 left-10" />
      </div>

      {/* ═══════════════════ HERO SECTION ═══════════════════ */}
      <section className="relative min-h-[88vh] flex items-center justify-center pt-8 pb-16">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="/assets/cities/arish.jpg"
          sizes="100vw"
          alt=""
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-slate-950/65 to-slate-950/80" />

        {/* Ambient Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2.5 h-2.5 rounded-full bg-[var(--color-digital-blue-500)]/25"
              style={{ top: `${20 + i * 14}%`, right: `${12 + i * 15}%` }}
            />
          ))}
        </div>

        <Container className="relative z-10 text-center flex flex-col items-center gap-8 py-10">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex items-center gap-2.5 px-6 py-2 rounded-full glass-l3 border-white/20 text-[var(--color-digital-blue-300)] text-xs font-extrabold tracking-widest backdrop-blur-xl shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-[var(--color-digital-blue-500)]" />
            <span>اكتشف كنوز شمال سيناء الخفية</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black font-display text-white max-w-5xl leading-[1.2] tracking-tight drop-shadow-2xl"
          >
            حيث يلتقي سحر البحر بأصالة الصحراء..
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-[var(--color-digital-blue-400)] via-[var(--color-digital-blue-300)] to-digital-blue-200">
              اكتشف روح سيناء الحقيقية
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-xl text-slate-200 max-w-2xl font-medium leading-relaxed drop-shadow"
          >
            دليلك الرقمي الشامل لاستكشاف المطاعم، الكافيهات، الشواطئ والفنادق في العريش وباقي مدن سيناء
          </motion.p>

          {/* Glass Search & Filter Hero Panel */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="w-full max-w-4xl glass-l3 p-5 sm:p-7 shadow-2xl border border-white/30 rounded-3xl mt-2 backdrop-blur-2xl"
          >
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              {/* Search Query Input */}
              <div className="sm:col-span-5 relative">
                <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="ابحث عن مطاعم، كافيهات، شواطئ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-3 pr-11 pl-4 rounded-xl text-sm glass-input focus:outline-none focus:border-[var(--color-digital-blue-500)]"
                />
              </div>

              {/* City Select */}
              <div className="sm:col-span-3">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full py-3 px-3 rounded-xl text-sm glass-input cursor-pointer"
                >
                  <option value="all" className="bg-slate-900 text-white">جميع مدن سيناء</option>
                  {CITIES.map((c) => (
                    <option key={c.id} value={c.id} className="bg-slate-900 text-white">{c.nameAr || c.name}</option>
                  ))}
                </select>
              </div>

              {/* Category Select */}
              <div className="sm:col-span-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full py-3 px-3 rounded-xl text-sm glass-input cursor-pointer"
                >
                  <option value="all" className="bg-slate-900 text-white">جميع الأنواع</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-slate-900 text-white">{CATEGORY_NAMES_AR[cat.id] || cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <div className="sm:col-span-2">
                <Button type="submit" variant="primary" fullWidth className="py-3 font-bold text-base">
                  استكشف
                </Button>
              </div>
            </form>
          </motion.div>
        </Container>
      </section>

      {/* ═══════════════════ EXPLORE BY CITY ═══════════════════ */}
      <section className="py-16 relative">
        <Container>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-col gap-10"
          >
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-digital-blue-500)]">وجهات سيناء المميزة</span>
                <h2 className="text-3xl sm:text-4xl font-black font-display text-[var(--color-text-primary)] mt-1">
                  استكشف مدن شمال سيناء
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)] mt-2 max-w-lg">
                  كل مدينة لها سحرها الخاص — من شواطئ العريش الخلابة للمحميات الطبيعية
                </p>
              </div>
              <Link to="/cities">
                <Button variant="ghost" icon={ChevronLeft}>
                  عرض جميع المدن
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {CITIES.map((city, index) => (
                <motion.div
                  key={city.id}
                  variants={fadeInUp}
                  custom={index}
                  whileHover={{ y: -8 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Link to={`/cities/${city.id}`} className="group block">
                    <div className="glass-card p-0 overflow-hidden relative aspect-[4/5] flex flex-col justify-end">
                      <img
                        src={city.heroImage}
                        alt={city.nameAr}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                      <div className="relative z-10 p-6 flex flex-col gap-2">
                        <span className="text-[10px] uppercase font-extrabold tracking-widest text-digital-blue-300">
                          {placeService.getByCity(city.id).length} مكان مسجل
                        </span>
                        <h3 className="text-2xl font-black font-display text-white group-hover:text-[var(--color-digital-blue-400)] transition">
                          {city.nameAr} <span className="text-sm font-normal opacity-80">({city.name})</span>
                        </h3>
                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                          {city.tagline}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* ═══════════════════ CATEGORIES GRID ═══════════════════ */}
      <section className="py-16 relative">
        <div className="ambient-glow-2 bottom-20 right-20" />
        <Container>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-col gap-10"
          >
            <motion.div variants={fadeInUp} className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-digital-blue-500)]">تصفح التصنيفات</span>
              <h2 className="text-3xl sm:text-4xl font-black font-display text-[var(--color-text-primary)] mt-1">
                ابحث عن ما تريده بسهولة
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] mt-2">
                من مطاعم الأسماك الطازجة إلى كافيهات الساحل — خيارات متنوعة تناسب الجميع
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {CATEGORIES.map((cat, index) => {
                const IconComp = CATEGORY_ICONS[cat.id] || Compass;
                return (
                  <motion.div
                    key={cat.id}
                    variants={fadeInUp}
                    custom={index}
                    whileHover={{ y: -6, scale: 1.02 }}
                  >
                    <Link
                      to={`/explore?category=${cat.id}`}
                      className="glass-card p-6 flex flex-col items-center text-center gap-3 group"
                    >
                      <div className="p-4 rounded-2xl bg-[var(--color-digital-blue-500)]/15 text-[var(--color-digital-blue-500)] group-hover:bg-[var(--color-digital-blue-500)] group-hover:text-white transition duration-300">
                        <IconComp className="w-7 h-7" />
                      </div>
                      <h4 className="font-bold font-display text-base text-[var(--color-text-primary)]">
                        {CATEGORY_NAMES_AR[cat.id] || cat.name}
                      </h4>
                      <p className="text-xs text-[var(--color-text-muted)] line-clamp-2">{cat.description}</p>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* ═══════════════════ FEATURED PLACES ═══════════════════ */}
      <section className="py-16 relative">
        <div className="ambient-glow-1 top-10 left-20" />
        <Container>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-col gap-10"
          >
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-digital-blue-500)]">أبرز الوجهات المختارة</span>
                <h2 className="text-3xl sm:text-4xl font-black font-display text-[var(--color-text-primary)] mt-1">
                  أماكن ومنتجعات مميزة
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)] mt-2 max-w-lg">
                  وجهات مختارة بعناية لتجربة سياحية لا تُنسى في شمال سيناء
                </p>
              </div>
              <Link to="/explore">
                <Button variant="ghost" icon={ChevronLeft}>
                  عرض جميع الأماكن
                </Button>
              </Link>
            </motion.div>

            {featuredPlaces.length > 0 ? (
              <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredPlaces.map((place, index) => (
                  <motion.div key={place.id} variants={fadeInUp} custom={index}>
                    <PlaceCard place={place} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <EmptyState
                icon={Compass}
                title="لا توجد أماكن مميزة حاليا"
                description="ستظهر هنا الأماكن التي يضيفها أصحاب الأنشطة ويعتمدها فريق الإدارة."
                className="py-6"
              />
            )}
          </motion.div>
        </Container>
      </section>

      {/* ═══════════════════ WHY SINAI SECTION ═══════════════════ */}
      <section className="py-16 relative">
        <Container>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-col gap-10"
          >
            <motion.div variants={fadeInUp} className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-digital-blue-500)]">لماذا شمال سيناء؟</span>
              <h2 className="text-3xl sm:text-4xl font-black font-display text-[var(--color-text-primary)] mt-1">
                تجربة سياحية فريدة من نوعها
              </h2>
            </motion.div>

            <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Waves,
                  title: 'شواطئ نخيل البحر المتوسط',
                  desc: 'استمتع بشواطئ رملية نقية تحيط بها أشجار النخيل على ساحل البحر المتوسط الصافي في العريش.',
                  gradient: 'from-digital-blue-500/15 to-digital-blue-900/5',
                },
                {
                  icon: Utensils,
                  title: 'مأكولات بحرية طازجة يومياً',
                  desc: 'تذوق أطباق السمك والجمبري الطازج المصطاد يومياً من البحر مباشرة — لا يُقارن بشيء.',
                  gradient: 'from-[var(--color-digital-blue-500)]/15 to-[var(--color-digital-blue-600)]/5',
                },
                {
                  icon: Compass,
                  title: 'محمية الزرانيق العالمية',
                  desc: 'شاهد طيور الفلامنجو والطيور المهاجرة في واحدة من أهم محميات الطيور على مستوى العالم.',
                  gradient: 'from-[var(--color-digital-blue-500)]/15 to-[var(--color-digital-blue-500)]/5',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  custom={i}
                  whileHover={{ y: -6 }}
                  className={`glass-card p-8 flex flex-col gap-4 bg-gradient-to-bl ${item.gradient}`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-[var(--color-digital-blue-500)]/15 flex items-center justify-center">
                    <item.icon className="w-7 h-7 text-[var(--color-digital-blue-500)]" />
                  </div>
                  <h3 className="text-lg font-bold font-display text-[var(--color-text-primary)]">{item.title}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* ═══════════════════ BLOG & TRAVEL INSPIRATION ═══════════════════ */}
      {blogPosts.length > 0 && <section className="py-16">
        <Container>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-col gap-10"
          >
            <motion.div variants={fadeInUp} className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-digital-blue-500)]">مدونة دليل سيناء والتراث</span>
              <h2 className="text-3xl sm:text-4xl font-black font-display text-[var(--color-text-primary)] mt-1">
                إلهام سفر وقصص تراثية
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] mt-2">
                اقرأ عن أجمل الوجهات والتجارب المحلية من أهل سيناء أنفسهم
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogPosts.map((post, index) => (
                <motion.div key={post.id} variants={fadeInUp} custom={index} whileHover={{ y: -6 }}>
                  <Link to={`/blog/${post.slug}`} className="glass-card p-0 overflow-hidden flex flex-col group h-full">
                    <div className="aspect-[16/10] overflow-hidden relative">
                      <img src={post.image} alt={post.titleAr || post.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                    </div>
                    <div className="p-5 flex flex-col gap-2 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-digital-blue-500)]">{post.category} • {post.readTime}</span>
                      <h3 className="font-display font-bold text-lg text-[var(--color-text-primary)] group-hover:text-[var(--color-digital-blue-500)] transition line-clamp-2">
                        {post.titleAr || post.title}
                      </h3>
                      <p className="text-xs text-[var(--color-text-secondary)] line-clamp-3 leading-relaxed mt-1">
                        {post.excerptAr || post.excerpt}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </Container>
      </section>}

      {/* ═══════════════════ BUSINESS OWNER CTA BANNER ═══════════════════ */}
      <section className="py-16">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="glass-panel p-8 sm:p-14 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-white/20 bg-gradient-to-l from-[var(--color-digital-blue-700)] to-[var(--color-digital-blue-800)]"
          >
            {/* Decorative orbs */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-digital-blue-500/10 rounded-full filter blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-56 h-56 bg-[var(--color-digital-blue-500)]/10 rounded-full filter blur-[60px] pointer-events-none" />

            <div className="relative z-10 flex flex-col gap-4 text-white max-w-xl">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-digital-blue-300)]">لأصحاب الأنشطة التجارية في شمال سيناء</span>
              <h2 className="text-3xl sm:text-4xl text-[var(--color-text-primary)] font-extrabold font-display leading-tight">
                تمتلك مطعم، كافيه، شاليه أو فندق؟
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                سجّل نشاطك التجاري على دليل سيناء اليوم لإدارة قائمة الطعام، استلام طلبات عبر واتساب،
                قبول حجوزات الطاولات، والوصول لآلاف السياح والسكان المحليين.
              </p>
            </div>
            <div className="relative z-10 shrink-0">
              <Link to="/register?role=business_owner">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="primary" size="lg" className="shadow-2xl text-base font-bold px-8">
                    سجّل نشاطك التجاري الآن
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
};
