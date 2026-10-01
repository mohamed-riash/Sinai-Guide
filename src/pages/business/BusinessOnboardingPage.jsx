import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Store, Phone, MessageSquare, Clock, CheckCircle2, DollarSign } from 'lucide-react';
import { Container } from '../../components/common/Container';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { ImageUploader } from '../../components/common/ImageUploader';
import { LocationPicker } from '../../components/common/LocationPicker';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { placeService } from '../../services/placeService';
import { CITIES } from '../../data/cities';
import { CATEGORIES } from '../../data/categories';

export const BusinessOnboardingPage = () => {
  const { user, updateProfile } = useAuth();
  const { toastSuccess, toastError } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('restaurant');
  const [city, setCity] = useState('arish');
  
  // Real Price Range
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Location Picker Options
  const [locationData, setLocationData] = useState({
    address: '',
    latitude: 31.1350,
    longitude: 33.7990,
  });

  // Working Hours Time Range
  const [openingTime, setOpeningTime] = useState('10:00');
  const [closingTime, setClosingTime] = useState('23:00');

  const [phone, setPhone] = useState(user?.phone || '');
  const [whatsapp, setWhatsapp] = useState(user?.phone?.replace(/[^0-9]/g, '') || '');
  const [description, setDescription] = useState('');
  
  // Device Image Uploads
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toastError('يرجى إدخال اسم النشاط التجاري.');
      return;
    }

    if (!locationData.address.trim() || minPrice === '' || maxPrice === '') {
      toastError('Please provide the actual address and price range.');
      return;
    }

    if (Number(minPrice) < 0) {
      toastError('الحد الأدنى للسعر لا يمكن أن يكون سالباً.');
      return;
    }

    if (Number(maxPrice) < Number(minPrice)) {
      toastError('الحد الأقصى للسعر يجب أن يكون أكبر من أو يساوي الحد الأدنى.');
      return;
    }

    if (!image) {
      toastError('يرجى اختيار صورة للغلاف من جهازك.');
      return;
    }

    setLoading(true);
    try {
      const currentOwnerId = user?.id || `user-${Date.now()}`;
      
      // Create place record with status: pending
      const newPlace = placeService.create({
        name: name.trim(),
        nameAr: name.trim(),
        cityId: city,
        categoryId: category,
        minPrice: Number(minPrice),
        maxPrice: Number(maxPrice),
        priceRange: `${minPrice} – ${maxPrice} ج.م`,
        location: locationData,
        address: locationData.address,
        coordinates: { lat: locationData.latitude, lng: locationData.longitude },
        openingTime,
        closingTime,
        openingHours: `${openingTime} — ${closingTime}`,
        phone: phone.trim(),
        whatsapp: whatsapp.trim(),
        description: description.trim(),
        image,
        gallery: [image],
        hasOrdering: category === 'restaurant' || category === 'cafe',
        hasBooking: true,
        ownerId: currentOwnerId,
        status: 'pending' // Moderation Status
      });

      if (user && updateProfile) {
        await updateProfile({
          ...user,
          businessId: newPlace.id,
          ownerId: currentOwnerId,
          role: 'business_owner'
        });
      }

      toastSuccess('تم تقديم طلب تسجيل المكان بنجاح! وستتم مراجعته من الإدارة قبل النشر.');
      navigate('/business/dashboard');
    } catch (err) {
      toastError(err.message || 'فشل في تسجيل النشاط التجاري.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 flex items-center justify-center min-h-[85vh] w-full" dir="rtl">
      <Container className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-panel p-4 sm:p-10 flex flex-col gap-8 border border-white/20 dark:border-white/10 shadow-2xl rounded-3xl w-full"
        >
          <div className="flex flex-col gap-2 text-right">
            <span className="text-xs font-black uppercase tracking-widest text-[#A85F48]">معالج التسجيل والتقديم</span>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-[var(--color-text-primary)]">
              سجّل نشاطك التجاري في دليل سيناء
            </h1>
            <p className="text-xs sm:text-sm font-medium text-[var(--color-text-secondary)] leading-relaxed">
              أكمل بيانات متجرك بنطاق الأسعار الحقيقي والموقع الجغرافي الدقيق لتقديم طلب إضافة المكان واعتماده.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-right">
            {/* Basic Information */}
            <div className="flex flex-col gap-4">
              <h3 className="text-base font-bold font-display text-[var(--color-text-primary)] pb-2 border-b border-[var(--color-border-subtle)]">
                البيانات الأساسية
              </h3>

              <Input
                label="اسم النشاط التجاري"
                icon={Store}
                placeholder="مثال: مطعم وشاطئ النخيل بالعريش"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="التصنيف"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  options={CATEGORIES.map(c => ({ value: c.id, label: c.name }))}
                />
                <Select
                  label="المدينة"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  options={CITIES.map(c => ({ value: c.id, label: c.name }))}
                />
              </div>
            </div>

            {/* Real Price Range */}
            <div className="flex flex-col gap-4">
              <h3 className="text-base font-bold font-display text-[var(--color-text-primary)] pb-2 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
                <span>نطاق الأسعار الحقيقي (بالجنيه المصري)</span>
                <span className="text-xs font-semibold text-[var(--color-gold)]">{minPrice} – {maxPrice} ج.م</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="الحد الأدنى للسعر (ج.م)"
                  type="number"
                  min="0"
                  icon={DollarSign}
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  required
                />
                <Input
                  label="الحد الأقصى للسعر (ج.م)"
                  type="number"
                  min="0"
                  icon={DollarSign}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Location Picker (3 Options) */}
            <LocationPicker
              address={locationData.address}
              latitude={locationData.latitude}
              longitude={locationData.longitude}
              onChange={setLocationData}
            />

            {/* Working Hours Time Inputs */}
            <div className="flex flex-col gap-4">
              <h3 className="text-base font-bold font-display text-[var(--color-text-primary)] pb-2 border-b border-[var(--color-border-subtle)] flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal-500" />
                <span>مواعيد العمل اليومية</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="وقت الفتح (من)"
                  type="time"
                  value={openingTime}
                  onChange={(e) => setOpeningTime(e.target.value)}
                  required
                />
                <Input
                  label="وقت الإغلاق (إلى)"
                  type="time"
                  value={closingTime}
                  onChange={(e) => setClosingTime(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Phone & WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="رقم الهاتف" icon={Phone} value={phone} onChange={(e) => setPhone(e.target.value)} required />
              <Input label="رقم واتساب" icon={MessageSquare} value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required />
            </div>

            {/* Upload Cover Image */}
            <ImageUploader
              label="صورة غلاف النشاط التجاري"
              hint="اختر صورة غلاف واضحة من جهازك"
              value={image}
              onChange={setImage}
            />

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                وصف النشاط التجاري
              </label>
              <textarea
                rows="4"
                placeholder="صِف أطباقك المميزة، الأجواء، الإطلالة، والتخصصات..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-4 rounded-2xl text-sm glass-input text-[var(--color-text-primary)] focus:outline-none focus:border-[#A85F48]"
              />
            </div>

            <Button type="submit" variant="primary" size="lg" isLoading={loading} icon={CheckCircle2} className="py-4 mt-2 font-bold text-base shadow-xl">
              تقديم طلب إضافة المكان للمراجعة
            </Button>
          </form>
        </motion.div>
      </Container>
    </div>
  );
};
