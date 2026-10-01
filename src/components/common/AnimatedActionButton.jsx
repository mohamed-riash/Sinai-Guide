import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Calendar, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

const ICON_MAP = {
  send: Send,
  calendar: Calendar,
  check: CheckCircle2,
  sparkles: Sparkles,
};

export const AnimatedActionButton = ({
  label = 'تأكيد الإجراء',
  successLabel = 'تم الإرسال بنجاح',
  loadingLabel = 'جاري المعالجة...',
  icon = 'send',
  loading = false,
  success = false,
  disabled = false,
  onClick,
  type = 'submit',
  fullWidth = true,
  className = '',
}) => {
  const IconComponent = typeof icon === 'string' ? ICON_MAP[icon] || Send : icon;

  const isDisabled = disabled || loading || success;

  return (
    <motion.button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      whileHover={!isDisabled ? { scale: 1.02, y: -2 } : {}}
      whileTap={!isDisabled ? { scale: 0.97 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`relative overflow-hidden font-display font-extrabold text-sm text-white rounded-2xl py-3.5 px-6 flex items-center justify-center gap-2.5 transition-all duration-300 shadow-xl cursor-pointer ${
        fullWidth ? 'w-full' : 'w-auto'
      } ${
        success
          ? 'bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-600 shadow-emerald-900/40 border border-emerald-400/30'
          : loading
          ? 'bg-slate-700/80 cursor-wait border border-white/10'
          : 'bg-gradient-to-r from-[#A85F48] via-[#944F3A] to-[#874737] hover:from-[#B86F58] hover:to-[#975747] shadow-[#A85F48]/35 border border-white/20'
      } ${className}`}
    >
      {/* Background Animated Shimmer Glow */}
      {!isDisabled && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
        />
      )}

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2"
          >
            <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
            <span>{loadingLabel}</span>
          </motion.div>
        ) : success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 500, damping: 22 }}
            className="flex items-center gap-2"
          >
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: [0, 1.3, 1], rotate: 0 }}
              transition={{ duration: 0.4 }}
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            </motion.div>
            <span className="text-white font-black">{successLabel}</span>
          </motion.div>
        ) : (
          <motion.div
            key="default"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="flex items-center gap-2"
          >
            {IconComponent && (
              <motion.div
                animate={{ x: [0, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <IconComponent className="w-4 h-4" />
              </motion.div>
            )}
            <span>{label}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};
