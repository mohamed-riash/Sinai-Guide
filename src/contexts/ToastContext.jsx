import React, { createContext, useState, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

export const ToastContext = createContext();
let nextToastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++nextToastId;
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  const toastSuccess = useCallback((msg) => addToast(msg, 'success'), [addToast]);
  const toastError = useCallback((msg) => addToast(msg, 'error'), [addToast]);
  const toastWarning = useCallback((msg) => addToast(msg, 'warning'), [addToast]);
  const toastInfo = useCallback((msg) => addToast(msg, 'info'), [addToast]);
  const value = useMemo(() => ({ addToast, removeToast, toastSuccess, toastError, toastWarning, toastInfo }), [addToast, removeToast, toastSuccess, toastError, toastWarning, toastInfo]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      
      {/* Top Center Toast Container */}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none px-4">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className={`pointer-events-auto flex items-center gap-3 p-4 rounded-2xl shadow-2xl backdrop-blur-xl border text-xs sm:text-sm font-semibold ${
                t.type === 'success' ? 'bg-emerald-950/85 text-emerald-100 border-emerald-500/40 shadow-emerald-950/30' :
                t.type === 'error' ? 'bg-rose-950/85 text-rose-100 border-rose-500/40 shadow-rose-950/30' :
                t.type === 'warning' ? 'bg-amber-950/85 text-amber-100 border-amber-500/40 shadow-amber-950/30' :
                'bg-slate-900/85 text-slate-100 border-digital-blue-500/40 shadow-slate-950/30'
              }`}
            >
              {t.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />}
              {t.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
              {t.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />}
              {t.type === 'info' && <Info className="w-5 h-5 text-digital-blue-400 shrink-0" />}
              
              <span className="flex-1 leading-snug">{t.message}</span>
              
              <button
                onClick={() => removeToast(t.id)}
                className="text-white/60 hover:text-white transition p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
