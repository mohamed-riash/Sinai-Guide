import React from 'react';

export const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-[#A85F48]/15 text-[#A85F48] dark:text-[#C98268] border-[#A85F48]/30',
    secondary: 'bg-[#174A4D]/15 text-[#174A4D] dark:text-teal-300 border-[#174A4D]/30',
    accent: 'bg-[#C99545]/15 text-[#C99545] dark:text-[#E0B66D] border-[#C99545]/30',
    success: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
    danger: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
    glass: 'bg-white/20 dark:bg-black/30 text-current border-white/20 dark:border-white/10'
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border ${variants[variant] || variants.primary} ${className}`}>
      {children}
    </span>
  );
};

