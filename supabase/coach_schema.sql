-- ============================================================
-- ZWAR Personal Coach Schema
-- Run after schema.sql, social_schema.sql, marketplace_schema.sql
-- ============================================================

-- ── Extend Profiles for Coach Role ──
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_coach BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS coach_approved BOOLEAN DEFAULT false;

-- ============================================================
-- Table 1: coach_profiles
-- Public-facing coach information
-- ============================================================
CREATE TABLE IF NOT EXISTS coach_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL UNIQUE,
  bio TEXT DEFAULT '',
  specialties TEXT[] DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  experience_years INT DEFAULT 0,
  pricing_info TEXT DEFAULT '',
  max_clients INT DEFAULT 10,
  active_clients INT DEFAULT 0,
  accepting_clients BOOLEAN DEFAULT true,
  avg_rating NUMERIC(2,1) DEFAULT 0.0,
  rating_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_coach_profiles_user ON coach_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_coach_profiles_accepting ON coach_profiles(accepting_clients) WHERE accepting_clients = true;
CREATE INDEX IF NOT EXISTS idx_coach_profiles_rating ON coach_profiles(avg_rating DESC);

-- ============================================================
-- Table 2: coach_questionnaires
-- Coach's custom intake form template
-- ============================================================
CREATE TABLE IF NOT EXISTS coach_questionnaires (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID REFERENCES coach_profiles ON DELETE CASCADE NOT NULL,
  questions JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(coach_id)
);

-- questions JSONB format:
-- [
--   { "id": "goals", "type": "multi_select", "question": "What are your goals?", "options": ["Muscle gain", "Fat loss", "Strength", "Endurance", "General fitness"], "required": true },
--   { "id": "experience", "type": "single_select", "question": "Training experience?", "options": ["Beginner (<1yr)", "Intermediate (1-3yr)", "Advanced (3+yr)"], "required": true },
--   { "id": "days", "type": "number", "question": "How many days per week can you train?", "min": 1, "max": 7, "required": true },
--   { "id": "equipment", "type": "multi_select", "question": "Available equipment?", "options": ["Full gym", "Home dumbbells", "Bodyweight only", "Resistance bands"], "required": true },
--   { "id": "injuries", "type": "text", "question": "Any injuries or limitations?", "required": false }
-- ]

CREATE INDEX IF NOT EXISTS idx_coach_questionnaires_coach ON coach_questionnaires(coach_id);

-- ============================================================
-- Table 3: coach_clients
-- Relationship between coach and client
-- ============================================================
CREATE TABLE IF NOT EXISTS coach_clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID REFERENCES coach_profiles ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'questionnaire_sent', 'questionnaire_completed', 'active', 'paused', 'ended')),
  questionnaire_answers JSONB,
  assigned_program_id TEXT,
  notes TEXT DEFAULT '',
  started_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(coach_id, client_id)
);

CREATE INDEX IF NOT EXISTS idx_coach_clients_coach ON coach_clients(coach_id);
CREATE INDEX IF NOT EXISTS idx_coach_clients_client ON coach_clients(client_id);
CREATE INDEX IF NOT EXISTS idx_coach_clients_status ON coach_clients(status);

-- ============================================================
-- Table 4: coach_messages
-- In-app chat between coach and client
-- ============================================================
CREATE TABLE IF NOT EXISTS coach_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  relationship_id UUID REFERENCES coach_clients ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text'
    CHECK (message_type IN ('text', 'system', 'program_update', 'image')),
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_coach_messages_relationship ON coach_messages(relationship_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_coach_messages_unread ON coach_messages(relationship_id) WHERE read = false;

-- ============================================================
-- Table 5: coach_ratings
-- Client reviews of coaches
-- ============================================================
CREATE TABLE IF NOT EXISTS coach_ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID REFERENCES coach_profiles ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(coach_id, client_id)
);

CREATE INDEX IF NOT EXISTS idx_coach_ratings_coach ON coach_ratings(coach_id);

-- ============================================================
-- RLS Policies
-- ============================================================
ALTER TABLE coach_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_ratings ENABLE ROW LEVEL SECURITY;

-- coach_profiles: publicly readable, only coach can manage own
CREATE POLICY "Anyone can view coach profiles" ON coach_profiles
  FOR SELECT USING (true);
CREATE POLICY "Coaches can insert own profile" ON coach_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Coaches can update own profile" ON coach_profiles
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Coaches can delete own profile" ON coach_profiles
  FOR DELETE USING (auth.uid() = user_id);

