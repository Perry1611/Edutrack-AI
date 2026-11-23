/**
 * 19 Dataset Features converted into student-friendly questions in Indonesian
 * Grouped into 3 intuitive categories
 */

export const QUESTION_CATEGORIES = [
  { id: 'academic', title: 'Kebiasaan Belajar & Akademik', icon: 'BookOpen' },
  { id: 'environment', title: 'Dukungan Lingkungan & Fasilitas', icon: 'Home' },
  { id: 'personal', title: 'Gaya Hidup & Faktor Pribadi', icon: 'Smile' }
];

export const QUESTIONS = [
  // --- Kategori 1: Kebiasaan Belajar & Akademik ---
  {
    key: 'Hours_Studied',
    category: 'academic',
    label: 'Berapa rata-rata jam belajar mandiri Anda per minggu?',
    description: 'Waktu yang dihabiskan untuk mengulang pelajaran, mengerjakan tugas, atau membaca materi di luar jam sekolah.',
    type: 'slider',
    min: 1,
    max: 44,
    step: 1,
    unit: 'jam/minggu',
    defaultValue: 18,
    benchmark: 'Rata-rata siswa berprestasi: 22–28 jam/minggu'
  },
  {
    key: 'Attendance',
    category: 'academic',
    label: 'Berapa persentase kehadiran Anda di kelas?',
    description: 'Estimasi tingkat kehadiran Anda dalam mengikuti sesi pelajaran di sekolah/kampus.',
    type: 'slider',
    min: 60,
    max: 100,
    step: 1,
    unit: '%',
    defaultValue: 85,
    benchmark: 'Kehadiran minimal yang disarankan: 80%'
  },
  {
    key: 'Previous_Scores',
    category: 'academic',
    label: 'Berapa nilai rata-rata ujian Anda pada periode sebelumnya?',
    description: 'Skor nilai rata-rata dari ujian tengah semester atau ujian semester lalu (skala 50–100).',
    type: 'slider',
    min: 50,
    max: 100,
    step: 1,
    unit: 'skor',
    defaultValue: 70,
    benchmark: 'Skala nilai 50 - 100'
  },
  {
    key: 'Tutoring_Sessions',
    category: 'academic',
    label: 'Berapa sesi bimbingan belajar (les/tutoring) yang Anda ikuti per bulan?',
    description: 'Jumlah sesi les privat atau bimbingan belajar tambahan di luar jam sekolah.',
    type: 'counter',
    min: 0,
    max: 8,
    unit: 'sesi/bulan',
    defaultValue: 2,
    benchmark: 'Maksimal 8 sesi per bulan'
  },
  {
    key: 'Motivation_Level',
    category: 'academic',
    label: 'Bagaimana tingkat motivasi belajar Anda saat ini?',
    description: 'Tingkat antusiasme, semangat, dan komitmen pribadi dalam meraih nilai baik.',
    type: 'radio',
    defaultValue: 'Medium',
    options: [
      { value: 'Low', label: 'Rendah (Sering merasa jenuh dan menunda belajar)', score: 0 },
      { value: 'Medium', label: 'Sedang (Cukup bersemangat saat mendekati ujian)', score: 1 },
      { value: 'High', label: 'Tinggi (Sangat antusias, memiliki target cita-cita jelas)', score: 2 }
    ]
  },

  // --- Kategori 2: Dukungan Lingkungan & Fasilitas ---
  {
    key: 'Parental_Involvement',
    category: 'environment',
    label: 'Seberapa besar perhatian dan keterlibatan orang tua dalam belajar Anda?',
    description: 'Dukungan berupa bimbingan, pengecekan nilai, motivasi moral, atau diskusi mengenai sekolah.',
    type: 'radio',
    defaultValue: 'Medium',
    options: [
      { value: 'Low', label: 'Rendah (Jarang memantau atau berdiskusi tentang pelajaran)', score: 0 },
      { value: 'Medium', label: 'Sedang (Cukup peduli saat ada laporan hasil belajar)', score: 1 },
      { value: 'High', label: 'Tinggi (Sangat aktif mendampingi dan memberikan dukungan)', score: 2 }
    ]
  },
  {
    key: 'Access_to_Resources',
    category: 'environment',
    label: 'Bagaimana kemudahan akses Anda terhadap buku dan materi belajar?',
    description: 'Ketersediaan buku pelajaran, referensi modul, perpustakaan, atau perangkat belajar.',
    type: 'radio',
    defaultValue: 'Medium',
    options: [
      { value: 'Low', label: 'Terbatas (Buku dan modul pendukung minim)', score: 0 },
      { value: 'Medium', label: 'Cukup (Memiliki buku paket utama dan modul sekolah)', score: 1 },
      { value: 'High', label: 'Sangat Lengkap (Akses lengkap buku, ebook, perpustakaan digital)', score: 2 }
    ]
  },
  {
    key: 'Internet_Access',
    category: 'environment',
    label: 'Apakah Anda memiliki akses internet yang stabil di rumah?',
    description: 'Koneksi Wi-Fi atau paket data untuk browsing materi, menonton video edukasi, dan kelas daring.',
    type: 'radio',
    defaultValue: 'Yes',
    options: [
      { value: 'No', label: 'Tidak Ada / Sangat Sulit', score: 0 },
      { value: 'Yes', label: 'Ada & Stabil', score: 1 }
    ]
  },
  {
    key: 'Teacher_Quality',
    category: 'environment',
    label: 'Bagaimana penilaian Anda terhadap kualitas pengajaran guru di sekolah?',
    description: 'Kejelasan cara mengajar guru, interaksi dalam kelas, dan kemudahan dalam memahami materi.',
    type: 'radio',
    defaultValue: 'Medium',
    options: [
      { value: 'Low', label: 'Kurang Jelas / Sulit Dipahami', score: 0 },
      { value: 'Medium', label: 'Cukup Baik & Standar', score: 1 },
      { value: 'High', label: 'Sangat Menyenangkan & Menginspirasi', score: 2 }
    ]
  },
  {
    key: 'Family_Income',
    category: 'environment',
    label: 'Kategori tingkat pendapatan keluarga Anda:',
    description: 'Kondisi ekonomi keluarga yang mempengaruhi fasilitas dan pemenuhan kebutuhan belajar.',
    type: 'radio',
    defaultValue: 'Medium',
    options: [
      { value: 'Low', label: 'Menengah ke Bawah (Perlu prioritas biaya khusus)', score: 0 },
      { value: 'Medium', label: 'Menengah (Kebutuhan belajar tercukupi dengan baik)', score: 1 },
      { value: 'High', label: 'Menengah ke Atas (Fasilitas belajar sangat leluasa)', score: 2 }
    ]
  },
  {
    key: 'Parental_Education_Level',
    category: 'environment',
    label: 'Tingkat pendidikan terakhir orang tua Anda:',
    description: 'Pendidikan terakhir ayah atau ibu.',
    type: 'select',
    defaultValue: 'College',
    options: [
      { value: 'High School', label: 'SMA / SMK / Sederajat' },
      { value: 'College', label: 'Diploma / Sarjana (S1)' },
      { value: 'Postgraduate', label: 'Magister (S2) / Doktoral (S3)' }
    ]
  },
  {
    key: 'School_Type',
    category: 'environment',
    label: 'Tipe sekolah Anda:',
    description: 'Status institusi tempat Anda menempuh pendidikan.',
    type: 'radio',
    defaultValue: 'Public',
    options: [
      { value: 'Public', label: 'Sekolah Negeri (Public)' },
      { value: 'Private', label: 'Sekolah Swasta (Private)' }
    ]
  },
  {
    key: 'Distance_from_Home',
    category: 'environment',
    label: 'Jarak dari tempat tinggal ke sekolah:',
    description: 'Waktu tempuh dan jarak tempuh perjalanan harian Anda ke sekolah.',
    type: 'radio',
    defaultValue: 'Near',
    options: [
      { value: 'Near', label: 'Dekat (< 15 menit)' },
      { value: 'Moderate', label: 'Sedang (15 - 45 menit)' },
      { value: 'Far', label: 'Jauh (> 45 menit)' }
    ]
  },

  // --- Kategori 3: Gaya Hidup & Faktor Pribadi ---
  {
    key: 'Sleep_Hours',
    category: 'personal',
    label: 'Berapa rata-rata jam tidur Anda per hari?',
    description: 'Istirahat malam yang cukup sangat berpengaruh pada daya tangkap dan konsentrasi otak.',
    type: 'slider',
    min: 4,
    max: 10,
    step: 1,
    unit: 'jam/hari',
    defaultValue: 7,
    benchmark: 'Disarankan 7–8 jam per hari untuk kesehatan otak'
  },
  {
    key: 'Physical_Activity',
    category: 'personal',
    label: 'Berapa jam Anda berolahraga atau aktivitas fisik per minggu?',
    description: 'Aktivitas fisik seperti jogging, sepak bola, bulu tangkis, gym, atau bersepeda.',
    type: 'slider',
    min: 0,
    max: 6,
    step: 1,
    unit: 'jam/minggu',
    defaultValue: 3,
    benchmark: 'Aktivitas fisik melancarkan sirkulasi oksigen ke otak'
  },
  {
    key: 'Extracurricular_Activities',
    category: 'personal',
    label: 'Apakah Anda aktif dalam kegiatan ekstrakurikuler atau organisasi?',
    description: 'Keikutsertaan dalam OSIS, pramuka, klub debat, olahraga, atau seni sekolah.',
    type: 'radio',
    defaultValue: 'Yes',
    options: [
      { value: 'No', label: 'Tidak Mengikuti', score: 0 },
      { value: 'Yes', label: 'Ya, Aktif Mengikuti', score: 1 }
    ]
  },
  {
    key: 'Peer_Influence',
    category: 'personal',
    label: 'Bagaimana pengaruh lingkungan teman sebaya terhadap kebiasaan belajar Anda?',
    description: 'Apakah teman-teman Anda mendukung untuk belajar bersama atau cenderung mengajak bermain.',
    type: 'radio',
    defaultValue: 'Positive',
    options: [
      { value: 'Negative', label: 'Negatif (Sering teralihkan bermain dan menunda tugas)' },
      { value: 'Neutral', label: 'Netral (Tidak terlalu mempengaruhi cara belajar)' },
      { value: 'Positive', label: 'Positif (Saling mengajak belajar, diskusi, & berprestasi)' }
    ]
  },
  {
    key: 'Learning_Disabilities',
    category: 'personal',
    label: 'Apakah Anda memiliki kondisi kesulitan belajar (learning difficulties)?',
    description: 'Misalnya disleksia, ADHD, atau hambatan fokus belajar spesifik.',
    type: 'radio',
    defaultValue: 'No',
    options: [
      { value: 'No', label: 'Tidak Ada Hambatan Khusus' },
      { value: 'Yes', label: 'Ya, Ada Kendala Belajar Tertentu' }
    ]
  },
  {
    key: 'Gender',
    category: 'personal',
    label: 'Jenis Kelamin:',
    description: 'Data demografi untuk statistik agregat.',
    type: 'radio',
    defaultValue: 'Male',
    options: [
      { value: 'Male', label: 'Laki-laki' },
      { value: 'Female', label: 'Perempuan' }
    ]
  }
];

export const INITIAL_FORM_VALUES = QUESTIONS.reduce((acc, q) => {
  acc[q.key] = q.defaultValue;
  return acc;
}, {});
