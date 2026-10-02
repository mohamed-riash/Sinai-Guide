import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Compass, Download, Share, X } from 'lucide-react';

const DISMISSED_KEY = 'sinai_pwa_install_dismissed';

const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
const isIOS = () => /iphone|ipad|ipod/i.test(window.navigator.userAgent) || (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);

export const PWAInstallPrompt = () => {
  const [installEvent, setInstallEvent] = useState(null);
  const [visible, setVisible] = useState(false);
  const [ios] = useState(() => !isStandalone() && isIOS());

  useEffect(() => {
    if (isStandalone() || localStorage.getItem(DISMISSED_KEY)) return undefined;
    let interacted = false;
    const showAfterInteraction = () => {
      if (interacted) return;
      interacted = true;
      window.setTimeout(() => setVisible(true), 1800);
    };
    const onBeforeInstall = (event) => {
      event.preventDefault();
      setInstallEvent(event);
    };
    const onInstalled = () => {
      setVisible(false);
      localStorage.setItem(DISMISSED_KEY, 'installed');
    };
    window.addEventListener('pointerdown', showAfterInteraction, { once: true, passive: true });
    window.addEventListener('keydown', showAfterInteraction, { once: true });
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('pointerdown', showAfterInteraction);
      window.removeEventListener('keydown', showAfterInteraction);
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, 'dismissed');
    setVisible(false);
  };

  const install = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === 'accepted') setVisible(false);
    setInstallEvent(null);
  };

  const canShow = visible && (installEvent || ios);
  return (
    <AnimatePresence>
      {canShow && (
        <motion.aside
          dir="rtl"
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.98 }}
          transition={{ duration: 0.25 }}
          className="fixed z-[45] bottom-[calc(env(safe-area-inset-bottom)+6.5rem)] lg:bottom-6 inset-x-4 sm:inset-x-auto sm:left-6 sm:w-[min(24rem,calc(100vw-2rem))] rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-l3)] p-5 shadow-2xl backdrop-blur-2xl"
          aria-label="تثبيت التطبيق"
        >
          <button onClick={dismiss} aria-label="إغلاق" className="absolute left-3 top-3 rounded-full p-2 text-[var(--color-text-muted)] hover:bg-black/5 dark:hover:bg-white/10"><X size={18} /></button>
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-digital-blue-500)] to-[var(--color-digital-blue-700)] text-white shadow-lg"><Compass size={25} /></div>
            <div className="pt-0.5">
              <h2 className="font-bold text-[var(--color-text-primary)]">ثبّت Sinai Guide</h2>
              <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">خلّي دليلك لسيناء معاك ووصل للأماكن والخدمات بسرعة.</p>
            </div>
          </div>
          {ios && !installEvent && <p className="mt-3 flex items-start gap-2 text-sm text-[var(--color-text-secondary)]"><Share size={17} className="mt-0.5 shrink-0 text-[var(--color-digital-blue-500)]" />من قائمة المشاركة في Safari اختر «إضافة إلى الشاشة الرئيسية».</p>}
          {installEvent && <button onClick={install} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-digital-blue-500)] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[var(--color-digital-blue-500)]/20 transition hover:bg-[var(--color-digital-blue-600)]"><Download size={17} />تثبيت التطبيق</button>}
          <button onClick={dismiss} className="mt-2 w-full rounded-xl px-4 py-2 text-sm font-semibold text-[var(--color-text-muted)] hover:bg-black/5 dark:hover:bg-white/5">لاحقاً</button>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
