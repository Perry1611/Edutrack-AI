# EduTrack - AI Student Performance & What-If Simulator

Website cerdas untuk mengukur kinerja belajar siswa, memprediksi skor ujian akademik, memberikan 3 rekomendasi faktor prioritas untuk ditingkatkan, serta menyediakan simulator interaktif **"What-If"** real-time untuk memotivasi siswa.

Dibangun sebagai bagian dari **MPTI Capstone Project** berdasarkan analisis dataset **StudentPerformanceFactors** (6.654 data siswa).

> 📖 **Panduan Konfigurasi Lengkap**: Silakan baca berkas [TUTORIAL_SETUP.md](TUTORIAL_SETUP.md) untuk panduan instalasi langkah demi langkah dari awal sampai siap pakai.

---

## 🌟 Fitur Utama

1. **Landing Page Interaktif & Informatif**
   - Penjelasan metodologi berbasis data riwayat siswa.
   - Preview simulasi peningkatan skor sebelum mendaftar.
   - Pintu masuk cepat ke asesmen atau demo mode.

2. **Autentikasi Pengguna (Supabase)**
   - Registrasi & Login menggunakan Email dan Password via Supabase Auth.
   - Terintegrasi dengan database Supabase (`profiles` & `assessments`).
   - Menyediakan tombol *One-Click Demo Mode* untuk pengujian langsung tanpa konfigurasi awal.

3. **Asesmen Kinerja Belajar (19 Variabel Dataset)**
   - Pertanyaan ramah siswa yang dikelompokkan ke dalam 3 tahap:
     - **Kebiasaan Belajar & Akademik** (Jam belajar, Kehadiran, Nilai sebelumnya, Sesi bimbingan, Motivasi).
     - **Dukungan Lingkungan & Fasilitas** (Perhatian orang tua, Akses materi, Internet, Kualitas guru, Pendapatan, Jarak ke sekolah).
     - **Gaya Hidup & Faktor Pribadi** (Jam tidur, Olahraga fisik, Ekstrakurikuler, Pengaruh teman, Hambatan belajar).
   - Menghitung otomatis 5 *Engineered Features*: `Study_Efficiency`, `Engagement_Score`, `Sleep_Study_Ratio`, `Support_Score`, dan `Academic_Readiness`.

4. **Dashboard Hasil & 3 Rekomendasi Prioritas**
   - Menampilkan estimasi skor kinerja (0–100) dan kategori (*Tinggi*, *Sedang*, *Perlu Ditingkatkan*).
   - Menampilkan visual indikator metrik turunan.
   - **3 Rekomendasi Utama**: Mengidentifikasi variabel spesifik siswa yang paling potensial menaikkan skor, lengkap dengan target nilai dan langkah aksi nyata.

5. **Tab "What-If" (Simulasi Interaktif Real-Time)**
   - Fitur unggulan: Slider interaktif khusus untuk 3 variabel yang direkomendasikan (misalnya: meningkatkan jam belajar dari 10 jam menjadi 18 jam/minggu, atau menambah sesi les dan waktu tidur optimal).
   - **Kalkulasi Otomatis Seketika**: Begitu slider digeser, model AI langsung memperbarui gambaran skor baru, menampilkan selisih poin (+Δ), serta pesan motivasi personal.
   - Tombol *Jadikan Ini Target Belajar Saya* untuk menyimpan skenario ke profil siswa.

---

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite), Tailwind CSS, Lucide React Icons, Canvas-Confetti.
- **Backend**: Node.js, Express.js, CORS, Morgan.
- **Database & Auth**: Supabase (PostgreSQL, Supabase Auth).
- **Machine Learning**: Model prediksi & simulator berbasis regresi dan analisis data korelasi dari Capstone Data Science.

---

## 🚀 Cara Menjalankan Project

### 1. Menjalankan Backend (Node.js)
Buka terminal baru di folder `fullstack/backend`:
```bash
cd fullstack/backend
npm install
npm start
```
*Backend berjalan di: `http://localhost:5000`*

### 2. Menjalankan Frontend (React.js)
Buka terminal baru di folder `fullstack/frontend`:
```bash
cd fullstack/frontend
npm install
npm run dev
```
*Frontend berjalan di: `http://localhost:5173`*

---

## 🗄️ Konfigurasi Supabase (Opsional untuk Produksi)

1. Buat project baru di [supabase.com](https://supabase.com).
2. Buka **SQL Editor** di dashboard Supabase Anda, lalu jalankan seluruh script yang ada di:
   `fullstack/backend/supabase-schema.sql`
3. Salin URL Project dan Anon Key ke file `fullstack/backend/.env`:
   ```env
   PORT=5000
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   ```
4. Salin juga ke file `fullstack/frontend/.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
*(Jika belum dikonfigurasi, sistem akan otomatis berjalan dalam mode lokal demo yang tetap dapat dicoba secara utuh).*
