import { useEffect } from 'react';
import { useToast } from '../../hooks/useToast';

export const PWAStatus = () => {
  const { toastWarning, toastSuccess } = useToast();

  useEffect(() => {
    const offline = () => toastWarning('أنت غير متصل بالإنترنت. بعض الميزات قد لا تكون متاحة حالياً.');
    const online = () => toastSuccess('تم استعادة الاتصال بالإنترنت.');
    window.addEventListener('offline', offline);
    window.addEventListener('online', online);
    return () => {
      window.removeEventListener('offline', offline);
      window.removeEventListener('online', online);
    };
  }, [toastSuccess, toastWarning]);

  return null;
};
