import React, { useState } from 'react';
import { X, Calendar, Clock, Users, User, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { AnimatedActionButton } from '../common/AnimatedActionButton';
import { bookingService } from '../../services/bookingService';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../hooks/useAuth';

export const BookingModal = ({ place, isOpen, onClose }) => {
  const { user } = useAuth();
  const { toastSuccess, toastError } = useToast();

  const [date, setDate] = useState(() => new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [time, setTime] = useState('19:00');
  const [guests, setGuests] = useState(2);
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerName.trim()) {
      toastError('يرجى إدخال اسمك الكامل.');
      return;
    }
    if (!customerPhone.trim()) {
      toastError('يرجى إدخال رقم هاتف للتواصل.');
      return;
    }

    setLoading(true);
    try {
      bookingService.createBooking({
        placeId: place.id,
        placeName: place.name,
        date,
        time,
        guests: Number(guests),
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        notes: notes.trim()
      });

      setLoading(false);
      setSuccess(true);
      toastSuccess(`تم إرسال طلب الحجز بنجاح إلى ${place.nameAr || place.name}!`);

      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1100);
    } catch (err) {
      setLoading(false);
      setSuccess(false);
      toastError(err.message || 'فشل في إرسال طلب الحجز.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && place && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/65 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-lg glass-l3 p-5 sm:p-8 text-right text-slate-100 shadow-2xl border border-white/20 dark:border-white/10 rounded-3xl overflow-y-auto max-h-[calc(100dvh-2rem)]"
          >
            <button
              onClick={onClose}
              className="absolute top-5 left-5 p-1 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-[#A85F48]/20 text-[#A85F48]">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black font-display text-white">احجز تجربتك</h3>
                <p className="text-xs text-slate-300 font-bold">{place.nameAr || place.name}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="تاريخ الحجز"
                  type="date"
                  icon={Calendar}
                  value={date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
                <Input
                  label="وقت الحجز"
                  type="time"
                  icon={Clock}
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  عدد الضيوف
                </label>
                <div className="relative flex items-center">
                  <Users className="w-4 h-4 text-[#A85F48] absolute right-3.5 pointer-events-none" />
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full py-2.5 pr-10 pl-4 rounded-xl text-sm glass-input cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15].map(num => (
                      <option key={num} value={num} className="bg-slate-900 text-white">
                        {num} {num === 1 ? 'ضيف' : 'ضيوف'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Input
                label="اسم العميل"
                icon={User}
                placeholder="اسمك الكامل"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />

              <Input
                label="رقم الهاتف"
                icon={Phone}
                placeholder="+20 10 XXXX XXXX"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  طلبات خاصة / ملاحظات (اختياري)
                </label>
                <div className="relative">
                  <textarea
                    rows="3"
                    placeholder="مثال: طاولة مطلة على البحر، مناسبة عيد ميلاد..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full py-2.5 px-3.5 rounded-xl text-sm glass-input focus:outline-none focus:border-[#A85F48]"
                  />
                </div>
              </div>

              {/* Booking Summary Box */}
              <div className="p-4 rounded-2xl glass-l1 border border-white/10 text-xs flex flex-col gap-1.5 my-2">
                <div className="flex justify-between font-bold text-slate-200">
                  <span>الموقع:</span>
                  <span>{place.address}</span>
                </div>
                <div className="flex justify-between text-slate-300 font-semibold">
                  <span>التاريخ والوقت:</span>
                  <span>{date} الساعة {time} ({guests} ضيوف)</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={onClose}>
                  إلغاء
                </Button>
                <AnimatedActionButton
                  type="submit"
                  label="تأكيد الحجز"
                  successLabel="تم تأكيد الحجز"
                  loadingLabel="جاري تأكيد الحجز..."
                  icon="calendar"
                  loading={loading}
                  success={success}
                  fullWidth={false}
                  className="px-6 font-bold"
                />
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
