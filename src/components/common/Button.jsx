import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  icon: Icon,
  type = 'button',
  onClick,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none hover:-translate-y-0.5 active:scale-[0.97]';

  const variants = {
    primary: 'bg-[#A85F48] hover:bg-[#874737] text-white shadow-lg shadow-[#A85F48]/25 focus:ring-[#A85F48]',
    secondary: 'bg-[#174A4D] hover:bg-[#103638] text-white shadow-lg shadow-[#174A4D]/25 focus:ring-[#174A4D]',
    accent: 'bg-[#C99545] hover:bg-[#b08035] text-white shadow-lg shadow-[#C99545]/25 focus:ring-[#C99545]',
    glass: 'bg-white/15 dark:bg-white/10 hover:bg-white/25 dark:hover:bg-white/20 text-current backdrop-blur-md border border-white/20 dark:border-white/10 shadow-md focus:ring-[#A85F48]',
    ghost: 'bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-current focus:ring-[#174A4D]',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/25 focus:ring-rose-600',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25 focus:ring-emerald-600'
  };

  const sizes = {
    xs: 'px-2.5 py-1.5 text-[11px] gap-1',
    sm: 'px-3.5 py-2 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2.5'
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : Icon ? (
        <Icon className={`${size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} shrink-0`} />
      ) : null}
      <span>{children}</span>
    </button>
  );
};

