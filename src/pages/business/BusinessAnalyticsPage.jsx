import React from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { MetricCard } from '../../components/common/MetricCard';
import { GlassCard } from '../../components/common/GlassCard';
import { TrendingUp, Users, ShoppingBag, Eye, Star } from 'lucide-react';

export const BusinessAnalyticsPage = () => {
  return (
    <DashboardLayout title="إحصائيات وتحليلات النشاط">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard title="مشاهدات الصفحة" value="4,820" change="+24.5% هذا الشهر" icon={Eye} />
          <MetricCard title="الزوار الفريدون" value="1,940" change="+15.2% هذا الأسبوع" icon={Users} />
          <MetricCard title="معدل التحويل للطلبات" value="84 طلب" change="+8.1% تحسن" icon={ShoppingBag} />
          <MetricCard title="معدل رضا العملاء" value="98.2%" change="+2.0% إيجابي" icon={Star} />
        </div>

        <GlassCard hover={false} className="p-6 sm:p-8 flex flex-col gap-6 border border-white/20 dark:border-white/10 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold font-display text-[var(--color-text-primary)]">مؤشر الإيرادات والحجوزات الأسبوعي</h3>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1 font-medium">متابعة نمو مبيعات وحجوزات النشاط التجاري عبر الأسابيع الأخير</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              نمو مستمر 📈
            </span>
          </div>

          <div className="w-full h-64 bg-black/5 dark:bg-white/5 rounded-2xl border border-[var(--color-border-subtle)] flex items-end justify-between p-6 gap-3">
            {[40, 65, 50, 80, 70, 95, 85, 100].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  className="w-full rounded-t-xl bg-gradient-to-t from-[var(--color-teal-soft)] to-[var(--color-terracotta)] transition-all duration-300 hover:brightness-110 shadow-md"
                />
                <span className="text-[10px] text-[var(--color-text-muted)] font-bold">أسبوع {i + 1}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </DashboardLayout>
  );
};

