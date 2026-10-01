import React, { useEffect, useState } from 'react';
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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authService.hasSystemAdmin()) navigate('/login', { replace: true });
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
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
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#A85F48] to-[#C99545] text-white shadow-lg">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h1 className="font-display text-2xl font-black text-[var(--color-text-primary)]">إعداد مدير النظام</h1>
            <p className="text-xs text-[var(--color-text-muted)]">أنشئ حساب مدير النظام مرة واحدة.</p>
          </header>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input label="الاسم" icon={UserRound} value={name} onChange={(event) => setName(event.target.value)} required />
            <Input label="البريد الإلكتروني" type="email" icon={Mail} value={email} onChange={(event) => setEmail(event.target.value)} required />
            <Input label="كلمة المرور (8 أحرف على الأقل)" type="password" icon={LockKeyhole} value={password} onChange={(event) => setPassword(event.target.value)} required />
            <Input label="تأكيد كلمة المرور" type="password" icon={LockKeyhole} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
            <Button type="submit" variant="primary" fullWidth isLoading={loading} icon={ShieldCheck}>إنشاء حساب مدير النظام</Button>
          </form>

          <Link to="/login" className="text-center text-xs font-bold text-[#A85F48] hover:underline">العودة إلى تسجيل الدخول</Link>
        </motion.section>
      </Container>
    </div>
  );
};
