import React, { useState } from 'react';
import { GraduationCap, LogOut, Sparkles, LayoutDashboard, Compass, Sun, Moon, Menu, X } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, user, onOpenAuth, onLogout, theme, onToggleTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleNavigate(page) {
    setActivePage(page);
    setMobileMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => handleNavigate('landing')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 dark:shadow-indigo-950 group-hover:scale-105 transition-transform shrink-0">
            <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-white tracking-tight">Edu<span className="text-indigo-600 dark:text-indigo-400">Track</span></span>
            <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">AI</span>
          </div>
        </div>

        {/* Desktop Navigation links */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => handleNavigate('landing')}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 ${
              activePage === 'landing'
                ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Beranda
          </button>
          <button
            onClick={() => {
              if (!user) {
                onOpenAuth('register');
              } else {
                handleNavigate('assessment');
              }
            }}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 flex items-center gap-1.5 ${
              activePage === 'assessment'
                ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Compass className="w-4 h-4 text-indigo-500" />
            Asesmen Belajar
          </button>
          <button
            onClick={() => {
              if (!user) {
                onOpenAuth('login');
              } else {
                handleNavigate('dashboard');
              }
            }}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 flex items-center gap-1.5 ${
              activePage === 'dashboard'
                ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-indigo-500" />
            Dashboard & What-If
          </button>
        </nav>

        {/* Right Action: Theme toggle + Auth + Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dark / Light Mode Toggle Button */}
          <button
            onClick={onToggleTheme}
            type="button"
            title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all duration-300 shadow-sm flex items-center justify-center shrink-0"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 transition-transform duration-300 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 transition-transform duration-300 hover:-rotate-12" />
            )}
          </button>

          {/* Desktop Auth */}
          <div className="hidden sm:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2.5">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[120px] truncate">{user.name || user.email.split('@')[0]}</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center justify-end gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs border border-indigo-200 dark:border-indigo-800 shrink-0">
                  {(user.name || user.email)[0].toUpperCase()}
                </div>
                <button
                  onClick={onLogout}
                  title="Keluar"
                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Masuk
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-3.5 py-1.5 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-lg shadow-sm shadow-indigo-300 dark:shadow-indigo-950 hover:shadow-indigo-400 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Daftar
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            className="md:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 pt-3 pb-5 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => handleNavigate('landing')}
              className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-left transition-colors ${
                activePage === 'landing'
                  ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              🏠 Beranda
            </button>
            <button
              onClick={() => {
                if (!user) {
                  onOpenAuth('register');
                  setMobileMenuOpen(false);
                } else {
                  handleNavigate('assessment');
                }
              }}
              className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-left transition-colors flex items-center gap-2 ${
                activePage === 'assessment'
                  ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Compass className="w-4 h-4 text-indigo-500" />
              Asesmen Belajar
            </button>
            <button
              onClick={() => {
                if (!user) {
                  onOpenAuth('login');
                  setMobileMenuOpen(false);
                } else {
                  handleNavigate('dashboard');
                }
              }}
              className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-left transition-colors flex items-center gap-2 ${
                activePage === 'dashboard'
                  ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-indigo-500" />
              Dashboard & What-If
            </button>
          </div>

          {/* Mobile User Profile & Auth */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            {user ? (
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs">
                    {(user.name || user.email)[0].toUpperCase()}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate max-w-[150px]">{user.name || user.email}</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Online</span>
                  </div>
                </div>
                <button
                  onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => { onOpenAuth('login'); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 text-center text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl"
                >
                  Masuk
                </button>
                <button
                  onClick={() => { onOpenAuth('register'); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 text-center text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl"
                >
                  Daftar Akun
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
