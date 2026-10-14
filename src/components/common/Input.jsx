import React, { useState, useId } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const Input = ({
  label,
  error,
  success,
  helperText,
  icon: Icon,
  type = 'text',
  className = '',
  id,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === 'password';
  const inputType = isPasswordType ? (showPassword ? 'text' : 'password') : type;

  const generatedId = useId();
  const inputId = id || (label ? `input-${label.replace(/\s+/g, '-')}-${generatedId}` : generatedId);
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  const hasError = !!error;
  const hasSuccess = !!success;

  // Build aria-describedby from error or helper text
  const describedBy = hasError ? errorId : (helperText ? helperId : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute right-3.5 text-slate-400 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          type={inputType}
          aria-invalid={hasError ? 'true' : undefined}
          aria-describedby={describedBy}
          className={`w-full py-2.5 rounded-xl text-sm glass-input transition duration-200 ${
            Icon ? 'pr-10' : 'pr-3.5'
          } ${isPasswordType ? 'pl-10' : 'pl-3.5'} ${
            hasError
              ? 'border-rose-500 focus:ring-rose-500'
              : hasSuccess
                ? 'border-emerald-500 focus:ring-emerald-500'
                : 'border-slate-300 dark:border-slate-700 focus:border-[var(--color-digital-blue-500)]'
          } ${className}`}
          {...props}
        />

        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 text-slate-400 hover:text-slate-200 p-1 rounded-lg transition"
            aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {hasError && (
        <p id={errorId} className="text-xs font-medium text-rose-500 mt-0.5" role="alert">
          {error}
        </p>
      )}
      {!hasError && hasSuccess && (
        <p className="text-xs font-medium text-emerald-500 mt-0.5">
          {success}
        </p>
      )}
      {!hasError && !hasSuccess && helperText && (
        <p id={helperId} className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {helperText}
        </p>
      )}
    </div>
  );
};
