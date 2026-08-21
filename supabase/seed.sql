-- =============================================
-- Inner Circle — Seed Data for Development
-- =============================================
-- NOTE: You must first create these users in Supabase Auth (Dashboard > Auth > Users)
-- with the emails/passwords below, then copy their UUIDs here.
--
-- Test accounts:
--   test1@innercircle.dev / password123  → Ali
--   test2@innercircle.dev / password123  → Sarah
--   test3@innercircle.dev / password123  → Marcus
--   admin@innercircle.dev / password123  → Yemi (admin)
--
-- After creating users in Auth, replace the UUIDs below:

-- Placeholder UUIDs (replace with real auth.users UUIDs)
-- Ali
INSERT INTO profiles (id, name, bio, city, school, photo_url, motive, specific_interests, interests, age)
 VALUES (
   '0b64d637-beb0-4f5f-bab0-9cf4e0593b84',
   'Ali', 
   'Building things and playing chess. Always looking for a good game.',
   'London', '', 
   'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&auto=format',
   'Meeting like-minded builders',
   'Rust, Blockchain, Distributed Systems',
   ARRAY['chess', 'coding', 'technology', 'gaming', 'startups'],
   22
 ) ON CONFLICT (id) DO NOTHING;

-- Sarah
INSERT INTO profiles (id, name, bio, city, school, photo_url, specific_interests, interests, age)
 VALUES (
   'ed646969-9a9d-49bd-911c-fbc9e4aa0669',
   'Sarah',
   'Street photographer chasing light. Film camera enthusiast.',
   'New York', '',
   'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop&auto=format',
   'Street Photography, Film cameras, Jazz, Indie cinema',
   ARRAY['photography', 'film', 'music', 'books', 'art'],
   25
 ) ON CONFLICT (id) DO NOTHING;

-- Marcus
 INSERT INTO profiles (id, name, bio, city, school, photo_url, specific_interests, interests, age)
 VALUES (
   'bfd98f03-1292-4377-83bb-e652af7428d5',
   'Marcus',
   'Full-stack dev by day, Rust evangelist by night. Obsessed with systems programming.',
   'Berlin', '',
   'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=800&fit=crop&auto=format',
   'Solidity, Fullstack',
   ARRAY['coding', 'technology', 'robotics', 'chess'],
   28
 ) ON CONFLICT (id) DO NOTHING;

-- Yemi (admin)
 INSERT INTO profiles (id, name, bio, city, school, photo_url, motive, specific_interests, interests, age)
 VALUES (
   'e7b93d1d-bd82-4349-9c37-f0396418a832',
   'Yemi',
   'Building the next big thing from Lagos. Startup founder, music producer on weekends.',
   'Lagos', '',
   'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=600&h=800&fit=crop&auto=format',
   'Networking and finding co-founders',
   'Music production, React Native',
   ARRAY['startups', 'music', 'technology', 'coding', 'fitness'],
   24
 ) ON CONFLICT (id) DO NOTHING;

-- Sample connection (Ali -> Sarah, pending)
-- INSERT INTO connections (sender_id, receiver_id, status)
-- VALUES ('REPLACE_WITH_ALI_UUID', 'REPLACE_WITH_Sarah_UUID', 'pending');

-- Sample notification for Sarah
-- INSERT INTO notifications (user_id, type, text, avatar_url)
-- VALUES (
--   'REPLACE_WITH_Sarah_UUID',
--   'connection',
--   'Ali sent you a connection request',
--   'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format'
-- );
