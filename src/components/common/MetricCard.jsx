import React from 'react';
import { GlassCard } from './GlassCard';

export const MetricCard = ({ title, value, change, icon: Icon, trend = 'up' }) => {
  return (
    <GlassCard hover={false} className="flex items-center justify-between p-5 border border-white/10 dark:border-white/5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
          {title}
        </p>
        <h3 className="text-2xl font-bold font-display text-[var(--color-text-primary)] mt-1.5">
          {value}
        </h3>
        {change && (
          <p className={`text-xs font-medium mt-1.5 flex items-center gap-1 ${trend === 'up' ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500'}`}>
            <span>{trend === 'up' ? '↑' : '↓'}</span> {change}
          </p>
        )}
      </div>
      {Icon && (
        <div className="p-3.5 rounded-2xl bg-[var(--color-terracotta)]/15 text-[var(--color-terracotta)] flex items-center justify-center shadow-inner">
          <Icon className="w-6 h-6" />
        </div>
      )}
    </GlassCard>
  );
};

