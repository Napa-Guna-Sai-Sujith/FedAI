import { createClient } from '@supabase/supabase-js';

export interface SupabaseRuntimeConfig {
  url: string;
  anonKey: string;
}

const STORAGE_KEY = 'fedhealth_supabase_config';

// Your provided project reference / URL is now the default base URL.
// Supabase JS expects the project root URL, not the /rest/v1 endpoint.
export const DEFAULT_SUPABASE_URL = 'https://cyvkgjgaimroivjdbfay.supabase.co';
export const DEFAULT_PROJECT_REF = 'cyvkgjgaimroivjdbfay';

export const getSupabaseConfig = (): SupabaseRuntimeConfig => {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
  const envAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

  if (envUrl && envAnonKey) {
    return { url: envUrl, anonKey: envAnonKey };
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        url: parsed.url || DEFAULT_SUPABASE_URL,
        anonKey: parsed.anonKey || ''
      };
    }
  } catch {
    // ignore malformed localStorage config
  }

  return {
    url: DEFAULT_SUPABASE_URL,
    anonKey: ''
  };
};

export const saveSupabaseConfig = (config: SupabaseRuntimeConfig) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
};

export const clearSupabaseConfig = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const hasValidSupabaseConfig = () => {
  const cfg = getSupabaseConfig();
  return Boolean(cfg.url && cfg.anonKey);
};

export const getSupabaseClient = () => {
  const cfg = getSupabaseConfig();
  const safeAnonKey = cfg.anonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder.anon_key';
  return createClient(cfg.url, safeAnonKey);
};

// Backward-compatible default instance for static imports.
export const supabase = getSupabaseClient();

export interface UserProfileInput {
  id?: string;
  email: string;
  full_name: string;
  role: string;
  institution: string;
  phone?: string;
  department?: string;
  specialization?: string;
  license_number?: string;
  country?: string;
  bio?: string;
  avatar_url?: string;
}

export const fetchUserProfile = async (userId: string) => {
  if (!hasValidSupabaseConfig()) return null;
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error) return null;
  return data;
};

export const upsertUserProfile = async (profile: UserProfileInput) => {
  if (!hasValidSupabaseConfig()) return { data: null, error: null };
  const supabase = getSupabaseClient();
  return await supabase.from('profiles').upsert({
    ...profile,
    updated_at: new Date().toISOString(),
    last_login_at: new Date().toISOString()
  }).select().single();
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfileInput>) => {
  if (!hasValidSupabaseConfig()) return { data: null, error: null };
  const supabase = getSupabaseClient();
  return await supabase.from('profiles').update({
    ...updates,
    updated_at: new Date().toISOString()
  }).eq('id', userId).select().single();
};

export const insertLoginRecord = async (payload: {
  user_id: string;
  email: string;
  status: string;
  institution?: string;
  user_agent?: string;
}) => {
  if (!hasValidSupabaseConfig()) return { data: null, error: null };
  const supabase = getSupabaseClient();
  return await supabase.from('login_records').insert({
    id: crypto.randomUUID(),
    user_id: payload.user_id,
    email: payload.email,
    status: payload.status,
    institution: payload.institution || null,
    user_agent: payload.user_agent || navigator.userAgent,
    login_time: new Date().toISOString()
  });
};

export const fetchLoginRecords = async (userId: string) => {
  if (!hasValidSupabaseConfig()) return [];
  const supabase = getSupabaseClient();
  const { data } = await supabase
    .from('login_records')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);
  return data || [];
};

