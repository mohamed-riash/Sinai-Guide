import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, ArrowLeft } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { RatingStars } from '../common/RatingStars';
import { FavoriteButton } from '../common/FavoriteButton';
import { Button } from '../common/Button';
import { CITIES } from '../../data/cities';
import { responsiveImageSrcSet } from '../../utils/imageUtils';

const CATEGORY_NAMES_AR = {
  restaurant: 'مطعم',
  cafe: 'كافيه',
  hotel: 'فندق',
  attraction: 'معلم سياحي',
  activity: 'نشاط',
  beach: 'شاطئ',
  shopping: 'تسوق',
  event: 'فعالية',
};

export const PlaceCard = memo(({ place }) => {
  const city = CITIES.find(c => c.id === place.cityId);

  return (
    <GlassCard className="group flex flex-col h-full p-0 overflow-hidden relative">
      {/* Image Container with Aspect Ratio */}
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <img
          src={place.image}
          srcSet={responsiveImageSrcSet(place.image)}
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
          alt={place.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

        {/* Floating Category Badge & Favorite Button */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
          <Badge variant="glass" className="backdrop-blur-md uppercase text-[11px] font-bold shadow-sm">
            {CATEGORY_NAMES_AR[place.categoryId] || place.categoryId}
          </Badge>
          <FavoriteButton placeId={place.id} />
        </div>

        {/* Bottom Image Overlay Location & Price */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs z-10">
          <div className="flex items-center gap-1 font-bold text-slate-100 drop-shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-[var(--color-digital-blue-500)]" />
            <span>{city?.nameAr || city?.name || place.cityId}</span>
          </div>
          <span className="font-extrabold text-[var(--color-digital-blue-500)] tracking-wider drop-shadow-sm">
            {place.minPrice !== undefined && place.maxPrice !== undefined
              ? `${place.minPrice} – ${place.maxPrice} ج.م`
              : place.priceRange || 'لم يحدد السعر'}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            {Number(place.reviewCount) > 0 ? (
              <RatingStars rating={place.rating} size="xs" />
            ) : (
              <span className="text-[11px] text-[var(--color-text-muted)]">لا توجد تقييمات بعد</span>
            )}
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              ({place.reviewCount} تقييم)
            </span>
          </div>

          <Link to={`/places/${place.id}`}>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white group-hover:text-[var(--color-digital-blue-500)] transition-colors line-clamp-1">
              {place.name}
            </h3>
          </Link>

          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-normal">
            {place.description}
          </p>
        </div>

        {/* Card Footer Actions */}
        <div className="pt-3.5 border-t border-slate-200/50 dark:border-white/10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold">
            <Clock className="w-3.5 h-3.5 text-digital-blue-600 dark:text-digital-blue-400" />
            <span className={place.isOpenNow ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400 dark:text-slate-500'}>
              {place.isOpenNow ? 'مفتوح الآن' : 'مغلق'}
            </span>
          </div>

          <Link to={`/places/${place.id}`}>
            <Button variant="primary" size="sm" icon={ArrowLeft}>
              {place.hasOrdering ? 'اطلب الآن' : place.hasBooking ? 'احجز الآن' : 'التفاصيل'}
            </Button>
          </Link>
        </div>
      </div>
    </GlassCard>
  );
});
