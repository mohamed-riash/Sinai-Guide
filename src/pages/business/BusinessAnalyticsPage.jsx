import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Calendar, Eye, MessageSquare, ShoppingBag, TrendingUp } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { MetricCard } from '../../components/common/MetricCard';
import { GlassCard } from '../../components/common/GlassCard';
import { EmptyState } from '../../components/common/EmptyState';
import { useAuth } from '../../hooks/useAuth';
import { placeService } from '../../services/placeService';
import { orderService } from '../../services/orderService';
import { bookingService } from '../../services/bookingService';
import { reviewService } from '../../services/reviewService';

const formatCurrency = (value) => `${value.toLocaleString('ar-EG')} ج.م`;

export const BusinessAnalyticsPage = () => {
  const { user } = useAuth();
  const place = placeService.getByOwnerId(user?.id, user?.businessId);
  const orders = place ? orderService.getOrdersByPlaceId(place.id) : [];
  const bookings = place ? bookingService.getBookingsByPlaceId(place.id) : [];
  const reviews = place ? reviewService.getReviewsByPlaceId(place.id) : [];
  const revenue = orders.reduce((sum, order) => sum + (Number.isFinite(Number(order.total)) ? Number(order.total) : 0), 0);
  const averageRating = reviews.length
    ? (reviews.reduce((sum, review) => sum + (Number(review.rating) || 0), 0) / reviews.length).toFixed(1)
    : '—';

  return (
    <DashboardLayout title="التحليلات والإحصاءات">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-6"
      >
        {!place ? (
          <EmptyState
            icon={BarChart3}
            title="لا توجد بيانات تحليلية بعد"
            description="ستظهر إحصاءات نشاطك هنا بعد إضافة نشاط تجاري واستقبال طلبات أو حجوزات أو مراجعات حقيقية."
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <MetricCard title="إجمالي الطلبات" value={orders.length} icon={ShoppingBag} />
              <MetricCard title="إجمالي الحجوزات" value={bookings.length} icon={Calendar} />
              <MetricCard title="إجمالي المراجعات" value={reviews.length} icon={MessageSquare} />
              <MetricCard title="متوسط التقييم" value={averageRating} icon={TrendingUp} />
            </div>

            <GlassCard hover={false} className="p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-digital-blue-500/10 text-digital-blue-600 dark:text-digital-blue-300 p-2.5">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-[var(--color-text-primary)]">إجمالي قيمة الطلبات المسجلة</h2>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-1">محسوبة من الطلبات المرتبطة بنشاطك فقط.</p>
                  <p className="text-2xl font-black mt-3 text-[var(--color-text-primary)]">{formatCurrency(revenue)}</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard hover={false} className="p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-slate-500/10 text-slate-500 dark:text-slate-300 p-2.5">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-[var(--color-text-primary)]">الزيارات ومشاهدات الصفحة</h2>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-1">إحصاءات الزيارات غير متاحة حاليًا لعدم وجود نظام تتبّع للزيارات.</p>
                </div>
              </div>
            </GlassCard>

            {orders.length === 0 && bookings.length === 0 && reviews.length === 0 && (
              <EmptyState
                icon={BarChart3}
                title="لا توجد بيانات كافية بعد"
                description="ستتحدث الإحصاءات عند تسجيل طلبات أو حجوزات أو مراجعات حقيقية لنشاطك."
                className="py-6"
              />
            )}
          </>
        )}
      </motion.div>
    </DashboardLayout>
  );
};
