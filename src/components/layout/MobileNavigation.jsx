import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, MapPin, Heart, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

export const MobileNavigation = () => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const navItems = [
    { label: 'الرئيسية', path: '/', icon: Home },
    { label: 'استكشف', path: '/explore', icon: Compass },
    { label: 'المدن', path: '/cities', icon: MapPin },
    { label: 'المحفوظات', path: '/saved', icon: Heart },
    { 
      label: isAuthenticated ? 'حسابي' : 'الدخول', 
      path: isAuthenticated ? (user?.role === 'business_owner' ? '/business/dashboard' : '/profile') : '/login', 
      icon: User 
    },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-l3 border-t border-white/20 px-2 py-2 pb-safe shadow-2xl backdrop-blur-2xl">
      <div className="flex w-full min-w-0 items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.label}
              to={item.path}
              className={`min-w-0 flex-1 flex flex-col items-center gap-1 py-1.5 px-0.5 rounded-2xl transition duration-200 relative ${
                active ? 'text-[#A85F48] dark:text-[#C98268]' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'scale-110' : ''} transition-transform duration-200`} />
              <span className="max-w-full text-center text-[9px] font-bold tracking-tight leading-tight">{item.label}</span>
              {active && (
                <motion.span
                  layoutId="mobileNavActive"
                  className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#A85F48]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
