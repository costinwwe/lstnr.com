-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  banner_url TEXT,
  bio TEXT,
  pronouns TEXT,
  profile_links JSONB DEFAULT '[]'::jsonb,
  profile_data JSONB,
  stats JSONB,
  favorites JSONB,
  recently_played JSONB DEFAULT '[]'::jsonb,
  currently_playing JSONB,
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile"
ON profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
ON profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- favorites JSON shape:
-- {
--   "tracks": [],
--   "albums": [],
--   "artists": [],
--   "genres": [],
--   "playlists": [],
--   "following": []
-- }