// SQL Schema definition string for user reference
export const SUPABASE_SQL_SCHEMA = `-- ==========================================
-- FedHealth AI Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- IMPORTANT: To stop confirmation emails for demo usage,
-- go to Authentication > Providers > Email and disable "Confirm email"
-- ==========================================

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- 1. Rich user profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  role text default 'researcher'::text,
  institution text default 'Metro General Hospital'::text,
  phone text,
  department text,
  specialization text,
  license_number text,
  country text,
  bio text,
  avatar_url text,
  last_login_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Auto-create profile rows on signup from auth.users metadata
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    full_name,
    role,
    institution,
    phone,
    department,
    specialization,
    license_number,
    country,
    bio,
    avatar_url
  ) values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'researcher'),
    coalesce(new.raw_user_meta_data->>'institution', 'Metro General Hospital'),
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'department',
    new.raw_user_meta_data->>'specialization',
    new.raw_user_meta_data->>'license_number',
    new.raw_user_meta_data->>'country',
    new.raw_user_meta_data->>'bio',
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = excluded.full_name,
    role = excluded.role,
    institution = excluded.institution,
    phone = excluded.phone,
    department = excluded.department,
    specialization = excluded.specialization,
    license_number = excluded.license_number,
    country = excluded.country,
    bio = excluded.bio,
    avatar_url = excluded.avatar_url,
    updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Login audit records table
create table if not exists public.login_records (
  id text primary key,
  user_id uuid references auth.users on delete cascade not null,
  email text not null,
  institution text,
  status text default 'success'::text,
  user_agent text,
  login_time timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Hospital Nodes table
create table if not exists public.hospital_nodes (
  id text primary key,
  name text not null,
  location text not null,
  type text not null,
  patient_count integer default 50000,
  local_accuracy double precision default 88.5,
  contribution_weight double precision default 15.0,
  status text default 'online'::text,
  compute_power text default 'Simulated Edge AI Enclave'::text,
  privacy_noise_level double precision default 1.2,
  last_sync text default 'Just now'::text,
  latency_ms integer default 25,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Disease Models table
create table if not exists public.disease_models (
  id text primary key,
  name text not null,
  code_name text not null,
  description text not null,
  clinical_focus text not null,
  global_accuracy double precision default 89.4,
  total_rounds integer default 142,
  active_nodes_count integer default 5,
  total_patient_records integer default 482500,
  privacy_epsilon double precision default 1.24,
  architecture text not null,
  weights_hash text not null,
  last_updated text default 'Just now'::text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Training Logs table
create table if not exists public.training_logs (
  id text primary key,
  round integer not null,
  timestamp text default 'Just now'::text,
  model_id text references public.disease_models(id) on delete cascade not null,
  model_name text not null,
  participating_nodes text[] not null,
  global_loss_before double precision not null,
  global_loss_after double precision not null,
  global_accuracy_before double precision not null,
  global_accuracy_after double precision not null,
  aggregation_method text default 'FedAvg'::text,
  privacy_budget_used double precision not null,
  time_taken_ms integer not null,
  status text default 'completed'::text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Patient Batch Records table
create table if not exists public.patient_batch_records (
  id text primary key,
  user_id uuid references auth.users on delete cascade not null,
  age integer not null,
  gender text not null,
  bmi double precision not null,
  blood_pressure_sys integer not null,
  blood_glucose integer not null,
  cholesterol_total integer not null,
  smoker boolean default false,
  risk_score integer not null,
  risk_level text not null,
  encrypted_hash text not null,
  evaluation_time text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Enable RLS
alter table public.profiles enable row level security;
alter table public.login_records enable row level security;
alter table public.hospital_nodes enable row level security;
alter table public.disease_models enable row level security;
alter table public.training_logs enable row level security;
alter table public.patient_batch_records enable row level security;

-- 9. Policies
create policy if not exists "Allow public read access on hospital_nodes" on public.hospital_nodes for select using (true);
create policy if not exists "Allow public read access on disease_models" on public.disease_models for select using (true);
create policy if not exists "Allow public read access on training_logs" on public.training_logs for select using (true);
create policy if not exists "Allow auth insert on training_logs" on public.training_logs for insert to authenticated with check (true);
create policy if not exists "Allow auth update on hospital_nodes" on public.hospital_nodes for update to authenticated using (true);
create policy if not exists "Allow auth insert on patient_batch_records" on public.patient_batch_records for insert to authenticated with check (auth.uid() = user_id);
create policy if not exists "Allow auth read on patient_batch_records" on public.patient_batch_records for select to authenticated using (auth.uid() = user_id);
create policy if not exists "Allow auth read on profiles" on public.profiles for select to authenticated using (auth.uid() = id);
create policy if not exists "Allow auth insert on profiles" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy if not exists "Allow auth update on profiles" on public.profiles for update to authenticated using (auth.uid() = id);
create policy if not exists "Allow auth read on login_records" on public.login_records for select to authenticated using (auth.uid() = user_id);
create policy if not exists "Allow auth insert on login_records" on public.login_records for insert to authenticated with check (auth.uid() = user_id);

-- 10. Seed hospital nodes
insert into public.hospital_nodes (id, name, location, type, patient_count, local_accuracy, contribution_weight, status, compute_power, privacy_noise_level, latency_ms) values
('node-1', 'Metro General Hospital', 'New York, USA', 'general', 145000, 89.1, 30.0, 'online', 'NVIDIA DGX A100 (Cluster)', 1.2, 24),
('node-2', 'St. Jude Medical Center', 'Chicago, USA', 'academic', 120000, 90.4, 25.0, 'training', 'HPC Cloud Bio-Cluster', 0.8, 18),
('node-3', 'Apex Health Research Labs', 'Boston, USA', 'specialized', 85000, 88.7, 18.0, 'online', 'AWS EC2 P4d Instances', 1.5, 35),
('node-4', 'Community Care Clinics Consortium', 'Austin, USA', 'community', 95000, 87.2, 20.0, 'aggregating', 'Local Edge Server Farm', 1.0, 42),
('node-5', 'Global Wearable IoT Health Aggregator', 'San Francisco, USA', 'wearable_aggregator', 37500, 85.9, 7.0, 'online', 'Distributed Edge Enclaves', 2.0, 65)
on conflict (id) do nothing;

-- 11. Seed disease models
insert into public.disease_models (id, name, code_name, description, clinical_focus, global_accuracy, total_rounds, active_nodes_count, total_patient_records, privacy_epsilon, architecture, weights_hash) values
('cvd', 'Cardiovascular Disease Risk Prediction', 'CVD-Net v4.2', 'Predicts 10-year risk of major adverse cardiovascular events (MACE) using federated deep neural networks trained across diverse clinical demographics.', 'Cardiology, Preventive Medicine', 89.4, 142, 6, 482500, 1.24, '4-Layer MLP with BatchNorm & LeakyReLU (128->64->32->1)', '0x8f3c...9a12'),
('diabetes', 'Type 2 Diabetes Progression AI', 'DiaFed-AI v3.0', 'Early detection and 5-year progression forecasting for Type 2 Diabetes mellitus, incorporating longitudinal glycemic trends and lifestyle factors.', 'Endocrinology, Metabolic Health', 91.2, 98, 5, 315000, 0.85, 'ResNet-style Tabular FNN with Skip Connections (64->64->32->1)', '0x4b1a...7c8f'),
('ckd', 'Chronic Kidney Disease Stratification', 'RenalGuard FNN', 'Identifies patients at risk of rapid eGFR decline and end-stage renal disease (ESRD) without pooling sensitive renal biopsy or lab records.', 'Nephrology', 87.8, 65, 4, 198000, 1.50, 'Gradient-Boosted Decision Trees (Federated SecureXGB) / MLP Hybrid', '0x1c9d...3e4a'),
('copd', 'COPD & Respiratory Exacerbation Risk', 'PneumoFed v2.1', 'Predicts acute respiratory exacerbations in COPD patients utilizing multi-center spirometry metrics and environmental risk factors.', 'Pulmonology', 85.6, 45, 4, 124000, 1.10, '3-Layer Feedforward Neural Network with Dropout (0.3)', '0x7e2b...5f0c'),
('oncology', 'Oncology Recurrence Risk (Breast/Colon)', 'OncoFed-Pro', 'Evaluates 3-year post-treatment solid tumor recurrence probability based on multi-omic biomarker panels and clinical history under strict differential privacy.', 'Oncology', 88.1, 110, 5, 245000, 0.65, 'DenseNet Tabular Architecture with Differential Privacy SGD', '0x9a4f...2d1b')
on conflict (id) do nothing;

-- 12. Helper for seeding demo auth users that can log in
create or replace function public.create_demo_auth_user(
  p_user_id uuid,
  p_email text,
  p_password text,
  p_full_name text,
  p_role text,
  p_institution text,
  p_department text,
  p_specialization text,
  p_country text,
  p_license text,
  p_phone text,
  p_bio text
)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_sent_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change
  ) values (
    '00000000-0000-0000-0000-000000000000',
    p_user_id,
    'authenticated',
    'authenticated',
    p_email,
    crypt(p_password, gen_salt('bf')),
    now(),
    now(),
    now(),
    now(),
    jsonb_build_object('provider','email','providers',array['email']),
    jsonb_build_object(
      'full_name', p_full_name,
      'role', p_role,
      'institution', p_institution,
      'department', p_department,
      'specialization', p_specialization,
      'country', p_country,
      'license_number', p_license,
      'phone', p_phone,
      'bio', p_bio
    ),
    now(),
    now(),
    '',
    '',
    '',
    ''
  )
  on conflict (id) do nothing;

  insert into auth.identities (
    id,
    provider,
    provider_id,
    user_id,
    identity_data,
    last_sign_in_at,
    created_at,
    updated_at
  ) values (
    p_user_id,
    'email',
    p_user_id::text,
    p_user_id,
    jsonb_build_object('sub', p_user_id::text, 'email', p_email),
    now(),
    now(),
    now()
  )
  on conflict (provider, provider_id) do nothing;

  insert into public.profiles (
    id, email, full_name, role, institution, phone, department, specialization, license_number, country, bio, last_login_at
  ) values (
    p_user_id, p_email, p_full_name, p_role, p_institution, p_phone, p_department, p_specialization, p_license, p_country, p_bio, now()
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = excluded.full_name,
    role = excluded.role,
    institution = excluded.institution,
    phone = excluded.phone,
    department = excluded.department,
    specialization = excluded.specialization,
    license_number = excluded.license_number,
    country = excluded.country,
    bio = excluded.bio,
    updated_at = now(),
    last_login_at = now();
end;
$$;

-- 13. Demo users (3 total)
-- Passwords:
-- admin@fedhealth.ai      / DemoAdmin123!
-- doctor@fedhealth.ai     / DemoDoctor123!
-- researcher@fedhealth.ai / DemoResearch123!
select public.create_demo_auth_user(
  '11111111-1111-1111-1111-111111111111',
  'admin@fedhealth.ai',
  'DemoAdmin123!',
  'Dr. Maya Reynolds',
  'admin',
  'FedHealth Central Admin',
  'Operations',
  'Federated Systems Administration',
  'USA',
  'ADMIN-2026-001',
  '+1-555-100-0001',
  'Platform administrator demo profile for FedHealth AI.'
);

select public.create_demo_auth_user(
  '22222222-2222-2222-2222-222222222222',
  'doctor@fedhealth.ai',
  'DemoDoctor123!',
  'Dr. Arjun Mehta',
  'doctor',
  'Metro General Hospital',
  'Cardiology',
  'Preventive Cardiology',
  'USA',
  'DOC-2026-204',
  '+1-555-100-0002',
  'Attending physician demo account focused on cardiovascular screening.'
);

select public.create_demo_auth_user(
  '33333333-3333-3333-3333-333333333333',
  'researcher@fedhealth.ai',
  'DemoResearch123!',
  'Dr. Sofia Alvarez',
  'researcher',
  'Apex Health Research Labs',
  'Endocrinology Research',
  'Metabolic Health AI',
  'USA',
  'RES-2026-330',
  '+1-555-100-0003',
  'Clinical researcher demo account for diabetes and federated model studies.'
);

-- 14. Seed sample login records for demo users
insert into public.login_records (id, user_id, email, institution, status, user_agent, login_time)
values
  ('login-demo-1', '11111111-1111-1111-1111-111111111111', 'admin@fedhealth.ai', 'FedHealth Central Admin', 'success', 'Demo Browser Agent', now() - interval '2 hours'),
  ('login-demo-2', '22222222-2222-2222-2222-222222222222', 'doctor@fedhealth.ai', 'Metro General Hospital', 'success', 'Demo Browser Agent', now() - interval '90 minutes'),
  ('login-demo-3', '33333333-3333-3333-3333-333333333333', 'researcher@fedhealth.ai', 'Apex Health Research Labs', 'success', 'Demo Browser Agent', now() - interval '45 minutes')
on conflict (id) do nothing;
`;
