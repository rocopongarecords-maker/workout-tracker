-- ============================================================
-- ZWAR Program Marketplace Schema
-- Run after schema.sql and social_schema.sql
-- ============================================================

-- ============================================================
-- Table 1: marketplace_programs
-- ============================================================
CREATE TABLE IF NOT EXISTS marketplace_programs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  program_data JSONB NOT NULL,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT DEFAULT 'general'
    CHECK (category IN ('hypertrophy','strength','endurance','hyrox','general','bodyweight','powerlifting')),
  difficulty TEXT DEFAULT 'intermediate'
    CHECK (difficulty IN ('beginner','intermediate','advanced')),
  visibility TEXT DEFAULT 'public'
    CHECK (visibility IN ('public','invite_only','private')),
  weeks INT NOT NULL DEFAULT 8,
  days_per_week INT NOT NULL DEFAULT 4,
  subscriber_count INT DEFAULT 0,
  avg_rating NUMERIC(2,1) DEFAULT 0.0,
  rating_count INT DEFAULT 0,
  is_builtin BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mp_author ON marketplace_programs(author_id);
CREATE INDEX IF NOT EXISTS idx_mp_visibility ON marketplace_programs(visibility);
CREATE INDEX IF NOT EXISTS idx_mp_category ON marketplace_programs(category);
CREATE INDEX IF NOT EXISTS idx_mp_subscribers ON marketplace_programs(subscriber_count DESC);

-- ============================================================
-- Table 2: program_subscriptions
-- ============================================================
CREATE TABLE IF NOT EXISTS program_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  program_id UUID REFERENCES marketplace_programs ON DELETE CASCADE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(user_id, program_id)
);

CREATE INDEX IF NOT EXISTS idx_ps_user ON program_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_ps_program ON program_subscriptions(program_id);

-- ============================================================
-- Table 3: program_ratings
-- ============================================================
CREATE TABLE IF NOT EXISTS program_ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  program_id UUID REFERENCES marketplace_programs ON DELETE CASCADE NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, program_id)
);

CREATE INDEX IF NOT EXISTS idx_pr_program ON program_ratings(program_id);

-- ============================================================
-- Table 4: program_invites
-- ============================================================
CREATE TABLE IF NOT EXISTS program_invites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id UUID REFERENCES marketplace_programs ON DELETE CASCADE NOT NULL,
  created_by UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(12), 'hex'),
  uses INT DEFAULT 0,
  max_uses INT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pi_token ON program_invites(token);

-- ============================================================
-- Table 5: program_feed
-- ============================================================
CREATE TABLE IF NOT EXISTS program_feed (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id UUID REFERENCES marketplace_programs ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pf_program ON program_feed(program_id, created_at DESC);

-- ============================================================
-- RLS Policies
-- ============================================================
ALTER TABLE marketplace_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_feed ENABLE ROW LEVEL SECURITY;

-- marketplace_programs
CREATE POLICY "Anyone can view public programs" ON marketplace_programs
  FOR SELECT USING (
    visibility = 'public'
    OR author_id = auth.uid()
    OR (visibility = 'invite_only' AND EXISTS (
      SELECT 1 FROM program_subscriptions
      WHERE program_subscriptions.program_id = marketplace_programs.id
        AND program_subscriptions.user_id = auth.uid()
    ))
  );
CREATE POLICY "Authors can insert programs" ON marketplace_programs
  FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own programs" ON marketplace_programs
  FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors can delete own programs" ON marketplace_programs
  FOR DELETE USING (auth.uid() = author_id);

-- program_subscriptions
CREATE POLICY "Users can view own subs or authors can view theirs" ON program_subscriptions
  FOR SELECT USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM marketplace_programs
      WHERE marketplace_programs.id = program_subscriptions.program_id
        AND marketplace_programs.author_id = auth.uid()
    )
  );
CREATE POLICY "Users can subscribe" ON program_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unsubscribe" ON program_subscriptions
  FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can update own sub" ON program_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- program_ratings
CREATE POLICY "Anyone can view ratings" ON program_ratings
  FOR SELECT USING (true);
CREATE POLICY "Users can rate" ON program_ratings
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own rating" ON program_ratings
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own rating" ON program_ratings
  FOR DELETE USING (auth.uid() = user_id);

-- program_invites
CREATE POLICY "Authors can manage invites" ON program_invites
  FOR ALL USING (auth.uid() = created_by);
CREATE POLICY "Anyone can look up invite by token" ON program_invites
  FOR SELECT USING (true);

-- program_feed
CREATE POLICY "Subscribers and author can view feed" ON program_feed
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM marketplace_programs mp
      WHERE mp.id = program_feed.program_id
        AND (mp.author_id = auth.uid() OR EXISTS (
          SELECT 1 FROM program_subscriptions ps
          WHERE ps.program_id = mp.id AND ps.user_id = auth.uid()
        ))
    )
  );
CREATE POLICY "Subscribers and author can post" ON program_feed
  FOR INSERT WITH CHECK (
    auth.uid() = author_id
    AND EXISTS (
      SELECT 1 FROM marketplace_programs mp
      WHERE mp.id = program_feed.program_id
        AND (mp.author_id = auth.uid() OR EXISTS (
          SELECT 1 FROM program_subscriptions ps
          WHERE ps.program_id = mp.id AND ps.user_id = auth.uid()
        ))
    )
  );

-- ============================================================
-- Trigger: auto-update subscriber_count
-- ============================================================
CREATE OR REPLACE FUNCTION update_subscriber_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE marketplace_programs SET subscriber_count = subscriber_count + 1
    WHERE id = NEW.program_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE marketplace_programs SET subscriber_count = subscriber_count - 1
    WHERE id = OLD.program_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER trg_subscription_count
  AFTER INSERT OR DELETE ON program_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_subscriber_count();

-- ============================================================
-- Trigger: auto-update avg_rating and rating_count
-- ============================================================
CREATE OR REPLACE FUNCTION update_avg_rating()
RETURNS TRIGGER AS $$
DECLARE
  target_id UUID;
BEGIN
  target_id := COALESCE(NEW.program_id, OLD.program_id);
  UPDATE marketplace_programs SET
    avg_rating = COALESCE((SELECT AVG(rating)::NUMERIC(2,1) FROM program_ratings WHERE program_id = target_id), 0),
    rating_count = (SELECT COUNT(*) FROM program_ratings WHERE program_id = target_id)
  WHERE id = target_id;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER trg_rating_update
  AFTER INSERT OR UPDATE OR DELETE ON program_ratings
  FOR EACH ROW EXECUTE FUNCTION update_avg_rating();
