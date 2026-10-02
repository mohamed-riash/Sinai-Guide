import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { GlassCard } from '../../components/common/GlassCard';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { placeService } from '../../services/placeService';
import { bookingService } from '../../services/bookingService';
import { Calendar, Users, Phone, Clock, FileText } from 'lucide-react';

export const BusinessBookingsPage = () => {
  const { user } = useAuth();
  const place = placeService.getByOwnerId(user?.id, user?.businessId);
  const { toastSuccess } = useToast();

  const [bookings, setBookings] = useState(() => place ? bookingService.getBookingsByPlaceId(place.id) : []);

  const handleStatusChange = (bookingId, newStatus) => {
    bookingService.updateBookingStatus(bookingId, newStatus);
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    toastSuccess(`تم تحديث حالة الحجز إلى ${newStatus}`);
  };

  return (
    <DashboardLayout title="حجوزات الطاولات والتجارب">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">قائمة الحجوزات ({bookings.length})</h2>
          <p className="text-xs text-slate-500">إدارة حجوزات الطاولات واستقبال الضيوف</p>
        </div>

        {bookings.length === 0 ? (
          <GlassCard hover={false} className="text-center py-12 text-slate-400">
            <Calendar className="w-12 h-12 stroke-1 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold">لا توجد حجوزات مسجلة بعد.</p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookings.map(bk => (
              <GlassCard key={bk.id} hover={false} className="flex flex-col gap-3 p-5">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
                  <span className="font-bold text-[var(--color-digital-blue-500)]">{bk.id}</span>
                  <select
                    value={bk.status}
                    onChange={(e) => handleStatusChange(bk.id, e.target.value)}
                    className="py-1 px-2.5 rounded-lg text-xs font-semibold glass-input cursor-pointer"
                  >
                    <option value="pending" className="bg-slate-900 text-amber-400">قيد الانتظار</option>
                    <option value="confirmed" className="bg-slate-900 text-digital-blue-400">تم التأكيد</option>
                    <option value="completed" className="bg-slate-900 text-emerald-400">مكتمل</option>
                    <option value="cancelled" className="bg-slate-900 text-rose-400">ملغي</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5 text-xs text-slate-300">
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{bk.customerName}</p>
                  <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-amber-400" /> {bk.customerPhone}</p>
                  <p className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-digital-blue-400" /> {bk.date} الساعة {bk.time}</p>
                  <p className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-[var(--color-digital-blue-500)]" /> {bk.guests} ضيوف</p>
                  {bk.notes && <p className="italic text-slate-400 mt-1">"{bk.notes}"</p>}
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
