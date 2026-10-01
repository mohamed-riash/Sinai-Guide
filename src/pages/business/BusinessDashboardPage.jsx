import React from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { MetricCard } from '../../components/common/MetricCard';
import { GlassCard } from '../../components/common/GlassCard';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import { placeService } from '../../services/placeService';
import { orderService } from '../../services/orderService';
import { bookingService } from '../../services/bookingService';
import { reviewService } from '../../services/reviewService';
import { ShoppingBag, Calendar, Star, Utensils, TrendingUp, Users, ArrowRight, CheckCircle2, Clock, AlertCircle, XCircle } from 'lucide-react';

export const BusinessDashboardPage = () => {
  const { user } = useAuth();
  const place = placeService.getByOwnerId(user?.id, user?.businessId);

  const orders = place ? orderService.getOrdersByPlaceId(place.id) : [];
  const bookings = place ? bookingService.getBookingsByPlaceId(place.id) : [];
  const reviews = place ? reviewService.getReviewsByPlaceId(place.id) : [];

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const status = place?.status || 'approved';

  return (
    <DashboardLayout title="نظرة عامة على النشاط">
      <div className="flex flex-col gap-8">
        {/* Place Approval Status Banner */}
        {place && (
          <GlassCard hover={false} className={`p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border shadow-lg ${
            status === 'pending' ? 'bg-amber-500/10 border-amber-500/30' :
            status === 'rejected' ? 'bg-rose-500/10 border-rose-500/30' :
            'bg-emerald-500/10 border-emerald-500/30'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl shrink-0 ${
                status === 'pending' ? 'bg-amber-500/20 text-amber-500' :
                status === 'rejected' ? 'bg-rose-500/20 text-rose-500' :
                'bg-emerald-500/20 text-emerald-500'
              }`}>
                {status === 'pending' ? <Clock className="w-6 h-6 animate-pulse" /> :
                 status === 'rejected' ? <XCircle className="w-6 h-6" /> :
                 <CheckCircle2 className="w-6 h-6" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold font-display text-[var(--color-text-primary)]">
                    {place.nameAr || place.name}
                  </h3>
                  <span className={`px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
                    status === 'pending' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' :
                    status === 'rejected' ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30' :
                    'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                  }`}>
                    {status === 'pending' ? 'قيد المراجعة' : status === 'rejected' ? 'مرفوض' : 'تمت الموافقة / منشور'}
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1 font-medium leading-relaxed">
                  {status === 'pending' && 'تم إرسال طلب نشر نشاطك التجاري، وهو حالياً قيد المراجعة من الإدارة وسيظهر للجمهور فور الموافقة عليه.'}
                  {status === 'approved' && 'نشاطك التجاري منشور ومتاح للجمهور ولجميع زوار الدليل لاستقبال الطلبات والحجوزات.'}
                  {status === 'rejected' && 'تم رفض طلب إضافة هذا المكان من قبل الإدارة. يرجى تحديث البيانات من شاشة تعديل الملف التجاري وإعادة التقديم.'}
                </p>
              </div>
            </div>

            <Link to="/business/profile" className="shrink-0">
              <Button variant="glass" size="sm" icon={ArrowRight}>
                تعديل البيانات
              </Button>
            </Link>
          </GlassCard>
        )}

        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="إجمالي الإيرادات"
            value={`${totalRevenue.toLocaleString('ar-EG')} ج.م`}
            change="+18.4% هذا الشهر"
            icon={TrendingUp}
          />
          <MetricCard
            title="إجمالي الطلبات"
            value={orders.length}
            change="+12 طلب جديد اليوم"
            icon={ShoppingBag}
          />
          <MetricCard
            title="حجوزات الطاولات"
            value={bookings.length}
            change="+5 تم تأكيدها"
            icon={Calendar}
          />
          <MetricCard
            title="تقييم العملاء"
            value={`★ ${place?.rating || '5.0'}`}
            change={`${reviews.length} تقييم إجمالي`}
            icon={Star}
          />
        </div>

        {/* Recent Orders & Bookings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Customer Orders */}
          <GlassCard hover={false} className="flex flex-col gap-4 border border-white/20 dark:border-white/10 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border-subtle)]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[var(--color-terracotta)]" />
                <h3 className="text-base font-bold font-display text-[var(--color-text-primary)]">آخر الطلبات</h3>
              </div>
              <Link to="/business/orders">
                <Button variant="ghost" size="sm" icon={ArrowRight}>
                  عرض الكل
                </Button>
              </Link>
            </div>

            {orders.length === 0 ? (
              <p className="text-xs text-[var(--color-text-muted)] text-center py-6">لا توجد طلبات من العملاء بعد.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {orders.slice(0, 4).map(ord => (
                  <div key={ord.id} className="p-3.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--color-border-subtle)] flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-[var(--color-text-primary)]">{ord.customerName} ({ord.customerPhone})</p>
                      <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">{ord.items.length} أصناف • {ord.total} ج.م</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                      {ord.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          {/* Recent Bookings */}
          <GlassCard hover={false} className="flex flex-col gap-4 border border-white/20 dark:border-white/10 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border-subtle)]">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[var(--color-teal-soft)]" />
                <h3 className="text-base font-bold font-display text-[var(--color-text-primary)]">الحجوزات القادمة</h3>
              </div>
              <Link to="/business/bookings">
                <Button variant="ghost" size="sm" icon={ArrowRight}>
                  عرض الكل
                </Button>
              </Link>
            </div>

            {bookings.length === 0 ? (
              <p className="text-xs text-[var(--color-text-muted)] text-center py-6">لا توجد حجوزات طاولات مسجلة.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {bookings.slice(0, 4).map(bk => (
                  <div key={bk.id} className="p-3.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--color-border-subtle)] flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-[var(--color-text-primary)]">{bk.customerName}</p>
                      <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">{bk.date} الساعة {bk.time} ({bk.guests} ضيوف)</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-500/20 text-teal-700 dark:text-teal-300">
                      {bk.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </DashboardLayout>
  );
};
