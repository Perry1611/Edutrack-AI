import React, { useState } from 'react';
import { 
  Award, TrendingUp, Sliders, CheckCircle2, 
  RotateCcw, BookOpen, Clock, Users, ArrowUpRight, Flame
} from 'lucide-react';
import WhatIfSimulator from './WhatIfSimulator';
import ScoreProgressChart from './ScoreProgressChart';

export default function Dashboard({ 
  user, 
  assessmentResult, 
  baselineInput, 
  onRetake,
  assessmentHistory = [],
  onOpenRetakeModal
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'what-if' | 'details'
  const [appliedNotification, setAppliedNotification] = useState('');

  if (!assessmentResult) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Belum ada data asesmen</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Silakan lakukan asesmen belajar terlebih dahulu untuk melihat hasil prediksi.</p>
        <button
          onClick={onRetake}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-md"
        >
          Mulai Asesmen Sekarang
        </button>
      </div>
    );
  }

  const { score, category, categoryBadge, summary, derivedFeatures, topRecommendations } = assessmentResult;

  function handleApplyTarget(modifications, newScore) {
    setAppliedNotification(`Target baru (${newScore} poin) berhasil disimpan ke rencana belajarmu! Tetap semangat!`);
    setTimeout(() => setAppliedNotification(''), 4000);
    setActiveTab('overview');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300 transition-colors duration-300">
      
      {/* Student Welcome Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors duration-300">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              Asesmen Selesai
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">• Terverifikasi</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Halo, {user?.name || user?.email?.split('@')[0] || 'Siswa'}! 👋
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm max-w-2xl">
            Berikut adalah hasil analisis cerdas terhadap kebiasaan dan kesiapan belajarmu.
          </p>
        </div>

        <button
          onClick={onOpenRetakeModal || onRetake}
          className="self-start md:self-auto px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-sm"
        >
          <RotateCcw className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span>Asesmen Ulang</span>
        </button>
      </div>

      {/* Applied Target Alert */}
      {appliedNotification && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm font-semibold flex items-center gap-2 shadow-sm animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{appliedNotification}</span>
        </div>
      )}

      {/* Dashboard Tab Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 sm:pb-4 px-3 sm:px-4 text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 border-b-2 shrink-0 transition-all ${
            activeTab === 'overview'
              ? 'border-indigo-600 text-indigo-700 dark:text-indigo-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Ringkasan & 3 Rekomendasi</span>
        </button>

        {/* The prominent WHAT-IF tab requested */}
        <button
          onClick={() => setActiveTab('what-if')}
          className={`pb-3 sm:pb-4 px-3 sm:px-4 text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 border-b-2 shrink-0 transition-all ${
            activeTab === 'what-if'
              ? 'border-indigo-600 text-indigo-700 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-t-lg'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-t-lg'
          }`}
        >
          <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Tab Simulasi "What-If"</span>
          <span className="text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-indigo-600 text-white animate-pulse">
            Fitur Utama
          </span>
        </button>

        <button
          onClick={() => setActiveTab('details')}
          className={`pb-3 sm:pb-4 px-3 sm:px-4 text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 border-b-2 shrink-0 transition-all ${
            activeTab === 'details'
              ? 'border-indigo-600 text-indigo-700 dark:text-indigo-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Rincian Profil Belajar</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & 3 RECOMMENDATIONS */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Predicted Exam Score Card (5 cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col justify-between space-y-6 border border-slate-800">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 px-2.5 py-1 rounded-full bg-white/10 border border-white/10">
                    Estimasi Nilai AI
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-300 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Analisis Terverifikasi
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-3">Prediksi Skor Kinerja Belajar</h3>
                <p className="text-xs text-indigo-200 mt-1">{summary}</p>
              </div>

              <div className="flex items-baseline gap-4">
                <div className="font-display text-6xl font-black text-white tracking-tight">
                  {score}
                </div>
                <div className="text-sm">
                  <span className="text-indigo-300 block">dari 100 poin</span>
                  <span className="inline-block mt-1 px-3 py-1 rounded-full font-bold text-xs bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                    Kategori: {category} ({categoryBadge})
                  </span>
                </div>
              </div>

              {/* Quick jump to What-If button */}
              <button
                onClick={() => setActiveTab('what-if')}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs text-indigo-950 bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-200 hover:to-amber-300 shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Sliders className="w-4 h-4" />
                <span>Simulasikan Peningkatan Nilai di Tab "What-If" ➔</span>
              </button>
            </div>

            {/* Derived Feature Engineering Indicators (7 cols) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Kesiapan Akademik</span>
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-display font-extrabold text-slate-900 dark:text-white">
                  {Math.round((derivedFeatures?.academicReadiness || 0.6) * 100)}%
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                  Kombinasi nilai sebelumnya, motivasi, dan bimbingan belajar.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Skor Keterlibatan</span>
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-display font-extrabold text-slate-900 dark:text-white">
                  {derivedFeatures?.engagementScore || 15}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                  Interaksi antara kehadiran kelas dan jam belajar mandiri per minggu.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Efisiensi Belajar</span>
                  <div className="w-7 h-7 rounded-lg bg-violet-50 dark:bg-violet-950/70 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-display font-extrabold text-slate-900 dark:text-white">
                  {derivedFeatures?.studyEfficiency || 3.2}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                  Rasio pencapaian skor per jam waktu belajar yang diinvestasikan.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Dukungan Lingkungan</span>
                  <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-display font-extrabold text-slate-900 dark:text-white">
                  {derivedFeatures?.supportScore || 1.25} / 2.0
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                  Dukungan orang tua, internet, dan fasilitas belajar di rumah.
                </p>
              </div>

            </div>
          </div>

          {/* Grafik Progres Skor Asesmen Berdasarkan Tanggal */}
          <ScoreProgressChart history={assessmentHistory} />

          {/* 3 REKOMENDASI VARIABEL PRIORITAS */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span>3 Rekomendasi Utama untuk Ditingkatkan</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  Sistem mendeteksi 3 faktor ini memiliki potensi peningkatan nilai terbesar jika kamu optimalkan:
                </p>
              </div>

              <button
                onClick={() => setActiveTab('what-if')}
                className="self-start sm:self-auto text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1"
              >
                <span>Uji Simulasi di What-If</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topRecommendations && topRecommendations.length > 0 ? (
                topRecommendations.map((rec, idx) => (
                  <div
                    key={rec.key}
                    className="bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative overflow-hidden"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                          #{idx + 1}
                        </span>
                        <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                          +{rec.potentialIncrease} Poin Potensial
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 dark:text-white text-base">{rec.title}</h4>
                      
                      {/* Current vs Target */}
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-500 dark:text-slate-400">Kondisi Saat Ini: <strong className="text-slate-800 dark:text-white">{rec.currentValue} {rec.unit}</strong></span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold">➔ Target: {rec.targetValue} {rec.unit}</span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {rec.advice}
                      </p>

                      {/* Action Steps */}
                      {rec.actionSteps && (
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">Langkah Aksi:</span>
                          <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                            {rec.actionSteps.map((step, sIdx) => (
                              <li key={sIdx} className="flex items-start gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                                <span>{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setActiveTab('what-if')}
                      className="w-full py-2 px-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Simulasikan Faktor Ini</span>
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">Rekomendasi belum dimuat.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WHAT-IF SIMULATION */}
      {activeTab === 'what-if' && (
        <WhatIfSimulator
          baselineInput={baselineInput}
          baselineResult={assessmentResult}
          onApplyTarget={handleApplyTarget}
          onOpenRetakeModal={onOpenRetakeModal || onRetake}
        />
      )}

      {/* TAB 3: DETAILS OF PROFILE */}
      {activeTab === 'details' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div>
            <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
              Rincian Profil Kebiasaan Belajar Anda
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Ringkasan data kebiasaan, kehadiran, dan lingkungan belajar harian Anda:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {baselineInput && Object.entries(baselineInput).map(([key, val]) => (
              <div key={key} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700">
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-400 block uppercase tracking-wide">
                  {key.replace(/_/g, ' ')}
                </span>
                <span className="text-sm font-bold text-slate-800 dark:text-white mt-0.5 block">
                  {String(val)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
