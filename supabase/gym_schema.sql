-- Gym & Location System Schema Migration
-- Run this in Supabase SQL Editor AFTER social_schema.sql

-- ── Gyms ──
-- Public gym directory with equipment and location data
CREATE TABLE IF NOT EXISTS gyms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  chain TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  equipment JSONB DEFAULT '[]'::jsonb,
  amenities JSONB DEFAULT '[]'::jsonb,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for location-based queries
CREATE INDEX IF NOT EXISTS idx_gyms_city ON gyms (city);
CREATE INDEX IF NOT EXISTS idx_gyms_chain ON gyms (chain);

-- ── User Gyms ──
-- Tracks which gyms a user has saved and their home gym
CREATE TABLE IF NOT EXISTS user_gyms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  gym_id UUID REFERENCES gyms ON DELETE CASCADE NOT NULL,
  is_home_gym BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, gym_id)
);

-- Ensure only one home gym per user
CREATE OR REPLACE FUNCTION ensure_single_home_gym()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_home_gym = true THEN
    UPDATE user_gyms
    SET is_home_gym = false
    WHERE user_id = NEW.user_id AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER single_home_gym_trigger
  AFTER INSERT OR UPDATE ON user_gyms
  FOR EACH ROW EXECUTE FUNCTION ensure_single_home_gym();

-- ── Gym Check-ins ──
-- Records when a user checks in at a gym, with optional location verification
CREATE TABLE IF NOT EXISTS gym_checkins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  gym_id UUID REFERENCES gyms ON DELETE CASCADE NOT NULL,
  workout_day INTEGER,
  verified BOOLEAN DEFAULT false,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_checkins_user ON gym_checkins (user_id);
CREATE INDEX IF NOT EXISTS idx_checkins_gym ON gym_checkins (gym_id);
CREATE INDEX IF NOT EXISTS idx_checkins_date ON gym_checkins (created_at);

-- ── Row Level Security ──

ALTER TABLE gyms ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_gyms ENABLE ROW LEVEL SECURITY;
ALTER TABLE gym_checkins ENABLE ROW LEVEL SECURITY;

-- Gyms: anyone can view, only service role can insert/update
CREATE POLICY "Anyone can view gyms"
  ON gyms FOR SELECT
  USING (true);

-- User gyms: users manage their own
CREATE POLICY "Users can view own gym associations"
  ON user_gyms FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own gym associations"
  ON user_gyms FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own gym associations"
  ON user_gyms FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own gym associations"
  ON user_gyms FOR DELETE
  USING (auth.uid() = user_id);

-- Check-ins: users can manage own, can view all (for leaderboards)
CREATE POLICY "Anyone can view check-ins"
  ON gym_checkins FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own check-ins"
  ON gym_checkins FOR INSERT
  WITH CHECK (auth.uid() = user_id);
