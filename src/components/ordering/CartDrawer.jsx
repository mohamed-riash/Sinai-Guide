import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, User, Phone, MapPin, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Input } from '../common/Input';
import { AnimatedActionButton } from '../common/AnimatedActionButton';
import { orderService } from '../../services/orderService';

export const CartDrawer = () => {
  const { cart, isOpen, setIsOpen, updateQuantity, clearCart, subtotal, deliveryFee, total } = useCart();
  const { user } = useAuth();
  const { toastSuccess, toastError, toastWarning } = useToast();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (cart.items.length === 0) {
      toastWarning('سلة الطلبات فارغة.');
      return;
    }

    if (!customerName.trim()) {
      toastError('يرجى إدخال اسمك للتوصيل.');
      return;
    }

    if (!customerPhone.trim()) {
      toastError('يرجى إدخال رقم هاتفك للتوصيل.');
      return;
    }

    if (!address.trim()) {
      toastError('يرجى إدخال عنوان التوصيل.');
      return;
    }

    setIsSubmitting(true);
    try {
      const placeId = cart.place?.id;
      const placeName = cart.place?.name || cart.place?.nameAr || '';
      const placeWhatsapp = cart.place?.whatsapp;

      if (!placeId) {
        toastError('لم يتم تحديد المطعم. يرجى إضافة اصناف من قائمة المكان أولاً.');
        setIsSubmitting(false);
        return;
      }

      const order = orderService.createOrder({
        placeId,
        placeName,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        address: address.trim(),
        notes: notes.trim(),
        items: cart.items,
        subtotal,
        deliveryFee,
        total
      });

      const whatsappUrl = placeWhatsapp ? orderService.generateWhatsAppOrderUrl(order, placeWhatsapp) : null;

      // Trigger success state animation
      setIsSubmitting(false);
      setIsSuccess(true);
      toastSuccess('تم إرسال الطلب بنجاح! جارٍ التوجيه لواتساب...');

      setTimeout(() => {
        clearCart();
        setIsOpen(false);
        setIsSuccess(false);

        if (whatsappUrl) {
          window.open(whatsappUrl, '_blank');
        }
      }, 1100);
    } catch (err) {
      setIsSubmitting(false);
      setIsSuccess(false);
      toastError(err.message || 'فشل في تقديم الطلب.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-start">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/65 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="relative z-10 w-full max-w-md glass-l3 h-full p-6 flex flex-col justify-between border-r border-white/20 dark:border-white/10 text-slate-100 shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[var(--color-digital-blue-500)]/20 text-[var(--color-digital-blue-500)]">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display text-white">طلبك</h3>
                  <p className="text-xs text-slate-300 truncate max-w-[200px]">{cart.place?.name || 'لم يتم اختيار مطعم'}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 py-4 flex flex-col gap-3">
              {cart.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-16 text-slate-300">
                  <ShoppingBag className="w-14 h-14 stroke-1 mb-3 opacity-40 text-[var(--color-digital-blue-500)]" />
                  <p className="text-sm font-bold">سلة الطلبات فارغة حالياً</p>
                  <p className="text-xs text-slate-400 mt-1">أضف اصناف أو منتجات من قائمة المكان.</p>
                </div>
              ) : (
                cart.items.map((item) => (
                  <div key={item.id} className="p-3.5 rounded-2xl glass-l1 border border-white/15 flex items-center justify-between gap-3 shadow-sm">
                    <div className="flex items-center gap-3 min-w-0">
                      {item.image && (
                        <img src={item.image} alt={item.name} width="48" height="48" loading="lazy" className="w-12 h-12 rounded-xl object-cover shrink-0" />
                      )}
                      <div className="truncate">
                        <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                        <p className="text-xs text-[var(--color-digital-blue-500)] font-extrabold mt-0.5">{item.price * item.quantity} ج.م</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-xl shrink-0 border border-white/10">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:text-[var(--color-digital-blue-500)] transition text-slate-300"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:text-[var(--color-digital-blue-500)] transition text-slate-300"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}

              {cart.items.length > 0 && (
                <form onSubmit={handleCheckout} className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-digital-blue-400)]">معلومات التوصيل</h4>
                  <Input
                    label="الاسم الكامل"
                    icon={User}
                    size="sm"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                  <Input
                    label="رقم الهاتف"
                    icon={Phone}
                    size="sm"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                  />
                  <Input
                    label="عنوان التوصيل"
                    icon={MapPin}
                    size="sm"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                  <Input
                    label="ملاحظات على الطلب (اختياري)"
                    icon={MessageSquare}
                    size="sm"
                    placeholder="اضافات اخرى..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />

                  {/* Order Calculations */}
                  <div className="p-4 rounded-2xl glass-l1 border border-white/10 flex flex-col gap-2 text-xs my-2">
                    <div className="flex justify-between text-slate-300 font-semibold">
                      <span>المجموع الفرعي:</span>
                      <span>{subtotal} ج.م</span>
                    </div>
                    <div className="flex justify-between text-slate-300 font-semibold">
                      <span>رسوم التوصيل:</span>
                      <span>{deliveryFee == null ? 'غير محددة' : `${deliveryFee} ج.م`}</span>
                    </div>
                    <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-white/10">
                      <span>إجمالي الطلب:</span>
                      <span className="text-[var(--color-digital-blue-300)]">{total} ج.م</span>
                    </div>
                  </div>

                  <AnimatedActionButton
                    type="submit"
                    label="تأكيد الطلب وإرساله"
                    successLabel="تم إرسال الطلب بنجاح"
                    loadingLabel="جاري معالجة الطلب..."
                    icon="send"
                    loading={isSubmitting}
                    success={isSuccess}
                    fullWidth
                    className="mt-2"
                  />
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
