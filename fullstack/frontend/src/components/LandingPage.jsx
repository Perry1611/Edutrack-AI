import React from 'react';
import { 
  ArrowRight, Sparkles, Sliders, TrendingUp, CheckCircle2, 
  BrainCircuit, Award
} from 'lucide-react';

export default function LandingPage({ onStartAssessment, onOpenAuth, user }) {
  return (
    <div className="relative overflow-hidden transition-colors duration-300">
      {/* Background blur decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-br from-indigo-100/60 dark:from-indigo-950/40 via-purple-50/40 dark:via-purple-950/20 to-transparent blur-3xl -z-10 pointer-events-none" />

      {/* Hero Section */}
      <section className="pt-12 pb-20 sm:pt-16 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headline & CTA */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold tracking-wide uppercase shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Inovasi Capstone MPTI • AI Student Predictor
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                Ukur Kesiapan & Tingkatkan <span className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">Kinerja Belajarmu</span> dengan AI
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Berdasarkan analisis empiris <strong>6.600+ data performa siswa</strong>. Jawab kuis singkat untuk memprediksi skor ujianmu, temukan <strong>3 faktor prioritas</strong> yang paling perlu ditingkatkan, dan simulasikan potensimu di tab <strong>What-If</strong>!
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={onStartAssessment}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-200 dark:shadow-indigo-950 hover:shadow-indigo-300 flex items-center justify-center gap-2 text-base group"
                >
                  <span>{user ? 'Mulai Asesmen Belajar' : 'Daftar & Mulai Asesmen'}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                {!user && (
                  <button
                    onClick={() => onOpenAuth('login')}
                    className="w-full sm:w-auto px-6 py-4 rounded-xl font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 active:scale-95 transition-all text-base shadow-sm"
                  >
                    Masuk Akun
                  </button>
                )}
              </div>

              {/* Trust badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Model Regresi & Deep Learning
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Langsung Pakai Tanpa Ribet
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Simulasi Interaktif Real-Time
                </span>
              </div>
            </div>

            {/* Right Column: Interactive Mockup Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/70 dark:shadow-slate-950 border border-slate-200/80 dark:border-slate-800 p-6 space-y-6">
                
                {/* Card Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">Simulasi Skor Kinerja</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Live What-If Preview</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    +12 Poin Potensial
                  </span>
                </div>

                {/* Score Comparison Display */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="text-center p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 shadow-sm">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Skor Awal</span>
                    <div className="text-3xl font-display font-black text-slate-800 dark:text-white mt-1">66</div>
                    <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Kategori Sedang</span>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-950">
                    <span className="text-[11px] font-semibold text-indigo-100 uppercase tracking-wider">Simulasi Baru</span>
                    <div className="text-3xl font-display font-black text-white mt-1">78</div>
                    <span className="text-[11px] text-indigo-100 font-medium">Kategori Tinggi 🚀</span>
                  </div>
                </div>

                {/* Simulated variables showcase */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>3 Variabel Prioritas yang Ditingkatkan:</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
                      <span className="text-slate-800 dark:text-slate-200 font-medium">Jam Belajar Mandiri</span>
                    </div>
                    <span className="font-bold text-indigo-700 dark:text-indigo-400">12 jam ➔ 20 jam/mgg</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-violet-600 dark:bg-violet-400"></span>
                      <span className="text-slate-800 dark:text-slate-200 font-medium">Sesi Bimbingan (Les)</span>
                    </div>
                    <span className="font-bold text-violet-700 dark:text-violet-400">0 sesi ➔ 2 sesi/bln</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400"></span>
                      <span className="text-slate-800 dark:text-slate-200 font-medium">Kualitas Waktu Tidur</span>
                    </div>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">5 jam ➔ 8 jam/hari</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-300 leading-snug">
                  💡 <strong>Motivasi AI:</strong> Menambah 8 jam belajar dan istirahat optimal dapat meningkatkan kesiapan kognitif Anda hingga 18%!
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white">
              Solusi Berbasis Data untuk Mendorong Prestasi Siswa
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Dibangun dari dataset analitik performa siswa yang komprehensif, menghubungkan variabel dependen performa dengan tindakan nyata.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">1. Asesmen Kinerja Cerdas</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Jawab kuis ramah siswa mencakup 19 faktor: jam belajar, kehadiran, akses sumber belajar, waktu tidur, hingga motivasi pribadi.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300 flex items-center justify-center font-bold">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">2. 3 Rekomendasi Prioritas</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Sistem secara otomatis mendeteksi 3 variabel yang paling berdampak besar untuk ditingkatkan sesuai profil unik setiap siswa.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">3. Simulasi Interaktif "What-If"</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Geser slider variabel untuk melihat secara langsung bagaimana perubahan kebiasaan belajar mendongkrak prediksi nilai ujianmu!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dataset & Statistics Section */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden border border-slate-800">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-800">
                  Transparansi Data Scientist
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                  Didukung Analisis 6.654 Data Riwayat Siswa
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                  Model dilatih untuk memprediksi variabel dependen (Exam Score & Kategori Prestasi) dengan merekayasa 5 fitur turunan seperti rasio tidur-belajar, efisiensi belajar, dan skor kesiapan akademik.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                  <div>
                    <div className="text-2xl font-bold text-indigo-400">6.654</div>
                    <div className="text-xs text-slate-400">Sampel Siswa</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-indigo-400">19 Fitur</div>
                    <div className="text-xs text-slate-400">Variabel Asli</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-indigo-400">5 Fitur</div>
                    <div className="text-xs text-slate-400">Rekayasa AI</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-indigo-400">Instant</div>
                    <div className="text-xs text-slate-400">Simulasi What-If</div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex justify-center lg:justify-end">
                <button
                  onClick={onStartAssessment}
                  className="px-8 py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 text-center flex items-center gap-2"
                >
                  <span>Coba Asesmen Sekarang</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
