import React, { createContext, useState, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmContext = createContext();

export const ConfirmProvider = ({ children }) => {
  const [config, setConfig] = useState(null);

  const confirm = useCallback(({ title = 'هل أنت تأكد؟', message = 'لا يمكن التراجع عن هذا الإجراء بعد تنفيذه.', confirmText = 'تأكيد الإجراء', cancelText = 'إلغاء', variant = 'danger' }) => {
    return new Promise((resolve) => {
      setConfig({
        title,
        message,
        confirmText,
        cancelText,
        variant,
        resolve
      });
    });
  }, []);

  const handleClose = useCallback((result) => {
    if (config?.resolve) {
      config.resolve(result);
    }
    setConfig(null);
  }, [config]);
  const value = useMemo(() => ({ confirm }), [confirm]);

  return (
    <ConfirmContext.Provider value={value}>
      {children}

      <AnimatePresence>
        {config && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => handleClose(false)}
              className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto p-5 sm:p-6 rounded-2xl glass-panel text-slate-100 shadow-2xl z-10 border border-white/20"
            >
              <button
                onClick={() => handleClose(false)}
                className="absolute top-4 left-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-full ${config.variant === 'danger' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display">{config.title}</h3>
              </div>

              <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                {config.message}
              </p>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => handleClose(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/10 transition"
                >
                  {config.cancelText}
                </button>
                <button
                  type="button"
                  onClick={() => handleClose(true)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg transition ${
                    config.variant === 'danger'
                      ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/30'
                      : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/30'
                  }`}
                >
                  {config.confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ConfirmContext.Provider>
  );
};
