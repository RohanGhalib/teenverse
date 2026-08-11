-- TEENVERSE PAKISTAN PRIMARY USER IDENTITY & CENTRAL SSO SCHEMA
-- Run this script in the Supabase SQL Editor (https://gboqmiksisnbsqcbnbwg.supabase.co)

-- 1. PRIMARY USER IDENTITY TABLE (Central Auth Provider for Teenverse SSO across future domains)
CREATE TABLE IF NOT EXISTS public.teenverse_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id TEXT UNIQUE NOT NULL, -- e.g. TV-2026-89412
    email TEXT UNIQUE NOT NULL,
    email_verified BOOLEAN DEFAULT false,
    email_verified_at TIMESTAMP WITH TIME ZONE,
    phone TEXT NOT NULL,
    phone_verified BOOLEAN DEFAULT false,
    
    -- Profile Information
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    father_name TEXT NOT NULL,
    dob DATE NOT NULL,
    gender TEXT DEFAULT 'Male',
    city TEXT NOT NULL,
    province TEXT DEFAULT 'Punjab',
    address TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    
    -- Social & Developer Handles
    github_handle TEXT,
    linkedin_url TEXT,
    discord_handle TEXT,
    
    -- Education & Verification
    education_level TEXT NOT NULL,
    institute_name TEXT NOT NULL,
    student_proof_url TEXT,
    is_verified_student BOOLEAN DEFAULT false,
    
    -- Roles & Taxonomy (Array for multi-role support)
    -- e.g. ARRAY['teen_member', 'volunteer', 'hacker', 'executive_council', 'founder']
    roles TEXT[] DEFAULT ARRAY['teen_member']::TEXT[],
    primary_domain TEXT NOT NULL,
    weekly_hours TEXT DEFAULT '5-8 hours',
    referral_source TEXT DEFAULT 'Social Media',
    
    -- Account Lifecycle
    account_status TEXT DEFAULT 'active', -- active, suspended, archived
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_teenverse_users_email ON public.teenverse_users(email);
CREATE INDEX IF NOT EXISTS idx_teenverse_users_account_id ON public.teenverse_users(account_id);


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
    application_status TEXT DEFAULT 'submitted', -- submitted, under_review, accepted, rejected, orientation_scheduled
    reviewer_notes TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- 3. EVENTS & SUBDOMAIN REGISTRATIONS (e.g., Scrapyard Hackathon)
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL, -- e.g. 'scrapyard-2026'
    name TEXT NOT NULL, -- e.g. 'Scrapyard Hackathon 2026'
    subdomain TEXT UNIQUE NOT NULL, -- e.g. 'scrapyard.teenverse.org'
    description TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.teenverse_users(id) ON DELETE CASCADE,
    registration_ref TEXT UNIQUE NOT NULL, -- e.g. SCRAP-2026-10492
    
    -- Event specific data
    team_name TEXT,
    team_role TEXT, -- Lead, Hacker, Designer, Mentor
    check_in_status BOOLEAN DEFAULT false,
    checked_in_at TIMESTAMP WITH TIME ZONE,
    
    metadata JSONB DEFAULT '{}'::jsonb, -- Custom dynamic event fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(event_id, user_id)
);


-- 4. OAUTH 2.0 / SSO CLIENT APPLICATIONS (Monorepo & Multi-repo Apps)
CREATE TABLE IF NOT EXISTS public.oauth_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id TEXT UNIQUE NOT NULL, -- e.g. tv_app_scrapyard_8a9f
    client_secret_hash TEXT NOT NULL,
    name TEXT NOT NULL, -- e.g. 'Scrapyard Hackathon Portal'
    subdomain TEXT NOT NULL, -- e.g. 'scrapyard.teenverse.org'
    redirect_uris TEXT[] NOT NULL, -- e.g. ARRAY['https://scrapyard.teenverse.org/api/auth/callback']
    is_trusted BOOLEAN DEFAULT false, -- Trusted internal apps bypass user consent screen
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.oauth_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.teenverse_users(id) ON DELETE CASCADE,
    client_id TEXT REFERENCES public.oauth_applications(client_id) ON DELETE CASCADE,
    access_token TEXT UNIQUE NOT NULL,
    refresh_token TEXT UNIQUE NOT NULL,
    scope TEXT DEFAULT 'openid profile email',
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- 5. BADGES & RECOGNITION
CREATE TABLE IF NOT EXISTS public.user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.teenverse_users(id) ON DELETE CASCADE,
    badge_key TEXT NOT NULL, -- e.g. 'founding_squad', 'scrapyard_hacker_2026', 'bootcamp_instructor'
    title TEXT NOT NULL,
    description TEXT,
    icon_emoji TEXT DEFAULT '🏆',
    awarded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.teenverse_users(id) ON DELETE SET NULL,
    action TEXT NOT NULL, -- e.g. 'LOGIN_OTP', 'SSO_AUTHORIZE', 'APPLICATION_SUBMITTED'
    ip_address TEXT,
    user_agent TEXT,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- Enable Row Level Security (RLS)
ALTER TABLE public.teenverse_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Public Insert Access Policies
CREATE POLICY "Allow public inserts to teenverse_users" ON public.teenverse_users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public inserts to volunteer_applications" ON public.volunteer_applications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read access to teenverse_users" ON public.teenverse_users
    FOR SELECT USING (true);

CREATE POLICY "Allow read access to volunteer_applications" ON public.volunteer_applications
    FOR SELECT USING (true);

CREATE POLICY "Allow read access to events" ON public.events
    FOR SELECT USING (true);

CREATE POLICY "Allow public inserts to event_registrations" ON public.event_registrations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read access to event_registrations" ON public.event_registrations
    FOR SELECT USING (true);
