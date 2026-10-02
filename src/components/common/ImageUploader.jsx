import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Image as ImageIcon, Trash2, RefreshCw, Loader2, Check } from 'lucide-react';
import { validateImage, compressAndReadImage } from '../../utils/imageUtils';
import { useToast } from '../../hooks/useToast';

export const ImageUploader = ({
  value,
  onChange,
  onRemove,
  label = 'صورة الغلاف / الصورة الشخصية',
  hint = 'اختر صورة بتنسيق (JPG, PNG, WebP) - الحد الأقصى 5 ميجابايت',
  aspectRatio = 'aspect-[16/9]',
  className = '',
}) => {
  const { toastError, toastSuccess } = useToast();
  const fileInputRef = useRef(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = async (file) => {
    if (!file) return;

    const validation = validateImage(file);
    if (!validation.valid) {
      toastError(validation.message);
      return;
    }

    setIsCompressing(true);
    try {
      // Compress and convert to compact Base64 Data URL for LocalStorage
      const base64Image = await compressAndReadImage(file, 1200, 1200, 0.82);
      onChange(base64Image);
      toastSuccess('تم ضغط وتحميل الصورة بنجاح!');
    } catch (err) {
      toastError(err.message || 'فشل في معالجة وتحميل الصورة.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove();
    } else {
      onChange('');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
          {label}
        </label>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
        className="hidden"
      />

      {value ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`relative w-full ${aspectRatio} rounded-2xl overflow-hidden glass-card border border-white/20 dark:border-white/10 group shadow-lg`}
        >
          <img
            src={value}
            alt="معاينة الصورة"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />

          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-xs">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer backdrop-blur-md"
            >
              <RefreshCw className="w-4 h-4" />
              <span>تغيير الصورة</span>
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-4 py-2.5 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer backdrop-blur-md"
            >
              <Trash2 className="w-4 h-4" />
              <span>حذف</span>
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`w-full ${aspectRatio} rounded-2xl glass-input border-2 border-dashed flex flex-col items-center justify-center gap-3 p-6 text-center cursor-pointer transition-all ${
            isDragOver
              ? 'border-[var(--color-digital-blue-500)] bg-[var(--color-digital-blue-500)]/10'
              : 'border-[var(--color-border-light)] hover:border-[var(--color-digital-blue-500)]/50'
          }`}
        >
          {isCompressing ? (
            <div className="flex flex-col items-center gap-2 text-[var(--color-digital-blue-500)]">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-xs font-bold">جاري ضغط ومعالجة الصورة...</span>
            </div>
          ) : (
            <>
              <div className="p-3 rounded-2xl bg-[var(--color-digital-blue-500)]/15 text-[var(--color-digital-blue-500)]">
                <UploadCloud className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--color-text-primary)]">
                  انقر لاختيار صورة من جهازك أو اسحبها هنا
                </p>
                {hint && (
                  <p className="text-xs text-[var(--color-text-muted)] mt-1 font-medium">
                    {hint}
                  </p>
                )}
              </div>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
};
