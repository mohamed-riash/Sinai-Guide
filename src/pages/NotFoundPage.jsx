import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';
import { Container } from '../components/common/Container';
import { Button } from '../components/common/Button';

export const NotFoundPage = () => {
  return (
    <div className="py-20 flex items-center justify-center min-h-[70vh]">
      <Container className="max-w-md text-center flex flex-col items-center gap-6">
        <div className="w-20 h-20 rounded-3xl bg-[var(--color-terracotta)]/20 text-[var(--color-terracotta)] flex items-center justify-center mb-2 animate-bounce shadow-lg">
          <Compass className="w-10 h-10" />
        </div>
        <h1 className="text-5xl font-extrabold font-display text-[var(--color-text-primary)]">404</h1>
        <h2 className="text-xl font-bold font-display text-[var(--color-text-primary)]">الصفحة غير موجودة</h2>
        <p className="text-sm text-[var(--color-text-secondary)] max-w-xs leading-relaxed">
          الوجهة أو الصفحة التي تبحث عنها في دليل سيناء ربما تم نقلها أو لم تعد موجودة.
        </p>

        <Link to="/">
          <Button variant="primary" icon={Home} className="mt-4">
            العودة للصفحة الرئيسية
          </Button>
        </Link>
      </Container>
    </div>
  );
};

