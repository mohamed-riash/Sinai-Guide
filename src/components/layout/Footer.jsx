import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, MapPin, Mail, Heart } from 'lucide-react';
import { Container } from '../common/Container';

export const Footer = () => {
  return (
    <footer className="mt-20 border-t border-white/20 glass-l3 rounded-t-3xl pt-16 pb-24 lg:pb-12 text-right">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--color-digital-blue-500)] to-[var(--color-digital-blue-500)] flex items-center justify-center text-white shadow-md">
                <Compass className="w-6 h-6" />
              </div>
              <span className="font-display font-black text-xl tracking-tight text-digital-blue-400 dark:text-digital-blue-300">
                دليل<span className="text-[var(--color-digital-blue-500)]"> سيناء </span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-sm">
              المنصة السياحية الرقمية الأولى لاكتشاف وتصفح مدن ومناطق شمال سيناء. استكشاف شواطئ نخيل العريش، محمية الزرانيق ببئر العبد، مزارع زيتون الشيخ زويد، وسواحل رفح.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-[var(--color-text-muted)] text-xs mt-2 font-medium">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[var(--color-digital-blue-500)]" /> العريش، شمال سيناء</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-digital-blue-400" /> info@sinaiguide.com</span>
            </div>
          </div>

          {/* Quick Discover */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold font-display uppercase tracking-wider text-[var(--color-digital-blue-500)]">استكشف سيناء</h4>
            <ul className="flex flex-col gap-2.5 text-xs font-semibold text-[var(--color-text-secondary)]">
              <li><Link to="/explore" className="hover:text-[var(--color-digital-blue-500)] transition">جميع الوجهات</Link></li>
              <li><Link to="/cities/arish" className="hover:text-[var(--color-digital-blue-500)] transition">مدينة العريش</Link></li>
              <li><Link to="/cities/bir-al-abd" className="hover:text-[var(--color-digital-blue-500)] transition">بئر العبد والملاحات</Link></li>
              <li><Link to="/cities/sheikh-zuweid" className="hover:text-[var(--color-digital-blue-500)] transition">الشيخ زويد والزيتون</Link></li>
              <li><Link to="/cities/rafah" className="hover:text-[var(--color-digital-blue-500)] transition">سواحل رفح</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold font-display uppercase tracking-wider text-[var(--color-digital-blue-500)]">التصنيفات</h4>
            <ul className="flex flex-col gap-2.5 text-xs font-semibold text-[var(--color-text-secondary)]">
              <li><Link to="/restaurants" className="hover:text-[var(--color-digital-blue-500)] transition">مطاعم الأسماك الطازجة</Link></li>
              <li><Link to="/cafes" className="hover:text-[var(--color-digital-blue-500)] transition">كافيهات ومقاهي البحر</Link></li>
              <li><Link to="/explore?category=hotel" className="hover:text-[var(--color-digital-blue-500)] transition">الفنادق والمنتجعات</Link></li>
              <li><Link to="/explore?category=attraction" className="hover:text-[var(--color-digital-blue-500)] transition">محمية الزرانيق</Link></li>
              <li><Link to="/blog" className="hover:text-[var(--color-digital-blue-500)] transition">مدونة دليل سيناء</Link></li>
            </ul>
          </div>

          {/* Business & Partners */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold font-display uppercase tracking-wider text-[var(--color-digital-blue-500)]">أصحاب الأنشطة</h4>
            <ul className="flex flex-col gap-2.5 text-xs font-semibold text-[var(--color-text-secondary)]">
              <li><Link to="/register?role=business_owner" className="hover:text-[var(--color-digital-blue-500)] transition ">تسجيل نشاط تجاري جديد</Link></li>
              <li><Link to="/login" className="hover:text-[var(--color-digital-blue-500)] transition">بوابة أصحاب الأنشطة</Link></li>
              <li><Link to="/business/onboarding" className="hover:text-[var(--color-digital-blue-500)] transition">إضافة مطعم أو شاليه</Link></li>
              <li><Link to="/admin" className="hover:text-[var(--color-digital-blue-500)] transition">إدارة المنصة</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-300/30 dark:border-white/10 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-[var(--color-text-muted)] font-medium">
          <p>© {new Date().getFullYear()} دليل سيناء. جميع الحقوق محفوظة. صُمم بحب لأهل سيناء.</p>

        </div>
      </Container>
    </footer>
  );
};

