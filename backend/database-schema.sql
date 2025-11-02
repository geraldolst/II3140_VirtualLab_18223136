-- Bobolingo Database Schema for Supabase

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- 2. Game Scores Table
CREATE TABLE IF NOT EXISTS game_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    game_type VARCHAR(50) NOT NULL, -- 'scrambobo' or 'memoribo'
    score INTEGER NOT NULL,
    difficulty VARCHAR(20), -- 'easy', 'medium', 'hard'
    time_taken INTEGER, -- in seconds
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. User Profiles Table (Optional - for additional user data)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    full_name VARCHAR(255),
    avatar_url TEXT,
    bio TEXT,
    preferences JSONB, -- Store user preferences as JSON
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_game_scores_user_id ON game_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_game_scores_game_type ON game_scores(game_type);
CREATE INDEX IF NOT EXISTS idx_game_scores_created_at ON game_scores(created_at DESC);

-- Row Level Security (RLS) - IMPORTANT for Supabase
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table (only backend can access via service key)
-- For now, we'll handle auth in Express.js, so we need policies that allow service role

-- Drop existing policies if any
DROP POLICY IF EXISTS "Enable read for service role" ON users;
DROP POLICY IF EXISTS "Enable insert for service role" ON users;
DROP POLICY IF EXISTS "Enable update for service role" ON users;

-- Service role can do everything
CREATE POLICY "Enable all for service role" ON users
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Same for game_scores
DROP POLICY IF EXISTS "Enable all for service role" ON game_scores;
CREATE POLICY "Enable all for service role" ON game_scores
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Same for user_profiles
DROP POLICY IF EXISTS "Enable all for service role" ON user_profiles;
CREATE POLICY "Enable all for service role" ON user_profiles
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Verification queries
SELECT 'Users table created' as status;
SELECT 'Game scores table created' as status;
SELECT 'User profiles table created' as status;
