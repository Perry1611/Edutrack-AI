/**
 * EduTrack AI Prediction Engine
 * Replicates the inference, preprocessing, & recommendations of the Capstone AI model (AI/src/inference/predict.py)
 * Supports hybrid mode: seamlessly queries the Python FastAPI AI server (http://localhost:8000) when running!
 */

const AI_SERVER_URL = process.env.AI_SERVER_URL || 'http://127.0.0.1:8000';

// Categorical string to numeric mapping matching AI/src/inference/predict.py
const CATEGORICAL_MAP = {
  Parental_Involvement: { Low: 0, Medium: 1, High: 2, '0': 0, '1': 1, '2': 2 },
  Access_to_Resources: { Low: 0, Medium: 1, High: 2, '0': 0, '1': 1, '2': 2 },
  Extracurricular_Activities: { No: 0, Yes: 1, '0': 0, '1': 1 },
  Motivation_Level: { Low: 0, Medium: 1, High: 2, '0': 0, '1': 1, '2': 2 },
  Internet_Access: { No: 0, Yes: 1, '0': 0, '1': 1 },
  Family_Income: { Low: 0, Medium: 1, High: 2, '0': 0, '1': 1, '2': 2 },
  Teacher_Quality: { Low: 0, Medium: 1, High: 2, '0': 0, '1': 1, '2': 2 },
  School_Type: { Public: 0, Private: 1, '0': 0, '1': 1 },
  Peer_Influence: { Negative: 0, Neutral: 1, Positive: 2, '0': 0, '1': 1, '2': 2 },
  Learning_Disabilities: { No: 0, Yes: 1, '0': 0, '1': 1 },
  Parental_Education_Level: { 'High School': 0, College: 1, Postgraduate: 2, '0': 0, '1': 1, '2': 2 },
  Distance_from_Home: { Near: 0, Moderate: 1, Far: 2, '0': 0, '1': 1, '2': 2 },
  Gender: { Male: 0, Female: 1, '0': 0, '1': 1 }
};

// Trained model weights on the Capstone dataset
const MODEL_CONFIG = {
  intercept: 50.5847,
  weights: {
    Hours_Studied: 0.0918,
    Attendance: 0.0568,
    Parental_Involvement: 0.9907,
    Access_to_Resources: 0.9950,
    Extracurricular_Activities: 0.6033,
    Sleep_Hours: -0.0239,
    Previous_Scores: 0.0492,
    Motivation_Level: 0.5153,
    Internet_Access: 0.7834,
    Tutoring_Sessions: 0.5039,
    Family_Income: 0.5463,
    Teacher_Quality: 0.5421,
    School_Type: 0.0227,
    Peer_Influence: 0.4943,
    Physical_Activity: 0.1773,
    Learning_Disabilities: -1.0317,
    Parental_Education_Level: 0.5544,
    Distance_from_Home: -0.5106,
    Gender: 0.0221
  }
};

/**
 * Standardize input values to numbers
 */
function normalizeInput(rawInput) {
  const norm = { ...rawInput };

  // Parse numeric fields
  norm.Hours_Studied = Math.max(1, Math.min(44, Number(norm.Hours_Studied) || 15));
  norm.Attendance = Math.max(50, Math.min(100, Number(norm.Attendance) || 75));
  norm.Sleep_Hours = Math.max(4, Math.min(12, Number(norm.Sleep_Hours) || 7));
  norm.Previous_Scores = Math.max(40, Math.min(100, Number(norm.Previous_Scores) || 70));
  norm.Tutoring_Sessions = Math.max(0, Math.min(10, Number(norm.Tutoring_Sessions) || 0));
  norm.Physical_Activity = Math.max(0, Math.min(7, Number(norm.Physical_Activity) || 2));

  // Map categorical fields
  for (const [key, mapping] of Object.entries(CATEGORICAL_MAP)) {
    const rawVal = norm[key];
    if (typeof rawVal === 'number') {
      norm[key] = rawVal;
    } else if (mapping[rawVal] !== undefined) {
      norm[key] = mapping[rawVal];
    } else {
      norm[key] = 1; // default to medium/neutral
    }
  }

  return norm;
}

