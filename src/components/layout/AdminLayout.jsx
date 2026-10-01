import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Menu, X, Sun, Moon, Shield } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { UserAvatar } from '../common/UserAvatar';

export const AdminLayout = ({ children, title = 'Admin Portal' }) => {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen w-full min-w-0 bg-[var(--color-bg)] flex p-2 sm:p-4 gap-3 sm:gap-4" dir="rtl">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-[min(16rem,calc(100vw-2rem))] bg-[var(--color-surface)] h-full p-4 overflow-y-auto">
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <Sidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 w-0">
        <header className="glass-panel min-w-0 p-3 sm:p-4 mb-6 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl glass-input text-slate-700 dark:text-slate-200"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <Shield className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-bold font-display text-slate-900 dark:text-white">{title}</h1>
                <p className="text-xs text-slate-500">North Sinai Tourism Platform Administration</p>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl glass-input text-slate-700 dark:text-slate-200"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <div className="flex items-center gap-2.5 pl-3 border-l border-white/10">
              <UserAvatar src={user?.avatar} name={user?.name} className="w-8 h-8 rounded-xl object-cover border border-amber-400" />
              <span className="hidden sm:inline text-xs font-bold text-amber-400">
                {user?.name}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 pb-16">
          {children}
        </main>
      </div>
    </div>
  );
};
