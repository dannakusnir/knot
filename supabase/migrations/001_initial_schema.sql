-- KNOT Database Schema
-- Run this in the Supabase SQL Editor

-- ============================================
-- PROFILES (extends auth.users)
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('creator', 'business', 'admin')),
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles viewable by all authenticated" ON profiles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- CREATOR PROFILES
-- ============================================
CREATE TABLE creator_profiles (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  bio TEXT,
  instagram_handle TEXT,
  tiktok_handle TEXT,
  portfolio_url TEXT,
  portfolio_urls TEXT[] DEFAULT '{}',
  categories TEXT[] DEFAULT '{}',
  follower_count INTEGER DEFAULT 0,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  city TEXT,
  completion_rate NUMERIC(5,2) DEFAULT 0,
  avg_rating NUMERIC(3,2) DEFAULT 0,
  total_ratings INTEGER DEFAULT 0,
  total_knots INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  trust_score NUMERIC(5,2) DEFAULT 0,
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE creator_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creator profiles viewable by all authenticated" ON creator_profiles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Creator updates own" ON creator_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Creator inserts own" ON creator_profiles FOR INSERT WITH CHECK (auth.uid() = id);
-- Admin can update any creator profile
CREATE POLICY "Admin updates any creator" ON creator_profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- ============================================
-- BUSINESS PROFILES
-- ============================================
CREATE TABLE business_profiles (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  website TEXT,
  address TEXT,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  city TEXT,
  logo_url TEXT,
  avg_rating NUMERIC(3,2) DEFAULT 0,
  total_ratings INTEGER DEFAULT 0,
  total_knots INTEGER DEFAULT 0,
  guarantee_credits INTEGER DEFAULT 2,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Business profiles viewable by all authenticated" ON business_profiles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Business updates own" ON business_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Business inserts own" ON business_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- OFFERS
-- ============================================
CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES business_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  deliverables TEXT NOT NULL,
  compensation TEXT,
  usage_rights TEXT,
  deadline TIMESTAMPTZ,
  category TEXT,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  address TEXT,
  max_creators INTEGER DEFAULT 1,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'closed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active offers viewable by all authenticated" ON offers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Business manages own offers" ON offers FOR INSERT WITH CHECK (auth.uid() = business_id);
CREATE POLICY "Business updates own offers" ON offers FOR UPDATE USING (auth.uid() = business_id);
CREATE POLICY "Business deletes own offers" ON offers FOR DELETE USING (auth.uid() = business_id);
-- Admin can manage all offers
CREATE POLICY "Admin manages all offers" ON offers FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- ============================================
-- APPLICATIONS
-- ============================================
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id UUID NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(offer_id, creator_id)
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creator sees own applications" ON applications FOR SELECT USING (auth.uid() = creator_id);
CREATE POLICY "Business sees applications to own offers" ON applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM offers WHERE offers.id = applications.offer_id AND offers.business_id = auth.uid())
);
CREATE POLICY "Creator creates application" ON applications FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Business updates application status" ON applications FOR UPDATE USING (
  EXISTS (SELECT 1 FROM offers WHERE offers.id = applications.offer_id AND offers.business_id = auth.uid())
);
-- Admin can manage all applications
CREATE POLICY "Admin manages applications" ON applications FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- ============================================
-- KNOTS (collaborations)
-- ============================================
CREATE TABLE knots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id),
  offer_id UUID NOT NULL REFERENCES offers(id),
  creator_id UUID NOT NULL REFERENCES creator_profiles(id),
  business_id UUID NOT NULL REFERENCES business_profiles(id),
  status TEXT DEFAULT 'connected' CHECK (status IN (
    'connected', 'in_progress', 'proof_submitted', 'revision_requested', 'completed', 'cancelled'
  )),
  proof_urls TEXT[] DEFAULT '{}',
  proof_notes TEXT,
  deadline TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  is_guarantee_redo BOOLEAN DEFAULT false,
  admin_assigned BOOLEAN DEFAULT false,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE knots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants see own knots" ON knots FOR SELECT USING (
  auth.uid() = creator_id OR auth.uid() = business_id
);
CREATE POLICY "Participants update own knots" ON knots FOR UPDATE USING (
  auth.uid() = creator_id OR auth.uid() = business_id
);
CREATE POLICY "Admin manages all knots" ON knots FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- ============================================
-- RATINGS
-- ============================================
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  knot_id UUID NOT NULL REFERENCES knots(id) ON DELETE CASCADE,
  rater_id UUID NOT NULL REFERENCES profiles(id),
  rated_id UUID NOT NULL REFERENCES profiles(id),
  score INTEGER NOT NULL CHECK (score BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(knot_id, rater_id)
);

ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ratings viewable by all authenticated" ON ratings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Participant creates rating" ON ratings FOR INSERT WITH CHECK (auth.uid() = rater_id);

