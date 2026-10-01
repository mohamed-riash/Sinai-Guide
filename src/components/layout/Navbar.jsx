import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, Sun, Moon, ShoppingBag, Heart, User, LogOut, Menu, X, MapPin, ChevronDown, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useCity } from '../../hooks/useCity';
import { useCart } from '../../hooks/useCart';
import { Container } from '../common/Container';
import { Button } from '../common/Button';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { selectedCityId, setSelectedCityId, cities } = useCity();
  const { totalItemCount, setIsOpen: setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { label: 'الرئيسية', path: '/' },
    { label: 'استكشف', path: '/explore' },
    { label: 'المدن', path: '/cities' },
    { label: 'المطاعم والكافيهات', path: '/restaurants' },
    { label: 'المدونة', path: '/blog' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-l3 backdrop-blur-xl transition-all duration-300 border-b border-white/20 dark:border-white/10 shadow-md">
      <Container className="h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10.5 h-10.5 rounded-2xl bg-gradient-to-tr from-[#A85F48] via-[#874737] to-[#C99545] flex items-center justify-center text-white shadow-lg shadow-[#A85F48]/20 group-hover:scale-105 transition-transform duration-300">
            <Compass className="w-6 h-6 animate-spin-slow text-amber-100" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-xl tracking-tight text-[#174A4D] dark:text-teal-300">
              دليل<span className="text-[#A85F48]"> سيناء </span>
            </span>
            <span className="text-[10px] tracking-widest uppercase text-slate-500 dark:text-slate-400 font-extrabold">سياحة شمال سيناء</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5 glass-l1 px-2 py-1.5 rounded-2xl border border-white/20 dark:border-white/10 shadow-inner">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  active
                    ? 'text-white'
                    : 'text-[var(--color-text-primary)] hover:text-[#A85F48] dark:hover:text-amber-300'
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="navbarActiveTab"
                    className="absolute inset-0 bg-[#A85F48] rounded-xl shadow-md shadow-[#A85F48]/25"
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="hidden lg:flex items-center gap-3">
          {/* City Selector */}
          <div className="relative flex items-center">
            <MapPin className="w-4 h-4 text-[#A85F48] absolute right-3 pointer-events-none" />
            <select
              value={selectedCityId}
              onChange={(e) => setSelectedCityId(e.target.value)}
              className="py-2.5 pr-9 pl-7 rounded-xl text-xs font-bold glass-input cursor-pointer shadow-sm"
            >
              <option value="all" className="bg-slate-900 text-white">جميع مدن سيناء</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id} className="bg-slate-900 text-white">
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="تغيير المظهر"
            className="p-2.5 rounded-xl glass-input hover:bg-white/30 dark:hover:bg-white/15 transition text-slate-700 dark:text-slate-200 hover:scale-105 active:scale-95"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#174A4D]" />}
          </button>

          {/* Favorites Button */}
          <Link
            to="/saved"
            aria-label="الأماكن المحفوظة"
            className="p-2.5 rounded-xl glass-input hover:bg-white/30 dark:hover:bg-white/15 transition text-slate-700 dark:text-slate-200 relative hover:scale-105 active:scale-95"
          >
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
          </Link>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="عرض السلة"
            className="p-2.5 rounded-xl glass-input hover:bg-white/30 dark:hover:bg-white/15 transition text-slate-700 dark:text-slate-200 relative hover:scale-105 active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 text-[#A85F48]" />
            {totalItemCount > 0 && (
              <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-[#A85F48] text-white text-[10px] font-black flex items-center justify-center shadow-lg animate-pulse">
                {totalItemCount}
              </span>
            )}
          </button>

          {/* User Profile / Auth */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pl-3 rounded-2xl glass-input hover:bg-white/30 dark:hover:bg-white/15 transition shadow-sm"
              >
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'}
                  alt={user.name}
                  className="w-8 h-8 rounded-xl object-cover border-2 border-[#A85F48]"
                />
                <span className="text-xs font-bold max-w-[100px] truncate text-[var(--color-text-primary)]">{user.name.split(' ')[0]}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    onMouseLeave={() => setUserDropdownOpen(false)}
                    className="absolute left-0 mt-3 w-56 p-2 rounded-2xl glass-l3 shadow-2xl z-50 flex flex-col gap-1 border border-white/20 dark:border-white/10 text-xs"
                  >
                    <div className="px-3 py-2.5 border-b border-slate-200/40 dark:border-white/10 mb-1 text-right">
                      <p className="font-extrabold text-sm text-[var(--color-text-primary)] truncate">{user.name}</p>
                      <p className="text-[11px] text-[var(--color-text-muted)] font-bold">{user.role === 'business_owner' ? 'صاحب نشاط تجاري' : user.role === 'admin' ? 'مدير المنصة' : 'مستكشف'}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/20 dark:hover:bg-white/10 transition font-bold"
                    >
                      <User className="w-4 h-4 text-teal-500" />
                      <span>الملف الشخصي</span>
                    </Link>

                    {user.role === 'business_owner' && (
                      <Link
                        to="/business/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#A85F48]/10 text-[#A85F48] transition font-bold"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>لوحة التحكم للأنشطة</span>
                      </Link>
                    )}

                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#C99545]/10 text-[#C99545] transition font-bold"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>بوابة الإدارة</span>
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-rose-500/20 text-rose-500 transition w-full text-right font-bold mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>تسجيل الخروج</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  دخول
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  تسجيل حساب
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu & Action Buttons */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl glass-input text-slate-700 dark:text-slate-200"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsCartOpen(true)}
            className="p-2 rounded-xl glass-input text-slate-700 dark:text-slate-200 relative"
          >
            <ShoppingBag className="w-4 h-4 text-[#A85F48]" />
            {totalItemCount > 0 && (
              <span className="absolute -top-1 -left-1 w-4.5 h-4.5 rounded-full bg-[#A85F48] text-white text-[9px] font-bold flex items-center justify-center">
                {totalItemCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl glass-input text-slate-700 dark:text-slate-200"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </Container>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-l3 border-t border-white/20 p-6 flex flex-col gap-4 overflow-hidden"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">اختر المدينة</span>
              <select
                value={selectedCityId}
                onChange={(e) => setSelectedCityId(e.target.value)}
                className="py-1.5 px-3 rounded-xl text-xs glass-input"
              >
                <option value="all" className="bg-slate-900 text-white">جميع مدن سيناء</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id} className="bg-slate-900 text-white">{c.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-bold transition ${
                    isActive(link.path) ? 'bg-[#A85F48] text-white shadow-md' : 'hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/saved"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-bold hover:bg-white/10 flex items-center gap-2 text-rose-400"
              >
                <Heart className="w-4 h-4" />
                <span>الأماكن المحفوظة</span>
              </Link>
            </div>

            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 px-4 rounded-xl bg-white/10 text-center font-bold text-sm"
                  >
                    الملف الشخصي ({user.name})
                  </Link>
                  {user.role === 'business_owner' && (
                    <Link
                      to="/business/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-3 px-4 rounded-xl bg-[#A85F48] text-white text-center font-bold text-sm shadow-md"
                    >
                      لوحة التحكم للأنشطة
                    </Link>
                  )}
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-3 px-4 rounded-xl bg-[#174A4D] text-white text-center font-bold text-sm shadow-md"
                    >
                      لوحة الإدارة
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                      navigate('/');
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-rose-500/20 text-rose-400 font-bold text-sm"
                  >
                    تسجيل الخروج
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" fullWidth>دخول</Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" fullWidth>تسجيل جديد</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

