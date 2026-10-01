import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Store, Utensils, ShoppingBag, Calendar, Star, BarChart3, Settings, LogOut, Compass, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { UserAvatar } from '../common/UserAvatar';

export const Sidebar = ({ onCloseMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const businessNav = [
    { label: 'نظرة عامة', path: '/business/dashboard', icon: LayoutDashboard },
    { label: 'ملف النشاط التجارى', path: '/business/profile', icon: Store },
    { label: 'إدارة قائمة الطعام', path: '/business/menu', icon: Utensils },
    { label: 'طلبات العملاء', path: '/business/orders', icon: ShoppingBag },
    { label: 'حجوزات الطاولات', path: '/business/bookings', icon: Calendar },
    { label: 'تقييمات العملاء', path: '/business/reviews', icon: Star },
    { label: 'التحليلات والأداء', path: '/business/analytics', icon: BarChart3 },
    { label: 'إعدادات المتجر', path: '/business/settings', icon: Settings },
  ];

  const adminNav = [
    { label: 'نظرة عامة على الإدارة', path: '/admin', icon: LayoutDashboard },
    { label: 'العودة للموقع الرئيسي', path: '/', icon: ArrowRight },
  ];

  const links = user?.role === 'admin' ? adminNav : businessNav;

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 glass-l3 h-[calc(100vh-2rem)] sticky top-4 flex flex-col justify-between p-4 border border-white/20 dark:border-white/10 rounded-2xl text-right shadow-2xl">
      <div className="flex flex-col gap-6">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 px-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#A85F48] to-[#C99545] flex items-center justify-center text-white shadow-md">
            <Compass className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-base tracking-tight text-[#174A4D] dark:text-teal-300">
              دليل<span className="text-[#A85F48]"> سيناء</span>
            </span>
            <span className="text-[9px] uppercase tracking-widest text-[var(--color-text-muted)] font-bold">
              {user?.role === 'admin' ? 'بوابة الإدارة' : 'إدارة الأنشطة'}
            </span>
          </div>
        </Link>

        {/* Business Badge */}
        <div className="px-3 py-2.5 rounded-xl glass-l1 border border-white/20 dark:border-white/10 flex items-center gap-3">
          <UserAvatar src={user?.avatar} name={user?.name} className="w-9 h-9 rounded-xl object-cover border-2 border-[#A85F48]" />
          <div className="flex flex-col truncate">
            <span className="text-xs font-bold text-[var(--color-text-primary)] truncate">{user?.name}</span>
            <span className="text-[10px] text-teal-500 font-bold capitalize">{user?.role === 'business_owner' ? 'صاحب نشاط' : 'مدير المنصة'}</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5">
          {links.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition duration-200 ${
                  active
                    ? 'text-white'
                    : 'text-[var(--color-text-primary)] hover:bg-white/20 dark:hover:bg-white/10'
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="sidebarActive"
                    className="absolute inset-0 bg-[#A85F48] rounded-xl shadow-md shadow-[#A85F48]/30"
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  />
                )}
                <Icon className={`w-4 h-4 relative z-10 ${active ? 'text-white' : 'text-[#A85F48]'}`} />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="pt-4 border-t border-slate-200/40 dark:border-white/10 flex flex-col gap-2">
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[var(--color-text-secondary)] hover:text-[#A85F48] transition"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للموقع الرئيسي</span>
        </Link>

        <button
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition w-full text-right"
        >
          <LogOut className="w-4 h-4" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
};
