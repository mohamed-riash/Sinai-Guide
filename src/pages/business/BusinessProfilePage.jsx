import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
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
import { Save, Store, Phone, MessageSquare, Clock, DollarSign, AlertCircle } from 'lucide-react';

export const BusinessProfilePage = () => {
  const { user } = useAuth();
  const place = placeService.getByOwnerId(user?.id, user?.businessId);
  const { toastSuccess, toastError, toastInfo } = useToast();

  const [name, setName] = useState(place?.name || '');
  const [nameAr, setNameAr] = useState(place?.nameAr || place?.name || '');
  const [cityId, setCityId] = useState(place?.cityId || 'arish');
  const [categoryId, setCategoryId] = useState(place?.categoryId || 'restaurant');

  // Real Price Range
  const [minPrice, setMinPrice] = useState(place?.minPrice ?? 100);
  const [maxPrice, setMaxPrice] = useState(place?.maxPrice ?? 350);

  // Location Data Picker
  const [locationData, setLocationData] = useState({
    address: place?.location?.address || place?.address || 'كورنيش العريش، شمال سيناء',
    latitude: place?.location?.latitude || place?.coordinates?.lat || 31.1350,
    longitude: place?.location?.longitude || place?.coordinates?.lng || 33.7990,
  });

  // Working Hours Time Range
  const [openingTime, setOpeningTime] = useState(place?.openingTime || '10:00');
  const [closingTime, setClosingTime] = useState(place?.closingTime || '23:00');

  const [phone, setPhone] = useState(place?.phone || '+20 10 1234 5678');
  const [whatsapp, setWhatsapp] = useState(place?.whatsapp || '201012345678');
  const [description, setDescription] = useState(place?.description || '');
  const [image, setImage] = useState(place?.image || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!place || !place.id) {
      toastError('لم يتم العثور على النشاط التجاري المرتبط بحسابك.');
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
      // If place was rejected, update status to pending for admin re-review
      const newStatus = place.status === 'rejected' ? 'pending' : place.status || 'pending';

      placeService.update(place.id, {
        name,
        nameAr,
        cityId,
        categoryId,
        minPrice: Number(minPrice),
        maxPrice: Number(maxPrice),
        priceRange: `${minPrice} – ${maxPrice} ج.م`,
        location: locationData,
        address: locationData.address,
        coordinates: { lat: locationData.latitude, lng: locationData.longitude },
        openingTime,
        closingTime,
        openingHours: `${openingTime} — ${closingTime}`,
        phone,
        whatsapp,
        description,
        image,
        status: newStatus
      });

      if (newStatus === 'pending' && place.status === 'rejected') {
        toastInfo('تمت إعادة إرسال طلب اعتماد بيانات المكان إلى الإدارة للمراجعة.');
      } else {
        toastSuccess('تم تحديث بيانات وموقع النشاط التجاري بنجاح!');
      }
    } catch (err) {
      toastError(err.message || 'فشل في تحديث الملف التجاري.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="تعديل الملف التجاري">
      <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 flex flex-col gap-6 max-w-3xl border border-white/20 dark:border-white/10 shadow-2xl rounded-3xl">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border-subtle)]">
          <h3 className="text-lg font-black font-display text-[var(--color-text-primary)]">
            إدارة وتحديث بيانات النشاط التجاري
          </h3>

          {place?.status && (
            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
              place.status === 'pending' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' :
              place.status === 'rejected' ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30' :
              'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
            }`}>
              {place.status === 'pending' ? 'قيد المراجعة' : place.status === 'rejected' ? 'مرفوض' : 'معتمد ومقبول'}
            </span>
          )}
        </div>

        {/* Basic Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="اسم النشاط (إنجليزي)" icon={Store} value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="اسم النشاط (عربي)" value={nameAr} onChange={(e) => setNameAr(e.target.value)} required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select label="المدينة" value={cityId} onChange={(e) => setCityId(e.target.value)} options={CITIES.map(c => ({ value: c.id, label: c.name }))} />
          <Select label="التصنيف" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} options={CATEGORIES.map(c => ({ value: c.id, label: c.name }))} />
        </div>

        {/* Real Price Range Inputs */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
            نطاق الأسعار الحقيقي (بالجنيه المصري): <span className="text-[var(--color-gold)] font-extrabold">{minPrice} – {maxPrice} ج.م</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="الحد الأدنى للسعر (ج.م)" type="number" min="0" icon={DollarSign} value={minPrice} onChange={(e) => setMinPrice(e.target.value)} required />
            <Input label="الحد الأقصى للسعر (ج.م)" type="number" min="0" icon={DollarSign} value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} required />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="وقت الفتح (من)" type="time" icon={Clock} value={openingTime} onChange={(e) => setOpeningTime(e.target.value)} required />
          <Input label="وقت الإغلاق (إلى)" type="time" icon={Clock} value={closingTime} onChange={(e) => setClosingTime(e.target.value)} required />
        </div>

        {/* Contact Numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="رقم الهاتف" icon={Phone} value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <Input label="رقم واتساب" icon={MessageSquare} value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required />
        </div>

        {/* Device Image Uploader */}
        <ImageUploader
          label="صورة الغلاف"
          hint="اختر صورة غلاف جديدة من جهازك"
          value={image}
          onChange={setImage}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
            وصف النشاط
          </label>
          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 rounded-2xl text-sm glass-input text-[var(--color-text-primary)] focus:outline-none focus:border-[#A85F48]"
            required
          />
        </div>

        <div className="pt-4 flex justify-end">
          <Button type="submit" variant="primary" isLoading={loading} icon={Save} className="py-3.5 px-8 font-bold text-sm shadow-xl">
            حفظ التغييرات
          </Button>
        </div>
      </form>
    </DashboardLayout>
  );
};
