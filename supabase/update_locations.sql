-- Update business profile locations
-- Run this in Supabase SQL Editor

-- Mami Cresskill — 15 E Madison Ave, Cresskill, NJ 07626
UPDATE business_profiles SET
  location_lat = 40.9414,
  location_lng = -73.9596,
  city = 'Cresskill, NJ',
  address = '15 E Madison Ave, Cresskill, NJ 07626'
WHERE business_name ILIKE '%mami%';

-- Shawarma Delight — 26 Spring Valley Market Pl, Spring Valley, NY 10977
UPDATE business_profiles SET
  location_lat = 41.1130,
  location_lng = -74.0490,
  city = 'Spring Valley, NY',
  address = '26 Spring Valley Market Pl, Spring Valley, NY 10977'
WHERE business_name ILIKE '%shawarma%';

-- Livela Beauty — Spring Valley Marketplace, Spring Valley, NY 10977
UPDATE business_profiles SET
  location_lat = 41.1130,
  location_lng = -74.0490,
  city = 'Spring Valley, NY',
  address = 'Spring Valley Marketplace, Spring Valley, NY 10977'
WHERE business_name ILIKE '%livela%';

-- Also update offers with business locations
UPDATE offers SET
  location_lat = bp.location_lat,
  location_lng = bp.location_lng,
  address = bp.address
FROM business_profiles bp
WHERE offers.business_id = bp.id
  AND bp.location_lat IS NOT NULL;
