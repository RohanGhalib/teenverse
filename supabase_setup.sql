-- TEENVERSE PAKISTAN PRIMARY USER BASE & APPLICATION SCHEMA
-- Run this script in the Supabase SQL Editor (https://gboqmiksisnbsqcbnbwg.supabase.co)

-- 1. PRIMARY USER BASE TABLE (Acts as Auth Provider for Teenverse SSO across future domains)
CREATE TABLE IF NOT EXISTS public.teenverse_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id TEXT UNIQUE NOT NULL, -- e.g. TV-2026-89412
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    father_name TEXT NOT NULL,
    dob DATE NOT NULL,
    gender TEXT DEFAULT 'Male',
    city TEXT NOT NULL,
    province TEXT DEFAULT 'Punjab',
    address TEXT NOT NULL,
    education_level TEXT NOT NULL,
    institute_name TEXT NOT NULL,
    student_proof_url TEXT,
    primary_domain TEXT NOT NULL,
    weekly_hours TEXT DEFAULT '5-8 hours',
    referral_source TEXT DEFAULT 'Social Media',
    role TEXT DEFAULT 'teen_member', -- teen_member, squad_lead, admin
    account_status TEXT DEFAULT 'active', -- active, suspended
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. VOLUNTEER APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.volunteer_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_ref TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES public.teenverse_users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    primary_domain TEXT NOT NULL,
    why_join TEXT NOT NULL,
    expectations TEXT NOT NULL,
    ideas_to_launch TEXT NOT NULL,
    skills_and_mastery TEXT NOT NULL,
    pledge_accepted BOOLEAN DEFAULT true,
    application_status TEXT DEFAULT 'submitted', -- submitted, under_review, accepted, orientation_scheduled
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Row Level Security) with public insert access for registration
ALTER TABLE public.teenverse_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts to teenverse_users" ON public.teenverse_users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public inserts to volunteer_applications" ON public.volunteer_applications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read access to teenverse_users" ON public.teenverse_users
    FOR SELECT USING (true);

CREATE POLICY "Allow read access to volunteer_applications" ON public.volunteer_applications
    FOR SELECT USING (true);
