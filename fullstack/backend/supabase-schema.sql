-- ===================================================
-- EduTrack Database Schema for Supabase
-- Run this in your Supabase Project's SQL Editor
-- ===================================================

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
