-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    profile_picture TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optional: Index for quick lookup
CREATE INDEX IF NOT EXISTS idx_user_profiles_id ON user_profiles(id);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Any authenticated user can read public profile data
CREATE POLICY "Authenticated users can read profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Users can only insert their own profile row
CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Users can only update their own profile; admins can update any
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id
    OR (auth.jwt() ->> 'is_admin')::boolean IS TRUE
  )
  WITH CHECK (
    auth.uid() = id
    OR (auth.jwt() ->> 'is_admin')::boolean IS TRUE
  );

-- Users can only delete their own profile; admins can delete any
CREATE POLICY "Users can delete own profile"
  ON user_profiles
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() = id
    OR (auth.jwt() ->> 'is_admin')::boolean IS TRUE
  );
