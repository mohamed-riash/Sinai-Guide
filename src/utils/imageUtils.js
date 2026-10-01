export const responsiveImageSrcSet = (src, widths = [480, 960], quality = 75) => {
  if (!src || src.startsWith('data:')) return undefined;

  try {
    const url = new URL(src);
    if (url.hostname !== 'images.unsplash.com') return undefined;
    return widths.map((width) => {
      const candidate = new URL(url);
      candidate.searchParams.set('fit', 'crop');
      candidate.searchParams.set('w', String(width));
      candidate.searchParams.set('q', String(quality));
      return `${candidate.toString()} ${width}w`;
    }).join(', ');
  } catch {
    return undefined;
  }
};

export const validateImage = (file) => {
  if (!file) return { valid: false, message: 'لم يتم اختيار أي ملف' };
  
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return { valid: false, message: 'يرجى اختيار صورة بتنسيق (JPG, PNG, WebP) فقط' };
  }

  // 5MB Max upload limit
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, message: 'حجم الصورة كبير جداً. الحد الأقصى المسموح به هو 5 ميجابايت' };
  }

  return { valid: true };
};

export const compressAndReadImage = (file, maxWidth = 1000, maxHeight = 1000, quality = 0.82) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('فشل قراءة ملف الصورة'));

    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('فشل تحميل الصورة للتصغير'));

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to compact JPEG/WebP Data URL string for LocalStorage
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  });
};
