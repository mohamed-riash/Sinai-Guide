import React from 'react';
import { Sun, Moon, Bell, Shield, Globe, Lock } from 'lucide-react';
import { Container } from '../../components/common/Container';
import { Button } from '../../components/common/Button';
import { useTheme } from '../../hooks/useTheme';
import { useToast } from '../../hooks/useToast';

export const SettingsPage = () => {
  const { isDark, toggleTheme } = useTheme();
  const { toastSuccess } = useToast();

  const handleSave = () => {
    toastSuccess('تم حفظ التفضيلات بنجاح!');
  };

  return (
    <div className="py-8 flex flex-col gap-8">
      <Container className="max-w-2xl">
        <h1 className="text-3xl font-extrabold font-display text-[var(--color-text-primary)] mb-6">
          إعدادات التطبيق
        </h1>

        <div className="glass-card p-6 sm:p-8 flex flex-col gap-6 border border-white/20 dark:border-white/10 shadow-xl">
          {/* Theme Preference */}
          <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border-subtle)]">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[var(--color-terracotta)]/15 text-[var(--color-terracotta)]">
                {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-base font-bold font-display text-[var(--color-text-primary)]">مظهر التطبيق</h3>
                <p className="text-xs text-[var(--color-text-secondary)]">التبديل بين الوضع الفاتح والوضع الداكن</p>
              </div>
            </div>
            <Button variant="glass" size="sm" onClick={toggleTheme}>
              {isDark ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}
            </Button>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border-subtle)]">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[var(--color-teal)]/15 text-[var(--color-teal)] dark:text-teal-300">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold font-display text-[var(--color-text-primary)]">الإشعارات</h3>
                <p className="text-xs text-[var(--color-text-secondary)]">استلام تنبيهات حالة الطلبات وتأكيد الحجوزات</p>
              </div>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-[var(--color-terracotta)] accent-[var(--color-terracotta)]" />
          </div>

          {/* Privacy & Storage */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[var(--color-gold)]/15 text-[var(--color-gold)]">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold font-display text-[var(--color-text-primary)]">تخزين البيانات</h3>
                <p className="text-xs text-[var(--color-text-secondary)]">بنية التخزين المحلي جاهزة للربط مع واجهة برمجة التطبيقات</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">التخزين المحلي نشط</span>
          </div>

          <div className="pt-4 flex justify-end">
            <Button variant="primary" onClick={handleSave}>
              حفظ الإعدادات
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

