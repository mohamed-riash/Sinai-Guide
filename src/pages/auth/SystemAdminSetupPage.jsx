import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LockKeyhole, Mail, ShieldCheck, UserRound } from 'lucide-react';
import { motion } from 'framer-motion';
import { Container } from '../../components/common/Container';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { authService } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

export const SystemAdminSetupPage = () => {
  const { setupSystemAdmin } = useAuth();
  const { toastError } = useToast();
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (authService.hasSystemAdmin()) navigate('/login', { replace: true });
  }, [navigate]);

  // ── Field validation ──
  const validateField = useCallback((field, values) => {
    const v = values || { name, email, password, confirmPassword };
    switch (field) {
      case 'name':
        if (!v.name.trim()) return 'الاسم مطلوب.';
        return '';
      case 'email':
        if (!v.email.trim()) return 'البريد الإلكتروني مطلوب.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) return 'صيغة البريد الإلكتروني غير صحيحة.';
        return '';
      case 'password':
        if (!v.password) return 'كلمة المرور مطلوبة.';
        if (v.password.length < 8) return 'كلمة المرور يجب أن تكون 8 أحرف على الأقل.';
        return '';
      case 'confirmPassword':
        if (!v.confirmPassword) return 'يرجى تأكيد كلمة المرور.';
        if (v.password !== v.confirmPassword) return 'كلمتا المرور غير متطابقتين.';
        return '';
      default:
        return '';
    }
  }, [name, email, password, confirmPassword]);

  const validateAll = useCallback(() => {
    const fields = ['name', 'email', 'password', 'confirmPassword'];
    const values = { name, email, password, confirmPassword };
    const errs = {};
    fields.forEach((f) => {
      const msg = validateField(f, values);
      if (msg) errs[f] = msg;
    });
    return errs;
  }, [name, email, password, confirmPassword, validateField]);

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

  const handleFieldChange = useCallback((field, setter) => (event) => {
    const val = event.target.value;
    setter(val);

    const values = { name, email, password, confirmPassword, [field]: val };

    if (touched[field] || submitted) {
      const msg = validateField(field, values);
      setErrors((prev) => {
        const next = { ...prev };
        if (msg) { next[field] = msg; } else { delete next[field]; }
        return next;
      });
    }

    if (field === 'password' && (touched.confirmPassword || submitted)) {
      const confirmMsg = validateField('confirmPassword', values);
      setErrors((prev) => {
        const next = { ...prev };
        if (confirmMsg) { next.confirmPassword = confirmMsg; } else { delete next.confirmPassword; }
        return next;
      });
    }
  }, [name, email, password, confirmPassword, touched, submitted, validateField]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);

    const errs = validateAll();
    setErrors(errs);
    setTouched({ name: true, email: true, password: true, confirmPassword: true });

    if (Object.keys(errs).length > 0) {
      const firstErrorField = ['name', 'email', 'password', 'confirmPassword'].find((f) => errs[f]);
      if (firstErrorField && formRef.current) {
        const el = formRef.current.querySelector(`[name="${firstErrorField}"]`);
        if (el) el.focus();
      }
      return;
    }

    setLoading(true);
    try {
      await setupSystemAdmin({ name, email, password, confirmPassword });
      navigate('/admin', { replace: true });
    } catch (error) {
      toastError(error.message || 'تعذر إعداد حساب مدير النظام.');
    } finally {
      setLoading(false);
    }
  };

  if (authService.hasSystemAdmin()) return null;

  return (
    <div className="flex min-h-[75vh] items-center justify-center py-12">
      <Container className="max-w-md">
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-l3 flex flex-col gap-6 rounded-3xl border border-white/20 p-8 shadow-2xl sm:p-10">
          <header className="flex flex-col items-center gap-2 text-center">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[var(--color-digital-blue-500)] to-[var(--color-digital-blue-500)] text-white shadow-lg">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h1 className="font-display text-2xl font-black text-[var(--color-text-primary)]">إعداد مدير النظام</h1>
            <p className="text-xs text-[var(--color-text-muted)]">أنشئ حساب مدير النظام مرة واحدة.</p>
          </header>

          <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <Input
              name="name"
              label="الاسم"
              icon={UserRound}
              value={name}
              error={(touched.name || submitted) ? errors.name : undefined}
              onChange={handleFieldChange('name', setName)}
              onBlur={() => handleBlur('name')}
            />
            <Input
              name="email"
              label="البريد الإلكتروني"
              type="email"
              icon={Mail}
              value={email}
              error={(touched.email || submitted) ? errors.email : undefined}
              onChange={handleFieldChange('email', setEmail)}
              onBlur={() => handleBlur('email')}
            />
            <Input
              name="password"
              label="كلمة المرور (8 أحرف على الأقل)"
              type="password"
              icon={LockKeyhole}
              value={password}
              error={(touched.password || submitted) ? errors.password : undefined}
              onChange={handleFieldChange('password', setPassword)}
              onBlur={() => handleBlur('password')}
            />
            <Input
              name="confirmPassword"
              label="تأكيد كلمة المرور"
              type="password"
              icon={LockKeyhole}
              value={confirmPassword}
              error={(touched.confirmPassword || submitted) ? errors.confirmPassword : undefined}
              onChange={handleFieldChange('confirmPassword', setConfirmPassword)}
              onBlur={() => handleBlur('confirmPassword')}
            />
            <Button type="submit" variant="primary" fullWidth isLoading={loading} icon={ShieldCheck}>إنشاء حساب مدير النظام</Button>
          </form>

          <Link to="/login" className="text-center text-xs font-bold text-[var(--color-digital-blue-500)] hover:underline">العودة إلى تسجيل الدخول</Link>
        </motion.section>
      </Container>
    </div>
  );
};
