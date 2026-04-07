-- ============================================
-- SEED DATA: Real offers from KNOT launch businesses
-- Run this AFTER creating business profiles for each business
-- Replace the business_id UUIDs with actual user IDs after signup
-- ============================================

-- MAMI CRESSKILL — Mediterranean Restaurant
-- (Replace 'MAMI_USER_ID' with actual UUID after business signs up)

-- INSERT INTO offers (business_id, title, description, deliverables, compensation, usage_rights, category, address, status) VALUES
-- ('MAMI_USER_ID', 'Coffee & Pastry for Two', 'Enjoy a coffee and pastry experience for two at Mami Cresskill. Share the vibe on your stories!', 'Instagram Stories', 'Coffee + pastry for two', 'Organic only', 'Restaurant', 'Cresskill, NJ', 'active'),
-- ('MAMI_USER_ID', 'Lunch / Brunch Date', 'A full lunch or brunch experience for two at Mami. Create stories and a Reel showcasing the food and atmosphere.', 'Instagram Reel', 'Lunch/brunch for two', 'Organic + Ads', 'Restaurant', 'Cresskill, NJ', 'active'),
-- ('MAMI_USER_ID', 'Dinner Experience', 'A dinner experience for two at Mami Cresskill. Create a Reel and stories capturing the full experience.', 'Instagram Reel', 'Dinner for two', 'Organic + Ads', 'Restaurant', 'Cresskill, NJ', 'active');

-- LIVELA SPA — Spring Valley
-- (Replace 'LIVELA_USER_ID' with actual UUID)

-- INSERT INTO offers (business_id, title, description, deliverables, compensation, usage_rights, category, address, status) VALUES
-- ('LIVELA_USER_ID', 'Brows, Lip & Nails Glow-Up', 'Get brows, lip wax, and gel manicure or pedicure at Livela Spa. Share the transformation in 3 stories.', 'Instagram Stories', 'Brows + lip wax + gel mani/pedi', 'Organic only', 'Salon & Spa', 'Spring Valley, NY', 'active'),
-- ('LIVELA_USER_ID', 'Facial Treatment Feature', 'Experience a premium facial treatment at Livela Spa. Create a Reel showing the process and 2 stories with your results.', 'Instagram Reel', 'Facial treatment', 'Organic + Ads', 'Salon & Spa', 'Spring Valley, NY', 'active'),
-- ('LIVELA_USER_ID', 'Laser Treatment Series', 'Full laser treatment series at Livela Spa. Create 2 Reels documenting the journey and stories at each visit (5 stories total).', 'Instagram Reel', 'Laser treatment series (multiple sessions)', 'Full usage rights', 'Salon & Spa', 'Spring Valley, NY', 'active');

-- SHAWARMA DELIGHT — Spring Valley
-- (Replace 'SHAWARMA_USER_ID' with actual UUID)

-- INSERT INTO offers (business_id, title, description, deliverables, compensation, usage_rights, category, address, status) VALUES
-- ('SHAWARMA_USER_ID', 'Solo Lunch Experience', 'Enjoy a lunch for one at Shawarma Delight. Share the experience in 3 stories showing the food and vibe.', 'Instagram Stories', 'Lunch for one', 'Organic only', 'Restaurant', 'Spring Valley, NY', 'active'),
-- ('SHAWARMA_USER_ID', 'Lunch Date Content', 'Lunch for two at Shawarma Delight. Create a Reel and 2 stories capturing the authentic shawarma experience.', 'Instagram Reel', 'Lunch for two', 'Organic + Ads', 'Restaurant', 'Spring Valley, NY', 'active'),
-- ('SHAWARMA_USER_ID', 'Family Feast Feature', 'A family meal (up to 5 people) at Shawarma Delight. Create a Reel and 6 stories showing the full family feast experience.', 'Instagram Reel', 'Family meal (up to 5 people)', 'Organic + Ads', 'Restaurant', 'Spring Valley, NY', 'active');

-- ============================================
-- HOW TO USE:
-- 1. Create a Supabase project
-- 2. Run 001_initial_schema.sql in SQL Editor
-- 3. Sign up the businesses through the app
-- 4. Copy their user IDs from the profiles table
-- 5. Uncomment and update the INSERT statements above
-- 6. Run this file in SQL Editor
-- ============================================
