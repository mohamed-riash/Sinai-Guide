import React, { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { storageService } from './services/storageService';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { CityProvider } from './contexts/CityContext';
import { CartProvider } from './contexts/CartContext';
import { ToastProvider } from './contexts/ToastContext';
import { ConfirmProvider } from './contexts/ConfirmContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileNavigation } from './components/layout/MobileNavigation';
import { CartDrawer } from './components/ordering/CartDrawer';
import { AppRoutes } from './routes/AppRoutes';
import { PWAInstallPrompt } from './components/common/PWAInstallPrompt';
import { PWAStatus } from './components/common/PWAStatus';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const LayoutContainer = ({ children }) => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/business') || location.pathname.startsWith('/admin');

  return (
    <div className={`min-h-screen flex flex-col justify-between ${!isDashboard ? 'pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-0' : ''}`}>
      <div>
        {!isDashboard && <Navbar />}
        <main>{children}</main>
      </div>
      {!isDashboard && <Footer />}
      {!isDashboard && <MobileNavigation />}
      <CartDrawer />
    </div>
  );
};

export function App() {
  useEffect(() => {
    storageService.migrateLegacyDemoData();
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <AuthProvider>
          <CityProvider>
            <CartProvider>
              <ToastProvider>
                <ConfirmProvider>
                  <BrowserRouter>
                    <ScrollToTop />
                    <LayoutContainer>
                      <AppRoutes />
                    </LayoutContainer>
                    <PWAInstallPrompt />
                    <PWAStatus />
                  </BrowserRouter>
                </ConfirmProvider>
              </ToastProvider>
            </CartProvider>
          </CityProvider>
        </AuthProvider>
      </ThemeProvider>
    </MotionConfig>
  );
}

export default App;
