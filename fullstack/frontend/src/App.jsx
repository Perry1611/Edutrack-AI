import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import AuthModal from './components/AuthModal';
import AssessmentWizard from './components/AssessmentWizard';
import Dashboard from './components/Dashboard';
import { getLatestAssessment } from './services/api';

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('edutrack_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activePage, setActivePage] = useState('landing'); // 'landing' | 'assessment' | 'dashboard'
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'

  const [assessmentResult, setAssessmentResult] = useState(() => {
    try {
      const saved = localStorage.getItem('edutrack_result');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [baselineInput, setBaselineInput] = useState(() => {
    try {
      const saved = localStorage.getItem('edutrack_input');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('edutrack_theme');
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  // Apply theme to html root element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('edutrack_theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }

  // Sync state to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('edutrack_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('edutrack_user');
    }
  }, [user]);

  useEffect(() => {
    if (assessmentResult) {
      localStorage.setItem('edutrack_result', JSON.stringify(assessmentResult));
    }
  }, [assessmentResult]);

  useEffect(() => {
    if (baselineInput) {
      localStorage.setItem('edutrack_input', JSON.stringify(baselineInput));
    }
  }, [baselineInput]);

  function handleOpenAuth(mode = 'login') {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  }

  function handleAuthSuccess(authenticatedUser) {
    setUser(authenticatedUser);
    // If user has not completed assessment, take them to assessment; otherwise if they already have one, dashboard or assessment
    if (!assessmentResult) {
      setActivePage('assessment');
    } else {
      setActivePage('dashboard');
    }
  }

  function handleLogout() {
    setUser(null);
    localStorage.removeItem('edutrack_user');
    setActivePage('landing');
  }

  function handleStartAssessment() {
    if (!user) {
      handleOpenAuth('register');
    } else {
      setActivePage('assessment');
    }
  }

  function handleAssessmentComplete(result, inputData) {
    setAssessmentResult(result);
    setBaselineInput(inputData);
    setActivePage('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white transition-colors duration-300">
      {/* Header Navigation */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        user={user}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activePage === 'landing' && (
          <LandingPage
            onStartAssessment={handleStartAssessment}
            onOpenAuth={handleOpenAuth}
            user={user}
          />
        )}

        {activePage === 'assessment' && (
          <AssessmentWizard
            user={user}
            onComplete={handleAssessmentComplete}
          />
        )}

        {activePage === 'dashboard' && (
          <Dashboard
            user={user}
            assessmentResult={assessmentResult}
            baselineInput={baselineInput}
            onRetake={() => setActivePage('assessment')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            EduTrack AI • MPTI Capstone Project
          </p>
          <p>
            Memprediksi Kinerja Belajar Siswa Berbasis Dataset Empiris & Simulasi Interaktif What-If
          </p>
        </div>
      </footer>

      {/* Supabase Email Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
