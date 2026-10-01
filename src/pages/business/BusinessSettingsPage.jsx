import React from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { GlassCard } from '../../components/common/GlassCard';
import { Button } from '../../components/common/Button';
import { useToast } from '../../hooks/useToast';
import { Bell, MessageSquare, Shield } from 'lucide-react';

export const BusinessSettingsPage = () => {
  const { toastSuccess } = useToast();

  return (
    <DashboardLayout title="إعدادات النشاط التجاري">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-panel p-6 sm:p-8 flex flex-col gap-6 max-w-2xl border border-white/20 dark:border-white/10 shadow-2xl rounded-3xl"
      >
        <h3 className="text-lg font-black font-display text-[var(--color-text-primary)] pb-3 border-b border-[var(--color-border-subtle)]">
          تفضيلات المظهر والربط المحمول وتلقي الطلبات
        </h3>

        <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border-subtle)]">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold font-display text-[var(--color-text-primary)]">التوجيه التلقائي لطلب الواتساب</h4>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">فتح محادثة الواتساب تلقائياً مع العميل عند إتمام عملية الشراء</p>
            </div>
          </div>
          <input type="checkbox" defaultChecked className="w-5 h-5 text-emerald-600 rounded accent-[#174A4D] cursor-pointer" />
        </div>

        <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border-subtle)]">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold font-display text-[var(--color-text-primary)]">إشعارات الحجوزات الفورية</h4>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">تلقي تنبيه فور ورود طلب حجز طاولة جديدة من أحد الضيوف</p>
            </div>
          </div>
          <input type="checkbox" defaultChecked className="w-5 h-5 text-[#A85F48] rounded accent-[#A85F48] cursor-pointer" />
        </div>

        <div className="pt-2 flex justify-end">
          <Button variant="primary" onClick={() => toastSuccess('تم حفظ إعدادات وتفضيلات النشاط بنجاح!')}>
            حفظ التغييرات
          </Button>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

