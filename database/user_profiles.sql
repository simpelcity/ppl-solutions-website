-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    profile_picture TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optional: Index for quick lookup
CREATE INDEX IF NOT EXISTS idx_user_profiles_id ON user_profiles(id);