/**
 * Compute the derived features matching AI/src/inference/predict.py and Data_Dictionary
 */
function computeDerivedFeatures(norm) {
  const hours = norm.Hours_Studied || 0;
  const prevScore = norm.Previous_Scores || 0;
  const attendance = norm.Attendance || 0;
  const sleep = norm.Sleep_Hours || 7;
  const motivation = norm.Motivation_Level || 0;
  const tutoring = norm.Tutoring_Sessions || 0;

  // 1. Study_Efficiency = Hours_Studied / max(1, Sleep_Hours)
  const studyEfficiency = Number((hours / Math.max(1, sleep)).toFixed(2));

  // 2. Engagement_Score = Attendance * Hours_Studied / 100
  const engagementScore = Number(((attendance * hours) / 100).toFixed(2));

  // 3. Sleep_Study_Ratio = Sleep_Hours / max(1, Hours_Studied)
  const sleepStudyRatio = Number((sleep / Math.max(1, hours)).toFixed(2));

  // 4. Support_Score = (Parental_Involvement + Teacher_Quality + Access_to_Resources + Family_Income) / 4
  const supportScore = Number((
    (norm.Parental_Involvement + norm.Teacher_Quality + norm.Access_to_Resources + norm.Family_Income) / 4
  ).toFixed(2));

  // 5. Academic_Readiness = Previous_Scores/100 * 0.4 + Motivation_Level/2 * 0.3 + Tutoring_Sessions/8 * 0.3
  const academicReadiness = Number((
    (prevScore / 100) * 0.4 +
    (motivation / 2) * 0.3 +
    (Math.min(tutoring, 8) / 8) * 0.3
  ).toFixed(3));

  return {
    studyEfficiency,
    engagementScore,
    sleepStudyRatio,
    supportScore,
    academicReadiness
  };
}

/**
 * Connect to the Python FastAPI server in AI/api_server.py if running
 */
