-- Activity Feed & League System Schema Migration
-- Run this in Supabase SQL Editor AFTER social_schema.sql

-- ── Activity Feed ──
-- Stores social activity events (workouts, PRs, badges, streaks, promotions)
CREATE TABLE IF NOT EXISTS activity_feed (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('workout_completed', 'pr_set', 'badge_earned', 'streak_milestone', 'league_promotion')),
  payload JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_feed_user ON activity_feed (user_id);
CREATE INDEX IF NOT EXISTS idx_activity_feed_created ON activity_feed (created_at DESC);

-- ── League Members ──
-- Tracks user league tier and weekly XP for competitive system
CREATE TABLE IF NOT EXISTS league_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL UNIQUE,
  league TEXT NOT NULL DEFAULT 'bronze' CHECK (league IN ('bronze', 'silver', 'gold', 'platinum', 'diamond')),
  weekly_xp INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_league_members_league ON league_members (league);
CREATE INDEX IF NOT EXISTS idx_league_members_xp ON league_members (league, weekly_xp DESC);

-- ── Row Level Security ──

ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE league_members ENABLE ROW LEVEL SECURITY;

-- Activity feed: users can insert own, can view all (friends filtering done in app)
CREATE POLICY "Users can view all activities"
  ON activity_feed FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own activities"
  ON activity_feed FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- League members: anyone can view (for leaderboards), users manage own
CREATE POLICY "Anyone can view league members"
  ON league_members FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own league membership"
  ON league_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own league membership"
  ON league_members FOR UPDATE
  USING (auth.uid() = user_id);