-- ============================================
-- NOTIFICATIONS
-- ============================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  knot_id UUID REFERENCES knots(id),
  offer_id UUID REFERENCES offers(id),
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System inserts notifications" ON notifications FOR INSERT WITH CHECK (true);

-- ============================================
-- TRIGGERS & FUNCTIONS
-- ============================================

-- Auto-create knot when application is approved
CREATE OR REPLACE FUNCTION handle_application_approved()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status = 'pending' THEN
    INSERT INTO knots (application_id, offer_id, creator_id, business_id, deadline)
    SELECT NEW.id, NEW.offer_id, NEW.creator_id, offers.business_id, offers.deadline
    FROM offers WHERE offers.id = NEW.offer_id;

    -- Create notification for creator
    INSERT INTO notifications (user_id, type, title, body, offer_id)
    VALUES (
      NEW.creator_id,
      'knot_connected',
      'You''re connected!',
      'Your application has been approved. Start working on your content!',
      NEW.offer_id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_application_approved
  AFTER UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION handle_application_approved();

-- Auto-update profile stats after rating
CREATE OR REPLACE FUNCTION update_profile_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update creator profile stats
  UPDATE creator_profiles SET
    avg_rating = COALESCE((SELECT AVG(score)::NUMERIC(3,2) FROM ratings WHERE rated_id = NEW.rated_id), 0),
    total_ratings = (SELECT COUNT(*) FROM ratings WHERE rated_id = NEW.rated_id)
  WHERE id = NEW.rated_id;

  -- Update business profile stats
  UPDATE business_profiles SET
    avg_rating = COALESCE((SELECT AVG(score)::NUMERIC(3,2) FROM ratings WHERE rated_id = NEW.rated_id), 0),
    total_ratings = (SELECT COUNT(*) FROM ratings WHERE rated_id = NEW.rated_id)
  WHERE id = NEW.rated_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_rating_created
  AFTER INSERT ON ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_stats();

-- Auto-verify creator after 3 completed knots
CREATE OR REPLACE FUNCTION check_creator_verification()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Update total knots for both sides
    UPDATE creator_profiles SET
      total_knots = (SELECT COUNT(*) FROM knots WHERE creator_id = NEW.creator_id AND status = 'completed')
    WHERE id = NEW.creator_id;

    UPDATE business_profiles SET
      total_knots = (SELECT COUNT(*) FROM knots WHERE business_id = NEW.business_id AND status = 'completed')
    WHERE id = NEW.business_id;

    -- Auto-verify creator after 3 completed knots
    UPDATE creator_profiles SET
      verified = true
    WHERE id = NEW.creator_id
      AND verified = false
      AND (SELECT COUNT(*) FROM knots WHERE creator_id = NEW.creator_id AND status = 'completed') >= 3;

    -- Update completion rate
    UPDATE creator_profiles SET
      completion_rate = (
        SELECT (COUNT(*) FILTER (WHERE status = 'completed'))::NUMERIC / GREATEST(COUNT(*), 1)
        FROM knots WHERE creator_id = NEW.creator_id AND status IN ('completed', 'cancelled')
      )
    WHERE id = NEW.creator_id;

    -- Update trust score
    UPDATE creator_profiles SET
      trust_score = (avg_rating * 0.6) + (completion_rate * 5 * 0.4)
    WHERE id = NEW.creator_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_knot_completed
  AFTER UPDATE ON knots
  FOR EACH ROW
  EXECUTE FUNCTION check_creator_verification();

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_offers_business_id ON offers(business_id);
CREATE INDEX idx_offers_status ON offers(status);
CREATE INDEX idx_applications_offer_id ON applications(offer_id);
CREATE INDEX idx_applications_creator_id ON applications(creator_id);
CREATE INDEX idx_knots_creator_id ON knots(creator_id);
CREATE INDEX idx_knots_business_id ON knots(business_id);
CREATE INDEX idx_knots_status ON knots(status);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, read);
