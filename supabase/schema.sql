-- Workout Tracker Database Schema
-- Run this in Supabase SQL Editor to set up the database

-- ── Profiles ──
-- Extends Supabase auth.users with app-specific data
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  start_date timestamptz,
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Workout Data ──
-- Stores the full workout state (replaces localStorage workoutHistory)
create table if not exists workout_data (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  day_number integer not null,
  workout_type text not null,
  block integer not null,
  exercises jsonb not null default '[]',
  completed boolean default false,
  date timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, day_number)
);

-- ── Weight Log ──
create table if not exists weight_log (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  date timestamptz not null,
  weight_kg numeric(5,1) not null,
  created_at timestamptz default now()
);

-- ── Skinfold Log ──
create table if not exists skinfold_log (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  date timestamptz not null,
  protocol text not null,
  sex text not null,
  age integer not null,
  sites jsonb not null,
  bf_percent numeric(4,1) not null,
  created_at timestamptz default now()
);

-- ── Earned Badges ──
create table if not exists earned_badges (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  badge_id text not null,
  earned_at timestamptz default now(),
  unique(user_id, badge_id)
);

-- ── User Stats ──
-- Denormalized stats for quick reads
create table if not exists user_stats (
  user_id uuid references auth.users on delete cascade primary key,
  total_prs integer default 0,
  updated_at timestamptz default now()
);

-- ── Row Level Security ──
-- Users can only access their own data

alter table profiles enable row level security;
alter table workout_data enable row level security;
alter table weight_log enable row level security;
alter table skinfold_log enable row level security;
alter table earned_badges enable row level security;
alter table user_stats enable row level security;

-- Profiles
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

-- Workout data
create policy "Users can view own workouts" on workout_data
  for select using (auth.uid() = user_id);
create policy "Users can insert own workouts" on workout_data
  for insert with check (auth.uid() = user_id);
create policy "Users can update own workouts" on workout_data
  for update using (auth.uid() = user_id);
create policy "Users can delete own workouts" on workout_data
  for delete using (auth.uid() = user_id);

-- Weight log
create policy "Users can view own weight log" on weight_log
  for select using (auth.uid() = user_id);
create policy "Users can insert own weight log" on weight_log
  for insert with check (auth.uid() = user_id);

-- Skinfold log
create policy "Users can view own skinfold log" on skinfold_log
  for select using (auth.uid() = user_id);
create policy "Users can insert own skinfold log" on skinfold_log
  for insert with check (auth.uid() = user_id);

-- Earned badges
create policy "Users can view own badges" on earned_badges
  for select using (auth.uid() = user_id);
create policy "Users can insert own badges" on earned_badges
  for insert with check (auth.uid() = user_id);

-- User stats
create policy "Users can view own stats" on user_stats
  for select using (auth.uid() = user_id);
create policy "Users can upsert own stats" on user_stats
  for insert with check (auth.uid() = user_id);
create policy "Users can update own stats" on user_stats
  for update using (auth.uid() = user_id);

-- ── Indexes ──
create index if not exists idx_workout_data_user on workout_data(user_id);
create index if not exists idx_workout_data_user_day on workout_data(user_id, day_number);
create index if not exists idx_weight_log_user on weight_log(user_id, date desc);
create index if not exists idx_skinfold_log_user on skinfold_log(user_id, date desc);
create index if not exists idx_earned_badges_user on earned_badges(user_id);
