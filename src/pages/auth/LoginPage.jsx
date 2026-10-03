import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { Container } from '../../components/common/Container';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { authService } from '../../services/authService';
import { Logo } from '../../components/common/Logo';

export const LoginPage = () => {
  const { login } = useAuth();
  const { toastSuccess, toastError } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [setupAvailable] = useState(() => !authService.hasSystemAdmin());

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
            <Logo className="w-20 h-20 mb-2 animate-spin-slow" />
            <h1 className="text-2xl font-black font-display text-[var(--color-text-primary)]">تسجيل الدخول لدليل سيناء</h1>
            <p className="text-xs text-[var(--color-text-muted)] font-medium">ادخل لحسابك للوصول للأماكن المحفوظة، الحجوزات، الطلبات ولوحة التحكم</p>
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
            <Link to="/register" className="font-bold text-[var(--color-digital-blue-500)] hover:underline">
              إنشاء حساب جديد
            </Link>
          </div>
          {setupAvailable && <Link to="/admin/setup" className="text-center text-xs font-bold text-[var(--color-text-muted)] hover:text-[var(--color-digital-blue-500)]">إعداد حساب مدير النظام</Link>}
        </motion.div>
      </Container>
    </div>
  );
};