-- coach_questionnaires: coach manages, assigned clients can view
CREATE POLICY "Coach can manage own questionnaire" ON coach_questionnaires
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM coach_profiles cp
      WHERE cp.id = coach_questionnaires.coach_id
        AND cp.user_id = auth.uid()
    )
  );
CREATE POLICY "Clients can view coach questionnaire" ON coach_questionnaires
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM coach_clients cc
      WHERE cc.coach_id = coach_questionnaires.coach_id
        AND cc.client_id = auth.uid()
    )
  );

-- coach_clients: visible to both coach and client
CREATE POLICY "Coach can view own clients" ON coach_clients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM coach_profiles cp
      WHERE cp.id = coach_clients.coach_id
        AND cp.user_id = auth.uid()
    )
  );
CREATE POLICY "Client can view own coaching" ON coach_clients
  FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "Client can request coaching" ON coach_clients
  FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Coach can update client status" ON coach_clients
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM coach_profiles cp
      WHERE cp.id = coach_clients.coach_id
        AND cp.user_id = auth.uid()
    )
  );
CREATE POLICY "Client can update own answers" ON coach_clients
  FOR UPDATE USING (auth.uid() = client_id);

-- coach_messages: visible to both parties in the relationship
CREATE POLICY "Participants can view messages" ON coach_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM coach_clients cc
      WHERE cc.id = coach_messages.relationship_id
        AND (cc.client_id = auth.uid() OR EXISTS (
          SELECT 1 FROM coach_profiles cp
          WHERE cp.id = cc.coach_id AND cp.user_id = auth.uid()
        ))
    )
  );
CREATE POLICY "Participants can send messages" ON coach_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM coach_clients cc
      WHERE cc.id = coach_messages.relationship_id
        AND (cc.client_id = auth.uid() OR EXISTS (
          SELECT 1 FROM coach_profiles cp
          WHERE cp.id = cc.coach_id AND cp.user_id = auth.uid()
        ))
    )
  );
CREATE POLICY "Recipients can mark messages read" ON coach_messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM coach_clients cc
      WHERE cc.id = coach_messages.relationship_id
        AND (cc.client_id = auth.uid() OR EXISTS (
          SELECT 1 FROM coach_profiles cp
          WHERE cp.id = cc.coach_id AND cp.user_id = auth.uid()
        ))
    )
  );

-- coach_ratings: publicly readable, only clients can create
CREATE POLICY "Anyone can view coach ratings" ON coach_ratings
  FOR SELECT USING (true);
CREATE POLICY "Clients can rate coaches" ON coach_ratings
  FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Clients can update own rating" ON coach_ratings
  FOR UPDATE USING (auth.uid() = client_id);
CREATE POLICY "Clients can delete own rating" ON coach_ratings
  FOR DELETE USING (auth.uid() = client_id);

-- ============================================================
-- Trigger: auto-update active_clients count
-- ============================================================
CREATE OR REPLACE FUNCTION update_active_clients_count()
RETURNS TRIGGER AS $$
DECLARE
  target_coach_id UUID;
BEGIN
  target_coach_id := COALESCE(NEW.coach_id, OLD.coach_id);
  UPDATE coach_profiles SET
    active_clients = (
      SELECT COUNT(*) FROM coach_clients
      WHERE coach_id = target_coach_id AND status IN ('active', 'questionnaire_sent', 'questionnaire_completed')
    )
  WHERE id = target_coach_id;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER trg_active_clients
  AFTER INSERT OR UPDATE OR DELETE ON coach_clients
  FOR EACH ROW EXECUTE FUNCTION update_active_clients_count();

-- ============================================================
-- Trigger: auto-update coach avg_rating
-- ============================================================
CREATE OR REPLACE FUNCTION update_coach_avg_rating()
RETURNS TRIGGER AS $$
DECLARE
  target_id UUID;
BEGIN
  target_id := COALESCE(NEW.coach_id, OLD.coach_id);
  UPDATE coach_profiles SET
    avg_rating = COALESCE((SELECT AVG(rating)::NUMERIC(2,1) FROM coach_ratings WHERE coach_id = target_id), 0),
    rating_count = (SELECT COUNT(*) FROM coach_ratings WHERE coach_id = target_id)
  WHERE id = target_id;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER trg_coach_rating
  AFTER INSERT OR UPDATE OR DELETE ON coach_ratings
  FOR EACH ROW EXECUTE FUNCTION update_coach_avg_rating();

-- ============================================================
-- Enable Realtime for coach_messages (for live chat)
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE coach_messages;
