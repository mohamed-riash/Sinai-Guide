import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, LogIn, Compass } from 'lucide-react';
import { motion } from 'framer-motion';
import { Container } from '../../components/common/Container';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

export const LoginPage = () => {
  const { login } = useAuth();
  const { toastSuccess, toastError } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = 'البريد الإلكتروني مطلوب.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.email = 'صيغة البريد الإلكتروني غير صحيحة.';
    if (!password) errs.password = 'كلمة المرور مطلوبة.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const user = await login(email, password);
      toastSuccess(`أهلاً وسهلاً، ${user.name}!`);

      const redirect = searchParams.get('redirect');
      if (redirect) {
        navigate(redirect);
      } else if (user.role === 'business_owner') {
        navigate('/business/dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      toastError(err.message || 'فشل تسجيل الدخول. تحقق من بياناتك.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 flex items-center justify-center min-h-[75vh]">
      <Container className="max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-l3 p-8 sm:p-10 flex flex-col gap-6 rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl"
        >
          {/* Header */}
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#A85F48] to-[#C99545] flex items-center justify-center text-white shadow-lg mb-2">
              <Compass className="w-7 h-7 animate-spin-slow" />
            </div>
            <h1 className="text-2xl font-black font-display text-[var(--color-text-primary)]">تسجيل الدخول لدليل سيناء</h1>
            <p className="text-xs text-[var(--color-text-muted)] font-medium">ادخل لحسابك للوصول للأماكن المحفوظة، الحجوزات، الطلبات ولوحة التحكم</p>
          </div>

          {/* Quick Demo Credentials Help */}
          <div className="p-4 rounded-2xl glass-l1 border border-white/15 text-xs flex flex-col gap-1.5">
            <span className="font-bold text-[#A85F48]">بيانات الدخول التجريبية (password123):</span>
            <div className="grid grid-cols-3 gap-1.5 text-[11px] text-[var(--color-text-primary)] font-bold mt-1">
              <button type="button" onClick={() => { setEmail('user@sinai.com'); setPassword('password123'); }} className="p-2 rounded-xl bg-white/20 dark:bg-black/30 hover:bg-[#A85F48]/20 transition">مستكشف</button>
              <button type="button" onClick={() => { setEmail('business@sinai.com'); setPassword('password123'); }} className="p-2 rounded-xl bg-white/20 dark:bg-black/30 hover:bg-[#A85F48]/20 transition">صاحب نشاط</button>
              <button type="button" onClick={() => { setEmail('admin@sinai.com'); setPassword('password123'); }} className="p-2 rounded-xl bg-white/20 dark:bg-black/30 hover:bg-[#A85F48]/20 transition">مدير</button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="البريد الإلكتروني"
              type="email"
              icon={Mail}
              placeholder="name@domain.com"
              value={email}
              error={errors.email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="كلمة المرور"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={password}
              error={errors.password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" variant="primary" fullWidth isLoading={loading} icon={LogIn} className="py-3.5 mt-2 font-bold text-sm">
              تسجيل الدخول
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-200/40 dark:border-white/10 text-center text-xs text-[var(--color-text-muted)] font-semibold">
            ليس لديك حساب؟{' '}
            <Link to="/register" className="font-bold text-[#A85F48] hover:underline">
              إنشاء حساب جديد
            </Link>
          </div>
        </motion.div>
      </Container>
    </div>
  );
};

