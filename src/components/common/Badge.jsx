import React from 'react';

export const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-[var(--color-digital-blue-500)]/15 text-[var(--color-digital-blue-500)] dark:text-[var(--color-digital-blue-400)] border-[var(--color-digital-blue-500)]/30',
    secondary: 'bg-[var(--color-digital-blue-700)]/15 text-[var(--color-digital-blue-700)] dark:text-digital-blue-300 border-[var(--color-digital-blue-700)]/30',
    accent: 'bg-[var(--color-digital-blue-500)]/15 text-[var(--color-digital-blue-500)] dark:text-[var(--color-digital-blue-300)] border-[var(--color-digital-blue-500)]/30',
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

