import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import AuthModal from './components/AuthModal';
import AssessmentWizard from './components/AssessmentWizard';
import Dashboard from './components/Dashboard';
import RetakeConfirmModal from './components/RetakeConfirmModal';
import { getLatestAssessment, getAssessmentHistory } from './services/api';

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
  const [retakeModalOpen, setRetakeModalOpen] = useState(false);
  const [isFreshAssessment, setIsFreshAssessment] = useState(false);

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

  const [assessmentHistory, setAssessmentHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('edutrack_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
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

  // Load real user assessment history from API / Database
  useEffect(() => {
    let active = true;

    async function loadRealUserHistory() {
      const activeUserId = user?.id || (user ? user.email : null);
      if (!activeUserId) {
        // Guest mode or not logged in: check local storage cache
        const localSaved = localStorage.getItem('edutrack_history_guest');
        if (active) {
          setAssessmentHistory(localSaved ? JSON.parse(localSaved) : []);
        }
        return;
      }

      try {
        const rawHistory = await getAssessmentHistory(activeUserId);
        if (active && rawHistory && rawHistory.length > 0) {
          const formatted = rawHistory.map(r => {
            const dateObj = new Date(r.created_at);
            return {
              id: r.id,
              date: dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
              fullDate: dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
              score: Math.round(Number(r.predicted_score || 0)),
              category: r.category || 'Sedang',
              timestamp: dateObj.getTime()
            };
          });
          setAssessmentHistory(formatted);
          localStorage.setItem(`edutrack_history_${activeUserId}`, JSON.stringify(formatted));
        } else if (active) {
          // If no history on remote yet, check user's local cache or start empty
          const localSaved = localStorage.getItem(`edutrack_history_${activeUserId}`);
          setAssessmentHistory(localSaved ? JSON.parse(localSaved) : []);
        }
      } catch (err) {
        console.warn('Could not fetch remote history, using local cache:', err);
        const localSaved = localStorage.getItem(`edutrack_history_${activeUserId}`);
        if (active) {
          setAssessmentHistory(localSaved ? JSON.parse(localSaved) : []);
        }
      }
    }

    loadRealUserHistory();
    return () => { active = false; };
  }, [user]);

  function handleOpenAuth(mode = 'login') {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  }

  function handleAuthSuccess(authenticatedUser) {
    setUser(authenticatedUser);
    if (!assessmentResult) {
      setActivePage('assessment');
    } else {
      setActivePage('dashboard');
    }
  }

  function handleLogout() {
    setUser(null);
    setAssessmentResult(null);
    setBaselineInput(null);
    setAssessmentHistory([]);
    localStorage.removeItem('edutrack_user');
    localStorage.removeItem('edutrack_result');
    localStorage.removeItem('edutrack_input');
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
    setIsFreshAssessment(false);

    // Format real date of current assessment
    const today = new Date();
    const todayDateStr = today.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

    const newEntry = {
      id: Date.now().toString(),
      date: todayDateStr,
      fullDate: today.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      score: Math.round(result.predictedScore || result.score || 0),
      category: result.category || 'Sedang',
      timestamp: today.getTime()
    };

    const activeUserId = user?.id || (user ? user.email : 'guest');
    setAssessmentHistory(prev => {
      const updated = [...prev, newEntry];
      localStorage.setItem(`edutrack_history_${activeUserId}`, JSON.stringify(updated));
      return updated;
    });

    setActivePage('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleConfirmRetake() {
    // 1. Clear old assessment result & input
    setAssessmentResult(null);
    setBaselineInput(null);
    localStorage.removeItem('edutrack_result');
    localStorage.removeItem('edutrack_input');

    // 2. Set fresh assessment flag so form begins empty
    setIsFreshAssessment(true);
    setRetakeModalOpen(false);
    setActivePage('assessment');
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
            isFreshRetake={isFreshAssessment}
          />
        )}

        {activePage === 'dashboard' && (
          <Dashboard
            user={user}
            assessmentResult={assessmentResult}
            baselineInput={baselineInput}
            onRetake={() => setRetakeModalOpen(true)}
            onOpenRetakeModal={() => setRetakeModalOpen(true)}
            assessmentHistory={assessmentHistory}
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
            Platform Cerdas Evaluasi dan Simulasi Peningkatan Kinerja Belajar Siswa
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

      {/* Confirmation Retake Modal */}
      <RetakeConfirmModal
        isOpen={retakeModalOpen}
        onClose={() => setRetakeModalOpen(false)}
        onConfirm={handleConfirmRetake}
      />
    </div>
  );
}
