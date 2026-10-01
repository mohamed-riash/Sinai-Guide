import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { GlassCard } from '../../components/common/GlassCard';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { placeService } from '../../services/placeService';
import { orderService } from '../../services/orderService';
import { ShoppingBag, Clock, Phone, MapPin, CheckCircle, XCircle } from 'lucide-react';

export const BusinessOrdersPage = () => {
  const { user } = useAuth();
  const place = placeService.getByOwnerId(user?.id, user?.businessId) || placeService.getById('place-1');
  const { toastSuccess } = useToast();

  const [orders, setOrders] = useState(() => place ? orderService.getOrdersByPlaceId(place.id) : []);

  const handleStatusChange = (orderId, newStatus) => {
    orderService.updateOrderStatus(orderId, newStatus);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    toastSuccess(`تم تحديث حالة الطلب إلى ${newStatus}`);
  };

  return (
    <DashboardLayout title="طلبات العملاء">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-bold font-display text-[var(--color-text-primary)]">الطلبات النشطة ({orders.length})</h2>
          <p className="text-xs text-[var(--color-text-secondary)]">تتبع وإدارة طلبات التوصيل والاستلام من العملاء</p>
        </div>

        {orders.length === 0 ? (
          <GlassCard hover={false} className="text-center py-12 text-[var(--color-text-muted)] border border-white/10">
            <ShoppingBag className="w-12 h-12 stroke-1 mx-auto mb-2 opacity-50 text-[var(--color-terracotta)]" />
            <p className="text-sm font-semibold">لا توجد طلبات واردة بعد.</p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orders.map(order => (
              <GlassCard key={order.id} hover={false} className="flex flex-col gap-3 p-5 border border-white/20 dark:border-white/10 shadow-lg">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border-subtle)] text-xs">
                  <span className="font-bold text-[var(--color-terracotta)]">{order.id}</span>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="py-1 px-2.5 rounded-lg text-xs font-semibold glass-input cursor-pointer"
                  >
                    <option value="pending" className="bg-[var(--color-surface)] text-amber-500">قيد الانتظار</option>
                    <option value="confirmed" className="bg-[var(--color-surface)] text-teal-600 dark:text-teal-300">تم التأكيد</option>
                    <option value="preparing" className="bg-[var(--color-surface)] text-blue-500">قيد التحضير</option>
                    <option value="completed" className="bg-[var(--color-surface)] text-emerald-600 dark:text-emerald-400">مكتمل</option>
                    <option value="cancelled" className="bg-[var(--color-surface)] text-rose-500">ملغي</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1 text-xs text-[var(--color-text-secondary)]">
                  <p className="font-bold text-[var(--color-text-primary)] text-sm">{order.customerName}</p>
                  <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[var(--color-gold)]" /> {order.customerPhone}</p>
                  <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[var(--color-teal-soft)]" /> {order.address}</p>
                  {order.notes && <p className="italic text-[var(--color-text-muted)] mt-1">"{order.notes}"</p>}
                </div>

                <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--color-border-subtle)] flex flex-col gap-1 text-xs my-1">
                  <span className="font-bold text-[var(--color-terracotta)] uppercase text-[10px]">أصناف الطلب:</span>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-[var(--color-text-secondary)] font-medium">
                      <span>{item.name} x{item.quantity}</span>
                      <span>{item.price * item.quantity} ج.م</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border-subtle)] text-xs font-bold">
                  <span className="text-[var(--color-text-muted)]">{new Date(order.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="text-[var(--color-gold)] text-sm">الإجمالي: {order.total} ج.م</span>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

