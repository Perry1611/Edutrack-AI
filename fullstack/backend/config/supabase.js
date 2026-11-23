const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

let supabaseUrl = (process.env.SUPABASE_URL || '').trim();
// Strip trailing /rest/v1 or trailing slashes if copied from Data API docs
supabaseUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const supabaseAnonKey = (process.env.SUPABASE_ANON_KEY || '').trim();

let supabase = null;
let isConfigured = false;

if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-supabase-url')) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    isConfigured = true;
    console.log('✅ Supabase Client initialized successfully.');
  } catch (err) {
    console.warn('⚠️ Error initializing Supabase client:', err.message);
  }
} else {
  console.log('ℹ️ Supabase credentials not set or using placeholder. Running in local fallback/demo mode.');
}

// In-memory fallback repository when Supabase is not configured yet
const memoryStore = {
  users: [
    {
      id: 'demo-user-123',
      email: 'siswa@edutrack.id',
      password: 'password123',
      name: 'Budi Santoso',
      created_at: new Date().toISOString()
    }
  ],
  assessments: []
};

module.exports = {
  supabase,
  isConfigured,
  memoryStore
};
