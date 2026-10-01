import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, MapPin, Map as MapIcon, Compass, Check, AlertCircle, Loader2 } from 'lucide-react';
import { Input } from './Input';
import { Button } from './Button';
import { useToast } from '../../hooks/useToast';

const createPickerPin = () => {
  return L.divIcon({
    className: 'custom-leaflet-picker-pin',
    html: `<div style="background-color: #A85F48; color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 16px rgba(0,0,0,0.4); border: 3px solid white; transform: translate(-50%, -50%);">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
    </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

// Component to handle map clicks and marker updates
const MapClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

export const LocationPicker = ({
  address = '',
  latitude = 31.1350,
  longitude = 33.7990,
  onChange,
  className = '',
}) => {
  const { toastSuccess, toastError, toastInfo } = useToast();

  const [currentAddress, setCurrentAddress] = useState(address);
  const [currentLat, setCurrentLat] = useState(latitude || 31.1350);
  const [currentLng, setCurrentLng] = useState(longitude || 33.7990);
  const [activeTab, setActiveTab] = useState('current'); // 'current' | 'map' | 'manual'
  const [isLocating, setIsLocating] = useState(false);

  // Update parent when any value changes
  const updateParentLocation = (newAddr, newLat, newLng) => {
    setCurrentAddress(newAddr);
    setCurrentLat(newLat);
    setCurrentLng(newLng);

    if (onChange) {
      onChange({
        address: newAddr,
        latitude: newLat,
        longitude: newLng,
        coordinates: { lat: newLat, lng: newLng }
      });
    }
  };

  // Option 1: Geolocation API
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toastError('متصفحك لا يدعم خاصية تحديد الموقع الجغرافي.');
      return;
    }

    setIsLocating(true);
    toastInfo('جاري تحديد موقعك الجغرافي الحالي...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const detectedAddress = currentAddress || `موقع مبدئي (${lat.toFixed(4)}, ${lng.toFixed(4)}) - العريش، شمال سيناء`;
        
        updateParentLocation(detectedAddress, lat, lng);
        setIsLocating(false);
        toastSuccess('تم تحديد موقعك الحالي بنجاح!');
      },
      (error) => {
        setIsLocating(false);
        let msg = 'تعذر الحصول على موقعك الجغرافي.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'تم رفض الإذن للوصول إلى الموقع الجغرافي في متصفحك.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'معلومات الموقع الجغرافي غير متوفرة حالياً.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'انتهت مهلة طلب تحديد الموقع.';
        }
        toastError(msg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Option 2: Map click selection
  const handleMapSelect = (lat, lng) => {
    const formattedAddr = currentAddress || `موقع على الخريطة (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
    updateParentLocation(formattedAddr, lat, lng);
    toastSuccess('تم تحديث الموقع من الخريطة!');
  };

  // Option 3: Manual address text change
  const handleAddressChange = (e) => {
    const newAddr = e.target.value;
    updateParentLocation(newAddr, currentLat, currentLng);
  };

  return (
    <div className={`glass-panel p-3 sm:p-5 flex flex-col gap-4 border border-white/20 dark:border-white/10 rounded-3xl ${className}`}>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
          تحديد موقع النشاط التجاري (اختر طريقة التحديد)
        </label>
        <p className="text-xs text-[var(--color-text-muted)] font-medium">
          يمكنك استخدام موقعك الحالي، أو النقر على الخريطة التفاعلية، أو إدخال النص يدوياً
        </p>
      </div>

      {/* Option Selector Tabs */}
      <div className="grid grid-cols-3 gap-2 bg-black/5 dark:bg-white/5 p-1.5 rounded-2xl border border-[var(--color-border-subtle)]">
        <button
          type="button"
          onClick={() => setActiveTab('current')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'current'
              ? 'bg-[#A85F48] text-white shadow-md'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>الموقع الحالي</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('map')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'map'
              ? 'bg-[#A85F48] text-white shadow-md'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <MapIcon className="w-3.5 h-3.5" />
          <span>من الخريطة</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('manual')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'manual'
              ? 'bg-[#A85F48] text-white shadow-md'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>عنوان يدوي</span>
        </button>
      </div>

      {/* Option Views */}
      <AnimatePresence mode="wait">
        {activeTab === 'current' && (
          <motion.div
            key="current"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-3 p-4 rounded-2xl glass-l1 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-text-primary)]">
                <Navigation className="w-4 h-4 text-[#A85F48]" />
                <span>تحديد الموقع عبر GPS الجوال / الجهاز</span>
              </div>
              <Button
                type="button"
                variant="primary"
                size="sm"
                isLoading={isLocating}
                icon={Compass}
                onClick={handleGetCurrentLocation}
                className="font-bold"
              >
                استخدم موقعي الحالي
              </Button>
            </div>

            {currentLat && currentLng && (
              <div className="text-xs text-[var(--color-text-secondary)] flex items-center gap-2 pt-2 border-t border-[var(--color-border-subtle)]">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>الموقع المحدد: الإحداثيات ({currentLat.toFixed(4)}, {currentLng.toFixed(4)})</span>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'map' && (
          <motion.div
            key="map"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-3"
          >
            <p className="text-xs text-[var(--color-text-secondary)] font-medium">
              انقر على أي نقطة في الخريطة أدناه لتثبيت دبوس موقع المكان:
            </p>
            <div className="w-full h-[240px] rounded-2xl overflow-hidden shadow-inner border border-white/20 relative">
              <MapContainer
                center={[currentLat, currentLng]}
                zoom={13}
                scrollWheelZoom={false}
                className="w-full h-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapClickHandler onLocationSelect={handleMapSelect} />
                <Marker position={[currentLat, currentLng]} icon={createPickerPin()} />
              </MapContainer>
            </div>
          </motion.div>
        )}

        {activeTab === 'manual' && (
          <motion.div
            key="manual"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-3"
          >
            <Input
              label="العنوان التفصيلي"
              icon={MapPin}
              placeholder="مثال: شارع 23 يوليو، بجوار الكورنيش، العريش، شمال سيناء"
              value={currentAddress}
              onChange={handleAddressChange}
              required
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual Address Input always visible below to allow combining text with coordinates */}
      {activeTab !== 'manual' && (
        <Input
          label="العنوان النصي القابل للقراءة"
          icon={MapPin}
          placeholder="مثال: كورنيش العريش، شمال سيناء"
          value={currentAddress}
          onChange={handleAddressChange}
          required
        />
      )}
    </div>
  );
};
