/*
# OfflineLearn — profiles, attempts, progress

Multi-user app with Supabase email/password auth. Each user sees only their own rows.

1. New Tables
- `profiles`: one row per user, stores display name and demo flags.
  - id (uuid, PK, references auth.users)
  - display_name (text)
  - is_demo (boolean, default false)
  - created_at (timestamptz)
- `attempts`: quiz/practice attempts synced from the device.
  - id (uuid, PK)
  - user_id (uuid, NOT NULL, default auth.uid(), references auth.users)
  - topic (text)
  - score_percent (integer)
  - correct (integer)
  - total (integer)
  - attempt_no (integer)
  - client_id (text, unique — used to de-duplicate offline syncs)
  - created_at (timestamptz, default now())
- `progress`: per-topic progress for a user.
  - user_id (uuid, references auth.users)
  - topic (text)
  - completed_lessons (integer, default 0)
  - best_score (integer, default 0)
  - last_score (integer, default 0)
  - status (text, default 'not-started')
  - updated_at (timestamptz, default now())
  - Primary key (user_id, topic)

2. Security
- RLS enabled on all three tables.
- Owner-scoped CRUD policies (SELECT/INSERT/UPDATE/DELETE) for authenticated users.
- `user_id` columns default to auth.uid() so client inserts that omit user_id succeed.
- client_id unique constraint enables idempotent sync (de-duplication).
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT 'Student',
  is_demo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile" ON profiles
  FOR DELETE TO authenticated USING (auth.uid() = id);


CREATE TABLE IF NOT EXISTS attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  topic text NOT NULL,
  score_percent integer NOT NULL DEFAULT 0,
  correct integer NOT NULL DEFAULT 0,
  total integer NOT NULL DEFAULT 0,
  attempt_no integer NOT NULL DEFAULT 1,
  client_id text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS attempts_user_id_idx ON attempts(user_id);
CREATE INDEX IF NOT EXISTS attempts_user_topic_idx ON attempts(user_id, topic);

ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_attempts" ON attempts;
CREATE POLICY "select_own_attempts" ON attempts
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_attempts" ON attempts;
CREATE POLICY "insert_own_attempts" ON attempts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_attempts" ON attempts;
CREATE POLICY "update_own_attempts" ON attempts
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_attempts" ON attempts;
CREATE POLICY "delete_own_attempts" ON attempts
  FOR DELETE TO authenticated USING (auth.uid() = user_id);


CREATE TABLE IF NOT EXISTS progress (
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  topic text NOT NULL,
  completed_lessons integer NOT NULL DEFAULT 0,
  best_score integer NOT NULL DEFAULT 0,
  last_score integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'not-started',
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, topic)
);

ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_progress" ON progress;
CREATE POLICY "select_own_progress" ON progress
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_progress" ON progress;
CREATE POLICY "insert_own_progress" ON progress
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_progress" ON progress;
CREATE POLICY "update_own_progress" ON progress
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_progress" ON progress;
CREATE POLICY "delete_own_progress" ON progress
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
