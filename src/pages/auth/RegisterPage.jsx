import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, Phone, UserPlus, Compass } from 'lucide-react';
import { motion } from 'framer-motion';
import { Container } from '../../components/common/Container';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

export const RegisterPage = () => {
  const { register } = useAuth();
  const { toastSuccess, toastError } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialRole = searchParams.get('role') === 'business_owner' ? 'business_owner' : 'customer';

  const [role, setRole] = useState(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'الاسم الكامل مطلوب.';
    if (!email.trim()) errs.email = 'البريد الإلكتروني مطلوب.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.email = 'صيغة البريد الإلكتروني غير صحيحة.';
    if (!phone.trim()) errs.phone = 'رقم الهاتف مطلوب.';
    if (!password) errs.password = 'كلمة المرور مطلوبة.';
    else if (password.length < 6) errs.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل.';
    if (password !== confirmPassword) errs.confirmPassword = 'كلمتا المرور غير متطابقتين.';


    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

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
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#A85F48] to-[#C99545] flex items-center justify-center text-white shadow-lg mb-2">
              <Compass className="w-7 h-7 animate-spin-slow" />
            </div>
            <h1 className="text-2xl font-black font-display text-[var(--color-text-primary)]">إنشاء حساب جديد</h1>
            <p className="text-xs text-[var(--color-text-muted)] font-medium">انضم لمنصة السياحة والاستكشاف في شمال سيناء</p>
          </div>

          {/* Role Toggle Selector */}
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl glass-l1 border border-white/10">
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`py-2.5 rounded-xl text-xs font-bold transition ${
                role === 'customer' ? 'bg-[#A85F48] text-white shadow-md' : 'text-[var(--color-text-secondary)] hover:text-[#A85F48]'
              }`}
            >
              سائح / مقيم
            </button>
            <button
              type="button"
              onClick={() => setRole('business_owner')}
              className={`py-2.5 rounded-xl text-xs font-bold transition ${
                role === 'business_owner' ? 'bg-[#174A4D] text-white shadow-md' : 'text-[var(--color-text-secondary)] hover:text-[#174A4D]'
              }`}
            >
              صاحب نشاط تجاري
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="الاسم الكامل"
              icon={User}
              placeholder="مثال: الاسم"
              value={name}
              error={errors.name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                label="رقم الهاتف"
                icon={Phone}
                placeholder="+20 10 XXXX XXXX"
                value={phone}
                error={errors.phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="كلمة المرور"
                type="password"
                icon={Lock}
                placeholder="••••••••"
                value={password}
                error={errors.password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                label="تأكيد كلمة المرور"
                type="password"
                icon={Lock}
                placeholder="••••••••"
                value={confirmPassword}
                error={errors.confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <Button type="submit" variant="primary" fullWidth isLoading={loading} icon={UserPlus} className="py-3.5 mt-2 font-bold text-sm">
              إنشاء الحساب
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-200/40 dark:border-white/10 text-center text-xs text-[var(--color-text-muted)] font-semibold">
            لديك حساب بالفعل؟{' '}
            <Link to="/login" className="font-bold text-[#A85F48] hover:underline">
              تسجيل الدخول
            </Link>
          </div>
        </motion.div>
      </Container>
    </div>
  );
};

