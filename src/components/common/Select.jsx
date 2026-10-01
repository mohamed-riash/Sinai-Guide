import React from 'react';

export const Select = ({
  label,
  options = [],
  error,
  helperText,
  icon: Icon,
  className = '',
  id,
  value,
  onChange,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute right-3.5 text-[#A85F48] pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          className={`w-full py-2.5 rounded-xl text-sm glass-input cursor-pointer appearance-none transition duration-200 ${
            Icon ? 'pr-10 pl-9' : 'pr-4 pl-9'
          } ${
            error ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-300 dark:border-slate-700 focus:border-[#A85F48]'
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute left-3.5 text-slate-400 pointer-events-none">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <p className="text-xs font-medium text-rose-500 mt-0.5">{error}</p>}
      {!error && helperText && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{helperText}</p>}
    </div>
  );
};

