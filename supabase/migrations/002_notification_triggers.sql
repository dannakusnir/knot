-- ============================================
-- NOTIFICATION TRIGGERS
-- Run this in Supabase SQL Editor
-- ============================================

-- Notify business when a creator applies to their offer
CREATE OR REPLACE FUNCTION notify_new_application()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (user_id, type, title, body, offer_id)
  SELECT
    offers.business_id,
    'new_application',
    'New application received',
    'A creator applied to your offer "' || offers.title || '"',
    NEW.offer_id
  FROM offers WHERE offers.id = NEW.offer_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_new_application
  AFTER INSERT ON applications
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_application();

-- Notify business when creator submits proof
CREATE OR REPLACE FUNCTION notify_proof_submitted()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'proof_submitted' AND OLD.status != 'proof_submitted' THEN
    INSERT INTO notifications (user_id, type, title, body, knot_id)
    VALUES (
      NEW.business_id,
      'proof_submitted',
      'Proof submitted — ready for review',
      'Your creator submitted proof for review. Tap to check it out.',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_proof_submitted
  AFTER UPDATE ON knots
  FOR EACH ROW
  EXECUTE FUNCTION notify_proof_submitted();

-- Notify creator when business requests revision
CREATE OR REPLACE FUNCTION notify_revision_requested()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'revision_requested' AND OLD.status != 'revision_requested' THEN
    INSERT INTO notifications (user_id, type, title, body, knot_id)
    VALUES (
      NEW.creator_id,
      'revision_requested',
      'Revision requested',
      'The business requested changes to your content. Check the notes and resubmit.',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_revision_requested
  AFTER UPDATE ON knots
  FOR EACH ROW
  EXECUTE FUNCTION notify_revision_requested();

-- Notify creator when knot is completed
CREATE OR REPLACE FUNCTION notify_knot_completed()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    INSERT INTO notifications (user_id, type, title, body, knot_id)
    VALUES (
      NEW.creator_id,
      'knot_completed',
      'Knot completed!',
      'Your content was approved. Great work! Don''t forget to rate the business.',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_knot_completed
  AFTER UPDATE ON knots
  FOR EACH ROW
  EXECUTE FUNCTION notify_knot_completed();
