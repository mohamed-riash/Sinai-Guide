import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, Phone, MessageSquare, Plus, Calendar, Share2, Check, ArrowRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { motion, AnimatePresence } from 'framer-motion';
import 'swiper/css';

import { Container } from '../../components/common/Container';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { RatingStars } from '../../components/common/RatingStars';
import { FavoriteButton } from '../../components/common/FavoriteButton';
import { MapSection } from '../../components/common/MapSection';
import { BookingModal } from '../../components/booking/BookingModal';
import { ReviewForm } from '../../components/reviews/ReviewForm';
import { ReviewList } from '../../components/reviews/ReviewList';

import { placeService } from '../../services/placeService';
import { reviewService } from '../../services/reviewService';
import { CITIES } from '../../data/cities';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../hooks/useToast';
import { NotFoundPage } from '../NotFoundPage';

const CATEGORY_NAMES_AR = {
  restaurant: 'مطعم',
  cafe: 'كافيه',
  hotel: 'فندق',
  attraction: 'معالم سياحية',
  activity: 'نشاط',
  beach: 'شاطئ',
  shopping: 'تسوق',
  event: 'فعالية',
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export const PlaceDetailsPage = () => {
  const { placeId } = useParams();
  const place = placeService.getById(placeId);
  const { addItem: addCartItem } = useCart();
  const { toastSuccess } = useToast();

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [reviews, setReviews] = useState(() => reviewService.getReviewsByPlaceId(placeId));
  const [activeMenuTab, setActiveMenuTab] = useState(0);

  if (!place) {
    return <NotFoundPage />;
  }

  const city = CITIES.find(c => c.id === place.cityId);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: place.nameAr || place.name,
        text: place.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toastSuccess('تم نسخ رابط المكان بنجاح!');
    }
  };

  const handleReviewAdded = (newRev) => {
    setReviews(prev => [newRev, ...prev]);
  };

  return (
    <div className="py-6 flex flex-col gap-10">
      <Container>
        {/* Breadcrumb */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Link to="/explore" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A85F48] hover:underline mb-4">
            <ArrowRight className="w-4 h-4" /> العودة للاستكشاف
          </Link>
        </motion.div>

        {/* Header Title Bar */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6"
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Badge variant="primary" className="uppercase tracking-widest text-[10px]">
                {CATEGORY_NAMES_AR[place.categoryId] || place.categoryId}
              </Badge>
              <span className="text-xs font-bold text-[var(--color-text-secondary)]">
                {city?.nameAr || city?.name || place.cityId} • {
                  place.minPrice !== undefined && place.maxPrice !== undefined
                    ? `${place.minPrice} – ${place.maxPrice} ج.م`
                    : place.priceRange || 'سعر مناسب'
                }
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black font-display text-[var(--color-text-primary)]">
              {place.nameAr || place.name}
            </h1>

            <div className="flex items-center gap-4 text-xs flex-wrap">
              <RatingStars rating={place.rating} size="sm" />
              <span className="text-[var(--color-text-muted)] font-semibold">({place.reviewCount} تقييم)</span>
              <span className="text-slate-400">•</span>
              <span className={place.isOpenNow ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400'}>
                {place.isOpenNow ? '● مفتوح الآن' : '● مغلق حالياً'}
              </span>
            </div>
          </div>

          {/* Action Header Buttons */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="p-3 rounded-2xl glass-input hover:bg-white/30 text-[var(--color-text-primary)] transition shadow-sm"
              aria-label="مشاركة"
            >
              <Share2 className="w-5 h-5" />
            </motion.button>

            <FavoriteButton placeId={place.id} className="p-3 rounded-2xl" />

            {place.hasBooking && (
              <Button variant="primary" size="md" icon={Calendar} onClick={() => setBookingModalOpen(true)}>
                احجز تجربتك
              </Button>
            )}
          </div>
        </motion.div>

        {/* Gallery Carousel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full rounded-3xl overflow-hidden glass-l2 border border-white/20 dark:border-white/10 mb-8 shadow-2xl"
        >
          <Swiper spaceBetween={10} slidesPerView={1} className="w-full aspect-[16/9] sm:aspect-[21/9]">
            {(place.gallery && place.gallery.length > 0 ? place.gallery : [place.image]).map((img, index) => (
              <SwiperSlide key={index}>
                <img src={img} alt={`${place.nameAr || place.name} ${index + 1}`} className="w-full h-full object-cover" loading="lazy" />
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        {/* Main Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (Details, Menu, Reviews) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Overview */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="glass-l2 p-6 sm:p-8 flex flex-col gap-4 rounded-3xl border border-white/20 dark:border-white/10">
              <h3 className="text-xl font-black font-display text-[var(--color-text-primary)]">نظرة عامة</h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line font-normal">
                {place.description}
              </p>

              {/* Amenities */}
              {place.amenities && place.amenities.length > 0 && (
                <div className="pt-4 border-t border-slate-200/40 dark:border-white/10 mt-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#A85F48] mb-3">المرافق والمميزات</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {place.amenities.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-2 text-xs font-bold text-[var(--color-text-primary)] bg-white/20 dark:bg-black/30 p-2.5 rounded-xl border border-white/20 dark:border-white/10"
                      >
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Menu Section (if restaurant/café) */}
            {place.hasOrdering && place.menu && place.menu.length > 0 && (
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="glass-l2 p-6 sm:p-8 flex flex-col gap-6 rounded-3xl border border-white/20 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black font-display text-[var(--color-text-primary)]">قائمة الطعام</h3>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1 font-medium">اطلب أشهى الأطباق البحرية والبدوية مباشرة عبر واتساب</p>
                  </div>
                  <Badge variant="primary">طازج يومياً</Badge>
                </div>

                {/* Menu Category Tabs */}
                {place.menu.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {place.menu.map((group, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveMenuTab(idx)}
                        className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                          activeMenuTab === idx
                            ? 'bg-[#A85F48] text-white shadow-md'
                            : 'glass-input hover:bg-white/30'
                        }`}
                      >
                        {group.category}
                      </button>
                    ))}
                  </div>
                )}

                {/* Active Menu Items */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeMenuTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    {place.menu[activeMenuTab]?.items.map((item) => (
                      <motion.div
                        key={item.id}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 rounded-2xl glass-card border border-white/20 dark:border-white/10 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {item.image && (
                            <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover shrink-0" loading="lazy" />
                          )}
                          <div className="truncate">
                            <h5 className="text-xs font-extrabold text-[var(--color-text-primary)] truncate">{item.name}</h5>
                            <p className="text-[11px] text-[var(--color-text-secondary)] line-clamp-1 mt-0.5 font-normal">{item.description}</p>
                            <span className="text-xs font-black text-[#A85F48] block mt-1">{item.price} ج.م</span>
                          </div>
                        </div>

                        <Button
                          variant="primary"
                          size="sm"
                          icon={Plus}
                          onClick={() => {
                            addCartItem(place, item);
                            toastSuccess(`تمت إضافة ${item.name} للسلة`);
                          }}
                          className="shrink-0"
                        >
                          أضف
                        </Button>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}

            {/* Reviews Section */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="glass-l2 p-6 sm:p-8 flex flex-col gap-6 rounded-3xl border border-white/20 dark:border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black font-display text-[var(--color-text-primary)]">
                  تقييمات العملاء ({reviews.length})
                </h3>
                <RatingStars rating={place.rating} size="sm" />
              </div>

              <ReviewForm placeId={place.id} onReviewAdded={handleReviewAdded} />
              <ReviewList reviews={reviews} />
            </motion.div>
          </div>

          {/* Right Sidebar Column (Hours, Contact, Map) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Quick Contact & Hours */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="glass-l3 p-6 flex flex-col gap-4 rounded-3xl border border-white/20 dark:border-white/10 sticky top-24 shadow-xl">
              <h3 className="text-lg font-black font-display text-[var(--color-text-primary)]">الموقع والتواصل</h3>

              <div className="flex items-start gap-3 text-xs font-bold text-[var(--color-text-secondary)]">
                <MapPin className="w-4 h-4 text-[#A85F48] shrink-0 mt-0.5" />
                <span>{place.location?.address || place.address}</span>
              </div>

              <div className="flex items-center gap-3 text-xs font-bold text-[var(--color-text-secondary)]">
                <Clock className="w-4 h-4 text-teal-500 shrink-0" />
                <span>
                  {place.openingTime && place.closingTime
                    ? `${place.openingTime} — ${place.closingTime}`
                    : place.openingHours}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs font-bold text-[var(--color-text-secondary)]">
                <Phone className="w-4 h-4 text-[#C99545] shrink-0" />
                <span dir="ltr">{place.phone}</span>
              </div>

              {place.whatsapp && (
                <a
                  href={`https://wa.me/${place.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2"
                >
                  <Button variant="success" fullWidth icon={MessageSquare} className="py-3 font-bold">
                    تواصل عبر واتساب
                  </Button>
                </a>
              )}

              {place.hasBooking && (
                <Button variant="primary" fullWidth icon={Calendar} onClick={() => setBookingModalOpen(true)} className="mt-1 py-3 font-bold">
                  احجز الآن
                </Button>
              )}
            </motion.div>

            {/* Map Section */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <MapSection
                locationName={place.nameAr || place.name}
                address={place.location?.address || place.address}
                coordinates={
                  place.location?.latitude
                    ? { lat: place.location.latitude, lng: place.location.longitude }
                    : place.coordinates
                }
              />
            </motion.div>
          </div>
        </div>
      </Container>

      {/* Booking Modal */}
      <BookingModal place={place} isOpen={bookingModalOpen} onClose={() => setBookingModalOpen(false)} />
    </div>
  );
};
