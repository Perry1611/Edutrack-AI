# 📘 Panduan Lengkap Instalasi, Konfigurasi, & Penggunaan Sistem EduTrack AI

Dokumen ini adalah panduan langkah demi langkah (*step-by-step guide*) untuk mengatur, mengonfigurasi, dan menjalankan sistem **EduTrack** (Website Prediksi Kinerja Belajar Siswa & Simulasi Interaktif What-If) dari awal hingga siap digunakan.

---

## 📋 Daftar Isi
1. [Prasyarat Sistem](#1-prasyarat-sistem)
2. [Struktur Direktori Proyek](#2-struktur-direktori-proyek)
3. [Langkah 1: Konfigurasi Supabase (Database & Auth)](#3-langkah-1-konfigurasi-supabase-database--auth)
4. [Langkah 2: Konfigurasi Environment (.env)](#4-langkah-2-konfigurasi-environment-env)
5. [Langkah 3: Instalasi Dependencies](#5-langkah-3-instalasi-dependencies)
6. [Langkah 4: Menjalankan Sistem](#6-langkah-4-menjalankan-sistem)
7. [Langkah 5: Panduan Uji Coba Fitur Aplikasi](#7-langkah-5-panduan-uji-coba-fitur-aplikasi)
8. [Troubleshooting & Solusi Kendala Umum](#8-troubleshooting--solusi-kendala-umum)

---

## 1. Prasyarat Sistem

Sebelum memulai, pastikan perangkat Anda telah terpasang:
- **Node.js**: Versi 18.x atau lebih baru (disarankan versi LTS atau v20+). Cek dengan perintah:
  ```bash
  node -v
  ```
- **NPM**: Bawaan Node.js. Cek dengan:
  ```bash
  npm -v
  ```
- **Web Browser Modern**: Google Chrome, Mozilla Firefox, Microsoft Edge, atau Safari.
- **Akun Supabase (Gratis)**: Daftar di [supabase.com](https://supabase.com).

> [!NOTE]
> Sistem ini telah dirancang dengan fitur **Dual-Mode**:
> 1. **Mode Supabase Penuh**: Data akun dan riwayat asesmen tersimpan di cloud database Supabase.
> 2. **Mode Demo Lokal (Otomatis)**: Jika Anda belum sempat membuat akun Supabase, aplikasi **tetap dapat dijalankan langsung** menggunakan penyimpanan *in-memory demo store* bawaan.

---

## 2. Struktur Direktori Proyek

Folder aplikasi berada di dalam direktori `fullstack`:

```text
Capstone/fullstack/
├── backend/                  # Server Node.js + Express & Engine AI
│   ├── config/
│   │   └── supabase.js       # Koneksi ke Supabase Client
│   ├── ml/
│   │   └── predictionEngine.js # Algoritma Regresi, Rekayasa Fitur, & What-If
│   ├── server.js             # REST API Express
│   ├── supabase-schema.sql   # Skrip DDL & Trigger Database Supabase
│   ├── package.json
│   ├── .env.example
│   └── .env
│
├── frontend/                 # Client React.js (Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Header & Navigasi
│   │   │   ├── LandingPage.jsx       # Landing Page Informatif
│   │   │   ├── AuthModal.jsx         # Modal Login/Register Email Supabase
│   │   │   ├── AssessmentWizard.jsx  # Kuesioner 19 Pertanyaan
│   │   │   ├── Dashboard.jsx         # Dashboard Ringkasan & 3 Rekomendasi
│   │   │   └── WhatIfSimulator.jsx   # TAB WHAT-IF: Slider Simulasi Interaktif
│   │   ├── data/
│   │   │   └── questions.js          # Definisi Pertanyaan & Benchmark
│   │   ├── services/
│   │   │   ├── api.js                # Komunikasi HTTP ke Backend
│   │   │   └── supabase.js           # Client SDK Supabase
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── package.json              # Runner script gabungan (opsional)
├── README.md                 # Dokumentasi ringkas
└── TUTORIAL_SETUP.md         # Berkas panduan ini
```

---

## 3. Langkah 1: Konfigurasi Supabase (Database & Auth)

Ikuti langkah berikut untuk mengaktifkan database dan autentikasi email:

### A. Membuat Project Supabase
1. Masuk ke [supabase.com/dashboard](https://supabase.com/dashboard) dan login.
2. Klik tombol **"New Project"**.
3. Isi kolom:
   - **Name**: `edutrack-capstone` (atau nama pilihan Anda)
   - **Database Password**: Buat password yang kuat dan catat.
   - **Region**: Pilih yang terdekat (misal: *Singapore*).
4. Klik **"Create new project"** dan tunggu sekitar 1-2 menit hingga proses inisialisasi selesai.

### B. Menjalankan Skrip Tabel Database (SQL Editor)
1. Di dashboard Supabase sebelah kiri, klik menu **SQL Editor** (ikon terminal/lembar SQL).
2. Klik **"New query"**.
3. Buka file `fullstack/backend/supabase-schema.sql`, salin seluruh isinya, lalu tempel (*paste*) ke SQL Editor Supabase:

```sql
-- 1. Create Profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Assessments table
CREATE TABLE IF NOT EXISTS public.assessments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  answers JSONB NOT NULL,
  predicted_score NUMERIC NOT NULL,
  category TEXT NOT NULL,
  recommendations JSONB,
  derived_features JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies for Assessments
CREATE POLICY "Users can insert their own assessments" 
  ON public.assessments FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can view their own assessments" 
  ON public.assessments FOR SELECT 
  USING (true);

-- 5. Trigger to automatically create profile on sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```
4. Klik tombol **"Run"** (atau tekan `Ctrl + Enter`).
5. Pastikan muncul pesan sukses: `Success. No rows returned`.

### C. Pengaturan Email Confirmation (Sangat Disarankan untuk Pengujian Cepat)
Agar akun yang baru didaftarkan bisa langsung login tanpa perlu verifikasi email masuk:
1. Buka menu **Authentication** di panel samping kiri Supabase.
2. Pilih submenu **Providers** -> Klik **Email**.
3. Nonaktifkan (*uncheck*) toggle **"Confirm email"**.
4. Klik **Save**.

### D. Mengambil API Credentials
1. Klik ikon **Project Settings** (ikon gerigi di kiri bawah).
2. Pilih menu **API**.
3. Salin dua nilai berikut:
   - **Project URL** (contoh: `https://xyzabc123.supabase.co`)
   - **Project API keys** bagian **`anon` / `public`** (string panjang diawali `eyJ...`)

---

## 4. Langkah 2: Konfigurasi Environment (.env)

### A. Konfigurasi Backend
Buka file `fullstack/backend/.env`. Masukkan kredensial yang Anda salin tadi:

```env
PORT=5000
SUPABASE_URL=https://xyzabc123.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### B. Konfigurasi Frontend (Opsional)
Buka atau buat file `fullstack/frontend/.env` jika ingin frontend langsung terhubung ke SDK Supabase:

```env
VITE_SUPABASE_URL=https://xyzabc123.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> [!TIP]
> Jika Anda belum mengisi kredensial Supabase, biarkan nilai default atau placeholder apa adanya. Sistem otomatis akan beralih ke **Mode Demo Lokal** tanpa error!

---

## 5. Langkah 3: Instalasi Dependencies

Buka terminal di root proyek.

### A. Install Backend:
```powershell
cd fullstack/backend
npm install
```
*(Catatan pengguna Windows PowerShell: jika muncul error execution policy, gunakan perintah `npm.cmd install`)*

### B. Install Frontend:
```powershell
cd ../frontend
npm install
```
*(Atau `npm.cmd install` di Windows)*

---

## 6. Langkah 4: Menjalankan Sistem

Jalankan backend dan frontend secara bersamaan pada **dua jendela terminal terpisah**:

### Terminal 1 — Menjalankan Server Backend:
```powershell
cd fullstack/backend
npm start
```
**Output yang diharapkan:**
```text
===============================================
🚀 EduTrack Backend Server is running on port 5000
📡 URL: http://localhost:5000
⚙️  Supabase Integration: CONNECTED (atau LOCAL DEMO MODE)
===============================================
```

### Terminal 2 — Menjalankan Client Frontend:
```powershell
cd fullstack/frontend
npm run dev
```
**Output yang diharapkan:**
```text
  VITE v6.x.x  ready in 240 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Buka peramban (*browser*) Anda lalu akses:  
👉 **`http://localhost:5173`**

---

## 7. Langkah 5: Panduan Uji Coba Fitur Aplikasi

Berikut alur pengujian lengkap untuk memverifikasi seluruh fungsionalitas sistem:

### 1. Halaman Landing Page
- Periksa antarmuka beranda: Hero section, penjelasan keterkaitan variabel dependen `Exam Score` dengan 19 fitur kebiasaan belajar, serta kartu preview live *What-If*.
- Klik tombol **"Mulai Asesmen Belajar"** atau **"Daftar Akun"**.

### 2. Autentikasi Pengguna
- Modal pendaftaran akan terbuka.
- **Opsi A (Supabase Email)**:
  - Pilih tab **"Daftar Akun Baru"**.
  - Masukkan Nama Lengkap, Email, dan Password (minimal 6 karakter).
  - Klik **Daftar & Lanjut ke Asesmen**.
- **Opsi B (Demo Cepat)**:
  - Klik tombol abu-abu: **"Masuk Otomatis sebagai Siswa Uji Coba (Demo)"**.

### 3. Mengisi Kuesioner Asesmen (19 Pertanyaan)
Sistem akan memandu Anda melalui 3 tahap interaktif:
- **Bagian 1: Kebiasaan Belajar & Akademik**  
  Mengisi jam belajar per minggu, kehadiran kelas (%), nilai rata-rata sebelumnya, sesi les/bimbingan per bulan, dan tingkat motivasi.
- **Bagian 2: Dukungan Lingkungan & Fasilitas**  
  Menilai keterlibatan orang tua, kelengkapan sumber belajar, kualitas pengajaran guru, kondisi ekonomi, dan fasilitas internet.
- **Bagian 3: Gaya Hidup & Faktor Pribadi**  
  Menentukan waktu tidur per hari, jam aktivitas fisik/olahraga, kegiatan ekstrakurikuler, serta pengaruh pergaulan teman.
- Klik tombol **"Selesai & Lihat Prediksi Kinerja"**.

### 4. Membaca Dashboard Hasil & 3 Rekomendasi
Setelah analisis AI selesai, Anda akan diarahkan ke Dashboard:
- **Skor Prediksi Kinerja**: Nilai angka (misal: `66/100`) dan kategori (*Tinggi*, *Sedang*, atau *Perlu Ditingkatkan*).
- **Indikator Metrik Rekayasa**:
  - *Kesiapan Akademik*
  - *Skor Keterlibatan (Engagement)*
  - *Efisiensi Belajar*
  - *Dukungan Lingkungan*
- **3 Rekomendasi Variabel Prioritas**:  
  Kartu rekomendasi yang dipersonalisasi khusus untuk profil siswa, menunjukkan nilai saat ini vs target perbaikan, potensi kenaikan skor (+Δ poin), dan langkah aksi nyata.

### 5. Menguji Tab "What-If" (Simulasi Interaktif Real-Time)
1. Klik tab **"Tab Simulasi 'What-If'"** di Dashboard.
2. Anda akan melihat **slider khusus untuk 3 variabel prioritas** (misal: Jam Belajar Mandiri, Jam Tidur, dan Sesi Bimbingan Belajar).
3. **Coba Geser Slider**:
   - Contoh: Geser **Jam Belajar** dari 10 jam menjadi 22 jam/minggu.
   - Contoh: Geser **Sesi Bimbingan** dari 0 menjadi 3 sesi/bulan.
4. **Perhatikan Respons Seketika**:
   - Model AI **langsung mengkalkulasi ulang skor secara real-time** tanpa perlu me-refresh halaman!
   - Kotak skor simulasi akan meningkat (misal: dari 64 menjadi 77, badge `+13 Poin!`).
   - Efek animasi kembang api (*confetti*) dan pesan motivasi AI akan muncul untuk membakar semangat belajar siswa.
5. Klik **"Jadikan Ini Target Belajar Saya!"** untuk menyimpan skenario baru tersebut.

---

## 8. Troubleshooting & Solusi Kendala Umum

### 1. Pesan: `npm.ps1 cannot be loaded because running scripts is disabled on this system`
- **Penyebab**: Kebijakan eksekusi skrip PowerShell bawaan Windows belum diizinkan.
- **Solusi**:
  Gunakan perintah dengan ekstensi `.cmd`:
  ```powershell
  npm.cmd install
  npm.cmd run dev
  ```
  Atau ubah execution policy PowerShell (buka PowerShell Run as Administrator):
  ```powershell
  Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
  ```

### 2. Error: `EADDRINUSE: address already in use :::5000`
- **Penyebab**: Port 5000 sedang digunakan oleh aplikasi lain.
- **Solusi**:
  Buka file `fullstack/backend/.env` dan ubah port ke port lain, misalnya `PORT=5001`. Kemudian sesuaikan target proxy di `fullstack/frontend/vite.config.js` menjadi `http://localhost:5001`.

### 3. Registrasi Supabase Gagal: `Email rate limit exceeded` atau `Database error saving new user`
- **Solusi**:
  - Pastikan skrip SQL di `supabase-schema.sql` sudah dijalankan di SQL Editor Supabase.
  - Matikan opsi "Confirm email" di menu *Authentication* -> *Providers* -> *Email* di dashboard Supabase.
  - Untuk uji coba instan, gunakan tombol **"Masuk Otomatis sebagai Siswa Uji Coba (Demo)"** di modal login.

---

Selamat mencoba! Sistem kini siap digunakan untuk presentasi, pengujian skenario belajar siswa, dan demonstrasi Capstone Project MPTI. 🎓🚀
