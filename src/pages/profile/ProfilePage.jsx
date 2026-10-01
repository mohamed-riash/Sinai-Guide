import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Container } from '../../components/common/Container';
import { GlassCard } from '../../components/common/GlassCard';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ImageUploader } from '../../components/common/ImageUploader';
import { UserAvatar } from '../../components/common/UserAvatar';
import { orderService } from '../../services/orderService';
import { bookingService } from '../../services/bookingService';
import { User, Phone, Mail, ShoppingBag, Calendar, Save } from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { toastSuccess, toastError } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('profile');

  const orders = user?.phone ? orderService.getOrdersByCustomerPhone(user.phone) : [];
  const bookings = bookingService.getBookings().filter(b => b.customerPhone === user?.phone);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({ name, email, phone, avatar });
      toastSuccess('تم تحديث بيانات وملف الصورة الشخصية بنجاح!');
    } catch (err) {
      toastError(err.message || 'فشل في تحديث الملف الشخصي.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 flex flex-col gap-8">
      <Container className="max-w-4xl">
        {/* Profile Card Header */}
        <div className="glass-card p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 border border-white/20 dark:border-white/10 mb-6 shadow-xl">
          <UserAvatar src={avatar || user?.avatar} name={user?.name} className="w-24 h-24 rounded-3xl object-cover border-2 border-[var(--color-terracotta)] shadow-xl shrink-0" />
          <div className="flex flex-col text-center sm:text-right gap-1">
            <h1 className="text-2xl font-bold font-display text-[var(--color-text-primary)]">{user?.name}</h1>
            <p className="text-xs text-[var(--color-text-secondary)]">{user?.email} • {user?.phone}</p>
            <span className="inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--color-terracotta)]/15 text-[var(--color-terracotta)] self-center sm:self-start">
              {user?.role?.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[var(--color-border-subtle)] mb-6 pb-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'profile' ? 'bg-[var(--color-terracotta)] text-white shadow-md' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            تعديل الملف الشخصي
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'orders' ? 'bg-[var(--color-terracotta)] text-white shadow-md' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>سجل الطلبات ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'bookings' ? 'bg-[var(--color-terracotta)] text-white shadow-md' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>الحجوزات ({bookings.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <form onSubmit={handleUpdate} className="glass-card p-6 sm:p-8 flex flex-col gap-6 border border-white/20 dark:border-white/10 shadow-lg">
            <h3 className="text-lg font-bold font-display text-[var(--color-text-primary)]">إعدادات الحساب والصورة الشخصية</h3>
            
            {/* Device Image Uploader for User Avatar */}
            <ImageUploader
              label="تغيير الصورة الشخصية"
              hint="اختر صورة شخصية جديدة من جهازك"
              aspectRatio="aspect-square max-w-[200px]"
              value={avatar}
              onChange={setAvatar}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="الاسم الكامل" icon={User} value={name} onChange={(e) => setName(e.target.value)} required />
              <Input label="البريد الإلكتروني" icon={Mail} value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <Input label="رقم الهاتف" icon={Phone} value={phone} onChange={(e) => setPhone(e.target.value)} required />
            
            <div className="pt-4 flex justify-end">
              <Button type="submit" variant="primary" isLoading={loading} icon={Save} className="py-3.5 px-6 font-bold">
                حفظ التغييرات
              </Button>
            </div>
          </form>
        )}

        {activeTab === 'orders' && (
          <div className="flex flex-col gap-4">
            {orders.length === 0 ? (
              <p className="text-sm text-[var(--color-text-muted)] text-center py-8">لا توجد طلبات طعام بعد.</p>
            ) : (
              orders.map(ord => (
                <GlassCard key={ord.id} className="p-4 flex flex-col gap-2 border border-white/10">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-[var(--color-terracotta)]">{ord.id} • {ord.placeName}</span>
                    <span className="capitalize px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">{ord.status}</span>
                  </div>
                  <div className="text-xs text-[var(--color-text-secondary)]">
                    {ord.items.map((i, idx) => (
                      <span key={idx}>{i.name} x{i.quantity}{idx < ord.items.length - 1 ? ', ' : ''}</span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-[var(--color-border-subtle)] text-xs font-bold">
                    <span className="text-[var(--color-text-muted)]">{new Date(ord.createdAt).toLocaleDateString('ar-EG')}</span>
                    <span className="text-[var(--color-gold)]">الإجمالي: {ord.total} ج.م</span>
                  </div>
                </GlassCard>
              ))
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="flex flex-col gap-4">
            {bookings.length === 0 ? (
              <p className="text-sm text-[var(--color-text-muted)] text-center py-8">لا توجد حجوزات بعد.</p>
            ) : (
              bookings.map(bk => (
                <GlassCard key={bk.id} className="p-4 flex flex-col gap-2 border border-white/10">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-[var(--color-terracotta)]">{bk.placeName}</span>
                    <span className="capitalize px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-700 dark:text-teal-300">{bk.status}</span>
                  </div>
                  <div className="text-xs text-[var(--color-text-secondary)]">
                    التاريخ: {bk.date} الساعة {bk.time} ({bk.guests} ضيوف)
                  </div>
                </GlassCard>
              ))
            )}
          </div>
        )}
      </Container>
    </div>
  );
};
