import React, { useState } from 'react';
import { 
  CheckCircle2, ArrowRight, ArrowLeft, Sparkles, BookOpen, 
  Home, Smile, Loader2
} from 'lucide-react';
import { QUESTIONS, QUESTION_CATEGORIES, INITIAL_FORM_VALUES } from '../data/questions';
import { predictPerformance, saveAssessment } from '../services/api';

export default function AssessmentWizard({ user, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(INITIAL_FORM_VALUES);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const currentCategory = QUESTION_CATEGORIES[currentStep];
  const questionsInStep = QUESTIONS.filter(q => q.category === currentCategory.id);

  function handleInputChange(key, value) {
    setFormData(prev => ({ ...prev, [key]: value }));
  }

  function handleNext() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (currentStep < QUESTION_CATEGORIES.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }

  function handleBack() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }

  async function handleSubmit() {
    setErrorMsg('');
    setLoading(true);

    try {
      const results = await predictPerformance(formData);
      const userId = user?.id || 'demo-student';
      await saveAssessment(userId, formData, results);
      onComplete(results, formData);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Gagal memproses prediksi skor.');
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14 transition-colors duration-300">
      {/* Step Header */}
      <div className="mb-8 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          Asesmen Variabel Pembelajaran Siswa
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Ketahui Estimasi Skor Belajar & Rekomendasimu
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm max-w-xl mx-auto">
          Isi 19 pertanyaan berikut sesuai kebiasaan dan kondisi belajarmu sehari-hari. Model AI kami akan menganalisis profilmu secara instan.
        </p>

        {/* Progress Bar */}
        <div className="pt-4 max-w-md mx-auto">
          <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
            <span>Bagian {currentStep + 1} dari {QUESTION_CATEGORIES.length}</span>
            <span>{Math.round(((currentStep + 1) / QUESTION_CATEGORIES.length) * 100)}% Selesai</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-600 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${((currentStep + 1) / QUESTION_CATEGORIES.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Tabs indicator */}
        <div className="flex justify-center gap-3 pt-3">
          {QUESTION_CATEGORIES.map((cat, idx) => (
            <button
              key={cat.id}
              onClick={() => setCurrentStep(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                currentStep === idx
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {idx === 0 && <BookOpen className="w-3.5 h-3.5" />}
              {idx === 1 && <Home className="w-3.5 h-3.5" />}
              {idx === 2 && <Smile className="w-3.5 h-3.5" />}
              <span>{cat.title.split('&')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Questions Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/60 dark:shadow-slate-950 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 space-y-8 transition-colors duration-300">
        
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              {currentStep === 0 && <BookOpen className="w-5 h-5" />}
              {currentStep === 1 && <Home className="w-5 h-5" />}
              {currentStep === 2 && <Smile className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">{currentCategory.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Jawab pertanyaan berikut dengan jujur untuk prediksi yang akurat</p>
            </div>
          </div>
        </div>

        {/* Question Items */}
        <div className="space-y-8 divide-y divide-slate-100 dark:divide-slate-800">
          {questionsInStep.map((q, idx) => (
            <div key={q.key} className={idx > 0 ? 'pt-6' : ''}>
              <div className="mb-3">
                <label className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 block">
                  {idx + 1}. {q.label}
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{q.description}</p>
              </div>

              {/* Render input by type - Full Width & Rata */}
              <div className="mt-3 w-full">
                {q.type === 'slider' && (
                  <div className="space-y-2.5 w-full bg-slate-50 dark:bg-slate-800/60 p-4 sm:p-5 rounded-xl border border-slate-200/70 dark:border-slate-700">
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-600 dark:text-slate-300">
                      <span>Rentang: {q.min} {q.unit}</span>
                      <span className="text-indigo-700 dark:text-indigo-300 font-bold text-base px-3 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-950/90 border border-indigo-200 dark:border-indigo-800 shadow-sm">
                        {formData[q.key]} {q.unit}
                      </span>
                      <span>Maks: {q.max} {q.unit}</span>
                    </div>
                    <input
                      type="range"
                      min={q.min}
                      max={q.max}
                      step={q.step || 1}
                      value={formData[q.key]}
                      onChange={(e) => handleInputChange(q.key, Number(e.target.value))}
                      className="w-full accent-indigo-600 h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer transition-all"
                    />
                  </div>
                )}

                {q.type === 'counter' && (
                  <div className="w-full bg-slate-50 dark:bg-slate-800/60 p-4 sm:p-5 rounded-xl border border-slate-200/70 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Tentukan jumlah ({q.unit}):
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleInputChange(q.key, Math.max(q.min, (formData[q.key] || 0) - 1))}
                        className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-lg flex items-center justify-center transition-colors shadow-sm"
                      >
                        -
                      </button>
                      <span className="w-28 text-center font-display font-bold text-base sm:text-lg text-slate-800 dark:text-white bg-white dark:bg-slate-900 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner">
                        {formData[q.key]} {q.unit?.split('/')[0]}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleInputChange(q.key, Math.min(q.max, (formData[q.key] || 0) + 1))}
                        className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-lg flex items-center justify-center transition-colors shadow-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {q.type === 'radio' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
                    {q.options.map((opt) => {
                      const isSelected = formData[q.key] === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleInputChange(q.key, opt.value)}
                          className={`p-4 rounded-xl text-left border text-xs sm:text-sm font-semibold transition-all flex items-center justify-between w-full ${
                            isSelected
                              ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-950/70 text-indigo-900 dark:text-indigo-200 shadow-sm ring-1 ring-indigo-600'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                          }`}
                        >
                          <span>{opt.label}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 ml-2" />}
                        </button>
                      );
                    })}
                  </div>
                )}

                {q.type === 'select' && (
                  <div className="w-full">
                    <select
                      value={formData[q.key]}
                      onChange={(e) => handleInputChange(q.key, e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    >
                      {q.options.map((opt) => (
                        <option key={opt.value} value={opt.value} className="dark:bg-slate-900 dark:text-white">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-sm text-rose-700 dark:text-rose-300">
            {errorMsg}
          </div>
        )}

        {/* Footer Navigation */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 0 || loading}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
              currentStep === 0
                ? 'opacity-40 cursor-not-allowed text-slate-400'
                : 'text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>

          {currentStep < QUESTION_CATEGORIES.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2 shadow-md shadow-indigo-200 dark:shadow-indigo-950 hover:shadow-indigo-300 transition-all active:scale-95"
            >
              <span>Lanjut ke {QUESTION_CATEGORIES[currentStep + 1].title.split('&')[0]}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 flex items-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-indigo-950 hover:shadow-indigo-300 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menganalisis Model AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Selesai & Lihat Prediksi Kinerja</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
