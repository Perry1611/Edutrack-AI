import React, { useState, useEffect } from 'react';
import { 
  Sliders, TrendingUp, RotateCcw, Target, 
  Zap, Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { simulateWhatIf } from '../services/api';

export default function WhatIfSimulator({ baselineInput, baselineResult, onApplyTarget }) {
  const recommendations = baselineResult?.topRecommendations || [];
  
  // Initialize simulated modifications with the suggested target values
  const [modifications, setModifications] = useState(() => {
    const initialMods = {};
    recommendations.forEach(rec => {
      initialMods[rec.key] = rec.targetValue;
    });
    return initialMods;
  });

  const [simulationResult, setSimulationResult] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Run simulation whenever modifications change
  useEffect(() => {
    let active = true;

    async function executeSimulation() {
      if (!baselineInput) return;
      try {
        const result = await simulateWhatIf(baselineInput, modifications);
        if (active) {
          setSimulationResult(result);
          
          // Fire celebratory confetti if high potential improvement
          if (result.numericDelta >= 8) {
            confetti({
              particleCount: 40,
              spread: 60,
              origin: { y: 0.7 }
            });
          }
        }
      } catch (err) {
        console.error('Simulation error:', err);
      }
    }

    const timer = setTimeout(executeSimulation, 100);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [modifications, baselineInput]);

  function handleSliderChange(key, value) {
    setModifications(prev => ({
      ...prev,
      [key]: Number(value)
    }));
  }

  function handleReset() {
    const resetMods = {};
    recommendations.forEach(rec => {
      resetMods[rec.key] = rec.currentValue;
    });
    setModifications(resetMods);
  }

  const baselineScore = baselineResult?.score || 65;
  const currentSimScore = simulationResult ? simulationResult.simulatedScore : baselineScore;
  const delta = simulationResult ? simulationResult.delta : '+0';
  const isPositive = simulationResult && simulationResult.numericDelta > 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 transition-colors duration-300">
      
      {/* Simulation Header Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 dark:from-indigo-900 dark:via-indigo-800 dark:to-violet-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-indigo-500/30">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              Interactive "What-If" AI Simulation Sandbox
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
              Simulasi Peningkatan Kinerja Belajar
            </h2>
            <p className="text-indigo-100 text-sm leading-relaxed">
              Model memprediksi bahwa dengan memperbaiki <strong>3 variabel prioritas</strong> di bawah ini, skor belajarmu dapat melompat lebih tinggi. Geser slider untuk melihat proyeksi nilai barumu secara langsung!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all flex items-center gap-1.5 backdrop-blur-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Reset ke Skor Awal
            </button>
          </div>
        </div>
      </div>

      {/* Main Simulation Arena: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (7 cols): The 3 Recommended Sliders */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md shadow-slate-100 dark:shadow-slate-950 space-y-6 transition-colors duration-300">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                    3 Variabel Prioritas Rekomendasi
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Geser nilai untuk mengamati pengaruhnya terhadap estimasi performamu
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800">
                AI Focused
              </span>
            </div>

            {/* Slider items for the top recommendations */}
            <div className="space-y-6">
              {recommendations.length > 0 ? (
                recommendations.map((rec, idx) => {
                  const currentValue = modifications[rec.key] !== undefined 
                    ? modifications[rec.key] 
                    : rec.currentValue;

                  const isModified = currentValue !== rec.currentValue;

                  return (
                    <div 
                      key={rec.key}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <div>
                            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{rec.title}</h4>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                              Nilai Awal Anda: <strong>{rec.currentValue} {rec.unit}</strong>
                            </span>
                          </div>
                        </div>

                        {/* Current Slider Value Display */}
                        <div className="text-right">
                          <span className={`inline-block px-3 py-1 rounded-lg text-sm font-extrabold ${
                            isModified
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                          }`}>
                            {currentValue} {rec.unit}
                          </span>
                        </div>
                      </div>

                      {/* Interactive Slider */}
                      <div className="pt-1">
                        <input
                          type="range"
                          min={rec.min || 0}
                          max={rec.max || 40}
                          step={rec.step || 1}
                          value={currentValue}
                          onChange={(e) => handleSliderChange(rec.key, e.target.value)}
                          className="w-full accent-indigo-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer transition-all"
                        />
                        <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-400 font-semibold mt-1">
                          <span>Min: {rec.min || 0} {rec.unit}</span>
                          <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                            Target AI Disarankan: {rec.targetValue} {rec.unit}
                          </span>
                          <span>Maks: {rec.max || 40} {rec.unit}</span>
                        </div>
                      </div>

                      {/* Quick advice note */}
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug bg-white dark:bg-slate-850 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/80">
                        💬 <strong>Panduan:</strong> {rec.advice}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-slate-500">Data rekomendasi belum tersedia.</p>
              )}
            </div>

            {/* Advanced toggle for extra variables */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1.5"
              >
                <span>{showAdvanced ? 'Tutup Variabel Tambahan' : '+ Coba Simulasikan Variabel Lainnya (Kehadiran, Motivasi, Olahraga)'}</span>
              </button>

              {showAdvanced && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
                  {/* Attendance */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl space-y-2 border border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span>Kehadiran Kelas (%)</span>
                      <span className="text-indigo-600 dark:text-indigo-400">{modifications['Attendance'] || baselineInput?.Attendance || 85}%</span>
                    </div>
                    <input
                      type="range"
                      min="60"
                      max="100"
                      value={modifications['Attendance'] || baselineInput?.Attendance || 85}
                      onChange={(e) => handleSliderChange('Attendance', e.target.value)}
                      className="w-full accent-indigo-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Physical Activity */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl space-y-2 border border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span>Aktivitas Fisik / Olahraga (jam/minggu)</span>
                      <span className="text-indigo-600 dark:text-indigo-400">{modifications['Physical_Activity'] ?? baselineInput?.Physical_Activity ?? 2} jam</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="6"
                      value={modifications['Physical_Activity'] ?? baselineInput?.Physical_Activity ?? 2}
                      onChange={(e) => handleSliderChange('Physical_Activity', e.target.value)}
                      className="w-full accent-indigo-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Live Results & Motivational Boost */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          
          {/* Real-time Result Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 border-indigo-200 dark:border-indigo-800 shadow-xl shadow-indigo-100/50 dark:shadow-slate-950 space-y-6 relative overflow-hidden transition-colors duration-300">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Hasil Simulasi Real-Time
              </span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                isPositive 
                  ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}>
                <TrendingUp className="w-3.5 h-3.5" />
                {delta} Poin
              </span>
            </div>

            {/* Score Comparison Display */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Skor Awal Anda</span>
                <div className="text-3xl font-display font-extrabold text-slate-700 dark:text-slate-200 mt-1">
                  {baselineScore}
                </div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {baselineResult?.category || 'Sedang'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white text-center shadow-lg shadow-indigo-200 dark:shadow-indigo-950">
                <span className="text-xs font-bold text-indigo-100 block">Prediksi Simulasi</span>
                <div className="text-4xl font-display font-black text-white mt-1 flex items-center justify-center gap-1">
                  <span>{currentSimScore}</span>
                </div>
                <span className="text-[11px] font-bold text-indigo-100 bg-white/20 px-2 py-0.5 rounded-full inline-block mt-1">
                  Kategori {simulationResult?.simulatedCategory || 'Tinggi'} 🚀
                </span>
              </div>
            </div>

            {/* Visual Progress Bar to 100 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                <span>Pencapaian Potensi Maksimal (100)</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{currentSimScore}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, currentSimScore)}%` }}
                />
              </div>
            </div>

            {/* Motivational message badge */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800/70 text-amber-950 dark:text-amber-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
                <Flame className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Pesan Motivasi AI untuk Anda:</span>
              </div>
              <p className="text-xs sm:text-sm font-medium leading-relaxed">
                {simulationResult?.motivationalMessage || 'Setiap jam belajar tambahan dan istirahat teratur membawa pengaruh positif langsung pada kesiapan kognitif Anda!'}
              </p>
            </div>

            {/* Action CTA: Apply this target */}
            <button
              type="button"
              onClick={() => {
                if (onApplyTarget) {
                  onApplyTarget(modifications, currentSimScore);
                }
              }}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-200 dark:shadow-indigo-950 flex items-center justify-center gap-2 text-sm"
            >
              <Target className="w-4 h-4" />
              <span>Jadikan Ini Target Belajar Saya!</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
