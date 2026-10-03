import { useSyncExternalStore } from 'react';

const listeners = new Set();
let deferredPrompt = null;
let appInstalled = false;
let installedSignal = false;
let listenersAttached = false;

const isIOSDevice = () => {
  if (typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

const isIOSSafari = () => isIOSDevice()
  && typeof navigator !== 'undefined'
  && /Safari/i.test(navigator.userAgent)
  && !/(CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo)/i.test(navigator.userAgent);

const detectStandalone = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(display-mode: standalone)').matches === true
    || window.navigator.standalone === true;
};

let snapshot = {
  canInstall: false,
  isInstalled: false,
  isSupported: false,
  isIOS: false,
  isStandalone: false,
};

const updateSnapshot = () => {
  const isStandalone = detectStandalone() || installedSignal;
  const isIOS = isIOSSafari();
  const isInstalled = isStandalone || appInstalled;
  const nextSnapshot = {
    canInstall: Boolean(deferredPrompt) && !isInstalled,
    isInstalled,
    isSupported: Boolean(deferredPrompt) || isIOS,
    isIOS,
    isStandalone,
  };

  if (Object.keys(nextSnapshot).some((key) => nextSnapshot[key] !== snapshot[key])) {
    snapshot = nextSnapshot;
    listeners.forEach((listener) => listener());
  }
};

const onBeforeInstallPrompt = (event) => {
  if (detectStandalone() || appInstalled) return;
  event.preventDefault();
  deferredPrompt = event;
  updateSnapshot();
};

const onAppInstalled = () => {
  appInstalled = true;
  installedSignal = true;
  deferredPrompt = null;
  updateSnapshot();
};

const onDisplayModeChange = () => updateSnapshot();

const attachBrowserListeners = () => {
  if (listenersAttached || typeof window === 'undefined') return;
  listenersAttached = true;
  window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
  window.addEventListener('appinstalled', onAppInstalled);
  window.matchMedia?.('(display-mode: standalone)')
    .addEventListener?.('change', onDisplayModeChange);
  updateSnapshot();
};

// Attach at module load so the browser event is captured before React effects run.
attachBrowserListeners();

const subscribe = (listener) => {
  attachBrowserListeners();
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => snapshot;

export const usePWAInstall = () => {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const install = async () => {
    const promptEvent = deferredPrompt;
    if (!promptEvent || state.isInstalled) return { outcome: 'unavailable' };

    // Call prompt synchronously within the invoking click handler's user gesture.
    deferredPrompt = null;
    updateSnapshot();

    try {
      const promptResult = promptEvent.prompt();
      await promptResult;
      const choice = await promptEvent.userChoice;
      return choice;
    } catch (error) {
      return { outcome: 'error', error };
    }
  };

  return { ...state, install };
};
