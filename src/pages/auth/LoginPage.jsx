import React, { useState, useCallback, useRef } from 'react';
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
  const formRef = useRef(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [setupAvailable] = useState(() => !authService.hasSystemAdmin());

  // ── Field validation ──
  const validateField = useCallback((field, values) => {
    const v = values || { email, password };
    switch (field) {
      case 'email':
        if (!v.email.trim()) return 'البريد الإلكتروني مطلوب.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) return 'صيغة البريد الإلكتروني غير صحيحة.';
        return '';
      case 'password':
        if (!v.password) return 'كلمة المرور مطلوبة.';
        return '';
      default:
        return '';
    }
  }, [email, password]);

  // ── All fields ──
  const validateAll = useCallback(() => {
    const fields = ['email', 'password'];
    const values = { email, password };
    const errs = {};
    fields.forEach((f) => {
      const msg = validateField(f, values);
      if (msg) errs[f] = msg;
    });
    return errs;
  }, [email, password, validateField]);

  // ── Blur ──
  const handleBlur = useCallback((field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const msg = validateField(field);
    setErrors((prev) => {
      if (msg) return { ...prev, [field]: msg };
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, [validateField]);

  // ── Change with revalidation ──
  const handleFieldChange = useCallback((field, setter) => (e) => {
    const val = e.target.value;
    setter(val);

    if (touched[field] || submitted) {
      const values = { email, password, [field]: val };
      const msg = validateField(field, values);
      setErrors((prev) => {
        const next = { ...prev };
        if (msg) { next[field] = msg; } else { delete next[field]; }
        return next;
      });
    }
  }, [email, password, touched, submitted, validateField]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    const errs = validateAll();
    setErrors(errs);
    setTouched({ email: true, password: true });

    if (Object.keys(errs).length > 0) {
      const firstErrorField = ['email', 'password'].find((f) => errs[f]);
      if (firstErrorField && formRef.current) {
        const el = formRef.current.querySelector(`[name="${firstErrorField}"]`);
        if (el) el.focus();
      }
      return;
    }

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
        navigate('/');
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

          <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <Input
              name="email"
              label="البريد الإلكتروني"
              type="email"
              icon={Mail}
              placeholder="name@domain.com"
              value={email}
              error={(touched.email || submitted) ? errors.email : undefined}
              onChange={handleFieldChange('email', setEmail)}
              onBlur={() => handleBlur('email')}
            />

            <Input
              name="password"
              label="كلمة المرور"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={password}
              error={(touched.password || submitted) ? errors.password : undefined}
              onChange={handleFieldChange('password', setPassword)}
              onBlur={() => handleBlur('password')}
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
