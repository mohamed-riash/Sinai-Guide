import React, { useMemo } from 'react';
import { Check, Circle, X } from 'lucide-react';

const PASSWORD_RULES = [
  { key: 'length', label: '8 أحرف على الأقل', test: (pw) => pw.length >= 8 },
  { key: 'uppercase', label: 'حرف كبير واحد على الأقل (A-Z)', test: (pw) => /[A-Z]/.test(pw) },
  { key: 'lowercase', label: 'حرف صغير واحد على الأقل (a-z)', test: (pw) => /[a-z]/.test(pw) },
  { key: 'number', label: 'رقم واحد على الأقل (0-9)', test: (pw) => /[0-9]/.test(pw) },
  { key: 'special', label: 'رمز خاص واحد على الأقل', test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

/**
 * Evaluate password against all rules. Returns { results, passedCount, allPassed }.
 */
export const evaluatePassword = (password) => {
  const results = PASSWORD_RULES.map((rule) => ({
    ...rule,
    passed: password ? rule.test(password) : false,
  }));
  const passedCount = results.filter((r) => r.passed).length;
  return {
    results,
    passedCount,
    total: PASSWORD_RULES.length,
    allPassed: passedCount === PASSWORD_RULES.length,
  };
};

/**
 * Get strength level from passed requirements count.
 */
const getStrength = (passedCount) => {
  if (passedCount <= 2) return { label: 'ضعيفة', level: 'weak', color: 'bg-rose-500', textColor: 'text-rose-500 dark:text-rose-400', percent: 33 };
  if (passedCount <= 4) return { label: 'متوسطة', level: 'medium', color: 'bg-amber-500', textColor: 'text-amber-500 dark:text-amber-400', percent: 66 };
  return { label: 'قوية', level: 'strong', color: 'bg-emerald-500', textColor: 'text-emerald-500 dark:text-emerald-400', percent: 100 };
};

export const PasswordStrengthPanel = ({ password = '' }) => {
  const evaluation = useMemo(() => evaluatePassword(password), [password]);
  const strength = useMemo(() => getStrength(evaluation.passedCount), [evaluation.passedCount]);

  const hasInput = password.length > 0;

  return (
    <div className="flex flex-col gap-3 p-4 rounded-2xl glass-l1 border border-white/10 dark:border-white/5">
      {/* Requirements Header */}
      <p className="text-xs font-bold text-[var(--color-text-secondary)]">
        كلمة المرور يجب أن تحتوي على:
      </p>

      {/* Requirements List */}
      <ul className="flex flex-col gap-1.5" aria-label="متطلبات كلمة المرور">
        {evaluation.results.map((rule) => {
          const passed = hasInput && rule.passed;
          const failed = hasInput && !rule.passed;

          return (
            <li key={rule.key} className="flex items-center gap-2 text-xs font-medium">
              {!hasInput && (
                <Circle className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
              )}
              {passed && (
                <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
              )}
              {failed && (
                <X className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400 shrink-0" />
              )}
              <span
                className={
                  !hasInput
                    ? 'text-[var(--color-text-muted)]'
                    : passed
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                }
              >
                {rule.label}
              </span>
            </li>
          );
        })}
      </ul>

      {/* Strength Indicator — only show when user has typed */}
      {hasInput && (
        <div className="flex flex-col gap-1.5 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[var(--color-text-muted)]">
              قوة كلمة المرور
            </span>
            <span className={`text-[11px] font-bold ${strength.textColor}`}>
              {strength.label}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ease-out ${strength.color}`}
              style={{ width: `${strength.percent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
