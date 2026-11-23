/**
 * API service for communicating with EduTrack Node.js Backend
 */

const BASE_URL = '/api';

export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login gagal.');
  return data;
}

export async function register(email, password, fullName) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, fullName })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Registrasi gagal.');
  return data;
}

export async function predictPerformance(formData) {
  const res = await fetch(`${BASE_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Gagal memprediksi skor.');
  return json.data;
}

export async function simulateWhatIf(baselineInput, modifications) {
  const res = await fetch(`${BASE_URL}/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ baselineInput, modifications })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Simulasi gagal.');
  return json.data;
}

export async function saveAssessment(userId, answers, results) {
  const res = await fetch(`${BASE_URL}/assessments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, answers, results })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Gagal menyimpan asesmen.');
  return json.assessment;
}

export async function getLatestAssessment(userId) {
  const res = await fetch(`${BASE_URL}/assessments/latest/${userId}`);
  const json = await res.json();
  return json.assessment;
}

export async function getAssessmentHistory(userId) {
  try {
    const res = await fetch(`${BASE_URL}/assessments/history/${userId}`);
    const json = await res.json();
    return json.assessments || [];
  } catch (err) {
    console.error('Failed to get assessment history:', err);
    return [];
  }
}

export async function getDatasetSummary() {
  const res = await fetch(`${BASE_URL}/dataset/summary`);
  return await res.json();
}
