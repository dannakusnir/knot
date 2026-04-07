-- Messages table for knot chat
-- Run this in Supabase SQL Editor

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  knot_id UUID NOT NULL REFERENCES knots(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants see messages" ON messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM knots
    WHERE knots.id = messages.knot_id
    AND (knots.creator_id = auth.uid() OR knots.business_id = auth.uid())
  )
);

CREATE POLICY "Participants send messages" ON messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id
  AND EXISTS (
    SELECT 1 FROM knots
    WHERE knots.id = messages.knot_id
    AND (knots.creator_id = auth.uid() OR knots.business_id = auth.uid())
  )
);

CREATE POLICY "Admin sees all messages" ON messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

CREATE INDEX idx_messages_knot_id ON messages(knot_id);
CREATE INDEX idx_messages_created_at ON messages(knot_id, created_at);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
