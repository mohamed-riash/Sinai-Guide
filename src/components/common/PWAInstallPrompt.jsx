import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, Share, X } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { useToast } from '../../hooks/useToast';
import { Logo } from './Logo';

const DISMISSED_KEY = 'sinai_pwa_install_dismissed';
const DISMISS_COOLDOWN = 7 * 24 * 60 * 60 * 1000;

const wasRecentlyDismissed = () => {
  try {
    const dismissedAt = Number(localStorage.getItem(DISMISSED_KEY));
    return Number.isFinite(dismissedAt) && Date.now() - dismissedAt < DISMISS_COOLDOWN;
  } catch {
    return false;
  }
};

const rememberDismissal = () => {
  try {
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
  } catch {
    // Installation remains available for this session when storage is blocked.
  }
};

const clearDismissal = () => {
  try {
    localStorage.removeItem(DISMISSED_KEY);
  } catch {
    // A newly available browser prompt is still shown when storage is blocked.
  }
};

export const PWAInstallPrompt = () => {
  const { canInstall, install, isInstalled, isIOS } = usePWAInstall();
  const { toastError } = useToast();
  const [visible, setVisible] = useState(false);
  const [iosRequested, setIosRequested] = useState(false);
  const hadInstallOpportunity = useRef(canInstall);

  useEffect(() => {
    const newlyAvailable = canInstall && !hadInstallOpportunity.current;
    hadInstallOpportunity.current = canInstall;

    if (isInstalled || (!canInstall && !isIOS)) return undefined;

    if (canInstall) {
      if (newlyAvailable) clearDismissal();
      else if (wasRecentlyDismissed()) return undefined;
      const frame = window.requestAnimationFrame(() => setVisible(true));
      return () => window.cancelAnimationFrame(frame);
    }

    if (wasRecentlyDismissed()) return undefined;

    if (!isIOS) return undefined;

    let requested = false;
    const revealInstructions = () => {
      if (requested) return;
      requested = true;
      window.removeEventListener('pointerdown', revealInstructions);
      window.removeEventListener('keydown', revealInstructions);
      setIosRequested(true);
      window.setTimeout(() => setVisible(true), 900);
    };
    window.addEventListener('pointerdown', revealInstructions, { once: true, passive: true });
    window.addEventListener('keydown', revealInstructions, { once: true });
    return () => {
      window.removeEventListener('pointerdown', revealInstructions);
      window.removeEventListener('keydown', revealInstructions);
    };
  }, [canInstall, isIOS, isInstalled]);

  const dismiss = useCallback(() => {
    rememberDismissal();
    setVisible(false);
  }, []);

  const handleInstall = useCallback(async () => {
    const result = await install();
    if (result.outcome === 'error') {
      toastError('تعذّر فتح نافذة التثبيت. حاول مرة أخرى من المتصفح.');
    }
    setVisible(false);
  }, [install, toastError]);

  const canShow = visible && !isInstalled && (canInstall || (isIOS && iosRequested));

  return (
    <AnimatePresence>
      {canShow && (
        <motion.aside
          dir="rtl"
          role="region"
          aria-live="polite"
          aria-label="تثبيت Sinai Guide"
          initial={{ opacity: 0, y: -12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="fixed left-1/2 top-[calc(env(safe-area-inset-top)+1rem)] z-[60] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-l3)] p-4 shadow-xl backdrop-blur-lg sm:p-5"
        >
          <button
            type="button"
            onClick={dismiss}
            aria-label="ليس الآن"
            className="absolute left-2 top-2 rounded-full p-2 text-[var(--color-text-muted)] transition hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-digital-blue-500)] dark:hover:bg-white/10"
          >
            <X size={18} aria-hidden="true" />
          </button>

          <div className="flex items-start gap-3 pl-7">
            <Logo className="size-11 shrink-0" />
            <div className="min-w-0 pt-0.5">
              <h2 className="font-bold text-[var(--color-text-primary)]">ثبّت Sinai Guide على جهازك</h2>
              <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                ثبّت التطبيق للوصول إليه بسرعة من جهازك.
              </p>
            </div>
          </div>

          {canInstall ? (
            <button
              type="button"
              onClick={handleInstall}
              className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-digital-blue-500)] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[var(--color-digital-blue-600)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-digital-blue-400)] focus-visible:ring-offset-2"
            >
              <Download size={17} aria-hidden="true" />
              تثبيت التطبيق
            </button>
          ) : (
            <div className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
              <Share size={18} className="mt-0.5 shrink-0 text-[var(--color-digital-blue-500)]" aria-hidden="true" />
              <ol className="list-decimal space-y-1 pr-4">
                <li>افتح قائمة المشاركة في Safari.</li>
                <li>اختر «إضافة إلى الشاشة الرئيسية».</li>
                <li>اضغط «إضافة».</li>
              </ol>
            </div>
          )}

          <button
            type="button"
            onClick={dismiss}
            className="mt-2 min-h-10 w-full rounded-xl px-4 py-2 text-sm font-semibold text-[var(--color-text-muted)] transition hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-digital-blue-500)] dark:hover:bg-white/5"
          >
            ليس الآن
          </button>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