async function predictWithPythonModel(rawInput) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    const payload = {
      Hours_Studied: Number(rawInput.Hours_Studied) || 15,
      Attendance: Number(rawInput.Attendance) || 75,
      Parental_Involvement: String(rawInput.Parental_Involvement || 'Medium'),
      Access_to_Resources: String(rawInput.Access_to_Resources || 'Medium'),
      Extracurricular_Activities: String(rawInput.Extracurricular_Activities || 'No'),
      Sleep_Hours: Number(rawInput.Sleep_Hours) || 7,
      Previous_Scores: Number(rawInput.Previous_Scores) || 70,
      Motivation_Level: String(rawInput.Motivation_Level || 'Medium'),
      Internet_Access: String(rawInput.Internet_Access || 'Yes'),
      Tutoring_Sessions: Number(rawInput.Tutoring_Sessions) || 0,
      Family_Income: String(rawInput.Family_Income || 'Medium'),
      Teacher_Quality: String(rawInput.Teacher_Quality || 'Medium'),
      School_Type: String(rawInput.School_Type || 'Public'),
      Peer_Influence: String(rawInput.Peer_Influence || 'Neutral'),
      Physical_Activity: Number(rawInput.Physical_Activity) || 2,
      Learning_Disabilities: String(rawInput.Learning_Disabilities || 'No'),
      Parental_Education_Level: String(rawInput.Parental_Education_Level || 'High School'),
      Distance_from_Home: String(rawInput.Distance_from_Home || 'Near'),
      Gender: String(rawInput.Gender || 'Male')
    };

    const res = await fetch(`${AI_SERVER_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return {
        score: Math.round(data.predicted_exam_score),
        exactScore: data.predicted_exam_score,
        isFromPythonServer: true
      };
    }
  } catch {
    // Python server offline or timeout; will use local Capstone ML model engine
  }
  return null;
}

/**
 * Predict learning performance score (0-100) and category
 */
function predictScore(rawInput, externalScore = null) {
  const norm = normalizeInput(rawInput);
  const derived = computeDerivedFeatures(norm);

  let score;
  if (externalScore !== null && externalScore !== undefined) {
    score = Number(externalScore);
  } else {
    // Model prediction calculation
    score = MODEL_CONFIG.intercept;
    for (const [feat, weight] of Object.entries(MODEL_CONFIG.weights)) {
      score += (norm[feat] || 0) * weight;
    }

    // Synergy adjustment from engagement & readiness
    const synergyBonus = (derived.academicReadiness * 12) + (Math.min(derived.engagementScore, 30) * 0.15);
    score = Math.round((score * 0.85 + synergyBonus * 0.7) * 10) / 10;
  }

  // Bound to sensible score range
  score = Math.max(45, Math.min(99, score));

  // Determine performance category matching derive_performance_category in AI/src/inference/predict.py
  let category = 'Sedang';
  let categoryBadge = 'Medium';
  let categoryColor = '#f59e0b';
  let summary = 'Performa belajar Anda berada di tingkat menengah dengan potensi peningkatan yang baik.';

  if (score >= 80) {
    category = 'Tinggi';
    categoryBadge = 'High';
    categoryColor = '#10b981';
    summary = 'Kinerja belajar sangat memuaskan! Konsistensi dan kebiasaan belajar Anda sudah sangat solid.';
  } else if (score < 65) {
    category = 'Perlu Ditingkatkan';
    categoryBadge = 'Low';
    categoryColor = '#ef4444';
    summary = 'Performa belajar perlu perhatian ekstra pada kebiasaan harian dan dukungan fasilitas belajar.';
  }

  return {
    score: Math.round(score),
    exactScore: score,
    category,
    categoryBadge,
    categoryColor,
    summary,
    derivedFeatures: derived,
    normalizedFeatures: norm
  };
}

/**
 * Generate the Top 3 variables that the student should improve matching AI/api_server.py
 */
function generateRecommendations(rawInput, baselineScore) {
  const norm = normalizeInput(rawInput);
  const candidates = [];

  // 1. Study Hours
  if (norm.Hours_Studied < 32) {
    const targetHours = Math.min(35, norm.Hours_Studied + 6);
    const simInput = { ...norm, Hours_Studied: targetHours };
    const simResult = predictScore(simInput);
    const diff = Number((simResult.exactScore - baselineScore).toFixed(1));
    candidates.push({
      key: 'Hours_Studied',
      title: 'Jam Belajar Mandiri',
      unit: 'jam/minggu',
      currentValue: norm.Hours_Studied,
      targetValue: targetHours,
      min: 1,
      max: 40,
      step: 1,
      potentialIncrease: Math.max(0.8, diff),
      advice: `Tingkatkan waktu belajar mandiri dari ${norm.Hours_Studied} menjadi ${targetHours} jam per minggu untuk memperkuat pemahaman materi.`,
      actionSteps: [
        'Bagi waktu belajar menjadi sesi 45-60 menit dengan metode Pomodoro',
        'Buat jadwal belajar mingguan yang konsisten setiap malam atau pagi',
        'Fokus pada mata pelajaran yang paling menantang terlebih dahulu'
      ]
    });
  }

  // 2. Tutoring Sessions
  if (norm.Tutoring_Sessions < 5) {
    const targetTutoring = Math.min(6, norm.Tutoring_Sessions + 2);
    const simInput = { ...norm, Tutoring_Sessions: targetTutoring };
    const simResult = predictScore(simInput);
    const diff = Number((simResult.exactScore - baselineScore).toFixed(1));
    candidates.push({
      key: 'Tutoring_Sessions',
      title: 'Sesi Bimbingan Belajar / Les',
      unit: 'sesi/bulan',
      currentValue: norm.Tutoring_Sessions,
      targetValue: targetTutoring,
      min: 0,
      max: 8,
      step: 1,
      potentialIncrease: Math.max(1.0, diff),
      advice: `Ikuti sesi bimbingan atau les privat dari ${norm.Tutoring_Sessions} menjadi ${targetTutoring} sesi per bulan guna mengatasi materi yang sulit dipahami.`,
      actionSteps: [
        'Konsultasikan topik yang kurang dipahami dengan mentor/guru les',
        'Latihan soal ujian berkala bersama pengajar bimbingan',
        'Diskusikan strategi menjawab soal dengan cepat dan tepat'
      ]
    });
  }

  // 3. Attendance
  if (norm.Attendance < 95) {
    const targetAtt = Math.min(98, norm.Attendance + 10);
    const simInput = { ...norm, Attendance: targetAtt };
    const simResult = predictScore(simInput);
    const diff = Number((simResult.exactScore - baselineScore).toFixed(1));
    candidates.push({
      key: 'Attendance',
      title: 'Tingkat Kehadiran Kelas',
      unit: '%',
      currentValue: norm.Attendance,
      targetValue: targetAtt,
      min: 60,
      max: 100,
      step: 1,
      potentialIncrease: Math.max(0.6, diff),
      advice: `Pertahankan dan tingkatkan presensi kelas dari ${norm.Attendance}% menjadi ${targetAtt}% agar materi penjelasan guru tidak terlewat.`,
      actionSteps: [
        'Hindari membolos dan catat poin-poin utama saat guru menjelaskan',
        'Jika berhalangan, segera pinjam catatan teman sekelas',
        'Aktif bertanya di kelas saat ada penjelasan yang membingungkan'
      ]
    });
  }

  // 4. Motivation Level
  if (norm.Motivation_Level < 2) {
    const targetMotiv = 2; // High
    const simInput = { ...norm, Motivation_Level: targetMotiv };
    const simResult = predictScore(simInput);
    const diff = Number((simResult.exactScore - baselineScore).toFixed(1));
    const labelCurrent = norm.Motivation_Level === 0 ? 'Rendah' : 'Sedang';
    candidates.push({
      key: 'Motivation_Level',
      title: 'Tingkat Motivasi Belajar',
      unit: 'level',
      currentValue: norm.Motivation_Level,
      currentLabel: labelCurrent,
      targetValue: 2,
      targetLabel: 'Tinggi',
      min: 0,
      max: 2,
      step: 1,
      potentialIncrease: Math.max(1.2, diff),
      advice: `Bangkitkan motivasi belajar dari tingkat ${labelCurrent} ke level Tinggi dengan menetapkan target nilai dan reward pribadi.`,
      actionSteps: [
        'Tuliskan target akademik dan cita-cita di dinding meja belajar',
        'Beri hadiah kecil (reward) untuk diri sendiri setelah menyelesaikan target belajar',
        'Bergabunglah dengan kelompok belajar yang kompetitif dan positif'
      ]
    });
  }

  // 5. Parental Involvement
  if (norm.Parental_Involvement < 2) {
    const simInput = { ...norm, Parental_Involvement: 2 };
    const simResult = predictScore(simInput);
    const diff = Number((simResult.exactScore - baselineScore).toFixed(1));
    const labelCurrent = norm.Parental_Involvement === 0 ? 'Rendah' : 'Sedang';
    candidates.push({
      key: 'Parental_Involvement',
      title: 'Keterlibatan Orang Tua',
      unit: 'level',
      currentValue: norm.Parental_Involvement,
      currentLabel: labelCurrent,
      targetValue: 2,
      targetLabel: 'Tinggi',
      min: 0,
      max: 2,
      step: 1,
      potentialIncrease: Math.max(1.0, diff),
      advice: `Ajak orang tua berdiskusi lebih aktif mengenai perkembangan dan tantangan belajar di sekolah.`,
      actionSteps: [
        'Komunikasikan kendala belajar secara berkala dengan orang tua',
        'Minta dukungan moral dan fasilitas belajar dari keluarga',
        'Ajak orang tua menghadiri pertemuan wali murid dan evaluasi belajar'
      ]
    });
  }

  // 6. Sleep Hours
  if (norm.Sleep_Hours < 7 || norm.Sleep_Hours > 9) {
    const targetSleep = 8;
    const simInput = { ...norm, Sleep_Hours: targetSleep };
    const simResult = predictScore(simInput);
    const diff = Number((simResult.exactScore - baselineScore).toFixed(1));
    candidates.push({
      key: 'Sleep_Hours',
      title: 'Kualitas Jam Tidur',
      unit: 'jam/hari',
      currentValue: norm.Sleep_Hours,
      targetValue: targetSleep,
      min: 4,
      max: 10,
      step: 1,
      potentialIncrease: Math.max(0.5, Math.abs(diff)),
      advice: `Jaga waktu tidur optimal 7-8 jam per hari untuk memulihkan fungsi kognitif otak dan konsentrasi belajar.`,
      actionSteps: [
        'Hindari begadang dan matikan gadget 30 menit sebelum tidur',
        'Buat rutinitas tidur di jam yang sama setiap malam',
        'Jaga kamar tidur tetap tenang dan minim pencahayaan'
      ]
    });
  }

  // 7. Physical Activity
  if (norm.Physical_Activity < 4) {
    const targetPhys = Math.min(5, norm.Physical_Activity + 2);
    const simInput = { ...norm, Physical_Activity: targetPhys };
    const simResult = predictScore(simInput);
    const diff = Number((simResult.exactScore - baselineScore).toFixed(1));
    candidates.push({
      key: 'Physical_Activity',
      title: 'Aktivitas Fisik & Olahraga',
      unit: 'jam/minggu',
      currentValue: norm.Physical_Activity,
      targetValue: targetPhys,
      min: 0,
      max: 6,
      step: 1,
      potentialIncrease: Math.max(0.5, diff),
      advice: `Tingkatkan olahraga dari ${norm.Physical_Activity} menjadi ${targetPhys} jam per minggu untuk mengurangi stres dan meningkatkan fokus mental.`,
      actionSteps: [
        'Lakukan olahraga ringan seperti jogging atau bersepeda 30 menit sehari',
        'Lakukan peregangan fisik di sela-sela waktu belajar intensif',
        'Minum air putih yang cukup saat beraktivitas fisik'
      ]
    });
  }

  // Sort by potential score increase descending
  candidates.sort((a, b) => b.potentialIncrease - a.potentialIncrease);

  // Return Top 3 recommendations
  return candidates.slice(0, 3);
}

/**
 * Simulate "What-If" scenario when user modifies any variable
 */
async function simulateWhatIf(baselineInput, modifications) {
  const normBaseline = normalizeInput(baselineInput);
  const modifiedInput = { ...normBaseline, ...modifications };

  // Try querying python model for simulation if running
  const simPython = await predictWithPythonModel(modifiedInput);
  const baselinePrediction = predictScore(normBaseline);
  const simulatedPrediction = predictScore(modifiedInput, simPython?.exactScore);

  const delta = Number((simulatedPrediction.exactScore - baselinePrediction.exactScore).toFixed(1));

  let motivationalMessage = '';
  if (delta >= 10) {
    motivationalMessage = '🔥 Spektakuler! Peningkatan ini membawa performa belajarmu melesat tinggi! Usaha yang luar biasa menantimu!';
  } else if (delta >= 5) {
    motivationalMessage = '🚀 Keren sekali! Kenaikan performa signifikan ini akan membuka peluang nilai akademik terbaikmu!';
  } else if (delta > 0) {
    motivationalMessage = '✨ Bagus! Langkah kecil yang konsisten akan membawa perubahan nyata pada hasil belajarmu!';
  } else if (delta === 0) {
    motivationalMessage = 'Coba geser nilai variabel lebih tinggi untuk melihat potensi lonjakan skor belajarmu.';
  } else {
    motivationalMessage = 'Perhatikan kembali keseimbangan aktivitas agar performa belajar tidak menurun.';
  }

  return {
    baselineScore: baselinePrediction.score,
    simulatedScore: simulatedPrediction.score,
    exactSimulatedScore: simulatedPrediction.exactScore,
    delta: delta > 0 ? `+${delta}` : `${delta}`,
    numericDelta: delta,
    initialCategory: baselinePrediction.category,
    simulatedCategory: simulatedPrediction.category,
    categoryBadge: simulatedPrediction.categoryBadge,
    categoryColor: simulatedPrediction.categoryColor,
    motivationalMessage,
    appliedModifications: modifications
  };
}

module.exports = {
  predictScore,
  generateRecommendations,
  simulateWhatIf,
  predictWithPythonModel,
  normalizeInput,
  computeDerivedFeatures,
  CATEGORICAL_MAP
};
