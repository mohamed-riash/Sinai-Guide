import React, { useState, useCallback, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, Phone, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Container } from '../../components/common/Container';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { PasswordStrengthPanel, evaluatePassword } from '../../components/common/PasswordStrengthPanel';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Logo } from '../../components/common/Logo';

// ── SVG brand icons (inline to avoid extra dependencies) ──
const GoogleIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

export const RegisterPage = () => {
  const { register } = useAuth();
  const { toastSuccess, toastError } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const formRef = useRef(null);

  const initialRole = searchParams.get('role') === 'business_owner' ? 'business_owner' : 'customer';

  const [role, setRole] = useState(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  // Track which fields the user has interacted with (blur or submit attempt)
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // ── Field-level validation ──
  const validateField = useCallback((field, values) => {
    const v = values || { name, email, phone, password, confirmPassword };
    switch (field) {
      case 'name':
        if (!v.name.trim()) return 'يرجى إدخال الاسم.';
        return '';
      case 'email':
        if (!v.email.trim()) return 'يرجى إدخال البريد الإلكتروني.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) return 'يرجى إدخال بريد إلكتروني صحيح.';
        return '';
      case 'phone':
        if (!v.phone.trim()) return 'رقم الهاتف مطلوب.';
        return '';
      case 'password': {
        if (!v.password) return 'يرجى إدخال كلمة المرور.';
        const { allPassed } = evaluatePassword(v.password);
        if (!allPassed) return 'كلمة المرور لا تستوفي جميع الشروط المطلوبة.';
        return '';
      }
      case 'confirmPassword':
        if (!v.confirmPassword) return 'يرجى تأكيد كلمة المرور.';
        if (v.password !== v.confirmPassword) return 'كلمتا المرور غير متطابقتين.';
        return '';
      default:
        return '';
    }
  }, [name, email, phone, password, confirmPassword]);

  // ── Full form validation ──
  const validateAll = useCallback(() => {
    const fields = ['name', 'email', 'phone', 'password', 'confirmPassword'];
    const values = { name, email, phone, password, confirmPassword };
    const errs = {};
    fields.forEach((f) => {
      const msg = validateField(f, values);
      if (msg) errs[f] = msg;
    });
    return errs;
  }, [name, email, phone, password, confirmPassword, validateField]);

  // ── Blur handler: mark field as touched and validate ──
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

  // ── Live change handler: revalidate if touched or submitted ──
  const handleFieldChange = useCallback((field, setter) => (e) => {
    const val = e.target.value;
    setter(val);

    // Build current values with the new value applied
    const values = { name, email, phone, password, confirmPassword, [field]: val };
    // If password changed, also revalidate confirmPassword
    if (field === 'password') {
      values.password = val;
    }

    if (touched[field] || submitted) {
      const msg = validateField(field, values);
      setErrors((prev) => {
        const next = { ...prev };
        if (msg) { next[field] = msg; } else { delete next[field]; }
        return next;
      });
    }

    // If password changes, also revalidate confirm (if confirm is touched)
    if (field === 'password' && (touched.confirmPassword || submitted)) {
      const confirmMsg = validateField('confirmPassword', values);
      setErrors((prev) => {
        const next = { ...prev };
        if (confirmMsg) { next.confirmPassword = confirmMsg; } else { delete next.confirmPassword; }
        return next;
      });
    }
  }, [name, email, phone, password, confirmPassword, touched, submitted, validateField]);

  // ── Confirm password derived states ──
  const confirmMatch = confirmPassword.length > 0 && password === confirmPassword;

  // ── Submit ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    const errs = validateAll();
    setErrors(errs);

    // Mark all fields as touched on submit
    setTouched({ name: true, email: true, phone: true, password: true, confirmPassword: true });

    if (Object.keys(errs).length > 0) {
      // Focus the first invalid field
      const firstErrorField = ['name', 'email', 'phone', 'password', 'confirmPassword'].find((f) => errs[f]);
      if (firstErrorField && formRef.current) {
        const el = formRef.current.querySelector(`[name="${firstErrorField}"]`);
        if (el) el.focus();
      }
      return;
    }

    setLoading(true);
    try {
      const newUser = await register({
        name,
        email,
        phone,
        password,
        confirmPassword,
        role
      });

      toastSuccess(`أهلاً بك في دليل سيناء، ${newUser.name}!`);
      if (role === 'business_owner') {
        navigate('/business/onboarding');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      toastError(err.message || 'فشل في إنشاء الحساب.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 flex items-center justify-center min-h-[85vh]">
      <Container className="max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-l3 p-8 sm:p-10 flex flex-col gap-6 rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl"
        >
          {/* Header */}
          <div className="flex flex-col items-center text-center gap-2">
            <Logo className="w-20 h-20 mb-2 animate-spin-slow" />
            <h1 className="text-2xl font-black font-display text-[var(--color-text-primary)]">إنشاء حساب جديد</h1>
            <p className="text-xs text-[var(--color-text-muted)] font-medium">انضم لمنصة السياحة والاستكشاف في شمال سيناء</p>
          </div>

          {/* Role Toggle Selector */}
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl glass-l1 border border-white/10">
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`py-2.5 rounded-xl text-xs font-bold transition ${
                role === 'customer' ? 'bg-[var(--color-digital-blue-500)] text-white shadow-md' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-digital-blue-500)]'
              }`}
            >
              سائح / مقيم
            </button>
            <button
              type="button"
              onClick={() => setRole('business_owner')}
              className={`py-2.5 rounded-xl text-xs font-bold transition ${
                role === 'business_owner' ? 'bg-[var(--color-digital-blue-700)] text-white shadow-md' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-digital-blue-700)]'
              }`}
            >
              صاحب نشاط تجاري
            </button>
          </div>

          {/* ── Social Sign-In Buttons ── */}
          <div className="flex flex-col gap-3">
            {/* Google */}
            <div className="relative group">
              <button
                type="button"
                disabled
                aria-label="المتابعة باستخدام Google — غير متاح حاليًا"
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-sm font-bold
                  bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10
                  text-slate-700 dark:text-slate-300
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200"
              >
                <GoogleIcon />
                <span>المتابعة باستخدام Google</span>
              </button>
              <div className="pointer-events-none absolute -bottom-6 inset-x-0 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span className="text-[10px] text-[var(--color-text-muted)] font-medium bg-[var(--color-surface)] dark:bg-[var(--color-surface)] px-2 py-0.5 rounded-md shadow-sm border border-white/10">
                  تسجيل الدخول باستخدام Google غير متاح حاليًا.
                </span>
              </div>
            </div>

            {/* Facebook */}
            <div className="relative group">
              <button
                type="button"
                disabled
                aria-label="المتابعة باستخدام Facebook — غير متاح حاليًا"
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-sm font-bold
                  bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10
                  text-slate-700 dark:text-slate-300
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200"
              >
                <FacebookIcon />
                <span>المتابعة باستخدام Facebook</span>
              </button>
              <div className="pointer-events-none absolute -bottom-6 inset-x-0 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span className="text-[10px] text-[var(--color-text-muted)] font-medium bg-[var(--color-surface)] dark:bg-[var(--color-surface)] px-2 py-0.5 rounded-md shadow-sm border border-white/10">
                  تسجيل الدخول باستخدام Facebook غير متاح حاليًا.
                </span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200/60 dark:bg-white/10" />
            <span className="text-[11px] text-[var(--color-text-muted)] font-semibold">أو بالبريد الإلكتروني</span>
            <div className="flex-1 h-px bg-slate-200/60 dark:bg-white/10" />
          </div>

          {/* ── Registration Form ── */}
          <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <Input
              name="name"
              label="الاسم الكامل"
              icon={User}
              placeholder="مثال: الاسم"
              value={name}
              error={(touched.name || submitted) ? errors.name : undefined}
              onChange={handleFieldChange('name', setName)}
              onBlur={() => handleBlur('name')}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                name="phone"
                label="رقم الهاتف"
                icon={Phone}
                placeholder="+20 10 XXXX XXXX"
                value={phone}
                error={(touched.phone || submitted) ? errors.phone : undefined}
                onChange={handleFieldChange('phone', setPhone)}
                onBlur={() => handleBlur('phone')}
              />
            </div>

            {/* Password */}
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

            {/* Live Password Requirements Panel */}
            <PasswordStrengthPanel password={password} />

            {/* Confirm Password */}
            <Input
              name="confirmPassword"
              label="تأكيد كلمة المرور"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={confirmPassword}
              error={(touched.confirmPassword || submitted) ? errors.confirmPassword : undefined}
              success={confirmMatch ? 'كلمتا المرور متطابقتان.' : undefined}
              onChange={handleFieldChange('confirmPassword', setConfirmPassword)}
              onBlur={() => handleBlur('confirmPassword')}
            />

            <Button type="submit" variant="primary" fullWidth isLoading={loading} icon={UserPlus} className="py-3.5 mt-2 font-bold text-sm">
              إنشاء الحساب
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-200/40 dark:border-white/10 text-center text-xs text-[var(--color-text-muted)] font-semibold">
            لديك حساب بالفعل؟{' '}
            <Link to="/login" className="font-bold text-[var(--color-digital-blue-500)] hover:underline">
              تسجيل الدخول
            </Link>
          </div>
        </motion.div>
      </Container>
    </div>
  );
};
